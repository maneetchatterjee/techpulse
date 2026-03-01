'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import GlassCard from '@/components/GlassCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import RadialGauge from '@/components/RadialGauge';
import DataTable, { Column } from '@/components/DataTable';
import { useCVEData, CVE } from '@/hooks/useCVEData';
import { activeExploits } from '@/lib/breachData';

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f97316', MEDIUM: '#eab308', LOW: '#22c55e', NONE: '#64748b',
};

function SeverityBadge({ severity }: { severity: string }) {
  return (
    <span className="px-2 py-0.5 rounded text-xs font-bold font-mono" style={{ backgroundColor: SEVERITY_COLORS[severity] + '22', color: SEVERITY_COLORS[severity], border: `1px solid ${SEVERITY_COLORS[severity]}44` }}>
      {severity}
    </span>
  );
}

const WEEK_DATA = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return {
    date: d.toLocaleDateString('en', { weekday: 'short' }),
    CRITICAL: Math.floor(Math.random() * 8) + 2,
    HIGH: Math.floor(Math.random() * 20) + 8,
    MEDIUM: Math.floor(Math.random() * 30) + 15,
    LOW: Math.floor(Math.random() * 15) + 5,
  };
});

export default function SecurityPage() {
  const { cves, loading } = useCVEData();
  const [threatLevel] = useState(3);

  const criticalCount = cves.filter((c) => c.severity === 'CRITICAL').length;
  const threatScore = Math.min(100, 20 + criticalCount * 5 + activeExploits * 0.2);

  const threatLabel = threatLevel === 1 ? 'NOMINAL' : threatLevel === 2 ? 'GUARDED' : threatLevel === 3 ? 'ELEVATED' : threatLevel === 4 ? 'HIGH' : 'CRITICAL';

  const cveColumns: Column<CVE>[] = [
    { key: 'id', header: 'CVE ID', sortable: true, render: (v) => <span className="text-cyan-400 font-mono text-xs">{String(v)}</span> },
    { key: 'description', header: 'Description', render: (v) => <span className="text-xs text-slate-400 line-clamp-1">{String(v)}</span> },
    {
      key: 'cvssScore', header: 'CVSS', sortable: true,
      render: (v) => <span className="font-mono text-xs text-slate-200">{Number(v).toFixed(1)}</span>
    },
    { key: 'severity', header: 'Severity', sortable: true, render: (v) => <SeverityBadge severity={String(v)} /> },
    { key: 'publishedDate', header: 'Published', sortable: true, render: (v) => <span className="text-xs text-slate-500 font-mono">{String(v)}</span> },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 neon-text-cyan" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          🛡️ Security Intelligence
        </h1>
        <p className="text-slate-500 text-sm">NVD CVE feed, threat analysis, attack timeline</p>
      </div>

      {/* Security Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">CVEs Today</p>
          <AnimatedCounter value={82} rate={0.00095} format={false} decimals={0} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">CVEs This Year</p>
          <AnimatedCounter value={29843} rate={0.00095} format={false} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Phishing Attempts/sec</p>
          <AnimatedCounter value={39_000} rate={39_000} format={true} className="text-2xl" />
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Ransomware Damage/sec</p>
          <AnimatedCounter value={636} rate={636} prefix="$" format={false} decimals={0} className="text-2xl" />
        </GlassCard>
      </div>

      {/* Threat Level + Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="flex flex-col items-center justify-center py-6">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">DEFCON-style Threat Level</p>
          <p className={`text-4xl font-bold font-mono ${threatLevel >= 4 ? 'text-red-400' : threatLevel >= 3 ? 'text-orange-400' : 'text-yellow-400'}`}>
            {threatLabel}
          </p>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4, 5].map((l) => (
              <div key={l} className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold border ${l <= threatLevel ? 'border-transparent' : 'border-white/10 bg-white/5 text-slate-600'}`}
                style={l <= threatLevel ? { backgroundColor: ['#22c55e','#84cc16','#eab308','#f97316','#ef4444'][l-1], color: '#000' } : {}}>
                {l}
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="flex justify-center py-4">
          <RadialGauge value={Math.min(100, threatScore)} label="Threat Score" size={150} colorScheme="threat" />
        </GlassCard>
        <GlassCard>
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-3">Active Exploits</h3>
          <p className="text-3xl font-mono text-red-400">{activeExploits}</p>
          <p className="text-xs text-slate-500 mt-1">Known exploited vulnerabilities (CISA KEV)</p>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Critical CVEs in Feed</span>
              <span className="text-red-400 font-mono">{criticalCount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">High CVEs in Feed</span>
              <span className="text-orange-400 font-mono">{cves.filter(c=>c.severity==='HIGH').length}</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Attack Timeline */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">📊 CVE Severity — Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={WEEK_DATA}>
            <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="CRITICAL" stackId="a" fill="#ef4444" />
            <Bar dataKey="HIGH" stackId="a" fill="#f97316" />
            <Bar dataKey="MEDIUM" stackId="a" fill="#eab308" />
            <Bar dataKey="LOW" stackId="a" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* CVE Table */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">🔍 Recent CVEs (Last 7 Days)</h2>
        {loading ? (
          <div className="h-32 glass-card rounded-xl animate-pulse" />
        ) : cves.length === 0 ? (
          <GlassCard className="text-center text-slate-500 py-8">
            CVE data unavailable (NVD rate limit or network error)
          </GlassCard>
        ) : (
          <DataTable data={cves as unknown as Record<string, unknown>[]} columns={cveColumns as unknown as Column<Record<string, unknown>>[]} searchable pageSize={10} />
        )}
      </div>
    </div>
  );
}
