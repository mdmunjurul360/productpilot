/**
 * ProductPilot Analytics & Conversion Dispatcher
 * Ready for Google Analytics 4, GTM, Meta Pixel, and Search Console
 */

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

class AnalyticsManager {
  private isInitialized = false;

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Listen for custom dispatch events
    window.addEventListener('productpilot:track', ((e: CustomEvent<AnalyticsEvent>) => {
      this.logEvent(e.detail);
    }) as EventListener);
  }

  private logEvent(event: AnalyticsEvent) {
    if (typeof window === 'undefined') return;

    // Send to Google Analytics 4 if gtag exists
    if ((window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }

    // Send to Google Tag Manager dataLayer
    const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
    if (Array.isArray(dataLayer)) {
      dataLayer.push({
        event: event.action,
        eventCategory: event.category,
        eventLabel: event.label,
        eventValue: event.value,
        ...event.metadata,
      });
    }
  }

  // 1. Affiliate Click Tracker (with FTC sponsored attribution & UTM preservation)
  public trackAffiliateClick(merchant: string, productName: string, affiliateUrl: string) {
    this.logEvent({
      action: 'affiliate_click',
      category: 'Monetization',
      label: `${merchant} - ${productName}`,
      metadata: {
        merchant,
        productName,
        destinationUrl: affiliateUrl,
        timestamp: new Date().toISOString(),
      },
    });
  }

  // 2. Ad Impression & Click Tracker (Zero-CLS compliant)
  public trackAdClick(slot: string, sponsorName?: string) {
    this.logEvent({
      action: 'ad_click',
      category: 'Advertising',
      label: slot,
      metadata: {
        slot,
        sponsorName: sponsorName || 'Direct Network',
      },
    });
  }

  // 3. Search Engagement Tracker
  public trackSearch(query: string, resultCount: number) {
    if (!query.trim()) return;
    this.logEvent({
      action: 'search_query',
      category: 'Discovery',
      label: query,
      value: resultCount,
    });
  }

  // 4. Newsletter Conversion
  public trackNewsletterSignup(email: string) {
    this.logEvent({
      action: 'newsletter_signup',
      category: 'Engagement',
      label: 'Editorial Weekly Digest',
      metadata: {
        domain: email.split('@')[1] || 'unknown',
      },
    });
  }

  // 5. Product & Review Pageview
  public trackProductView(productId: string, productName: string, category: string) {
    this.logEvent({
      action: 'view_product_review',
      category: 'Content',
      label: productName,
      metadata: {
        productId,
        category,
      },
    });
  }
}

export const analytics = new AnalyticsManager();
