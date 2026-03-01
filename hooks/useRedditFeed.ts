'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  permalink: string;
  score: number;
  num_comments: number;
  author: string;
  created_utc: number;
  subreddit: string;
  thumbnail: string;
}

const SUBREDDITS = ['programming', 'webdev', 'MachineLearning', 'netsec', 'technology'];

export function useRedditFeed() {
  const [posts, setPosts] = useState<Record<string, RedditPost[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled(
        SUBREDDITS.map(async (sub) => {
          const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=25`);
          if (!res.ok) return { sub, posts: [] };
          const data = await res.json();
          const items: RedditPost[] = (data.data?.children || []).map((c: {data: RedditPost}) => ({
            ...c.data,
            subreddit: sub,
          }));
          return { sub, posts: items };
        })
      );
      const map: Record<string, RedditPost[]> = {};
      results.forEach((r) => {
        if (r.status === 'fulfilled') map[r.value.sub] = r.value.posts;
      });
      setPosts(map);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch Reddit');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { posts, subreddits: SUBREDDITS, loading, error };
}
