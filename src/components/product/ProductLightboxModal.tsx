import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

export interface LightboxImage {
  url: string;
  alt: string;
  caption?: string;
}

interface ProductLightboxModalProps {
  isOpen: boolean;
  images: LightboxImage[];
  initialIndex?: number;
  onClose: () => void;
}

export const ProductLightboxModal: React.FC<ProductLightboxModalProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState<1 | 1.5 | 2>(1);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  // Keyboard navigation & Esc key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setZoomLevel(1);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setZoomLevel(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoomLevel(1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoomLevel(1);
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/95 backdrop-blur-md p-4 sm:p-6 text-white animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Product Image Lightbox"
    >
      {/* Top Action Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-white/10 text-slate-300">
            {currentIndex + 1} / {images.length}
          </span>
          <span className="text-xs text-slate-300 truncate max-w-[200px] sm:max-w-md hidden sm:inline">
            {currentImage.caption || currentImage.alt}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleZoom}
            className="flex items-center gap-1 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 p-2 sm:px-3 text-slate-200 transition-colors"
            title="Toggle zoom level"
            aria-label="Toggle zoom level"
          >
            {zoomLevel > 1 ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            <span className="hidden sm:inline">{zoomLevel}x Zoom</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 hover:bg-rose-600/80 p-2 text-slate-200 hover:text-white transition-colors"
            title="Close Lightbox (Esc)"
            aria-label="Close Lightbox"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Center Image Stage with Navigation Chevrons */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden my-3">
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md transition-all shadow-xl hover:scale-105"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        {/* Main Image Container */}
        <div className="relative max-h-full max-w-full flex items-center justify-center overflow-auto cursor-zoom-in">
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            onClick={toggleZoom}
            className={`max-h-[75vh] w-auto object-contain rounded-xl transition-transform duration-300 ease-out ${
              zoomLevel === 1.5
                ? 'scale-150 cursor-zoom-out'
                : zoomLevel === 2
                ? 'scale-200 cursor-zoom-out'
                : 'scale-100'
            }`}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-slate-900/80 hover:bg-blue-600 text-white backdrop-blur-md transition-all shadow-xl hover:scale-105"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip & Caption */}
      <div className="z-10 flex flex-col items-center gap-2">
        {currentImage.caption && (
          <p className="text-xs text-slate-400 text-center max-w-2xl px-4 sm:hidden">
            {currentImage.caption}
          </p>
        )}

        <div className="flex items-center gap-2 max-w-full overflow-x-auto p-1 scrollbar-none">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setZoomLevel(1);
              }}
              className={`relative h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                currentIndex === idx
                  ? 'border-blue-500 ring-2 ring-blue-500/40 opacity-100 scale-105'
                  : 'border-transparent opacity-50 hover:opacity-90'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
