import React from 'react';
import { BookOpen, ArrowRight, Award, CheckCircle2, User, Clock } from 'lucide-react';
import { BUYING_GUIDES } from '../../data/homepageData';

interface BuyingGuidesSectionProps {
  onNavigate: (path: string) => void;
}

export const BuyingGuidesSection: React.FC<BuyingGuidesSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-12 sm:py-16 bg-slate-50/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-2 border border-emerald-200/80 dark:border-emerald-800">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Curated Comparisons</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Definitive Buying Guides
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top-ranked roundups comparing 6 to 15 competing models side-by-side with clear award badges.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/buying-guides')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            <span>Browse All Buying Guides</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 2-Column Grid of Beautiful Horizontal Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {BUYING_GUIDES.map((guide) => (
            <div
              key={guide.id}
              onClick={() => onNavigate(guide.slug)}
              className="group cursor-pointer flex flex-col sm:flex-row overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
            >
              {/* Image Column */}
              <div className="relative sm:w-2/5 aspect-[16/10] sm:aspect-auto overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                <img
                  src={guide.thumbnail}
                  alt={guide.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white">
                  {guide.itemCount} Tested Models
                </span>
              </div>

              {/* Content Column */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {guide.category}
                    </span>
                    <span className="rounded bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {guide.award}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    {guide.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {guide.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    By <strong className="text-slate-700 dark:text-slate-300">{guide.author}</strong> · {guide.updatedDate}
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:underline inline-flex items-center gap-1">
                    <span>Read Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
