import React from 'react';
import { ExternalLink } from 'lucide-react';
import { analytics } from '../../utils/analytics';

export type AdSlotType =
  | 'leaderboard'
  | 'sidebar'
  | 'in_content'
  | 'after_content'
  | 'between_sections'
  | 'footer_banner'
  | 'mobile_sticky'
  | 'half_page'
  | 'medium_rectangle';

export type AdFormatSize = '728x90' | '320x50' | '300x250' | '300x600';

interface AdContainerProps {
  slot: AdSlotType;
  format?: AdFormatSize;
  className?: string;
  adTitle?: string;
  sponsorName?: string;
  linkUrl?: string;
  bannerImage?: string;
}

/**
 * High-performance, zero-CLS Advertisement placeholder.
 * Strict standard IAB dimensions (728x90, 320x50, 300x250, 300x600).
 * Placeholders only (no active tracking scripts), safe for display ad network injection.
 */
export const AdContainer: React.FC<AdContainerProps> = ({
  slot,
  format,
  className = '',
  adTitle = 'Partner Showcase',
  sponsorName = 'Google AdSense Partner',
  linkUrl = 'https://amazon.com',
  bannerImage,
}) => {
  // Determine standard dimension class & label
  const getSlotDetails = () => {
    if (format === '728x90' || slot === 'leaderboard') {
      return {
        dims: 'min-h-[90px] w-full max-w-[728px] mx-auto',
        label: '728 × 90 Desktop Leaderboard',
      };
    }
    if (format === '320x50' || slot === 'mobile_sticky') {
      return {
        dims: 'min-h-[50px] w-full max-w-[320px] mx-auto',
        label: '320 × 50 Mobile Banner',
      };
    }
    if (format === '300x600' || slot === 'half_page') {
      return {
        dims: 'min-h-[600px] w-full max-w-[300px] mx-auto',
        label: '300 × 600 Half Page Skyscraper',
      };
    }
    // format === '300x250' or sidebar or in_content
    return {
      dims: 'min-h-[250px] w-full max-w-[300px] sm:max-w-none mx-auto',
      label: '300 × 250 Medium Rectangle',
    };
  };

  const { dims, label } = getSlotDetails();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-3 text-center transition-all ${dims} ${className}`}
      style={{ contain: 'layout style paint' }}
      aria-label={`Advertisement Slot - ${label}`}
    >
      {/* Micro FTC Notice */}
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-slate-600" />
          Sponsored Advertisement
        </span>
        <span className="font-mono text-[9px] text-slate-400">{label}</span>
      </div>

      {bannerImage ? (
        <a
          href={linkUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          onClick={() => analytics.trackAdClick(slot, sponsorName)}
          className="group block relative w-full h-full overflow-hidden rounded-xl"
        >
          <img
            src={bannerImage}
            alt={adTitle}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            loading="lazy"
            decoding="async"
          />
        </a>
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 h-full rounded-xl bg-white dark:bg-slate-800/60 p-4 border border-slate-200/80 dark:border-slate-700/60 text-center">
          <span className="rounded bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
            {sponsorName}
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
            Top-Rated Audio & Workstation Upgrades
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
            Verified discount codes & prime shipping on Amazon, eBay & AliExpress.
          </p>
          <a
            href={linkUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            onClick={() => analytics.trackAdClick(slot, sponsorName)}
            className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 dark:hover:bg-blue-500 transition-colors shadow-xs"
          >
            <span>Explore Deals</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
    </div>
  );
};
