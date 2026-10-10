import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Compass } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // Log structured error to console (and telemetry endpoint if available)
    console.error('[ProductPilot ErrorBoundary caught error]:', error, errorInfo);

    try {
      if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'exception', {
          description: error.message,
          fatal: false,
        });
      }
    } catch {
      // safe fallback
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[500px] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30 shadow-inner">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Something went slightly off
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                An unexpected interface issue occurred. Our automated error shield caught the problem so your browsing session is protected.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/30 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Go to Home</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              <span>ProductPilot Shielded Session · Error ID: err-{Date.now().toString(36)}</span>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
