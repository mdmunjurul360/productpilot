import React, { useState } from 'react';
import {
  X,
  Search,
  ChevronDown,
  Sparkles,
  Flame,
  Scale,
  BookOpen,
  Tag,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { MEGA_CATEGORIES } from '../../data/navigationData';
import { ProductPilotLogo } from '../brand/ProductPilotLogo';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  onNavigate?: (path: string) => void;
  selectedCurrency: string;
  onChangeCurrency: (curr: string) => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  onOpenSearch,
  onNavigate,
  selectedCurrency,
  onChangeCurrency,
}) => {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleCategory = (id: string) => {
    setExpandedCategoryId((prev) => (prev === id ? null : id));
  };

  const handleLinkClick = (path: string) => {
    onClose();
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative flex h-full w-full max-w-sm flex-col bg-white shadow-2xl overflow-hidden">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 py-4">
          <ProductPilotLogo size="sm" showTagline={false} />

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Search Action */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-500 shadow-sm hover:border-blue-400 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <span>Search products, guides & specs...</span>
            </div>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
              ⌘K
            </span>
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Main Categories Accordions */}
          <div>
            <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Product Categories
            </div>
            <div className="space-y-1">
              {MEGA_CATEGORIES.map((category) => {
                const isExpanded = expandedCategoryId === category.id;
                return (
                  <div key={category.id} className="overflow-hidden rounded-xl border border-slate-100 bg-white">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="flex w-full items-center justify-between p-3.5 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span>{category.name}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/60 p-3 space-y-2">
                        <div className="grid grid-cols-1 gap-1">
                          {category.subcategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => handleLinkClick(sub.slug)}
                              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-white hover:text-blue-600 transition-colors text-left"
                            >
                              <span>{sub.name}</span>
                              <span className="text-[10px] text-slate-400">{sub.productCount}</span>
                            </button>
                          ))}
                        </div>

                        {/* Quick category landing link */}
                        <div className="pt-2 border-t border-slate-200/60">
                          <button
                            onClick={() => handleLinkClick(`/category/${category.slug}`)}
                            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline px-2.5"
                          >
                            <span>Browse All {category.name}</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Direct Links */}
          <div>
            <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Editorial & Tools
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleLinkClick('/buying-guides')}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                  <span>Buying Guides 2026</span>
                </div>
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                  Curated
                </span>
              </button>

              <button
                onClick={() => handleLinkClick('/compare')}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Scale className="h-4 w-4 text-emerald-600" />
                  <span>Head-to-Head Comparisons</span>
                </div>
              </button>

              <button
                onClick={() => handleLinkClick('/deals')}
                className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span>Verified Deals & Drops</span>
                </div>
                <span className="rounded bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  Hot
                </span>
              </button>
            </div>
          </div>

          {/* Trust & Independence Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Independent Review Guarantee</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              We never accept paid placements or manufacturer review payments. All products are purchased at retail or tested in our independent acoustics & hardware labs.
            </p>
            <button
              onClick={() => handleLinkClick('/how-we-test')}
              className="mt-2 text-[11px] font-bold text-blue-600 hover:underline"
            >
              Learn about our testing protocols →
            </button>
          </div>

          {/* Currency / Region Selector in Drawer */}
          <div className="border-t border-slate-100 pt-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-500">
              Display Currency / Market
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['USD', 'EUR', 'GBP', 'CAD'].map((curr) => (
                <button
                  key={curr}
                  onClick={() => onChangeCurrency(curr)}
                  className={`rounded-lg py-1.5 text-xs font-bold transition-all ${
                    selectedCurrency === curr
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Notice */}
        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 text-[11px] text-slate-400">
          <span>ProductPilot • When buying through our links, we may earn a commission.</span>
        </div>
      </div>
    </div>
  );
};
