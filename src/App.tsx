/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { DiscoveryProvider, useDiscovery } from './context/DiscoveryContext';
import { Header } from './components/navigation/Header';
import { Footer } from './components/navigation/Footer';
import { HeroSection } from './components/home/HeroSection';
import { TrendingProducts } from './components/home/TrendingProducts';
import { FeaturedCategories } from './components/home/FeaturedCategories';
import { EditorsChoiceSection } from './components/home/EditorsChoiceSection';
import { LatestReviewsGrid } from './components/home/LatestReviewsGrid';
import { BuyingGuidesSection } from './components/home/BuyingGuidesSection';
import { DealsSection } from './components/home/DealsSection';
import { TrustSection } from './components/home/TrustSection';
import { NewsletterSection } from './components/home/NewsletterSection';
import { AdContainer } from './components/home/AdContainer';
import { PriceComparisonModal } from './components/modals/PriceComparisonModal';

// Discovery & Comparison Modules
import { CompareDock } from './components/discovery/CompareDock';
import { RecommendationEngine } from './components/discovery/RecommendationEngine';
import { RecentlyViewedCarousel } from './components/discovery/RecentlyViewedCarousel';

import { SeoHead } from './components/seo/SeoHead';
import { createOrganizationSchema, createWebSiteSchema } from './components/seo/JsonLdSchema';
import { Bookmark, X, ArrowRight, ExternalLink, CheckCircle2, Sparkles } from 'lucide-react';

// Lazy Loaded Pages
const CategoryPage = lazy(() => import('./pages/CategoryPage').then(module => ({ default: module.CategoryPage })));
const ProductReviewPage = lazy(() => import('./pages/ProductReviewPage').then(module => ({ default: module.ProductReviewPage })));
const BuyingGuidePage = lazy(() => import('./pages/BuyingGuidePage').then(module => ({ default: module.BuyingGuidePage })));
const ComparePage = lazy(() => import('./pages/ComparePage').then(module => ({ default: module.ComparePage })));
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage').then(module => ({ default: module.SearchResultsPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));
const ErrorPage = lazy(() => import('./pages/ErrorPage').then(module => ({ default: module.ErrorPage })));
const AdminApp = lazy(() => import('./admin/AdminApp').then(module => ({ default: module.AdminApp })));
const AboutPage = lazy(() => import('./pages/TrustPages').then(module => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./pages/TrustPages').then(module => ({ default: module.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/TrustPages').then(module => ({ default: module.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./pages/TrustPages').then(module => ({ default: module.TermsPage })));
const CookiePolicyPage = lazy(() => import('./pages/TrustPages').then(module => ({ default: module.CookiePolicyPage })));
const AffiliateDisclosurePage = lazy(() => import('./pages/TrustPages').then(module => ({ default: module.AffiliateDisclosurePage })));
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OfflineBanner } from './components/common/OfflineBanner';

import { syncFrontendWithBackend } from './data/syncData';

export default function App() {
  return (
    <ThemeProvider>
      <DiscoveryProvider>
        <ErrorBoundary>
          <MainAppContent />
        </ErrorBoundary>
      </DiscoveryProvider>
    </ThemeProvider>
  );
}

function MainAppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname + window.location.search);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [showMobileStickyAd, setShowMobileStickyAd] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    syncFrontendWithBackend().finally(() => {
      setIsDataLoaded(true);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const {
    favorites,
    removeFavorite,
    isSavedDrawerOpen,
    setIsSavedDrawerOpen,
    toasts,
    dismissToast,
  } = useDiscovery();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Dedicated Enterprise Admin CMS Portal
  if (currentPath.startsWith('/admin')) {
    return <AdminApp onNavigate={handleNavigate} />;
  }

  // Wait for dynamic data to load before rendering the public frontend
  if (!isDataLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold">Initializing Application...</div>;
  }

  // Dynamic Page Routing
  const renderCurrentView = () => {
    if (currentPath.startsWith('/category/') || currentPath === '/categories') {
      const slug = currentPath.replace('/category/', '').replace('/categories', 'audio-visual');
      return <CategoryPage categorySlug={slug || 'audio-visual'} onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/reviews/')) {
      return <ProductReviewPage slug={currentPath} onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/buying-guides')) {
      const slug = currentPath.replace('/buying-guides/', '');
      return <BuyingGuidePage guideSlug={slug || 'best-anc-headphones-travel'} onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/compare')) {
      return <ComparePage onNavigate={handleNavigate} />;
    }

    if (currentPath.startsWith('/search')) {
      const queryParam = currentPath.includes('?q=') ? decodeURIComponent(currentPath.split('?q=')[1]) : '';
      return <SearchResultsPage initialQuery={queryParam} onNavigate={handleNavigate} />;
    }

    if (currentPath === '/about') return <AboutPage onNavigate={handleNavigate} />;
    if (currentPath === '/contact') return <ContactPage onNavigate={handleNavigate} />;
    if (currentPath === '/privacy-policy') return <PrivacyPolicyPage onNavigate={handleNavigate} />;
    if (currentPath === '/terms-and-conditions') return <TermsPage onNavigate={handleNavigate} />;
    if (currentPath === '/cookie-policy') return <CookiePolicyPage onNavigate={handleNavigate} />;
    if (currentPath === '/affiliate-disclosure') return <AffiliateDisclosurePage onNavigate={handleNavigate} />;

    if (currentPath === '/404' || currentPath.startsWith('/error/404')) {
      return <NotFoundPage onNavigate={handleNavigate} />;
    }

    if (currentPath === '/500' || currentPath.startsWith('/error/500')) {
      return <ErrorPage onNavigate={handleNavigate} />;
    }

    // Default: Entire Completed Homepage (Exact Preserved Layout & 11 Sections + Smart Discovery)
    return (
      <>
        {/* Dynamic Homepage SEO, Discover Optimization & Schemas */}
        <SeoHead
          title="ProductPilot — Discover Better Products. Buy Smarter."
          description="ProductPilot is a premier product discovery, in-depth editorial reviews, buying guides, and smart comparison platform connecting shoppers with top-tier gear across Amazon, eBay, AliExpress, and Daraz."
          canonicalPath="/"
          ogType="website"
          schemas={[createOrganizationSchema(), createWebSiteSchema()]}
        />
        {/* Navigation Location Indicator (Contextual Feedback) */}
        {currentPath !== '/' && (
          <div className="bg-slate-900 text-white py-2 px-4 text-xs font-mono">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-slate-400">Viewing Preview:</span>
                <span className="font-bold text-blue-400">{currentPath}</span>
              </div>
              <button
                onClick={() => handleNavigate('/')}
                className="text-xs text-blue-300 hover:text-white underline font-sans"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Section 10: Top Leaderboard Advertisement (Pre-reserved for 0 CLS) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <AdContainer
            slot="leaderboard"
            sponsorName="Google AdSense Partner Network"
            adTitle="High-Resolution Audio Equipment"
          />
        </div>

        {/* Section 1: Hero Section */}
        <HeroSection
          onNavigate={handleNavigate}
          onOpenPriceModal={() => setIsPriceModalOpen(true)}
        />

        {/* Section 2: Trending Products (With Amazon, eBay, AliExpress, Read Review Buttons) */}
        <TrendingProducts onNavigate={handleNavigate} />

        {/* Section 3: Featured Categories (12 Icon Cards) */}
        <FeaturedCategories onNavigate={handleNavigate} />

        {/* Section 10: In-Content Advertisement Placement */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AdContainer
            slot="in_content"
            sponsorName="Direct Media Partner"
            adTitle="Ergonomic Workstation Equipment"
          />
        </div>

        {/* Section 4: Editor's Choice (Magazine Style) */}
        <EditorsChoiceSection onNavigate={handleNavigate} />

        {/* Section 5: Latest Reviews Grid */}
        <LatestReviewsGrid onNavigate={handleNavigate} />

        {/* Section 5b: Smart Recommendation Engine (Intelligent Discovery) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <RecommendationEngine onNavigate={handleNavigate} />
        </div>

        {/* Section 6: Buying Guides (Horizontal Cards) */}
        <BuyingGuidesSection onNavigate={handleNavigate} />

        {/* Section 7: Deals Section (Verified Real-Time Price Drops) */}
        <DealsSection onNavigate={handleNavigate} />

        {/* Section 7b: Recently Viewed Products (Local Session Carousel) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <RecentlyViewedCarousel onNavigate={handleNavigate} />
        </div>

        {/* Section 9: Trust Section (Editorial Independence & Lab Standards) */}
        <TrustSection onNavigate={handleNavigate} />

        {/* Section 8: Newsletter Section */}
        <NewsletterSection onNavigate={handleNavigate} />
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Header with MegaMenu, SearchModal, ThemeToggle, MobileDrawer */}
      <Header
        onNavigate={handleNavigate}
        savedItemsCount={favorites.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        <Suspense fallback={<div className="flex h-[50vh] items-center justify-center text-slate-500">Loading component...</div>}>
          {renderCurrentView()}
        </Suspense>
      </main>

      {/* Persistent Compare Floating Dock (When 1-4 items selected) */}
      <CompareDock onNavigate={handleNavigate} />

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <aside
          aria-label="System notifications"
          className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 pointer-events-none"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-center gap-2.5 rounded-2xl bg-slate-900/95 text-white border border-slate-700/80 px-4 py-3 shadow-2xl backdrop-blur-md text-xs font-semibold animate-in slide-in-from-bottom-2 duration-200 max-w-sm"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => dismissToast(toast.id)}
                className="ml-1 text-slate-400 hover:text-white p-0.5"
                title="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </aside>
      )}

      {/* Section 10: Mobile Sticky Advertisement (Dismissible) */}
      {showMobileStickyAd && (
        <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden bg-slate-900 border-t border-slate-800 p-2.5 shadow-2xl flex items-center justify-between text-xs text-white">
          <div className="flex-1 pr-2 truncate">
            <span className="rounded bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 text-[9px] mr-1.5 uppercase">
              Ad
            </span>
            <span className="font-semibold text-slate-200">
              Save up to 40% on Audiophile Gear on Amazon
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://amazon.com"
              target="_blank"
              rel="sponsored nofollow noopener noreferrer"
              className="rounded bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white"
            >
              Shop
            </a>
            <button
              onClick={() => setShowMobileStickyAd(false)}
              className="text-slate-400 hover:text-white p-1"
              aria-label="Dismiss mobile ad"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all animate-in fade-in duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Section 11: Production Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Live Price Comparison Modal */}
      <PriceComparisonModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
      />

      {/* Saved Shortlist Drawer (Connected to DiscoveryContext / LocalStorage) */}
      {isSavedDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your Saved Shortlist ({favorites.length})
                </h3>
              </div>
              <button
                onClick={() => setIsSavedDrawerOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 py-3">
              Items saved in your browser session for quick comparison. No user registration required.
            </p>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {favorites.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm space-y-2">
                  <Bookmark className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="font-semibold text-slate-600 dark:text-slate-300">Your shortlist is empty</p>
                  <p className="text-xs text-slate-400">Click the bookmark icon on any review or product card to save items.</p>
                </div>
              ) : (
                favorites.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-3 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-14 w-14 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => {
                          setIsSavedDrawerOpen(false);
                          handleNavigate(p.slug);
                        }}
                        className="text-xs font-bold text-slate-900 dark:text-white truncate block text-left hover:text-blue-600 transition-colors"
                      >
                        {p.name}
                      </button>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                          {p.price}
                        </span>
                        <span className="text-[10px] text-slate-400">on {p.merchant}</span>
                        <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-1 rounded">
                          ★ {p.rating}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFavorite(p.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove from saved"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                disabled={favorites.length === 0}
                onClick={() => {
                  setIsSavedDrawerOpen(false);
                  handleNavigate('/compare');
                }}
                className={`w-full rounded-xl py-3 text-xs font-bold transition-colors text-center block ${
                  favorites.length === 0
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Compare Shortlist Side-by-Side
              </button>
              <button
                onClick={() => setIsSavedDrawerOpen(false)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Offline Connectivity Detection Banner */}
      <OfflineBanner />
    </div>
  );
}
