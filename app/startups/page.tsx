'use client';

import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useProductHunt } from '@/hooks/useProductHunt';
import { fundingRounds, sectorAllocation, unicornCount, unicornsByCountry } from '@/lib/fundingData';

const PIE_COLORS = ['#00FFFF', '#00FF88', '#a78bfa', '#fb923c', '#4ade80', '#f87171', '#94a3b8'];

export default function StartupsPage() {
  const { posts, loading } = useProductHunt();

  const totalFunding = fundingRounds.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 neon-text-cyan" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          🚀 Startup Intelligence
        </h1>
        <p className="text-slate-500 text-sm">Product Hunt launches, VC funding, unicorn tracker</p>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Global Unicorns</p>
          <p className="text-3xl font-bold font-mono text-cyan-400 neon-text-cyan">{unicornCount.toLocaleString()}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">VC Funding (Tracked)</p>
          <p className="text-2xl font-bold font-mono text-green-400 neon-text-green">${(totalFunding/1000).toFixed(1)}B</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Startups Founded Today</p>
          <AnimatedCounter value={1370} rate={0.016} format={false} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">VC Deals Today</p>
          <AnimatedCounter value={87} rate={0.001} format={false} className="text-2xl" />
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sector Allocation */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">💼 VC Investment by Sector</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={sectorAllocation} dataKey="percentage" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {sectorAllocation.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8 }}
                  formatter={(v) => [`${v ?? 0}%`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1">
              {sectorAllocation.map((s, i) => (
                <div key={s.sector} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-slate-400">{s.sector}</span>
                  </div>
                  <span className="text-slate-300 font-mono">{s.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Unicorns by Country */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">🦄 Unicorns by Country</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={unicornsByCountry} layout="vertical" margin={{ left: 50, right: 20 }}>
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis type="category" dataKey="country" tick={{ fill: '#94a3b8', fontSize: 11 }} width={50} />
              <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8 }} />
              <Bar dataKey="count" fill="#a78bfa" radius={[0, 4, 4, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Funding Tracker */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">💰 Major Funding Rounds (2024)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Company', 'Sector', 'Amount', 'Round', 'Key Investors', 'Date'].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-xs text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fundingRounds.map((r, i) => (
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-2 text-sm font-medium text-cyan-400">{r.company}</td>
                  <td className="px-4 py-2 text-xs text-slate-400">{r.sector}</td>
                  <td className="px-4 py-2 text-sm font-bold font-mono text-green-400">${r.amount >= 1000 ? (r.amount/1000).toFixed(1)+'B' : r.amount+'M'}</td>
                  <td className="px-4 py-2 text-xs text-slate-400">{r.round}</td>
                  <td className="px-4 py-2 text-xs text-slate-500">{r.investors}</td>
                  <td className="px-4 py-2 text-xs text-slate-500 font-mono">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Product Hunt Feed */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">🎯 Product Hunt — Today&apos;s Launches</h2>
        {loading ? (
          <div className="grid grid-cols-2 gap-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse"/>)}</div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {posts.slice(0, 10).map((post, i) => (
              <a key={i} href={post.link} target="_blank" rel="noopener noreferrer"
                className="glass-card rounded-lg p-3 hover:border-cyan-500/30 block transition-all">
                <p className="text-sm font-semibold text-slate-200 line-clamp-1">{post.title}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2" dangerouslySetInnerHTML={{ __html: post.description?.slice(0, 100) + '...' }} />
                <p className="text-xs text-slate-600 mt-1 font-mono">{new Date(post.pubDate).toLocaleDateString()}</p>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-8">Product Hunt data unavailable</div>
        )}
      </GlassCard>
    </div>
  );
}
