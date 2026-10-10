import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  ArrowRight,
  Headphones,
  Laptop,
  Home,
  Camera,
  Gamepad2,
  Tv,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';

interface CategoryDiscoverySectionProps {
  onNavigate: (path: string) => void;
}

export const CategoryDiscoverySection: React.FC<CategoryDiscoverySectionProps> = ({
  onNavigate,
}) => {
  const [activeFilter, setActiveFilter] = useState<'featured' | 'popular' | 'trending'>('featured');

  const categories = [
    {
      id: 'audio-visual',
      name: 'Audio & Visual',
      slug: '/category/audio-visual',
      icon: <Headphones className="h-6 w-6 text-blue-500" />,
      itemsCount: 148,
      testedHours: '1,240 hrs',
      topPick: 'Sony WH-1000XM5',
      badge: 'Most Popular',
      description: 'Noise-canceling headphones, true wireless earbuds, Atmos soundbars, and OLED TVs.',
      type: 'popular',
    },
    {
      id: 'computing',
      name: 'Computing & Productivity',
      slug: '/category/computing',
      icon: <Laptop className="h-6 w-6 text-emerald-500" />,
      itemsCount: 210,
      testedHours: '980 hrs',
      topPick: 'MacBook Pro 16" M4 Max',
      badge: 'Editor Favorite',
      description: 'Creator workstations, color-accurate displays, mechanical keyboards & ergonomic chairs.',
      type: 'featured',
    },
    {
      id: 'smart-home',
      name: 'Smart Living & Automation',
      slug: '/category/smart-home',
      icon: <Home className="h-6 w-6 text-amber-500" />,
      itemsCount: 142,
      testedHours: '860 hrs',
      topPick: 'Roborock S8 Pro Ultra',
      badge: 'Fastest Growing',
      description: 'LiDAR robot vacuums, Matter-certified smart hubs, and encrypted home security.',
      type: 'trending',
    },
    {
      id: 'gaming',
      name: 'Gaming & High-End Gear',
      slug: '/category/gaming',
      icon: <Gamepad2 className="h-6 w-6 text-purple-500" />,
      itemsCount: 96,
      testedHours: '720 hrs',
      topPick: 'ASUS ROG Swift 240Hz',
      badge: 'Hot Deals',
      description: 'High-refresh 240Hz OLED monitors, lightweight esports mice & handheld consoles.',
      type: 'trending',
    },
    {
      id: 'cameras',
      name: 'Cameras & Optics',
      slug: '/category/cameras',
      icon: <Camera className="h-6 w-6 text-rose-500" />,
      itemsCount: 88,
      testedHours: '640 hrs',
      topPick: 'Sony A7 IV Hybrid',
      badge: 'Pro Tier',
      description: 'Full-frame mirrorless sensors, cinema prime lenses, and 3-axis gimbal stabilizers.',
      type: 'featured',
    },
  ];

  const filteredCategories = categories.filter((c) => {
    if (activeFilter === 'featured') return true;
    if (activeFilter === 'popular') return c.type === 'popular' || c.itemsCount > 100;
    if (activeFilter === 'trending') return c.type === 'trending';
    return true;
  });

  const topBrands = [
    { name: 'Sony', count: 42, score: 9.6, category: 'Audio & Cameras' },
    { name: 'Apple', count: 35, score: 9.8, category: 'Silicon & Mobile' },
    { name: 'Bose', count: 28, score: 9.5, category: 'Acoustic Sound' },
    { name: 'Roborock', count: 18, score: 9.4, category: 'Smart Vacuums' },
    { name: 'ASUS ROG', count: 31, score: 9.6, category: 'Gaming Displays' },
    { name: 'Sennheiser', count: 22, score: 9.5, category: 'Audiophile Transducers' },
  ];

  return (
    <section className="space-y-8">
      {/* Header and Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Layers className="h-3.5 w-3.5" />
            <span>Curated Hardware Clusters</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1.5 font-sans">
            Explore Categories & Benchmarks
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Every product tested under controlled environmental parameters in our independent lab.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
          {[
            { id: 'featured', label: 'All Clusters' },
            { id: 'popular', label: 'Popular' },
            { id: 'trending', label: 'Trending 2026' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Icon Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate(cat.slug)}
            className="group relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <span className="rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-black px-2.5 py-0.5 uppercase tracking-wider">
                  {cat.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>{cat.itemsCount} Products</span>
                <span>·</span>
                <span>{cat.testedHours} Benchmarked</span>
              </div>

              <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                Explore <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Top Brands Showcase Strip */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-500" />
            Top Hardware Manufacturers (Aggregated Editorial Ratings)
          </span>
          <span className="text-[11px] text-slate-400">Strictly independent lab testing</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {topBrands.map((brand) => (
            <div
              key={brand.name}
              className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-1 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <span className="font-black text-sm text-slate-900 dark:text-white block">
                {brand.name}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">{brand.category}</span>
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="font-extrabold text-amber-500">★ {brand.score}</span>
                <span className="text-slate-400">{brand.count} items</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
