import React, { useState } from 'react';
import { Image, Upload, Search, Trash2, Copy, Check, Folder, Eye, X } from 'lucide-react';
import { AdminMediaItem } from '../types';

interface AdminMediaProps {
  media: AdminMediaItem[];
  onUploadMedia: (item: AdminMediaItem) => void;
  onDeleteMedia: (id: string) => void;
}

export const AdminMedia: React.FC<AdminMediaProps> = ({ media, onUploadMedia, onDeleteMedia }) => {
  const [activeFolder, setActiveFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<AdminMediaItem | null>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetFolder, setNewAssetFolder] = useState<AdminMediaItem['folder']>('Products');
  const [newAssetFormat, setNewAssetFormat] = useState<'WebP' | 'AVIF' | 'PNG' | 'JPEG'>('WebP');

  const filteredMedia = media.filter((m) => {
    const matchesFolder = activeFolder === 'All' || m.folder === activeFolder;
    const matchesQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesQuery;
  });

  const handleCopyUrl = (item: AdminMediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCustomUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetUrl) return;
    const newItem: AdminMediaItem = {
      id: `med-${Date.now()}`,
      name: newAssetName || `asset-${Date.now()}.${newAssetFormat.toLowerCase()}`,
      url: newAssetUrl,
      size: `${Math.floor(Math.random() * 80 + 120)} KB`,
      type: `image/${newAssetFormat.toLowerCase()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      folder: newAssetFolder,
    };
    onUploadMedia(newItem);
    setNewAssetName('');
    setNewAssetUrl('');
    setIsUploadModalOpen(false);
  };

  const handleMockUpload = () => {
    const sampleUrls = [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    ];
    const randomUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
    const newItem: AdminMediaItem = {
      id: `med-${Date.now()}`,
      name: `asset-${Math.floor(Math.random() * 1000)}.webp`,
      url: randomUrl,
      size: `${Math.floor(Math.random() * 120 + 80)} KB`,
      type: 'image/webp',
      uploadedAt: new Date().toISOString().split('T')[0],
      folder: (activeFolder === 'All' ? 'Products' : activeFolder) as AdminMediaItem['folder'],
    };
    onUploadMedia(newItem);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Asset Library</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimized WebP product assets, laboratory photos, and thumbnail CDN endpoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/40 transition-colors shrink-0"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Image Asset</span>
          </button>
          <button
            onClick={handleMockUpload}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 px-3 py-2.5 text-xs font-bold text-slate-300 transition-colors shrink-0"
            title="Generate Sample Lab Image"
          >
            <span>+ Quick Sample</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Folders & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-3">
        {/* Folder Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Products', 'Heroes', 'Reviews', 'General'].map((folder) => (
            <button
              key={folder}
              onClick={() => setActiveFolder(folder)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                activeFolder === folder
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Folder className="h-3.5 w-3.5" />
              <span>{folder}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by filename..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xs hover:border-slate-700 transition-all"
          >
            <div className="aspect-square w-full overflow-hidden bg-slate-950 relative">
              <img src={item.url} alt={item.name} className="h-full w-full object-cover" />

              {/* Action Overlays */}
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="rounded-lg bg-slate-800 p-2 text-white hover:bg-slate-700"
                  title="Preview"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-500"
                  title="Copy URL"
                >
                  {copiedId === item.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => onDeleteMedia(item.id)}
                  className="rounded-lg bg-rose-600 p-2 text-white hover:bg-rose-500"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-2.5">
              <span className="block font-bold text-xs text-white truncate">{item.name}</span>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>{item.size}</span>
                <span className="rounded bg-slate-800 px-1.5 py-0.2">{item.folder}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-bold text-white truncate">{previewItem.name}</span>
              <button onClick={() => setPreviewItem(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
              <img src={previewItem.url} alt={previewItem.name} className="h-full w-full object-contain" />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Dimensions: 1200x800 · File size: {previewItem.size}</span>
              <button
                onClick={() => handleCopyUrl(previewItem)}
                className="text-blue-400 font-bold hover:underline"
              >
                {copiedId === previewItem.id ? 'Copied!' : 'Copy Direct CDN Link'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Media Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCustomUpload}
            className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-base font-bold">Register Media Asset</span>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Image Asset URL *</label>
                <input
                  type="url"
                  required
                  value={newAssetUrl}
                  onChange={(e) => setNewAssetUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">File / Asset Name</label>
                <input
                  type="text"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  placeholder="sony-wh1000xm5-hero.webp"
                  className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Destination Folder</label>
                  <select
                    value={newAssetFolder}
                    onChange={(e) => setNewAssetFolder(e.target.value as AdminMediaItem['folder'])}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="Products">Products</option>
                    <option value="Heroes">Heroes</option>
                    <option value="Reviews">Reviews</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Compression Format</label>
                  <select
                    value={newAssetFormat}
                    onChange={(e) => setNewAssetFormat(e.target.value as 'WebP' | 'AVIF' | 'PNG' | 'JPEG')}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="WebP">WebP (Recommended)</option>
                    <option value="AVIF">AVIF (Ultra High)</option>
                    <option value="PNG">PNG</option>
                    <option value="JPEG">JPEG</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-900/40"
              >
                Add Asset to Library
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
