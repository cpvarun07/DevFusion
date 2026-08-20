'use client';

import React, { useState } from 'react';
import { Save, Eye, Edit3 } from 'lucide-react';

interface WikiEditorProps {
  pageId: string;
  initialTitle: string;
  initialContent: string;
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-white mt-5 mb-2">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-xl font-black text-white mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-slate-100">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-slate-300">$1</li>')
    .replace(/\n\n/gim, '<br/><br/>');
}

export default function WikiEditor({ pageId, initialTitle, initialContent }: WikiEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Wire this up to a wiki API route (e.g. PATCH /api/wiki/[pageId]) when persistence is added.
      await new Promise(resolve => setTimeout(resolve, 400));
      setSavedAt(new Date().toLocaleTimeString());
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="bg-transparent text-lg font-bold text-white focus:outline-none flex-1"
          placeholder="Untitled page"
        />

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                mode === 'edit' ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                mode === 'preview' ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="p-5">
        {mode === 'edit' ? (
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={18}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Write markdown here..."
          />
        ) : (
          <div
            className="prose prose-invert prose-sm max-w-none text-slate-300"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
      </div>

      {savedAt && (
        <div className="px-5 pb-4 text-[11px] text-slate-500">Last saved at {savedAt} · page {pageId}</div>
      )}
    </div>
  );
}
