# ⚡ TechPulse

> A deeply technical, futuristic real-time monitoring dashboard for the entire tech ecosystem.

**TechPulse** is a production-ready, Next.js 15 cyberpunk mission control dashboard that aggregates live data across 12 domains of the technology world — from GitHub trending repos and CVE feeds to AI benchmarks and crypto markets.

![TechPulse Dashboard](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan?style=flat-square&logo=tailwindcss)

---

## 🚀 Features

### 12 Modular Routes

| Route | Description |
|-------|-------------|
| `/` | **Overview** — TechPulse Score hero gauge, 8 MetricCards, 4 mini gauges, live feed |
| `/open-source` | GitHub trending repos, npm download rankings, ecosystem counters, language breakdown |
| `/internet` | 20 service status monitors, live SSL certificate stream, internet counters |
| `/security` | NVD CVE feed (CVSS color-coded), DEFCON-style threat level, attack timeline |
| `/ai` | **FLAGSHIP** — Model leaderboard, benchmark radar, arXiv papers, HuggingFace trending, GPU market, AI timeline |
| `/crypto` | CoinGecko top 25 with sparklines, Fear & Greed gauge, DeFi TVL, BTC dominance |
| `/developer` | Stack Overflow tags, language rankings, framework wars npm comparison, salary benchmarks |
| `/startups` | Product Hunt RSS, VC funding tracker, unicorn counter, sector allocation |
| `/news` | Hacker News (5 tabs), Reddit (5 subreddits), Dev.to, unified terminal feed |
| `/gaming` | Steam concurrent counter, top games table, gaming revenue, market segments |
| `/social` | Platform content counters (YouTube, TikTok, Instagram, Twitter, etc.) |
| `/insights` | TechPulse Health Score composite gauge, cross-domain correlation alerts, daily summary |

### Design
- **Cyberpunk mission control** — Dark `#0A0E1A` background
- Neon **cyan (#00FFFF)** and electric **green (#00FF88)** accents
- **Glassmorphism** cards (`backdrop-blur-xl bg-white/[0.03] border border-white/[0.08]`)
- Monospace data readouts (JetBrains Mono for numbers via CSS)
- Radial gauges, animated ticking counters, terminal-style feeds

### Reusable Components

- **`GlassCard`** — Glassmorphism wrapper with hover glow
- **`RadialGauge`** — `react-gauge-component` wrapper with neon arcs, multiple color schemes
- **`AnimatedCounter`** — Count-up + ticking mode via `requestAnimationFrame`, neon text-shadow
- **`TerminalFeed`** — Monospace green-on-black auto-scrolling feed, pause on hover, FIFO 200 entries
- **`DataTable`** — Sortable columns, filterable, paginated, row hover glow
- **`MetricCard`** — Icon + label + value + change arrow

---

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/maneetchatterjee/techpulse.git
cd techpulse
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

---

## 🏗️ Architecture

```
techpulse/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Overview dashboard
│   ├── open-source/        # Module 1
│   ├── internet/           # Module 2
│   ├── security/           # Module 3
│   ├── ai/                 # Module 4 (Flagship)
│   ├── crypto/             # Module 5
│   ├── developer/          # Module 6
│   ├── startups/           # Module 7
│   ├── news/               # Module 8
│   ├── gaming/             # Module 9
│   ├── social/             # Module 10
│   └── insights/           # Module 11
├── components/             # Reusable UI components
│   ├── Sidebar.tsx         # Collapsible nav (localStorage state)
│   ├── GlassCard.tsx       # Glassmorphism wrapper
│   ├── RadialGauge.tsx     # react-gauge-component wrapper
│   ├── AnimatedCounter.tsx # Ticking counter with rAF
│   ├── TerminalFeed.tsx    # Live scrolling terminal feed
│   ├── DataTable.tsx       # Sortable/filterable table
│   └── MetricCard.tsx      # KPI card component
├── hooks/                  # Data fetching hooks
│   ├── useGitHubTrending.ts
│   ├── useNpmStats.ts
│   ├── useServiceStatus.ts
│   ├── useCVEData.ts
│   ├── useArxivPapers.ts
│   ├── useHuggingFace.ts
│   ├── useCryptoData.ts
│   ├── useDeFiData.ts
│   ├── useStackOverflow.ts
│   ├── useHackerNews.ts
│   ├── useRedditFeed.ts
│   ├── useDevTo.ts
│   └── useProductHunt.ts
└── lib/                    # Static data & constants
    ├── aiBenchmarks.ts     # AI model benchmark scores
    ├── gpuData.ts          # GPU specs & pricing
    ├── fundingData.ts      # VC funding rounds
    ├── gamingData.ts       # Steam games data
    ├── socialData.ts       # Social media counters
    └── breachData.ts       # Security breach events
```

---

## 📡 API Sources

All APIs are **free tier / no authentication required**:

| Module | API | Rate Limit |
|--------|-----|------------|
| Open Source | [GitHub Search API](https://docs.github.com/en/rest/search) | 60 req/hr (unauth) |
| Open Source | [npm Downloads API](https://github.com/npm/registry/blob/master/docs/download-counts.md) | Generous |
| Internet | [Statuspage API v2](https://developer.statuspage.io/) | Per service |
| Security | [NVD CVE 2.0 API](https://nvd.nist.gov/developers/vulnerabilities) | 5 req/30s (no key) |
| AI | [arXiv API](https://arxiv.org/help/api/) | Reasonable use |
| AI | [HuggingFace API](https://huggingface.co/docs/api-inference) | Public endpoints |
| Crypto | [CoinGecko API](https://docs.coingecko.com/reference/introduction) | 10-30 req/min |
| Crypto | [Alternative.me Fear & Greed](https://alternative.me/crypto/fear-and-greed-index/) | Public |
| Crypto | [DeFi Llama API](https://defillama.com/docs/api) | Public |
| Developer | [Stack Exchange API](https://api.stackexchange.com/) | 300 req/day |
| News | [Hacker News Firebase API](https://github.com/HackerNews/API) | Public |
| News | [Reddit JSON API](https://www.reddit.com/dev/api) | Public |
| News | [Dev.to API](https://developers.forem.com/api) | Public |
| Startups | [rss2json (Product Hunt RSS)](https://rss2json.com/) | 10K req/day |

---

## 🔧 Technical Stack

| Technology | Usage |
|------------|-------|
| [Next.js 15](https://nextjs.org/) | App Router, SSR/Static |
| [TypeScript 5](https://www.typescriptlang.org/) | End-to-end type safety |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Recharts 3](https://recharts.org/) | Bar, Line, Pie, Radar charts |
| [react-gauge-component](https://www.npmjs.com/package/react-gauge-component) | Radial gauge visualizations |
| [framer-motion](https://www.framer.com/motion/) | Page transitions (ready) |

---

## 📊 Key Technical Features

1. **TypeScript throughout** — All hooks, components, and data files strictly typed
2. **Hook-based data fetching** — Each module manages its own fetch/cache/error/loading state
3. **Skeleton/shimmer loaders** — Animated placeholders while fetching
4. **Graceful fallbacks** — "Data unavailable" fallback per component
5. **API rate limiting** — NVD (5/30s), CoinGecko (2min refresh), GitHub (15min refresh)
6. **30+ radial gauges** — Across all modules with color-coded arcs
7. **50+ ticking counters** — Real estimation models using `requestAnimationFrame`
8. **Responsive sidebar** — Collapses to icons on click, hamburger on mobile
9. **localStorage persistence** — Sidebar state preserved across sessions

---

## 🧠 AI Module Highlights (Flagship)

The AI & ML page is the most technically comprehensive section:

- **Model Leaderboard** — 10 frontier models × 6 benchmarks (MMLU, HumanEval, GPQA, MATH, ARC, HellaSwag), sortable by any column, filterable by open/closed type and provider
- **Benchmark Radar** — Overlaid RadarChart comparing up to 5 selected models, click model names in the table to toggle
- **Benchmark Explainer** — Expandable descriptions for each benchmark: full name, methodology, what it tests, why it matters
- **arXiv Feed** — Live paper feed with category filtering (cs.AI/LG/CL/CV/NE), search, expandable abstracts with PDF links
- **HuggingFace Trending** — Models/Datasets/Spaces tabs with downloads and likes
- **GPU Market Analysis** — H100/H200/A100/L40S/RTX4090/MI300X/TPU v5e/v5p with TFLOPS, $/hr, availability badges
- **AI Timeline** — Annotated milestones from Transformer (2017) through Reasoning Models Era (2025)
- **Open vs Closed Gap** — Side-by-side benchmark comparison with gap indicators
- **Ticking Counters** — ChatGPT queries (~2,894/sec), AI images (~926/sec), Copilot completions (~579/sec)

---

## License

MIT
