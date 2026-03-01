'use client';

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import GlassCard from '@/components/GlassCard';

import RadialGauge from '@/components/RadialGauge';
import DataTable, { Column } from '@/components/DataTable';
import { useCryptoData, CoinData } from '@/hooks/useCryptoData';
import { useDeFiData, DeFiProtocol } from '@/hooks/useDeFiData';

function PriceChange({ value }: { value: number }) {
  if (!value && value !== 0) return <span className="text-slate-500">—</span>;
  const color = value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-slate-500';
  return <span className={`text-xs font-mono ${color}`}>{value > 0 ? '+' : ''}{value.toFixed(2)}%</span>;
}

function MiniSparkline({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.slice(-20);
  const isUp = pts[pts.length - 1] > pts[0];
  const w = 60, h = 24;
  const points = pts.map((v, i) => `${(i / (pts.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={isUp ? '#22c55e' : '#ef4444'} strokeWidth="1.5" points={points} />
    </svg>
  );
}

export default function CryptoPage() {
  const { coins, fearGreed, global, loading } = useCryptoData();
  const { protocols, totalTvl, loading: defiLoading } = useDeFiData();

  const fearValue = fearGreed ? parseInt(fearGreed.value.toString()) : 65;

  const coinColumns: Column<CoinData>[] = [
    { key: 'market_cap_rank', header: '#', sortable: true, render: (v) => <span className="text-xs text-slate-500 font-mono">{String(v)}</span> },
    {
      key: 'name', header: 'Asset', sortable: true,
      render: (v, row) => (
        <div className="flex items-center gap-2">
          <img src={row.image as string} alt={String(v)} width={20} height={20} className="w-5 h-5 rounded-full" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
          <div>
            <p className="text-xs font-medium text-slate-200">{String(v)}</p>
            <p className="text-xs text-slate-500 uppercase">{String(row.symbol)}</p>
          </div>
        </div>
      ),
    },
    { key: 'current_price', header: 'Price', sortable: true, render: (v) => <span className="text-xs font-mono text-slate-200">${Number(v).toLocaleString()}</span> },
    { key: 'price_change_percentage_1h_in_currency', header: '1h', sortable: true, render: (v) => <PriceChange value={Number(v)} /> },
    { key: 'price_change_percentage_24h_in_currency', header: '24h', sortable: true, render: (v) => <PriceChange value={Number(v)} /> },
    { key: 'price_change_percentage_7d_in_currency', header: '7d', sortable: true, render: (v) => <PriceChange value={Number(v)} /> },
    { key: 'market_cap', header: 'Mkt Cap', sortable: true, render: (v) => {
      const n = Number(v);
      return <span className="text-xs font-mono text-slate-400">${n >= 1e9 ? (n/1e9).toFixed(1)+'B' : (n/1e6).toFixed(0)+'M'}</span>;
    }},
    { key: 'total_volume', header: 'Volume', sortable: true, render: (v) => {
      const n = Number(v);
      return <span className="text-xs font-mono text-slate-400">${n >= 1e9 ? (n/1e9).toFixed(1)+'B' : (n/1e6).toFixed(0)+'M'}</span>;
    }},
    { key: 'sparkline_in_7d', header: '7d Chart', render: (v) => {
      const sparkline = v as { price: number[] } | null;
      return <MiniSparkline data={sparkline?.price || []} />;
    }},
  ];

  const defiColumns: Column<DeFiProtocol>[] = [
    { key: 'name', header: 'Protocol', sortable: true, render: (v) => <span className="text-sm font-medium text-cyan-400">{String(v)}</span> },
    { key: 'category', header: 'Category', render: (v) => <span className="text-xs text-slate-400">{String(v)}</span> },
    { key: 'tvl', header: 'TVL', sortable: true, render: (v) => {
      const n = Number(v);
      return <span className="text-xs font-mono text-green-400">${n >= 1e9 ? (n/1e9).toFixed(2)+'B' : (n/1e6).toFixed(0)+'M'}</span>;
    }},
    { key: 'change_1d', header: '1d%', sortable: true, render: (v) => <PriceChange value={Number(v)} /> },
    { key: 'change_7d', header: '7d%', sortable: true, render: (v) => <PriceChange value={Number(v)} /> },
  ];

  const topDefiData = protocols.slice(0, 10).map((p) => ({ name: p.name, tvl: p.tvl / 1e9 }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 neon-text-cyan" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          🪙 Crypto Intelligence
        </h1>
        <p className="text-slate-500 text-sm">Top coins, fear & greed, DeFi TVL</p>
      </div>

      {/* Hero metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 glass-card rounded-xl animate-pulse" />)
        ) : (
          <>
            {['bitcoin', 'ethereum', 'solana'].map((id) => {
              const coin = coins.find((c) => c.id === id);
              return (
                <GlassCard key={id}>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{id.charAt(0).toUpperCase() + id.slice(1)}</p>
                  <p className="text-xl font-bold font-mono text-cyan-400 neon-text-cyan">
                    ${coin?.current_price.toLocaleString() || 'N/A'}
                  </p>
                  {coin && <PriceChange value={coin.price_change_percentage_24h_in_currency} />}
                </GlassCard>
              );
            })}
            <GlassCard>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Market Cap</p>
              <p className="text-xl font-bold font-mono text-cyan-400 neon-text-cyan">
                ${global ? (global.total_market_cap.usd / 1e12).toFixed(2) + 'T' : 'N/A'}
              </p>
              {global && <span className={`text-xs font-mono ${global.market_cap_change_percentage_24h_usd > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {global.market_cap_change_percentage_24h_usd > 0 ? '+' : ''}{global.market_cap_change_percentage_24h_usd?.toFixed(2)}% 24h
              </span>}
            </GlassCard>
          </>
        )}
      </div>

      {/* Fear & Greed + BTC Dominance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="flex flex-col items-center py-4">
          <RadialGauge value={fearValue} label={`Fear & Greed: ${fearGreed?.value_classification || 'Greed'}`} size={160} colorScheme="sentiment" />
          {fearGreed && <p className="text-xs text-slate-500 mt-1">Updated: {new Date(parseInt(fearGreed.timestamp) * 1000).toLocaleDateString()}</p>}
        </GlassCard>
        <GlassCard className="flex flex-col items-center py-4">
          <RadialGauge
            value={global?.market_cap_percentage.btc || 54}
            label="BTC Dominance"
            unit="%"
            size={160}
          />
        </GlassCard>
        <GlassCard>
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-3">DeFi TVL</h3>
          <p className="text-3xl font-mono text-green-400 neon-text-green">
            ${(totalTvl / 1e9).toFixed(1)}B
          </p>
          <p className="text-xs text-slate-500 mt-1">Total Value Locked across protocols</p>
          {!defiLoading && topDefiData.length > 0 && (
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={topDefiData.slice(0, 6)} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 8 }} />
                <Tooltip contentStyle={{ background: '#0f1629', border: '1px solid rgba(0,255,255,0.2)', borderRadius: 8 }}
                  formatter={(v) => [`$${(v as number).toFixed(2)}B`, 'TVL']} />
                <Bar dataKey="tvl" fill="#00FF88" radius={[2,2,0,0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCard>
      </div>

      {/* Coin Table */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">📊 Top 25 Cryptocurrencies</h2>
        {loading ? (
          <div className="h-64 glass-card rounded-xl animate-pulse" />
        ) : (
          <DataTable
            data={coins as unknown as Record<string, unknown>[]}
            columns={coinColumns as unknown as Column<Record<string, unknown>>[]}
            pageSize={25}
          />
        )}
      </div>

      {/* DeFi Protocols */}
      {!defiLoading && protocols.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">🏦 Top DeFi Protocols</h2>
          <DataTable
            data={protocols as unknown as Record<string, unknown>[]}
            columns={defiColumns as unknown as Column<Record<string, unknown>>[]}
            pageSize={10}
          />
        </div>
      )}
    </div>
  );
}
