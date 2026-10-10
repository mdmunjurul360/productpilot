import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Sparkles,
  Star,
  ArrowRight,
  BookOpen,
  Scale,
  Layers,
  Clock,
  ExternalLink,
  ChevronRight,
  Tag,
  Flame,
  Award,
} from 'lucide-react';
import { executeSmartSearch, SearchQueryResult } from '../../data/unifiedCatalog';
import { CatalogProduct } from '../../context/DiscoveryContext';
import { ProductBadge } from '../common/ProductBadge';

interface GlobalSmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const GlobalSmartSearchModal: React.FC<GlobalSmartSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'guides' | 'comparisons'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('productpilot_recent_searches');
      return saved ? JSON.parse(saved) : ['Sony WH-1000XM5', 'MacBook Pro 16 M4', 'OLED 240Hz Gaming'];
    } catch {
      return ['Sony WH-1000XM5', 'MacBook Pro 16 M4', 'OLED 240Hz Gaming'];
    }
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const searchResults: SearchQueryResult = executeSmartSearch(query);

  // Flat navigation array for keyboard up/down arrows
  const navigableItems = React.useMemo(() => {
    const items: { type: string; title: string; slug: string }[] = [];

    if (activeTab === 'all' || activeTab === 'products') {
      searchResults.products.forEach((p) => {
        items.push({ type: 'product', title: p.name, slug: p.slug });
      });
    }

    if (activeTab === 'all' || activeTab === 'guides') {
      searchResults.guides.forEach((g) => {
        items.push({ type: 'guide', title: g.title, slug: g.slug });
      });
    }

    if (activeTab === 'all' || activeTab === 'comparisons') {
      searchResults.comparisons.forEach((c) => {
        items.push({ type: 'comparison', title: c.title, slug: c.slug });
      });
    }

    return items;
  }, [searchResults, activeTab]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      } else if (e.key === 'ArrowDown' && isOpen) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, navigableItems.length));
      } else if (e.key === 'ArrowUp' && isOpen) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + navigableItems.length) % Math.max(1, navigableItems.length));
      } else if (e.key === 'Enter' && isOpen) {
        e.preventDefault();
        if (navigableItems[selectedIndex]) {
          handleSelectSlug(navigableItems[selectedIndex].slug, navigableItems[selectedIndex].title);
        } else if (query.trim()) {
          handleViewAllResults();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, navigableItems, selectedIndex, query]);

  if (!isOpen) return null;

  const handleSelectSlug = (slug: string, title?: string) => {
    if (title && !recentSearches.includes(title)) {
      const updated = [title, ...recentSearches.filter((s) => s !== title)].slice(0, 6);
      setRecentSearches(updated);
      try {
        localStorage.setItem('productpilot_recent_searches', JSON.stringify(updated));
      } catch (err) {
        console.warn('Error saving recent searches:', err);
      }
    }
    onClose();
    if (onNavigate) {
      onNavigate(slug);
    }
  };

  const handleViewAllResults = () => {
    onClose();
    if (onNavigate) {
      onNavigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('productpilot_recent_searches');
  };

  // Keyword highlighting helper
  const highlightMatches = (text: string, keyword: string) => {
    if (!keyword.trim()) return text;
    const parts = text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <mark key={i} className="bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 rounded px-0.5 font-bold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-search-title"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-12 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 transition-all duration-300 mt-2 sm:mt-6 max-h-[88vh] flex flex-col">
        {/* Sticky Search Header Bar */}
        <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search lab reviews, products, brands, or comparisons..."
              className="flex-1 bg-transparent text-sm sm:text-base font-medium placeholder-slate-400 outline-none"
              aria-label="Search inquiry"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block rounded-md border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-500">
              ESC to close
            </kbd>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center justify-between pt-3 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'all', label: 'All Results' },
                { id: 'products', label: `Products (${searchResults.products.length})` },
                { id: 'guides', label: `Guides (${searchResults.guides.length})` },
                { id: 'comparisons', label: `Showdowns (${searchResults.comparisons.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as typeof activeTab);
                    setSelectedIndex(0);
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {query.trim() && (
              <button
                onClick={handleViewAllResults}
                className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline shrink-0 hidden sm:inline"
              >
                View full page →
              </button>
            )}
          </div>
        </div>

        {/* Results Body */}
        <div ref={resultsRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Recent Searches Strip (When query is empty) */}
          {!query.trim() && recentSearches.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-[10px]">Recent Queries</span>
                <button onClick={handleClearRecent} className="hover:text-rose-500 transition-colors">
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Categories & Brands Matching */}
          {(searchResults.categories.length > 0 || searchResults.brands.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              {searchResults.categories.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Layers className="h-3 w-3 text-blue-500" /> Categories
                  </span>
                  <div className="space-y-1">
                    {searchResults.categories.slice(0, 3).map((c) => (
                      <button
                        key={c.slug}
                        onClick={() => handleSelectSlug(c.slug, c.name)}
                        className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {highlightMatches(c.name, query)}
                        </span>
                        <span className="text-[10px] text-slate-400">{c.count} reviews</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.brands.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Award className="h-3 w-3 text-purple-500" /> Verified Brands
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {searchResults.brands.slice(0, 6).map((b) => (
                      <button
                        key={b.name}
                        onClick={() => setQuery(b.name)}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors"
                      >
                        <span className="font-bold">{highlightMatches(b.name, query)}</span>
                        <span className="text-[10px] text-slate-400">({b.count})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Products List (Instant Results with Images, Prices, Ratings, Badges, Merchants) */}
          {(activeTab === 'all' || activeTab === 'products') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Product Reviews ({searchResults.products.length})
                </span>
                <span className="text-[11px]">Instant lab scores & live pricing</span>
              </div>

              {searchResults.products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
                  No products matched &quot;{query}&quot;. Try checking for brand names like Sony, Apple, Bose, or Roborock.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {searchResults.products.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectSlug(product.slug, product.name)}
                      className="group flex items-center gap-4 py-3 px-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-800"
                        loading="lazy"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {product.badge && <ProductBadge type={product.badge} size="sm" />}
                          <span className="text-[11px] text-slate-400">{product.brand} · {product.category}</span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {highlightMatches(product.name, query)}
                        </h4>

                        <div className="flex items-center gap-3 text-xs flex-wrap">
                          <span className="font-black text-emerald-600 dark:text-emerald-400">
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-slate-400 line-through text-[11px]">
                              {product.originalPrice}
                            </span>
                          )}
                          <div className="flex items-center gap-1 font-bold text-amber-500 text-[11px]">
                            <Star className="h-3 w-3 fill-amber-500" />
                            <span>{product.rating}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            Available on {product.merchantsAvailable.join(', ')}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Buying Guides Section */}
          {(activeTab === 'all' || activeTab === 'guides') && searchResults.guides.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 text-blue-500" />
                Editorial Buying Guides ({searchResults.guides.length})
              </span>
              <div className="space-y-2">
                {searchResults.guides.map((guide) => (
                  <div
                    key={guide.slug}
                    onClick={() => handleSelectSlug(guide.slug, guide.title)}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div className="space-y-1 pr-3">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {highlightMatches(guide.title, query)}
                      </h5>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {guide.readingTime}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparisons Section */}
          {(activeTab === 'all' || activeTab === 'comparisons') && searchResults.comparisons.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Scale className="h-3 w-3 text-emerald-500" />
                Head-to-Head Comparisons ({searchResults.comparisons.length})
              </span>
              <div className="space-y-2">
                {searchResults.comparisons.map((comp) => (
                  <div
                    key={comp.slug}
                    onClick={() => handleSelectSlug(comp.slug, comp.title)}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  >
                    <div className="space-y-1 pr-3">
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {highlightMatches(comp.title, query)}
                      </h5>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                        Winner: {comp.winner}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 px-6 py-3 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Tip: Press</span>
            <kbd className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px]">
              ↑
            </kbd>
            <kbd className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px]">
              ↓
            </kbd>
            <span>to navigate,</span>
            <kbd className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1 py-0.5 font-mono text-[9px]">
              ↵
            </kbd>
            <span>to select</span>
          </div>
          <button
            onClick={handleViewAllResults}
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Full search page
          </button>
        </div>
      </div>
    </div>
  );
};
