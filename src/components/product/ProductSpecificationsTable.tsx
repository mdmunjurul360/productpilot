import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp, Check, Cpu } from 'lucide-react';

export interface SpecItem {
  label: string;
  value: string;
}

export interface SpecGroup {
  group: string;
  items: SpecItem[];
}

interface ProductSpecificationsTableProps {
  specifications: SpecGroup[];
  productName: string;
  initialExpanded?: boolean;
}

export const ProductSpecificationsTable: React.FC<ProductSpecificationsTableProps> = ({
  specifications,
  productName,
  initialExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // Show only first 2 groups when collapsed, or all when expanded
  const visibleGroups = isExpanded ? specifications : specifications.slice(0, 2);

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-5 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Technical Specifications & Lab Benchmarks
            </h3>
            <span className="text-xs text-slate-400">Verified manufacturer and acoustic metrics</span>
          </div>
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          {specifications.reduce((acc, g) => acc + g.items.length, 0)} Specs Verified
        </span>
      </div>

      <div className="space-y-6">
        {visibleGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {group.group}
            </h4>
            <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
              {group.items.map((item, iIdx) => (
                <div
                  key={iIdx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span className="font-semibold text-slate-500 dark:text-slate-400">
                    {item.label}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white sm:text-right mt-0.5 sm:mt-0 font-mono sm:font-sans">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Expand/Collapse Button */}
      {specifications.length > 2 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 p-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? 'Collapse Full Specifications' : `Show All Detailed Specifications (${specifications.length} Groups)`}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      )}
    </section>
  );
};
