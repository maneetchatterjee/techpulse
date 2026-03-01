'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ServiceStatus {
  name: string;
  url: string;
  status: 'operational' | 'degraded' | 'outage' | 'unknown';
  indicator: string;
  description: string;
}

const SERVICES = [
  { name: 'GitHub', url: 'https://www.githubstatus.com/api/v2/status.json' },
  { name: 'Cloudflare', url: 'https://www.cloudflarestatus.com/api/v2/status.json' },
  { name: 'Vercel', url: 'https://www.vercel-status.com/api/v2/status.json' },
  { name: 'npm', url: 'https://status.npmjs.org/api/v2/status.json' },
  { name: 'Discord', url: 'https://discordstatus.com/api/v2/status.json' },
  { name: 'Slack', url: 'https://status.slack.com/api/v2/status.json' },
  { name: 'Stripe', url: 'https://status.stripe.com/api/v2/status.json' },
  { name: 'Twilio', url: 'https://status.twilio.com/api/v2/status.json' },
  { name: 'Datadog', url: 'https://status.datadoghq.com/api/v2/status.json' },
  { name: 'Atlassian', url: 'https://status.atlassian.com/api/v2/status.json' },
  { name: 'DigitalOcean', url: 'https://status.digitalocean.com/api/v2/status.json' },
  { name: 'Heroku', url: 'https://status.heroku.com/api/v2/status.json' },
  { name: 'PagerDuty', url: 'https://status.pagerduty.com/api/v2/status.json' },
  { name: 'Sentry', url: 'https://status.sentry.io/api/v2/status.json' },
  { name: 'MongoDB Atlas', url: 'https://status.mongodb.com/api/v2/status.json' },
  { name: 'Supabase', url: 'https://status.supabase.com/api/v2/status.json' },
  { name: 'Render', url: 'https://status.render.com/api/v2/status.json' },
  { name: 'Netlify', url: 'https://netlifystatus.com/api/v2/status.json' },
  { name: 'Railway', url: 'https://railway.instatus.com/api/v2/status.json' },
  { name: 'Fly.io', url: 'https://status.flyio.net/api/v2/status.json' },
];

function mapIndicator(indicator: string): ServiceStatus['status'] {
  if (indicator === 'none') return 'operational';
  if (indicator === 'minor') return 'degraded';
  if (indicator === 'major' || indicator === 'critical') return 'outage';
  return 'unknown';
}

export function useServiceStatus() {
  const [services, setServices] = useState<ServiceStatus[]>(
    SERVICES.map((s) => ({ name: s.name, url: s.url, status: 'unknown', indicator: '', description: 'Loading...' }))
  );
  const [loading, setLoading] = useState(true);

  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled(
      SERVICES.map(async (svc) => {
        try {
          const res = await fetch(svc.url, { signal: AbortSignal.timeout(5000) });
          if (!res.ok) throw new Error('error');
          const data = await res.json();
          const indicator = data.status?.indicator || 'unknown';
          const description = data.status?.description || 'Unknown';
          return {
            name: svc.name,
            url: svc.url,
            status: mapIndicator(indicator),
            indicator,
            description,
          } satisfies ServiceStatus;
        } catch {
          return {
            name: svc.name,
            url: svc.url,
            status: 'unknown' as const,
            indicator: 'unknown',
            description: 'Unavailable',
          } satisfies ServiceStatus;
        }
      })
    );

    setServices(results.map((r) => (r.status === 'fulfilled' ? r.value : {
      name: '',
      url: '',
      status: 'unknown' as const,
      indicator: 'unknown',
      description: 'Error',
    })));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatuses();
    const interval = setInterval(fetchStatuses, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchStatuses]);

  return { services, loading };
}
