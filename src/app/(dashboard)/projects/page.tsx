import React from 'react';
import { prisma } from '@/lib/prisma';
import KanbanBoard from '@/components/KanbanBoard';

export default async function ProjectsPage() {
  const project = await prisma.project.findFirst({
    include: {
      tasks: {
        include: { assignee: true },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!project) {
    return (
      <div className="text-sm text-slate-400">
        No project found. Run <code className="text-indigo-400">npm run db:seed</code> to load demo data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-indigo-400 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded">
          {project.key}
        </span>
        <h1 className="text-2xl font-black text-white mt-2">{project.name}</h1>
        <p className="text-sm text-slate-400">{project.description}</p>
      </div>

      <KanbanBoard initialTasks={project.tasks as any} projectId={project.id} />
    </div>
  );
}
