'use client';

import { useState, useEffect, useCallback } from 'react';

export interface TrendingRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
}

export function useGitHubTrending() {
  const [repos, setRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const dateStr = yesterday.toISOString().split('T')[0];
      const res = await fetch(
        `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&per_page=15`
      );
      if (!res.ok) throw new Error('GitHub API error');
      const data = await res.json();
      setRepos(data.items || []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
    const interval = setInterval(fetchTrending, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchTrending]);

  return { repos, loading, error };
}
