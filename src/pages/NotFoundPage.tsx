import React from 'react';
import { Search, Compass, ArrowRight, Home, ShieldAlert } from 'lucide-react';
import { SeoHead } from '../components/seo/SeoHead';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <SeoHead
        title="404 — Page Not Found"
        description="The lab review, category, or buying guide you are looking for has been moved or retired. Browse our latest hardware tests on ProductPilot."
        canonicalPath="/404"
      />

      <div className="max-w-xl w-full text-center space-y-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shadow-xl shadow-blue-500/10">
          <Compass className="h-10 w-10 animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
            Error 404 • URL Not Found
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            We Couldn&apos;t Locate That Lab Benchmark
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            The gear review or buying comparison you requested may have been relocated or updated. Use our intelligent search or explore popular categories below.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-900/40 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={() => onNavigate('/categories')}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <span>Explore Categories</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Popular Redirect Suggestions */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400 block mb-3 font-semibold">Popular Lab Destinations:</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { label: 'Sony WH-1000XM5 Review', path: '/reviews/sony-wh-1000xm5' },
              { label: 'Best ANC Headphones Guide', path: '/buying-guides/best-anc-headphones-travel' },
              { label: 'Head-to-Head Compare', path: '/compare' },
              { label: 'Audio & Acoustics Hub', path: '/category/audio-visual' },
            ].map((link) => (
              <button
                key={link.label}
                onClick={() => onNavigate(link.path)}
                className="rounded-xl bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
