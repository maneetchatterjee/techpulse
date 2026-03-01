export interface FundingRound {
  company: string;
  sector: string;
  amount: number; // $M
  round: string;
  investors: string;
  date: string;
}

export const fundingRounds: FundingRound[] = [
  { company: 'Anthropic', sector: 'AI', amount: 4000, round: 'Series E', investors: 'Amazon, Google', date: '2024-03' },
  { company: 'xAI', sector: 'AI', amount: 6000, round: 'Series B', investors: 'Andreessen Horowitz, Sequoia', date: '2024-05' },
  { company: 'Mistral AI', sector: 'AI', amount: 600, round: 'Series B', investors: 'a16z, Lightspeed', date: '2024-06' },
  { company: 'Figure AI', sector: 'Robotics', amount: 675, round: 'Series B', investors: 'OpenAI, Microsoft, Nvidia', date: '2024-02' },
  { company: 'Waymo', sector: 'Autonomous', amount: 5600, round: 'Series B', investors: 'Alphabet', date: '2024-10' },
  { company: 'Scale AI', sector: 'AI', amount: 1000, round: 'Series F', investors: 'Amazon, Meta', date: '2024-05' },
  { company: 'Physical Intelligence', sector: 'Robotics', amount: 400, round: 'Series A', investors: 'Bezos, OpenAI', date: '2024-11' },
  { company: 'Harvey AI', sector: 'Legal AI', amount: 100, round: 'Series C', investors: 'GV, OpenAI', date: '2024-06' },
  { company: 'Cohere', sector: 'AI', amount: 500, round: 'Series D', investors: 'Nvidia, Salesforce', date: '2024-07' },
  { company: 'Perplexity AI', sector: 'AI Search', amount: 250, round: 'Series C', investors: 'NEA, IVP', date: '2024-04' },
];

export const sectorAllocation = [
  { sector: 'AI/ML', percentage: 42, color: '#00FFFF' },
  { sector: 'Fintech', percentage: 15, color: '#00FF88' },
  { sector: 'Biotech', percentage: 12, color: '#a78bfa' },
  { sector: 'Robotics', percentage: 10, color: '#fb923c' },
  { sector: 'Climate Tech', percentage: 8, color: '#4ade80' },
  { sector: 'Cybersecurity', percentage: 7, color: '#f87171' },
  { sector: 'Other', percentage: 6, color: '#94a3b8' },
];

export const unicornCount = 1228;
export const unicornsByCountry = [
  { country: 'USA', count: 657 },
  { country: 'China', count: 172 },
  { country: 'India', count: 73 },
  { country: 'UK', count: 56 },
  { country: 'Germany', count: 32 },
  { country: 'France', count: 28 },
  { country: 'Israel', count: 22 },
  { country: 'Canada', count: 18 },
];
