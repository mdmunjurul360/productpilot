import React from 'react';
import { Star, Scale, ArrowRight, ShieldCheck } from 'lucide-react';

export interface RelatedProductItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: string;
  score: number;
  shortDescription: string;
  badge?: string;
}

interface RelatedProductsSectionProps {
  products: RelatedProductItem[];
  currentProductName: string;
  onNavigate: (path: string) => void;
}

export const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({
  products,
  currentProductName,
  onNavigate,
}) => {
  return (
    <section className="space-y-5" aria-label="Related Audio Equipment & Alternatives">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white font-sans">
            Top Alternatives & Direct Competitors
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Hand-tested in our acoustic lab against {currentProductName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {products.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
          >
            <div>
              {/* Product Image with Rating Tag */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 mb-3.5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 shadow-xs">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-black text-slate-900 dark:text-white">
                    {item.score.toFixed(1)}
                  </span>
                </div>

                {item.badge && (
                  <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Title & Price */}
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <h4
                  onClick={() => onNavigate(item.slug)}
                  className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {item.name}
                </h4>
              </div>

              <span className="text-base font-black text-emerald-600 dark:text-emerald-400 block mb-2">
                {item.price}
              </span>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {item.shortDescription}
              </p>
            </div>

            {/* Action Buttons: Read Review & Compare */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigate(item.slug)}
                className="flex items-center justify-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs py-2 transition-colors"
              >
                <span>Read Review</span>
                <ArrowRight className="h-3 w-3" />
              </button>

              <button
                onClick={() => onNavigate('/compare')}
                className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-slate-700 dark:text-slate-300 font-bold text-xs py-2 transition-colors"
                title="Add to Head-to-Head Comparison"
              >
                <Scale className="h-3 w-3 text-blue-500" />
                <span>Compare</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
