'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import { platformCounters, dailyInternetUsers } from '@/lib/socialData';

export default function SocialPage() {
  const barData = platformCounters.map((p) => ({
    name: p.platform,
    ratePerSec: p.ratePerSecond,
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 neon-text-cyan" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          📱 Social Media Intelligence
        </h1>
        <p className="text-slate-500 text-sm">Platform activity counters, content creation rates</p>
      </div>

      {/* Platform Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {platformCounters.map((p) => (
          <GlassCard key={p.platform}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{p.icon}</span>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{p.platform}</p>
            </div>
            <span className="text-xl font-mono neon-text-cyan" style={{ color: p.color }}>
              <AnimatedCounter
                value={p.ratePerSecond * 60}
                rate={p.ratePerSecond}
                className=""
              />
            </span>
            <p className="text-xs text-slate-600 mt-0.5">{p.metric}/min</p>
          </GlassCard>
        ))}
      </div>

      {/* Content Created Today */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="col-span-2 md:col-span-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Internet Users Online Now</p>
          <AnimatedCounter value={dailyInternetUsers * 0.7} rate={0} className="text-3xl" />
          <p className="text-xs text-slate-600 mt-1">of {(dailyInternetUsers / 1e9).toFixed(1)}B total daily users</p>
        </GlassCard>
        {[
          { label: 'WhatsApp Messages Today', rate: 840_277, base: 840_277 * 3600 * 8 },
          { label: 'YouTube Videos Watched Today', rate: 1_000_000, base: 1_000_000 * 3600 * 8 },
        ].map((item) => (
          <GlassCard key={item.label}>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{item.label}</p>
            <AnimatedCounter value={item.base} rate={item.rate} className="text-xl" />
          </GlassCard>
        ))}
      </div>

      {/* Rate Comparison Chart */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">📊 Content Creation Rate (per second)</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} layout="vertical" margin={{ left: 80, right: 20 }}>
            <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }}
              tickFormatter={(v) => v >= 1e6 ? `${(v/1e6).toFixed(0)}M` : v >= 1e3 ? `${(v/1e3).toFixed(0)}K` : String(v)} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={80} />
            <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8 }}
              formatter={(v) => [(v ?? 0).toLocaleString(), 'Per Second']} />
            <Bar dataKey="ratePerSec" fill="#00FFFF" radius={[0, 4, 4, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Fun Facts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { fact: 'Every minute on the internet', stats: [
            { label: 'YouTube uploads', value: '500 hours of video' },
            { label: 'Instagram posts', value: '65,972 photos' },
            { label: 'TikTok downloads', value: '3,472 new apps' },
            { label: 'Twitter tweets', value: '347,222 tweets' },
          ]},
          { fact: 'By the numbers (2025)', stats: [
            { label: 'Total websites', value: '~1.98 billion' },
            { label: 'Daily email users', value: '4+ billion' },
            { label: 'Social media users', value: '5.04 billion' },
            { label: 'Mobile users', value: '5.6+ billion' },
          ]},
          { fact: 'Content created in 2024', stats: [
            { label: 'Data generated', value: '328 million TB' },
            { label: 'Photos taken', value: '1.8 trillion' },
            { label: 'Videos streamed', value: '1+ billion hrs/day' },
            { label: 'Podcasts available', value: '4+ million' },
          ]},
        ].map((section) => (
          <GlassCard key={section.fact}>
            <h3 className="text-xs text-cyan-400 uppercase tracking-wider mb-3">{section.fact}</h3>
            <div className="space-y-2">
              {section.stats.map((s) => (
                <div key={s.label} className="flex justify-between text-xs">
                  <span className="text-slate-500">{s.label}</span>
                  <span className="text-slate-300 font-mono">{s.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
