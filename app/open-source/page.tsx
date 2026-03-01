'use client';


import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import RadialGauge from '@/components/RadialGauge';
import { useGitHubTrending } from '@/hooks/useGitHubTrending';
import { useNpmStats } from '@/hooks/useNpmStats';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6', JavaScript: '#f7df1e', Python: '#3776ab', Go: '#00add8',
  Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d', Ruby: '#701516',
  Swift: '#f05138', Kotlin: '#a97bff', PHP: '#777bb4', 'C#': '#178600',
};

const PIE_COLORS = ['#00FFFF', '#00FF88', '#a78bfa', '#fb923c', '#f87171', '#4ade80', '#60a5fa', '#fbbf24'];

const LANG_BREAKDOWN = [
  { name: 'JavaScript', value: 21.3 }, { name: 'Python', value: 17.8 },
  { name: 'TypeScript', value: 14.2 }, { name: 'Java', value: 9.4 },
  { name: 'C++', value: 7.1 }, { name: 'Go', value: 5.8 },
  { name: 'Rust', value: 4.2 }, { name: 'Other', value: 20.2 },
];

export default function OpenSourcePage() {
  const { repos, loading: reposLoading } = useGitHubTrending();
  const { stats, loading: npmLoading } = useNpmStats();

  const npmChartData = stats
    .filter((s) => s.downloads > 0)
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 12)
    .map((s) => ({ name: s.package, downloads: s.downloads }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 neon-text-cyan" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            🐙 Open Source Intelligence
          </h1>
          <p className="text-slate-500 text-sm">GitHub trending, npm stats, ecosystem activity</p>
        </div>
      </div>

      {/* Ecosystem Counters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">npm Downloads/sec</p>
          <AnimatedCounter value={4977} rate={4977} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Git Commits/sec</p>
          <AnimatedCounter value={984} rate={984} className="text-2xl" format={false} />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Stars Given/sec</p>
          <AnimatedCounter value={35} rate={35} className="text-2xl" format={false} />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Issues Opened/sec</p>
          <AnimatedCounter value={17} rate={17} className="text-2xl" format={false} />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">PRs Opened/sec</p>
          <AnimatedCounter value={9} rate={9} className="text-2xl" format={false} />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Packages Published Today</p>
          <AnimatedCounter value={Math.floor(0.02 * 3600)} rate={0.02} format={false} decimals={1} className="text-2xl" />
        </GlassCard>
      </div>

      {/* Gauges */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={87} label="npm Velocity" size={140} />
        </GlassCard>
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={79} label="OSS Activity Index" size={140} />
        </GlassCard>
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={92} label="GitHub Event Rate" size={140} />
        </GlassCard>
      </div>

      {/* Trending Repos */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">🔥 Trending Repositories (Last 24h)</h2>
        {reposLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {repos.slice(0, 9).map((repo) => (
              <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer"
                className="glass-card rounded-lg p-3 hover:border-cyan-500/30 transition-all block">
                <p className="text-sm font-semibold text-cyan-400 truncate">{repo.full_name}</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{repo.description || 'No description'}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-yellow-400">⭐ {repo.stargazers_count.toLocaleString()}</span>
                  <span className="text-xs text-slate-500">🍴 {repo.forks_count.toLocaleString()}</span>
                  {repo.language && (
                    <span className="text-xs px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: LANG_COLORS[repo.language] || '#555' }}>
                      {repo.language}
                    </span>
                  )}
                </div>
              </a>
            ))}
            {repos.length === 0 && (
              <div className="col-span-3 text-center text-slate-500 py-8">
                Data unavailable (GitHub rate limit may apply)
              </div>
            )}
          </div>
        )}
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* npm Downloads Chart */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">📦 npm Weekly Downloads</h2>
          {npmLoading ? (
            <div className="h-48 bg-white/5 rounded-lg animate-pulse" />
          ) : npmChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={npmChartData} layout="vertical" margin={{ left: 60, right: 20 }}>
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickFormatter={(v) => v >= 1e6 ? `${(v/1e6).toFixed(0)}M` : v >= 1e3 ? `${(v/1e3).toFixed(0)}K` : v} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={60} />
                <Tooltip
                  contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8 }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(v) => [(v ?? 0).toLocaleString(), 'Downloads']}
                />
                <Bar dataKey="downloads" fill="#00FFFF" radius={[0, 4, 4, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-500">Data unavailable</div>
          )}
        </GlassCard>

        {/* Language Breakdown */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">💻 Language Breakdown</h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={LANG_BREAKDOWN} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {LANG_BREAKDOWN.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8 }}
                  formatter={(v) => [`${v ?? 0}%`]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1">
              {LANG_BREAKDOWN.map((lang, i) => (
                <div key={lang.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-slate-400">{lang.name}</span>
                  </div>
                  <span className="text-slate-300 font-mono">{lang.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
