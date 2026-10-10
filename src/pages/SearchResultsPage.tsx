import React, { useState, useMemo } from 'react';
import {
  Search,
  Star,
  ArrowRight,
  X,
  Filter,
  BookOpen,
  Scale,
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { UNIFIED_CATALOG, executeSmartSearch } from '../data/unifiedCatalog';
import { POPULAR_SEARCH_TAGS } from '../data/navigationData';
import { ProductFilterSystem, FilterState, INITIAL_FILTER_STATE } from '../components/discovery/ProductFilterSystem';
import { useDiscovery, CatalogProduct } from '../context/DiscoveryContext';
import { ProductBadge } from '../components/common/ProductBadge';
import { AdContainer } from '../components/home/AdContainer';
import { SeoHead } from '../components/seo/SeoHead';

interface SearchResultsPageProps {
  initialQuery?: string;
  onNavigate: (path: string) => void;
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({
  initialQuery = '',
  onNavigate,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<'all' | 'products' | 'guides' | 'comparisons'>('all');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const {
    toggleFavorite,
    isFavorite,
    addToCompare,
    isInCompare,
  } = useDiscovery();

  // Smart search query execution
  const searchData = useMemo(() => {
    return executeSmartSearch(query);
  }, [query]);

  // Apply filters on matching products
  const filteredProducts = useMemo(() => {
    return searchData.products.filter((p) => {
      // Category filter
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(p.category)) {
        return false;
      }
      // Brand filter
      if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(p.brand)) {
        return false;
      }
      // Merchant filter
      if (
        filters.selectedMerchants.length > 0 &&
        !filters.selectedMerchants.some((m) => p.merchantsAvailable.includes(m as any))
      ) {
        return false;
      }
      // Badge filter
      if (filters.selectedBadges.length > 0 && (!p.badge || !filters.selectedBadges.includes(p.badge))) {
        return false;
      }
      // Price range
      if (p.numericPrice < filters.minPrice || p.numericPrice > filters.maxPrice) {
        return false;
      }
      // Rating
      if (filters.minRating > 0 && p.rating < filters.minRating) {
        return false;
      }
      // In stock
      if (filters.inStockOnly && p.availability !== 'In Stock') {
        return false;
      }
      // On sale
      if (filters.onSaleOnly && !p.discount) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_low':
          return a.numericPrice - b.numericPrice;
        case 'price_high':
          return b.numericPrice - a.numericPrice;
        case 'user_rating':
          return b.userRating - a.userRating;
        case 'newest':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'highest_rated':
        default:
          return b.rating - a.rating;
      }
    });
  }, [searchData.products, filters]);

  const totalResultsCount =
    filteredProducts.length + searchData.guides.length + searchData.comparisons.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <SeoHead
        title={query ? `Search: "${query}"` : 'Smart Catalog Search'}
        description={`Explore lab tests, price comparisons, and buying guides matching "${query}" on ProductPilot.`}
        canonicalPath={query ? `/search?q=${encodeURIComponent(query)}` : '/search'}
        ogType="website"
      />

      {/* Search Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Intelligent Hardware Discovery Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
            Search Laboratory Benchmarks, Specs & Deals
          </h1>

          {/* Search Input Box */}
          <div className="relative max-w-3xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by hardware name, model, brand, or feature (e.g. Sony XM5, OLED, M4)..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-4 pl-12 pr-10 text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Trending Searches Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" /> Popular Tags:
            </span>
            {POPULAR_SEARCH_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${
                  query === tag
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Container with Filter Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Control Bar with Tabs & Mobile Filter Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'all', label: `All Results (${totalResultsCount})` },
              { id: 'products', label: `Hardware Products (${filteredProducts.length})` },
              { id: 'guides', label: `Buying Guides (${searchData.guides.length})` },
              { id: 'comparisons', label: `Comparisons (${searchData.comparisons.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id as typeof activeType)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                  activeType === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <span className="text-xs text-slate-400">
              Showing <strong>{filteredProducts.length}</strong> products
            </span>
          </div>
        </div>

        {/* 2-Column Grid: Filters Sidebar + Results List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Desktop Left Sidebar: Filter System */}
          <div className="hidden lg:block lg:col-span-3">
            <ProductFilterSystem
              products={UNIFIED_CATALOG}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
              totalFilteredCount={filteredProducts.length}
            />
          </div>

          {/* Results Main Area */}
          <div className="lg:col-span-9 space-y-6">
            {/* Products Grid */}
            {(activeType === 'all' || activeType === 'products') && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Product Lab Reviews & Live Prices
                  </h3>
                  <span className="text-xs text-slate-400">
                    Sorted by: <span className="font-bold text-slate-700 dark:text-slate-300">{filters.sortBy}</span>
                  </span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-2">
                    <Search className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      No products match your active search filters
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Try adjusting the price range or clearing selected brand filters.
                    </p>
                    <button
                      onClick={() => setFilters(INITIAL_FILTER_STATE)}
                      className="mt-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredProducts.map((p) => (
                      <div
                        key={p.id}
                        className="group rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            {p.badge ? (
                              <ProductBadge type={p.badge} size="sm" />
                            ) : (
                              <span className="text-[10px] font-bold uppercase text-slate-400">
                                {p.brand}
                              </span>
                            )}

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => toggleFavorite(p)}
                                className={`p-1.5 rounded-xl border transition-colors ${
                                  isFavorite(p.id)
                                    ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-500'
                                    : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-900'
                                }`}
                                title="Bookmark"
                              >
                                <Bookmark className={`h-3.5 w-3.5 ${isFavorite(p.id) ? 'fill-rose-500' : ''}`} />
                              </button>
                              <button
                                onClick={() => addToCompare(p)}
                                className={`p-1.5 rounded-xl border transition-colors ${
                                  isInCompare(p.id)
                                    ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-500'
                                    : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-500 bg-white dark:bg-slate-900'
                                }`}
                                title="Add to comparison"
                              >
                                <Scale className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div
                            onClick={() => onNavigate(p.slug)}
                            className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer"
                          >
                            <img
                              src={p.image}
                              alt={p.name}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          </div>

                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 font-bold uppercase">
                              {p.category} · {p.brand}
                            </span>
                            <h4
                              onClick={() => onNavigate(p.slug)}
                              className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2 transition-colors"
                            >
                              {p.name}
                            </h4>
                          </div>

                          <div className="flex items-baseline justify-between text-xs pt-1">
                            <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                              {p.price}
                            </span>
                            <div className="flex items-center gap-1 font-bold text-amber-500 text-xs">
                              <Star className="h-3.5 w-3.5 fill-amber-500" />
                              <span>{p.rating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 pt-0 space-y-2 border-t border-slate-100 dark:border-slate-800/80 mt-2">
                          <a
                            href={p.affiliateUrl}
                            target="_blank"
                            rel="sponsored nofollow noopener noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 py-2.5 font-bold text-xs text-white transition-colors"
                          >
                            <span>Buy on {p.merchant}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Buying Guides Section */}
            {(activeType === 'all' || activeType === 'guides') && searchData.guides.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  Relevant Editorial Guides
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {searchData.guides.map((guide) => (
                    <div
                      key={guide.slug}
                      onClick={() => onNavigate(guide.slug)}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="space-y-1 pr-3">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                          {guide.title}
                        </h4>
                        <span className="text-[11px] text-slate-400">{guide.readingTime}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comparisons Section */}
            {(activeType === 'all' || activeType === 'comparisons') && searchData.comparisons.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-emerald-500" />
                  Head-to-Head Lab Showdowns
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {searchData.comparisons.map((comp) => (
                    <div
                      key={comp.slug}
                      onClick={() => onNavigate(comp.slug)}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="space-y-1 pr-3">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                          {comp.title}
                        </h4>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
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
        </div>
      </div>

      {/* Mobile Drawer Filter Dialog */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full p-4 overflow-y-auto">
            <ProductFilterSystem
              products={UNIFIED_CATALOG}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
              totalFilteredCount={filteredProducts.length}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
