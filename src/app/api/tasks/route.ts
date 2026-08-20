import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/rbac';
import { Role, TaskStatus } from '@prisma/client';

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { taskId, status, order } = body;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { project: { include: { workspace: true } } }
  });

  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: task.project.workspaceId,
        userId: (session.user as any).id
      }
    }
  });

  const userRole = member?.role || Role.CLIENT;

  if (!hasPermission(userRole, 'UPDATE_TASK_STATUS')) {
    return NextResponse.json({ error: 'Forbidden: insufficient privileges' }, { status: 403 });
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: status as TaskStatus,
      ...(order !== undefined ? { order } : {})
    }
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: task.project.workspaceId,
      projectId: task.projectId,
      userId: (session.user as any).id,
      action: `Moved task "${task.title}" to ${status}`
    }
  });

  return NextResponse.json(updatedTask);
}
