import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, X } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setIsDismissed(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setIsDismissed(false);
    };

    if (typeof window !== 'undefined') {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  if (!isOffline || isDismissed) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-amber-950/95 border border-amber-500/40 text-amber-200 rounded-2xl p-4 shadow-2xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <WifiOff className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white">You appear to be offline</h4>
            <p className="text-[11px] text-amber-300/80 leading-relaxed">
              Cached pages and comparison data remain accessible. Outbound retailer links will reconnect once you are back online.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-amber-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
          aria-label="Dismiss offline notice"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px]">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 font-bold text-amber-300 hover:text-white transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Check Connection</span>
        </button>
        <span className="text-amber-400/60 font-mono">Offline Cache Active</span>
      </div>
    </div>
  );
};
