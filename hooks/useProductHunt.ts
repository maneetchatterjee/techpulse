'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PHPost {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  enclosure?: { url: string };
}

export function useProductHunt() {
  const [posts, setPosts] = useState<PHPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        'https://api.rss2json.com/v1/api.json?rss_url=https://www.producthunt.com/feed'
      );
      if (!res.ok) throw new Error('Product Hunt RSS error');
      const data = await res.json();
      setPosts(data.items || []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch Product Hunt');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { posts, loading, error };
}
