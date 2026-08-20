import React from 'react';
import { prisma } from '@/lib/prisma';
import { ShieldCheck } from 'lucide-react';

export default async function SettingsPage() {
  const workspace = await prisma.workspace.findFirst({
    include: { members: { include: { user: true } }, settings: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Workspace Settings</h1>
        <p className="text-sm text-slate-400">Members, roles, and workspace-level configuration</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck className="h-4 w-4 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Members & Roles</h2>
        </div>

        <div className="space-y-3">
          {workspace?.members.map(m => (
            <div
              key={m.id}
              className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl"
            >
              <div>
                <p className="text-sm font-medium text-white">{m.user.name}</p>
                <p className="text-xs text-slate-400">{m.user.email}</p>
              </div>
              <span className="text-[11px] font-mono px-2 py-1 bg-slate-900 border border-slate-700 rounded text-indigo-400">
                {m.role}
              </span>
            </div>
          ))}
          {!workspace && <p className="text-xs text-slate-500">No workspace found. Run the seed script.</p>}
        </div>
      </div>

      {workspace?.settings && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-white mb-4">File Upload Policy</h2>
          <div className="text-xs text-slate-400 space-y-1">
            <p>Allowed types: <span className="text-slate-200">{workspace.settings.allowedFileTypes.join(', ')}</span></p>
            <p>Max file size: <span className="text-slate-200">{workspace.settings.maxFileSizeMb} MB</span></p>
          </div>
        </div>
      )}
    </div>
  );
}
