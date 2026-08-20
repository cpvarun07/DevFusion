'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  KanbanSquare,
  BookOpen,
  Clock,
  Settings,
  Layers,
  Zap
} from 'lucide-react';

interface SidebarProps {
  projectId?: string;
}

const baseNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects & Boards', href: '/projects', icon: KanbanSquare },
  { name: 'Time Logs', href: '/time-logs', icon: Clock },
  { name: 'Settings', href: '/settings', icon: Settings }
];

export default function Sidebar({ projectId }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    ...baseNavigation.slice(0, 2),
    ...(projectId
      ? [
          {
            name: 'Sprints',
            href: `/projects/${projectId}/sprints`,
            icon: Zap
          },
          {
            name: 'Knowledge Wiki',
            href: `/projects/${projectId}/wiki`,
            icon: BookOpen
          }
        ]
      : []),
    ...baseNavigation.slice(2)
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 min-h-screen">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
        <div className="p-2 bg-indigo-600 rounded-lg text-white font-black text-xl leading-none">
          DF
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          DevFusion
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">
              Acme SaaS Corp
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Enterprise Workspace
          </p>
        </div>
      </div>
    </aside>
  );
}