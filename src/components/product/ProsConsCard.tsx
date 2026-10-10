import React from 'react';
import { Check, X, ThumbsUp, ThumbsDown, ShieldCheck } from 'lucide-react';

interface ProsConsCardProps {
  pros: string[];
  cons: string[];
  productName: string;
}

export const ProsConsCard: React.FC<ProsConsCardProps> = ({
  pros,
  cons,
  productName,
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5" aria-label="Pros and Cons Analysis">
      {/* Pros Column (Green) */}
      <div className="rounded-3xl border-2 border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-6 space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-900/50">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Check className="h-4 w-4 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
                Reasons to Buy
              </h3>
              <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400">
                Verified lab performance advantages
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 font-mono">
            +{pros.length}
          </span>
        </div>

        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
          {pros.map((pro, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold mt-0.5">
                ✓
              </span>
              <span className="leading-snug">{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons Column (Red) */}
      <div className="rounded-3xl border-2 border-rose-500/30 dark:border-rose-500/20 bg-rose-50/40 dark:bg-rose-950/20 p-6 space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-2 border-b border-rose-200/60 dark:border-rose-900/50">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white shadow-xs">
              <X className="h-4 w-4 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-rose-900 dark:text-rose-300 uppercase tracking-wider">
                Reasons to Reconsider
              </h3>
              <span className="text-[10px] text-rose-700/80 dark:text-rose-400">
                Trade-offs and potential dealbreakers
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-700 dark:text-rose-400 font-mono">
            -{cons.length}
          </span>
        </div>

        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
          {cons.map((con, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white text-[10px] font-bold mt-0.5">
                ✗
              </span>
              <span className="leading-snug">{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
