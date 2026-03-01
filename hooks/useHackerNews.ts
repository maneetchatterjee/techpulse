'use client';

import { useState, useEffect, useCallback } from 'react';

export interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  type: string;
}

type HNTab = 'top' | 'best' | 'new' | 'ask' | 'show';

export function useHackerNews() {
  const [stories, setStories] = useState<Record<HNTab, HNStory[]>>({
    top: [], best: [], new: [], ask: [], show: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTab = useCallback(async (tab: HNTab): Promise<HNStory[]> => {
    const res = await fetch(`https://hacker-news.firebaseio.com/v0/${tab}stories.json`);
    if (!res.ok) return [];
    const ids: number[] = await res.json();
    const top30 = ids.slice(0, 30);
    const items = await Promise.allSettled(
      top30.map(async (id) => {
        const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        if (!r.ok) return null;
        return r.json();
      })
    );
    return items
      .filter((r) => r.status === 'fulfilled' && r.value)
      .map((r) => (r as PromiseFulfilledResult<HNStory>).value);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [top, best, newS, ask, show] = await Promise.all([
        fetchTab('top'),
        fetchTab('best'),
        fetchTab('new'),
        fetchTab('ask'),
        fetchTab('show'),
      ]);
      setStories({ top, best, new: newS, ask, show });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch HN');
    } finally {
      setLoading(false);
    }
  }, [fetchTab]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { stories, loading, error };
}
