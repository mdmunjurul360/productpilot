import React, { useState } from 'react';
import {
  Star,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { HERO_PRODUCT } from '../../data/homepageData';

interface HeroSectionProps {
  onNavigate: (path: string) => void;
  onOpenPriceModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onOpenPriceModal }) => {
  const [showPricePopover, setShowPricePopover] = useState(false);

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pb-16 lg:pb-20">
      {/* Subtle Luxury Ambient Background Gradient */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-full max-w-7xl -translate-x-1/2 rounded-full bg-gradient-to-tr from-blue-500/10 via-emerald-500/5 to-transparent blur-3xl dark:from-blue-600/15 dark:via-emerald-500/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Top Eyebrow */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
              The 2026 Flagship Showcase
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Lab Calibrated & Anechoic Tested
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% Unpaid Editorial Verdict
            </span>
            <span>•</span>
            <span>Tested over 140 continuous lab hours</span>
          </div>
        </div>

        {/* Main Editorial Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (7 Cols): Editorial Text, Verdict, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 dark:bg-amber-500/20 px-3.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/20">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <span>{HERO_PRODUCT.award}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] font-sans">
              {HERO_PRODUCT.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {HERO_PRODUCT.quickSummary}
            </p>

            {/* Benchmark Lab Metrics Badges */}
            <div className="grid grid-cols-3 gap-3 pt-1 pb-2">
              {HERO_PRODUCT.testedMetrics.map((metric, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-3 shadow-xs"
                >
                  <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {metric.value}
                  </span>
                  <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {metric.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {/* Read Full In-Depth Review Button */}
              <button
                onClick={() => onNavigate(HERO_PRODUCT.reviewSlug)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm px-6 py-3.5 shadow-md shadow-blue-500/20 transition-all hover:translate-y-[-1px]"
              >
                <span>Read Full 3,400-Word Lab Review</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Compare Prices Button */}
              <button
                onClick={() => {
                  if (onOpenPriceModal) {
                    onOpenPriceModal();
                  } else {
                    setShowPricePopover(!showPricePopover);
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm px-6 py-3.5 transition-colors shadow-xs"
              >
                <SlidersHorizontal className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Compare Prices Across 3 Stores</span>
                <span className="rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs px-2 py-0.5 font-extrabold ml-1">
                  From {HERO_PRODUCT.lowestPrice}
                </span>
              </button>
            </div>

            {/* Quick Price Drawer / Popover if toggled */}
            {showPricePopover && (
              <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Live Verified Pricing Across Partners
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Auto-Verified 18m ago
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {HERO_PRODUCT.merchants.map((merchant) => (
                    <a
                      key={merchant.name}
                      href="https://amazon.com"
                      target="_blank"
                      rel="sponsored nofollow noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-2.5 hover:border-emerald-500 transition-colors"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">
                          {merchant.name}
                        </span>
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          {merchant.price}
                        </span>
                      </div>
                      <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                        Buy
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (5 Cols): Large Editorial Product Visual with Lab Rating Overlay */}
          <div className="lg:col-span-5">
            <div className="relative group overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xl shadow-slate-200/60 dark:shadow-none">
              {/* Product Visual */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                <img
                  src={HERO_PRODUCT.image}
                  alt={HERO_PRODUCT.title}
                  className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                />

                {/* Score Pill Overlay */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 shadow-lg ring-1 ring-slate-900/10 dark:ring-white/10">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Overall Score
                    </span>
                    <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                      {HERO_PRODUCT.score} <span className="text-xs font-bold text-slate-400">/ 10</span>
                    </span>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white font-extrabold shadow-sm">
                    ★
                  </div>
                </div>

                {/* Bottom Photo Caption */}
                <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-slate-950/80 backdrop-blur-md p-3 text-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      Studio Unit Tested: Silver Platinum Finish
                    </span>
                    <span className="rounded bg-blue-500/30 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                      Tested in Munich Lab
                    </span>
                  </div>
                </div>
              </div>

              {/* Retail Availability Strip */}
              <div className="mt-3.5 flex items-center justify-between px-2 pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-slate-400">Retail Partners:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    Amazon · eBay · AliExpress · Daraz
                  </span>
                </div>
                <button
                  onClick={() => onNavigate(HERO_PRODUCT.compareSlug)}
                  className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  vs Bose QC Ultra →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
