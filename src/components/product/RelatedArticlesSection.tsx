import React from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, User } from 'lucide-react';

export interface RelatedArticleItem {
  id: string;
  title: string;
  slug: string;
  type: 'guide' | 'comparison' | 'editorial';
  image: string;
  readingTime: string;
  date: string;
  author: string;
  excerpt: string;
}

interface RelatedArticlesSectionProps {
  articles: RelatedArticleItem[];
  onNavigate: (path: string) => void;
}

export const RelatedArticlesSection: React.FC<RelatedArticlesSectionProps> = ({
  articles,
  onNavigate,
}) => {
  return (
    <section className="space-y-5" aria-label="Related Buying Guides and Editorial Analysis">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white font-sans">
            Related Buying Guides & Deep Dives
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Expert roundups and technical analysis from the ProductPilot staff
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {articles.map((art) => (
          <article
            key={art.id}
            onClick={() => onNavigate(art.slug)}
            className="group flex flex-col sm:flex-row gap-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <div className="relative aspect-[16/10] sm:aspect-square w-full sm:w-36 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 shrink-0">
              <img
                src={art.image}
                alt={art.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute top-2 left-2 rounded-md bg-slate-900/90 text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5">
                {art.type}
              </span>
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {art.readingTime}
                  </span>
                  <span>•</span>
                  <span>{art.date}</span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {art.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Read Full Guide</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
