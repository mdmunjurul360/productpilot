import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  Star,
  ExternalLink,
  Check,
  X,
  Eye,
  CheckCircle2,
  ArrowUpDown,
  Sparkles,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
  Link2,
} from 'lucide-react';
import { AdminProduct } from '../types';

interface AdminProductsProps {
  products: AdminProduct[];
  onSaveProduct: (product: AdminProduct) => void;
  onDeleteProduct: (id: string) => void;
  onDuplicateProduct: (product: AdminProduct) => void;
  onPreviewProduct: (slug: string) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
  onDuplicateProduct,
  onPreviewProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'name' | 'newest'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Bulk actions selection
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [activeEditorTab, setActiveEditorTab] = useState<'basics' | 'specs' | 'proscons' | 'seo'>('basics');

  // Form Fields State
  const [formData, setFormData] = useState<Partial<AdminProduct>>({
    name: '',
    slug: '',
    brand: '',
    category: 'Audio & Visual',
    shortDescription: '',
    longDescription: '',
    featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    galleryImages: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
    youtubeVideoId: '',
    rating: 9.5,
    priceRange: '$299 - $399',
    status: 'published',
    isFeatured: false,
    pros: ['Class-leading noise isolation', 'Long battery stamina'],
    cons: ['Slightly higher retail price'],
    whoShouldBuy: ['Frequent travelers', 'Remote office workers'],
    whoShouldAvoid: ['Extreme sports runners'],
    specifications: [
      { label: 'Weight', value: '250g' },
      { label: 'Battery', value: '30 hours' },
    ],
    seoTitle: '',
    seoDescription: '',
  });

  // Filter & Sort Pipeline
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
      return matchesSearch && matchesCat && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return b.updatedAt.localeCompare(a.updatedAt);
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Bulk Checkbox Toggles
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(paginatedProducts.map((p) => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkPublish = () => {
    selectedProductIds.forEach((id) => {
      const found = products.find((p) => p.id === id);
      if (found) onSaveProduct({ ...found, status: 'published' });
    });
    setSelectedProductIds([]);
  };

  const handleBulkDraft = () => {
    selectedProductIds.forEach((id) => {
      const found = products.find((p) => p.id === id);
      if (found) onSaveProduct({ ...found, status: 'draft' });
    });
    setSelectedProductIds([]);
  };

  const handleBulkDelete = () => {
    selectedProductIds.forEach((id) => onDeleteProduct(id));
    setSelectedProductIds([]);
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setActiveEditorTab('basics');
    setFormData({
      name: '',
      slug: '',
      brand: '',
      category: 'Audio & Visual',
      shortDescription: '',
      longDescription: '',
      featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      galleryImages: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'],
      youtubeVideoId: '',
      rating: 9.5,
      priceRange: '$299 - $399',
      status: 'published',
      isFeatured: false,
      pros: ['Class-leading performance', 'Exceptional build quality'],
      cons: ['Premium price point'],
      whoShouldBuy: ['Professional users and enthusiasts'],
      whoShouldAvoid: ['Casual buyers on strict sub-$100 budgets'],
      specifications: [
        { label: 'Weight', value: '250g' },
        { label: 'Battery', value: '30 hours' },
      ],
      seoTitle: '',
      seoDescription: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: AdminProduct) => {
    setEditingProduct(prod);
    setActiveEditorTab('basics');
    setFormData({ ...prod });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) return;

    const saved: AdminProduct = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name || '',
      slug: formData.slug || '',
      brand: formData.brand || 'Brand',
      category: formData.category || 'Audio & Visual',
      shortDescription: formData.shortDescription || '',
      longDescription: formData.longDescription || '',
      featuredImage: formData.featuredImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      galleryImages: formData.galleryImages || [],
      youtubeVideoId: formData.youtubeVideoId,
      rating: Number(formData.rating) || 9.0,
      priceRange: formData.priceRange || '$299 - $399',
      status: (formData.status as 'published' | 'draft') || 'published',
      isFeatured: Boolean(formData.isFeatured),
      pros: formData.pros || [],
      cons: formData.cons || [],
      whoShouldBuy: formData.whoShouldBuy || [],
      whoShouldAvoid: formData.whoShouldAvoid || [],
      specifications: formData.specifications || [],
      seoTitle: formData.seoTitle || `${formData.name} Review — Specs & Price Comparison`,
      seoDescription: formData.seoDescription || formData.shortDescription,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSaveProduct(saved);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-sans">
            Product Catalog & Review Matrix
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full enterprise CRUD with specifications, multi-merchant buy boxes, and pros/cons
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-md shadow-blue-900/40 shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search, Filters, and Sort Toolbar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3 shadow-sm">
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product name or brand..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Audio & Visual">Audio & Visual</option>
            <option value="Computing & Workstations">Computing</option>
            <option value="Smart Living & Automation">Smart Home</option>
            <option value="Cameras & Optics">Cameras</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value as any);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-300 outline-none cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="name">Sort: A-Z</option>
          </select>
        </div>
      </div>

      {/* Bulk Operations Action Bar */}
      {selectedProductIds.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl bg-blue-950/80 border border-blue-500/40 p-3 px-4 text-xs font-semibold text-blue-200 animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="font-bold">{selectedProductIds.length}</span> products selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkPublish}
              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 text-xs font-bold"
            >
              Publish Selected
            </button>
            <button
              onClick={handleBulkDraft}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 text-xs font-bold"
            >
              Draft Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="rounded-lg bg-rose-600 hover:bg-rose-500 text-white px-2.5 py-1 text-xs font-bold"
            >
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedProductIds([])}
              className="text-slate-400 hover:text-white ml-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-950/60">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedProducts.length > 0 &&
                      paginatedProducts.every((p) => selectedProductIds.includes(p.id))
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 font-bold">Product Name</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Rating</th>
                <th className="py-3.5 px-4 font-bold">Price Range</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold">Featured</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No products found matching query.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => {
                  const isChecked = selectedProductIds.includes(p.id);

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isChecked ? 'bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectOne(p.id)}
                          className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.featuredImage}
                            alt={p.name}
                            className="h-10 w-10 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <span className="block font-bold text-white truncate max-w-xs">
                              {p.name}
                            </span>
                            <span className="block text-[11px] text-slate-400 font-mono">
                              /{p.slug}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{p.category}</td>
                      <td className="py-3 px-4 font-bold text-amber-400">★ {p.rating.toFixed(1)}</td>
                      <td className="py-3 px-4 font-extrabold text-emerald-400">{p.priceRange}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            p.status === 'published'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                              : 'bg-amber-950 text-amber-300 border border-amber-800/40'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.isFeatured ? (
                          <span className="rounded bg-blue-900/60 text-blue-300 text-[10px] font-bold px-1.5 py-0.5">
                            Featured
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onPreviewProduct(`/reviews/${p.slug}`)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                            title="Preview Public Review Page"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-blue-400"
                            title="Edit Product"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDuplicateProduct(p)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-emerald-400"
                            title="Duplicate as Draft"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteProduct(p.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-950 hover:text-rose-400"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs text-slate-400 bg-slate-950/40">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
            {filteredProducts.length} products
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-300 disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev</span>
            </button>
            <span className="font-mono text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-slate-300 disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Product Editor Modal with Tabs */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Create New Product Record'}
                </h3>
                <span className="text-xs text-slate-400">Complete CMS catalog & testing profile</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Internal Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
              {[
                { id: 'basics', label: 'Basics & Media' },
                { id: 'specs', label: 'Technical Specs' },
                { id: 'proscons', label: 'Pros, Cons & Target Audience' },
                { id: 'seo', label: 'SEO & Affiliate Status' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveEditorTab(tab.id as any)}
                  className={`rounded-xl px-3 py-1.5 transition-colors ${
                    activeEditorTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {/* Tab 1: Basics & Media */}
              {activeEditorTab === 'basics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Product Name</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            name: e.target.value,
                            slug: e.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, '-')
                              .replace(/(^-|-$)+/g, ''),
                          });
                        }}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Slug</label>
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Brand</label>
                      <input
                        type="text"
                        value={formData.brand || ''}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                      >
                        <option value="Audio & Visual">Audio & Visual</option>
                        <option value="Computing & Workstations">Computing</option>
                        <option value="Smart Living & Automation">Smart Home</option>
                        <option value="Cameras & Optics">Cameras</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400">Overall Lab Rating (0–10)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="10"
                        value={formData.rating || 9.5}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Price Range Display</label>
                    <input
                      type="text"
                      value={formData.priceRange || ''}
                      onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                      placeholder="e.g. $329 - $398"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Featured Hero Image URL</label>
                    <input
                      type="text"
                      value={formData.featuredImage || ''}
                      onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">YouTube Video ID (Optional)</label>
                    <input
                      type="text"
                      value={formData.youtubeVideoId || ''}
                      onChange={(e) => setFormData({ ...formData, youtubeVideoId: e.target.value })}
                      placeholder="e.g. f0XzM97d_a8"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Short Editorial Summary</label>
                    <textarea
                      value={formData.shortDescription || ''}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      rows={2}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Technical Specifications */}
              {activeEditorTab === 'specs' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-300">
                      Technical Spec Benchmarks
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          specifications: [
                            ...(formData.specifications || []),
                            { label: 'New Spec', value: 'Value' },
                          ],
                        })
                      }
                      className="text-xs font-bold text-blue-400 hover:underline"
                    >
                      + Add Specification Row
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(formData.specifications || []).map((spec, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={spec.label}
                          onChange={(e) => {
                            const updated = [...(formData.specifications || [])];
                            updated[sIdx].label = e.target.value;
                            setFormData({ ...formData, specifications: updated });
                          }}
                          placeholder="Spec Name (e.g. Weight, Battery)"
                          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white"
                        />
                        <input
                          type="text"
                          value={spec.value}
                          onChange={(e) => {
                            const updated = [...(formData.specifications || [])];
                            updated[sIdx].value = e.target.value;
                            setFormData({ ...formData, specifications: updated });
                          }}
                          placeholder="Measured Value (e.g. 250g)"
                          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.specifications || []).filter(
                              (_, idx) => idx !== sIdx
                            );
                            setFormData({ ...formData, specifications: updated });
                          }}
                          className="p-2 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Pros, Cons & Target Audience */}
              {activeEditorTab === 'proscons' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 mb-1">
                      Pros (Reasons to Buy — One per line)
                    </label>
                    <textarea
                      value={(formData.pros || []).join('\n')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pros: e.target.value.split('\n').filter((l) => l.trim()),
                        })
                      }
                      rows={3}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-rose-400 mb-1">
                      Cons (Reasons to Reconsider — One per line)
                    </label>
                    <textarea
                      value={(formData.cons || []).join('\n')}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cons: e.target.value.split('\n').filter((l) => l.trim()),
                        })
                      }
                      rows={3}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-blue-400 mb-1">
                        Who Should Buy
                      </label>
                      <textarea
                        value={(formData.whoShouldBuy || []).join('\n')}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            whoShouldBuy: e.target.value.split('\n').filter((l) => l.trim()),
                          })
                        }
                        rows={2}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-amber-400 mb-1">
                        Who Should Avoid
                      </label>
                      <textarea
                        value={(formData.whoShouldAvoid || []).join('\n')}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            whoShouldAvoid: e.target.value.split('\n').filter((l) => l.trim()),
                          })
                        }
                        rows={2}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: SEO & Status */}
              {activeEditorTab === 'seo' && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Custom SEO Meta Title</label>
                    <input
                      type="text"
                      value={formData.seoTitle || ''}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      placeholder="e.g. Sony WH-1000XM5 Review — In-Depth Noise Cancellation Lab Test"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">SEO Meta Description</label>
                    <textarea
                      value={formData.seoDescription || ''}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      rows={2}
                      placeholder="e.g. Read our authoritative lab benchmark of the Sony WH-1000XM5 with ANC sound pressure tests and verified battery stamina."
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-300">Publishing Status:</label>
                      <select
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as 'published' | 'draft',
                          })
                        }
                        className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white outline-none"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft Queue</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-300">
                        <input
                          type="checkbox"
                          checked={Boolean(formData.isFeatured)}
                          onChange={(e) =>
                            setFormData({ ...formData, isFeatured: e.target.checked })
                          }
                          className="rounded border-slate-700 bg-slate-950 text-blue-600"
                        />
                        <span>Feature on Homepage Trending Grid</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Bottom Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-900/40"
                  >
                    Save Product Record
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
