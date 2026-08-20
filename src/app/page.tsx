import Link from 'next/link';
import { ArrowRight, KanbanSquare, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex p-3 bg-indigo-600 rounded-xl text-white font-black text-2xl mb-6">DF</div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
          DevFusion
        </h1>
        <p className="text-slate-400 mt-4 max-w-xl mx-auto">
          A unified enterprise project and team collaboration platform — Kanban boards, sprints,
          a knowledge wiki, and AI-assisted task prioritization, all in one workspace.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition-colors"
          >
            Sign In <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-20 text-left">
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
            <KanbanSquare className="h-5 w-5 text-indigo-400 mb-3" />
            <h3 className="text-sm font-bold text-white">Kanban Boards</h3>
            <p className="text-xs text-slate-400 mt-1">Six-lane workflow with live status sync.</p>
          </div>
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
            <Sparkles className="h-5 w-5 text-indigo-400 mb-3" />
            <h3 className="text-sm font-bold text-white">AI Prioritization</h3>
            <p className="text-xs text-slate-400 mt-1">Deadline and workload-aware task ordering.</p>
          </div>
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
            <BookOpen className="h-5 w-5 text-indigo-400 mb-3" />
            <h3 className="text-sm font-bold text-white">Knowledge Wiki</h3>
            <p className="text-xs text-slate-400 mt-1">Nested markdown documentation per project.</p>
          </div>
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
            <ShieldCheck className="h-5 w-5 text-indigo-400 mb-3" />
            <h3 className="text-sm font-bold text-white">Role-Based Access</h3>
            <p className="text-xs text-slate-400 mt-1">Server-enforced permissions across 5 roles.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
