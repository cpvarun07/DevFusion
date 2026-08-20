import { Role, Priority, TaskStatus, SprintStatus } from '@prisma/client';

export type { Role, Priority, TaskStatus, SprintStatus };

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface WorkspaceMembership {
  workspaceId: string;
  role: Role;
}
