import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  productName: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs, productName }) => {
  // First item open by default
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-5 transition-colors">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <HelpCircle className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <span className="text-xs text-slate-400">
            Answers verified by ProductPilot audio engineers for {productName}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndices.includes(idx);

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-blue-500/40 bg-blue-50/15 dark:bg-slate-800/60 ring-1 ring-blue-500/20'
                  : 'border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full flex items-center justify-between p-4 text-left gap-4"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {faq.question}
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-blue-600 text-white dark:bg-blue-600' : ''
                  }`}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100/80 dark:border-slate-800/80 animate-in fade-in slide-in-from-top-1 duration-150">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
