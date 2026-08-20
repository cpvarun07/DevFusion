import React from 'react';
import { prisma } from '@/lib/prisma';
import BurndownChart from '@/components/BurndownChart';
import { notFound } from 'next/navigation';

export default async function ProjectSprintsPage({ params }: { params: { projectId: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: { sprints: { include: { tasks: true } } }
  });

  if (!project) return notFound();

  const activeSprint = project.sprints.find(s => s.status === 'ACTIVE') || project.sprints[0];
  const totalPoints = activeSprint?.tasks.reduce((sum, t) => sum + t.storyPoints, 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">{project.name} — Sprints</h1>
        <p className="text-sm text-slate-400">Sprint capacity, goals, and burndown tracking</p>
      </div>

      {activeSprint ? (
        <>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-base font-bold text-white">{activeSprint.name}</h2>
            <p className="text-xs text-slate-400 mt-1">{activeSprint.goal}</p>
            <div className="flex gap-6 mt-4 text-xs text-slate-400">
              <span>Capacity: <strong className="text-white">{activeSprint.capacity} pts</strong></span>
              <span>Committed: <strong className="text-white">{totalPoints} pts</strong></span>
              <span>Status: <strong className="text-white">{activeSprint.status}</strong></span>
            </div>
          </div>

          <BurndownChart
            totalPoints={totalPoints}
            sprintLengthDays={7}
            completedByDay={activeSprint.tasks
              .filter(t => t.status === 'COMPLETED')
              .map(() => Math.ceil(totalPoints / 7))}
          />
        </>
      ) : (
        <p className="text-sm text-slate-500">No sprints yet for this project.</p>
      )}
    </div>
  );
}
