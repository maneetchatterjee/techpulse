'use client';

import { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import MetricCard from '@/components/MetricCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import RadialGauge from '@/components/RadialGauge';
import TerminalFeed from '@/components/TerminalFeed';

const FEED_ITEMS = [
  { source: 'GitHub', message: 'New trending repo: shadcn-ui (+2.1k stars today)', color: 'text-green-400' },
  { source: 'NVD', message: 'CVE-2024-12345 CRITICAL published - affects OpenSSL 3.x', color: 'text-red-400' },
  { source: 'arXiv', message: 'New paper: "Scaling Laws for Neural Language Models" (cs.AI)', color: 'text-cyan-400' },
  { source: 'CoinGecko', message: 'BTC dominance rises to 54.2%', color: 'text-yellow-400' },
  { source: 'Hacker News', message: '"Why we switched from PostgreSQL to SQLite" (847 points)', color: 'text-orange-400' },
  { source: 'npm', message: 'react downloaded 3.2M times in the last 24h', color: 'text-blue-400' },
  { source: 'HuggingFace', message: 'New model trending: Qwen2.5-Coder-32B (+12k downloads/hr)', color: 'text-purple-400' },
  { source: 'Security', message: 'Phishing campaign detected targeting cloud providers', color: 'text-red-400' },
  { source: 'GitHub', message: 'typescript/typescript v5.7.0 released', color: 'text-green-400' },
  { source: 'DeFi', message: 'Total TVL crosses $100B milestone on Ethereum', color: 'text-yellow-400' },
];

function formatFeedEntries(items: typeof FEED_ITEMS) {
  return items.map((item, i) => ({
    id: `${i}-${Date.now()}`,
    time: new Date().toLocaleTimeString('en', { hour12: false }),
    source: item.source,
    message: item.message,
    color: item.color,
  }));
}

export default function OverviewPage() {
  const [feedEntries, setFeedEntries] = useState(formatFeedEntries(FEED_ITEMS));
  

  useEffect(() => {
    const interval = setInterval(() => {
      const item = FEED_ITEMS[Math.floor(Math.random() * FEED_ITEMS.length)];
      setFeedEntries((prev) => [
        ...prev.slice(-199),
        {
          id: `${Date.now()}-${Math.random()}`,
          time: new Date().toLocaleTimeString('en', { hour12: false }),
          source: item.source,
          message: item.message,
          color: item.color,
        },
      ]);
      
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <span className="text-cyan-400 neon-text-cyan">TECH</span>
            <span className="text-green-400 neon-text-green">PULSE</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Real-time global technology monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
          <div className="w-2 h-2 rounded-full bg-green-400 pulse-green" />
          LIVE
        </div>
      </div>

      {/* TechPulse Score Hero */}
      <GlassCard className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <RadialGauge value={74} label="TechPulse Score" size={200} />
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Internet Health</p>
              <p className="text-2xl font-mono text-green-400 neon-text-green">92%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Threat Level</p>
              <p className="text-2xl font-mono text-orange-400">ELEVATED</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">AI Velocity</p>
              <p className="text-2xl font-mono text-cyan-400 neon-text-cyan">HIGH</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider">Crypto Sentiment</p>
              <p className="text-2xl font-mono text-green-400 neon-text-green">GREED</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          icon="⭐"
          label="GitHub Stars Today"
          value={<AnimatedCounter value={48293} rate={0.6} format={true} />}
          change="12%"
          changePositive={true}
        />
        <MetricCard
          icon="🛡️"
          label="Threat Level"
          value="ELEVATED"
          change="3"
          changePositive={false}
        />
        <MetricCard
          icon="🧠"
          label="AI Papers Today"
          value={<AnimatedCounter value={127} rate={0.02} format={false} />}
          change="8%"
          changePositive={true}
        />
        <MetricCard
          icon="🪙"
          label="BTC Price"
          value="$98,420"
          change="2.1%"
          changePositive={true}
        />
        <MetricCard
          icon="✅"
          label="Services Operational"
          value="18/20"
          sub="2 degraded"
        />
        <MetricCard
          icon="📦"
          label="npm Downloads/sec"
          value={<AnimatedCounter value={4977} rate={4977} format={true} />}
          change="steady"
          changePositive={true}
        />
        <MetricCard
          icon="🔥"
          label="HN Top Story"
          value="#1 Score"
          sub="847 pts"
        />
        <MetricCard
          icon="❓"
          label="SO Questions Today"
          value={<AnimatedCounter value={6240} rate={0.09} format={false} />}
          change="5%"
          changePositive={false}
        />
      </div>

      {/* Gauges Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={92} label="Internet Health" size={140} />
        </GlassCard>
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={60} label="Threat Level" size={140} colorScheme="threat" />
        </GlassCard>
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={82} label="AI Velocity" size={140} />
        </GlassCard>
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={68} label="Crypto Sentiment" size={140} colorScheme="sentiment" />
        </GlassCard>
      </div>

      {/* Global Counters */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Emails Sent Today</p>
          <AnimatedCounter value={Math.floor(3_800_000 * 86400 / 24)} rate={3_800_000} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Google Searches Today</p>
          <AnimatedCounter value={Math.floor(98_000 * 86400 / 24)} rate={98_000} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Tweets Today</p>
          <AnimatedCounter value={Math.floor(5787 * 86400 / 24)} rate={5787} className="text-2xl" />
        </GlassCard>
      </div>

      {/* Terminal Feed */}
      <TerminalFeed entries={feedEntries} height="h-48" title="⚡ LIVE TECHPULSE FEED" />
    </div>
  );
}
