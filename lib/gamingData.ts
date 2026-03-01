export interface TopGame {
  rank: number;
  name: string;
  genre: string;
  peakPlayers: number;
  currentPlayers: number;
  platform: string;
  releaseYear: number;
}

export const topSteamGames: TopGame[] = [
  { rank: 1, name: 'Counter-Strike 2', genre: 'FPS', peakPlayers: 1818773, currentPlayers: 947000, platform: 'Steam', releaseYear: 2023 },
  { rank: 2, name: 'Dota 2', genre: 'MOBA', peakPlayers: 1295114, currentPlayers: 422000, platform: 'Steam', releaseYear: 2013 },
  { rank: 3, name: 'PUBG: Battlegrounds', genre: 'Battle Royale', peakPlayers: 3257248, currentPlayers: 197000, platform: 'Steam', releaseYear: 2017 },
  { rank: 4, name: 'Baldur\'s Gate 3', genre: 'RPG', peakPlayers: 875343, currentPlayers: 87000, platform: 'Steam', releaseYear: 2023 },
  { rank: 5, name: 'Cyberpunk 2077', genre: 'RPG', peakPlayers: 1054388, currentPlayers: 52000, platform: 'Steam', releaseYear: 2020 },
  { rank: 6, name: 'Palworld', genre: 'Survival', peakPlayers: 2101867, currentPlayers: 27000, platform: 'Steam', releaseYear: 2024 },
  { rank: 7, name: 'Elden Ring', genre: 'Action RPG', peakPlayers: 953426, currentPlayers: 45000, platform: 'Steam', releaseYear: 2022 },
  { rank: 8, name: 'Rust', genre: 'Survival', peakPlayers: 244151, currentPlayers: 72000, platform: 'Steam', releaseYear: 2018 },
  { rank: 9, name: 'Apex Legends', genre: 'Battle Royale', peakPlayers: 510000, currentPlayers: 148000, platform: 'Steam', releaseYear: 2019 },
  { rank: 10, name: 'Destiny 2', genre: 'FPS', peakPlayers: 330000, currentPlayers: 35000, platform: 'Steam', releaseYear: 2019 },
];

export const steamConcurrentBaseline = 35_000_000;
export const gamingRevenuePerYear = 200_000_000_000; // $200B
export const mobileGamingRevenue = 92_000_000_000; // $92B
export const esportsRevenue = 1_800_000_000; // $1.8B
