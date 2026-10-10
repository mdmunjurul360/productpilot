import React, { useState } from 'react';
import {
  SlidersHorizontal,
  X,
  Star,
  Check,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ArrowUpDown,
  Tag,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';
import { CatalogProduct } from '../../context/DiscoveryContext';

export interface FilterState {
  selectedCategories: string[];
  selectedBrands: string[];
  selectedMerchants: string[];
  selectedBadges: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  minUserRating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: string;
}

export const INITIAL_FILTER_STATE: FilterState = {
  selectedCategories: [],
  selectedBrands: [],
  selectedMerchants: [],
  selectedBadges: [],
  minPrice: 0,
  maxPrice: 4000,
  minRating: 0,
  minUserRating: 0,
  inStockOnly: false,
  onSaleOnly: false,
  sortBy: 'highest_rated',
};

interface ProductFilterSystemProps {
  products: CatalogProduct[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  className?: string;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const ProductFilterSystem: React.FC<ProductFilterSystemProps> = ({
  products,
  filters,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
  className = '',
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  // Extract distinct metadata options from products catalog
  const availableBrands = Array.from(new Set(products.map((p) => p.brand))).sort();
  const availableCategories = Array.from(new Set(products.map((p) => p.category))).sort();
  const availableMerchants = ['Amazon', 'eBay', 'AliExpress', 'Daraz'];
  const availableBadges = [
    "Editor's Choice",
    'Best Seller',
    'Trending',
    'Hot Deal',
    'Top Rated',
    'Price Drop',
    'Best Value',
    'Premium Pick',
  ];

  // Helper toggle functions
  const toggleBrand = (brand: string) => {
    const updated = filters.selectedBrands.includes(brand)
      ? filters.selectedBrands.filter((b) => b !== brand)
      : [...filters.selectedBrands, brand];
    onFilterChange({ ...filters, selectedBrands: updated });
  };

  const toggleCategory = (cat: string) => {
    const updated = filters.selectedCategories.includes(cat)
      ? filters.selectedCategories.filter((c) => c !== cat)
      : [...filters.selectedCategories, cat];
    onFilterChange({ ...filters, selectedCategories: updated });
  };

  const toggleMerchant = (m: string) => {
    const updated = filters.selectedMerchants.includes(m)
      ? filters.selectedMerchants.filter((item) => item !== m)
      : [...filters.selectedMerchants, m];
    onFilterChange({ ...filters, selectedMerchants: updated });
  };

  const toggleBadge = (badge: string) => {
    const updated = filters.selectedBadges.includes(badge)
      ? filters.selectedBadges.filter((b) => b !== badge)
      : [...filters.selectedBadges, badge];
    onFilterChange({ ...filters, selectedBadges: updated });
  };

  const hasActiveFilters =
    filters.selectedCategories.length > 0 ||
    filters.selectedBrands.length > 0 ||
    filters.selectedMerchants.length > 0 ||
    filters.selectedBadges.length > 0 ||
    filters.minRating > 0 ||
    filters.minUserRating > 0 ||
    filters.inStockOnly ||
    filters.onSaleOnly ||
    filters.maxPrice < 4000 ||
    filters.minPrice > 0;

  return (
    <aside
      className={`space-y-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-xs transition-colors ${className}`}
    >
      {/* Header bar with count & reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Refine Catalog
          </h3>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 text-[11px] font-bold">
            {totalFilteredCount}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}

          {isMobileDrawer && onCloseMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Sorting Dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ArrowUpDown className="h-3.5 w-3.5 text-blue-500" />
          <span>Sort By</span>
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-blue-500 transition-colors"
        >
          <option value="highest_rated">Highest Rated (Lab Score)</option>
          <option value="user_rating">Highest User Reviews</option>
          <option value="price_low">Lowest Price ($ → $$$)</option>
          <option value="price_high">Highest Price ($$$ → $)</option>
          <option value="most_popular">Most Popular / Clicks</option>
          <option value="trending">Trending This Week</option>
          <option value="editors_pick">Editor&apos;s Pick</option>
          <option value="best_value">Best Value Ratio</option>
          <option value="newest">Newest Releases</option>
        </select>
      </div>

      {/* Price Range Filter (Quick Presets + Dual Inputs) */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
            <span>Price Range</span>
          </span>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
            ${filters.minPrice} – ${filters.maxPrice}
          </span>
        </label>

        {/* Quick price chips */}
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          {[
            { label: 'Under $300', min: 0, max: 300 },
            { label: '$300 – $600', min: 300, max: 600 },
            { label: '$600 – $1,500', min: 600, max: 1500 },
            { label: 'Over $1,500', min: 1500, max: 4000 },
          ].map((preset) => {
            const isSelected = filters.minPrice === preset.min && filters.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    minPrice: isSelected ? 0 : preset.min,
                    maxPrice: isSelected ? 4000 : preset.max,
                  })
                }
                className={`py-1 px-2 rounded-lg text-center font-bold border transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Interactive Slider */}
        <input
          type="range"
          min="0"
          max="4000"
          step="50"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>

      {/* Editorial Rating Filter */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
          <span>Minimum Editorial Score</span>
        </label>
        <div className="grid grid-cols-4 gap-1.5 text-xs">
          {[9.5, 9.0, 8.5, 8.0].map((score) => {
            const isSelected = filters.minRating === score;
            return (
              <button
                key={score}
                onClick={() => onFilterChange({ ...filters, minRating: isSelected ? 0 : score })}
                className={`py-1 px-2 rounded-xl text-center font-extrabold border transition-colors ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-amber-400'
                }`}
              >
                {score}+
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Selection (Multi-Select) */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Brands
        </label>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          {availableBrands.map((brand) => {
            const isChecked = filters.selectedBrands.includes(brand);
            const count = products.filter((p) => p.brand === brand).length;
            return (
              <label
                key={brand}
                onClick={() => toggleBrand(brand)}
                className="flex items-center justify-between py-1 px-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer select-none transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-md border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span className={`font-semibold ${isChecked ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {brand}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Categories
        </label>
        <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
          {availableCategories.map((cat) => {
            const isChecked = filters.selectedCategories.includes(cat);
            const count = products.filter((p) => p.category === cat).length;
            return (
              <label
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="flex items-center justify-between py-1 px-2 rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer select-none transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-4 w-4 rounded-md border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span className={`font-semibold ${isChecked ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {cat}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Merchant Stores */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Marketplace Stores
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {availableMerchants.map((m) => {
            const isChecked = filters.selectedMerchants.includes(m);
            return (
              <button
                key={m}
                onClick={() => toggleMerchant(m)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-between ${
                  isChecked
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <span>{m}</span>
                {isChecked && <Check className="h-3 w-3" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges / Awards */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Special Badges & Awards
        </label>
        <div className="flex flex-wrap gap-1.5">
          {availableBadges.map((badge) => {
            const isChecked = filters.selectedBadges.includes(badge);
            return (
              <button
                key={badge}
                onClick={() => toggleBadge(badge)}
                className={`py-1 px-2.5 rounded-full text-[11px] font-bold border transition-colors ${
                  isChecked
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                {badge}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles: In-Stock Only & On Sale Only */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label
          onClick={() => onFilterChange({ ...filters, inStockOnly: !filters.inStockOnly })}
          className="flex items-center justify-between cursor-pointer select-none py-1"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            In-Stock Only
          </span>
          <div
            className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
              filters.inStockOnly ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                filters.inStockOnly ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </label>

        <label
          onClick={() => onFilterChange({ ...filters, onSaleOnly: !filters.onSaleOnly })}
          className="flex items-center justify-between cursor-pointer select-none py-1"
        >
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Price Drops / Deals Only
          </span>
          <div
            className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
              filters.onSaleOnly ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                filters.onSaleOnly ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </div>
        </label>
      </div>
    </aside>
  );
};
