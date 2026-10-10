import React from 'react';
import { Star, ExternalLink, ArrowRight, ShieldCheck, Flame, Check } from 'lucide-react';
import { TRENDING_PRODUCTS } from '../../data/homepageData';

interface TrendingProductsProps {
  onNavigate: (path: string) => void;
}

export const TrendingProducts: React.FC<TrendingProductsProps> = ({ onNavigate }) => {
  return (
    <section className="py-12 sm:py-16 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 mb-2 border border-blue-200/80 dark:border-blue-800">
              <Flame className="h-3.5 w-3.5 text-amber-500" />
              <span>Tested & Recommended</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Trending Product Discoveries
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Laboratory-tested hardware with confirmed performance metrics. Real-time marketplace pricing across Amazon, eBay, and AliExpress.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/reviews')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            <span>View All 2,400+ Products</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 3-Column Responsive Product Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {TRENDING_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              <div>
                {/* Product Card Image & Badges */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Rating Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-slate-900/90 dark:bg-black/90 backdrop-blur-md px-2.5 py-1 text-xs font-extrabold text-white shadow-sm">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>

                  {product.badge && (
                    <span className="absolute top-3 right-3 rounded-full bg-blue-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  <div className="absolute bottom-2.5 left-3 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {product.category}
                  </div>
                </div>

                {/* Title & Short Description */}
                <h3
                  onClick={() => onNavigate(product.slug)}
                  className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition-colors line-clamp-1"
                >
                  {product.name}
                </h3>

                <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {product.shortDescription}
                </p>

                {/* Tested Pros Chips */}
                <div className="mt-3 space-y-1">
                  {product.pros.slice(0, 2).map((pro, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate">{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Price Range & Affiliate Outbound Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {/* Price Range Banner */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Market Price Range:</span>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {product.priceRange}
                  </span>
                </div>

                {/* 3 Dedicated Marketplace Affiliate Buttons */}
                <div className="grid grid-cols-3 gap-1.5">
                  {/* Amazon Button */}
                  <a
                    href={product.affiliateLinks.amazonUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="flex flex-col items-center justify-center rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 p-2 text-center transition-colors shadow-xs"
                    title={`Buy on Amazon for ${product.affiliateLinks.amazonPrice}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tight">Amazon</span>
                    <span className="text-[11px] font-bold">{product.affiliateLinks.amazonPrice}</span>
                  </a>

                  {/* eBay Button */}
                  <a
                    href={product.affiliateLinks.ebayUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="flex flex-col items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white p-2 text-center transition-colors shadow-xs"
                    title={`Buy on eBay for ${product.affiliateLinks.ebayPrice}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tight">eBay</span>
                    <span className="text-[11px] font-bold">{product.affiliateLinks.ebayPrice}</span>
                  </a>

                  {/* AliExpress Button */}
                  <a
                    href={product.affiliateLinks.aliExpressUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="flex flex-col items-center justify-center rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white p-2 text-center transition-colors shadow-xs"
                    title={`Buy on AliExpress for ${product.affiliateLinks.aliExpressPrice}`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-tight">AliExpress</span>
                    <span className="text-[11px] font-bold">{product.affiliateLinks.aliExpressPrice}</span>
                  </a>
                </div>

                {/* Read In-Depth Review Button */}
                <button
                  onClick={() => onNavigate(product.slug)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span>Read Full In-Depth Review</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
