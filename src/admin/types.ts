export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'articles'
  | 'buying-guides'
  | 'comparisons'
  | 'affiliate-links'
  | 'ads'
  | 'media'
  | 'newsletter'
  | 'seo'
  | 'analytics'
  | 'comments'
  | 'settings';

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory?: string;
  shortDescription: string;
  longDescription?: string;
  featuredImage: string;
  galleryImages: string[];
  youtubeVideoId?: string;
  rating: number;
  priceRange: string;
  status: 'published' | 'draft';
  isFeatured: boolean;
  pros: string[];
  cons: string[];
  whoShouldBuy: string[];
  whoShouldAvoid: string[];
  specifications: { label: string; value: string }[];
  seoTitle?: string;
  seoDescription?: string;
  affiliateOffers?: { store: string; price: string; url: string }[];
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentCategory?: string;
  categoryIcon: string;
  seoTitle: string;
  seoDescription: string;
  featuredImage?: string;
  productCount: number;
  subcategories?: { id: string; name: string; slug: string }[];
}

export interface AdminArticle {
  id: string;
  title: string;
  slug: string;
  type: 'review' | 'buying_guide' | 'comparison' | 'news';
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  author: string;
  category: string;
  tags: string[];
  featuredImage: string;
  publishedAt: string;
  views: number;
  contentMarkdown?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  ogImage?: string;
  readingTime?: string;
  lastUpdated?: string;
  reviewedBy?: string;
  factCheckedBy?: string;
  editorNotes?: string;
}

export interface AdminBuyingGuide {
  id: string;
  title: string;
  slug: string;
  category: string;
  itemCount: number;
  bestPick: string;
  budgetPick: string;
  status: 'published' | 'draft';
  updatedAt: string;
  author: string;
}

export interface AdminComparison {
  id: string;
  title: string;
  slug: string;
  category: string;
  productA: string;
  productB: string;
  winner: string;
  scoreA: number;
  scoreB: number;
  status: 'published' | 'draft';
  updatedAt: string;
}

export interface AdminComment {
  id: string;
  productSlug: string;
  productName: string;
  author: string;
  email?: string;
  content: string;
  status: 'pending' | 'approved' | 'flagged' | 'spam';
  verifiedBuyer: boolean;
  submittedAt: string;
}

export interface AdminAffiliateOffer {
  id: string;
  productName: string;
  productId: string;
  store: 'Amazon' | 'eBay' | 'AliExpress' | 'Daraz' | 'B&H' | 'Custom';
  affiliateUrl: string;
  price: string;
  oldPrice?: string;
  coupon?: string;
  availability: 'In Stock' | 'Out of Stock' | 'Pre-order';
  buttonText: string;
  isEnabled: boolean;
  clicksCount: number;
  lastChecked: string;
  openInNewTab?: boolean;
  relSponsored?: boolean;
  relNofollow?: boolean;
}

export interface AdminAdSlot {
  id: string;
  name: string;
  location:
    | 'Top Banner'
    | 'Sidebar'
    | 'Inline Ads'
    | 'Footer Ads'
    | 'Mobile Sticky'
    | 'Leaderboard'
    | 'In-content'
    | 'Mobile Banner';
  network: 'Google AdSense' | 'Mediavine' | 'Direct Sponsor' | 'Custom HTML';
  isEnabled: boolean;
  priority: number;
  codeSnippet: string;
  impressions: number;
  clicks?: number;
  ctr: string;
  categoryTargeting?: string;
}

export interface AdminMediaItem {
  id: string;
  name: string;
  url: string;
  size: string;
  type: string;
  uploadedAt: string;
  folder: 'Products' | 'Heroes' | 'Reviews' | 'General';
  format?: 'WebP' | 'AVIF' | 'JPEG' | 'PNG';
  dimensions?: string;
}

export interface AdminSubscriber {
  id: string;
  email: string;
  source: string;
  dateJoined: string;
  status: 'Active' | 'Unsubscribed';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
