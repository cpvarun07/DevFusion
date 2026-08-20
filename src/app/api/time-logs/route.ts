import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = (session.user as any).id;

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId },
    select: {
      workspaceId: true
    }
  });

  const workspaceIds = memberships.map((m) => m.workspaceId);

  const [timeLogs, tasks] = await Promise.all([
    prisma.timeLog.findMany({
      where: { userId },
      include: {
        task: {
          include: {
            project: true
          }
        }
      },
      orderBy: {
        loggedAt: 'desc'
      }
    }),

    prisma.task.findMany({
      where: {
        project: {
          workspaceId: {
            in: workspaceIds
          }
        }
      },
      include: {
        project: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  ]);

  return NextResponse.json({
    timeLogs,
    tasks
  });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = (session.user as any).id;

  const body = await req.json();

  const taskId = String(body.taskId || '');
  const durationMin = Number(body.durationMin);
  const note =
    typeof body.note === 'string' && body.note.trim()
      ? body.note.trim()
      : null;

  if (!taskId) {
    return NextResponse.json(
      { error: 'Task is required' },
      { status: 400 }
    );
  }

  if (!Number.isInteger(durationMin) || durationMin <= 0) {
    return NextResponse.json(
      { error: 'Duration must be a positive number of minutes' },
      { status: 400 }
    );
  }

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: true
    }
  });

  if (!task) {
    return NextResponse.json(
      { error: 'Task not found' },
      { status: 404 }
    );
  }

  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: task.project.workspaceId,
        userId
      }
    }
  });

  if (!member) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  const timeLog = await prisma.timeLog.create({
    data: {
      taskId,
      userId,
      durationMin,
      note
    },
    include: {
      task: {
        include: {
          project: true
        }
      }
    }
  });

  await prisma.activityLog.create({
    data: {
      workspaceId: task.project.workspaceId,
      projectId: task.projectId,
      userId,
      action: `Logged ${durationMin} minutes on "${task.title}"`
    }
  });

  return NextResponse.json(timeLog, { status: 201 });
}