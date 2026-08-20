import { PrismaClient, Role, Priority, TaskStatus, SprintStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding DevFusion database...');
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User", "Workspace", "WorkspaceMember", "Project", "Task", "Sprint", "Subtask", "ActivityLog", "Notification", "WikiPage" CASCADE;`);

  const passwordHash = await bcrypt.hash('DemoPass2026!', 10);

  const admin = await prisma.user.create({
    data: { email: 'admin@devfusion.io', name: 'DevFusion Admin', passwordHash, emailVerified: true }
  });

  const owner = await prisma.user.create({
    data: { email: 'owner@devfusion.io', name: 'Workspace Owner', passwordHash, emailVerified: true }
  });

  const pm = await prisma.user.create({
    data: { email: 'pm@devfusion.io', name: 'Sarah PM (Project Manager)', passwordHash, emailVerified: true }
  });

  const dev = await prisma.user.create({
    data: { email: 'dev@devfusion.io', name: 'Rithik Dev (Team Member)', passwordHash, emailVerified: true }
  });

  const client = await prisma.user.create({
    data: { email: 'client@devfusion.io', name: 'Alex Client (Client Viewer)', passwordHash, emailVerified: true }
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: 'Acme SaaS Corp',
      slug: 'acme-corp',
      members: {
        create: [
          { userId: owner.id, role: Role.WORKSPACE_OWNER },
          { userId: pm.id, role: Role.PROJECT_MANAGER },
          { userId: dev.id, role: Role.TEAM_MEMBER },
          { userId: client.id, role: Role.CLIENT },
          { userId: admin.id, role: Role.ADMIN }
        ]
      },
      settings: {
        create: {
          allowedFileTypes: ['png', 'jpg', 'pdf', 'zip'],
          maxFileSizeMb: 50
        }
      }
    }
  });

  const project = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: 'NextGen Cloud Platform',
      key: 'NGC',
      description: 'Enterprise unified project collaboration and issue management platform.',
      priority: Priority.HIGH,
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
    }
  });

  const sprint = await prisma.sprint.create({
    data: {
      projectId: project.id,
      name: 'Sprint 1: Core Engine Release',
      goal: 'Deliver auth, Kanban board, sprint metrics, and AI task engine',
      capacity: 40,
      status: SprintStatus.ACTIVE,
      startDate: new Date(),
      endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    }
  });

  const tasks = [
    { title: 'Implement RBAC Middleware with Server Guards', status: TaskStatus.COMPLETED, priority: Priority.HIGH, points: 5, assigneeId: dev.id },
    { title: 'Refactor Drag-and-Drop Kanban Board with Optimistic UI', status: TaskStatus.TESTING, priority: Priority.HIGH, points: 5, assigneeId: dev.id },
    { title: 'Sprint Burndown & Velocity Analytics Engine', status: TaskStatus.CODE_REVIEW, priority: Priority.MEDIUM, points: 3, assigneeId: dev.id },
    { title: 'AI Task Prioritization & Workload Balancer', status: TaskStatus.IN_PROGRESS, priority: Priority.URGENT, points: 8, assigneeId: dev.id },
    { title: 'Rich Markdown Wiki Documentation System', status: TaskStatus.TODO, priority: Priority.MEDIUM, points: 5, assigneeId: pm.id },
    { title: 'Real-Time Notification Dispatch on Task Assignment', status: TaskStatus.BACKLOG, priority: Priority.LOW, points: 2, assigneeId: dev.id }
  ];

  for (let i = 0; i < tasks.length; i++) {
    const t = tasks[i];
    await prisma.task.create({
      data: {
        projectId: project.id,
        sprintId: sprint.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        storyPoints: t.points,
        assigneeId: t.assigneeId,
        reporterId: pm.id,
        order: i,
        subtasks: {
          create: [{ title: 'Unit & integration validation', completed: t.status === TaskStatus.COMPLETED }]
        }
      }
    });
  }

  await prisma.wikiPage.create({
    data: {
      projectId: project.id,
      title: 'Architecture Blueprint & API Docs',
      content: '# Architecture Overview\n\nDevFusion integrates board, wiki, and notification workflows into a single, high-performance platform.\n\n### Tech Stack\n- Next.js 14 App Router\n- Prisma ORM + PostgreSQL\n- Tailwind CSS + NextAuth'
    }
  });

  await prisma.activityLog.createMany({
    data: [
      { workspaceId: workspace.id, projectId: project.id, userId: pm.id, action: 'Created project NextGen Cloud Platform' },
      { workspaceId: workspace.id, projectId: project.id, userId: pm.id, action: 'Started Sprint 1: Core Engine Release' },
      { workspaceId: workspace.id, projectId: project.id, userId: dev.id, action: 'Moved task "Implement RBAC Middleware" to COMPLETED' }
    ]
  });

  console.log('Seed data ready with demo accounts for all roles.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
