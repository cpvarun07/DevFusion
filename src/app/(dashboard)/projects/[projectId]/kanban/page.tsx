import React from 'react';
import { prisma } from '@/lib/prisma';
import KanbanBoard from '@/components/KanbanBoard';
import { notFound } from 'next/navigation';

export default async function ProjectKanbanPage({ params }: { params: { projectId: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: {
      tasks: {
        include: { assignee: true },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!project) return notFound();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-indigo-400 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded">
          {project.key}
        </span>
        <h1 className="text-2xl font-black text-white mt-2">{project.name}</h1>
      </div>
      <KanbanBoard initialTasks={project.tasks as any} projectId={project.id} />
    </div>
  );
}
