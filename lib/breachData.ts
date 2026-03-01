export interface BreachEvent {
  date: string;
  organization: string;
  records: number; // millions
  type: string;
  severity: 'critical' | 'high' | 'medium';
}

export const recentBreaches: BreachEvent[] = [
  { date: '2024-01', organization: 'AT&T', records: 73, type: 'Data Leak', severity: 'critical' },
  { date: '2024-02', organization: 'Change Healthcare', records: 100, type: 'Ransomware', severity: 'critical' },
  { date: '2024-03', organization: 'Ticketmaster', records: 560, type: 'Data Breach', severity: 'critical' },
  { date: '2024-04', organization: 'Dell', records: 49, type: 'Data Breach', severity: 'high' },
  { date: '2024-05', organization: 'Snowflake', records: 500, type: 'Credential Theft', severity: 'critical' },
  { date: '2024-06', organization: 'TeamViewer', records: 0.1, type: 'Network Intrusion', severity: 'high' },
  { date: '2024-07', organization: 'CrowdStrike', records: 0, type: 'Software Fault', severity: 'critical' },
  { date: '2024-08', organization: 'National Public Data', records: 2900, type: 'Data Leak', severity: 'critical' },
  { date: '2024-09', organization: 'Internet Archive', records: 31, type: 'DDoS + Breach', severity: 'high' },
  { date: '2024-10', organization: 'Salt Typhoon', records: 0, type: 'Nation-State APT', severity: 'critical' },
];

export const activeExploits = 185;
export const criticalCVEsThisYear = 4893;
