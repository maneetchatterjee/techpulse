'use client';

import { useState } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import RadialGauge from '@/components/RadialGauge';
import DataTable, { Column } from '@/components/DataTable';
import { useArxivPapers } from '@/hooks/useArxivPapers';
import { useHuggingFace } from '@/hooks/useHuggingFace';
import { aiModels, AIModel, benchmarkDefinitions } from '@/lib/aiBenchmarks';
import { gpuData, GPU } from '@/lib/gpuData';

const BENCH_COLORS = ['#00FFFF', '#00FF88', '#a78bfa', '#fb923c', '#4ade80'];

const AI_TIMELINE = [
  { year: '2017', event: 'Transformer Architecture', desc: '"Attention Is All You Need" — Vaswani et al.', isOpen: true },
  { year: '2018', event: 'BERT', desc: 'Bidirectional pre-training for NLP — Google', isOpen: true },
  { year: '2019', event: 'GPT-2', desc: 'Too dangerous to release (originally). OpenAI.', isOpen: false },
  { year: '2020', event: 'GPT-3', desc: '175B parameters, few-shot learning breakthrough', isOpen: false },
  { year: '2021', event: 'DALL-E', desc: 'Text-to-image generation at scale — OpenAI', isOpen: false },
  { year: '2022', event: 'ChatGPT Launch', desc: '1M users in 5 days. AI enters mainstream.', isOpen: false },
  { year: '2022', event: 'Stable Diffusion', desc: 'Open-source text-to-image model', isOpen: true },
  { year: '2023', event: 'GPT-4', desc: 'Multimodal, near-human expert performance', isOpen: false },
  { year: '2023', event: 'Llama 2', desc: 'Meta\'s open-weight model ignites open-source AI', isOpen: true },
  { year: '2024', event: 'Claude 3.5 Sonnet', desc: 'Sets new SOTA on coding benchmarks', isOpen: false },
  { year: '2024', event: 'DeepSeek V3', desc: 'Open-source model matches frontier closed models', isOpen: true },
  { year: '2025', event: 'Reasoning Models Era', desc: 'Chain-of-thought, o1/o3, R1 — test-time compute scaling', isOpen: true },
];

const AVAIL_COLORS: Record<string, string> = { high: '#22c55e', medium: '#eab308', low: '#ef4444' };

export default function AIPage() {
  const { papers, loading: papersLoading } = useArxivPapers();
  const { models: hfModels, datasets: hfDatasets, spaces: hfSpaces, loading: hfLoading } = useHuggingFace();
  const [selectedModels, setSelectedModels] = useState<string[]>(['GPT-4o', 'Claude 3.5 Sonnet', 'Llama 3.1 405B']);
  const [modelFilter, setModelFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [catFilter, setCatFilter] = useState('all');
  const [paperSearch, setPaperSearch] = useState('');
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);
  const [hfTab, setHfTab] = useState<'models' | 'datasets' | 'spaces'>('models');
  const [explainerOpen, setExplainerOpen] = useState<string | null>(null);

  const filteredModels = aiModels.filter((m) => {
    if (modelFilter !== 'all' && m.type !== modelFilter) return false;
    if (providerFilter !== 'all' && m.provider !== providerFilter) return false;
    return true;
  });

  const providers = ['all', ...Array.from(new Set(aiModels.map((m) => m.provider)))];

  const radarData = benchmarkDefinitions.map((b) => ({
    benchmark: b.name,
    ...Object.fromEntries(
      selectedModels.map((name) => {
        const model = aiModels.find((m) => m.name === name);
        return [name, model ? (model as unknown as Record<string, number>)[b.key] : 0];
      })
    ),
  }));

  const bestOpenModel = aiModels.filter((m) => m.type === 'open').sort((a, b) => b.mmlu - a.mmlu)[0];
  const bestClosedModel = aiModels.filter((m) => m.type === 'closed').sort((a, b) => b.mmlu - a.mmlu)[0];

  const gpuChartData = gpuData.map((g) => ({
    name: g.name,
    fp16: g.fp16,
    pricePerHr: g.cloudPricePerHr,
    tflopsPerDollar: +(g.fp16 / (g.cloudPricePerHr * 1000)).toFixed(2),
  }));

  const modelColumns: Column<AIModel>[] = [
    {
      key: 'name', header: 'Model', sortable: true,
      render: (v, row) => (
        <div className="flex items-center gap-2">
          <span className={`px-1.5 py-0.5 rounded text-xs ${row.type === 'open' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
            {row.type === 'open' ? 'OSS' : 'API'}
          </span>
          <button
            onClick={() => setSelectedModels((prev) =>
              prev.includes(String(v)) ? prev.filter((m) => m !== String(v)) : prev.length < 5 ? [...prev, String(v)] : prev
            )}
            className={`text-sm font-medium transition-colors ${selectedModels.includes(String(v)) ? 'text-cyan-400 neon-text-cyan' : 'text-slate-300 hover:text-cyan-400'}`}
          >
            {String(v)}
          </button>
        </div>
      ),
    },
    { key: 'provider', header: 'Provider', sortable: true, render: (v) => <span className="text-xs text-slate-400">{String(v)}</span> },
    { key: 'params', header: 'Params', render: (v) => <span className="text-xs font-mono text-slate-400">{String(v)}</span> },
    { key: 'context', header: 'Context', render: (v) => <span className="text-xs font-mono text-slate-400">{String(v)}</span> },
    { key: 'mmlu', header: 'MMLU', sortable: true, render: (v, row) => <ScoreCell value={Number(v)} best={Math.max(...aiModels.map(m=>m.mmlu))} color="#00FFFF" highlighted={selectedModels.includes(row.name)} /> },
    { key: 'humaneval', header: 'HumanEval', sortable: true, render: (v, row) => <ScoreCell value={Number(v)} best={Math.max(...aiModels.map(m=>m.humaneval))} color="#00FF88" highlighted={selectedModels.includes(row.name)} /> },
    { key: 'gpqa', header: 'GPQA', sortable: true, render: (v, row) => <ScoreCell value={Number(v)} best={Math.max(...aiModels.map(m=>m.gpqa))} color="#a78bfa" highlighted={selectedModels.includes(row.name)} /> },
    { key: 'math', header: 'MATH', sortable: true, render: (v, row) => <ScoreCell value={Number(v)} best={Math.max(...aiModels.map(m=>m.math))} color="#fb923c" highlighted={selectedModels.includes(row.name)} /> },
    { key: 'arc', header: 'ARC', sortable: true, render: (v, row) => <ScoreCell value={Number(v)} best={Math.max(...aiModels.map(m=>m.arc))} color="#4ade80" highlighted={selectedModels.includes(row.name)} /> },
    { key: 'hellaswag', header: 'HellaSwag', sortable: true, render: (v, row) => <ScoreCell value={Number(v)} best={Math.max(...aiModels.map(m=>m.hellaswag))} color="#fbbf24" highlighted={selectedModels.includes(row.name)} /> },
  ];

  const gpuColumns: Column<GPU>[] = [
    { key: 'name', header: 'GPU', sortable: true, render: (v) => <span className="text-sm font-medium text-cyan-400">{String(v)}</span> },
    { key: 'vendor', header: 'Vendor', sortable: true, render: (v) => <span className="text-xs text-slate-400">{String(v)}</span> },
    { key: 'vram', header: 'VRAM', sortable: true, render: (v) => <span className="text-xs font-mono text-slate-200">{String(v)}GB</span> },
    { key: 'fp16', header: 'FP16 TFLOPS', sortable: true, render: (v) => <span className="text-xs font-mono text-green-400">{String(v)}</span> },
    { key: 'cloudPricePerHr', header: '$/hr', sortable: true, render: (v) => <span className="text-xs font-mono text-yellow-400">${Number(v).toFixed(2)}</span> },
    {
      key: 'availability', header: 'Availability',
      render: (v) => <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ color: AVAIL_COLORS[String(v)], backgroundColor: AVAIL_COLORS[String(v)] + '22' }}>{String(v).toUpperCase()}</span>
    },
    { key: 'tdp', header: 'TDP (W)', sortable: true, render: (v) => <span className="text-xs font-mono text-slate-400">{String(v)}W</span> },
  ];

  const filteredPapers = papers.filter((p) => {
    const matchesCat = catFilter === 'all' || p.categories.includes(catFilter);
    const matchesSearch = !paperSearch || p.title.toLowerCase().includes(paperSearch.toLowerCase()) || p.abstract.toLowerCase().includes(paperSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 neon-text-cyan" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          🧠 AI & Machine Learning Intelligence
        </h1>
        <p className="text-slate-500 text-sm">Model leaderboard, benchmarks, arXiv papers, HuggingFace trending, GPU market</p>
      </div>

      {/* AI Counters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">AI Papers Today</p>
          <AnimatedCounter value={127} rate={0.0064} format={false} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">ChatGPT Queries/sec</p>
          <AnimatedCounter value={2894} rate={2894} format={true} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">AI Images Generated/sec</p>
          <AnimatedCounter value={926} rate={926} format={true} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Copilot Completions/sec</p>
          <AnimatedCounter value={579} rate={579} format={true} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">HF Models This Hour</p>
          <AnimatedCounter value={15} rate={0.0042} format={false} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">AI Investment (running total)</p>
          <AnimatedCounter value={200_000_000_000} rate={6342} prefix="$" className="text-2xl" />
        </GlassCard>
      </div>

      {/* Gauge Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={88.7} max={100} label="Top MMLU Score" size={140} />
        </GlassCard>
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={127} max={300} label="Papers Today" size={140} />
        </GlassCard>
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={Math.round((bestOpenModel?.mmlu || 0) / (bestClosedModel?.mmlu || 1) * 100)} label="Open/Closed Parity" size={140} />
        </GlassCard>
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={90} label="AI Momentum" size={140} />
        </GlassCard>
      </div>

      {/* Model Leaderboard */}
      <GlassCard>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">🏆 Model Leaderboard</h2>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'open', 'closed'] as const).map((f) => (
              <button key={f} onClick={() => setModelFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${modelFilter === f ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-slate-400 hover:text-slate-200 border border-white/10'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
            <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-300 outline-none">
              {providers.map((p) => <option key={p} value={p}>{p === 'all' ? 'All Providers' : p}</option>)}
            </select>
          </div>
        </div>
        <p className="text-xs text-slate-500 mb-3">Click a model name to toggle it in the Radar Chart (max 5)</p>
        <DataTable
          data={filteredModels as unknown as Record<string, unknown>[]}
          columns={modelColumns as unknown as Column<Record<string, unknown>>[]}
          pageSize={15}
        />
      </GlassCard>

      {/* Benchmark Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">📡 Benchmark Radar</h2>
          <p className="text-xs text-slate-500 mb-3">Comparing: {selectedModels.join(', ')}</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="benchmark" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
              {selectedModels.map((name, i) => (
                <Radar key={name} name={name} dataKey={name} stroke={BENCH_COLORS[i % BENCH_COLORS.length]} fill={BENCH_COLORS[i % BENCH_COLORS.length]} fillOpacity={0.1} />
              ))}
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Open vs Closed Gap */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">⚡ Open vs Closed Gap</h2>
          <div className="space-y-3">
            {benchmarkDefinitions.map((b) => {
              const openBest = Math.max(...aiModels.filter(m=>m.type==='open').map(m=>(m as unknown as Record<string,number>)[b.key]));
              const closedBest = Math.max(...aiModels.filter(m=>m.type==='closed').map(m=>(m as unknown as Record<string,number>)[b.key]));
              const gap = closedBest - openBest;
              return (
                <div key={b.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{b.name}</span>
                    <span className={gap > 3 ? 'text-red-400' : 'text-green-400'}>
                      Gap: {gap.toFixed(1)}pts
                    </span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="text-xs text-green-400 w-16 text-right font-mono">{openBest.toFixed(1)}</span>
                    <div className="flex-1 bg-white/5 rounded h-2 overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${openBest}%` }} />
                    </div>
                    <div className="flex-1 bg-white/5 rounded h-2 overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${closedBest}%` }} />
                    </div>
                    <span className="text-xs text-blue-400 w-16 font-mono">{closedBest.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mt-0.5 px-16">
                    <span>🟢 Open</span><span>🔵 Closed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Benchmark Explainer */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">📖 Benchmark Explainer</h2>
        <div className="space-y-2">
          {benchmarkDefinitions.map((b) => (
            <div key={b.key}>
              <button
                onClick={() => setExplainerOpen(explainerOpen === b.key ? null : b.key)}
                className="w-full flex items-center justify-between text-left p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-sm font-medium text-cyan-400">{b.name} — {b.fullName}</span>
                <span className="text-slate-500">{explainerOpen === b.key ? '▼' : '▶'}</span>
              </button>
              {explainerOpen === b.key && (
                <div className="px-4 pb-3 pt-1 space-y-2 bg-white/[0.01] rounded-b-lg">
                  <p className="text-sm text-slate-400">{b.description}</p>
                  <p className="text-xs text-slate-500"><span className="text-slate-300">Tests:</span> {b.tests}</p>
                  <p className="text-xs text-slate-500"><span className="text-slate-300">Why it matters:</span> {b.whyItMatters}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </GlassCard>

      {/* arXiv Paper Feed */}
      <GlassCard>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">📄 arXiv Paper Feed</h2>
          <div className="flex gap-2 flex-wrap">
            {['all', 'cs.AI', 'cs.LG', 'cs.CL', 'cs.CV', 'cs.NE'].map((c) => (
              <button key={c} onClick={() => setCatFilter(c)}
                className={`px-2 py-0.5 rounded text-xs transition-all ${catFilter === c ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'text-slate-500 hover:text-slate-300 border border-white/10'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <input
          type="text"
          placeholder="Search papers..."
          value={paperSearch}
          onChange={(e) => setPaperSearch(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-cyan-500/50 mb-3"
        />
        {papersLoading ? (
          <div className="space-y-2">{Array.from({length:5}).map((_,i)=><div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"/>)}</div>
        ) : filteredPapers.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No papers found</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredPapers.slice(0, 20).map((paper) => (
              <div key={paper.id} className="border border-white/5 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedPaper(expandedPaper === paper.id ? null : paper.id)}
                  className="w-full text-left p-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <div className="flex gap-1 flex-wrap">
                      {paper.categories.slice(0,3).map((c)=>(
                        <span key={c} className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{c}</span>
                      ))}
                    </div>
                    <span className="text-xs text-slate-600 ml-auto flex-shrink-0">{paper.published}</span>
                  </div>
                  <p className="text-sm text-slate-200 mt-1 line-clamp-2">{paper.title}</p>
                  <p className="text-xs text-slate-500 mt-1">{paper.authors.join(', ')}</p>
                </button>
                {expandedPaper === paper.id && (
                  <div className="px-3 pb-3 border-t border-white/5">
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{paper.abstract.slice(0, 500)}...</p>
                    <div className="flex gap-2 mt-2">
                      <a href={paper.link} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline">📎 Abstract</a>
                      {paper.pdfLink && <a href={paper.pdfLink} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:underline">📄 PDF</a>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* HuggingFace Trending */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">🤗 HuggingFace Trending</h2>
          <div className="flex gap-1">
            {(['models', 'datasets', 'spaces'] as const).map((t) => (
              <button key={t} onClick={() => setHfTab(t)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${hfTab === t ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {hfLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">{Array.from({length:8}).map((_,i)=><div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse"/>)}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {(hfTab === 'models' ? hfModels : hfTab === 'datasets' ? hfDatasets : hfSpaces).slice(0, 10).map((item) => (
              <a key={item.id} href={`https://huggingface.co/${item.id}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all">
                <span className="text-xs text-slate-300 truncate">{item.id}</span>
                <div className="flex gap-2 text-xs flex-shrink-0">
                  <span className="text-yellow-400">♥ {(item.likes || 0).toLocaleString()}</span>
                  {(item as {downloads?: number}).downloads && <span className="text-cyan-400">↓ {((item as {downloads: number}).downloads / 1000).toFixed(0)}K</span>}
                </div>
              </a>
            ))}
            {(hfTab === 'models' ? hfModels : hfTab === 'datasets' ? hfDatasets : hfSpaces).length === 0 && (
              <div className="col-span-2 text-center text-slate-500 py-4">Data unavailable</div>
            )}
          </div>
        )}
      </GlassCard>

      {/* GPU Market */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">🖥️ GPU Market Analysis</h2>
        <DataTable
          data={gpuData as unknown as Record<string, unknown>[]}
          columns={gpuColumns as unknown as Column<Record<string, unknown>>[]}
          pageSize={10}
        />
        <div className="mt-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">FP16 TFLOPS Comparison</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={gpuChartData}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8 }} />
              <Bar dataKey="fp16" fill="#00FFFF" radius={[4,4,0,0]} opacity={0.8} name="FP16 TFLOPS" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* AI Timeline */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6">📅 AI Timeline</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500/50 to-transparent" />
          <div className="space-y-4">
            {AI_TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4 pl-10 relative">
                <div className="absolute left-3 top-1.5 w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: item.isOpen ? '#00FF88' : '#00FFFF', borderColor: item.isOpen ? '#00FF88' : '#00FFFF', boxShadow: `0 0 8px ${item.isOpen ? '#00FF88' : '#00FFFF'}` }} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">{item.year}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${item.isOpen ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {item.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200">{item.event}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function ScoreCell({ value, best, color, highlighted }: { value: number; best: number; color: string; highlighted: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 bg-white/5 rounded h-1.5 overflow-hidden">
        <div className="h-full rounded" style={{ width: `${value}%`, backgroundColor: color, opacity: 0.7 }} />
      </div>
      <span className={`text-xs font-mono ${value === best ? 'font-bold' : ''} ${highlighted ? 'text-cyan-400' : 'text-slate-300'}`} style={value === best ? { color } : {}}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}
