import React from 'react';
import { Star, ShieldCheck, Check, X, ArrowRight, ExternalLink, Clock, Award } from 'lucide-react';
import { EDITORS_CHOICE_ARTICLE } from '../../data/homepageData';

interface EditorsChoiceSectionProps {
  onNavigate: (path: string) => void;
}

export const EditorsChoiceSection: React.FC<EditorsChoiceSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative Blur Circles */}
      <div className="pointer-events-none absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Magazine Eyebrow */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
          <div className="flex items-center gap-2">
            <span className="rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
              Magazine Editorial Showcase
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Month of October 2026</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Tested 140+ Lab Hours</span>
          </div>
        </div>

        {/* Magazine Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (6 Cols): Author, Headline, Story, Quote */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src={EDITORS_CHOICE_ARTICLE.author.avatar}
                alt={EDITORS_CHOICE_ARTICLE.author.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-500/40"
              />
              <div>
                <h4 className="text-sm font-bold text-white">
                  {EDITORS_CHOICE_ARTICLE.author.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{EDITORS_CHOICE_ARTICLE.author.role}</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">{EDITORS_CHOICE_ARTICLE.author.testedHours}</span>
                </div>
              </div>
            </div>

            <h2
              onClick={() => onNavigate(EDITORS_CHOICE_ARTICLE.slug)}
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-[1.2] cursor-pointer hover:text-blue-400 transition-colors"
            >
              {EDITORS_CHOICE_ARTICLE.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
              {EDITORS_CHOICE_ARTICLE.excerpt}
            </p>

            {/* Editorial Quote Box */}
            <div className="rounded-2xl border-l-4 border-amber-500 bg-slate-800/80 p-4 sm:p-5">
              <p className="text-sm sm:text-base italic text-slate-200">
                {EDITORS_CHOICE_ARTICLE.quote}
              </p>
              <span className="block mt-2 text-xs font-semibold text-amber-400">
                — {EDITORS_CHOICE_ARTICLE.author.name}, Lab Testing Director
              </span>
            </div>

            {/* Pros and Cons Split */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl bg-slate-800/60 p-4 border border-slate-700/60">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-2.5">
                  <Check className="h-4 w-4" /> Lab Strengths
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {EDITORS_CHOICE_ARTICLE.pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-slate-800/60 p-4 border border-slate-700/60">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2.5">
                  <X className="h-4 w-4" /> Trade-offs
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {EDITORS_CHOICE_ARTICLE.cons.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold mt-0.5">✗</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate(EDITORS_CHOICE_ARTICLE.slug)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm px-6 py-3.5 transition-colors shadow-lg shadow-emerald-900/40"
              >
                <span>Read Complete 3,200-Word Report</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-4 w-4" />
                <span>{EDITORS_CHOICE_ARTICLE.readingTime}</span>
                <span>•</span>
                <span>Includes frequency graph</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): High-Impact Magazine Card with Score Badge */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-slate-700 bg-slate-800 p-3 shadow-2xl">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src={EDITORS_CHOICE_ARTICLE.image}
                  alt={EDITORS_CHOICE_ARTICLE.title}
                  className="h-full w-full object-cover"
                />

                {/* Score Pill */}
                <div className="absolute top-4 left-4 rounded-xl bg-slate-950/85 backdrop-blur-md px-3.5 py-2 border border-slate-700">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    ProductPilot Score
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-xl font-black text-white">9.7</span>
                    <span className="text-xs text-slate-400">/ 10</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 rounded-full bg-emerald-500 text-slate-950 px-3 py-1 text-xs font-black uppercase tracking-wider shadow-md">
                  Editor&apos;s Choice
                </div>
              </div>

              {/* Retail Quick Pricing Bar */}
              <div className="mt-3 p-3 rounded-xl bg-slate-900 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Best Retail Price:</span>
                  <span className="text-base font-extrabold text-white">$398.00</span>
                  <span className="text-slate-400 ml-1">on Amazon</span>
                </div>
                <a
                  href="https://amazon.com"
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-2 font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Amazon Store</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
