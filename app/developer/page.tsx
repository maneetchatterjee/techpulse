'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';

import { useStackOverflow } from '@/hooks/useStackOverflow';

const SALARY_DATA = [
  { role: 'ML Engineer', p50: 185, p75: 240, p90: 310 },
  { role: 'Staff SWE', p50: 220, p75: 280, p90: 370 },
  { role: 'Principal SWE', p50: 250, p75: 320, p90: 420 },
  { role: 'SWE III', p50: 160, p75: 200, p90: 260 },
  { role: 'SWE II', p50: 130, p75: 165, p90: 210 },
  { role: 'SWE I', p50: 100, p75: 125, p90: 155 },
  { role: 'Data Scientist', p50: 145, p75: 190, p90: 250 },
  { role: 'DevOps/SRE', p50: 155, p75: 195, p90: 255 },
];

const FRAMEWORK_WARS = [
  { name: 'React', weekly: 27_000_000, color: '#61dafb' },
  { name: 'Vue', weekly: 4_200_000, color: '#42b883' },
  { name: 'Angular', weekly: 3_800_000, color: '#dd1b16' },
  { name: 'Svelte', weekly: 2_100_000, color: '#ff3e00' },
  { name: 'Next.js', weekly: 8_500_000, color: '#ffffff' },
  { name: 'Nuxt', weekly: 1_200_000, color: '#00dc82' },
  { name: 'Remix', weekly: 600_000, color: '#e8f2ff' },
  { name: 'Astro', weekly: 1_800_000, color: '#ff5d01' },
];

export default function DeveloperPage() {
  const { tags, questions, siteInfo, loading } = useStackOverflow();

  const tagChartData = tags.slice(0, 15).map((t) => ({ name: t.name, count: t.count }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 neon-text-cyan" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          👩‍💻 Developer Intelligence
        </h1>
        <p className="text-slate-500 text-sm">Stack Overflow stats, language rankings, framework wars, dev counters</p>
      </div>

      {/* Dev Counters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Lines of Code/sec</p>
          <AnimatedCounter value={3_500_000} rate={3_500_000} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Bugs Created/sec</p>
          <AnimatedCounter value={174_000} rate={174_000} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Coffee Cups/sec</p>
          <AnimatedCounter value={996} rate={996} format={false} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">SO Questions Today</p>
          <AnimatedCounter value={siteInfo?.total_questions || 58_000_000} rate={0.09} format={true} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">SO Total Answers</p>
          <AnimatedCounter value={siteInfo?.total_answers || 94_000_000} rate={0.15} format={true} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">SO Users</p>
          <AnimatedCounter value={siteInfo?.total_users || 22_000_000} format={true} className="text-2xl" />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Rankings */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">📊 Stack Overflow Top Tags</h2>
          {loading ? (
            <div className="h-64 bg-white/5 rounded-lg animate-pulse" />
          ) : tagChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tagChartData} layout="vertical" margin={{ left: 70, right: 20 }}>
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickFormatter={(v) => v >= 1e6 ? `${(v/1e6).toFixed(0)}M` : `${(v/1e3).toFixed(0)}K`} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={70} />
                <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8 }}
                  formatter={(v) => [(v ?? 0).toLocaleString(), 'Questions']} />
                <Bar dataKey="count" fill="#00FF88" radius={[0, 4, 4, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">Data unavailable</div>
          )}
        </GlassCard>

        {/* Framework Wars */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">⚔️ Framework Wars (Weekly npm Downloads)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={FRAMEWORK_WARS} layout="vertical" margin={{ left: 60, right: 20 }}>
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }}
                tickFormatter={(v) => `${(v/1e6).toFixed(0)}M`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={60} />
              <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8 }}
                formatter={(v) => [`${((v as number)/1e6).toFixed(1)}M`, 'Weekly Downloads']} />
              <Bar dataKey="weekly" radius={[0, 4, 4, 0]} opacity={0.85}>
                {FRAMEWORK_WARS.map((entry, i) => (
                  <rect key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Salary Gauges */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">💰 Salary Benchmarks (US, Total Comp $K)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-4 py-2 text-left text-xs text-slate-400 uppercase">Role</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 uppercase">P50</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 uppercase">P75</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 uppercase">P90</th>
                <th className="px-4 py-2 text-left text-xs text-slate-400 uppercase">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {SALARY_DATA.map((row) => (
                <tr key={row.role} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-4 py-2 text-sm text-slate-300">{row.role}</td>
                  <td className="px-4 py-2 text-sm font-mono text-cyan-400">${row.p50}K</td>
                  <td className="px-4 py-2 text-sm font-mono text-green-400">${row.p75}K</td>
                  <td className="px-4 py-2 text-sm font-mono text-yellow-400">${row.p90}K</td>
                  <td className="px-4 py-2 w-48">
                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="absolute h-full bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-full" style={{ width: `${(row.p90 / 420) * 100}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Recent SO Questions */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">❓ Recent Stack Overflow Questions</h2>
        {loading ? (
          <div className="space-y-2">{Array.from({length:5}).map((_,i)=><div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse"/>)}</div>
        ) : questions.length > 0 ? (
          <div className="space-y-2">
            {questions.slice(0, 10).map((q) => (
              <a key={q.question_id} href={q.link} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col items-center gap-0.5 flex-shrink-0 w-10">
                  <span className={`text-xs font-mono font-bold ${q.score > 0 ? 'text-green-400' : q.score < 0 ? 'text-red-400' : 'text-slate-500'}`}>{q.score}</span>
                  <span className="text-xs text-slate-600">{q.answer_count}A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-300 line-clamp-1">{q.title}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {q.tags.slice(0, 4).map((t) => (
                      <span key={t} className="text-xs px-1.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">{t}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">Data unavailable (Stack Exchange rate limit)</div>
        )}
      </GlassCard>
    </div>
  );
}
