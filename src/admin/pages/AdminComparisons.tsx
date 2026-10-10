import React, { useState } from 'react';
import {
  Scale,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Award,
  Zap,
  ArrowRight,
  X,
} from 'lucide-react';
import { AdminComparison } from '../types';

interface AdminComparisonsProps {
  comparisons: AdminComparison[];
  onSaveComparison: (cmp: AdminComparison) => void;
  onDeleteComparison: (id: string) => void;
  onPreviewComparison?: (path: string) => void;
}

export const AdminComparisons: React.FC<AdminComparisonsProps> = ({
  comparisons,
  onSaveComparison,
  onDeleteComparison,
  onPreviewComparison,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingComparison, setEditingComparison] = useState<AdminComparison | null>(null);

  const filteredComparisons = comparisons.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productB.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenNew = () => {
    setEditingComparison({
      id: `cmp-${Date.now()}`,
      title: '',
      slug: '',
      category: 'Audio & Visual',
      productA: '',
      productB: '',
      winner: '',
      scoreA: 9.5,
      scoreB: 9.3,
      status: 'draft',
      updatedAt: new Date().toISOString().split('T')[0],
    });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComparison || !editingComparison.title.trim()) return;
    onSaveComparison({
      ...editingComparison,
      slug:
        editingComparison.slug ||
        editingComparison.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
    });
    setEditingComparison(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight font-sans">
            Head-to-Head Comparisons & Showdowns
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Architect direct product vs product comparisons with score battles and declared winners
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-bold transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>New Head-to-Head Showdown</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search comparisons by product names or category..."
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
        />
      </div>

      {/* Comparisons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredComparisons.map((c) => (
          <div
            key={c.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-4 shadow-md hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold">
                  {c.category}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                    c.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {c.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                {c.title}
              </h3>

              {/* Matchup Duel Box */}
              <div className="rounded-2xl bg-slate-950 p-3 space-y-2 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 truncate max-w-[140px]">
                    {c.productA}
                  </span>
                  <span className="font-mono font-black text-amber-400">{c.scoreA.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-center text-[10px] font-black uppercase text-slate-500">
                  <span className="h-px bg-slate-800 flex-1 mr-2" />
                  VS
                  <span className="h-px bg-slate-800 flex-1 ml-2" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300 truncate max-w-[140px]">
                    {c.productB}
                  </span>
                  <span className="font-mono font-black text-slate-400">{c.scoreB.toFixed(1)}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Winner:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {c.winner || 'Undecided'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500">Updated {c.updatedAt}</span>
              <div className="flex items-center gap-1.5">
                {onPreviewComparison && (
                  <button
                    onClick={() => onPreviewComparison(`/compare/${c.slug}`)}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    title="Preview Comparison"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setEditingComparison(c)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-blue-400"
                  title="Edit Showdown"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDeleteComparison(c.id)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400"
                  title="Delete Showdown"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Comparison Modal */}
      {editingComparison && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingComparison.id.includes('cmp-') ? 'Edit Head-to-Head Duel' : 'New Showdown'}
              </h3>
              <button
                onClick={() => setEditingComparison(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Comparison Title
                </label>
                <input
                  type="text"
                  value={editingComparison.title}
                  onChange={(e) =>
                    setEditingComparison({ ...editingComparison, title: e.target.value })
                  }
                  placeholder="e.g. Sony WH-1000XM5 vs Bose QuietComfort Ultra"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Product A Name & Score
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingComparison.productA}
                      onChange={(e) =>
                        setEditingComparison({ ...editingComparison, productA: e.target.value })
                      }
                      placeholder="e.g. Sony WH-1000XM5"
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                      required
                    />
                    <input
                      type="number"
                      step="0.1"
                      value={editingComparison.scoreA}
                      onChange={(e) =>
                        setEditingComparison({
                          ...editingComparison,
                          scoreA: Number(e.target.value),
                        })
                      }
                      className="w-16 rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Product B Name & Score
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingComparison.productB}
                      onChange={(e) =>
                        setEditingComparison({ ...editingComparison, productB: e.target.value })
                      }
                      placeholder="e.g. Bose QC Ultra"
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                      required
                    />
                    <input
                      type="number"
                      step="0.1"
                      value={editingComparison.scoreB}
                      onChange={(e) =>
                        setEditingComparison({
                          ...editingComparison,
                          scoreB: Number(e.target.value),
                        })
                      }
                      className="w-16 rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Declared Overall Winner
                  </label>
                  <input
                    type="text"
                    value={editingComparison.winner}
                    onChange={(e) =>
                      setEditingComparison({ ...editingComparison, winner: e.target.value })
                    }
                    placeholder="e.g. Sony WH-1000XM5"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={editingComparison.category}
                    onChange={(e) =>
                      setEditingComparison({ ...editingComparison, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                  >
                    <option value="Audio & Visual">Audio & Visual</option>
                    <option value="Computing & Workstations">Computing & Workstations</option>
                    <option value="Smart Living & Automation">Smart Living & Automation</option>
                    <option value="Cameras & Optics">Cameras & Optics</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-400 font-semibold">Publish Status:</label>
                  <select
                    value={editingComparison.status}
                    onChange={(e) =>
                      setEditingComparison({
                        ...editingComparison,
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
                    onClick={() => setEditingComparison(null)}
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-sm"
                  >
                    Save Showdown
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
