import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import {
  db,
  BackendProduct,
  BackendAffiliateOffer,
  BackendArticle,
  BackendAdSlot,
  BackendMediaItem,
  NestedCategory,
  BuyingGuide,
  ComparisonItem,
  FAQItem,
  Brand,
  SEOMetadataItem,
} from './db';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  createRateLimiter,
  requireAdminAuth,
  sanitizeInput,
} from './security';
import {
  LoginSchema,
  ProductSchema,
  CategorySchema,
  ArticleSchema,
  AffiliateOfferSchema,
  AdSlotSchema,
  NewsletterSubscribeSchema,
  MediaUploadSchema,
  SettingsSchema,
} from './validators';
import { logger } from './logger';
import { emailService } from './email';
import { backupService } from './backup';
import { dbAuditor } from './dbAudit';
import { config, validateEnvironment } from './config';

export const apiRouter = Router();

let frontendSyncCache: any = null;

apiRouter.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    frontendSyncCache = null;
  }
  next();
});

// Rate Limiters
const loginLimiter = createRateLimiter(6, 15 * 60 * 1000); // 6 attempts per 15 mins
const newsletterLimiter = createRateLimiter(5, 60 * 1000); // 5 per min
const writeLimiter = createRateLimiter(60, 60 * 1000); // 60 writes per min

// ----------------------------------------------------
// 1. Admin Authentication API
// ----------------------------------------------------
apiRouter.post('/auth/login', loginLimiter, (req: Request, res: Response) => {
  const parseResult = LoginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid input credentials',
    });
  }

  const { email, password, rememberMe } = parseResult.data;
  const cleanEmail = email.toLowerCase().trim();

  // Admin Master Credentials
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@productpilot.com').toLowerCase();
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

  const isValidEmail = cleanEmail === ADMIN_EMAIL || cleanEmail.includes('admin@productpilot');
  const isValidPass = ADMIN_PASSWORD_HASH && ADMIN_PASSWORD_HASH.includes(':') 
    ? verifyPassword(password, ADMIN_PASSWORD_HASH)
    : false;

  if (!isValidEmail || !isValidPass) {
    return res.status(401).json({
      success: false,
      error: 'Invalid administrator credentials.',
    });
  }

  // Token valid for 30 days if rememberMe, else 24 hours
  const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  const exp = Date.now() + duration;

  const token = createSessionToken({
    email: cleanEmail,
    role: 'super_admin',
    exp,
  });

  // Set HTTP-Only Secure Cookie
  res.cookie('productpilot_admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: duration,
    path: '/',
  });

  return res.json({
    success: true,
    user: {
      name: 'Sarah Jenkins',
      email: cleanEmail,
      role: 'Super Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
  });
});

apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('productpilot_admin_session', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const token = req.cookies?.productpilot_admin_session;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  return res.json({
    authenticated: true,
    user: {
      name: 'Sarah Jenkins',
      email: 'admin@productpilot.com',
      role: 'Super Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
  });
});

// ----------------------------------------------------
// 2. Products API (Public Read / Admin CRUD)
// ----------------------------------------------------
apiRouter.get('/products', (req: Request, res: Response) => {
  const { category, brand, query, status, featured, includeDeleted } = req.query;
  let items = [...db.products];

  // Soft delete filter
  if (includeDeleted !== 'true') {
    items = items.filter((p) => !p.isDeleted);
  }

  if (status && status !== 'all') {
    items = items.filter((p) => p.status === status);
  }
  if (featured === 'true') {
    items = items.filter((p) => p.isFeatured);
  }
  if (category && category !== 'all') {
    const catLower = String(category).toLowerCase();
    items = items.filter(
      (p) =>
        p.category.toLowerCase().includes(catLower) ||
        (p.subcategory && p.subcategory.toLowerCase().includes(catLower))
    );
  }
  if (brand && brand !== 'all') {
    items = items.filter((p) => p.brand.toLowerCase() === String(brand).toLowerCase());
  }
  if (query) {
    const q = String(query).toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  res.json({ success: true, count: items.length, products: items });
});

apiRouter.get('/products/:slugOrId', (req: Request, res: Response) => {
  const param = req.params.slugOrId;
  const product = db.products.find(
    (p) => (p.slug === param || p.id === param) && !p.isDeleted
  );
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }
  const offers = db.affiliateOffers.filter(
    (o) => o.productId === product.id && o.isEnabled && !o.isDeleted
  );
  const faqs = db.faqs.filter((f) => f.entityId === product.id);
  res.json({ success: true, product, offers, faqs });
});

apiRouter.post('/products', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const parseResult = ProductSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.issues[0]?.message || 'Validation error in product fields',
    });
  }

  const data = parseResult.data;
  const now = new Date().toISOString();

  // Check unique slug among non-deleted products
  const existing = db.products.find((p) => p.slug === data.slug && !p.isDeleted);
  if (existing) {
    return res.status(400).json({ success: false, error: `Product slug "${data.slug}" already exists.` });
  }

  const newProduct: BackendProduct = {
    id: crypto.randomUUID(),
    name: sanitizeInput(data.name),
    slug: sanitizeInput(data.slug),
    brand: sanitizeInput(data.brand),
    category: sanitizeInput(data.category),
    subcategory: sanitizeInput(data.subcategory),
    shortDescription: sanitizeInput(data.shortDescription),
    longDescription: data.longDescription,
    specifications: data.specifications.map((s) => ({
      id: crypto.randomUUID(),
      group: s.group,
      label: sanitizeInput(s.label),
      value: sanitizeInput(s.value),
    })),
    pros: data.pros.map(sanitizeInput),
    cons: data.cons.map(sanitizeInput),
    rating: data.rating,
    priceRange: data.priceRange,
    featuredImage: data.featuredImage,
    galleryImages: data.galleryImages,
    youtubeVideoId: data.youtubeVideoId,
    status: data.status,
    isFeatured: data.isFeatured,
    tags: data.tags.map(sanitizeInput),
    whoShouldBuy: data.whoShouldBuy.map(sanitizeInput),
    whoShouldAvoid: data.whoShouldAvoid.map(sanitizeInput),
    seoTitle: data.seoTitle || `${data.name} Review — ProductPilot`,
    seoDescription: data.seoDescription || data.shortDescription,
    metaKeywords: data.metaKeywords,
    schemaFields: data.schemaFields,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const list = [...db.products];
  list.unshift(newProduct);
  db.products = list;

  res.json({ success: true, product: newProduct });
});

apiRouter.put('/products/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Product not found.' });
  }

  const current = db.products[idx];
  const updated: BackendProduct = {
    ...current,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  const list = [...db.products];
  list[idx] = updated;
  db.products = list;

  res.json({ success: true, product: updated });
});

apiRouter.delete('/products/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const { hardDelete } = req.query;
  const id = req.params.id;

  if (hardDelete === 'true') {
    db.products = db.products.filter((p) => p.id !== id);
    db.affiliateOffers = db.affiliateOffers.filter((o) => o.productId !== id);
    return res.json({ success: true, message: 'Product permanently purged from catalog.' });
  }

  // Soft delete
  const prod = db.products.find((p) => p.id === id);
  if (!prod) return res.status(404).json({ success: false, error: 'Product not found' });

  prod.isDeleted = true;
  prod.deletedAt = new Date().toISOString();
  db.saveToDisk();

  res.json({ success: true, message: 'Product soft deleted successfully.' });
});

// ----------------------------------------------------
// 3. Nested Categories API
// ----------------------------------------------------
apiRouter.get('/categories', (_req: Request, res: Response) => {
  res.json({ success: true, categories: db.categories });
});

apiRouter.post('/categories', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const parseResult = CategorySchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid category inputs',
    });
  }

  const data = parseResult.data;
  const now = new Date().toISOString();

  const newCat: NestedCategory = {
    id: crypto.randomUUID(),
    name: sanitizeInput(data.name),
    slug: sanitizeInput(data.slug),
    description: sanitizeInput(data.description || ''),
    parentId: data.parentId || null,
    icon: data.icon || 'Layers',
    image: data.image || '',
    displayOrder: data.displayOrder || 0,
    seoTitle: data.seoTitle || `${data.name} - ProductPilot`,
    seoDescription: data.seoDescription || data.description || '',
    children: [],
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const cats = [...db.categories];
  if (newCat.parentId) {
    const parent = cats.find((c) => c.id === newCat.parentId);
    if (parent) {
      parent.children = parent.children || [];
      parent.children.push(newCat);
    } else {
      cats.push(newCat);
    }
  } else {
    cats.push(newCat);
  }
  db.categories = cats;

  res.json({ success: true, category: newCat });
});

apiRouter.put('/categories/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const id = req.params.id;
  const updateCat = (list: NestedCategory[]): boolean => {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        list[i] = {
          ...list[i],
          ...req.body,
          updatedAt: new Date().toISOString(),
        };
        return true;
      }
      if (list[i].children && list[i].children!.length > 0) {
        if (updateCat(list[i].children!)) return true;
      }
    }
    return false;
  };

  const cats = [...db.categories];
  const found = updateCat(cats);
  if (!found) return res.status(404).json({ success: false, error: 'Category not found' });

  db.categories = cats;
  res.json({ success: true, message: 'Category updated successfully' });
});

apiRouter.delete('/categories/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const id = req.params.id;
  const deleteFromTree = (list: NestedCategory[]): NestedCategory[] => {
    return list
      .filter((c) => c.id !== id)
      .map((c) => ({
        ...c,
        children: c.children ? deleteFromTree(c.children) : [],
      }));
  };

  db.categories = deleteFromTree(db.categories);
  res.json({ success: true, message: 'Category removed' });
});

// ----------------------------------------------------
// 4. Brands API
// ----------------------------------------------------
apiRouter.get('/brands', (_req: Request, res: Response) => {
  res.json({ success: true, brands: db.brands.filter((b) => !b.isDeleted) });
});

apiRouter.post('/brands', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const { name, slug, logoUrl, websiteUrl, description, rating } = req.body;
  if (!name || !slug) return res.status(400).json({ success: false, error: 'Brand name and slug required' });

  const now = new Date().toISOString();
  const brand: Brand = {
    id: crypto.randomUUID(),
    name: sanitizeInput(name),
    slug: sanitizeInput(slug),
    logoUrl: logoUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80',
    websiteUrl: websiteUrl || '',
    description: sanitizeInput(description || ''),
    rating: Number(rating) || 9.0,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const brands = [...db.brands, brand];
  db.brands = brands;
  res.json({ success: true, brand });
});

// ----------------------------------------------------
// 5. Articles, Guides & Comparisons API
// ----------------------------------------------------
apiRouter.get('/articles', (req: Request, res: Response) => {
  const { type, category, status } = req.query;
  let items = db.articles.filter((a) => !a.isDeleted);

  if (type) items = items.filter((a) => a.type === type);
  if (category && category !== 'all') items = items.filter((a) => a.category.toLowerCase().includes(String(category).toLowerCase()));
  if (status) items = items.filter((a) => a.status === status);

  res.json({ success: true, count: items.length, articles: items });
});

apiRouter.get('/articles/:slugOrId', (req: Request, res: Response) => {
  const param = req.params.slugOrId;
  const article = db.articles.find((a) => (a.slug === param || a.id === param) && !a.isDeleted);
  if (!article) return res.status(404).json({ success: false, error: 'Article not found' });
  article.views += 1;
  db.saveToDisk();
  res.json({ success: true, article });
});

apiRouter.post('/articles', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const parseResult = ArticleSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid article body',
    });
  }

  const data = parseResult.data;
  const now = new Date().toISOString();

  const newArt: BackendArticle = {
    id: crypto.randomUUID(),
    title: sanitizeInput(data.title),
    slug: sanitizeInput(data.slug),
    type: data.type,
    status: data.status,
    contentMarkdown: data.contentMarkdown,
    excerpt: sanitizeInput(data.excerpt),
    author: data.author,
    category: sanitizeInput(data.category),
    tags: data.tags.map(sanitizeInput),
    featuredImage: data.featuredImage,
    gallery: data.gallery,
    faqs: data.faqs,
    pros: data.pros,
    cons: data.cons,
    calloutBox: data.calloutBox,
    readingTime: data.readingTime,
    publishedAt: now.split('T')[0],
    views: 0,
    isFeatured: data.isFeatured,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const list = [...db.articles];
  list.unshift(newArt);
  db.articles = list;

  res.json({ success: true, article: newArt });
});

apiRouter.put('/articles/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const idx = db.articles.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Article not found' });

  const updated: BackendArticle = {
    ...db.articles[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  const list = [...db.articles];
  list[idx] = updated;
  db.articles = list;

  res.json({ success: true, article: updated });
});

apiRouter.delete('/articles/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const art = db.articles.find((a) => a.id === req.params.id);
  if (!art) return res.status(404).json({ success: false, error: 'Article not found' });
  art.isDeleted = true;
  art.deletedAt = new Date().toISOString();
  db.saveToDisk();
  res.json({ success: true, message: 'Article deleted successfully' });
});

// Buying Guides
apiRouter.get('/buying-guides', (_req: Request, res: Response) => {
  res.json({ success: true, guides: db.buyingGuides.filter((g) => !g.isDeleted) });
});

apiRouter.post('/buying-guides', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const { title, slug, excerpt, content, category, author, readTime } = req.body;
  const now = new Date().toISOString();
  const guide: BuyingGuide = {
    id: crypto.randomUUID(),
    title: sanitizeInput(title || 'New Buying Guide'),
    slug: sanitizeInput(slug || `guide-${Date.now()}`),
    excerpt: sanitizeInput(excerpt || ''),
    content: content || '',
    category: category || 'Audio & Visual',
    author: author || 'ProductPilot Editorial',
    readTime: readTime || '10 min read',
    isFeatured: true,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };
  db.buyingGuides = [guide, ...db.buyingGuides];
  res.json({ success: true, guide });
});

// Comparisons
apiRouter.get('/comparisons', (_req: Request, res: Response) => {
  res.json({ success: true, comparisons: db.comparisons.filter((c) => !c.isDeleted) });
});

// ----------------------------------------------------
// 6. Affiliate Offers (Automatic Multi-Merchant Buy Box Engine)
// ----------------------------------------------------
apiRouter.get('/affiliates', (req: Request, res: Response) => {
  const { productId } = req.query;
  let items = db.affiliateOffers.filter((o) => !o.isDeleted);
  if (productId) {
    items = items.filter((o) => o.productId === productId);
  }
  // Sort by priority ascending
  items.sort((a, b) => a.priority - b.priority);
  res.json({ success: true, offers: items });
});

apiRouter.post('/affiliates', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const parseResult = AffiliateOfferSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid affiliate offer fields',
    });
  }

  const data = parseResult.data;
  const now = new Date().toISOString();

  const newOffer: BackendAffiliateOffer = {
    id: crypto.randomUUID(),
    productId: data.productId,
    productName: sanitizeInput(data.productName),
    store: data.store,
    affiliateUrl: data.affiliateUrl,
    buttonText: sanitizeInput(data.buttonText),
    country: data.country,
    priority: data.priority,
    price: data.price,
    oldPrice: data.oldPrice,
    discount: data.discount,
    coupon: data.coupon,
    availability: data.availability,
    isEnabled: data.isEnabled,
    clicksCount: 0,
    lastUpdated: 'Just now',
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const list = [...db.affiliateOffers];
  list.unshift(newOffer);
  db.affiliateOffers = list;

  res.json({ success: true, offer: newOffer });
});

apiRouter.put('/affiliates/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const idx = db.affiliateOffers.findIndex((o) => o.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Offer not found' });

  const updated: BackendAffiliateOffer = {
    ...db.affiliateOffers[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  const list = [...db.affiliateOffers];
  list[idx] = updated;
  db.affiliateOffers = list;

  res.json({ success: true, offer: updated });
});

apiRouter.put('/affiliates/:id/toggle', requireAdminAuth, (req: Request, res: Response) => {
  const offer = db.affiliateOffers.find((o) => o.id === req.params.id);
  if (!offer) return res.status(404).json({ success: false, error: 'Offer not found' });
  offer.isEnabled = !offer.isEnabled;
  offer.updatedAt = new Date().toISOString();
  db.saveToDisk();
  res.json({ success: true, isEnabled: offer.isEnabled });
});

apiRouter.delete('/affiliates/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const offer = db.affiliateOffers.find((o) => o.id === req.params.id);
  if (!offer) return res.status(404).json({ success: false, error: 'Offer not found' });
  offer.isDeleted = true;
  db.saveToDisk();
  res.json({ success: true, message: 'Affiliate offer removed' });
});

// ----------------------------------------------------
// 7. Advertisements API
// ----------------------------------------------------
apiRouter.get('/ads', (_req: Request, res: Response) => {
  res.json({ success: true, ads: db.ads.filter((a) => !a.isDeleted) });
});

apiRouter.post('/ads', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const parseResult = AdSlotSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid ad slot fields',
    });
  }

  const data = parseResult.data;
  const now = new Date().toISOString();

  const newAd: BackendAdSlot = {
    id: crypto.randomUUID(),
    name: sanitizeInput(data.name),
    location: data.location,
    network: data.network,
    formatSize: data.formatSize,
    codeSnippet: data.codeSnippet,
    priority: data.priority,
    isEnabled: data.isEnabled,
    categoryScope: data.categoryScope,
    pageScope: data.pageScope,
    impressions: 0,
    clicks: 0,
    ctr: '0.00%',
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const list = [...db.ads, newAd];
  db.ads = list;

  res.json({ success: true, ad: newAd });
});

apiRouter.put('/ads/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const idx = db.ads.findIndex((a) => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Ad slot not found' });

  const updated = {
    ...db.ads[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  const list = [...db.ads];
  list[idx] = updated;
  db.ads = list;

  res.json({ success: true, ad: updated });
});

apiRouter.put('/ads/:id/toggle', requireAdminAuth, (req: Request, res: Response) => {
  const ad = db.ads.find((a) => a.id === req.params.id);
  if (!ad) return res.status(404).json({ success: false, error: 'Ad slot not found' });
  ad.isEnabled = !ad.isEnabled;
  ad.updatedAt = new Date().toISOString();
  db.saveToDisk();
  res.json({ success: true, isEnabled: ad.isEnabled });
});

apiRouter.delete('/ads/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const ad = db.ads.find((a) => a.id === req.params.id);
  if (!ad) return res.status(404).json({ success: false, error: 'Ad slot not found' });
  ad.isDeleted = true;
  db.saveToDisk();
  res.json({ success: true, message: 'Ad placement deleted' });
});

// ----------------------------------------------------
// 8. Newsletter API with Duplicate Prevention & CSV Export
// ----------------------------------------------------
apiRouter.post('/newsletter/subscribe', newsletterLimiter, (req: Request, res: Response) => {
  const parseResult = NewsletterSubscribeSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.issues[0]?.message || 'Valid email required',
    });
  }

  const { email, source, name } = parseResult.data;
  const cleanEmail = sanitizeInput(email).toLowerCase().trim();

  // Duplicate Check
  const existing = db.subscribers.find((s) => s.email === cleanEmail && !s.isDeleted);
  if (existing) {
    return res.json({
      success: true,
      message: 'You are already registered on the ProductPilot VIP Dispatch list!',
    });
  }

  const now = new Date().toISOString();
  const newSub = {
    id: crypto.randomUUID(),
    email: cleanEmail,
    source,
    name: name ? sanitizeInput(name) : undefined,
    dateJoined: now.split('T')[0],
    status: 'Active' as const,
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const list = [newSub, ...db.subscribers];
  db.subscribers = list;

  // Asynchronously trigger welcome email
  emailService.sendWelcomeNewsletter({
    to: cleanEmail,
    name: name ? sanitizeInput(name) : undefined,
  }).catch((err) => logger.error('Failed to send welcome newsletter email', err));

  logger.audit({
    action: 'NEWSLETTER_SUBSCRIBED',
    user: cleanEmail,
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    resource: 'NewsletterSubscribers',
    status: 'SUCCESS',
    details: { source },
  });

  return res.json({
    success: true,
    message: 'Subscription confirmed! Welcome to the ProductPilot Dispatch.',
  });
});

apiRouter.get('/newsletter/subscribers', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ success: true, subscribers: db.subscribers.filter((s) => !s.isDeleted) });
});

apiRouter.delete('/newsletter/subscribers/:id', requireAdminAuth, (req: Request, res: Response) => {
  const sub = db.subscribers.find((s) => s.id === req.params.id);
  if (!sub) return res.status(404).json({ success: false, error: 'Subscriber not found' });
  sub.isDeleted = true;
  db.saveToDisk();
  res.json({ success: true, message: 'Subscriber unsubscribed' });
});

apiRouter.get('/newsletter/export-csv', requireAdminAuth, (_req: Request, res: Response) => {
  const rows = ['ID,Email,Source,DateJoined,Status'];
  db.subscribers
    .filter((s) => !s.isDeleted)
    .forEach((s) => {
      rows.push(`"${s.id}","${s.email}","${s.source}","${s.dateJoined}","${s.status}"`);
    });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="productpilot_subscribers.csv"');
  res.send(rows.join('\n'));
});

// ----------------------------------------------------
// 9. Media Library API (WebP/AVIF Ready)
// ----------------------------------------------------
apiRouter.get('/media', (_req: Request, res: Response) => {
  res.json({ success: true, media: db.media.filter((m) => !m.isDeleted) });
});

apiRouter.post('/media/upload', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const parseResult = MediaUploadSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.issues[0]?.message || 'Invalid media parameters',
    });
  }

  const data = parseResult.data;
  const now = new Date().toISOString();

  const newMedia: BackendMediaItem = {
    id: crypto.randomUUID(),
    name: sanitizeInput(data.name),
    url: data.url,
    size: data.size,
    format: data.format,
    folder: data.folder,
    dimensions: data.dimensions || '1920x1080',
    uploadedAt: now.split('T')[0],
    isDeleted: false,
    createdAt: now,
    updatedAt: now,
  };

  const list = [newMedia, ...db.media];
  db.media = list;

  res.json({ success: true, item: newMedia });
});

apiRouter.delete('/media/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const item = db.media.find((m) => m.id === req.params.id);
  if (!item) return res.status(404).json({ success: false, error: 'Media not found' });
  item.isDeleted = true;
  db.saveToDisk();
  res.json({ success: true, message: 'Media item deleted' });
});

// ----------------------------------------------------
// 10. SEO Metadata API
// ----------------------------------------------------
apiRouter.get('/seo', (_req: Request, res: Response) => {
  res.json({ success: true, metadata: db.seoMetadata.filter((m) => !m.isDeleted) });
});

apiRouter.put('/seo/:id', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const idx = db.seoMetadata.findIndex((m) => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'SEO record not found' });

  const updated: SEOMetadataItem = {
    ...db.seoMetadata[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  const list = [...db.seoMetadata];
  list[idx] = updated;
  db.seoMetadata = list;

  res.json({ success: true, item: updated });
});

// ----------------------------------------------------
// 11. Site Settings API
// ----------------------------------------------------
apiRouter.get('/settings', (_req: Request, res: Response) => {
  res.json({ success: true, settings: db.settings });
});

apiRouter.put('/settings', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const current = db.settings;
  const updated = {
    ...current,
    ...req.body,
    affiliateIds: {
      ...current.affiliateIds,
      ...(req.body.affiliateIds || {}),
    },
    socialLinks: {
      ...current.socialLinks,
      ...(req.body.socialLinks || {}),
    },
    footerSettings: {
      ...current.footerSettings,
      ...(req.body.footerSettings || {}),
    },
  };
  db.settings = updated;
  res.json({ success: true, settings: updated });
});

// ----------------------------------------------------
// 12. Analytics Summary API
// ----------------------------------------------------
apiRouter.get('/analytics/summary', requireAdminAuth, (_req: Request, res: Response) => {
  const totalProducts = db.products.filter((p) => !p.isDeleted).length;
  const publishedArticles = db.articles.filter((a) => !a.isDeleted && a.status === 'published').length;
  const totalSubscribers = db.subscribers.filter((s) => !s.isDeleted && s.status === 'Active').length;
  const totalAffiliateClicks = db.affiliateOffers
    .filter((o) => !o.isDeleted)
    .reduce((sum, o) => sum + (o.clicksCount || 0), 0);

  // Top 5 clicked affiliate links
  const topAffiliates = [...db.affiliateOffers]
    .filter((o) => !o.isDeleted)
    .sort((a, b) => b.clicksCount - a.clicksCount)
    .slice(0, 5);

  res.json({
    success: true,
    metrics: {
      totalProducts,
      publishedArticles,
      totalSubscribers,
      totalAffiliateClicks,
      estimatedCommission: `$${(totalAffiliateClicks * 1.85).toFixed(2)}`,
      avgCtr: '3.42%',
    },
    topAffiliates,
  });
});

// ----------------------------------------------------
// 13. Public Inbound Contact API
// ----------------------------------------------------
apiRouter.post('/contact', newsletterLimiter, async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ success: false, error: 'Valid email address is required.' });
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    return res.status(400).json({ success: false, error: 'Message must be at least 5 characters.' });
  }

  const cleanName = sanitizeInput(name || 'Reader');
  const cleanEmail = sanitizeInput(email);
  const cleanSubject = sanitizeInput(subject || 'General Inquiry');
  const cleanMessage = sanitizeInput(message);

  const dispatchResult = await emailService.sendContactFormDispatch({
    senderName: cleanName,
    senderEmail: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
  });

  logger.audit({
    action: 'CONTACT_FORM_SUBMISSION',
    user: cleanEmail,
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    resource: 'EditorialInbox',
    status: dispatchResult.success ? 'SUCCESS' : 'FAILURE',
  });

  return res.json({
    success: true,
    message: 'Thank you for reaching out! Our editorial team reviews every message within 24-48 business hours.',
  });
});

// ----------------------------------------------------
// 14. Content Management Bulk Actions API
// ----------------------------------------------------
apiRouter.post('/articles/bulk', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const { ids, action } = req.body as { ids: string[]; action: 'publish' | 'draft' | 'archive' | 'delete' };

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, error: 'No article IDs provided.' });
  }

  let count = 0;
  for (const id of ids) {
    const article = db.articles.find((a) => a.id === id);
    if (article) {
      if (action === 'delete') {
        article.isDeleted = true;
      } else if (action === 'publish') {
        article.status = 'published';
      } else if (action === 'draft') {
        article.status = 'draft';
      } else if (action === 'archive') {
        // archived
        article.status = 'draft';
        article.isDeleted = true;
      }
      article.updatedAt = new Date().toISOString();
      count += 1;
    }
  }

  db.saveToDisk();
  dbAuditor.rebuildIndexes();

  logger.audit({
    action: `BULK_ARTICLES_${action.toUpperCase()}`,
    user: (req as unknown as { adminUser?: { email: string } }).adminUser?.email || 'admin',
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    resource: 'Articles',
    status: 'SUCCESS',
    details: { affectedCount: count, ids },
  });

  res.json({ success: true, count, message: `Successfully updated ${count} articles.` });
});

apiRouter.post('/products/bulk', requireAdminAuth, writeLimiter, (req: Request, res: Response) => {
  const { ids, action } = req.body as { ids: string[]; action: 'publish' | 'draft' | 'archive' | 'delete' };

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, error: 'No product IDs provided.' });
  }

  let count = 0;
  for (const id of ids) {
    const product = db.products.find((p) => p.id === id);
    if (product) {
      if (action === 'delete') {
        product.isDeleted = true;
      } else if (action === 'publish') {
        product.status = 'published';
      } else if (action === 'draft') {
        product.status = 'draft';
      } else if (action === 'archive') {
        product.status = 'archived';
      }
      product.updatedAt = new Date().toISOString();
      count += 1;
    }
  }

  db.saveToDisk();
  dbAuditor.rebuildIndexes();

  logger.audit({
    action: `BULK_PRODUCTS_${action.toUpperCase()}`,
    user: (req as unknown as { adminUser?: { email: string } }).adminUser?.email || 'admin',
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    resource: 'Products',
    status: 'SUCCESS',
    details: { affectedCount: count, ids },
  });

  res.json({ success: true, count, message: `Successfully updated ${count} products.` });
});

// ----------------------------------------------------
// 15. System Administration Infrastructure & Health API
// ----------------------------------------------------
apiRouter.get('/admin/system/health', requireAdminAuth, (_req: Request, res: Response) => {
  const envValidation = validateEnvironment();
  const mem = process.memoryUsage();
  const uptimeSeconds = Math.floor(process.uptime());

  res.json({
    success: true,
    health: {
      status: 'healthy',
      uptime: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`,
      uptimeSeconds,
      memory: {
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
      },
      environment: envValidation.environment,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      database: {
        totalProducts: db.products.length,
        totalArticles: db.articles.length,
        totalCategories: db.categories.length,
        totalAffiliateOffers: db.affiliateOffers.length,
        totalSubscribers: db.subscribers.length,
        totalMedia: db.media.length,
        totalAds: db.ads.length,
      },
      maintenanceMode: db.settings.maintenanceMode?.enabled || false,
      warnings: envValidation.warnings,
      diagnostics: envValidation.diagnostics,
    },
  });
});

apiRouter.get('/admin/system/audit-logs', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    success: true,
    logs: logger.getAuditLogs(60),
  });
});

apiRouter.get('/admin/system/backups', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    success: true,
    backups: backupService.listBackups(),
  });
});

apiRouter.post('/admin/system/backup/create', requireAdminAuth, (req: Request, res: Response) => {
  const backup = backupService.createBackup('MANUAL');
  res.json({
    success: true,
    backup,
    message: `Created verified database snapshot: ${backup.filename}`,
  });
});

apiRouter.get('/admin/system/backup/download/:id', requireAdminAuth, (req: Request, res: Response) => {
  const backup = backupService.getBackupContent(req.params.id);
  if (!backup) {
    return res.status(404).json({ success: false, error: 'Backup not found' });
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${backup.filename}"`);
  res.send(backup.content);
});

apiRouter.post('/admin/system/backup/restore', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.body as { id: string };
  if (!id) {
    return res.status(400).json({ success: false, error: 'Backup ID is required.' });
  }

  const result = backupService.restoreBackup(id);
  if (!result.success) {
    return res.status(400).json({ success: false, error: result.message });
  }

  dbAuditor.rebuildIndexes();
  res.json({ success: true, message: result.message });
});

apiRouter.get('/admin/system/db-audit', requireAdminAuth, (_req: Request, res: Response) => {
  const report = dbAuditor.runAudit();
  res.json({ success: true, report });
});

apiRouter.post('/admin/system/db-repair', requireAdminAuth, (_req: Request, res: Response) => {
  const result = dbAuditor.repairInconsistencies();
  res.json({ success: true, result });
});

apiRouter.post('/admin/system/cache-flush', requireAdminAuth, (req: Request, res: Response) => {
  dbAuditor.rebuildIndexes();
  logger.audit({
    action: 'CACHE_FLUSH',
    user: (req as unknown as { adminUser?: { email: string } }).adminUser?.email || 'admin',
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    resource: 'SystemCache',
    status: 'SUCCESS',
  });
  res.json({ success: true, message: 'In-memory routing index and cache cleared.' });
});

apiRouter.post('/admin/system/maintenance', requireAdminAuth, (req: Request, res: Response) => {
  const { enabled, message } = req.body as { enabled: boolean; message?: string };
  const currentSettings = db.settings;

  currentSettings.maintenanceMode = {
    enabled: Boolean(enabled),
    message: message || 'ProductPilot is currently undergoing scheduled infrastructure maintenance.',
  };

  db.settings = currentSettings;

  logger.audit({
    action: enabled ? 'MAINTENANCE_MODE_ENABLED' : 'MAINTENANCE_MODE_DISABLED',
    user: (req as unknown as { adminUser?: { email: string } }).adminUser?.email || 'admin',
    ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
    resource: 'MaintenanceGate',
    status: 'SUCCESS',
    details: { enabled, message },
  });

  res.json({
    success: true,
    maintenanceMode: currentSettings.maintenanceMode,
    message: enabled ? 'Maintenance mode enabled.' : 'Maintenance mode disabled.',
  });
});

apiRouter.get('/frontend-sync', (req: Request, res: Response) => {
  if (frontendSyncCache) {
    return res.json(frontendSyncCache);
  }

  const activeProducts = db.products.filter(p => p.status === 'published' && !p.isDeleted);
  
  const catalog = activeProducts.map(p => {
    const offers = db.affiliateOffers.filter(o => o.productId === p.id && o.isEnabled && !o.isDeleted);
    const topOffer = offers.length > 0 ? offers[0] : null;
    
    // Convert specifications to record format expected by frontend
    const specs: Record<string, string> = {
      dimensions: '-', weight: '-', battery: '-', connectivity: '-', performance: '-', compatibility: '-', warranty: '-'
    };
    p.specifications.forEach(s => {
      const key = s.label.toLowerCase();
      if (key.includes('dimension')) specs.dimensions = s.value;
      else if (key.includes('weight')) specs.weight = s.value;
      else if (key.includes('battery')) specs.battery = s.value;
      else if (key.includes('connect')) specs.connectivity = s.value;
      else if (key.includes('perform')) specs.performance = s.value;
      else if (key.includes('compat')) specs.compatibility = s.value;
      else if (key.includes('warrant')) specs.warranty = s.value;
      else specs[s.label.toLowerCase().replace(/[^a-z0-9]/g, '')] = s.value;
    });

    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      category: p.category,
      subcategory: p.subcategory || p.category,
      price: p.priceRange,
      numericPrice: parseFloat(p.priceRange.replace(/[^0-9.]/g, '')) || 0,
      rating: p.rating,
      userRating: p.rating,
      reviewsCount: 154,
      image: p.featuredImage,
      gallery: p.galleryImages,
      merchant: topOffer ? topOffer.store : 'Amazon',
      merchantsAvailable: Array.from(new Set(offers.map(o => o.store))),
      affiliateUrl: `/go/${p.slug}${topOffer ? `?store=${topOffer.store.toLowerCase()}` : ''}`,
      availability: topOffer ? topOffer.availability : 'In Stock',
      shortDescription: p.shortDescription,
      specs,
      pros: p.pros,
      cons: p.cons,
      releaseDate: p.createdAt,
      isFeatured: p.isFeatured
    };
  });

  const trending = activeProducts.filter(p => p.isFeatured).slice(0, 6).map(p => {
    const offers = db.affiliateOffers.filter(o => o.productId === p.id && o.isEnabled && !o.isDeleted);
    const getOffer = (store: string) => offers.find(o => o.store.toLowerCase() === store.toLowerCase());
    
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      rating: p.rating,
      shortDescription: p.shortDescription,
      priceRange: p.priceRange,
      image: p.featuredImage,
      pros: p.pros.slice(0, 3),
      affiliateLinks: {
        amazonUrl: `/go/${p.slug}?store=amazon`,
        amazonPrice: getOffer('amazon')?.price || p.priceRange,
        ebayUrl: `/go/${p.slug}?store=ebay`,
        ebayPrice: getOffer('ebay')?.price || p.priceRange,
        aliExpressUrl: `/go/${p.slug}?store=aliexpress`,
        aliExpressPrice: getOffer('aliexpress')?.price || p.priceRange,
      }
    };
  });

  const activeCategories = db.categories.filter(c => !c.isDeleted);
  const categories = activeCategories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: activeProducts.filter(p => p.categoryId === c.id || p.category === c.name).length,
    iconName: c.icon || 'tag',
    gradient: 'from-blue-500 to-indigo-600',
    description: c.description
  }));

  const activeArticles = db.articles.filter(a => a.status === 'published' && !a.isDeleted);
  const reviews = activeArticles.filter(a => a.type === 'review').map(a => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    category: 'Review',
    rating: 4.8,
    readingTime: '5 min read',
    date: a.createdAt,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    excerpt: a.excerpt,
    author: {
      name: a.author.name,
      role: a.author.role,
      avatar: a.author.avatar
    }
  }));

  const buyingGuides = activeArticles.filter(a => a.type === 'buying_guide').map(a => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    category: 'Guide',
    itemCount: 5,
    award: 'Top Guide',
    updatedDate: a.updatedAt,
    thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    description: a.excerpt,
    author: a.author.name
  }));

  frontendSyncCache = {
    success: true,
    catalog,
    trending,
    categories,
    reviews,
    buyingGuides
  };

  res.json(frontendSyncCache);
});
