'use client';

import { useEffect, useRef, useState } from 'react';

interface TerminalEntry {
  id: string;
  time: string;
  source: string;
  message: string;
  color?: string;
}

interface TerminalFeedProps {
  entries: TerminalEntry[];
  height?: string;
  title?: string;
}

export default function TerminalFeed({ entries, height = 'h-64', title }: TerminalFeedProps) {
  const [paused, setPaused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState<TerminalEntry[]>([]);

  useEffect(() => {
    if (!paused) {
      setDisplayed(entries.slice(-200));
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [entries, paused]);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
          <span className="text-xs text-green-400 font-mono">{title}</span>
          <span className={`text-xs font-mono ${paused ? 'text-yellow-400' : 'text-green-400'}`}>
            {paused ? '⏸ PAUSED' : '▶ LIVE'}
          </span>
        </div>
      )}
      <div
        className={`${height} overflow-y-auto bg-black/60 p-3 font-mono text-xs`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {displayed.map((entry) => (
          <div key={entry.id} className="flex gap-2 mb-1 leading-relaxed">
            <span className="text-slate-600 flex-shrink-0">{entry.time}</span>
            <span className={`flex-shrink-0 ${entry.color || 'text-cyan-400'}`}>[{entry.source}]</span>
            <span className="text-green-300/80">{entry.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
