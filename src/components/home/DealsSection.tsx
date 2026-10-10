import React from 'react';
import { Flame, Clock, Tag, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
import { VERIFIED_DEALS } from '../../data/homepageData';

interface DealsSectionProps {
  onNavigate: (path: string) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({ onNavigate }) => {
  const getMerchantBadge = (merchant: string) => {
    switch (merchant) {
      case 'Amazon':
        return 'bg-amber-500 text-slate-950';
      case 'eBay':
        return 'bg-blue-600 text-white';
      case 'AliExpress':
        return 'bg-rose-600 text-white';
      default:
        return 'bg-slate-800 text-white';
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950 px-3 py-1 text-xs font-bold text-rose-700 dark:text-rose-300 mb-2 border border-rose-200/80 dark:border-rose-800">
              <Flame className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
              <span>Real-Time Price Anomaly Tracker</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Verified Deals & Discount Alerts
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Automated price drops on lab-tested hardware. Checked against 90-day historic retail minimums.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/deals')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            <span>All 48 Verified Deals</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 4 Deals Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VERIFIED_DEALS.map((deal) => {
            const dollarSavings = (deal.originalPrice - deal.salePrice).toFixed(2);
            return (
              <div
                key={deal.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
              >
                <div>
                  {/* Thumbnail & Savings Badge */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 mb-3.5">
                    <img
                      src={deal.thumbnail}
                      alt={deal.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Percentage Discount Badge */}
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-black text-white shadow-md">
                      {deal.savingsPercent}% OFF
                    </span>

                    {/* Expiration Timer */}
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-md bg-slate-950/85 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-amber-300">
                      <Clock className="h-3 w-3" />
                      <span>Ends: {deal.endsIn}</span>
                    </div>
                  </div>

                  {/* Merchant Pill */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-tight ${getMerchantBadge(
                        deal.merchant
                      )}`}
                    >
                      {deal.merchant} Deal
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      {deal.verifiedTimestamp}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3
                    onClick={() => onNavigate(deal.slug)}
                    className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition-colors line-clamp-2 leading-snug"
                  >
                    {deal.title}
                  </h3>

                  {/* Coupon Code Callout if available */}
                  {deal.couponCode && (
                    <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                      <Tag className="h-3 w-3 shrink-0 text-amber-600" />
                      <span>Use Code:</span>
                      <strong className="font-mono bg-white dark:bg-slate-900 px-1 rounded">
                        {deal.couponCode}
                      </strong>
                    </div>
                  )}
                </div>

                {/* Price & Affiliate Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        ${deal.salePrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-2">
                        ${deal.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Save ${dollarSavings}
                    </span>
                  </div>

                  {/* Affiliate Action CTA */}
                  <a
                    href="https://amazon.com"
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 py-2.5 text-xs font-bold text-white transition-colors shadow-sm"
                  >
                    <span>Get Deal on {deal.merchant}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
