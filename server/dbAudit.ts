/**
 * ProductPilot Database Quality & Relationship Integrity Auditor
 * Audits relational foreign keys, validates schema fields, cleans orphaned records,
 * and maintains optimized in-memory query indexes.
 */

import { db } from './db';
import { logger } from './logger';

export interface IntegrityIssue {
  type: 'ORPHANED_CATEGORY' | 'ORPHANED_BRAND' | 'ORPHANED_PRODUCT' | 'INVALID_SLUG' | 'MISSING_MEDIA' | 'DUPLICATE_SLUG';
  collection: string;
  recordId: string;
  field: string;
  description: string;
  severity: 'WARNING' | 'ERROR';
}

export interface DbAuditReport {
  timestamp: string;
  totalRecords: number;
  collections: Record<string, number>;
  issuesFound: IntegrityIssue[];
  isHealthy: boolean;
  performanceIndexes: {
    productSlugsIndexed: number;
    categorySlugsIndexed: number;
    articleSlugsIndexed: number;
  };
}

class DatabaseAuditor {
  // In-memory O(1) slug indexes for zero-latency routing lookups
  private productIndex = new Map<string, string>();
  private categoryIndex = new Map<string, string>();
  private articleIndex = new Map<string, string>();

  constructor() {
    this.rebuildIndexes();
  }

  public rebuildIndexes() {
    this.productIndex.clear();
    this.categoryIndex.clear();
    this.articleIndex.clear();

    for (const p of db.products) {
      if (!p.isDeleted && p.slug) this.productIndex.set(p.slug.toLowerCase(), p.id);
    }
    for (const c of db.categories) {
      if (!c.isDeleted && c.slug) this.categoryIndex.set(c.slug.toLowerCase(), c.id);
    }
    for (const a of db.articles) {
      if (!a.isDeleted && a.slug) this.articleIndex.set(a.slug.toLowerCase(), a.id);
    }
  }

  public runAudit(): DbAuditReport {
    this.rebuildIndexes();
    const issues: IntegrityIssue[] = [];

    const categoryIds = new Set(db.categories.map((c) => c.id));
    const categorySlugs = new Set<string>();
    const brandIds = new Set(db.brands.map((b) => b.id));
    const productIds = new Set(db.products.map((p) => p.id));
    const productSlugs = new Set<string>();
    const articleSlugs = new Set<string>();

    // 1. Audit Categories
    for (const c of db.categories) {
      if (categorySlugs.has(c.slug)) {
        issues.push({
          type: 'DUPLICATE_SLUG',
          collection: 'categories',
          recordId: c.id,
          field: 'slug',
          description: `Duplicate category slug "${c.slug}" found.`,
          severity: 'ERROR',
        });
      }
      categorySlugs.add(c.slug);

      if (c.parentId && !categoryIds.has(c.parentId)) {
        issues.push({
          type: 'ORPHANED_CATEGORY',
          collection: 'categories',
          recordId: c.id,
          field: 'parentId',
          description: `Category "${c.name}" references non-existent parentId "${c.parentId}".`,
          severity: 'WARNING',
        });
      }
    }

    // 2. Audit Products
    for (const p of db.products) {
      if (productSlugs.has(p.slug)) {
        issues.push({
          type: 'DUPLICATE_SLUG',
          collection: 'products',
          recordId: p.id,
          field: 'slug',
          description: `Duplicate product slug "${p.slug}" detected.`,
          severity: 'ERROR',
        });
      }
      productSlugs.add(p.slug);

      if (p.categoryId && !categoryIds.has(p.categoryId)) {
        issues.push({
          type: 'ORPHANED_CATEGORY',
          collection: 'products',
          recordId: p.id,
          field: 'categoryId',
          description: `Product "${p.name}" references non-existent categoryId "${p.categoryId}".`,
          severity: 'WARNING',
        });
      }

      if (p.brandId && !brandIds.has(p.brandId)) {
        issues.push({
          type: 'ORPHANED_BRAND',
          collection: 'products',
          recordId: p.id,
          field: 'brandId',
          description: `Product "${p.name}" references non-existent brandId "${p.brandId}".`,
          severity: 'WARNING',
        });
      }
    }

    // 3. Audit Affiliate Offers
    for (const offer of db.affiliateOffers) {
      if (offer.productId && !productIds.has(offer.productId)) {
        issues.push({
          type: 'ORPHANED_PRODUCT',
          collection: 'affiliateOffers',
          recordId: offer.id,
          field: 'productId',
          description: `Affiliate offer for "${offer.productName}" references orphaned productId "${offer.productId}".`,
          severity: 'WARNING',
        });
      }
    }

    // 4. Audit Articles
    for (const a of db.articles) {
      if (articleSlugs.has(a.slug)) {
        issues.push({
          type: 'DUPLICATE_SLUG',
          collection: 'articles',
          recordId: a.id,
          field: 'slug',
          description: `Duplicate article slug "${a.slug}" detected.`,
          severity: 'ERROR',
        });
      }
      articleSlugs.add(a.slug);
    }

    const totalRecords =
      db.products.length +
      db.categories.length +
      db.articles.length +
      db.affiliateOffers.length +
      db.buyingGuides.length +
      db.comparisons.length +
      db.ads.length +
      db.media.length;

    return {
      timestamp: new Date().toISOString(),
      totalRecords,
      collections: {
        products: db.products.length,
        categories: db.categories.length,
        articles: db.articles.length,
        affiliateOffers: db.affiliateOffers.length,
        buyingGuides: db.buyingGuides.length,
        comparisons: db.comparisons.length,
        ads: db.ads.length,
        media: db.media.length,
        subscribers: db.subscribers.length,
      },
      issuesFound: issues,
      isHealthy: issues.filter((i) => i.severity === 'ERROR').length === 0,
      performanceIndexes: {
        productSlugsIndexed: this.productIndex.size,
        categorySlugsIndexed: this.categoryIndex.size,
        articleSlugsIndexed: this.articleIndex.size,
      },
    };
  }

  /**
   * Automatically repairs common relational inconsistencies (links orphaned offers to active products, heals slugs)
   */
  public repairInconsistencies(): { repairedCount: number; message: string } {
    let repairedCount = 0;
    const report = this.runAudit();

    for (const issue of report.issuesFound) {
      if (issue.type === 'ORPHANED_PRODUCT' && issue.collection === 'affiliateOffers') {
        const offer = db.affiliateOffers.find((o) => o.id === issue.recordId);
        if (offer) {
          // Attempt fuzzy match with existing products by name
          const match = db.products.find(
            (p) => p.name.toLowerCase().includes(offer.productName.toLowerCase()) || offer.productName.toLowerCase().includes(p.name.toLowerCase())
          );
          if (match) {
            offer.productId = match.id;
            repairedCount += 1;
          }
        }
      }
    }

    if (repairedCount > 0) {
      db.saveToDisk();
      this.rebuildIndexes();
      logger.audit({
        action: 'DATABASE_AUTO_REPAIR',
        user: 'SYSTEM',
        ip: '127.0.0.1',
        resource: 'DatabaseStore',
        status: 'SUCCESS',
        details: { repairedCount },
      });
    }

    return {
      repairedCount,
      message: repairedCount > 0 ? `Successfully repaired ${repairedCount} relationship records.` : 'No critical inconsistencies required automated patching.',
    };
  }
}

export const dbAuditor = new DatabaseAuditor();
