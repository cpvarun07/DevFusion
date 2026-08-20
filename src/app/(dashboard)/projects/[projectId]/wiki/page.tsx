import React from 'react';
import { prisma } from '@/lib/prisma';
import WikiEditor from '@/components/WikiEditor';
import { notFound } from 'next/navigation';

export default async function ProjectWikiPage({ params }: { params: { projectId: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    include: { wikiPages: true }
  });

  if (!project) return notFound();

  const page = project.wikiPages[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">{project.name} — Wiki</h1>
        <p className="text-sm text-slate-400">Nested markdown documentation for this project</p>
      </div>

      {page ? (
        <WikiEditor pageId={page.id} initialTitle={page.title} initialContent={page.content} />
      ) : (
        <p className="text-sm text-slate-500">No wiki pages yet for this project.</p>
      )}
    </div>
  );
}
