import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { AdminBuyingGuide } from '../types';

interface AdminBuyingGuidesProps {
  guides: AdminBuyingGuide[];
  onSaveGuide: (guide: AdminBuyingGuide) => void;
  onDeleteGuide: (id: string) => void;
  onPreviewGuide?: (path: string) => void;
}

export const AdminBuyingGuides: React.FC<AdminBuyingGuidesProps> = ({
  guides,
  onSaveGuide,
  onDeleteGuide,
  onPreviewGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGuide, setEditingGuide] = useState<AdminBuyingGuide | null>(null);

  const filteredGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.bestPick.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenNew = () => {
    setEditingGuide({
      id: `bg-${Date.now()}`,
      title: '',
      slug: '',
      category: 'Audio & Visual',
      itemCount: 5,
      bestPick: '',
      budgetPick: '',
      status: 'draft',
      updatedAt: new Date().toISOString().split('T')[0],
      author: 'Dr. Marcus Vance',
    });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuide || !editingGuide.title.trim()) return;
    onSaveGuide({
      ...editingGuide,
      slug:
        editingGuide.slug ||
        editingGuide.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
    });
    setEditingGuide(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight font-sans">
            Buying Guides & Category Roundups
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Curate authoritative "Best Of" roundups with testing badges and top picks
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Buying Guide</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search guides by title, category, or top pick..."
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
        />
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-md hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold">
                  {guide.category}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                    guide.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {guide.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                {guide.title}
              </h3>

              <div className="rounded-2xl bg-slate-950 p-3 space-y-1 text-xs border border-slate-800/80">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Top Pick:</span>
                  <strong className="text-emerald-400 font-bold truncate max-w-[150px]">
                    {guide.bestPick || 'Pending Selection'}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Budget Pick:</span>
                  <span className="text-blue-300 font-medium truncate max-w-[150px]">
                    {guide.budgetPick || 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800 text-slate-500">
                  <span>Tested Items: {guide.itemCount}</span>
                  <span>By {guide.author}</span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500">Updated {guide.updatedAt}</span>
              <div className="flex items-center gap-1.5">
                {onPreviewGuide && (
                  <button
                    onClick={() => onPreviewGuide(`/buying-guides/${guide.slug}`)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    title="Preview on Public Site"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setEditingGuide(guide)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400"
                  title="Edit Guide"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDeleteGuide(guide.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
                  title="Delete Guide"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Guide Modal */}
      {editingGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingGuide.id.includes('bg-') ? 'Edit Buying Guide' : 'Create New Buying Guide'}
              </h3>
              <button
                onClick={() => setEditingGuide(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Guide Headline Title
                </label>
                <input
                  type="text"
                  value={editingGuide.title}
                  onChange={(e) => setEditingGuide({ ...editingGuide, title: e.target.value })}
                  placeholder="e.g. The 7 Best Noise-Canceling Headphones for Travel"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category Vertical
                  </label>
                  <select
                    value={editingGuide.category}
                    onChange={(e) => setEditingGuide({ ...editingGuide, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                  >
                    <option value="Audio & Visual">Audio & Visual</option>
                    <option value="Computing & Workstations">Computing & Workstations</option>
                    <option value="Smart Living & Automation">Smart Living & Automation</option>
                    <option value="Cameras & Optics">Cameras & Optics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Number of Items Tested
                  </label>
                  <input
                    type="number"
                    value={editingGuide.itemCount}
                    onChange={(e) =>
                      setEditingGuide({ ...editingGuide, itemCount: Number(e.target.value) })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Top / Overall Winner
                  </label>
                  <input
                    type="text"
                    value={editingGuide.bestPick}
                    onChange={(e) => setEditingGuide({ ...editingGuide, bestPick: e.target.value })}
                    placeholder="e.g. Sony WH-1000XM5"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Best Budget Value Option
                  </label>
                  <input
                    type="text"
                    value={editingGuide.budgetPick}
                    onChange={(e) =>
                      setEditingGuide({ ...editingGuide, budgetPick: e.target.value })
                    }
                    placeholder="e.g. Anker Soundcore Space One"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-semibold">Publish Status:</label>
                  <select
                    value={editingGuide.status}
                    onChange={(e) =>
                      setEditingGuide({
                        ...editingGuide,
                        status: e.target.value as 'published' | 'draft',
                      })
                    }
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-white outline-none"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingGuide(null)}
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-sm"
                  >
                    Save Buying Guide
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
