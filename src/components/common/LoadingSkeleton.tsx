import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 overflow-hidden shadow-xs animate-pulse"
        >
          <div className="aspect-square w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-shimmer" />
          <div className="space-y-2">
            <div className="h-3 w-1/4 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-4/5 rounded-full bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-3/5 rounded-full bg-slate-100 dark:bg-slate-800/60" />
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="h-6 w-20 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-24 rounded-xl bg-blue-100 dark:bg-blue-950/60" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ReviewPageSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-64 rounded-full bg-slate-200 dark:bg-slate-800" />

      {/* Hero Header Skeleton */}
      <div className="space-y-4 max-w-3xl">
        <div className="h-6 w-32 rounded-full bg-blue-100 dark:bg-blue-950" />
        <div className="h-10 w-full rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-3/4 rounded-full bg-slate-100 dark:bg-slate-800/80" />
      </div>

      {/* Image Gallery & Quick Spec Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 aspect-4/3 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-shimmer" />
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="h-6 w-40 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <div className="h-4 w-24 rounded bg-slate-100 dark:bg-slate-800" />
                <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
