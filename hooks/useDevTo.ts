'use client';

import { useState, useEffect, useCallback } from 'react';

export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  url: string;
  cover_image: string | null;
  tag_list: string[];
  public_reactions_count: number;
  comments_count: number;
  reading_time_minutes: number;
  user: { name: string; username: string };
  published_at: string;
}

export function useDevTo() {
  const [articles, setArticles] = useState<DevToArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('https://dev.to/api/articles?per_page=20&top=1');
      if (!res.ok) throw new Error('Dev.to API error');
      const data = await res.json();
      setArticles(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch Dev.to');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { articles, loading, error };
}
