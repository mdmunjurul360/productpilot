import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/productpilot_db.json');

// -------------------------------------------------------------
// Database Models (UUID, Timestamps, Soft-Delete, Enterprise Tier)
// -------------------------------------------------------------

export interface DbMeta {
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
}

export interface AdminUser extends DbMeta {
  id: string; // UUID
  email: string;
  name: string;
  role: 'super_admin';
  avatar: string;
  passwordHash: string;
  lastLoginAt?: string;
}

export interface NestedCategory extends DbMeta {
  id: string; // UUID
  name: string;
  slug: string;
  description: string;
  parentId?: string | null;
  children?: NestedCategory[];
  icon: string;
  image?: string;
  displayOrder: number;
  seoTitle: string;
  seoDescription: string;
}

export interface Brand extends DbMeta {
  id: string; // UUID
  name: string;
  slug: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
  rating: number;
}

export interface ProductSpecification {
  id: string; // UUID
  group?: string;
  label: string;
  value: string;
}

export interface ProductImage {
  id: string; // UUID
  url: string;
  alt: string;
  caption?: string;
  order: number;
  isPrimary: boolean;
}

export interface BackendProduct extends DbMeta {
  id: string; // UUID
  name: string;
  slug: string;
  brand: string;
  brandId?: string;
  category: string;
  categoryId?: string;
  subcategory?: string;
  shortDescription: string;
  longDescription: string;
  specifications: ProductSpecification[];
  pros: string[];
  cons: string[];
  rating: number;
  priceRange: string;
  featuredImage: string;
  galleryImages: string[];
  images?: ProductImage[];
  youtubeVideoId?: string;
  status: 'published' | 'draft' | 'archived';
  isFeatured: boolean;
  tags: string[];
  whoShouldBuy: string[];
  whoShouldAvoid: string[];
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string[];
  schemaFields?: Record<string, unknown>;
}

export interface BackendAffiliateOffer extends DbMeta {
  id: string; // UUID
  productId: string;
  productName: string;
  store: 'Amazon' | 'eBay' | 'AliExpress' | 'Daraz' | 'Custom';
  affiliateUrl: string;
  buttonText: string;
  country: string;
  priority: number;
  price: string;
  oldPrice?: string;
  discount?: string;
  coupon?: string;
  availability: 'In Stock' | 'Limited Stock' | 'Out of Stock' | 'Pre-order';
  isEnabled: boolean;
  clicksCount: number;
  lastUpdated: string;
}

export interface Author extends DbMeta {
  id: string; // UUID
  name: string;
  role: string;
  bio: string;
  avatar: string;
  email: string;
}

export interface FAQItem extends DbMeta {
  id: string; // UUID
  entityType: 'product' | 'article' | 'guide' | 'global';
  entityId?: string;
  question: string;
  answer: string;
  order: number;
}

export interface BackendArticle extends DbMeta {
  id: string; // UUID
  title: string;
  slug: string;
  type: 'review' | 'buying_guide' | 'comparison' | 'news';
  status: 'published' | 'draft' | 'scheduled' | 'archived';
  contentMarkdown: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  authorId?: string;
  category: string;
  categoryId?: string;
  tags: string[];
  featuredImage: string;
  gallery?: string[];
  tableOfContents?: { id: string; title: string }[];
  faqs?: { question: string; answer: string }[];
  pros?: string[];
  cons?: string[];
  calloutBox?: string;
  readingTime: string;
  publishedAt: string;
  views: number;
  isFeatured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  focusKeyword?: string;
  ogImage?: string;
  lastUpdated?: string;
  reviewedBy?: string;
  factCheckedBy?: string;
  editorNotes?: string;
}

export interface BuyingGuide extends DbMeta {
  id: string; // UUID
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  isFeatured: boolean;
}

export interface ComparisonItem extends DbMeta {
  id: string; // UUID
  title: string;
  slug: string;
  productAId: string;
  productBId: string;
  productAName: string;
  productBName: string;
  verdict: string;
  scoreA: number;
  scoreB: number;
  isFeatured: boolean;
}

export interface BackendAdSlot extends DbMeta {
  id: string; // UUID
  name: string;
  location:
    | 'Header'
    | 'Below Hero'
    | 'Sidebar'
    | 'Inside Article'
    | 'After Paragraph'
    | 'Footer'
    | 'Mobile Sticky'
    | 'Desktop Leaderboard';
  network: 'Google AdSense' | 'Adsterra' | 'Media.net' | 'Custom HTML' | 'Direct Sponsor';
  formatSize: '728x90' | '300x250' | '300x600' | '320x50' | 'responsive';
  codeSnippet: string;
  priority: number;
  isEnabled: boolean;
  categoryScope?: string;
  pageScope?: string;
  impressions: number;
  clicks: number;
  ctr: string;
}

export interface BackendSubscriber extends DbMeta {
  id: string; // UUID
  email: string;
  source: 'Exit Intent Popup' | 'Email Collection Popup' | 'Footer Subscribe' | 'Sidebar Subscribe' | 'Product Review Page';
  dateJoined: string;
  status: 'Active' | 'Unsubscribed';
  name?: string;
}

export interface BackendMediaItem extends DbMeta {
  id: string; // UUID
  name: string;
  url: string;
  size: string;
  format: 'WebP' | 'AVIF' | 'PNG' | 'JPEG';
  folder: 'Products' | 'Heroes' | 'Reviews' | 'General';
  uploadedAt: string;
  dimensions?: string;
}

export interface SEOMetadataItem extends DbMeta {
  id: string; // UUID
  routePath: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  robots: string;
}

export interface BackendSettings {
  siteName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  supportEmail: string;
  contactAddress: string;
  defaultCurrency: string;
  language: string;
  theme: string;
  darkModeDefault: boolean;
  ga4MeasurementId: string;
  gtmContainerId: string;
  affiliateIds: {
    amazon: string;
    ebay: string;
    aliExpress: string;
    daraz: string;
    custom?: string;
  };
  socialLinks: {
    twitter: string;
    youtube: string;
    instagram: string;
    linkedin: string;
    github: string;
  };
  affiliateDisclosure: string;
  maintenanceMode?: {
    enabled: boolean;
    message?: string;
    allowedIps?: string[];
  };
  footerSettings: {
    copyrightText: string;
    showComplianceNotice: boolean;
    uptimeStatus: string;
  };
}

export interface DatabaseSchema {
  admin: AdminUser;
  categories: NestedCategory[];
  brands: Brand[];
  products: BackendProduct[];
  affiliateOffers: BackendAffiliateOffer[];
  articles: BackendArticle[];
  buyingGuides: BuyingGuide[];
  comparisons: ComparisonItem[];
  faqs: FAQItem[];
  ads: BackendAdSlot[];
  subscribers: BackendSubscriber[];
  media: BackendMediaItem[];
  seoMetadata: SEOMetadataItem[];
  authors: Author[];
  settings: BackendSettings;
}

// -------------------------------------------------------------
// Database Engine with Atomic File Persistence & Helper Methods
// -------------------------------------------------------------

class DatabaseStore {
  private data: DatabaseSchema;
  private isSaving = false;

  constructor() {
    this.data = this.loadFromDisk();
  }

  // Properties getters
  public get admin(): AdminUser { return this.data.admin; }
  public get categories(): NestedCategory[] { return this.data.categories; }
  public set categories(v: NestedCategory[]) { this.data.categories = v; this.saveToDisk(); }

  public get brands(): Brand[] { return this.data.brands; }
  public set brands(v: Brand[]) { this.data.brands = v; this.saveToDisk(); }

  public get products(): BackendProduct[] { return this.data.products; }
  public set products(v: BackendProduct[]) { this.data.products = v; this.saveToDisk(); }

  public get affiliateOffers(): BackendAffiliateOffer[] { return this.data.affiliateOffers; }
  public set affiliateOffers(v: BackendAffiliateOffer[]) { this.data.affiliateOffers = v; this.saveToDisk(); }

  public get articles(): BackendArticle[] { return this.data.articles; }
  public set articles(v: BackendArticle[]) { this.data.articles = v; this.saveToDisk(); }

  public get buyingGuides(): BuyingGuide[] { return this.data.buyingGuides; }
  public set buyingGuides(v: BuyingGuide[]) { this.data.buyingGuides = v; this.saveToDisk(); }

  public get comparisons(): ComparisonItem[] { return this.data.comparisons; }
  public set comparisons(v: ComparisonItem[]) { this.data.comparisons = v; this.saveToDisk(); }

  public get faqs(): FAQItem[] { return this.data.faqs; }
  public set faqs(v: FAQItem[]) { this.data.faqs = v; this.saveToDisk(); }

  public get ads(): BackendAdSlot[] { return this.data.ads; }
  public set ads(v: BackendAdSlot[]) { this.data.ads = v; this.saveToDisk(); }

  public get subscribers(): BackendSubscriber[] { return this.data.subscribers; }
  public set subscribers(v: BackendSubscriber[]) { this.data.subscribers = v; this.saveToDisk(); }

  public get media(): BackendMediaItem[] { return this.data.media; }
  public set media(v: BackendMediaItem[]) { this.data.media = v; this.saveToDisk(); }

  public get seoMetadata(): SEOMetadataItem[] { return this.data.seoMetadata; }
  public set seoMetadata(v: SEOMetadataItem[]) { this.data.seoMetadata = v; this.saveToDisk(); }

  public get authors(): Author[] { return this.data.authors; }
  public set authors(v: Author[]) { this.data.authors = v; this.saveToDisk(); }

  public get settings(): BackendSettings { return this.data.settings; }
  public set settings(v: BackendSettings) { this.data.settings = v; this.saveToDisk(); }

  public getAllData(): DatabaseSchema {
    return JSON.parse(JSON.stringify(this.data));
  }

  public restoreAllData(newData: DatabaseSchema) {
    this.data = newData;
    this.saveToDisk();
  }

  // Safe Atomic Persistence
  public saveToDisk() {
    if (this.isSaving) {
      console.warn('Concurrent saveToDisk called. Processing synchronously.');
    }
    this.isSaving = true;
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const tmpFile = `${DATA_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DATA_FILE);
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    } finally {
      this.isSaving = false;
    }
  }

  private loadFromDisk(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.products && parsed.categories) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read existing database file, initializing seeds:', err);
    }
    const initial = this.generateInitialSeeds();
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    } catch (err) {
      console.error('Could not write initial seed data:', err);
    }
    return initial;
  }

  // -------------------------------------------------------------
  // Seed Generator
  // -------------------------------------------------------------
  private generateInitialSeeds(): DatabaseSchema {
    const now = new Date().toISOString();
    return {
      admin: {
        id: crypto.randomUUID(),
        email: 'admin@productpilot.com',
        name: 'Sarah Jenkins',
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        passwordHash: '', // Verified via environment variable in auth router
        createdAt: now,
        updatedAt: now,
      },
      brands: [
        {
          id: crypto.randomUUID(),
          name: 'Sony',
          slug: 'sony',
          logoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80',
          websiteUrl: 'https://sony.com',
          description: 'Pioneering consumer audio, imaging, and sensory engineering.',
          rating: 9.6,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: crypto.randomUUID(),
          name: 'Apple',
          slug: 'apple',
          logoUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&auto=format&fit=crop&q=80',
          websiteUrl: 'https://apple.com',
          description: 'Premium silicon architecture, computing hardware, and mobile devices.',
          rating: 9.8,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: crypto.randomUUID(),
          name: 'Bose',
          slug: 'bose',
          logoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=100&auto=format&fit=crop&q=80',
          websiteUrl: 'https://bose.com',
          description: 'Industry benchmark acoustic engineering and spatial audio.',
          rating: 9.3,
          createdAt: now,
          updatedAt: now,
        },
      ],
      categories: [
        {
          id: 'cat-electronics',
          name: 'Electronics',
          slug: 'electronics',
          description: 'Consumer audio, visual displays, computers, and photography.',
          icon: 'Tv',
          displayOrder: 1,
          seoTitle: 'Best Consumer Electronics & Audio - ProductPilot',
          seoDescription: 'Lab-tested audio, visual, and personal tech.',
          createdAt: now,
          updatedAt: now,
          children: [
            {
              id: 'cat-audio',
              name: 'Audio & Visual',
              slug: 'audio-visual',
              parentId: 'cat-electronics',
              description: 'Audiophile headphones, true wireless earbuds, soundbars.',
              icon: 'Headphones',
              displayOrder: 1,
              seoTitle: 'Best Audio, Headphones & Acoustics 2026',
              seoDescription: 'Acoustically calibrated noise-canceling headphones and soundbars.',
              createdAt: now,
              updatedAt: now,
              children: [
                {
                  id: 'cat-anc-headphones',
                  name: 'Noise-Canceling Headphones',
                  slug: 'anc-headphones',
                  parentId: 'cat-audio',
                  description: 'Active noise cancellation headphones tested in anechoic chambers.',
                  icon: 'Headphones',
                  displayOrder: 1,
                  seoTitle: 'Best ANC Headphones 2026',
                  seoDescription: 'Lab tested noise reduction attenuation curves.',
                  createdAt: now,
                  updatedAt: now,
                },
                {
                  id: 'cat-tws-earbuds',
                  name: 'True Wireless Earbuds',
                  slug: 'true-wireless-earbuds',
                  parentId: 'cat-audio',
                  description: 'In-ear ergonomic monitors with transparency mode and spatial tracking.',
                  icon: 'Disc',
                  displayOrder: 2,
                  seoTitle: 'Top Rated True Wireless Earbuds 2026',
                  seoDescription: 'Tested for IPX waterproof ratings, microphone clarity, and drivers.',
                  createdAt: now,
                  updatedAt: now,
                },
              ],
            },
            {
              id: 'cat-computing',
              name: 'Computing & Productivity',
              slug: 'computing-productivity',
              parentId: 'cat-electronics',
              description: 'Pro creator laptops, custom mechanical keyboards, high-DPI mice.',
              icon: 'Laptop',
              displayOrder: 2,
              seoTitle: 'Pro Laptops & Workstations - ProductPilot',
              seoDescription: 'Thermal throttling benchmarks and color accuracy displays.',
              createdAt: now,
              updatedAt: now,
            },
          ],
        },
        {
          id: 'cat-home-appliances',
          name: 'Home & Kitchen',
          slug: 'home-kitchen',
          description: 'Smart cleaning robots, automated espresso machines, air fryers.',
          icon: 'Home',
          displayOrder: 2,
          seoTitle: 'Best Smart Home & Kitchen Appliances',
          seoDescription: 'Real-world testing for durability and energy efficiency.',
          createdAt: now,
          updatedAt: now,
          children: [
            {
              id: 'cat-robot-vacuums',
              name: 'Robotic Vacuums & Mops',
              slug: 'robot-vacuums',
              parentId: 'cat-home-appliances',
              description: 'LiDAR mapping, obstacle avoidance, self-emptying dock stations.',
              icon: 'Cpu',
              displayOrder: 1,
              seoTitle: 'Best Robot Vacuums Tested 2026',
              seoDescription: 'Debris pickup efficiency on deep pile carpets and pet hair.',
              createdAt: now,
              updatedAt: now,
            },
          ],
        },
      ],
      products: [
        {
          id: 'prod-sony-xm5',
          name: 'Sony WH-1000XM5 Noise-Canceling Headphones',
          slug: 'sony-wh-1000xm5',
          brand: 'Sony',
          category: 'Audio & Visual',
          subcategory: 'Noise-Canceling Headphones',
          shortDescription:
            'The reigning industry champion for acoustic active noise cancellation, custom 30mm carbon composite drivers, and pristine 8-microphone voice pickup.',
          longDescription:
            'Sony WH-1000XM5 redefines premium wireless travel audio. Featuring dual processors (V1 + QN1) controlling eight precision microphones, it achieves unprecedented mid-and-high frequency noise attenuation, silencing airplane cabin roar and bustling cafe chatter alike.',
          rating: 9.6,
          priceRange: '$398.00 - $449.99',
          featuredImage:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
          ],
          youtubeVideoId: 'dQw4w9WgXcQ',
          status: 'published',
          isFeatured: true,
          tags: ['ANC', 'Travel', 'Wireless', 'Audiophile', 'Bluetooth 5.2', 'LDAC'],
          specifications: [
            { id: crypto.randomUUID(), group: 'Acoustics', label: 'Driver Size', value: '30mm Carbon Fiber Composite' },
            { id: crypto.randomUUID(), group: 'Acoustics', label: 'Frequency Response', value: '4 Hz - 40,000 Hz (LDAC)' },
            { id: crypto.randomUUID(), group: 'Battery', label: 'Battery Life', value: '30 Hours (ANC On) / 40 Hours (ANC Off)' },
            { id: crypto.randomUUID(), group: 'Battery', label: 'Fast Charge', value: '3 min = 3 hours playback (USB-PD)' },
            { id: crypto.randomUUID(), group: 'Physical', label: 'Weight', value: '250 grams (8.8 oz)' },
            { id: crypto.randomUUID(), group: 'Connectivity', label: 'Codecs Supported', value: 'LDAC, AAC, SBC' },
            { id: crypto.randomUUID(), group: 'Connectivity', label: 'Bluetooth Version', value: '5.2 with Multipoint' },
          ],
          pros: [
            'Class-leading active noise cancellation targeting voice & mid frequencies',
            'Incredible 30-hour battery stamina with ultra-fast USB-PD charge',
            'Featherweight 250g chassis with soft-fit synthetic leather headband',
            'Remarkable 8-mic beamforming array with AI wind suppression',
          ],
          cons: [
            'Non-folding headband footprint requires slightly larger travel case',
            'No official IP water resistance rating for heavy rainfall workouts',
          ],
          whoShouldBuy: [
            'Frequent fliers and daily public transit commuters',
            'Remote knowledge workers requiring crystal-clear Zoom calls',
            'Audiophiles seeking Hi-Res LDAC wireless streaming',
          ],
          whoShouldAvoid: [
            'Gym goers seeking IPX7 waterproof sweat resistance',
            'Ultralight backpackers demanding folding collapsible hinges',
          ],
          seoTitle: 'Sony WH-1000XM5 Review: The Undisputed ANC King of 2026',
          seoDescription:
            'In-depth laboratory review of the Sony WH-1000XM5. Frequency response curves, 30-hour battery verification, and direct comparison to Bose QuietComfort Ultra.',
          metaKeywords: ['Sony WH-1000XM5', 'ANC Headphones Review', 'Noise Canceling', 'Best Travel Headphones'],
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'prod-macbook-pro-16',
          name: 'Apple MacBook Pro 16" (M4 Max)',
          slug: 'apple-macbook-pro-16-m4-max',
          brand: 'Apple',
          category: 'Computing & Productivity',
          subcategory: 'Pro Laptops',
          shortDescription:
            'Unrivaled workstation computing performance, 128GB unified memory support, Liquid Retina XDR display, and 22-hour battery life.',
          longDescription:
            'Built for 8K video rendering, large language model inference on device, and architectural simulations. The M4 Max features a 16-core CPU, 40-core GPU, and Thunderbolt 5 ports with up to 120 Gbps bandwidth.',
          rating: 9.8,
          priceRange: '$3,499.00 - $4,299.00',
          featuredImage:
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
          ],
          status: 'published',
          isFeatured: true,
          tags: ['Apple', 'M4 Max', 'Laptop', 'Workstation', 'Liquid Retina XDR'],
          specifications: [
            { id: crypto.randomUUID(), group: 'Performance', label: 'Chipset', value: 'Apple M4 Max (16-core CPU, 40-core GPU)' },
            { id: crypto.randomUUID(), group: 'Memory', label: 'Unified Memory', value: 'Up to 128GB Unified RAM (546 GB/s)' },
            { id: crypto.randomUUID(), group: 'Display', label: 'Screen', value: '16.2" Liquid Retina XDR (1600 nits peak)' },
            { id: crypto.randomUUID(), group: 'Battery', label: 'Battery Run Time', value: 'Up to 22 Hours Web/Video' },
          ],
          pros: [
            'Supreme multi-threaded computing without throttling on battery power',
            'Industry benchmark 1600-nit Liquid Retina XDR display',
            'Whisper-quiet thermals even under sustained multi-core compilation',
          ],
          cons: ['High capital investment for top-tier memory configurations', 'Slightly heavier chassis at 4.7 lbs'],
          whoShouldBuy: ['Software engineers training local LLMs', '8K colorists & video editors'],
          whoShouldAvoid: ['Casual web browsers and document writers'],
          seoTitle: 'Apple MacBook Pro 16 M4 Max Review (2026): Pure Silicon Dominance',
          seoDescription:
            'Lab benchmarks and thermal tests on the Apple MacBook Pro 16 M4 Max. Cinebench, Blender, and Final Cut Pro render results.',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'prod-roborock-s8',
          name: 'Roborock S8 Pro Ultra Robot Vacuum',
          slug: 'roborock-s8-pro-ultra',
          brand: 'Roborock',
          category: 'Home & Kitchen',
          subcategory: 'Robotic Vacuums & Mops',
          shortDescription:
            'Zero-maintenance automated floor cleaning with 6000Pa dual-roller suction, self-washing & hot-air drying mop dock.',
          longDescription:
            'The Roborock S8 Pro Ultra automates household maintenance. Reactive 3D obstacle avoidance navigates cords and pet toys with ease, while the VibraRise 2.0 dual sonic vibration module scrubs dried stains at 3000 passes per minute.',
          rating: 9.5,
          priceRange: '$1,199.99 - $1,399.99',
          featuredImage:
            'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
          galleryImages: [
            'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
          ],
          status: 'published',
          isFeatured: true,
          tags: ['Robot Vacuum', 'Smart Home', 'LiDAR', 'Roborock', 'Mopping'],
          specifications: [
            { id: crypto.randomUUID(), group: 'Suction', label: 'Max Suction Power', value: '6,000 Pa HyperForce' },
            { id: crypto.randomUUID(), group: 'Mopping', label: 'Sonic Scrubbing', value: '3,000 vibrations/min (VibraRise 2.0)' },
            { id: crypto.randomUUID(), group: 'Docking', label: 'RockDock Ultra', value: 'Auto Mop Wash, Hot Air Dry, Auto Dust Empty' },
          ],
          pros: [
            'Dual DuoRoller brushes virtually eliminate tangled pet hair',
            'Hot air dock drying stops mildew odor completely',
            'Remarkable LiDAR millimeter mapping speed',
          ],
          cons: ['Large dock requires dedicated floor footprint near an outlet'],
          whoShouldBuy: ['Pet owners battling shedding coats', 'Busy families with hardwood and tile floors'],
          whoShouldAvoid: ['Apartments with wall-to-wall shag shag carpeting only'],
          seoTitle: 'Roborock S8 Pro Ultra Review: Ultimate Hands-Off Cleaning',
          seoDescription: 'Tested on pet hair, hardwood cereal spills, and dried coffee stains.',
          createdAt: now,
          updatedAt: now,
        },
      ],
      affiliateOffers: [
        {
          id: 'aff-sony-amz',
          productId: 'prod-sony-xm5',
          productName: 'Sony WH-1000XM5',
          store: 'Amazon',
          affiliateUrl: 'https://amazon.com/dp/B09XS7JWHH?tag=pilot-20',
          buttonText: 'Check Prime Price on Amazon',
          country: 'US',
          priority: 1,
          price: '$398.00',
          oldPrice: '$449.99',
          discount: '12% OFF',
          availability: 'In Stock',
          isEnabled: true,
          clicksCount: 1420,
          lastUpdated: '12 mins ago',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'aff-sony-ebay',
          productId: 'prod-sony-xm5',
          productName: 'Sony WH-1000XM5',
          store: 'eBay',
          affiliateUrl: 'https://ebay.com/itm/sony-wh-1000xm5?campid=533890123',
          buttonText: 'View Certified Refurbished on eBay',
          country: 'US',
          priority: 2,
          price: '$329.99',
          oldPrice: '$398.00',
          discount: '17% OFF',
          coupon: 'SAVE15TECH',
          availability: 'In Stock',
          isEnabled: true,
          clicksCount: 812,
          lastUpdated: '45 mins ago',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'aff-sony-ali',
          productId: 'prod-sony-xm5',
          productName: 'Sony WH-1000XM5',
          store: 'AliExpress',
          affiliateUrl: 'https://aliexpress.com/item/1005004382.html?aff_fcid=pilot-ali',
          buttonText: 'Global Shipping on AliExpress',
          country: 'Global',
          priority: 3,
          price: '$365.00',
          availability: 'Limited Stock',
          isEnabled: true,
          clicksCount: 341,
          lastUpdated: '2 hours ago',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'aff-sony-daraz',
          productId: 'prod-sony-xm5',
          productName: 'Sony WH-1000XM5',
          store: 'Daraz',
          affiliateUrl: 'https://daraz.pk/products/sony-wh-1000xm5-i123.html?aff=pilot-daraz-global',
          buttonText: 'Official Sony Flagship on Daraz',
          country: 'PK/BD',
          priority: 4,
          price: 'Rs. 98,500',
          availability: 'In Stock',
          isEnabled: true,
          clicksCount: 189,
          lastUpdated: '4 hours ago',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'aff-mac-amz',
          productId: 'prod-macbook-pro-16',
          productName: 'Apple MacBook Pro 16 (M4 Max)',
          store: 'Amazon',
          affiliateUrl: 'https://amazon.com/dp/B0DKX9?tag=pilot-20',
          buttonText: 'Order on Amazon Prime',
          country: 'US',
          priority: 1,
          price: '$3,499.00',
          availability: 'In Stock',
          isEnabled: true,
          clicksCount: 940,
          lastUpdated: 'Just now',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'aff-roborock-amz',
          productId: 'prod-roborock-s8',
          productName: 'Roborock S8 Pro Ultra',
          store: 'Amazon',
          affiliateUrl: 'https://amazon.com/dp/B0BWM?tag=pilot-20',
          buttonText: 'Check Amazon Deal ($200 Coupon)',
          country: 'US',
          priority: 1,
          price: '$1,199.99',
          oldPrice: '$1,399.99',
          discount: '$200 OFF',
          availability: 'In Stock',
          isEnabled: true,
          clicksCount: 654,
          lastUpdated: '10 mins ago',
          createdAt: now,
          updatedAt: now,
        },
      ],
      articles: [
        {
          id: 'art-headphones-roundup-2026',
          title: 'The Best Noise-Canceling Headphones for Travel and Work in 2026',
          slug: 'best-noise-canceling-headphones-travel-work',
          type: 'buying_guide',
          status: 'published',
          excerpt:
            'After 450 hours of testing across 28 leading pairs on long-haul flights and loud open-plan offices, here are the clear winners.',
          contentMarkdown: `## How We Tested

We logged over **450 hours** testing active noise cancellation in our dedicated sound dampening chamber and inside Boeing 787 pressurized cabins. We measured:

1. **Low-Frequency Attenuation (20 Hz - 250 Hz)**: Jet turbine drone and subway rumble.
2. **Speech Isolation (500 Hz - 3 kHz)**: Coworker banter and cafe chatter.
3. **Earcup Clamp Pressure**: Pressure distribution in grams over an 8-hour shift.

### Our Top Pick: Sony WH-1000XM5
The Sony WH-1000XM5 delivers the most seamless balance of acoustic attenuation, call clarity, and battery stamina.

### The Runner-Up: Bose QuietComfort Ultra
If extreme physical folding portability and deep-sub bass punch are your top criteria, Bose QuietComfort Ultra is our recommendation.`,
          author: {
            name: 'Dr. Marcus Vance',
            role: 'Lead Acoustics Testing Engineer',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          },
          category: 'Audio & Visual',
          tags: ['Headphones', 'ANC', 'Travel', 'Buying Guide', 'Sony', 'Bose'],
          featuredImage:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          readingTime: '12 min read',
          publishedAt: '2026-03-24',
          views: 18450,
          isFeatured: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      buyingGuides: [
        {
          id: crypto.randomUUID(),
          title: 'Best Noise-Canceling Headphones of 2026',
          slug: 'best-anc-headphones-travel',
          excerpt: 'Tested for flight comfort, decibel reduction, and microphone clarity.',
          content: 'Full editorial methodology and testing breakdowns.',
          category: 'Audio & Visual',
          author: 'Dr. Marcus Vance',
          readTime: '14 min read',
          isFeatured: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: crypto.randomUUID(),
          title: 'Best Robot Vacuums for Pet Hair & Hardwood Floors',
          slug: 'best-robot-vacuums-pet-hair',
          excerpt: 'From budget options under $300 to self-drying mop stations.',
          content: 'Detailed lab pickup tests.',
          category: 'Home & Kitchen',
          author: 'Elena Rostova',
          readTime: '11 min read',
          isFeatured: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      comparisons: [
        {
          id: crypto.randomUUID(),
          title: 'Sony WH-1000XM5 vs Bose QuietComfort Ultra',
          slug: 'sony-wh-1000xm5-vs-bose-qc-ultra',
          productAId: 'prod-sony-xm5',
          productBId: 'prod-bose-ultra',
          productAName: 'Sony WH-1000XM5',
          productBName: 'Bose QuietComfort Ultra',
          verdict: 'Sony wins on battery life and microphone fidelity; Bose wins on folding portability.',
          scoreA: 9.6,
          scoreB: 9.3,
          isFeatured: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      faqs: [
        {
          id: crypto.randomUUID(),
          entityType: 'product',
          entityId: 'prod-sony-xm5',
          question: 'Does the Sony WH-1000XM5 support high-resolution audio over Bluetooth?',
          answer: 'Yes, it natively supports Sony LDAC codec transferring up to 990 kbps at 24-bit/96kHz on compatible Android and digital audio player sources.',
          order: 1,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: crypto.randomUUID(),
          entityType: 'product',
          entityId: 'prod-sony-xm5',
          question: 'Can the internal battery be replaced by the user?',
          answer: 'The battery is internal lithium-ion. While not tool-free swappable, Sony Authorized Service Centers provide official battery replacements.',
          order: 2,
          createdAt: now,
          updatedAt: now,
        },
      ],
      ads: [
        {
          id: 'ad-header-billboard',
          name: 'Global Header Leaderboard',
          location: 'Desktop Leaderboard',
          network: 'Google AdSense',
          formatSize: '728x90',
          codeSnippet: '<!-- Google AdSense Responsive Leaderboard Container 728x90 -->',
          priority: 1,
          isEnabled: true,
          categoryScope: 'all',
          pageScope: 'all',
          impressions: 142800,
          clicks: 2940,
          ctr: '2.06%',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'ad-sidebar-rect',
          name: 'Sidebar Medium Rectangle',
          location: 'Sidebar',
          network: 'Direct Sponsor',
          formatSize: '300x250',
          codeSnippet: '<!-- Contextual Technology Hardware Partner Placement 300x250 -->',
          priority: 1,
          isEnabled: true,
          categoryScope: 'all',
          pageScope: 'reviews',
          impressions: 98400,
          clicks: 1890,
          ctr: '1.92%',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'ad-in-content',
          name: 'In-Article Responsive Banner',
          location: 'Inside Article',
          network: 'Media.net',
          formatSize: 'responsive',
          codeSnippet: '<!-- Contextual Media.net Native Placement -->',
          priority: 2,
          isEnabled: true,
          categoryScope: 'all',
          pageScope: 'all',
          impressions: 78100,
          clicks: 1420,
          ctr: '1.82%',
          createdAt: now,
          updatedAt: now,
        },
      ],
      subscribers: [
        {
          id: crypto.randomUUID(),
          email: 'alex.rivera@techreviewdaily.com',
          source: 'Exit Intent Popup',
          dateJoined: '2026-03-20',
          status: 'Active',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: crypto.randomUUID(),
          email: 'claire.audio@soundlab.io',
          source: 'Product Review Page',
          dateJoined: '2026-03-24',
          status: 'Active',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: crypto.randomUUID(),
          email: 'mark.dev@siliconpost.com',
          source: 'Footer Subscribe',
          dateJoined: '2026-03-28',
          status: 'Active',
          createdAt: now,
          updatedAt: now,
        },
      ],
      media: [
        {
          id: 'med-sony-1',
          name: 'sony_wh1000xm5_studio_hero.webp',
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          size: '142 KB',
          format: 'WebP',
          folder: 'Products',
          dimensions: '1920x1080',
          uploadedAt: '2026-03-15',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'med-sony-2',
          name: 'sony_xm5_earcup_detail.webp',
          url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
          size: '188 KB',
          format: 'WebP',
          folder: 'Products',
          dimensions: '1920x1080',
          uploadedAt: '2026-03-15',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 'med-macbook',
          name: 'macbook_pro_16_m4.webp',
          url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
          size: '210 KB',
          format: 'WebP',
          folder: 'Products',
          dimensions: '2048x1365',
          uploadedAt: '2026-03-18',
          createdAt: now,
          updatedAt: now,
        },
      ],
      seoMetadata: [
        {
          id: crypto.randomUUID(),
          routePath: '/',
          metaTitle: 'ProductPilot — Discover Better Products. Buy Smarter.',
          metaDescription:
            'ProductPilot is a premier product discovery, in-depth editorial reviews, buying guides, and smart comparison platform connecting shoppers with top-tier gear across Amazon, eBay, AliExpress, and Daraz.',
          canonicalUrl: 'https://productpilot.com/',
          ogTitle: 'ProductPilot — Discover Better Products. Buy Smarter.',
          ogDescription: 'Lab tested product reviews, buying guides, and smart multi-merchant comparisons.',
          ogImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
          twitterCard: 'summary_large_image',
          robots: 'index, follow',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: crypto.randomUUID(),
          routePath: '/reviews/sony-wh-1000xm5',
          metaTitle: 'Sony WH-1000XM5 Review (2026) — The Undisputed ANC King',
          metaDescription:
            'Acoustically calibrated active noise cancellation tests, battery duration discharge metrics, and multi-merchant store comparison.',
          canonicalUrl: 'https://productpilot.com/reviews/sony-wh-1000xm5',
          ogTitle: 'Sony WH-1000XM5 In-Depth Review — ProductPilot Labs',
          ogDescription: 'Overall Score: 9.6/10. Read our lab findings and store buy box comparisons.',
          ogImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
          twitterCard: 'summary_large_image',
          robots: 'index, follow',
          createdAt: now,
          updatedAt: now,
        },
      ],
      authors: [
        {
          id: crypto.randomUUID(),
          name: 'Sarah Jenkins',
          role: 'Editor in Chief & Senior Hardware Analyst',
          bio: 'Former senior reviewer with 12 years analyzing consumer electronics and ergonomics.',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          email: 'sarah.jenkins@productpilot.com',
          createdAt: now,
          updatedAt: now,
        },
        {
          id: crypto.randomUUID(),
          name: 'Dr. Marcus Vance',
          role: 'Lead Acoustics Testing Engineer',
          bio: 'PhD in Acoustic Physics. Oversees headphone, earbud, and soundbar chamber evaluations.',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
          email: 'marcus.vance@productpilot.com',
          createdAt: now,
          updatedAt: now,
        },
      ],
      settings: {
        siteName: 'ProductPilot',
        tagline: 'Discover Better Products. Buy Smarter.',
        logoUrl: '/logo.svg',
        faviconUrl: '/favicon.ico',
        supportEmail: 'editorial@productpilot.com',
        contactAddress: 'ProductPilot Labs, 450 Technology Parkway, Suite 800, San Francisco, CA',
        defaultCurrency: 'USD',
        language: 'en-US',
        theme: 'luxury-slate',
        darkModeDefault: false,
        ga4MeasurementId: 'G-PILOT2026XX',
        gtmContainerId: 'GTM-PILOT98',
        affiliateIds: {
          amazon: 'pilot-20',
          ebay: '533890123',
          aliExpress: 'pilot-ali',
          daraz: 'pilot-daraz-global',
          custom: 'pilot-direct',
        },
        socialLinks: {
          twitter: 'https://twitter.com/ProductPilotLab',
          youtube: 'https://youtube.com/@ProductPilotLab',
          instagram: 'https://instagram.com/productpilot',
          linkedin: 'https://linkedin.com/company/productpilot',
          github: 'https://github.com/productpilot',
        },
        affiliateDisclosure:
          'ProductPilot participates in various affiliate marketing programs, including the Amazon Services LLC Associates Program, the eBay Partner Network (EPN), AliExpress Affiliate Program, and Daraz Affiliate Network. When you purchase through our links, we may earn an affiliate commission at no additional cost to you.',
        footerSettings: {
          copyrightText: '© 2026 ProductPilot Inc. All rights reserved.',
          showComplianceNotice: true,
          uptimeStatus: '99.98% Uptime SLA',
        },
      },
    };
  }
}

export const db = new DatabaseStore();
