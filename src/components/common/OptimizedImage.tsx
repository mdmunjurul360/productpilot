import React, { useState } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  aspectRatio?: string;
  className?: string;
  blurDataUrl?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  aspectRatio,
  className = '',
  blurDataUrl,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Modern format & responsive CDN helper for Unsplash URLs
  const getOptimizedSrc = (originalUrl: string, targetWidth?: number) => {
    if (!originalUrl.includes('images.unsplash.com')) return originalUrl;
    try {
      const url = new URL(originalUrl);
      url.searchParams.set('auto', 'format'); // delivers avif/webp based on Accept header
      url.searchParams.set('fit', 'crop');
      url.searchParams.set('q', '80');
      if (targetWidth) {
        url.searchParams.set('w', targetWidth.toString());
      }
      return url.toString();
    } catch {
      return originalUrl;
    }
  };

  const optimizedSrc = getOptimizedSrc(src);

  // Responsive srcSet generation
  const srcSet = src.includes('images.unsplash.com')
    ? `${getOptimizedSrc(src, 320)} 320w, ${getOptimizedSrc(src, 640)} 640w, ${getOptimizedSrc(src, 1024)} 1024w, ${getOptimizedSrc(src, 1600)} 1600w`
    : undefined;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        aspectRatio: aspectRatio,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      {/* Low-quality blur placeholder */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse"
          style={blurDataUrl ? { backgroundImage: `url(${blurDataUrl})`, backgroundSize: 'cover', filter: 'blur(20px)' } : undefined}
          aria-hidden="true"
        />
      )}

      <img
        src={hasError ? 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' : optimizedSrc}
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt || 'ProductPilot tested hardware review item'}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setHasError(true);
          setIsLoaded(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
