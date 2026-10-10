import React from 'react';
import { Star, Clock, ArrowRight, Calendar, User } from 'lucide-react';
import { LATEST_REVIEWS } from '../../data/homepageData';

interface LatestReviewsGridProps {
  onNavigate: (path: string) => void;
}

export const LatestReviewsGrid: React.FC<LatestReviewsGridProps> = ({ onNavigate }) => {
  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Fresh Off the Test Bench
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Latest Comprehensive Product Reviews
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Unfiltered, data-driven assessments of newly launched tech, appliances, and accessories.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/reviews')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            <span>All Reviews Archive</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 4-Column Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LATEST_REVIEWS.map((review) => (
            <article
              key={review.id}
              onClick={() => onNavigate(review.slug)}
              className="group flex flex-col justify-between cursor-pointer rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 mb-3.5">
                  <img
                    src={review.thumbnail}
                    alt={review.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Category Chip */}
                  <span className="absolute top-2.5 left-2.5 rounded-md bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">
                    {review.category}
                  </span>

                  {/* Rating Badge */}
                  <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-md bg-amber-500 text-slate-950 px-2 py-0.5 text-xs font-black shadow-sm">
                    <Star className="h-3 w-3 fill-slate-950" />
                    <span>{review.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Article Meta */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {review.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {review.readingTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {review.title}
                </h3>

                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {review.excerpt}
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={review.author.avatar}
                    alt={review.author.name}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="text-left">
                    <span className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {review.author.name}
                    </span>
                    <span className="block text-[10px] text-slate-400 leading-tight">
                      {review.author.role}
                    </span>
                  </div>
                </div>

                <div className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
