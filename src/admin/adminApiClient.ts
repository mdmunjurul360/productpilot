import {
  AdminProduct,
  AdminCategory,
  AdminArticle,
  AdminAffiliateOffer,
  AdminAdSlot,
  AdminMediaItem,
  AdminSubscriber,
} from './types';

const API_BASE = '/api';

export const adminApi = {
  // Products
  async fetchProducts(): Promise<AdminProduct[]> {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      return data.products || [];
    } catch (err) {
      console.warn('API error fetching products, using local fallback:', err);
      return [];
    }
  },

  async createProduct(product: Partial<AdminProduct>): Promise<{ success: boolean; product?: AdminProduct; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async updateProduct(id: string, updates: Partial<AdminProduct>): Promise<{ success: boolean; product?: AdminProduct; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  // Categories
  async fetchCategories(): Promise<AdminCategory[]> {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      return data.categories || [];
    } catch (err) {
      console.warn('API error fetching categories:', err);
      return [];
    }
  },

  async createCategory(cat: Partial<AdminCategory>): Promise<{ success: boolean; category?: AdminCategory; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async updateCategory(id: string, updates: Partial<AdminCategory>): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  // Articles
  async fetchArticles(): Promise<AdminArticle[]> {
    try {
      const res = await fetch(`${API_BASE}/articles`);
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data = await res.json();
      return (data.articles || []).map((a: any) => ({
        ...a,
        author: typeof a.author === 'string' ? a.author : (a.author?.name || 'Editorial Team'),
      }));
    } catch (err) {
      console.warn('API error fetching articles:', err);
      return [];
    }
  },

  async createArticle(art: Partial<AdminArticle>): Promise<{ success: boolean; article?: AdminArticle; error?: string }> {
    try {
      const payload = {
        ...art,
        ...(art.author && {
          author: {
            name: typeof art.author === 'string' ? art.author : 'Editorial Team',
            role: 'Staff Writer',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          }
        })
      };
      const res = await fetch(`${API_BASE}/articles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async updateArticle(id: string, updates: Partial<AdminArticle>): Promise<{ success: boolean; article?: AdminArticle; error?: string }> {
    try {
      const payload = {
        ...updates,
        ...(updates.author && {
          author: {
            name: typeof updates.author === 'string' ? updates.author : 'Editorial Team',
            role: 'Staff Writer',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          }
        })
      };
      const res = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async deleteArticle(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/articles/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  // Affiliate Offers
  async fetchAffiliateOffers(productId?: string): Promise<AdminAffiliateOffer[]> {
    try {
      const url = productId ? `${API_BASE}/affiliates?productId=${productId}` : `${API_BASE}/affiliates`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch affiliate offers');
      const data = await res.json();
      return data.offers || [];
    } catch (err) {
      console.warn('API error fetching affiliate offers:', err);
      return [];
    }
  },

  async createAffiliateOffer(offer: Partial<AdminAffiliateOffer>): Promise<{ success: boolean; offer?: AdminAffiliateOffer; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/affiliates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async toggleAffiliateOffer(id: string): Promise<{ success: boolean; isEnabled?: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/affiliates/${id}/toggle`, { method: 'PUT' });
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  },

  async deleteAffiliateOffer(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/affiliates/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  // Advertisements
  async fetchAds(): Promise<AdminAdSlot[]> {
    try {
      const res = await fetch(`${API_BASE}/ads`);
      if (!res.ok) throw new Error('Failed to fetch ads');
      const data = await res.json();
      return data.ads || [];
    } catch (err) {
      console.warn('API error fetching ads:', err);
      return [];
    }
  },

  async toggleAd(id: string): Promise<{ success: boolean; isEnabled?: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/ads/${id}/toggle`, { method: 'PUT' });
      return await res.json();
    } catch (err) {
      return { success: false };
    }
  },

  async createAd(ad: Partial<AdminAdSlot>): Promise<{ success: boolean; ad?: AdminAdSlot; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ad),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async deleteAd(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/ads/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  // Media Library
  async fetchMedia(): Promise<AdminMediaItem[]> {
    try {
      const res = await fetch(`${API_BASE}/media`);
      if (!res.ok) throw new Error('Failed to fetch media');
      const data = await res.json();
      return data.media || [];
    } catch (err) {
      console.warn('API error fetching media:', err);
      return [];
    }
  },

  async uploadMedia(item: Partial<AdminMediaItem>): Promise<{ success: boolean; item?: AdminMediaItem; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  async deleteMedia(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/media/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  // Newsletter
  async fetchSubscribers(): Promise<AdminSubscriber[]> {
    try {
      const res = await fetch(`${API_BASE}/newsletter/subscribers`);
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      const data = await res.json();
      return data.subscribers || [];
    } catch (err) {
      console.warn('API error fetching subscribers:', err);
      return [];
    }
  },

  async deleteSubscriber(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${API_BASE}/newsletter/subscribers/${id}`, { method: 'DELETE' });
      return await res.json();
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Network error' };
    }
  },

  // Analytics
  async fetchAnalytics(): Promise<{
    metrics: {
      totalProducts: number;
      publishedArticles: number;
      totalSubscribers: number;
      totalAffiliateClicks: number;
      estimatedCommission: string;
      avgCtr: string;
    };
    topAffiliates: AdminAffiliateOffer[];
  } | null> {
    try {
      const res = await fetch(`${API_BASE}/analytics/summary`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};
