'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ArxivPaper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  categories: string[];
  published: string;
  link: string;
  pdfLink: string;
}

export function useArxivPapers() {
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPapers = useCallback(async () => {
    try {
      setLoading(true);
      const query = 'cat:cs.AI+OR+cat:cs.LG+OR+cat:cs.CL+OR+cat:cs.CV+OR+cat:cs.NE';
      const url = `https://export.arxiv.org/api/query?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=50`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('arXiv API error');
      const text = await res.text();

      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'application/xml');
      const entries = Array.from(xml.querySelectorAll('entry'));

      const parsed: ArxivPaper[] = entries.map((entry) => {
        const cats = Array.from(entry.querySelectorAll('category')).map(
          (c) => c.getAttribute('term') || ''
        );
        const authors = Array.from(entry.querySelectorAll('author name')).map((a) => a.textContent || '');
        const links = Array.from(entry.querySelectorAll('link'));
        const pdfLink = links.find((l) => l.getAttribute('title') === 'pdf')?.getAttribute('href') || '';
        const absLink = links.find((l) => l.getAttribute('rel') === 'alternate')?.getAttribute('href') || '';
        const rawId = entry.querySelector('id')?.textContent || '';
        return {
          id: rawId.split('/').pop() || rawId,
          title: entry.querySelector('title')?.textContent?.trim() || '',
          abstract: entry.querySelector('summary')?.textContent?.trim() || '',
          authors: authors.slice(0, 5),
          categories: cats.filter((c) => c.startsWith('cs.')),
          published: (entry.querySelector('published')?.textContent || '').split('T')[0],
          link: absLink,
          pdfLink,
        };
      });

      setPapers(parsed);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch papers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
    const interval = setInterval(fetchPapers, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchPapers]);

  return { papers, loading, error };
}
