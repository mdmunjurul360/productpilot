import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Check,
  X,
  Code,
  Image as ImageIcon,
  Video,
  ShoppingBag,
  HelpCircle,
  Scale,
  List,
  ExternalLink,
} from 'lucide-react';
import { AdminArticle } from '../types';

interface AdminArticlesProps {
  articles: AdminArticle[];
  onSaveArticle: (art: AdminArticle) => void;
  onDeleteArticle: (id: string) => void;
  onPreviewArticle: (slug: string) => void;
}

export const AdminArticles: React.FC<AdminArticlesProps> = ({
  articles,
  onSaveArticle,
  onDeleteArticle,
  onPreviewArticle,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'review' | 'buying_guide' | 'comparison'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null);
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');

  const [formData, setFormData] = useState<Partial<AdminArticle>>({
    title: '',
    slug: '',
    type: 'review',
    status: 'published',
    author: 'Dr. Marcus Vance',
    category: 'Audio & Visual',
    tags: ['Audio', 'ANC', 'Lab Certified'],
    featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    publishedAt: new Date().toISOString().split('T')[0],
    contentMarkdown: `## Executive Overview\n\nOur laboratory benchmarks confirm significant advancements in acoustic attenuation.\n\n### Lab Decibel Measurements\n\n- Active Noise Attenuation: -34.2 dB\n- Continuous Playback Stamina: 31.4 Hours\n\n[affiliate:Amazon:$398.00:https://amazon.com]\n\n### Frequently Asked Questions\n\n[faq:Is this travel case compact?:Yes, features magnetic closure and integrated cable slots.]`,
    seoTitle: '',
    seoDescription: '',
  });

  const filteredArticles = articles.filter((a) => {
    const matchesFilter = activeFilter === 'all' || a.type === activeFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setEditorMode('edit');
    setFormData({
      title: '',
      slug: '',
      type: 'review',
      status: 'published',
      author: 'Dr. Marcus Vance',
      category: 'Audio & Visual',
      tags: ['Hardware', 'Lab Benchmarked'],
      featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      publishedAt: new Date().toISOString().split('T')[0],
      contentMarkdown: `## Executive Summary\n\nTested extensively inside certified audio test benches.\n\n### Performance Highlights\n\n[affiliate:Amazon:$398.00:https://amazon.com]\n\n### Lab Verdict\n\nExceptional performance across everyday travel and office environments.`,
      seoTitle: '',
      seoDescription: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (art: AdminArticle) => {
    setEditingArticle(art);
    setEditorMode('edit');
    setFormData({ ...art });
    setIsModalOpen(true);
  };

  const handleInsertSnippet = (snippet: string) => {
    setFormData((prev) => ({
      ...prev,
      contentMarkdown: (prev.contentMarkdown || '') + '\n\n' + snippet,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) return;

    let content = formData.contentMarkdown || '';

    // Validation Check: Missing Featured Image
    if (!formData.featuredImage) {
      alert('Validation Error: Missing featured image.');
      return;
    }

    // Validation Check: Missing SEO Fields
    if (!formData.seoTitle || !formData.seoDescription) {
      alert('Validation Error: Missing SEO fields. Meta Title and Description are required.');
      return;
    }

    // Validation Check: Broken Affiliate Links
    const affiliateMatches = content.match(/\[affiliate:[^\]]+\]/g) || [];
    const hasBrokenAffiliate = affiliateMatches.some(match => match.split(':').length < 4);
    if (hasBrokenAffiliate) {
      alert('Validation Error: Broken affiliate link detected. Ensure format is [affiliate:Store:Price:URL]');
      return;
    }

    // Validation Check: Empty Sections
    if (/(?:^|\n)## [^\n]+\n+(?=## |$)/.test(content)) {
      alert('Validation Error: Empty section detected. Please add content under all headings.');
      return;
    }

    // Auto-generate Table of Contents if multiple H2 exist and not already added
    if (!content.includes('## Table of Contents') && !content.includes('[TOC]')) {
      const headings = content.match(/^## (.*$)/gim);
      if (headings && headings.length > 2) {
        const toc = '## Table of Contents\n\n' + headings.map(h => {
          const text = h.replace('## ', '');
          const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return `- [${text}](#${anchor})`;
        }).join('\n') + '\n\n';
        content = toc + content;
      }
    }

    // Auto-generate Breadcrumbs & Related sections if not present
    if (!content.includes('[breadcrumbs]')) content = '[breadcrumbs]\n\n' + content;
    if (!content.includes('[related_products]')) content += '\n\n### Related Products\n\n[related_products]';
    if (!content.includes('[related_articles]')) content += '\n\n### Related Articles\n\n[related_articles]';

    const saved: AdminArticle = {
      id: editingArticle ? editingArticle.id : `art-${Date.now()}`,
      title: formData.title || '',
      slug: formData.slug || '',
      type: formData.type || 'review',
      status: formData.status || 'published',
      author: formData.author || 'Editorial Team',
      category: formData.category || 'Audio & Visual',
      tags: formData.tags || ['General'],
      featuredImage: formData.featuredImage,
      publishedAt: formData.publishedAt || new Date().toISOString().split('T')[0],
      views: editingArticle ? editingArticle.views : 0,
      contentMarkdown: content,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      canonicalUrl: formData.canonicalUrl,
      focusKeyword: formData.focusKeyword,
      ogImage: formData.ogImage,
      readingTime: formData.readingTime || '5 min read',
      lastUpdated: new Date().toISOString(),
      reviewedBy: formData.reviewedBy,
      factCheckedBy: formData.factCheckedBy,
      editorNotes: formData.editorNotes,
    };

    onSaveArticle(saved);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-sans">
            Articles, Reviews & Editorial Guides
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Rich markdown editor with affiliate callouts, FAQ builders, and SEO schema readiness
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/40 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Toolbar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'review', 'buying_guide', 'comparison'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                activeFilter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title or author..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-1.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((art) => (
          <article
            key={art.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-900 p-5 space-y-4 shadow-md hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-800">
                <img src={art.featuredImage} alt={art.title} className="h-full w-full object-cover" />
                <span className="absolute top-2 left-2 rounded-lg bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  {art.type.replace('_', ' ')}
                </span>
                <span
                  className={`absolute top-2 right-2 rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${
                    art.status === 'published'
                      ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-950/90 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {art.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  {art.category}
                </span>
                <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                  {art.title}
                </h3>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                <span>By {art.author}</span>
                <span className="font-mono">{art.views.toLocaleString()} reads</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500">{art.publishedAt}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    onPreviewArticle(
                      art.type === 'review'
                        ? `/reviews/${art.slug}`
                        : art.type === 'buying_guide'
                        ? `/buying-guides/${art.slug}`
                        : `/compare/${art.slug}`
                    )
                  }
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                  title="View on Public Site"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleOpenEdit(art)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-blue-400"
                  title="Edit Article"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onDeleteArticle(art.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-950 hover:text-rose-400"
                  title="Delete Article"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Rich Article Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">
                  {editingArticle ? `Edit: ${editingArticle.title}` : 'Write New Editorial Article'}
                </h3>
                <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setEditorMode('edit')}
                    className={`rounded px-2.5 py-0.5 ${
                      editorMode === 'edit' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Markdown
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode('preview')}
                    className={`rounded px-2.5 py-0.5 ${
                      editorMode === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Live Preview
                  </button>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Top Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Article Title
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                        slug: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)+/g, ''),
                      })
                    }
                    placeholder="e.g. Sony WH-1000XM5 In-Depth Lab Review"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Slug URL</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Article Format
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                  >
                    <option value="review">Product Review</option>
                    <option value="buying_guide">Buying Guide Roundup</option>
                    <option value="comparison">Head-to-Head Comparison</option>
                    <option value="news">Tech & Gear News</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                  >
                    <option value="Audio & Visual">Audio & Visual</option>
                    <option value="Computing & Workstations">Computing</option>
                    <option value="Smart Living & Automation">Smart Home</option>
                    <option value="Cameras & Optics">Cameras</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Lead Testing Author
                  </label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                  />
                </div>
              </div>

              {/* Quick Snippet Insert Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mr-1">
                  Insert Block:
                </span>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('## Section Heading 2')}
                  className="rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-slate-300 font-mono text-[11px]"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('### Sub-Section Heading 3')}
                  className="rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-slate-300 font-mono text-[11px]"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertSnippet(
                      '![Acoustic Lab Testing Bench](https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800)'
                    )
                  }
                  className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-slate-300 text-[11px]"
                >
                  <ImageIcon className="h-3 w-3" />
                  <span>Image Block</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('[youtube:f0XzM97d_a8]')}
                  className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-slate-300 text-[11px]"
                >
                  <Video className="h-3 w-3" />
                  <span>YouTube Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('[affiliate:Amazon:$398.00:https://amazon.com]')}
                  className="flex items-center gap-1 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 px-2 py-1 text-emerald-300 text-[11px] font-bold"
                >
                  <ShoppingBag className="h-3 w-3" />
                  <span>Affiliate Buy Box</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertSnippet(
                      '[faq:Can you replace the ear cushions?:Yes, authentic replacement protein leather pads are available.]'
                    )
                  }
                  className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-slate-300 text-[11px]"
                >
                  <HelpCircle className="h-3 w-3" />
                  <span>FAQ Block</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleInsertSnippet(
                      '[comparison:Sony WH-1000XM5:Bose QC Ultra:Winner Sony for battery stamina]'
                    )
                  }
                  className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-slate-300 text-[11px]"
                >
                  <Scale className="h-3 w-3" />
                  <span>Comparison Duel</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('| Feature | Specs |\n|---|---|\n| Weight | 250g |')}
                  className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-slate-300 text-[11px]"
                >
                  <List className="h-3 w-3" />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('[pros_cons:Pros:Great sound,Comfortable:Cons:Expensive,No aptX]')}
                  className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-slate-300 text-[11px]"
                >
                  <Check className="h-3 w-3" />
                  <span>Pros & Cons</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('[callout:Editor Note:This model was tested using firmware v2.0]')}
                  className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-slate-300 text-[11px]"
                >
                  <FileText className="h-3 w-3" />
                  <span>Callout Box</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertSnippet('[gallery:img1.jpg,img2.jpg,img3.jpg]')}
                  className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-slate-300 text-[11px]"
                >
                  <ImageIcon className="h-3 w-3" />
                  <span>Gallery</span>
                </button>
              </div>

              {/* Editor Workspace (Markdown vs Preview) */}
              {editorMode === 'edit' ? (
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Article Body (Markdown Supported)
                  </label>
                  <textarea
                    rows={12}
                    value={formData.contentMarkdown || ''}
                    onChange={(e) => setFormData({ ...formData, contentMarkdown: e.target.value })}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-xs font-mono text-slate-200 outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4 max-h-96 overflow-y-auto">
                  <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-3">
                    <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                      {formData.title}
                    </h2>
                    {(formData.contentMarkdown || '').split('\n\n').map((block, idx) => {
                      if (block.startsWith('## ')) {
                        return (
                          <h3 key={idx} className="text-base font-bold text-white mt-4">
                            {block.replace('## ', '')}
                          </h3>
                        );
                      }
                      if (block.startsWith('### ')) {
                        return (
                          <h4 key={idx} className="text-sm font-bold text-blue-400 mt-2">
                            {block.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (block.startsWith('[affiliate:')) {
                        const parts = block.replace('[affiliate:', '').replace(']', '').split(':');
                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between"
                          >
                            <span className="font-bold text-emerald-400">{parts[0]} Offer</span>
                            <span className="font-black text-white">{parts[1]}</span>
                            <span className="text-[10px] text-blue-400 underline">Buy Now →</span>
                          </div>
                        );
                      }
                      return <p key={idx} className="text-slate-300 leading-relaxed">{block}</p>;
                    })}
                  </div>
                </div>
              )}

              {/* SEO Fields */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white mb-3">SEO Configuration</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={formData.seoTitle || ''}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Meta Description</label>
                    <input
                      type="text"
                      value={formData.seoDescription || ''}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Canonical URL</label>
                    <input
                      type="text"
                      value={formData.canonicalUrl || ''}
                      onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Focus Keyword</label>
                    <input
                      type="text"
                      value={formData.focusKeyword || ''}
                      onChange={(e) => setFormData({ ...formData, focusKeyword: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">OG Image URL</label>
                    <input
                      type="text"
                      value={formData.ogImage || ''}
                      onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Editorial Fields */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white mb-3">Editorial Metadata</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Reading Time</label>
                    <input
                      type="text"
                      value={formData.readingTime || ''}
                      onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Reviewed By</label>
                    <input
                      type="text"
                      value={formData.reviewedBy || ''}
                      onChange={(e) => setFormData({ ...formData, reviewedBy: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Fact Checked By</label>
                    <input
                      type="text"
                      value={formData.factCheckedBy || ''}
                      onChange={(e) => setFormData({ ...formData, factCheckedBy: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Editor Notes</label>
                    <input
                      type="text"
                      value={formData.editorNotes || ''}
                      onChange={(e) => setFormData({ ...formData, editorNotes: e.target.value })}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-400">Publish State:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-white outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft Queue</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-900/40"
                  >
                    Save & Publish Article
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
