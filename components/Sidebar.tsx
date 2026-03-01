'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: '⚡', label: 'Overview' },
  { href: '/open-source', icon: '🐙', label: 'Open Source' },
  { href: '/internet', icon: '🌐', label: 'Internet' },
  { href: '/security', icon: '🛡️', label: 'Security' },
  { href: '/ai', icon: '🧠', label: 'AI & ML' },
  { href: '/crypto', icon: '🪙', label: 'Crypto' },
  { href: '/developer', icon: '👩‍💻', label: 'Developer' },
  { href: '/startups', icon: '🚀', label: 'Startups' },
  { href: '/news', icon: '📰', label: 'News' },
  { href: '/gaming', icon: '🎮', label: 'Gaming' },
  { href: '/social', icon: '📱', label: 'Social' },
  { href: '/insights', icon: '🔗', label: 'Insights' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) setCollapsed(stored === 'true');
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar-collapsed', String(next));
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden text-cyan-400 bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-lg p-2"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-40 h-screen flex flex-col
          backdrop-blur-xl bg-black/40 border-r border-cyan-500/20
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-56'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-cyan-500/10">
          {!collapsed && (
            <div>
              <span className="text-cyan-400 font-bold text-lg tracking-wider neon-text-cyan">TECH</span>
              <span className="text-green-400 font-bold text-lg tracking-wider neon-text-green">PULSE</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 pulse-green" />
            {collapsed && <span className="text-xs text-green-400">●</span>}
          </div>
          <button
            onClick={toggleCollapsed}
            className="text-slate-400 hover:text-cyan-400 transition-colors hidden md:block"
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 mx-1 my-0.5 rounded-lg
                  transition-all duration-200 text-sm
                  ${isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-400 neon-text-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }
                `}
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-3 border-t border-cyan-500/10">
          {!collapsed && (
            <p className="text-xs text-slate-600 text-center">
              Live · {new Date().getFullYear()}
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
