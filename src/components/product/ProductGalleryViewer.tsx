import React, { useState, useRef } from 'react';
import { Maximize2, Play, ChevronLeft, ChevronRight, Video, Image as ImageIcon, Sparkles } from 'lucide-react';
import { ProductLightboxModal, LightboxImage } from './ProductLightboxModal';

interface ProductGalleryViewerProps {
  images: LightboxImage[];
  score: number;
  youtubeVideoId?: string;
  youtubeTitle?: string;
  badge?: string;
}

export const ProductGalleryViewer: React.FC<ProductGalleryViewerProps> = ({
  images,
  score,
  youtubeVideoId,
  youtubeTitle = 'Video Review & Laboratory Walkthrough',
  badge = 'Editorial Choice',
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Mobile swipe touch handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next image
      if (isVideoActive) {
        setIsVideoActive(false);
        setActiveIdx(0);
      } else if (activeIdx < images.length - 1) {
        setActiveIdx((prev) => prev + 1);
      } else if (youtubeVideoId) {
        setIsVideoActive(true);
      }
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev image
      if (isVideoActive) {
        setIsVideoActive(false);
        setActiveIdx(images.length - 1);
      } else if (activeIdx > 0) {
        setActiveIdx((prev) => prev - 1);
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Magnifier mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomCoords({ x, y });
  };

  const currentImage = images[activeIdx] || images[0];

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs transition-colors">
      {/* Lightbox Modal */}
      <ProductLightboxModal
        isOpen={isLightboxOpen}
        images={images}
        initialIndex={activeIdx}
        onClose={() => setIsLightboxOpen(false)}
      />

      {/* Main Showcase Stage */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 select-none group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {/* Skeleton placeholder while image is loading */}
        {!imageLoaded && !isVideoActive && (
          <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
        )}

        {/* Video Mode */}
        {isVideoActive && youtubeVideoId ? (
          <div className="relative h-full w-full bg-slate-950 flex items-center justify-center">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1`}
              title={youtubeTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          /* Image Mode with Zoom */
          <div
            className="relative h-full w-full overflow-hidden cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              onLoad={() => setImageLoaded(true)}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                      transform: 'scale(2)',
                    }
                  : undefined
              }
              className={`h-full w-full object-cover transition-transform duration-200 ease-out ${
                isZoomed ? 'scale-200' : 'scale-100'
              }`}
              loading="eager"
              decoding="async"
            />
          </div>
        )}

        {/* Score Badge */}
        <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 shadow-md border border-slate-200/50 dark:border-slate-700/50">
          <span className="text-amber-500 font-bold text-sm">★</span>
          <span className="text-base font-black text-slate-900 dark:text-white">
            {score.toFixed(1)}
          </span>
          <span className="text-[10px] text-slate-400 font-bold">/ 10</span>
        </div>

        {/* Left Editorial Pill */}
        {badge && (
          <div className="absolute top-3.5 left-3.5 z-10 hidden sm:flex items-center gap-1 rounded-xl bg-blue-600/90 text-white backdrop-blur-md px-2.5 py-1 text-[11px] font-bold shadow-md">
            <Sparkles className="h-3 w-3" />
            <span>{badge}</span>
          </div>
        )}

        {/* Floating Utility Controls (Bottom) */}
        {!isVideoActive && (
          <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              className="hidden sm:flex items-center gap-1 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white px-2.5 py-1.5 text-xs font-semibold backdrop-blur-sm transition-all"
              title="Toggle Zoom"
              aria-label="Toggle Zoom"
            >
              <span>{isZoomed ? 'Reset' : 'Magnify'}</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              className="flex items-center gap-1 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white p-2 text-xs font-semibold backdrop-blur-sm transition-all shadow-md"
              title="Open Fullscreen Lightbox"
              aria-label="Open Fullscreen Lightbox"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Mobile Swipe Pagination Dots */}
        <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5 sm:hidden pointer-events-none">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                !isVideoActive && activeIdx === idx
                  ? 'w-5 bg-blue-500'
                  : 'w-1.5 bg-white/70'
              }`}
            />
          ))}
          {youtubeVideoId && (
            <span
              className={`h-1.5 rounded-full transition-all ${
                isVideoActive ? 'w-5 bg-rose-500' : 'w-1.5 bg-white/70'
              }`}
            />
          )}
        </div>
      </div>

      {/* Caption & Counter */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span className="italic truncate max-w-md">
          {isVideoActive ? youtubeTitle : currentImage.caption || currentImage.alt}
        </span>
        <span className="shrink-0 font-mono text-[11px]">
          {isVideoActive ? 'Video Lab Test' : `${activeIdx + 1} of ${images.length}`}
        </span>
      </div>

      {/* Thumbnail Strip (Images + Video Facade Trigger) */}
      <div className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2.5">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsVideoActive(false);
              setActiveIdx(idx);
              setIsZoomed(false);
            }}
            className={`relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition-all ${
              !isVideoActive && activeIdx === idx
                ? 'border-blue-600 ring-2 ring-blue-600/30 opacity-100 scale-[1.02]'
                : 'border-transparent opacity-65 hover:opacity-100'
            }`}
            aria-label={`Select product image ${idx + 1}`}
          >
            <img
              src={img.url}
              alt={img.alt}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}

        {/* Video Thumbnail Button */}
        {youtubeVideoId && (
          <button
            onClick={() => {
              setIsVideoActive(true);
              setIsZoomed(false);
            }}
            className={`relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition-all bg-slate-900 group ${
              isVideoActive
                ? 'border-rose-600 ring-2 ring-rose-600/30 opacity-100 scale-[1.02]'
                : 'border-transparent opacity-75 hover:opacity-100'
            }`}
            aria-label="Play Video Review"
          >
            <img
              src={images[0]?.url}
              alt="Video thumbnail"
              className="h-full w-full object-cover opacity-60"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white shadow-md group-hover:scale-110 transition-transform">
                <Play className="h-3.5 w-3.5 fill-white ml-0.5" />
              </div>
            </div>
            <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-[9px] font-bold text-white">
              Video
            </span>
          </button>
        )}
      </div>
    </section>
  );
};
