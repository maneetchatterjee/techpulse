'use client';

import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import TerminalFeed from '@/components/TerminalFeed';
import { useHackerNews } from '@/hooks/useHackerNews';
import { useRedditFeed } from '@/hooks/useRedditFeed';
import { useDevTo } from '@/hooks/useDevTo';

type HNTab = 'top' | 'best' | 'new' | 'ask' | 'show';

function timeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000 - timestamp);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NewsPage() {
  const { stories, loading: hnLoading } = useHackerNews();
  const { posts, subreddits, loading: redditLoading } = useRedditFeed();
  const { articles, loading: devtoLoading } = useDevTo();
  const [hnTab, setHnTab] = useState<HNTab>('top');
  const [redditTab, setRedditTab] = useState('programming');
  const [showSources, setShowSources] = useState({ hn: true, reddit: true, devto: true });

  const allStories = stories[hnTab] || [];
  const currentRedditPosts = posts[redditTab] || [];

  const unifiedFeed = [
    ...(showSources.hn ? allStories.slice(0, 10).map((s) => ({
      id: `hn-${s.id}`,
      time: timeAgo(s.time),
      source: 'HN',
      message: `[${s.score}pts] ${s.title}`,
      color: 'text-orange-400',
    })) : []),
    ...(showSources.reddit ? (posts['programming'] || []).slice(0, 8).map((p) => ({
      id: `reddit-${p.id}`,
      time: timeAgo(p.created_utc),
      source: 'r/prog',
      message: `[↑${p.score}] ${p.title}`,
      color: 'text-orange-400',
    })) : []),
    ...(showSources.devto ? articles.slice(0, 6).map((a) => ({
      id: `devto-${a.id}`,
      time: new Date(a.published_at).toLocaleDateString(),
      source: 'dev.to',
      message: `${a.title} (♥${a.public_reactions_count})`,
      color: 'text-purple-400',
    })) : []),
  ].sort(() => Math.random() - 0.5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cyan-400 neon-text-cyan" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          📰 Tech News Intelligence
        </h1>
        <p className="text-slate-500 text-sm">Hacker News, Reddit, Dev.to aggregated</p>
      </div>

      {/* Hacker News */}
      <GlassCard>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">🔥 Hacker News</h2>
          <div className="flex gap-1">
            {(['top', 'best', 'new', 'ask', 'show'] as HNTab[]).map((t) => (
              <button key={t} onClick={() => setHnTab(t)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${hnTab === t ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500 hover:text-slate-300'}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {hnLoading ? (
          <div className="space-y-2">{Array.from({length:8}).map((_,i)=><div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse"/>)}</div>
        ) : (
          <div className="space-y-1">
            {allStories.slice(0, 20).map((story, i) => (
              <div key={story.id} className="flex items-start gap-3 py-1.5 px-2 rounded hover:bg-white/[0.02] transition-colors">
                <span className="text-slate-600 text-xs font-mono w-5 flex-shrink-0">{i + 1}.</span>
                <div className="flex-1 min-w-0">
                  <a href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-sm text-slate-200 hover:text-cyan-400 transition-colors line-clamp-1">
                    {story.title}
                  </a>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-mono font-bold ${story.score >= 500 ? 'text-yellow-400' : story.score >= 200 ? 'text-cyan-400' : story.score >= 100 ? 'text-green-400' : 'text-slate-500'}`}>
                      ▲ {story.score}
                    </span>
                    <span className="text-xs text-slate-600">by {story.by}</span>
                    <span className="text-xs text-slate-600">{story.descendants} comments</span>
                    <span className="text-xs text-slate-600">{timeAgo(story.time)}</span>
                  </div>
                </div>
              </div>
            ))}
            {allStories.length === 0 && <div className="text-center text-slate-500 py-4">Data unavailable</div>}
          </div>
        )}
      </GlassCard>

      {/* Reddit Feed */}
      <GlassCard>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">👽 Reddit</h2>
          <div className="flex gap-1 flex-wrap">
            {subreddits.map((sub) => (
              <button key={sub} onClick={() => setRedditTab(sub)}
                className={`px-2 py-0.5 rounded text-xs font-medium transition-all ${redditTab === sub ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500 hover:text-slate-300'}`}>
                r/{sub}
              </button>
            ))}
          </div>
        </div>
        {redditLoading ? (
          <div className="space-y-2">{Array.from({length:6}).map((_,i)=><div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse"/>)}</div>
        ) : currentRedditPosts.length > 0 ? (
          <div className="space-y-1">
            {currentRedditPosts.slice(0, 15).map((post) => (
              <a key={post.id} href={`https://reddit.com${post.permalink}`} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-3 py-1.5 px-2 rounded hover:bg-white/[0.02] transition-colors block">
                <span className={`text-xs font-mono font-bold flex-shrink-0 w-12 text-right ${post.score >= 1000 ? 'text-yellow-400' : 'text-slate-500'}`}>↑{post.score >= 1000 ? `${(post.score/1000).toFixed(1)}K` : post.score}</span>
                <div>
                  <p className="text-sm text-slate-200 line-clamp-1">{post.title}</p>
                  <p className="text-xs text-slate-600">{post.num_comments} comments · {timeAgo(post.created_utc)}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-4">Data unavailable</div>
        )}
      </GlassCard>

      {/* Dev.to */}
      <GlassCard>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">💻 Dev.to Trending</h2>
        {devtoLoading ? (
          <div className="grid grid-cols-2 gap-3">{Array.from({length:6}).map((_,i)=><div key={i} className="h-24 bg-white/5 rounded-lg animate-pulse"/>)}</div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {articles.slice(0, 8).map((article) => (
              <a key={article.id} href={article.url} target="_blank" rel="noopener noreferrer"
                className="glass-card rounded-lg p-3 hover:border-purple-500/30 block transition-all">
                <p className="text-sm font-semibold text-slate-200 line-clamp-2">{article.title}</p>
                <p className="text-xs text-slate-500 mt-1">by {article.user.name} · {article.reading_time_minutes}min read</p>
                <div className="flex gap-3 mt-1 text-xs">
                  <span className="text-red-400">♥ {article.public_reactions_count}</span>
                  <span className="text-slate-500">💬 {article.comments_count}</span>
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {article.tag_list.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs px-1 py-0.5 bg-purple-500/10 text-purple-400 rounded">{t}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-4">Data unavailable</div>
        )}
      </GlassCard>

      {/* Unified Feed */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">⚡ Unified Feed</h2>
          <div className="flex gap-2 text-xs">
            {(['hn', 'reddit', 'devto'] as const).map((src) => (
              <button key={src} onClick={() => setShowSources((prev) => ({ ...prev, [src]: !prev[src] }))}
                className={`px-2 py-0.5 rounded border transition-all ${showSources[src] ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10' : 'border-white/10 text-slate-500'}`}>
                {src}
              </button>
            ))}
          </div>
        </div>
        <TerminalFeed entries={unifiedFeed} height="h-56" title="📡 UNIFIED TECH NEWS FEED" />
      </div>
    </div>
  );
}
