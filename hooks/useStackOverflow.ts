'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SOTag {
  name: string;
  count: number;
  has_synonyms: boolean;
  is_moderator_only: boolean;
  is_required: boolean;
}

export interface SOQuestion {
  question_id: number;
  title: string;
  score: number;
  view_count: number;
  answer_count: number;
  tags: string[];
  link: string;
  creation_date: number;
}

export interface SOSiteInfo {
  total_questions: number;
  total_answers: number;
  total_users: number;
  questions_per_minute: number;
  answers_per_minute: number;
  badges_per_minute: number;
}

export function useStackOverflow() {
  const [tags, setTags] = useState<SOTag[]>([]);
  const [questions, setQuestions] = useState<SOQuestion[]>([]);
  const [siteInfo, setSiteInfo] = useState<SOSiteInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tagsRes, qRes, infoRes] = await Promise.allSettled([
        fetch('https://api.stackexchange.com/2.3/tags?pagesize=20&order=desc&sort=popular&site=stackoverflow'),
        fetch('https://api.stackexchange.com/2.3/questions?pagesize=20&order=desc&sort=activity&site=stackoverflow'),
        fetch('https://api.stackexchange.com/2.3/info?site=stackoverflow'),
      ]);

      if (tagsRes.status === 'fulfilled' && tagsRes.value.ok) {
        const d = await tagsRes.value.json();
        setTags(d.items || []);
      }
      if (qRes.status === 'fulfilled' && qRes.value.ok) {
        const d = await qRes.value.json();
        setQuestions(d.items || []);
      }
      if (infoRes.status === 'fulfilled' && infoRes.value.ok) {
        const d = await infoRes.value.json();
        setSiteInfo(d.items?.[0] || null);
      }
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch SO data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { tags, questions, siteInfo, loading, error };
}
