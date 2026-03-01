export interface PlatformCounter {
  platform: string;
  icon: string;
  metric: string;
  ratePerSecond: number;
  baseline: number;
  color: string;
}

export const platformCounters: PlatformCounter[] = [
  { platform: 'YouTube', icon: '▶', metric: 'hours uploaded', ratePerSecond: 8.3, baseline: 0, color: '#FF0000' },
  { platform: 'TikTok', icon: '♪', metric: 'videos uploaded', ratePerSecond: 394, baseline: 0, color: '#69C9D0' },
  { platform: 'Instagram', icon: '📷', metric: 'photos shared', ratePerSecond: 1099, baseline: 0, color: '#E1306C' },
  { platform: 'Twitter/X', icon: '𝕏', metric: 'tweets sent', ratePerSecond: 5787, baseline: 0, color: '#1DA1F2' },
  { platform: 'Reddit', icon: '👽', metric: 'comments posted', ratePerSecond: 695, baseline: 0, color: '#FF6314' },
  { platform: 'Spotify', icon: '🎵', metric: 'streams played', ratePerSecond: 35809, baseline: 0, color: '#1DB954' },
  { platform: 'WhatsApp', icon: '💬', metric: 'messages sent', ratePerSecond: 840277, baseline: 0, color: '#25D366' },
  { platform: 'Discord', icon: '🎮', metric: 'messages sent', ratePerSecond: 11574, baseline: 0, color: '#5865F2' },
];

export const dailyInternetUsers = 5_400_000_000;
export const dailyEmailsSent = 333_000_000_000;
