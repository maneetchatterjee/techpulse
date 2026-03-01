'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import RadialGauge from '@/components/RadialGauge';
import TerminalFeed from '@/components/TerminalFeed';
import { useServiceStatus } from '@/hooks/useServiceStatus';

const TLD_DATA = [
  { name: '.com', value: 42 }, { name: '.net', value: 12 }, { name: '.org', value: 8 },
  { name: '.io', value: 9 }, { name: '.dev', value: 6 }, { name: 'Other', value: 23 },
];
const TLD_COLORS = ['#00FFFF', '#00FF88', '#a78bfa', '#fb923c', '#4ade80', '#94a3b8'];

const DOMAINS = [
  'api.openai.com', 'cdn.jsdelivr.net', 'cloudflare.com', 'example.dev', 'secure.bank.com',
  'login.github.com', 'mail.google.com', 'cdn.cloudflare.net', 'auth.vercel.com', 'ws.binance.org',
  'api.stripe.com', 'cdn.discord.com', 'assets.github.io', 'static.anthropic.com', 'ws.kraken.io',
];

function getStatusColor(status: string) {
  if (status === 'operational') return 'text-green-400';
  if (status === 'degraded') return 'text-yellow-400';
  if (status === 'outage') return 'text-red-400';
  return 'text-slate-500';
}

function getStatusDot(status: string) {
  if (status === 'operational') return 'bg-green-400';
  if (status === 'degraded') return 'bg-yellow-400';
  if (status === 'outage') return 'bg-red-400';
  return 'bg-slate-500';
}

export default function InternetPage() {
  const { services, loading } = useServiceStatus();
  const [certFeed, setCertFeed] = useState<Array<{ id: string; time: string; source: string; message: string; color: string }>>([]);
  const [certsPerSec, setCertsPerSec] = useState(12.4);

  const operationalCount = services.filter((s) => s.status === 'operational').length;
  const healthScore = Math.round((operationalCount / services.length) * 100) || 0;

  useEffect(() => {
    const initial = DOMAINS.map((d, i) => ({
      id: `init-${i}`,
      time: new Date().toLocaleTimeString('en', { hour12: false }),
      source: 'CertStream',
      message: `New cert: ${d}`,
      color: 'text-green-400',
    }));
    setCertFeed(initial);

    const interval = setInterval(() => {
      const domain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
      const subdomain = Math.random() > 0.5 ? `${Math.random().toString(36).substring(2, 8)}.` : '';
      setCertFeed((prev) => [
        ...prev.slice(-199),
        {
          id: `${Date.now()}-${Math.random()}`,
          time: new Date().toLocaleTimeString('en', { hour12: false }),
          source: 'CertStream',
          message: `TLS cert issued: ${subdomain}${domain}`,
          color: 'text-green-400',
        },
      ]);
      setCertsPerSec(10 + Math.random() * 8);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 neon-text-cyan" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          🌐 Internet Health Monitor
        </h1>
        <p className="text-slate-500 text-sm">Service status, SSL certificate stream, internet counters</p>
      </div>

      {/* Internet Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Emails Sent/sec</p>
          <AnimatedCounter value={3_800_000} rate={3_800_000} className="text-xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Google Searches/sec</p>
          <AnimatedCounter value={98_000} rate={98_000} className="text-xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">IoT Devices Online</p>
          <AnimatedCounter value={18_800_000_000} rate={0} className="text-xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Data Transferred Today</p>
          <AnimatedCounter value={450} rate={0.0052} suffix=" EB" format={false} decimals={3} className="text-xl" />
        </GlassCard>
      </div>

      {/* Health Gauge + Cert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={healthScore} label="Internet Health Score" size={160} />
        </GlassCard>
        <GlassCard className="flex justify-center py-4">
          <div className="text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">SSL Certs/sec</p>
            <p className="text-3xl font-mono text-green-400 neon-text-green">{certsPerSec.toFixed(1)}</p>
            <p className="text-xs text-slate-500 mt-1">via CertStream</p>
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-3">TLD Distribution</h3>
          <div className="flex items-center gap-2">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={TLD_DATA} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={2}>
                  {TLD_DATA.map((_, i) => <Cell key={i} fill={TLD_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-0.5">
              {TLD_DATA.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: TLD_COLORS[i] }} /><span className="text-slate-400">{d.name}</span></div>
                  <span className="text-slate-300 font-mono">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Service Status Grid */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">🟢 Service Status Monitor</h2>
          <span className={`text-sm font-mono ${operationalCount >= 18 ? 'text-green-400' : 'text-yellow-400'}`}>
            {loading ? '...' : `${operationalCount}/${services.length} Operational`}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {services.map((svc) => (
            <div key={svc.name} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getStatusDot(svc.status)}`} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-300 truncate">{svc.name}</p>
                <p className={`text-xs capitalize ${getStatusColor(svc.status)}`}>
                  {loading ? 'loading...' : svc.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* CertStream Live Feed */}
      <TerminalFeed entries={certFeed} height="h-56" title="🔒 CertStream — Live SSL Certificate Feed" />
    </div>
  );
}
