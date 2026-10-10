import React, { useState } from 'react';
import { Layers, Plus, Search, Edit, Trash2, X, Check, Image, FolderTree, Sparkles } from 'lucide-react';
import { AdminCategory } from '../types';

interface AdminCategoriesProps {
  categories: AdminCategory[];
  onSaveCategory: (cat: AdminCategory) => void;
  onDeleteCategory: (id: string) => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onSaveCategory,
  onDeleteCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState<Partial<AdminCategory>>({
    name: '',
    slug: '',
    description: '',
    parentCategory: '',
    categoryIcon: 'Layers',
    featuredImage: '',
    seoTitle: '',
    seoDescription: '',
    productCount: 0,
  });

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentCategory: '',
      categoryIcon: 'Layers',
      featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      seoTitle: '',
      seoDescription: '',
      productCount: 0,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: AdminCategory) => {
    setEditingCategory(cat);
    setFormData({ ...cat });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    const saved: AdminCategory = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: formData.name || '',
      slug: formData.slug || '',
      description: formData.description || '',
      parentCategory: formData.parentCategory || undefined,
      categoryIcon: formData.categoryIcon || 'Layers',
      featuredImage: formData.featuredImage,
      seoTitle: formData.seoTitle || `${formData.name} Buying Guides & Reviews — ProductPilot`,
      seoDescription: formData.seoDescription || formData.description || '',
      productCount: editingCategory ? editingCategory.productCount : 0,
    };

    onSaveCategory(saved);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-sans">
            Category Taxonomy & Nested Silos
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Architect cornerstone categories, parent/child relationships, icons, and topical SEO
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/40 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search categories by name or slug..."
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
        />
      </div>

      {/* Categories Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-950/60">
                <th className="py-3.5 px-4 font-bold">Category Vertical</th>
                <th className="py-3.5 px-4 font-bold">Slug</th>
                <th className="py-3.5 px-4 font-bold">Taxonomy Hierarchy</th>
                <th className="py-3.5 px-4 font-bold">Catalog Items</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredCategories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="font-bold text-white block">{c.name}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1">{c.description}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">/{c.slug}</td>
                  <td className="py-3 px-4">
                    {c.parentCategory ? (
                      <span className="flex items-center gap-1 text-slate-300 font-semibold">
                        <FolderTree className="h-3.5 w-3.5 text-blue-400" />
                        <span>Child of {c.parentCategory}</span>
                      </span>
                    ) : (
                      <span className="rounded bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5">
                        Cornerstone Pillar
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-blue-400">{c.productCount} products</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-blue-400"
                        title="Edit Category"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCategory(c.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-950 hover:text-rose-400"
                        title="Delete Category"
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingCategory ? `Edit: ${editingCategory.name}` : 'Create Category Vertical'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Category Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, ''),
                      })
                    }
                    placeholder="e.g. Creator Gear"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Slug</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">
                  Parent Category (Leave empty for Cornerstone Pillar)
                </label>
                <select
                  value={formData.parentCategory || ''}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white outline-none"
                >
                  <option value="">— None (Top Level Cornerstone) —</option>
                  {categories
                    .filter((cat) => cat.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Topical Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of lab testing scope for this category..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Featured Banner Image URL</label>
                <input
                  type="text"
                  value={formData.featuredImage || ''}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">SEO Title Tag</label>
                <input
                  type="text"
                  value={formData.seoTitle || ''}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white hover:bg-blue-500 shadow-md shadow-blue-900/40"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
