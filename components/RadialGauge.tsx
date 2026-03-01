'use client';

import dynamic from 'next/dynamic';

const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

interface RadialGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  size?: number;
  colorScheme?: 'default' | 'threat' | 'sentiment';
}

export default function RadialGauge({
  value,
  min = 0,
  max = 100,
  label,
  unit = '',
  size = 150,
  colorScheme = 'default',
}: RadialGaugeProps) {
  const arcs = colorScheme === 'threat'
    ? [
        { limit: 20, color: '#22c55e' },
        { limit: 40, color: '#84cc16' },
        { limit: 60, color: '#eab308' },
        { limit: 80, color: '#f97316' },
        { limit: 100, color: '#ef4444' },
      ]
    : colorScheme === 'sentiment'
    ? [
        { limit: 25, color: '#ef4444' },
        { limit: 45, color: '#f97316' },
        { limit: 55, color: '#eab308' },
        { limit: 75, color: '#84cc16' },
        { limit: 100, color: '#22c55e' },
      ]
    : [
        { limit: 33, color: '#ef4444' },
        { limit: 66, color: '#eab308' },
        { limit: 100, color: '#00FF88' },
      ];

  const normalized = Math.max(min, Math.min(max, value));
  const percent = ((normalized - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: size, height: size * 0.6 }}>
        <GaugeComponent
          value={percent}
          type="semicircle"
          arc={{
            width: 0.15,
            padding: 0.005,
            cornerRadius: 1,
            subArcs: arcs,
          }}
          pointer={{ type: 'blob', animationDelay: 0 }}
          labels={{
            valueLabel: {
              formatTextValue: () => `${normalized.toFixed(1)}${unit}`,
              style: { fontSize: '28px', fill: '#00FFFF', fontFamily: 'JetBrains Mono, monospace', textShadow: '0 0 10px rgba(0,255,255,0.8)' },
            },
          }}
        />
      </div>
      {label && <p className="text-xs text-slate-400 text-center uppercase tracking-wider">{label}</p>}
    </div>
  );
}
