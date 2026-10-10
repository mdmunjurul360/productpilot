import React from 'react';
import {
  Home,
  UtensilsCrossed,
  Tv,
  Gamepad2,
  Watch,
  Camera,
  Laptop,
  Briefcase,
  Sparkles,
  Activity,
  Navigation,
  Mic,
  ArrowRight,
} from 'lucide-react';
import { FEATURED_CATEGORIES } from '../../data/homepageData';

interface FeaturedCategoriesProps {
  onNavigate: (path: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({ onNavigate }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home className="h-6 w-6 text-white" />;
      case 'Utensils':
        return <UtensilsCrossed className="h-6 w-6 text-white" />;
      case 'Tv':
        return <Tv className="h-6 w-6 text-white" />;
      case 'Gamepad2':
        return <Gamepad2 className="h-6 w-6 text-white" />;
      case 'Watch':
        return <Watch className="h-6 w-6 text-white" />;
      case 'Camera':
        return <Camera className="h-6 w-6 text-white" />;
      case 'Laptop':
        return <Laptop className="h-6 w-6 text-white" />;
      case 'Briefcase':
        return <Briefcase className="h-6 w-6 text-white" />;
      case 'Sparkles':
        return <Sparkles className="h-6 w-6 text-white" />;
      case 'Activity':
        return <Activity className="h-6 w-6 text-white" />;
      case 'Navigation':
        return <Navigation className="h-6 w-6 text-white" />;
      case 'Mic':
        return <Mic className="h-6 w-6 text-white" />;
      default:
        return <Home className="h-6 w-6 text-white" />;
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Taxonomy & Categorization
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
              Explore by Specialized Category
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Curated gear vertical collections rigorously cataloged by our laboratory analysts.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/categories')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            <span>All Category Verticals</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 12 Modern Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {FEATURED_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(cat.slug)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none"
            >
              {/* Subtle Ambient Hover Glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              {/* Icon Container with Gradient Fill */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${cat.gradient} shadow-md transition-transform duration-300 group-hover:scale-110 mb-3`}
              >
                {getIcon(cat.iconName)}
              </div>

              {/* Title & Stats */}
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {cat.count} Lab Tested Items
              </p>

              <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <span>Browse</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
