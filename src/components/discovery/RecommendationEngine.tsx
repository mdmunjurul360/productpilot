import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  DollarSign,
  Crown,
  TrendingUp,
  Zap,
  CheckCircle2,
  Bookmark,
  Scale,
  ExternalLink,
  ChevronRight,
  Star,
  Cpu,
} from 'lucide-react';
import { UNIFIED_CATALOG } from '../../data/unifiedCatalog';
import { CatalogProduct, useDiscovery } from '../../context/DiscoveryContext';
import { ProductBadge } from '../common/ProductBadge';

export type RecommendationType =
  | 'best_overall'
  | 'best_budget'
  | 'best_premium'
  | 'best_performance'
  | 'best_value'
  | 'best_professionals'
  | 'trending'
  | 'ai_recommended';

interface RecommendationEngineProps {
  onNavigate: (path: string) => void;
  title?: string;
  subtitle?: string;
  initialCategory?: string;
}

export const RecommendationEngine: React.FC<RecommendationEngineProps> = ({
  onNavigate,
  title = 'Intelligent Lab Recommendations & Discovery',
  subtitle = 'Algorithmic curation combining our 450+ hours of acoustic and hardware bench testing.',
  initialCategory,
}) => {
  const [activeTab, setActiveTab] = useState<RecommendationType>('best_overall');
  const { toggleFavorite, isFavorite, addToCompare, isInCompare } = useDiscovery();

  // Curate products dynamically based on recommendation criteria
  const recommendedProducts = React.useMemo(() => {
    let list = [...UNIFIED_CATALOG];
    if (initialCategory) {
      list = list.filter((p) => p.category.toLowerCase().includes(initialCategory.toLowerCase()));
    }

    switch (activeTab) {
      case 'best_overall':
        return list.sort((a, b) => b.rating - a.rating).slice(0, 4);
      case 'best_budget':
        return list.filter((p) => p.numericPrice < 400).sort((a, b) => a.numericPrice - b.numericPrice).slice(0, 4);
      case 'best_premium':
        return list.filter((p) => p.numericPrice >= 1000).sort((a, b) => b.rating - a.rating).slice(0, 4);
      case 'best_performance':
        return list.filter((p) => p.rating >= 9.6).slice(0, 4);
      case 'best_value':
        return list.filter((p) => p.badge === 'Best Value' || p.discount).slice(0, 4);
      case 'best_professionals':
        return list.filter((p) => p.name.includes('Pro') || p.brand === 'Apple' || p.brand === 'Sony').slice(0, 4);
      case 'trending':
        return list.filter((p) => p.badge === 'Trending' || p.badge === 'Best Seller').slice(0, 4);
      case 'ai_recommended':
        // High multi-factor score: rating + review count / price ratio
        return list.sort((a, b) => (b.rating * b.userRating) - (a.rating * a.userRating)).slice(0, 4);
      default:
        return list.slice(0, 4);
    }
  }, [activeTab, initialCategory]);

  const tabs: { id: RecommendationType; label: string; icon: React.ReactNode }[] = [
    { id: 'best_overall', label: 'Best Overall', icon: <Award className="h-3.5 w-3.5" /> },
    { id: 'best_value', label: 'Best Value', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    { id: 'best_budget', label: 'Best Budget', icon: <DollarSign className="h-3.5 w-3.5" /> },
    { id: 'best_premium', label: 'Best Premium', icon: <Crown className="h-3.5 w-3.5" /> },
    { id: 'best_performance', label: 'Peak Performance', icon: <Cpu className="h-3.5 w-3.5" /> },
    { id: 'trending', label: 'Trending This Week', icon: <TrendingUp className="h-3.5 w-3.5" /> },
    { id: 'ai_recommended', label: 'Lab AI Recommended', icon: <Sparkles className="h-3.5 w-3.5" /> },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ProductPilot Lab Intelligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1.5 font-sans">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {recommendedProducts.map((product) => (
          <div
            key={product.id}
            className="group relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            {/* Top Badges & Actions */}
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                {product.badge ? (
                  <ProductBadge type={product.badge} size="sm" />
                ) : (
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    {product.brand}
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavorite(product)}
                    className={`p-1.5 rounded-xl border transition-colors ${
                      isFavorite(product.id)
                        ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800 text-rose-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 bg-white dark:bg-slate-900'
                    }`}
                    title="Save to bookmarks"
                  >
                    <Bookmark className={`h-3.5 w-3.5 ${isFavorite(product.id) ? 'fill-rose-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => addToCompare(product)}
                    className={`p-1.5 rounded-xl border transition-colors ${
                      isInCompare(product.id)
                        ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800 text-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-500 bg-white dark:bg-slate-900'
                    }`}
                    title="Add to comparison"
                  >
                    <Scale className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Product Image */}
              <div
                onClick={() => onNavigate(product.slug)}
                className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 cursor-pointer relative group-hover:scale-[1.02] transition-transform"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Product Details */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {product.category} · {product.brand}
                </span>
                <h3
                  onClick={() => onNavigate(product.slug)}
                  className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2 transition-colors"
                >
                  {product.name}
                </h3>
              </div>

              {/* Score & Rating Pill */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1 font-black text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 text-[10px] font-normal">
                    ({product.reviewsCount})
                  </span>
                </div>

                <div>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-slate-400 line-through text-[10px] ml-1">
                      {product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 pt-0 space-y-2 border-t border-slate-100 dark:border-slate-800/80 mt-2">
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 py-2.5 font-bold text-xs text-white transition-colors shadow-xs"
              >
                <span>Check Deal on {product.merchant}</span>
                <ExternalLink className="h-3 w-3" />
              </a>

              <button
                onClick={() => onNavigate(product.slug)}
                className="w-full flex items-center justify-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 py-1 transition-colors"
              >
                <span>Read Full Lab Review</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
