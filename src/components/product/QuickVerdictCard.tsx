import React from 'react';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface QuickVerdictCardProps {
  productName: string;
  score: number;
  shortSummary: string;
  bestFor: string;
  avoidIf: string;
  bottomLine: string;
  onScrollToBuyBox?: () => void;
}

export const QuickVerdictCard: React.FC<QuickVerdictCardProps> = ({
  productName,
  score,
  shortSummary,
  bestFor,
  avoidIf,
  bottomLine,
  onScrollToBuyBox,
}) => {
  return (
    <section className="rounded-3xl border-2 border-blue-600/20 dark:border-blue-500/30 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 p-6 sm:p-7 shadow-md space-y-5 transition-colors">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-blue-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
              Executive Evaluation
            </span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
              The Quick Verdict: {productName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
            ★ {score.toFixed(1)}
          </span>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold">/ 10</span>
        </div>
      </div>

      {/* Short Summary */}
      <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
        {shortSummary}
      </p>

      {/* Dual Highlights: Best For & Avoid If */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Best For */}
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Best For</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {bestFor}
          </p>
        </div>

        {/* Avoid If */}
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/60 dark:bg-rose-950/20 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
            <XCircle className="h-4 w-4 shrink-0" />
            <span>Avoid If</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {avoidIf}
          </p>
        </div>
      </div>

      {/* The Bottom Line */}
      <div className="rounded-2xl bg-slate-900 text-white dark:bg-slate-800 p-4 space-y-1 shadow-inner">
        <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
          The Bottom Line
        </span>
        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
          {bottomLine}
        </p>
      </div>

      {/* Direct CTA */}
      {onScrollToBuyBox && (
        <button
          onClick={onScrollToBuyBox}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 transition-colors shadow-sm"
        >
          <span>Compare All Marketplace Prices</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      )}
    </section>
  );
};
