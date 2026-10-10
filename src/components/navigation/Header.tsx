import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ChevronDown,
  Menu,
  Bookmark,
  Flame,
  Scale,
  BookOpen,
  Info,
  ShieldCheck,
  Globe,
  Sparkles,
  ExternalLink,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { MEGA_CATEGORIES } from '../../data/navigationData';
import { MegaMenu } from './MegaMenu';
import { SearchBarModal } from './SearchBarModal';
import { MobileNavDrawer } from './MobileNavDrawer';
import { useTheme } from '../../context/ThemeContext';
import { ProductPilotLogo } from '../brand/ProductPilotLogo';

interface HeaderProps {
  onNavigate?: (path: string) => void;
  savedItemsCount?: number;
  onOpenSavedDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  savedItemsCount = 3,
  onOpenSavedDrawer,
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut for Cmd/Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const activeCategory = MEGA_CATEGORIES.find((cat) => cat.slug === activeCategorySlug);

  const handleCategoryHover = (slug: string) => {
    setActiveCategorySlug(slug);
  };

  const handleCategoryLeave = () => {
    setActiveCategorySlug(null);
  };

  const handleNavClick = (path: string) => {
    setActiveCategorySlug(null);
    if (onNavigate) {
      onNavigate(path);
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800'
            : 'bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80'
        }`}
      >
        {/* Top Utility Bar (Regulatory Notice & Currency & Theme) */}
        <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80 text-xs text-slate-500 dark:text-slate-400">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-1.5">
            {/* Regulatory Affiliate Disclosure */}
            <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">
                Independent Lab Testing. When you buy through links on ProductPilot, we may earn an affiliate commission.
              </span>
              <span className="inline sm:hidden">
                Independent Reviews. We may earn an affiliate commission.
              </span>
              <button
                onClick={() => setIsDisclosureOpen(true)}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline ml-1 shrink-0"
              >
                Learn More
              </button>
            </div>

            {/* Currency & Direct Utility Tools */}
            <div className="hidden md:flex items-center gap-4 text-[11px] font-medium">
              <button
                onClick={() => handleNavClick('/how-we-test')}
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                How We Test
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button
                onClick={() => handleNavClick('/deals')}
                className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700"
              >
                <Flame className="h-3 w-3" /> Today&apos;s Price Drops
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <Globe className="h-3 w-3 text-slate-400" />
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-transparent font-semibold text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                  aria-label="Select Currency"
                >
                  <option value="USD" className="dark:bg-slate-900">USD ($)</option>
                  <option value="EUR" className="dark:bg-slate-900">EUR (€)</option>
                  <option value="GBP" className="dark:bg-slate-900">GBP (£)</option>
                  <option value="CAD" className="dark:bg-slate-900">CAD ($)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header Navbar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between gap-4">
            {/* Left: Mobile Menu Trigger + Brand Logo */}
            <div className="flex items-center gap-3 lg:gap-8">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="flex lg:hidden rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Open navigation menu"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Logo */}
              <div
                onClick={() => handleNavClick('/')}
                className="cursor-pointer"
              >
                <ProductPilotLogo size="md" />
              </div>
            </div>

            {/* Middle: Desktop Mega Category Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {MEGA_CATEGORIES.map((cat) => {
                const isActive = activeCategorySlug === cat.slug;
                return (
                  <div
                    key={cat.id}
                    onMouseEnter={() => handleCategoryHover(cat.slug)}
                    className="relative"
                  >
                    <button
                      onClick={() => handleNavClick(`/category/${cat.slug}`)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                          isActive ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                        }`}
                      />
                    </button>
                  </div>
                );
              })}

              {/* Direct Links */}
              <button
                onClick={() => handleNavClick('/buying-guides')}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>Buying Guides</span>
              </button>

              <button
                onClick={() => handleNavClick('/compare')}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Scale className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Compare</span>
              </button>

              <button
                onClick={() => handleNavClick('/deals')}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-amber-600 transition-colors relative"
              >
                <Flame className="h-4 w-4 text-amber-500" />
                <span>Deals</span>
                <span className="ml-0.5 flex h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              </button>
            </nav>

            {/* Right: Search Bar, Theme Toggle, Bookmarks & Admin CTA */}
            <div className="flex items-center gap-2">
              {/* Search Bar Input Pill (Launches Modal) */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="group flex h-11 w-11 sm:w-64 lg:w-72 items-center gap-3 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/60 pl-3 sm:pl-4 pr-3 text-sm transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
                title="Search products (Cmd+K)"
              >
                <Search className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                <span className="hidden sm:inline-block flex-1 truncate text-left text-[13px] font-medium text-slate-400 dark:text-slate-500">
                  Search products, reviews...
                </span>
                <kbd className="hidden sm:inline-flex h-6 shrink-0 items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 text-[10px] font-semibold text-slate-400 group-hover:border-slate-300 dark:group-hover:border-slate-600">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="rounded-full border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} Mode`}
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
              </button>

              {/* Saved Items Counter (Shortlist) */}
              <button
                onClick={onOpenSavedDrawer || (() => handleNavClick('/saved'))}
                className="relative rounded-full border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Saved Products & Comparisons"
                aria-label="View Saved Gear"
              >
                <Bookmark className="h-4 w-4" />
                {savedItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
                    {savedItemsCount}
                  </span>
                )}
              </button>

              {/* Admin Portal Gateway */}
              <button
                onClick={() => handleNavClick('/admin')}
                className="hidden lg:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Overlay Container */}
        {activeCategory && (
          <MegaMenu
            category={activeCategory}
            onClose={handleCategoryLeave}
            onNavigate={handleNavClick}
          />
        )}
      </header>

      {/* Global Interactive Search Modal */}
      <SearchBarModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavClick}
      />

      {/* Mobile Responsive Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigate={handleNavClick}
        selectedCurrency={selectedCurrency}
        onChangeCurrency={setSelectedCurrency}
      />

      {/* Affiliate Disclosure Explainer Modal */}
      {isDisclosureOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Affiliate Disclosure & Transparency Pledge
                </h3>
              </div>
              <button
                onClick={() => setIsDisclosureOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              <p>
                ProductPilot is an independently owned editorial publication. We are dedicated to providing rigorous, bias-free reviews and buying advice.
              </p>
              <p>
                When you click through our affiliate links to purchase products on retail marketplaces including <strong>Amazon, eBay, AliExpress, and Daraz</strong>, we may earn an affiliate commission at no additional cost to you.
              </p>
              <p>
                Our editorial rating scores, &quot;Who Should Buy&quot; verdicts, and lab benchmarks are never influenced by manufacturer payments, promotional freebies, or affiliate commission rates. If a product fails our lab stress tests, we will explicitly state its flaws.
              </p>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setIsDisclosureOpen(false)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
