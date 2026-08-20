'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('owner@devfusion.io');
  const [password, setPassword] = useState('DemoPass2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false
    });

    if (res?.error) {
      setError('Invalid credentials');
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-600 rounded-xl text-white font-black text-2xl mb-3">DF</div>
          <h2 className="text-2xl font-black text-white">DevFusion</h2>
          <p className="text-xs text-slate-400 mt-1">Enterprise Project & Collaboration Platform</p>
        </div>

        {error && <div className="p-3 mb-4 bg-red-950/50 border border-red-800 text-red-300 text-xs rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Don't have an account? <Link href="/register" className="text-indigo-400 hover:text-indigo-300">Register</Link>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">Pre-configured demo accounts (password: DemoPass2026!):</p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-[11px] font-mono text-slate-300">
            <button type="button" onClick={() => setEmail('owner@devfusion.io')} className="p-1 bg-slate-800 rounded hover:bg-slate-700">
              Workspace Owner
            </button>
            <button type="button" onClick={() => setEmail('pm@devfusion.io')} className="p-1 bg-slate-800 rounded hover:bg-slate-700">
              Project Manager
            </button>
            <button type="button" onClick={() => setEmail('dev@devfusion.io')} className="p-1 bg-slate-800 rounded hover:bg-slate-700">
              Team Member
            </button>
            <button type="button" onClick={() => setEmail('client@devfusion.io')} className="p-1 bg-slate-800 rounded hover:bg-slate-700">
              Client Viewer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
