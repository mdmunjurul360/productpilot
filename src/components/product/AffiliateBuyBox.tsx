import React from 'react';
import { ShoppingBag, ExternalLink, ShieldCheck, Tag, Zap, Clock, CheckCircle } from 'lucide-react';
import { analytics } from '../../utils/analytics';

export interface BuyBoxOffer {
  store: 'Amazon' | 'eBay' | 'AliExpress' | 'Daraz' | 'Custom' | string;
  price: string;
  originalPrice?: string;
  discount?: string;
  availability: 'In Stock' | 'Limited Stock' | 'Pre-order' | string;
  shipping?: string;
  badge?: string;
  affiliateUrl: string;
  buttonText?: string;
}

interface AffiliateBuyBoxProps {
  productName: string;
  offers: BuyBoxOffer[];
  lastCheckedDate?: string;
}

// Custom store vector marks for crisp fidelity without copyright issues
const StoreIcon: React.FC<{ store: string }> = ({ store }) => {
  switch (store.toLowerCase()) {
    case 'amazon':
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FF9900] text-slate-950 font-black text-xs">
          a
        </span>
      );
    case 'ebay':
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0064D2] text-white font-black text-[11px]">
          eb
        </span>
      );
    case 'aliexpress':
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#FF4747] text-white font-black text-[10px]">
          AE
        </span>
      );
    case 'daraz':
      return (
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#F85606] text-white font-black text-[10px]">
          Dz
        </span>
      );
    default:
      return <ShoppingBag className="h-4 w-4 text-blue-500" />;
  }
};

const getStoreActionColor = (store: string) => {
  switch (store.toLowerCase()) {
    case 'amazon':
      return 'bg-[#FF9900] hover:bg-[#F08804] text-slate-950';
    case 'ebay':
      return 'bg-[#0064D2] hover:bg-[#0053AF] text-white';
    case 'aliexpress':
      return 'bg-[#FF4747] hover:bg-[#E03434] text-white';
    case 'daraz':
      return 'bg-[#F85606] hover:bg-[#DF4C04] text-white';
    default:
      return 'bg-blue-600 hover:bg-blue-500 text-white';
  }
};

export const AffiliateBuyBox: React.FC<AffiliateBuyBoxProps> = ({
  productName,
  offers,
  lastCheckedDate = 'Verified Today',
}) => {
  return (
    <div
      id="affiliate-buy-box"
      className="rounded-3xl border-2 border-emerald-500/50 dark:border-emerald-500/40 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-xl space-y-4 transition-colors"
      aria-label="Multi-Marketplace Price Comparison Buy Box"
    >
      {/* Box Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Live Marketplace Pricing
            </h3>
            <span className="text-[10px] text-slate-400">Tracked across trusted retailers</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <CheckCircle className="h-3 w-3" />
          <span>{lastCheckedDate}</span>
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-3">
        {offers.map((offer, idx) => {
          const buttonColor = getStoreActionColor(offer.store);
          const isTopOffer = idx === 0;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all p-3.5 ${
                isTopOffer
                  ? 'border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20 ring-1 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Store Row & Badges */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <StoreIcon store={offer.store} />
                  <div>
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {offer.store}
                    </span>
                    {offer.shipping && (
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                        {offer.shipping}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {offer.badge && (
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold border border-emerald-300/40">
                      {offer.badge}
                    </span>
                  )}
                  {offer.discount && (
                    <span className="rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 py-0.5 text-[10px] font-black">
                      {offer.discount}
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Stock */}
              <div className="mt-2.5 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    {offer.price}
                  </span>
                  {offer.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">
                      {offer.originalPrice}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[11px] font-bold ${
                    offer.availability.toLowerCase().includes('stock')
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600'
                  }`}
                >
                  {offer.availability}
                </span>
              </div>

              {/* Store CTA Button */}
              <a
                href={offer.affiliateUrl}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => analytics.trackAffiliateClick(offer.store, productName, offer.affiliateUrl)}
                className={`mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl font-extrabold text-xs py-2.5 shadow-sm transition-all duration-150 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] ${buttonColor}`}
                aria-label={`Buy ${productName} on ${offer.store} for ${offer.price}`}
              >
                <span>{offer.buttonText || `View on ${offer.store}`}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Trust & Commission Notice */}
      <div className="pt-2 text-center space-y-1">
        <p className="text-[10px] text-slate-400 leading-relaxed">
          ProductPilot may earn a commission when you click our links. Prices and availability are subject to change by respective retailers.
        </p>
      </div>
    </div>
  );
};
