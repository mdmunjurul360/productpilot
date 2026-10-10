import { z } from 'zod';

// UUID / Slug helpers
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const CategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(100),
  slug: z.string().regex(slugRegex, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().max(500).optional().default(''),
  parentId: z.string().nullable().optional(),
  icon: z.string().default('Layers'),
  image: z.string().url().optional().or(z.literal('')),
  displayOrder: z.number().int().optional().default(0),
  seoTitle: z.string().max(120).optional(),
  seoDescription: z.string().max(250).optional(),
});

export const ProductSpecificationSchema = z.object({
  group: z.string().optional().default('General'),
  label: z.string().min(1, 'Specification label required'),
  value: z.string().min(1, 'Specification value required'),
});

export const ProductSchema = z.object({
  name: z.string().min(2, 'Product name required').max(150),
  slug: z.string().regex(slugRegex, 'Slug must be lowercase alphanumeric with hyphens'),
  brand: z.string().min(1, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional().default(''),
  shortDescription: z.string().min(10, 'Short description should be at least 10 characters'),
  longDescription: z.string().optional().default(''),
  specifications: z.array(ProductSpecificationSchema).optional().default([]),
  pros: z.array(z.string()).optional().default([]),
  cons: z.array(z.string()).optional().default([]),
  rating: z.number().min(0).max(10).default(9.0),
  priceRange: z.string().optional().default('$299 - $399'),
  featuredImage: z.string().url('Featured image must be a valid URL'),
  galleryImages: z.array(z.string().url()).optional().default([]),
  youtubeVideoId: z.string().optional().default(''),
  status: z.enum(['published', 'draft', 'archived']).default('published'),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).optional().default([]),
  whoShouldBuy: z.array(z.string()).optional().default([]),
  whoShouldAvoid: z.array(z.string()).optional().default([]),
  seoTitle: z.string().max(120).optional(),
  seoDescription: z.string().max(250).optional(),
  metaKeywords: z.array(z.string()).optional().default([]),
  schemaFields: z.record(z.string(), z.unknown()).optional().default({}),
});

export const AffiliateOfferSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  productName: z.string().min(1, 'Product name is required'),
  store: z.enum(['Amazon', 'eBay', 'AliExpress', 'Daraz', 'Custom']),
  affiliateUrl: z.string().url('Valid affiliate URL required'),
  buttonText: z.string().min(1).default('Buy Now'),
  country: z.string().min(2).max(4).default('US'),
  priority: z.number().int().min(1).max(100).default(1),
  price: z.string().min(1, 'Price is required'),
  oldPrice: z.string().optional(),
  discount: z.string().optional(),
  coupon: z.string().optional(),
  availability: z.enum(['In Stock', 'Limited Stock', 'Out of Stock', 'Pre-order']).default('In Stock'),
  isEnabled: z.boolean().default(true),
});

export const ArticleSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  slug: z.string().regex(slugRegex, 'Slug must be lowercase alphanumeric with hyphens'),
  type: z.enum(['review', 'buying_guide', 'comparison', 'news']).default('review'),
  status: z.enum(['published', 'draft', 'scheduled', 'archived']).default('published'),
  contentMarkdown: z.string().min(10, 'Content must contain markdown body'),
  excerpt: z.string().max(300).default(''),
  author: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
  }).default({
    name: 'Editorial Team',
    role: 'Staff Writer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  }),
  category: z.string().default('Audio & Visual'),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().url().default('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'),
  gallery: z.array(z.string()).optional(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
  calloutBox: z.string().optional(),
  readingTime: z.string().default('8 min read'),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().url().optional().or(z.literal('')),
  focusKeyword: z.string().optional(),
  ogImage: z.string().url().optional().or(z.literal('')),
  lastUpdated: z.string().optional(),
  reviewedBy: z.string().optional(),
  factCheckedBy: z.string().optional(),
  editorNotes: z.string().optional(),
});

export const AdSlotSchema = z.object({
  name: z.string().min(2, 'Ad slot name required'),
  location: z.enum([
    'Header',
    'Below Hero',
    'Sidebar',
    'Inside Article',
    'After Paragraph',
    'Footer',
    'Mobile Sticky',
    'Desktop Leaderboard',
  ]),
  network: z.enum(['Google AdSense', 'Adsterra', 'Media.net', 'Custom HTML', 'Direct Sponsor']),
  formatSize: z.enum(['728x90', '300x250', '300x600', '320x50', 'responsive']).default('728x90'),
  codeSnippet: z.string().default(''),
  priority: z.number().int().min(1).max(10).default(1),
  isEnabled: z.boolean().default(true),
  categoryScope: z.string().optional().default('all'),
  pageScope: z.string().optional().default('all'),
});

export const NewsletterSubscribeSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  source: z.enum([
    'Exit Intent Popup',
    'Email Collection Popup',
    'Footer Subscribe',
    'Sidebar Subscribe',
    'Product Review Page',
  ]).default('Footer Subscribe'),
  name: z.string().optional(),
});

export const MediaUploadSchema = z.object({
  name: z.string().min(1, 'File name required'),
  url: z.string().url('File URL required'),
  size: z.string().default('150 KB'),
  format: z.enum(['WebP', 'AVIF', 'PNG', 'JPEG']).default('WebP'),
  folder: z.enum(['Products', 'Heroes', 'Reviews', 'General']).default('Products'),
  dimensions: z.string().optional(),
});

export const SettingsSchema = z.object({
  siteName: z.string().min(2),
  tagline: z.string(),
  logoUrl: z.string(),
  faviconUrl: z.string(),
  supportEmail: z.string().email(),
  contactAddress: z.string(),
  defaultCurrency: z.string(),
  language: z.string(),
  defaultTheme: z.enum(['light', 'dark', 'system']),
  analyticsGoogleId: z.string().optional(),
  affiliateIds: z.object({
    amazon: z.string().default('productpilot-20'),
    ebay: z.string().default('productpilot-ebay-2026'),
    aliexpress: z.string().default('pp_ali_9921'),
    daraz: z.string().default('pp_daraz_aff_01'),
    custom: z.string().default('pp_direct'),
  }),
  socialLinks: z.object({
    x: z.string().default('https://x.com/productpilot'),
    youtube: z.string().default('https://youtube.com/@productpilot'),
    instagram: z.string().default('https://instagram.com/productpilot'),
    linkedin: z.string().default('https://linkedin.com/company/productpilot'),
    github: z.string().default('https://github.com/productpilot'),
  }),
  legalNotice: z.string().optional(),
  cookieBannerText: z.string().optional(),
});
