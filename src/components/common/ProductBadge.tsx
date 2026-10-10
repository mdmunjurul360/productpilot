import React from 'react';
import { Sparkles, Flame, TrendingUp, Zap, Award, Tag, Crown, ArrowDownRight, CheckCircle2 } from 'lucide-react';

export type ProductBadgeType =
  | "Editor's Choice"
  | 'Best Seller'
  | 'Trending'
  | 'Hot Deal'
  | 'Top Rated'
  | 'Price Drop'
  | 'Premium Pick'
  | 'Best Value'
  | 'New';

interface ProductBadgeProps {
  type: ProductBadgeType | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProductBadge: React.FC<ProductBadgeProps> = ({
  type,
  size = 'sm',
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (type) {
      case "Editor's Choice":
        return {
          icon: <Sparkles className="h-3 w-3 shrink-0 text-blue-400" />,
          bg: 'bg-gradient-to-r from-blue-900/90 to-indigo-900/90 border-blue-500/40 text-blue-200',
        };
      case 'Best Seller':
        return {
          icon: <Flame className="h-3 w-3 shrink-0 text-amber-400" />,
          bg: 'bg-gradient-to-r from-amber-950/90 to-orange-950/90 border-amber-500/40 text-amber-200',
        };
      case 'Trending':
        return {
          icon: <TrendingUp className="h-3 w-3 shrink-0 text-rose-400" />,
          bg: 'bg-gradient-to-r from-rose-950/90 to-pink-950/90 border-rose-500/40 text-rose-200',
        };
      case 'Hot Deal':
        return {
          icon: <Zap className="h-3 w-3 shrink-0 text-emerald-400" />,
          bg: 'bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border-emerald-500/40 text-emerald-200',
        };
      case 'Top Rated':
        return {
          icon: <Award className="h-3 w-3 shrink-0 text-purple-400" />,
          bg: 'bg-gradient-to-r from-purple-950/90 to-violet-950/90 border-purple-500/40 text-purple-200',
        };
      case 'Price Drop':
        return {
          icon: <ArrowDownRight className="h-3 w-3 shrink-0 text-cyan-400" />,
          bg: 'bg-gradient-to-r from-cyan-950/90 to-blue-950/90 border-cyan-500/40 text-cyan-200',
        };
      case 'Premium Pick':
        return {
          icon: <Crown className="h-3 w-3 shrink-0 text-yellow-400" />,
          bg: 'bg-gradient-to-r from-slate-900/95 to-yellow-950/80 border-yellow-500/50 text-yellow-200',
        };
      case 'Best Value':
        return {
          icon: <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-400" />,
          bg: 'bg-gradient-to-r from-emerald-900/80 to-slate-900 border-emerald-400/40 text-emerald-200',
        };
      default:
        return {
          icon: <Tag className="h-3 w-3 shrink-0 text-slate-400" />,
          bg: 'bg-slate-800/90 border-slate-700 text-slate-300',
        };
    }
  };

  const { icon, bg } = getBadgeConfig();

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-bold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-black',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs backdrop-blur-xs select-none tracking-wide ${bg} ${sizeClasses} ${className}`}
    >
      {icon}
      <span>{type}</span>
    </span>
  );
};
