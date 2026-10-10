import React from 'react';
import { ArrowRight, Star, ExternalLink, Flame, ShieldCheck } from 'lucide-react';
import { MegaCategory } from '../../types/navigation';

interface MegaMenuProps {
  category: MegaCategory;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  category,
  onClose,
  onNavigate,
}) => {
  const handleItemClick = (slug: string) => {
    onClose();
    if (onNavigate) {
      onNavigate(slug);
    }
  };

  return (
    <div
      onMouseLeave={onClose}
      className="absolute left-0 right-0 top-full z-40 border-b border-slate-200/80 bg-white/98 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Column 1: Subcategories List (5 columns) */}
          <div className="col-span-5 border-r border-slate-100 pr-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  {category.name} Verticals
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                  {category.description}
                </p>
              </div>
              <button
                onClick={() => handleItemClick(`/category/${category.slug}`)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Browse All <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {category.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleItemClick(sub.slug)}
                  className="group flex flex-col text-left rounded-lg p-2 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                      {sub.name}
                    </span>
                    {sub.badge && (
                      <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">
                        {sub.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {sub.productCount} products benchmarked
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Trending Buying Guides (3 columns) */}
          <div className="col-span-3 border-r border-slate-100 pr-6">
            <div className="flex items-center gap-1.5 pb-3 border-b border-slate-100 mb-4">
              <Flame className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Essential Buying Guides
              </h3>
            </div>

            <div className="space-y-3.5">
              {category.trendingGuides.map((guide, idx) => (
                <button
                  key={idx}
                  onClick={() => handleItemClick(guide.slug)}
                  className="group block text-left w-full rounded-lg p-2.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-2 transition-colors">
                    {guide.title}
                  </span>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{guide.readingTime}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">Independent Lab Tested</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>100% editorially independent. No manufacturer sponsorships.</span>
            </div>
          </div>

          {/* Column 3: Featured Editor Review Spotlight (4 columns) */}
          <div className="col-span-4 pl-2">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Lab Spotlight Review
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                Score: {category.featuredReview.score}/10
              </span>
            </div>

            <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 mb-3">
                <img
                  src={category.featuredReview.image}
                  alt={category.featuredReview.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
                  {category.featuredReview.award}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2 transition-colors">
                {category.featuredReview.title}
              </h4>

              <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 block">Lowest Verified Price</span>
                  <span className="text-base font-bold text-slate-900">
                    {category.featuredReview.price}
                  </span>
                  <span className="text-[11px] text-slate-500 ml-1">
                    on {category.featuredReview.merchant}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleItemClick(category.featuredReview.slug)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm transition-colors"
                  >
                    <span>Read Verdict</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
