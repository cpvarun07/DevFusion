import React from 'react';
import { prisma } from '@/lib/prisma';
import { FolderGit2, CheckCircle, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardPage() {
  const [projectCount, taskCount, completedCount, activities, project] = await Promise.all([
    prisma.project.count(),
    prisma.task.count(),
    prisma.task.count({ where: { status: 'COMPLETED' } }),
    prisma.activityLog.findMany({ take: 6, orderBy: { createdAt: 'desc' }, include: { user: true } }),
    prisma.project.findFirst()
  ]);

  const productivityScore = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-white">Engineering Workspace Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Live metrics across projects, sprints, and team deliveries</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <FolderGit2 className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">{projectCount}</div>
          <p className="text-xs text-emerald-400 mt-1 font-medium">On schedule</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Sprint Velocity</span>
            <Zap className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white">{taskCount} Tasks</div>
          <p className="text-xs text-slate-400 mt-1">Across 6 Kanban lanes</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Work</span>
            <CheckCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{completedCount} Tasks</div>
          <p className="text-xs text-emerald-400 mt-1 font-medium">Production verified</p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Productivity Score</span>
            <TrendingUp className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white">{productivityScore}%</div>
          <p className="text-xs text-purple-400 mt-1 font-medium">Calculated in real-time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-white">Active Projects Overview</h3>
            <Link href="/projects" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {project && (
              <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-800">
                    {project.key}
                  </span>
                  <h4 className="text-sm font-semibold text-white mt-2">{project.name}</h4>
                  <p className="text-xs text-slate-400">{project.description}</p>
                </div>
                <Link
                  href="/projects"
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded-lg text-white transition-colors"
                >
                  Open Board
                </Link>
              </div>
            )}
            {!project && <p className="text-xs text-slate-500">No projects yet. Run the seed script to load demo data.</p>}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-white mb-4">Workspace Activity Feed</h3>
          <div className="space-y-4">
            {activities.map(act => (
              <div key={act.id} className="text-xs border-l-2 border-indigo-500 pl-3 py-1">
                <p className="text-slate-200 font-medium">{act.action}</p>
                <p className="text-slate-500 mt-0.5">by {act.user.name}</p>
              </div>
            ))}
            {activities.length === 0 && <p className="text-xs text-slate-500">No activity yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
