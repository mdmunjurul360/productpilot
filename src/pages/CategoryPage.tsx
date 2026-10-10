import React, { useState, useMemo } from 'react';
import {
  Star,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Flame,
  Award,
  BookOpen,
  Sparkles,
  Bookmark,
  Scale,
} from 'lucide-react';
import { AdContainer } from '../components/home/AdContainer';
import { SeoHead } from '../components/seo/SeoHead';
import {
  JsonLdSchema,
  createBreadcrumbSchema,
  createItemListSchema,
} from '../components/seo/JsonLdSchema';
import { BUYING_GUIDES } from '../data/homepageData';
import { UNIFIED_CATALOG } from '../data/unifiedCatalog';
import { ProductFilterSystem, FilterState, INITIAL_FILTER_STATE } from '../components/discovery/ProductFilterSystem';
import { ProductBadge } from '../components/common/ProductBadge';
import { useDiscovery, CatalogProduct } from '../context/DiscoveryContext';
import { CategoryDiscoverySection } from '../components/discovery/CategoryDiscoverySection';
import { RecentlyViewedCarousel } from '../components/discovery/RecentlyViewedCarousel';
import { NewsletterSection } from '../components/home/NewsletterSection';

interface CategoryPageProps {
  categorySlug?: string;
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug = 'audio-visual',
  onNavigate,
}) => {
  const { toggleFavorite, isFavorite, addToCompare, isInCompare } = useDiscovery();
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Category Metadata Mapping
  const categoryMeta = useMemo(() => {
    switch (categorySlug) {
      case 'audio-visual':
        return {
          title: 'Audio & Visual Engineering',
          h1: 'Best Audio, Headphones & Acoustics of 2026',
          description:
            'Acoustically calibrated and benchmarked in our anechoic test chambers. Browse independent laboratory reviews, frequency response metrics, and multi-merchant pricing for audiophile headphones, Atmos soundbars, and OLED home cinema displays.',
          itemCount: 148,
          bannerImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&auto=format&fit=crop&q=80',
          brands: ['Sony', 'Bose', 'Apple', 'Sennheiser', 'Sonos', 'LG'],
          subcategories: ['Noise-Canceling Headphones', 'True Wireless Earbuds', 'Dolby Atmos Soundbars', '4K OLED Displays', 'Audiophile DACs'],
        };
      case 'smart-home':
        return {
          title: 'Smart Living & Automation',
          h1: 'Best Smart Home Hubs, Vacuums & Security (2026)',
          description:
            'Matter-certified automation hubs, self-emptying robot vacuums, encrypted home security, and smart kitchen gear benchmarked for reliability and data privacy.',
          itemCount: 142,
          bannerImage: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=1600&auto=format&fit=crop&q=80',
          brands: ['Roborock', 'Dyson', 'Eufy', 'Philips Hue', 'Aqara', 'Nanoleaf'],
          subcategories: ['Robot Vacuums', 'Matter Smart Hubs', 'Smart Deadbolts', 'Security Cameras', 'True HEPA Purifiers'],
        };
      case 'computing':
        return {
          title: 'Computing & Workstations',
          h1: 'High-Performance Laptops, Monitors & Ergonomics',
          description:
            'Benchmarked thermal curves, color-accurate displays, and creator workstations tested under intensive rendering loads and long-term ergonomic analysis.',
          itemCount: 210,
          bannerImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&auto=format&fit=crop&q=80',
          brands: ['Apple', 'Dell', 'ASUS', 'Herman Miller', 'Keychron', 'Logitech'],
          subcategories: ['Pro Laptops', 'Ultrabooks', '4K Monitors', 'Ergonomic Task Chairs', 'Mechanical Keyboards'],
        };
      case 'cameras':
        return {
          title: 'Cameras & Optics',
          h1: 'Best Mirrorless Cameras & Cinema Optics 2026',
          description:
            'Autofocus subject tracking, dynamic range stress tests, and high-ISO sensor analysis for professional content creators, hybrid shooters, and street photographers.',
          itemCount: 88,
          bannerImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1600&auto=format&fit=crop&q=80',
          brands: ['Sony', 'Fujifilm', 'Canon', 'Nikon', 'DJI', 'Sigma'],
          subcategories: ['Full-Frame Mirrorless', 'APS-C Compacts', 'Prime Lenses', 'Gimbals & Stabilizers', 'Creator Microphones'],
        };
      default:
        return {
          title: 'Specialized Hardware Category',
          h1: 'Independent Lab Benchmarks & Verified Reviews',
          description:
            'Explore data-backed reviews and multi-marketplace pricing for top-tier technology and consumer hardware tested by ProductPilot.',
          itemCount: 120,
          bannerImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&auto=format&fit=crop&q=80',
          brands: ['Sony', 'Apple', 'Bose', 'Roborock', 'ASUS', 'Fujifilm'],
          subcategories: ['Top Rated', 'Editor Picks', 'Best Value', 'New Arrivals'],
        };
    }
  }, [categorySlug]);

  // Filter Catalog Products
  const filteredProducts = useMemo(() => {
    return UNIFIED_CATALOG.filter((p) => {
      // Category match (slug or name)
      const matchesCategory =
        categorySlug === 'all' ||
        p.category.toLowerCase().includes(categorySlug.replace('-', ' ').toLowerCase()) ||
        (categorySlug === 'audio-visual' && p.category === 'Audio & Visual') ||
        (categorySlug === 'smart-home' && p.category === 'Smart Living') ||
        (categorySlug === 'computing' && p.category === 'Computing') ||
        (categorySlug === 'cameras' && p.category === 'Cameras') ||
        (categorySlug === 'gaming' && p.category === 'Gaming');

      if (!matchesCategory && filters.selectedCategories.length === 0) {
        return false;
      }

      // Filter state matches
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(p.category)) {
        return false;
      }
      if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(p.brand)) {
        return false;
      }
      if (
        filters.selectedMerchants.length > 0 &&
        !filters.selectedMerchants.some((m) => p.merchantsAvailable.includes(m as any))
      ) {
        return false;
      }
      if (filters.selectedBadges.length > 0 && (!p.badge || !filters.selectedBadges.includes(p.badge))) {
        return false;
      }
      if (p.numericPrice < filters.minPrice || p.numericPrice > filters.maxPrice) {
        return false;
      }
      if (filters.minRating > 0 && p.rating < filters.minRating) {
        return false;
      }
      if (filters.inStockOnly && p.availability !== 'In Stock') {
        return false;
      }
      if (filters.onSaleOnly && !p.discount) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price_low':
          return a.numericPrice - b.numericPrice;
        case 'price_high':
          return b.numericPrice - a.numericPrice;
        case 'user_rating':
          return b.userRating - a.userRating;
        case 'newest':
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'highest_rated':
        default:
          return b.rating - a.rating;
      }
    });
  }, [categorySlug, filters]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/categories' },
    { name: categoryMeta.title, url: `/category/${categorySlug}` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Dynamic Category SEO & OpenGraph */}
      <SeoHead
        title={categoryMeta.title}
        description={categoryMeta.description}
        canonicalPath={`/category/${categorySlug}`}
        ogImage={categoryMeta.bannerImage}
        ogType="website"
      />

      {/* Breadcrumb Schema */}
      <JsonLdSchema data={createBreadcrumbSchema(breadcrumbs)} />
      <JsonLdSchema
        data={createItemListSchema({
          name: categoryMeta.h1,
          description: categoryMeta.description,
          itemListElement: currentProducts.map((p: CatalogProduct, idx: number) => ({
            name: p.name,
            url: p.slug,
            position: idx + 1,
            image: p.image,
          })),
        })}
      />

      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.name}>
              {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600" />}
              <button
                onClick={() => onNavigate(crumb.url)}
                className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate ${
                  idx === breadcrumbs.length - 1 ? 'font-bold text-slate-900 dark:text-white' : ''
                }`}
              >
                {crumb.name}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Top Banner Ad Container (0 CLS) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdContainer slot="leaderboard" sponsorName="Commercial Display Network" />
      </div>

      {/* Beautiful Hero Banner */}
      <header className="relative overflow-hidden py-10 sm:py-14 bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 px-3.5 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Laboratory Benchmarked Vertical</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-sans leading-[1.15]">
                {categoryMeta.h1}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {categoryMeta.description}
              </p>

              {/* Subcategory Pills */}
              <div className="pt-2 flex flex-wrap gap-2">
                {categoryMeta.subcategories.map((sub, idx) => (
                  <span
                    key={idx}
                    className="rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span>Category Integrity Metrics</span>
                  <span className="text-emerald-600 dark:text-emerald-400">100% Unpaid</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5">
                    <span className="block text-xl font-black text-slate-900 dark:text-white">{categoryMeta.itemCount}</span>
                    <span className="text-[11px] text-slate-500">Tested Models</span>
                  </div>
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5">
                    <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400">4 Stores</span>
                    <span className="text-[11px] text-slate-500">Price Monitored</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Prices checked every 30 minutes across Amazon, eBay, AliExpress, and Daraz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Catalog View: Left Filters + Right Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (3 Cols): Faceted Filters */}
          <div className="hidden lg:block lg:col-span-3">
            <ProductFilterSystem
              products={UNIFIED_CATALOG}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
              totalFilteredCount={filteredProducts.length}
            />
          </div>

          {/* Right Column (9 Cols): Products Grid, Sort Toolbar, Pagination */}
          <div className="lg:col-span-9 space-y-6">
            {/* Sorting Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Showing <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> benchmarked products
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filters</span>
                </button>

                <span className="text-xs font-bold text-slate-400 hidden sm:inline">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="highest_rated">Highest Rated (Lab Score)</option>
                  <option value="newest">Newest Releases (2026)</option>
                  <option value="user_rating">User Reviews Rating</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 mb-3.5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1 rounded-full bg-slate-950/85 backdrop-blur-md px-2 py-0.5 text-xs font-extrabold text-white">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span>{product.rating.toFixed(1)}</span>
                      </div>

                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                        {product.badge && <ProductBadge type={product.badge} size="sm" />}
                        <button
                          onClick={() => toggleFavorite(product)}
                          className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                            isFavorite(product.id)
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-950/60 text-white hover:bg-slate-950'
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark className={`h-3.5 w-3.5 ${isFavorite(product.id) ? 'fill-white' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-1">
                      <span>{product.brand}</span>
                      <span>★ {product.userRating} ({product.reviewsCount})</span>
                    </div>

                    <h3
                      onClick={() => onNavigate(product.slug)}
                      className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition-colors line-clamp-1"
                    >
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Verified Price:</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
                        {product.price}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="sponsored nofollow noopener noreferrer"
                        className="rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 p-2 text-center text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Buy on {product.merchant}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <button
                        onClick={() => addToCompare(product)}
                        className={`rounded-xl border p-2 text-center font-bold text-xs transition-colors flex items-center justify-center gap-1 ${
                          isInCompare(product.id)
                            ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 text-emerald-600'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Scale className="h-3 w-3" />
                        <span>{isInCompare(product.id) ? 'Comparing' : 'Compare'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onNavigate(product.slug)}
                      className="w-full flex items-center justify-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>Read Lab Review</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 300, behavior: 'smooth' });
                      }}
                      className={`h-9 w-9 rounded-xl text-xs font-bold transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Filter Dialog */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 h-full p-4 overflow-y-auto">
            <ProductFilterSystem
              products={UNIFIED_CATALOG}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters(INITIAL_FILTER_STATE)}
              totalFilteredCount={filteredProducts.length}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Category Discovery Sections (Popular, Trending, Top Brands) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CategoryDiscoverySection onNavigate={onNavigate} />
      </div>

      {/* Recently Viewed Hardware Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <RecentlyViewedCarousel onNavigate={onNavigate} />
      </div>

      {/* Related Buying Guides for Category */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Related Buying Guides in {categoryMeta.title}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BUYING_GUIDES.slice(0, 2).map((guide) => (
              <div
                key={guide.id}
                onClick={() => onNavigate(guide.slug)}
                className="group cursor-pointer flex flex-col sm:flex-row rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <img
                  src={guide.thumbnail}
                  alt={guide.title}
                  className="sm:w-36 aspect-video sm:aspect-square rounded-xl object-cover"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {guide.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 mt-1 line-clamp-2">
                      {guide.title}
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-blue-600 inline-flex items-center gap-1 mt-2">
                    <span>View Ranked Shortlist ({guide.itemCount} items)</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection onNavigate={onNavigate} />
    </div>
  );
};
