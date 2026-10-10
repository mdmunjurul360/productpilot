import React, { useState } from 'react';
import {
  Link2,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  MousePointerClick,
  ShieldCheck,
  Tag,
  Settings,
  Globe,
} from 'lucide-react';
import { AdminAffiliateOffer } from '../types';

interface AdminAffiliateLinksProps {
  offers: AdminAffiliateOffer[];
  onSaveOffer: (offer: AdminAffiliateOffer) => void;
  onDeleteOffer: (id: string) => void;
  onToggleOffer: (id: string) => void;
}

export const AdminAffiliateLinks: React.FC<AdminAffiliateLinksProps> = ({
  offers,
  onSaveOffer,
  onDeleteOffer,
  onToggleOffer,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<AdminAffiliateOffer | null>(null);

  // Global Tracking IDs configuration box
  const [globalTrackingIds, setGlobalTrackingIds] = useState({
    amazon: 'pilot-20',
    ebay: 'epn-53389012',
    aliexpress: 'ae_pilot_2026',
    daraz: 'daraz_partner_812',
  });
  const [isTrackingSaved, setIsTrackingSaved] = useState(false);

  const [formData, setFormData] = useState<Partial<AdminAffiliateOffer>>({
    productName: 'Sony WH-1000XM5',
    productId: 'prod-1',
    store: 'Amazon',
    affiliateUrl: 'https://amazon.com/dp/B09XS7JWHH?tag=pilot-20',
    price: '$398.00',
    oldPrice: '$449.99',
    coupon: '',
    availability: 'In Stock',
    buttonText: 'Check Price on Amazon',
    isEnabled: true,
    openInNewTab: true,
    relSponsored: true,
    relNofollow: true,
  });

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setFormData({
      productName: 'Sony WH-1000XM5',
      productId: 'prod-1',
      store: 'Amazon',
      affiliateUrl: 'https://amazon.com?tag=pilot-20',
      price: '$398.00',
      oldPrice: '$449.99',
      coupon: '',
      availability: 'In Stock',
      buttonText: 'Check Price on Amazon',
      isEnabled: true,
      openInNewTab: true,
      relSponsored: true,
      relNofollow: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer: AdminAffiliateOffer) => {
    setEditingOffer(offer);
    setFormData({ ...offer, openInNewTab: true, relSponsored: true, relNofollow: true });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.affiliateUrl || !formData.price) return;

    const saved: AdminAffiliateOffer = {
      id: editingOffer ? editingOffer.id : `aff-${Date.now()}`,
      productName: formData.productName || 'General Product',
      productId: formData.productId || 'prod-1',
      store: formData.store || 'Amazon',
      affiliateUrl: formData.affiliateUrl || 'https://amazon.com',
      price: formData.price || '$0.00',
      oldPrice: formData.oldPrice,
      coupon: formData.coupon,
      availability: formData.availability || 'In Stock',
      buttonText: formData.buttonText || `Buy on ${formData.store}`,
      isEnabled: formData.isEnabled ?? true,
      clicksCount: editingOffer ? editingOffer.clicksCount : 0,
      lastChecked: 'Verified Today',
      openInNewTab: formData.openInNewTab ?? true,
      relSponsored: formData.relSponsored ?? true,
      relNofollow: formData.relNofollow ?? true,
    };

    onSaveOffer(saved);
    setIsModalOpen(false);
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTrackingSaved(true);
    setTimeout(() => setIsTrackingSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight font-sans">
            Affiliate Management & Link Cloaker Hub
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure Amazon, eBay, AliExpress & Daraz deep-links, tracking IDs, and rel="sponsored" tags
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/40 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Add Marketplace Deep-Link</span>
        </button>
      </div>

      {/* Global Tracking Tags Box */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 space-y-3 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Global Network Tracking IDs (Automated Tag Injection)
            </h3>
          </div>
          {isTrackingSaved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="h-3 w-3" /> Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveTracking} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 font-semibold block mb-1">Amazon Associate Tag</label>
            <input
              type="text"
              value={globalTrackingIds.amazon}
              onChange={(e) => setGlobalTrackingIds({ ...globalTrackingIds, amazon: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">eBay Partner ID</label>
            <input
              type="text"
              value={globalTrackingIds.ebay}
              onChange={(e) => setGlobalTrackingIds({ ...globalTrackingIds, ebay: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="text-slate-400 font-semibold block mb-1">AliExpress Portal ID</label>
            <input
              type="text"
              value={globalTrackingIds.aliexpress}
              onChange={(e) => setGlobalTrackingIds({ ...globalTrackingIds, aliexpress: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono"
            />
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-slate-400 font-semibold block mb-1">Daraz Affiliate ID</label>
              <input
                type="text"
                value={globalTrackingIds.daraz}
                onChange={(e) => setGlobalTrackingIds({ ...globalTrackingIds, daraz: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 font-bold"
            >
              Update
            </button>
          </div>
        </form>
      </div>

      {/* Offers Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-950/60">
                <th className="py-3.5 px-4 font-bold">Store Platform</th>
                <th className="py-3.5 px-4 font-bold">Product Link Target</th>
                <th className="py-3.5 px-4 font-bold">Live Price</th>
                <th className="py-3.5 px-4 font-bold">Availability</th>
                <th className="py-3.5 px-4 font-bold">Outbound Clicks</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-black ${
                        offer.store === 'Amazon'
                          ? 'bg-[#FF9900] text-slate-950'
                          : offer.store === 'eBay'
                          ? 'bg-[#0064D2] text-white'
                          : offer.store === 'AliExpress'
                          ? 'bg-[#FF4747] text-white'
                          : offer.store === 'Daraz'
                          ? 'bg-[#F85606] text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {offer.store}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <span className="font-bold text-white block truncate">{offer.productName}</span>
                    <a
                      href={offer.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-400 hover:underline truncate block"
                    >
                      {offer.affiliateUrl}
                    </a>
                  </td>
                  <td className="py-3 px-4 font-black text-emerald-400 text-sm">{offer.price}</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-400 font-semibold">{offer.availability}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-300">
                    {offer.clicksCount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onToggleOffer(offer.id)}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        offer.isEnabled
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {offer.isEnabled ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(offer)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-blue-400"
                        title="Edit Offer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteOffer(offer.id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-950 hover:text-rose-400"
                        title="Delete Offer"
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

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingOffer ? 'Edit Marketplace Deep-Link' : 'New Marketplace Offer'}
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
                  <label className="text-slate-400 font-bold block mb-1">Target Product</label>
                  <input
                    type="text"
                    value={formData.productName || ''}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Merchant Marketplace</label>
                  <select
                    value={formData.store}
                    onChange={(e) => setFormData({ ...formData, store: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  >
                    <option value="Amazon">Amazon</option>
                    <option value="eBay">eBay</option>
                    <option value="AliExpress">AliExpress</option>
                    <option value="Daraz">Daraz</option>
                    <option value="Custom">Custom / Direct Merchant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">
                  Full Affiliate Link URL (with SubID or tag)
                </label>
                <input
                  type="url"
                  value={formData.affiliateUrl || ''}
                  onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                  placeholder="https://..."
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Current Price</label>
                  <input
                    type="text"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. $398.00"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Old Price (MSRP)</label>
                  <input
                    type="text"
                    value={formData.oldPrice || ''}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    placeholder="e.g. $449.99"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Promo Coupon Code</label>
                  <input
                    type="text"
                    value={formData.coupon || ''}
                    onChange={(e) => setFormData({ ...formData, coupon: e.target.value })}
                    placeholder="Optional coupon"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              {/* Compliance & Attributes */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Link Attributes & Regulatory Compliance
                </span>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.openInNewTab}
                      onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-900 text-blue-600"
                    />
                    <span>Open in new window (_blank)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.relSponsored}
                      onChange={(e) => setFormData({ ...formData, relSponsored: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-900 text-blue-600"
                    />
                    <span>rel="sponsored"</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.relNofollow}
                      onChange={(e) => setFormData({ ...formData, relNofollow: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-900 text-blue-600"
                    />
                    <span>rel="nofollow"</span>
                  </label>
                </div>
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
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-900/40"
                >
                  Save Marketplace Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
