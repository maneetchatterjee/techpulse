'use client';

import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import DataTable, { Column } from '@/components/DataTable';
import { topSteamGames, TopGame, steamConcurrentBaseline, gamingRevenuePerYear } from '@/lib/gamingData';

const gameColumns: Column<TopGame>[] = [
  { key: 'rank', header: '#', render: (v) => <span className="text-xs font-mono text-slate-500">{String(v)}</span> },
  { key: 'name', header: 'Game', sortable: true, render: (v) => <span className="text-sm font-medium text-slate-200">{String(v)}</span> },
  { key: 'genre', header: 'Genre', render: (v) => <span className="text-xs text-slate-400">{String(v)}</span> },
  { key: 'peakPlayers', header: 'Peak Players', sortable: true, render: (v) => <span className="text-xs font-mono text-cyan-400">{Number(v).toLocaleString()}</span> },
  { key: 'currentPlayers', header: 'Current~', sortable: true, render: (v) => <span className="text-xs font-mono text-green-400">{Number(v).toLocaleString()}</span> },
  { key: 'platform', header: 'Platform', render: (v) => <span className="text-xs text-slate-500">{String(v)}</span> },
  { key: 'releaseYear', header: 'Year', sortable: true, render: (v) => <span className="text-xs font-mono text-slate-500">{String(v)}</span> },
];

export default function GamingPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 neon-text-cyan" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          🎮 Gaming Intelligence
        </h1>
        <p className="text-slate-500 text-sm">Steam stats, top games, gaming revenue</p>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Steam Concurrent Players</p>
          <AnimatedCounter value={steamConcurrentBaseline} rate={0} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Gaming Revenue This Year</p>
          <AnimatedCounter value={gamingRevenuePerYear} rate={6342} prefix="$" className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Mobile Gaming Revenue</p>
          <AnimatedCounter value={92_000_000_000} prefix="$" className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Esports Revenue</p>
          <AnimatedCounter value={1_800_000_000} prefix="$" className="text-2xl" />
        </GlassCard>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Games Played/day</p>
          <p className="text-xl font-mono font-bold text-green-400 neon-text-green">2.7B</p>
          <p className="text-xs text-slate-600">global sessions</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Gamers Worldwide</p>
          <p className="text-xl font-mono font-bold text-cyan-400 neon-text-cyan">3.3B</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Steam Games Available</p>
          <p className="text-xl font-mono font-bold text-purple-400">80K+</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Average Play Time/day</p>
          <p className="text-xl font-mono font-bold text-orange-400">7.4 hrs</p>
        </GlassCard>
      </div>

      {/* Top Games Table */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">🏆 Steam Top Games</h2>
        <DataTable
          data={topSteamGames as unknown as Record<string, unknown>[]}
          columns={gameColumns as unknown as Column<Record<string, unknown>>[]}
          pageSize={10}
        />
      </div>

      {/* Gaming Industry Breakdown */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">🌍 Gaming Market Segments</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Mobile', value: '$92B', share: 46, color: '#00FFFF' },
            { label: 'Console', value: '$52B', share: 26, color: '#00FF88' },
            { label: 'PC', value: '$40B', share: 20, color: '#a78bfa' },
            { label: 'Cloud/Other', value: '$16B', share: 8, color: '#fb923c' },
          ].map((seg) => (
            <div key={seg.label} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={seg.color} strokeWidth="3"
                    strokeDasharray={`${seg.share} ${100 - seg.share}`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold font-mono" style={{ color: seg.color }}>{seg.share}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">{seg.label}</p>
              <p className="text-sm font-mono font-bold" style={{ color: seg.color }}>{seg.value}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
