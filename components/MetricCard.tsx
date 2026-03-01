'use client';

import { ReactNode } from 'react';
import GlassCard from './GlassCard';

interface MetricCardProps {
  icon: string;
  label: string;
  value: ReactNode;
  change?: string;
  changePositive?: boolean;
  sub?: string;
}

export default function MetricCard({ icon, label, value, change, changePositive, sub }: MetricCardProps) {
  return (
    <GlassCard className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-lg">{icon}</span>
        {change && (
          <span className={`text-xs font-mono ${changePositive ? 'text-green-400' : 'text-red-400'}`}>
            {changePositive ? '▲' : '▼'} {change}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
      <div className="text-xl font-bold text-cyan-400 font-mono neon-text-cyan">{value}</div>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </GlassCard>
  );
}
