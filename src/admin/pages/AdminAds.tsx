import React, { useState } from 'react';
import { Tv, Plus, Edit, Trash2, Check, X, ShieldAlert, Code } from 'lucide-react';
import { AdminAdSlot } from '../types';

interface AdminAdsProps {
  ads: AdminAdSlot[];
  onSaveAd: (ad: AdminAdSlot) => void;
  onDeleteAd: (id: string) => void;
  onToggleAd: (id: string) => void;
}

export const AdminAds: React.FC<AdminAdsProps> = ({ ads, onSaveAd, onDeleteAd, onToggleAd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdminAdSlot | null>(null);

  const [formData, setFormData] = useState<Partial<AdminAdSlot>>({
    name: '',
    location: 'Leaderboard',
    network: 'Google AdSense',
    isEnabled: true,
    priority: 1,
    codeSnippet: '',
  });

  const handleOpenCreate = () => {
    setEditingAd(null);
    setFormData({
      name: '',
      location: 'Leaderboard',
      network: 'Google AdSense',
      isEnabled: true,
      priority: 1,
      codeSnippet: '<ins class="adsbygoogle" data-ad-client="ca-pub-..." data-ad-slot="..."></ins>',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ad: AdminAdSlot) => {
    setEditingAd(ad);
    setFormData({ ...ad });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.codeSnippet) return;

    const saved: AdminAdSlot = {
      id: editingAd ? editingAd.id : `ad-${Date.now()}`,
      name: formData.name || 'Ad Slot',
      location: formData.location || 'Leaderboard',
      network: formData.network || 'Google AdSense',
      isEnabled: formData.isEnabled ?? true,
      priority: formData.priority || 1,
      codeSnippet: formData.codeSnippet || '',
      impressions: editingAd ? editingAd.impressions : 0,
      ctr: editingAd ? editingAd.ctr : '0.00%',
    };

    onSaveAd(saved);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Display Ad Placements & Network Server</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure Google AdSense, Mediavine, and Direct Sponsor script tags without modifying codebase.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/40 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Ad Placement</span>
        </button>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-950/60">
                <th className="py-3.5 px-4 font-bold">Placement Name</th>
                <th className="py-3.5 px-4 font-bold">Slot Location</th>
                <th className="py-3.5 px-4 font-bold">Network</th>
                <th className="py-3.5 px-4 font-bold">Impressions</th>
                <th className="py-3.5 px-4 font-bold">CTR</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ads.map((ad) => (
                <tr key={ad.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{ad.name}</td>
                  <td className="py-3 px-4 text-slate-300">
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-blue-400">
                      {ad.location}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{ad.network}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">
                    {ad.impressions.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{ad.ctr}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleAd(ad.id)}
                      className={`h-5 w-9 rounded-full transition-colors relative p-0.5 ${
                        ad.isEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition-transform ${
                          ad.isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(ad)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-blue-400"
                        title="Edit Placement"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteAd(ad.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-950 hover:text-rose-400"
                        title="Delete Placement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingAd ? 'Edit Ad Placement Settings' : 'Create New Ad Placement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Placement Identifier Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Leaderboard Below Header"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Location Slot</label>
                  <select
                    value={formData.location || 'Leaderboard'}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value as AdminAdSlot['location'] })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  >
                    <option value="Leaderboard">Leaderboard (728x90)</option>
                    <option value="Sidebar">Sidebar (300x250 / 300x600)</option>
                    <option value="In-content">In-Content Native</option>
                    <option value="Footer">Footer Above Legal</option>
                    <option value="Mobile Banner">Mobile Sticky Bottom (320x50)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Ad Network</label>
                  <select
                    value={formData.network || 'Google AdSense'}
                    onChange={(e) => setFormData({ ...formData, network: e.target.value as AdminAdSlot['network'] })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  >
                    <option value="Google AdSense">Google AdSense</option>
                    <option value="Mediavine">Mediavine</option>
                    <option value="Direct Sponsor">Direct Sponsor</option>
                    <option value="Custom HTML">Custom HTML Script</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">HTML / JavaScript Snippet</label>
                <textarea
                  rows={4}
                  value={formData.codeSnippet || ''}
                  onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                  placeholder="Paste <ins> or <script> tags here..."
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-500"
                >
                  Save Ad Placement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
