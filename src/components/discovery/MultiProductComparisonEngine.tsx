import React, { useState } from 'react';
import {
  Scale,
  Award,
  Star,
  Check,
  X,
  Plus,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Zap,
  Bookmark,
  Share2,
} from 'lucide-react';
import { CatalogProduct, useDiscovery } from '../../context/DiscoveryContext';
import { UNIFIED_CATALOG } from '../../data/unifiedCatalog';
import { ProductBadge } from '../common/ProductBadge';

interface MultiProductComparisonEngineProps {
  initialProducts?: CatalogProduct[];
  onNavigate: (path: string) => void;
}

export const MultiProductComparisonEngine: React.FC<MultiProductComparisonEngineProps> = ({
  initialProducts,
  onNavigate,
}) => {
  const {
    compareList,
    addToCompare,
    removeFromCompare,
    toggleFavorite,
    isFavorite,
    showToast,
  } = useDiscovery();

  // If initialProducts passed, use them; otherwise use compareList or default 3 top products
  const defaultSelected: CatalogProduct[] = React.useMemo(() => {
    if (initialProducts && initialProducts.length > 0) return initialProducts.slice(0, 4);
    if (compareList.length > 0) return compareList.slice(0, 4);
    return [
      UNIFIED_CATALOG.find((p) => p.id === 'prod-sony-xm5')!,
      UNIFIED_CATALOG.find((p) => p.id === 'prod-bose-ultra')!,
      UNIFIED_CATALOG.find((p) => p.id === 'prod-sennheiser-m4')!,
    ].filter(Boolean);
  }, [initialProducts, compareList]);

  const [activeProducts, setActiveProducts] = useState<CatalogProduct[]>(defaultSelected);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  // Sync with global compare list when changes happen externally
  React.useEffect(() => {
    if (compareList.length > 0) {
      setActiveProducts(compareList.slice(0, 4));
    }
  }, [compareList]);

  const handleRemoveContender = (id: string) => {
    if (activeProducts.length <= 1) {
      showToast('At least 1 product must remain in comparison view.', 'info');
      return;
    }
    const updated = activeProducts.filter((p) => p.id !== id);
    setActiveProducts(updated);
    removeFromCompare(id);
  };

  const handleAddContender = (product: CatalogProduct) => {
    if (activeProducts.some((p) => p.id === product.id)) {
      showToast(`"${product.name}" is already in this comparison.`, 'info');
      return;
    }
    if (activeProducts.length >= 4) {
      showToast('Maximum 4 products allowed in comparison.', 'warning');
      return;
    }
    setActiveProducts([...activeProducts, product]);
    addToCompare(product);
    setIsAddProductModalOpen(false);
  };

  // Automated Best Value / Best Metrics Calculators
  const highestScore = Math.max(...activeProducts.map((p) => p.rating));
  const lowestPrice = Math.min(...activeProducts.map((p) => p.numericPrice));
  const lowestWeightNumeric = Math.min(
    ...activeProducts.map((p) => {
      const match = p.specs.weight.match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[1]) : 9999;
    })
  );

  return (
    <div className="space-y-8">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Scale className="h-3.5 w-3.5" />
            <span>Multi-Hardware Comparison Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Comparing {activeProducts.length} Selected Contenders
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Automated green/gold badges highlight benchmark winners across score, price, and lab specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeProducts.length < 4 && (
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/30 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Contender ({activeProducts.length}/4)</span>
            </button>
          )}

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast('Comparison link copied to clipboard!');
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 transition-colors"
            title="Share comparison"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Responsive Comparison Grid Table */}
      <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
        <table className="w-full min-w-[700px] border-collapse text-left text-xs">
          <thead>
            {/* Row 1: Product Header Cards with Image, Score, Badges, Price & Buy Buttons */}
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 divide-x divide-slate-100 dark:divide-slate-800">
              <th className="w-44 p-4 align-top font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                Hardware Contender
              </th>
              {activeProducts.map((p) => {
                const isOverallWinner = p.rating === highestScore;
                const isBestPrice = p.numericPrice === lowestPrice;

                return (
                  <th key={p.id} className="p-4 align-top space-y-3 min-w-[220px]">
                    <div className="flex items-center justify-between">
                      {isOverallWinner ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 text-slate-950 px-2 py-0.5 text-[10px] font-black uppercase">
                          <Award className="h-3 w-3" /> Winner
                        </span>
                      ) : isBestPrice ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-slate-950 px-2 py-0.5 text-[10px] font-black uppercase">
                          <Zap className="h-3 w-3" /> Best Price
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Contender</span>
                      )}

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleFavorite(p)}
                          className={`p-1 rounded-lg transition-colors ${
                            isFavorite(p.id)
                              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/60'
                              : 'text-slate-400 hover:text-rose-500'
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className={`h-4 w-4 ${isFavorite(p.id) ? 'fill-rose-500' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleRemoveContender(p.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Remove from comparison"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-20 w-20 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{p.brand}</span>
                        <h4
                          onClick={() => onNavigate(p.slug)}
                          className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2 transition-colors"
                        >
                          {p.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                          {p.price}
                        </span>
                        {p.originalPrice && (
                          <span className="text-slate-400 line-through text-[11px] ml-1.5">
                            {p.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 font-black text-amber-500 text-sm">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>{p.rating}</span>
                      </div>
                    </div>

                    {/* Direct Buy Box Link */}
                    <a
                      href={p.affiliateUrl}
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 py-2 text-white font-bold text-xs transition-colors shadow-xs"
                    >
                      <span>Buy on {p.merchant}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Category / Subcategory */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 divide-x divide-slate-100 dark:divide-slate-800">
              <td className="p-3.5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20">
                Category
              </td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                  {p.category} · {p.subcategory}
                </td>
              ))}
            </tr>

            {/* Battery Stamina */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 divide-x divide-slate-100 dark:divide-slate-800">
              <td className="p-3.5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20">
                Battery Stamina
              </td>
              {activeProducts.map((p) => {
                const isLongest = p.specs.battery.includes('60 Hours') || p.specs.battery.includes('31.4 Hours');
                return (
                  <td key={p.id} className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    <span className={isLongest ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : ''}>
                      {p.specs.battery}
                    </span>
                    {isLongest && (
                      <span className="ml-1.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1 py-0.2 text-[9px] font-bold">
                        Top Stamina
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Weight */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 divide-x divide-slate-100 dark:divide-slate-800">
              <td className="p-3.5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20">
                Weight & Ergonomics
              </td>
              {activeProducts.map((p) => {
                const match = p.specs.weight.match(/(\d+(\.\d+)?)/);
                const isLightest = match && parseFloat(match[1]) === lowestWeightNumeric;
                return (
                  <td key={p.id} className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    <span className={isLightest ? 'text-blue-600 dark:text-blue-400 font-extrabold' : ''}>
                      {p.specs.weight}
                    </span>
                    {isLightest && (
                      <span className="ml-1.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1 py-0.2 text-[9px] font-bold">
                        Lightest
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>

            {/* Performance Benchmark */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 divide-x divide-slate-100 dark:divide-slate-800">
              <td className="p-3.5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20">
                Lab Performance
              </td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-3.5 text-slate-700 dark:text-slate-300 leading-relaxed">
                  {p.specs.performance}
                </td>
              ))}
            </tr>

            {/* Connectivity */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 divide-x divide-slate-100 dark:divide-slate-800">
              <td className="p-3.5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20">
                Connectivity & Codecs
              </td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-3.5 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {p.specs.connectivity}
                </td>
              ))}
            </tr>

            {/* Dimensions */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 divide-x divide-slate-100 dark:divide-slate-800">
              <td className="p-3.5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20">
                Dimensions
              </td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-3.5 text-slate-600 dark:text-slate-400">
                  {p.specs.dimensions}
                </td>
              ))}
            </tr>

            {/* Warranty */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 divide-x divide-slate-100 dark:divide-slate-800">
              <td className="p-3.5 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/40 dark:bg-slate-950/20">
                Manufacturer Warranty
              </td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-3.5 text-slate-700 dark:text-slate-300">
                  {p.specs.warranty}
                </td>
              ))}
            </tr>

            {/* Key Pros */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 divide-x divide-slate-100 dark:divide-slate-800">
              <td className="p-3.5 font-bold text-emerald-700 dark:text-emerald-400 bg-slate-50/40 dark:bg-slate-950/20">
                Key Strengths (Pros)
              </td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-3.5 space-y-1.5 align-top">
                  {p.pros.map((pro, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Key Cons */}
            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 divide-x divide-slate-100 dark:divide-slate-800">
              <td className="p-3.5 font-bold text-rose-700 dark:text-rose-400 bg-slate-50/40 dark:bg-slate-950/20">
                Compromises (Cons)
              </td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-3.5 space-y-1.5 align-top">
                  {p.cons.map((con, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                      <X className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </div>
                  ))}
                </td>
              ))}
            </tr>

            {/* Bottom Final Action Row */}
            <tr className="bg-slate-50/80 dark:bg-slate-950/60 divide-x divide-slate-100 dark:divide-slate-800">
              <td className="p-4 font-bold text-slate-400 uppercase text-[11px]">
                Full Review & Store
              </td>
              {activeProducts.map((p) => (
                <td key={p.id} className="p-4 space-y-2">
                  <button
                    onClick={() => onNavigate(p.slug)}
                    className="w-full flex items-center justify-center gap-1 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 py-2 font-bold text-xs text-slate-900 dark:text-white transition-colors"
                  >
                    <span>Read In-Depth Lab Review</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={p.affiliateUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 font-extrabold text-xs text-white transition-colors shadow-xs"
                  >
                    <span>Visit {p.merchant} ({p.price})</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal: Add Contender to Comparison */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Add Contender to Head-to-Head Comparison
                </h3>
                <span className="text-xs text-slate-400">
                  Select any tested hardware to compare specs, ratings, and real-time prices side-by-side.
                </span>
              </div>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {UNIFIED_CATALOG.filter((p) => !activeProducts.some((ap) => ap.id === p.id)).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-12 w-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{p.name}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{p.price}</span>
                        <span>· Score: ★ {p.rating}</span>
                        <span>· {p.brand}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddContender(p)}
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
