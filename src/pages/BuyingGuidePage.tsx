import React, { useState } from 'react';
import {
  Award,
  Star,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { AdContainer } from '../components/home/AdContainer';
import {
  JsonLdSchema,
  createBreadcrumbSchema,
  createArticleSchema,
} from '../components/seo/JsonLdSchema';
import { SeoHead } from '../components/seo/SeoHead';
import { NewsletterSection } from '../components/home/NewsletterSection';

interface BuyingGuidePageProps {
  guideSlug?: string;
  onNavigate: (path: string) => void;
}

export const BuyingGuidePage: React.FC<BuyingGuidePageProps> = ({
  guideSlug = 'best-anc-headphones-travel',
  onNavigate,
}) => {
  const guideData = {
    title: 'The 7 Best Noise-Canceling Headphones for Long-Haul Travel (2026)',
    subtitle:
      'We spent 380 flight hours and 140 anechoic chamber test cycles analyzing noise attenuation, battery stamina, and pressure comfort across 22 flagship models.',
    author: 'Dr. Marcus Vance',
    role: 'Lead Acoustics Testing Engineer',
    publishDate: 'October 2026',
    readingTime: '12 min read',
    category: 'Audio & Visual',
    rankedProducts: [
      {
        rank: 1,
        award: 'Editor’s Choice · Best Overall',
        name: 'Sony WH-1000XM5 Wireless Headphones',
        score: 9.7,
        price: '$398.00',
        originalPrice: '$449.99',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        reviewSlug: '/reviews/sony-wh-1000xm5',
        verdict:
          'Unquestionably the best noise reduction against airplane turbine rumble and cabin cabin chatter. Exceptional 31.4 hours of battery stamina and a featherweight 250g chassis.',
        pros: ['Highest average noise reduction (-34dB)', '31.4 hours real-world battery', 'Audiophile LDAC high-res support'],
        cons: ['Does not fold completely inward', 'Touch panel requires day of adaptation'],
        specs: {
          'ANC Attenuation': '-34 dB',
          'Battery (ANC On)': '31.4 Hours',
          'Weight': '250g',
          'High-Res Codec': 'LDAC, AAC',
        },
        affiliateLinks: {
          amazon: 'https://amazon.com',
          ebay: 'https://ebay.com',
          aliExpress: 'https://aliexpress.com',
        },
      },
      {
        rank: 2,
        award: 'Best for Maximum Portability',
        name: 'Bose QuietComfort Ultra',
        score: 9.6,
        price: '$429.00',
        originalPrice: '$479.00',
        image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
        reviewSlug: '/reviews/bose-qc-ultra',
        verdict:
          'Inward-folding hinges save 35% backpack volume compared to the Sony XM5, and the spatial Immersive Audio tracking mode creates an expansive holographic soundstage.',
        pros: ['Compact inward folding travel footprint', 'Exceptional sub-100Hz rumble attenuation', 'Immersive spatial tracking'],
        cons: ['24-hour battery is shorter than competitors', 'Higher price point ($429)'],
        specs: {
          'ANC Attenuation': '-35 dB',
          'Battery (ANC On)': '24 Hours',
          'Weight': '252g',
          'High-Res Codec': 'aptX Adaptive',
        },
        affiliateLinks: {
          amazon: 'https://amazon.com',
          ebay: 'https://ebay.com',
          aliExpress: 'https://aliexpress.com',
        },
      },
      {
        rank: 3,
        award: 'Best Battery Life & Value Pick',
        name: 'Sennheiser Momentum 4 Wireless',
        score: 9.5,
        price: '$299.95',
        originalPrice: '$379.95',
        image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
        reviewSlug: '/reviews/sennheiser-momentum-4',
        verdict:
          'A colossal 60-hour battery life means you can fly from London to Sydney and back without touching a charging cable. Rich acoustic headroom with warm, inviting bass.',
        pros: ['Industry-shattering 60h battery life', 'Rich, expansive soundstage', 'Affordable under $300 street price'],
        cons: ['ANC is slightly behind Sony in vocal frequencies', 'Touch controls can be overly sensitive'],
        specs: {
          'ANC Attenuation': '-30 dB',
          'Battery (ANC On)': '60 Hours',
          'Weight': '293g',
          'High-Res Codec': 'aptX Adaptive',
        },
        affiliateLinks: {
          amazon: 'https://amazon.com',
          ebay: 'https://ebay.com',
          aliExpress: 'https://aliexpress.com',
        },
      },
    ],
  };

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Buying Guides', url: '/buying-guides' },
    { name: guideData.title, url: `/buying-guides/${guideSlug}` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <SeoHead
        title={guideData.title}
        description={guideData.subtitle}
        canonicalPath={`/buying-guides/${guideSlug}`}
        ogImage={guideData.rankedProducts[0]?.image}
        ogType="article"
        publishedTime="2026-10-01"
        author={guideData.author}
      />
      <JsonLdSchema data={createBreadcrumbSchema(breadcrumbs)} />
      <JsonLdSchema
        data={createArticleSchema({
          title: guideData.title,
          description: guideData.subtitle,
          url: `https://productpilot.com/buying-guides/${guideSlug}`,
          image: guideData.rankedProducts[0]?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=630&auto=format&fit=crop&q=80',
          datePublished: '2026-10-01',
          authorName: guideData.author,
          authorRole: guideData.role,
        })}
      />

      {/* Top Breadcrumb Bar */}
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

      {/* Leaderboard Ad Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdContainer slot="leaderboard" sponsorName="Travel Tech Sponsors" />
      </div>

      {/* Editorial Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="space-y-4 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-blue-50 dark:bg-blue-950 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              {guideData.category}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Tested over 380 flight hours
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-sans leading-[1.15]">
            {guideData.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {guideData.subtitle}
          </p>

          <div className="flex items-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <span>By <strong className="text-slate-900 dark:text-white">{guideData.author}</strong> ({guideData.role})</span>
            <span>•</span>
            <span>{guideData.publishDate}</span>
            <span>•</span>
            <span>{guideData.readingTime}</span>
          </div>
        </div>
      </header>

      {/* Comparison Summary Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Quick Comparison: Top 3 Long-Haul Picks</span>
            </h2>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              Lab Calibrated Metrics
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 font-bold">Rank & Product</th>
                  <th className="py-3 px-4 font-bold">Award</th>
                  <th className="py-3 px-4 font-bold">Lab Score</th>
                  <th className="py-3 px-4 font-bold">Battery (ANC)</th>
                  <th className="py-3 px-4 font-bold">Noise Attenuation</th>
                  <th className="py-3 px-4 font-bold">Current Price</th>
                  <th className="py-3 px-4 font-bold text-right">Quick Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {guideData.rankedProducts.map((p) => (
                  <tr key={p.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-[11px] font-extrabold shrink-0">
                        #{p.rank}
                      </span>
                      <span>{p.name}</span>
                    </td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-semibold">{p.award}</td>
                    <td className="py-3 px-4 font-black">★ {p.score}</td>
                    <td className="py-3 px-4">{p.specs['Battery (ANC On)']}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{p.specs['ANC Attenuation']}</td>
                    <td className="py-3 px-4 font-black text-slate-900 dark:text-white">{p.price}</td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={p.affiliateLinks.amazon}
                        target="_blank"
                        rel="sponsored nofollow noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1 font-bold text-[11px]"
                      >
                        <span>Amazon</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Ranked In-Depth Product Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {guideData.rankedProducts.map((product) => (
          <article
            key={product.rank}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6"
          >
            {/* Header with Rank & Award Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white font-black text-base shadow-sm">
                  #{product.rank}
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    {product.award}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {product.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs text-slate-400 line-through mr-1.5">{product.originalPrice}</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">{product.price}</span>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-xl text-xs font-black text-amber-700 dark:text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.score} / 10</span>
                </div>
              </div>
            </div>

            {/* Split Media & Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white">
                    {product.specs['ANC Attenuation']} Attenuation
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {product.verdict}
                </p>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 p-3 space-y-1">
                    <strong className="text-emerald-700 dark:text-emerald-400 block mb-1">Key Strengths:</strong>
                    {product.pros.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl bg-rose-50/60 dark:bg-rose-950/30 p-3 space-y-1">
                    <strong className="text-rose-700 dark:text-rose-400 block mb-1">Trade-Offs:</strong>
                    {product.cons.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <X className="h-3 w-3 text-rose-600 shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Multi-Store Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <a
                    href={product.affiliateLinks.amazon}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold transition-colors"
                  >
                    <span>Amazon Store</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href={product.affiliateLinks.ebay}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-bold transition-colors"
                  >
                    <span>eBay Store</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <button
                    onClick={() => onNavigate(product.reviewSlug)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto"
                  >
                    <span>Read Full 3,400-Word Review</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Bottom Newsletter */}
      <NewsletterSection onNavigate={onNavigate} />
    </div>
  );
};
