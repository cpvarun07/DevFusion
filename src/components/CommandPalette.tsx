'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, KanbanSquare, BookOpen, Settings, X } from 'lucide-react';

interface CommandItem {
  label: string;
  href: string;
  icon: React.ElementType;
  keywords: string;
}

const COMMANDS: CommandItem[] = [
  { label: 'Go to Dashboard', href: '/dashboard', icon: LayoutDashboard, keywords: 'home overview metrics' },
  { label: 'Go to Projects & Boards', href: '/projects', icon: KanbanSquare, keywords: 'kanban tasks board' },
  { label: 'Open Knowledge Wiki', href: '/projects/wiki', icon: BookOpen, keywords: 'docs documentation notes' },
  { label: 'Open Settings', href: '/settings', icon: Settings, keywords: 'workspace preferences roles' }
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (!open) return null;

  const filtered = COMMANDS.filter(
    c =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.keywords.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="text-xs text-slate-500 px-3 py-4 text-center">No matching commands</p>
          )}
          {filtered.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setOpen(false);
                  setQuery('');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-slate-800 transition-colors text-left"
              >
                <Icon className="h-4 w-4 text-indigo-400" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
