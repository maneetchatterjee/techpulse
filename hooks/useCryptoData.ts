'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  sparkline_in_7d: { price: number[] };
}

export interface FearGreedData {
  value: number;
  value_classification: string;
  timestamp: string;
}

export interface CryptoGlobal {
  total_market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  market_cap_percentage: Record<string, number>;
  market_cap_change_percentage_24h_usd: number;
}

export function useCryptoData() {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [fearGreed, setFearGreed] = useState<FearGreedData | null>(null);
  const [global, setGlobal] = useState<CryptoGlobal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [coinsRes, fearRes, globalRes] = await Promise.allSettled([
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page=1&sparkline=true&price_change_percentage=1h,24h,7d'),
        fetch('https://api.alternative.me/fng/?limit=1'),
        fetch('https://api.coingecko.com/api/v3/global'),
      ]);

      if (coinsRes.status === 'fulfilled' && coinsRes.value.ok) {
        setCoins(await coinsRes.value.json());
      }
      if (fearRes.status === 'fulfilled' && fearRes.value.ok) {
        const fg = await fearRes.value.json();
        setFearGreed(fg.data?.[0] || null);
      }
      if (globalRes.status === 'fulfilled' && globalRes.value.ok) {
        const g = await globalRes.value.json();
        setGlobal(g.data || null);
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch crypto data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { coins, fearGreed, global, loading, error };
}
