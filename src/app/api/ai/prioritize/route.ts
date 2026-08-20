import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { prioritizeTasks } from '@/lib/ai-prioritization';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { projectId } = await req.json();

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: true,
      sprints: { where: { status: 'ACTIVE' } }
    }
  });

  if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

  const activeSprint = project.sprints[0];
  const capacity = activeSprint ? activeSprint.capacity : 30;

  const result = await prioritizeTasks(
    project.tasks.map(t => ({
      id: t.id,
      title: t.title,
      priority: t.priority,
      storyPoints: t.storyPoints,
      dueDate: t.dueDate ? t.dueDate.toISOString() : null,
      status: t.status
    })),
    capacity
  );

  return NextResponse.json(result);
}
