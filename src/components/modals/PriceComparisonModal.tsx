import React from 'react';
import { X, ExternalLink, ShieldCheck, CheckCircle2, Tag, ShoppingBag } from 'lucide-react';
import { HERO_PRODUCT } from '../../data/homepageData';

interface PriceComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: typeof HERO_PRODUCT;
}

export const PriceComparisonModal: React.FC<PriceComparisonModalProps> = ({
  isOpen,
  onClose,
  product = HERO_PRODUCT,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-sm">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Live Price Watch & Merchant Comparison
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Verified across 4 global retail marketplaces
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Product Summary Header */}
        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800">
          <img
            src={product.image}
            alt={product.title}
            className="h-16 w-16 rounded-xl object-cover bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
          />
          <div className="min-w-0">
            <span className="rounded bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
              {product.award}
            </span>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1">
              {product.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>Best Current Price:</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                {product.lowestPrice}
              </strong>
            </div>
          </div>
        </div>

        {/* Store Comparison List */}
        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {[
            {
              store: 'Amazon',
              price: '$398.00',
              originalPrice: '$449.99',
              badge: 'Prime 1-Day Delivery',
              badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300',
              actionColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
              status: 'In Stock (Authorized Sony Dealer)',
              coupon: 'None needed',
              link: 'https://amazon.com',
            },
            {
              store: 'eBay',
              price: '$349.99',
              originalPrice: '$399.00',
              badge: 'Certified Refurbished / New',
              badgeColor: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300',
              actionColor: 'bg-blue-600 hover:bg-blue-500 text-white',
              status: '2-Year Allstate Warranty Included',
              coupon: 'SAVE15EBAY',
              link: 'https://ebay.com',
            },
            {
              store: 'AliExpress',
              price: '$329.00',
              originalPrice: '$389.00',
              badge: 'Global Warehouse',
              badgeColor: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300',
              actionColor: 'bg-rose-600 hover:bg-rose-500 text-white',
              status: 'Free 7-Day Express Shipping',
              coupon: 'ALIEXPRESS26',
              link: 'https://aliexpress.com',
            },
            {
              store: 'Daraz Marketplace',
              price: '$340.00',
              originalPrice: '$395.00',
              badge: 'Daraz Mall Verified',
              badgeColor: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300',
              actionColor: 'bg-orange-600 hover:bg-orange-500 text-white',
              status: '100% Authentic Guarantee',
              coupon: 'DARAZPILOT',
              link: 'https://daraz.com',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {item.store}
                  </span>
                  <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {item.price}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    {item.originalPrice}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {item.status}
                </p>
                {item.coupon !== 'None needed' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                    <Tag className="h-3 w-3" /> Coupon: {item.coupon}
                  </span>
                )}
              </div>

              <a
                href={item.link}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors shadow-xs shrink-0 ${item.actionColor}`}
              >
                <span>Check {item.store}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          ))}
        </div>

        {/* Modal Footer Note */}
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Prices and stock verified in real-time. Commissions do not affect prices.</span>
          </div>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 dark:text-slate-300 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
