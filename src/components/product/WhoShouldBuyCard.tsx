import React from 'react';
import { UserCheck, UserX, Briefcase, GraduationCap, Plane, Home, ShieldAlert } from 'lucide-react';

interface WhoShouldBuyCardProps {
  whoShouldBuy: string[];
  whoShouldAvoid: string[];
}

export const WhoShouldBuyCard: React.FC<WhoShouldBuyCardProps> = ({
  whoShouldBuy,
  whoShouldAvoid,
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-5" aria-label="Buyer Persona Fit">
      {/* Perfect For */}
      <div className="rounded-3xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-blue-200/50 dark:border-blue-900/40">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
              Ideal Match: Perfect For
            </h3>
            <span className="text-[10px] text-blue-600 dark:text-blue-400">
              User scenarios where this hardware excels
            </span>
          </div>
        </div>

        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {whoShouldBuy.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold mt-0.5">
                •
              </span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Not Recommended For */}
      <div className="rounded-3xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 p-6 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-amber-200/50 dark:border-amber-900/40">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-600 text-white">
            <UserX className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              Consider Alternatives If
            </h3>
            <span className="text-[10px] text-amber-600 dark:text-amber-400">
              Use cases where other models offer better value
            </span>
          </div>
        </div>

        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {whoShouldAvoid.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white text-[10px] font-bold mt-0.5">
                •
              </span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
