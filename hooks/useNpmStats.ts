'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NpmPackageStat {
  package: string;
  downloads: number;
  period: string;
}

const PACKAGES = ['react', 'next', 'vue', 'svelte', '@angular/core', 'express', 'typescript', 'tailwindcss', 'vite', 'webpack', 'eslint', 'prettier', 'jest', 'vitest', 'bun'];

export function useNpmStats() {
  const [stats, setStats] = useState<NpmPackageStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled(
        PACKAGES.map(async (pkg) => {
          const res = await fetch(`https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(pkg)}`);
          if (!res.ok) return { package: pkg, downloads: 0, period: 'last-week' };
          const data = await res.json();
          return { package: pkg, downloads: data.downloads || 0, period: 'last-week' };
        })
      );
      const data = results.map((r, i) =>
        r.status === 'fulfilled' ? r.value : { package: PACKAGES[i], downloads: 0, period: 'last-week' }
      );
      setStats(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return { stats, loading, error };
}
