'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  Plus,
  RefreshCw,
  Timer,
  CheckCircle2
} from 'lucide-react';

type Task = {
  id: string;
  title: string;
  project: {
    id: string;
    name: string;
    key: string;
  };
};

type TimeLog = {
  id: string;
  durationMin: number;
  note: string | null;
  loggedAt: string;
  task: {
    title: string;
    project: {
      name: string;
      key: string;
    };
  };
};

export default function TimeLogsClient() {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState('');
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function loadData() {
    setLoading(true);

    try {
      const response = await fetch('/api/time-logs');

      if (!response.ok) {
        throw new Error('Failed to load time logs');
      }

      const data = await response.json();

      setLogs(data.timeLogs || []);
      setTasks(data.tasks || []);
    } catch {
      setMessage('Unable to load time logs.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setMessage('');

    if (!taskId || !duration) {
      setMessage('Please select a task and enter a duration.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/time-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          taskId,
          durationMin: Number(duration),
          note
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save time log');
      }

      setTaskId('');
      setDuration('');
      setNote('');
      setMessage('Time log saved successfully.');

      await loadData();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Failed to save time log.'
      );
    } finally {
      setSaving(false);
    }
  }

  const totalMinutes = useMemo(
    () => logs.reduce((sum, log) => sum + log.durationMin, 0),
    [logs]
  );

  const todayMinutes = useMemo(() => {
    const today = new Date().toDateString();

    return logs
      .filter(
        (log) =>
          new Date(log.loggedAt).toDateString() === today
      )
      .reduce((sum, log) => sum + log.durationMin, 0);
  }, [logs]);

  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;

    return `${hours}h ${mins}m`;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">
            Time Logs
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Track time spent working on project tasks.
          </p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 transition"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Total Logged
              </p>

              <p className="text-2xl font-black text-white">
                {formatDuration(totalMinutes)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Timer className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Today
              </p>

              <p className="text-2xl font-black text-white">
                {formatDuration(todayMinutes)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Entries
              </p>

              <p className="text-2xl font-black text-white">
                {logs.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add time */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Plus className="h-5 w-5 text-indigo-400" />

          <h2 className="font-bold text-white">
            Log Time
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value="">
              Select task
            </option>

            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.project.key} — {task.title}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Minutes"
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500"
          />

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-semibold transition"
          >
            <Plus className="h-4 w-4" />

            {saving ? 'Saving...' : 'Log Time'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-slate-400">
            {message}
          </p>
        )}
      </div>

      {/* Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-800">
          <h2 className="font-bold text-white">
            Recent Time Entries
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading time logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center">
            <Clock className="h-8 w-8 mx-auto text-slate-700 mb-3" />

            <p className="text-sm text-slate-400">
              No time logged yet.
            </p>

            <p className="text-xs text-slate-600 mt-1">
              Add your first time entry above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {logs.map((log) => (
              <div
                key={log.id}
                className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400">
                      {log.task.project.key}
                    </span>

                    <span className="text-sm font-semibold text-white truncate">
                      {log.task.title}
                    </span>
                  </div>

                  {log.note && (
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {log.note}
                    </p>
                  )}

                  <p className="text-[11px] text-slate-600 mt-1">
                    {formatDate(log.loggedAt)}
                  </p>
                </div>

                <div className="text-sm font-bold text-slate-300 whitespace-nowrap">
                  {formatDuration(log.durationMin)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}