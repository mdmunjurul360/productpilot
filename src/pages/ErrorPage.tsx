import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { SeoHead } from '../components/seo/SeoHead';

interface ErrorPageProps {
  onRetry?: () => void;
  onNavigate: (path: string) => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ onRetry, onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <SeoHead
        title="500 — Application Diagnostics"
        description="Our laboratory diagnostic system encountered an unexpected state. ProductPilot engineers have been notified."
        canonicalPath="/500"
      />

      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shadow-xl shadow-rose-500/10">
          <AlertTriangle className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold tracking-wider text-rose-600 dark:text-rose-400 uppercase">
            Error 500 • Lab Diagnostic Notice
          </span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Unexpected Benchmark Interruption
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            A temporary system hiccup occurred while compiling hardware telemetry. Your saved comparison shortlist is preserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-blue-900/40 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Request</span>
            </button>
          )}
          <button
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
