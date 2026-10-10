import React, { useState, useEffect } from 'react';
import { ExternalLink, Star, ShoppingBag, ArrowUp } from 'lucide-react';

interface StickyMobileBuyBarProps {
  productName: string;
  image: string;
  price: string;
  score: number;
  primaryAffiliateUrl: string;
  onScrollToBuyBox: () => void;
}

export const StickyMobileBuyBar: React.FC<StickyMobileBuyBarProps> = ({
  productName,
  image,
  price,
  score,
  primaryAffiliateUrl,
  onScrollToBuyBox,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 450px
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2.5 shadow-2xl animate-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Title/Price */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <img
            src={image}
            alt={productName}
            className="h-10 w-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {productName}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                {price}
              </span>
              <span className="flex items-center text-[10px] font-bold text-amber-500">
                ★ {score.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Buy Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onScrollToBuyBox}
            className="rounded-xl bg-slate-100 dark:bg-slate-800 p-2 text-slate-700 dark:text-slate-300 text-xs font-bold"
            title="Compare all retailers"
            aria-label="View all retailers"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>

          <a
            href={primaryAffiliateUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2 shadow-sm transition-transform active:scale-95"
          >
            <span>Buy Now</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
