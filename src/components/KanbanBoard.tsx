'use client';

import React, { useState } from 'react';
import { TaskStatus, Priority } from '@prisma/client';
import { Sparkles } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  storyPoints: number;
  assignee?: { name: string } | null;
}

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'BACKLOG', label: 'Backlog' },
  { id: 'TODO', label: 'To Do' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'CODE_REVIEW', label: 'Code Review' },
  { id: 'TESTING', label: 'Testing' },
  { id: 'COMPLETED', label: 'Completed' }
];

export default function KanbanBoard({ initialTasks, projectId }: { initialTasks: Task[]; projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status: newStatus } : t)));

    try {
      await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, status: newStatus })
      });
    } catch (e) {
      console.error('Failed to sync status update to server');
    }
  };

  const handleAiPrioritize = async () => {
    setIsAiOptimizing(true);
    try {
      const res = await fetch('/api/ai/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId })
      });
      const data = await res.json();
      setAiInsight(data.reasoning);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiOptimizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <h2 className="text-lg font-bold text-white">Sprint 1 Board</h2>
          <p className="text-xs text-slate-400">Move tasks across active development lanes</p>
        </div>
        <button
          onClick={handleAiPrioritize}
          disabled={isAiOptimizing}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {isAiOptimizing ? 'Analyzing Workload...' : 'AI Prioritize Backlog'}
        </button>
      </div>

      {aiInsight && (
        <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-start gap-3">
          <Sparkles className="h-4 w-4 flex-shrink-0 text-indigo-400 mt-0.5" />
          <div>
            <p className="font-semibold text-indigo-200">AI Optimization Engine Recommendation:</p>
            <p className="mt-1">{aiInsight}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto min-h-[650px]">
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">{col.label}</span>
                <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-400 rounded-full font-mono">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-3">
                {colTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-3.5 bg-slate-800/90 border border-slate-700/80 rounded-lg shadow-sm hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          task.priority === 'URGENT'
                            ? 'bg-red-500/20 text-red-400'
                            : task.priority === 'HIGH'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                        {task.storyPoints} pts
                      </span>
                    </div>

                    <h4 className="text-sm font-medium text-slate-200 mb-3 line-clamp-2 leading-snug">{task.title}</h4>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                      <span>{task.assignee?.name || 'Unassigned'}</span>
                      <select
                        value={task.status}
                        onChange={e => handleStatusChange(task.id, e.target.value as TaskStatus)}
                        className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none"
                      >
                        {COLUMNS.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
