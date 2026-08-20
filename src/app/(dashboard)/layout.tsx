import React from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import CommandPalette from '@/components/CommandPalette';
import { prisma } from '@/lib/prisma';

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const project = await prisma.project.findFirst({
    select: {
      id: true
    }
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      <Sidebar projectId={project?.id} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}