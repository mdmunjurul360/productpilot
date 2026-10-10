import React from 'react';

export interface ProductPilotLogoProps {
  variant?: 'full' | 'icon' | 'monochrome' | 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showTagline?: boolean;
}

/**
 * ProductPilot Brand Identity
 * Concept: Precision aerodynamic navigation compass needle combined with
 * an elevated discovery trajectory chevron and dual cardinal orientation nodes.
 * Designed strictly as pure mathematical SVG vectors (no external or copyrighted assets).
 */
export const ProductPilotIcon: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  monochrome?: boolean;
  className?: string;
}> = ({ size = 'md', monochrome = false, className = '' }) => {
  const dimensionMap = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11',
    xl: 'h-14 w-14',
  };

  const dim = dimensionMap[size] || dimensionMap.md;

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${dim} ${className}`}
      aria-label="ProductPilot Brand Mark"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id="ppGradientPrimary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" /> {/* Blue 600 */}
            <stop offset="0.5" stopColor="#1D4ED8" /> {/* Blue 700 */}
            <stop offset="1" stopColor="#0F172A" /> {/* Slate 900 */}
          </linearGradient>
          <linearGradient id="ppNeedleFaceted" x1="16" y1="12" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA" /> {/* Blue 400 highlight */}
            <stop offset="0.6" stopColor="#3B82F6" /> {/* Blue 500 */}
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="ppNeedleShadow" x1="18" y1="20" x2="30" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E40AF" /> {/* Blue 800 */}
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Shield / Compass Housing */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="12"
          fill={monochrome ? 'currentColor' : 'url(#ppGradientPrimary)'}
          className="transition-transform group-hover:scale-[1.03]"
        />

        {/* Precision Compass Reticle Ring */}
        <circle
          cx="24"
          cy="24"
          r="15.5"
          stroke="white"
          strokeOpacity={monochrome ? '0.35' : '0.22'}
          strokeWidth="1.25"
          strokeDasharray="2 2"
        />

        {/* Cardinal Direction Ticks (North, East, South, West) */}
        <line x1="24" y1="8" x2="24" y2="10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
        <line x1="39.5" y1="24" x2="37" y2="24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
        <line x1="24" y1="40" x2="24" y2="37.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />
        <line x1="8.5" y1="24" x2="11" y2="24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.8" />

        {/* Faceted Pilot Arrow / Discovery Needle (Pointing North-East towards smarter choices) */}
        {/* Top-Right Facet (Light side) */}
        <polygon
          points="24,11 37,24 25.5,23.5 24,24"
          fill={monochrome ? 'white' : 'url(#ppNeedleFaceted)'}
        />
        {/* Bottom-Right Facet (Deep side) */}
        <polygon
          points="37,24 24,37 24.5,25 24,24"
          fill={monochrome ? 'white' : 'url(#ppNeedleShadow)'}
          fillOpacity={monochrome ? '0.7' : '1'}
        />
        {/* Tail West Pivot (Aerodynamic Wing) */}
        <polygon
          points="24,11 25.5,23.5 13,24"
          fill={monochrome ? 'white' : '#93C5FD'}
          fillOpacity={monochrome ? '0.5' : '0.95'}
        />
        <polygon
          points="13,24 24.5,25 24,37"
          fill={monochrome ? 'white' : '#3B82F6'}
          fillOpacity={monochrome ? '0.4' : '0.8'}
        />

        {/* Center Pivot Point (Precision Core) */}
        <circle cx="24" cy="24" r="3.2" fill="white" />
        <circle cx="24" cy="24" r="1.5" fill="#1D4ED8" />

        {/* Apex Discovery Sparkle Dot (Smart Purchase Indicator) */}
        <circle cx="37" cy="11" r="2" fill="#FBBF24" />
      </svg>
    </div>
  );
};

export const ProductPilotLogo: React.FC<ProductPilotLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showTagline = true,
}) => {
  if (variant === 'icon') {
    return <ProductPilotIcon size={size} className={className} />;
  }

  const textSizeMap = {
    sm: { title: 'text-base', tag: 'text-[9px]', sub: 'text-[10px]' },
    md: { title: 'text-lg sm:text-xl', tag: 'text-[10px]', sub: 'text-[11px]' },
    lg: { title: 'text-2xl', tag: 'text-[11px]', sub: 'text-xs' },
    xl: { title: 'text-3xl', tag: 'text-xs', sub: 'text-sm' },
  };

  const textSizes = textSizeMap[size] || textSizeMap.md;
  const isLight = variant === 'light';
  const isMonochrome = variant === 'monochrome';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none group ${className}`}>
      <ProductPilotIcon size={size} monochrome={isMonochrome} />

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight font-sans ${textSizes.title} ${
              isLight
                ? 'text-white'
                : 'text-slate-900 dark:text-white'
            }`}
          >
            Product<span className={isLight ? 'text-blue-400' : 'text-blue-600 dark:text-blue-400'}>Pilot</span>
          </span>
          <span
            className={`rounded px-1.5 py-0.5 font-bold uppercase tracking-wider ${textSizes.tag} ${
              isLight
                ? 'bg-white/10 text-blue-300 border border-white/15'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700'
            }`}
          >
            Editorial
          </span>
        </div>

        {showTagline && (
          <span
            className={`hidden sm:block font-medium mt-1 leading-tight ${textSizes.sub} ${
              isLight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Discover Better Products. Buy Smarter.
          </span>
        )}
      </div>
    </div>
  );
};
