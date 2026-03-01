'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DeFiProtocol {
  name: string;
  tvl: number;
  chainTvls: Record<string, number>;
  change_1d: number;
  change_7d: number;
  category: string;
}

export function useDeFiData() {
  const [protocols, setProtocols] = useState<DeFiProtocol[]>([]);
  const [totalTvl, setTotalTvl] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [protRes, tvlRes] = await Promise.allSettled([
        fetch('https://api.llama.fi/protocols'),
        fetch('https://api.llama.fi/v2/historicalChainTvl'),
      ]);

      if (protRes.status === 'fulfilled' && protRes.value.ok) {
        const data: DeFiProtocol[] = await protRes.value.json();
        setProtocols(data.slice(0, 20));
        setTotalTvl(data.reduce((sum, p) => sum + (p.tvl || 0), 0));
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch DeFi data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { protocols, totalTvl, loading, error };
}
