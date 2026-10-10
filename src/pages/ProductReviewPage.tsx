import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  ShieldCheck,
  Calendar,
  Clock,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Award,
  CheckCircle2,
  Tag,
  Share2,
  Scale,
  Sparkles,
  ArrowRight,
  Bookmark,
  Check,
  ListFilter,
} from 'lucide-react';
import { SONY_XM5_REVIEW } from '../data/extendedData';
import { UNIFIED_CATALOG } from '../data/unifiedCatalog';
import { useDiscovery } from '../context/DiscoveryContext';
import { AdContainer } from '../components/home/AdContainer';
import { SeoHead } from '../components/seo/SeoHead';
import {
  JsonLdSchema,
  createProductReviewSchema,
  createFaqSchema,
  createBreadcrumbSchema,
} from '../components/seo/JsonLdSchema';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { RecentlyViewedCarousel } from '../components/discovery/RecentlyViewedCarousel';

// Modular Product Experience Components
import { ProductGalleryViewer } from '../components/product/ProductGalleryViewer';
import { EditorialRatingSystem } from '../components/product/EditorialRatingSystem';
import { QuickVerdictCard } from '../components/product/QuickVerdictCard';
import { AffiliateBuyBox } from '../components/product/AffiliateBuyBox';
import { ProductSpecificationsTable } from '../components/product/ProductSpecificationsTable';
import { ProsConsCard } from '../components/product/ProsConsCard';
import { WhoShouldBuyCard } from '../components/product/WhoShouldBuyCard';
import { FaqAccordion } from '../components/product/FaqAccordion';
import { SocialShareBar } from '../components/product/SocialShareBar';
import { StickyMobileBuyBar } from '../components/product/StickyMobileBuyBar';
import { RelatedProductsSection } from '../components/product/RelatedProductsSection';
import { RelatedArticlesSection } from '../components/product/RelatedArticlesSection';

interface ProductReviewPageProps {
  slug?: string;
  onNavigate: (path: string) => void;
}

export const ProductReviewPage: React.FC<ProductReviewPageProps> = ({
  slug = '/reviews/sony-wh-1000xm5',
  onNavigate,
}) => {
  const review = SONY_XM5_REVIEW;
  const { addRecentlyViewed, addToCompare, isInCompare, toggleFavorite, isFavorite } = useDiscovery();
  const [readingProgress, setReadingProgress] = useState(0);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setReadingProgress(Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Register product into Recently Viewed
  useEffect(() => {
    const catalogItem = UNIFIED_CATALOG.find((p) => p.slug === slug || p.name.includes('WH-1000XM5'));
    if (catalogItem) {
      addRecentlyViewed(catalogItem);
    }
  }, [slug, addRecentlyViewed]);

  // Comments state
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentsList, setCommentsList] = useState([
    {
      id: 'c1',
      author: 'Julian Thorne (Verified Audio Engineer)',
      date: '2 days ago',
      content:
        'Can confirm the ANC on transatlantic flights is unbelievable. Upgraded from the XM3 and the reduction in mid-frequency engine drone is night and day. Call mic also holds up remarkably well in windy airports.',
      verifiedBuyer: true,
    },
    {
      id: 'c2',
      author: 'Mei-Ling Zhou',
      date: 'Yesterday',
      content:
        'The ear cushion pressure distribution is substantially lighter on the crown than AirPods Max. Appreciate the detailed lab frequency chart in this review!',
      verifiedBuyer: true,
    },
  ]);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: review.category.name, url: review.category.slug },
    { name: `${review.name} Review`, url: review.slug },
  ];

  const scrollToBuyBox = () => {
    const buyBoxElement = document.getElementById('affiliate-buy-box');
    if (buyBoxElement) {
      buyBoxElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !commentAuthor.trim()) return;
    setCommentsList((prev) => [
      {
        id: `c-${Date.now()}`,
        author: commentAuthor,
        date: 'Just now',
        content: commentText,
        verifiedBuyer: false,
      },
      ...prev,
    ]);
    setCommentText('');
    setCommentAuthor('');
  };

  // Convert prices array to BuyBoxOffer interface
  const buyBoxOffers = review.prices.map((p) => ({
    store: p.merchant,
    price: p.price,
    originalPrice: p.originalPrice,
    availability: p.availability,
    shipping: p.shipping,
    affiliateUrl: p.affiliateUrl,
    badge: p.badge,
    buttonText: `View Deal on ${p.merchant}`,
  }));

  // Standardized 6-pillar breakdown
  const ratingBreakdown = [
    { category: 'Design', score: 9.6, description: 'Stepless friction headband, refined matte polymer, featherweight 250g chassis.' },
    { category: 'Performance', score: 9.9, description: 'Unrivaled -34 dB active attenuation across speech and turbine rumble.' },
    { category: 'Features', score: 9.8, description: 'LDAC lossless transmission, multi-point pairing, speak-to-chat ambient passthrough.' },
    { category: 'Ease of Use', score: 9.5, description: 'Intuitive capacitive ear cup gesture controls with companion equalization app.' },
    { category: 'Build Quality', score: 9.4, description: 'Premium soft-fit protein leather cushions with seamless rotation hinges.' },
    { category: 'Value For Money', score: 9.3, description: 'Industry benchmark audio isolation outperforming alternatives by $150+.' },
  ];

  // Map related products
  const relatedProductsList = review.relatedProducts.map((p, idx) => ({
    id: `rel-${idx}`,
    name: p.name,
    slug: p.slug,
    image: p.image,
    price: p.price,
    score: p.score,
    shortDescription: `Top contender tested head-to-head in our acoustic facility against the ${review.name}.`,
    badge: idx === 0 ? 'Runner-Up' : undefined,
  }));

  // Map related articles
  const relatedArticlesList = [
    {
      id: 'art-1',
      title: 'The 7 Best Noise-Canceling Headphones for Long-Haul Travel (2026)',
      slug: '/buying-guides/best-anc-headphones-travel',
      type: 'guide' as const,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      readingTime: '8 min read',
      date: 'October 3, 2026',
      author: 'Dr. Marcus Vance',
      excerpt: 'Comprehensive sound pressure and decibel attenuation tests across major airline cabin environments.',
    },
    {
      id: 'art-2',
      title: 'Sony WH-1000XM5 vs Bose QuietComfort Ultra: Definitive Head-to-Head Test',
      slug: '/compare/sony-wh-1000xm5-vs-bose-qc-ultra',
      type: 'comparison' as const,
      image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
      readingTime: '10 min read',
      date: 'October 2, 2026',
      author: 'Sarah Jenkins',
      excerpt: 'Direct acoustic shootout measuring battery discharge rates, call wind isolation, and long-flight comfort.',
    },
  ];

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Dynamic SEO, Discover Meta & OpenGraph Cards */}
      <SeoHead
        title={`${review.name} In-Depth Lab Review: Unrivaled Acoustic Isolation`}
        description={`${review.name} tested over ${review.author.labTestedHours} in our anechoic chamber. Independent frequency response, battery benchmarks, and multi-merchant prices.`}
        canonicalPath={slug}
        ogImage={review.gallery[0].url}
        ogType="article"
        publishedTime={review.publishedDate}
        modifiedTime={review.updatedDate}
        author={review.author.name}
      />

      {/* Reading Progress Bar (Fixed Top 0 CLS) */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 transition-all duration-75 ease-out shadow-[0_0_10px_rgba(59,130,246,0.8)]"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* 19. SEO Structured Data (JSON-LD) */}
      <JsonLdSchema
        data={createProductReviewSchema({
          name: review.name,
          image: review.gallery[0].url,
          description: review.quickVerdict,
          brand: review.brand,
          score: review.score,
          author: review.author.name,
          publishedDate: review.publishedDate,
          lowPrice: '$329.00',
          highPrice: '$449.99',
        })}
      />
      <JsonLdSchema data={createFaqSchema(review.faqs)} />
      <JsonLdSchema data={createBreadcrumbSchema(breadcrumbs)} />

      {/* Breadcrumb Navigation Bar */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-2.5 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <ol className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            {breadcrumbs.map((crumb, idx) => (
              <li key={crumb.name} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" />}
                <button
                  onClick={() => onNavigate(crumb.url)}
                  className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate ${
                    idx === breadcrumbs.length - 1 ? 'font-bold text-slate-900 dark:text-white' : ''
                  }`}
                  aria-current={idx === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {crumb.name}
                </button>
              </li>
            ))}
          </ol>

          <div className="hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" /> Lab Certified Benchmark
            </span>
          </div>
        </div>
      </nav>

      {/* 16. Top Leaderboard Advertisement Placement (728x90) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdContainer slot="leaderboard" format="728x90" sponsorName="Google AdSense Partner Network" />
      </div>

      {/* Article Header & Product Information */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="space-y-4">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {review.category.name}
            </span>
            <span className="rounded-full bg-amber-50 dark:bg-amber-950/60 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              {review.award}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Model: {review.model || 'WH-1000XM5'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Tested over {review.author.labTestedHours}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            {review.name} In-Depth Lab Review: Unrivaled Acoustic Isolation
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {review.tagline}
          </p>

          {/* Author Byline, Published Date & Reading Time */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={review.author.avatar}
                alt={review.author.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-600/30"
                loading="eager"
              />
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-white">
                  By {review.author.name}
                </span>
                <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                  {review.author.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Published: {review.publishedDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Last Updated: {review.updatedDate}
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {review.readingTime}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Review Body Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Column (8 Cols): Gallery, Quick Verdict, Breakdown, Specs, Video, FAQs */}
          <div className="lg:col-span-8 space-y-10">
            {/* Quick Table of Contents for Google Rich Sitelinks & Rapid Reader Navigation */}
            <nav
              aria-label="Review Table of Contents"
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-4 space-y-2 shadow-xs"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <ListFilter className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Jump to Section:</span>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { title: 'Quick Verdict', href: '#quick-verdict' },
                  { title: 'Photo Gallery', href: '#product-gallery' },
                  { title: 'Lab Scorecard', href: '#lab-scorecard' },
                  { title: 'Pros & Cons', href: '#pros-cons' },
                  { title: 'Specifications', href: '#specifications' },
                  { title: 'Who Should Buy', href: '#who-should-buy' },
                  { title: 'Alternatives', href: '#alternatives-matrix' },
                  { title: 'FAQs', href: '#faqs' },
                ].map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/70 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </nav>

            {/* 3. Quick Verdict Card (Above The Fold) */}
            <div id="quick-verdict">
              <QuickVerdictCard
                productName={review.name}
                score={review.score}
                shortSummary={review.quickVerdict}
                bestFor={review.bestFor || 'Frequent air travelers, hybrid workers needing exceptional voice call isolation, and users seeking featherweight all-day comfort.'}
                avoidIf={review.avoidIf || 'You need waterproof sports headphones for heavy rain/sweat workouts, or earcups that collapse inwards into a tiny pocket.'}
                bottomLine={review.bottomLine || 'The Sony WH-1000XM5 sets an unbeatable high-water mark for wireless noise reduction, comfort, and battery longevity. It remains ProductPilot’s definitive #1 Editor’s Choice over-ear recommendation for 2026.'}
                onScrollToBuyBox={scrollToBuyBox}
              />
            </div>

            {/* 1. Large Product Gallery with Lightbox, Zoom & Mobile Swipe */}
            <div id="product-gallery">
              <ProductGalleryViewer
                images={review.gallery}
                score={review.score}
                youtubeVideoId={review.youtubeVideoId}
                youtubeTitle={review.youtubeTitle}
                badge="Top Noise Canceler"
              />
            </div>

            {/* 15. Social Share Bar */}
            <SocialShareBar
              title={`${review.name} In-Depth Lab Review — ProductPilot`}
              url={typeof window !== 'undefined' ? window.location.href : undefined}
            />

            {/* 2. Editorial Rating System with 6 Breakdown Metrics & Progress Bars */}
            <div id="lab-scorecard">
              <EditorialRatingSystem
                overallScore={review.score}
                award={review.award}
                testedHours={review.author.labTestedHours}
                breakdown={ratingBreakdown}
              />
            </div>

            {/* 6. Pros & Cons Dual Cards */}
            <div id="pros-cons">
              <ProsConsCard
                pros={review.pros}
                cons={review.cons}
                productName={review.name}
              />
            </div>

            {/* 16. In-Article Advertisement Slot (300x250) */}
            <AdContainer
              slot="in_content"
              format="300x250"
              sponsorName="Direct Media Partner"
              adTitle="DACs & Audiophile Amps"
            />

            {/* 5. Product Specifications Table (Expandable) */}
            <div id="specifications">
              <ProductSpecificationsTable
                specifications={review.specifications}
                productName={review.name}
              />
            </div>

            {/* 8. Who Should Buy vs Who Should Avoid */}
            <div id="who-should-buy">
              <WhoShouldBuyCard
                whoShouldBuy={review.whoShouldBuy}
                whoShouldAvoid={review.whoShouldAvoid}
              />
            </div>

            {/* 9. FAQ Section (Accordion & Schema-ready) */}
            <div id="faqs">
              <FaqAccordion
                faqs={review.faqs}
                productName={review.name}
              />
            </div>

            {/* Alternatives & Head-to-Head Comparison Matrix */}
            <section id="alternatives-matrix" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 mb-1">
                    <Scale className="h-3.5 w-3.5" />
                    <span>Head-to-Head Benchmarks</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Top Alternatives & Comparison
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    How the {review.name} measures against its closest industry rivals.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('/compare')}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-colors shrink-0"
                >
                  <Scale className="h-3.5 w-3.5" />
                  <span>Launch Full Matrix</span>
                </button>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <th className="py-3 px-3 font-bold text-slate-500 dark:text-slate-400">Product</th>
                      <th className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40">
                        {review.name} (This Review)
                      </th>
                      <th className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">Bose QC Ultra</th>
                      <th className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">Apple AirPods Max</th>
                      <th className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">Sennheiser Momentum 4</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-600 dark:text-slate-400">Verdict Award</td>
                      <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/20">
                        #1 Editor&apos;s Choice (Best Overall)
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">Best Comfort Runner-Up</td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">Premium Luxury Pick</td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">Best Battery Life Pick</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-600 dark:text-slate-400">Lab Score</td>
                      <td className="py-3 px-3 font-black text-slate-900 dark:text-white bg-blue-50/30 dark:bg-blue-950/20">
                        9.7 / 10
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">9.5 / 10</td>
                      <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">9.3 / 10</td>
                      <td className="py-3 px-3 font-bold text-slate-700 dark:text-slate-300">9.2 / 10</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-600 dark:text-slate-400">ANC Attenuation</td>
                      <td className="py-3 px-3 font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/20">
                        -34 dB (Deepest isolation)
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">-32 dB</td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">-31 dB</td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">-28 dB</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-600 dark:text-slate-400">Battery Life</td>
                      <td className="py-3 px-3 text-slate-800 dark:text-slate-200 bg-blue-50/30 dark:bg-blue-950/20">
                        30 Hours (ANC On)
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">24 Hours</td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">20 Hours</td>
                      <td className="py-3 px-3 font-extrabold text-emerald-600 dark:text-emerald-400">60 Hours (Highest)</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-600 dark:text-slate-400">Weight</td>
                      <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/20">
                        250g (Lightest)
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">253g</td>
                      <td className="py-3 px-3 text-rose-500">384g (Noticeably heavier)</td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">293g</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-600 dark:text-slate-400">Typical Price</td>
                      <td className="py-3 px-3 font-black text-emerald-600 dark:text-emerald-400 bg-blue-50/30 dark:bg-blue-950/20">
                        $398.00
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">$429.00</td>
                      <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">$549.00</td>
                      <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">$379.95</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Select any rival to compare specs in our head-to-head comparison engine:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const rival = UNIFIED_CATALOG.find((p) => p.name.includes('Bose') || p.id === 'p4');
                      const current = UNIFIED_CATALOG.find((p) => p.slug === slug || p.id === 'p1');
                      if (current) addToCompare(current);
                      if (rival) addToCompare(rival);
                      onNavigate('/compare');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <span>Compare with Bose</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => {
                      const rival = UNIFIED_CATALOG.find((p) => p.name.includes('AirPods') || p.id === 'p6');
                      const current = UNIFIED_CATALOG.find((p) => p.slug === slug || p.id === 'p1');
                      if (current) addToCompare(current);
                      if (rival) addToCompare(rival);
                      onNavigate('/compare');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <span>Compare with AirPods</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </section>

            {/* 10. Related Products Section */}
            <RelatedProductsSection
              products={relatedProductsList}
              currentProductName={review.name}
              onNavigate={onNavigate}
            />

            {/* 11. Related Articles Section */}
            <RelatedArticlesSection
              articles={relatedArticlesList}
              onNavigate={onNavigate}
            />

            {/* Author Credibility Box */}
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900 p-6 flex flex-col sm:flex-row items-center gap-5">
              <img
                src={review.author.avatar}
                alt={review.author.name}
                className="h-20 w-20 rounded-full object-cover ring-4 ring-blue-600/20 shrink-0"
                loading="lazy"
              />
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {review.author.name}
                  </h4>
                  <span className="rounded bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                    {review.author.role}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {review.author.bio}
                </p>
              </div>
            </section>

            {/* Reader Observations & Community */}
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Reader Observations & Feedback ({commentsList.length})
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Moderated Community</span>
              </div>

              {/* Comment submission form */}
              <form onSubmit={handleAddComment} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Your name or handle..."
                    className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your personal testing experience with this hardware..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 dark:bg-blue-600 text-white font-bold text-xs px-4 py-2 hover:bg-slate-800 transition-colors"
                >
                  Submit Observation
                </button>
              </form>

              {/* Comments list */}
              <div className="space-y-3 pt-2">
                {commentsList.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 dark:text-white">{c.author}</strong>
                        {c.verifiedBuyer && (
                          <span className="rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 text-[10px] font-bold">
                            Verified Owner
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar (4 Cols): Multi-Store Buy Box & Contextual Placements */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* 4. Affiliate Buy Box (Amazon, eBay, AliExpress, Daraz) */}
            <AffiliateBuyBox
              productName={review.name}
              offers={buyBoxOffers}
              lastCheckedDate="Verified Today"
            />

            {/* 16. Sidebar Advertisement Slot (300x250 or 300x600) */}
            <AdContainer
              slot="sidebar"
              format="300x250"
              sponsorName="Contextual Electronics Sponsor"
            />

            {/* Head-to-Head Comparison Prompt */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-blue-900 to-slate-900 p-5 text-white shadow-md space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                Head-to-Head Lab Test
              </span>
              <h4 className="text-base font-bold">
                Sony WH-1000XM5 vs Bose QuietComfort Ultra
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                See direct decibel attenuation measurements, battery discharge rates, and our declared winner.
              </p>
              <button
                onClick={() => onNavigate('/compare/sony-wh-1000xm5-vs-bose-qc-ultra')}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs py-2.5 transition-colors"
              >
                <span>Read Head-to-Head Showdown</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* 12. Sticky Mobile Buy Bar (Mobile Only, triggers on scroll) */}
      <StickyMobileBuyBar
        productName={review.name}
        image={review.gallery[0].url}
        price={review.prices[0]?.price || '$398.00'}
        score={review.score}
        primaryAffiliateUrl={review.prices[0]?.affiliateUrl || 'https://amazon.com'}
        onScrollToBuyBox={scrollToBuyBox}
      />

      {/* Recently Viewed Products Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecentlyViewedCarousel onNavigate={onNavigate} />
      </div>

      {/* 14. Modern Newsletter Block */}
      <NewsletterSection onNavigate={onNavigate} />
    </article>
  );
};
