export interface SubcategoryItem {
  id: string;
  name: string;
  slug: string;
  badge?: string;
  productCount: number;
}

export interface MegaCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredReview: {
    title: string;
    slug: string;
    score: number;
    image: string;
    price: string;
    merchant: string;
    award: string;
  };
  subcategories: SubcategoryItem[];
  trendingGuides: {
    title: string;
    slug: string;
    readingTime: string;
  }[];
}

export interface SearchResultItem {
  id: string;
  title: string;
  type: 'review' | 'guide' | 'comparison' | 'category';
  category: string;
  rating?: number;
  price?: string;
  slug: string;
  badge?: string;
  merchant?: string;
}
