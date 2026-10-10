import React from 'react';
import {
  Scale,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { AdContainer } from '../components/home/AdContainer';
import { JsonLdSchema, createBreadcrumbSchema } from '../components/seo/JsonLdSchema';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { MultiProductComparisonEngine } from '../components/discovery/MultiProductComparisonEngine';
import { RecentlyViewedCarousel } from '../components/discovery/RecentlyViewedCarousel';
import { SeoHead } from '../components/seo/SeoHead';

interface ComparePageProps {
  onNavigate: (path: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ onNavigate }) => {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Comparisons', url: '/compare' },
    { name: 'Multi-Product Head-to-Head Engine', url: '/compare' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <SeoHead
        title="Head-to-Head Hardware Comparison Engine"
        description="Compare 2, 3, or 4 products side-by-side. Technical specifications, lab ratings, acoustic isolation, battery longevity, and current multi-store pricing."
        canonicalPath="/compare"
        ogType="website"
      />
      <JsonLdSchema data={createBreadcrumbSchema(breadcrumbs)} />

      {/* Top Breadcrumbs */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.name}>
              {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600" />}
              <button
                onClick={() => onNavigate(crumb.url)}
                className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate ${
                  idx === breadcrumbs.length - 1 ? 'font-bold text-slate-900 dark:text-white' : ''
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Top Banner Ad (CLS Safe) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdContainer slot="leaderboard" sponsorName="Audio Tech Sponsors" />
      </div>

      {/* Main Multi-Product Comparison Engine */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <MultiProductComparisonEngine onNavigate={onNavigate} />

        {/* Recently Viewed Carousel */}
        <RecentlyViewedCarousel onNavigate={onNavigate} />
      </main>

      {/* Bottom Newsletter */}
      <NewsletterSection onNavigate={onNavigate} />
    </div>
  );
};
