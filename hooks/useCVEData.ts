'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CVE {
  id: string;
  description: string;
  cvssScore: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  publishedDate: string;
  modifiedDate: string;
}

export function useCVEData() {
  const [cves, setCves] = useState<CVE[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCVEs = useCallback(async () => {
    try {
      setLoading(true);
      const pubStartDate = new Date();
      pubStartDate.setDate(pubStartDate.getDate() - 7);
      const pubStart = pubStartDate.toISOString().split('.')[0] + '.000';
      const pubEnd = new Date().toISOString().split('.')[0] + '.000';

      const url = `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=${pubStart}&pubEndDate=${pubEnd}&resultsPerPage=50`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`NVD API error: ${res.status}`);
      const data = await res.json();

      const parsed: CVE[] = (data.vulnerabilities || []).map((v: Record<string, unknown>) => {
        const cve = v.cve as Record<string, unknown>;
        const descriptions = cve.descriptions as Array<Record<string, string>>;
        const desc = descriptions.find((d) => d.lang === 'en')?.value || '';
        const metrics = cve.metrics as Record<string, unknown>;
        let cvssScore = 0;
        let severity: CVE['severity'] = 'NONE';

        const cvss31 = (metrics?.cvssMetricV31 as Array<Record<string, unknown>>)?.[0];
        const cvss30 = (metrics?.cvssMetricV30 as Array<Record<string, unknown>>)?.[0];
        const cvss2 = (metrics?.cvssMetricV2 as Array<Record<string, unknown>>)?.[0];

        const metric = cvss31 || cvss30 || cvss2;
        if (metric) {
          const data = metric.cvssData as Record<string, unknown>;
          cvssScore = Number(data?.baseScore) || 0;
          const sev = String(data?.baseSeverity || metric.baseSeverity || '').toUpperCase();
          severity = (['CRITICAL','HIGH','MEDIUM','LOW'].includes(sev) ? sev : 'NONE') as CVE['severity'];
        }

        return {
          id: String(cve.id || ''),
          description: desc.slice(0, 200),
          cvssScore,
          severity,
          publishedDate: String(cve.published || '').split('T')[0],
          modifiedDate: String(cve.lastModified || '').split('T')[0],
        };
      });

      setCves(parsed);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch CVEs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCVEs();
    const interval = setInterval(fetchCVEs, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchCVEs]);

  return { cves, loading, error };
}
