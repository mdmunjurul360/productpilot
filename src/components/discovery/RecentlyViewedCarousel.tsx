import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Star, ExternalLink, Bookmark, Scale, Trash2 } from 'lucide-react';
import { useDiscovery } from '../../context/DiscoveryContext';

interface RecentlyViewedCarouselProps {
  onNavigate: (path: string) => void;
  className?: string;
}

export const RecentlyViewedCarousel: React.FC<RecentlyViewedCarouselProps> = ({
  onNavigate,
  className = '',
}) => {
  const {
    recentlyViewed,
    clearRecentlyViewed,
    toggleFavorite,
    isFavorite,
    addToCompare,
  } = useDiscovery();

  const scrollRef = useRef<HTMLDivElement>(null);

  if (recentlyViewed.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className={`rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recently Viewed Hardware ({recentlyViewed.length})
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline">
            · Stored privately in your browser session
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearRecentlyViewed}
            className="text-xs text-slate-400 hover:text-rose-500 font-semibold flex items-center gap-1 transition-colors mr-2"
          >
            <Trash2 className="h-3 w-3" />
            <span>Clear History</span>
          </button>

          <button
            onClick={() => scroll('left')}
            className="rounded-full border border-slate-200 dark:border-slate-700 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Scroll carousel left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="rounded-full border border-slate-200 dark:border-slate-700 p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Scroll carousel right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      <div
        ref={scrollRef}
        className="flex items-center gap-4 overflow-x-auto py-4 scroll-smooth scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {recentlyViewed.map((product) => (
          <div
            key={product.id}
            className="min-w-[240px] max-w-[240px] shrink-0 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/60 p-3 space-y-2.5 hover:border-blue-400 dark:hover:border-blue-500 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <button
                  onClick={() => toggleFavorite(product)}
                  className={`absolute top-2 right-2 p-1 rounded-lg backdrop-blur-xs transition-colors ${
                    isFavorite(product.id)
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-900/60 text-white hover:bg-slate-900'
                  }`}
                  title="Save bookmark"
                >
                  <Bookmark className={`h-3 w-3 ${isFavorite(product.id) ? 'fill-white' : ''}`} />
                </button>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">{product.brand}</span>
                <h4
                  onClick={() => onNavigate(product.slug)}
                  className="font-bold text-xs text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-1 transition-colors"
                >
                  {product.name}
                </h4>
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {product.price}
                </span>
                <div className="flex items-center gap-1 font-bold text-amber-500 text-[11px]">
                  <Star className="h-3 w-3 fill-amber-500" />
                  <span>{product.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
              <button
                onClick={() => onNavigate(product.slug)}
                className="flex-1 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-[11px] transition-colors text-center"
              >
                Review
              </button>
              <button
                onClick={() => addToCompare(product)}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                title="Add to compare"
              >
                <Scale className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
