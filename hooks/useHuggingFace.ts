'use client';

import { useState, useEffect, useCallback } from 'react';

export interface HFModel {
  id: string;
  likes: number;
  downloads: number;
  tags: string[];
  pipeline_tag: string;
}

export interface HFDataset {
  id: string;
  likes: number;
  downloads: number;
  tags: string[];
}

export interface HFSpace {
  id: string;
  likes: number;
  sdk: string;
  tags: string[];
}

export function useHuggingFace() {
  const [models, setModels] = useState<HFModel[]>([]);
  const [datasets, setDatasets] = useState<HFDataset[]>([]);
  const [spaces, setSpaces] = useState<HFSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [modelsRes, datasetsRes, spacesRes] = await Promise.all([
        fetch('https://huggingface.co/api/models?sort=trending&limit=20'),
        fetch('https://huggingface.co/api/datasets?sort=trending&limit=20'),
        fetch('https://huggingface.co/api/spaces?sort=trending&limit=20'),
      ]);

      if (modelsRes.ok) setModels(await modelsRes.json());
      if (datasetsRes.ok) setDatasets(await datasetsRes.json());
      if (spacesRes.ok) setSpaces(await spacesRes.json());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch HuggingFace data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { models, datasets, spaces, loading, error };
}
