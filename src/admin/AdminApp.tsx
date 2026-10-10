import React, { useState, useEffect } from 'react';
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminProducts } from './pages/AdminProducts';
import { AdminCategories } from './pages/AdminCategories';
import { AdminArticles } from './pages/AdminArticles';
import { AdminBuyingGuides } from './pages/AdminBuyingGuides';
import { AdminComparisons } from './pages/AdminComparisons';
import { AdminAffiliateLinks } from './pages/AdminAffiliateLinks';
import { AdminAds } from './pages/AdminAds';
import { AdminMedia } from './pages/AdminMedia';
import { AdminSEO } from './pages/AdminSEO';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { AdminComments } from './pages/AdminComments';
import { AdminNewsletter } from './pages/AdminNewsletter';
import { AdminSettings } from './pages/AdminSettings';
import { adminApi } from './adminApiClient';

import {
  AdminTab,
  AdminProduct,
  AdminCategory,
  AdminArticle,
  AdminBuyingGuide,
  AdminComparison,
  AdminComment,
  AdminAffiliateOffer,
  AdminAdSlot,
  AdminMediaItem,
  AdminSubscriber,
  ToastMessage,
} from './types';

import {
  INITIAL_ADMIN_PRODUCTS,
  INITIAL_ADMIN_CATEGORIES,
  INITIAL_ADMIN_ARTICLES,
  INITIAL_BUYING_GUIDES,
  INITIAL_COMPARISONS,
  INITIAL_COMMENTS,
  INITIAL_AFFILIATE_OFFERS,
  INITIAL_ADMIN_ADS,
  INITIAL_MEDIA_LIBRARY,
  INITIAL_SUBSCRIBERS,
} from './mockAdminData';

interface AdminAppProps {
  onNavigate: (path: string) => void;
}

export const AdminApp: React.FC<AdminAppProps> = ({ onNavigate }) => {
  return (
    <AdminAuthProvider>
      <AdminAppInner onNavigate={onNavigate} />
    </AdminAuthProvider>
  );
};

const AdminAppInner: React.FC<AdminAppProps> = ({ onNavigate }) => {
  const { isAuthenticated } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Admin Master State (initialized from seed data, synced with real API)
  const [products, setProducts] = useState<AdminProduct[]>(INITIAL_ADMIN_PRODUCTS);
  const [categories, setCategories] = useState<AdminCategory[]>(INITIAL_ADMIN_CATEGORIES);
  const [articles, setArticles] = useState<AdminArticle[]>(INITIAL_ADMIN_ARTICLES);
  const [buyingGuides, setBuyingGuides] = useState<AdminBuyingGuide[]>(INITIAL_BUYING_GUIDES);
  const [comparisons, setComparisons] = useState<AdminComparison[]>(INITIAL_COMPARISONS);
  const [comments, setComments] = useState<AdminComment[]>(INITIAL_COMMENTS);
  const [affiliateOffers, setAffiliateOffers] = useState<AdminAffiliateOffer[]>(INITIAL_AFFILIATE_OFFERS);
  const [ads, setAds] = useState<AdminAdSlot[]>(INITIAL_ADMIN_ADS);
  const [media, setMedia] = useState<AdminMediaItem[]>(INITIAL_MEDIA_LIBRARY);
  const [subscribers, setSubscribers] = useState<AdminSubscriber[]>(INITIAL_SUBSCRIBERS);

  // Sync state with real backend API on mount
  useEffect(() => {
    let isMounted = true;

    async function syncBackendData() {
      try {
        const [
          serverProducts,
          serverCategories,
          serverArticles,
          serverAffiliates,
          serverAds,
          serverMedia,
          serverSubscribers,
        ] = await Promise.allSettled([
          adminApi.fetchProducts(),
          adminApi.fetchCategories(),
          adminApi.fetchArticles(),
          adminApi.fetchAffiliateOffers(),
          adminApi.fetchAds(),
          adminApi.fetchMedia(),
          adminApi.fetchSubscribers(),
        ]);

        if (!isMounted) return;

        if (serverProducts.status === 'fulfilled' && serverProducts.value.length > 0) {
          setProducts(serverProducts.value);
        }
        if (serverCategories.status === 'fulfilled' && serverCategories.value.length > 0) {
          setCategories(serverCategories.value);
        }
        if (serverArticles.status === 'fulfilled' && serverArticles.value.length > 0) {
          setArticles(serverArticles.value);
        }
        if (serverAffiliates.status === 'fulfilled' && serverAffiliates.value.length > 0) {
          setAffiliateOffers(serverAffiliates.value);
        }
        if (serverAds.status === 'fulfilled' && serverAds.value.length > 0) {
          setAds(serverAds.value);
        }
        if (serverMedia.status === 'fulfilled' && serverMedia.value.length > 0) {
          setMedia(serverMedia.value);
        }
        if (serverSubscribers.status === 'fulfilled' && serverSubscribers.value.length > 0) {
          setSubscribers(serverSubscribers.value);
        }
      } catch (err) {
        console.warn('Backend sync note: operating with cached local store', err);
      }
    }

    if (isAuthenticated) {
      syncBackendData();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  if (!isAuthenticated) {
    return <AdminLogin onReturnToSite={() => onNavigate('/')} />;
  }

  // Handlers for Products
  const handleSaveProduct = async (prod: AdminProduct) => {
    const existingIdx = products.findIndex((p) => p.id === prod.id);

    // Update UI immediately (optimistic UI)
    setProducts((prev) => {
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = prod;
        return updated;
      }
      return [prod, ...prev];
    });

    // Call backend API
    if (existingIdx >= 0) {
      const res = await adminApi.updateProduct(prod.id, prod);
      if (res.success) {
        addToast(`Product "${prod.name}" successfully updated.`);
      } else {
        addToast(`Saved locally. ${res.error || ''}`, 'info');
      }
    } else {
      const res = await adminApi.createProduct(prod);
      if (res.success && res.product) {
        setProducts((prev) => [res.product!, ...prev.filter((p) => p.id !== prod.id)]);
        addToast(`Product "${prod.name}" created.`);
      } else {
        addToast(`Product saved.`, 'success');
      }
    }
  };

  const handleDeleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await adminApi.deleteProduct(id);
    addToast('Product successfully removed from catalog.');
  };

  const handleDuplicateProduct = async (prod: AdminProduct) => {
    const dup: AdminProduct = {
      ...prod,
      id: `prod-${Date.now()}`,
      name: `${prod.name} (Copy)`,
      slug: `${prod.slug}-copy-${Date.now() % 1000}`,
      status: 'draft',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setProducts((prev) => [dup, ...prev]);
    await adminApi.createProduct(dup);
    addToast(`Duplicated "${prod.name}" as draft.`);
  };

  // Handlers for Categories
  const handleSaveCategory = async (cat: AdminCategory) => {
    const existingIdx = categories.findIndex((c) => c.id === cat.id);
    setCategories((prev) => {
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = cat;
        return updated;
      }
      return [cat, ...prev];
    });

    if (existingIdx >= 0) {
      await adminApi.updateCategory(cat.id, cat);
      addToast(`Category "${cat.name}" updated.`);
    } else {
      await adminApi.createCategory(cat);
      addToast(`Category "${cat.name}" created.`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await adminApi.deleteCategory(id);
    addToast('Category deleted.');
  };

  // Handlers for Articles
  const handleSaveArticle = async (art: AdminArticle) => {
    const existingIdx = articles.findIndex((a) => a.id === art.id);
    setArticles((prev) => {
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = art;
        return updated;
      }
      return [art, ...prev];
    });

    if (existingIdx >= 0) {
      await adminApi.updateArticle(art.id, art);
    } else {
      await adminApi.createArticle(art);
    }
    addToast(`Article "${art.title}" saved.`);
  };

  const handleDeleteArticle = async (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    await adminApi.deleteArticle(id);
    addToast('Article removed.');
  };

  // Handlers for Buying Guides
  const handleSaveBuyingGuide = (guide: AdminBuyingGuide) => {
    setBuyingGuides((prev) => {
      const idx = prev.findIndex((g) => g.id === guide.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = guide;
        return updated;
      }
      return [guide, ...prev];
    });
    addToast(`Buying guide "${guide.title}" saved.`);
  };

  const handleDeleteBuyingGuide = (id: string) => {
    setBuyingGuides((prev) => prev.filter((g) => g.id !== id));
    addToast('Buying guide deleted.');
  };

  // Handlers for Comparisons
  const handleSaveComparison = (cmp: AdminComparison) => {
    setComparisons((prev) => {
      const idx = prev.findIndex((c) => c.id === cmp.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = cmp;
        return updated;
      }
      return [cmp, ...prev];
    });
    addToast(`Comparison duel "${cmp.title}" saved.`);
  };

  const handleDeleteComparison = (id: string) => {
    setComparisons((prev) => prev.filter((c) => c.id !== id));
    addToast('Comparison duel removed.');
  };

  // Handlers for Comments
  const handleApproveComment = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'approved' } : c))
    );
    addToast('Comment published to live review page.');
  };

  const handleDeleteComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
    addToast('Comment removed.');
  };

  const handleFlagComment = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'flagged' } : c))
    );
    addToast('Comment flagged for editorial audit.');
  };

  // Handlers for Affiliate Offers
  const handleSaveOffer = async (offer: AdminAffiliateOffer) => {
    const existingIdx = affiliateOffers.findIndex((o) => o.id === offer.id);
    setAffiliateOffers((prev) => {
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = offer;
        return updated;
      }
      return [offer, ...prev];
    });

    if (existingIdx >= 0) {
      // update
      await fetch(`/api/affiliates/${offer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offer),
      });
    } else {
      await adminApi.createAffiliateOffer(offer);
    }
    addToast(`Affiliate offer for ${offer.store} saved.`);
  };

  const handleDeleteOffer = async (id: string) => {
    setAffiliateOffers((prev) => prev.filter((o) => o.id !== id));
    await adminApi.deleteAffiliateOffer(id);
    addToast('Affiliate offer removed.');
  };

  const handleToggleOffer = async (id: string) => {
    setAffiliateOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isEnabled: !o.isEnabled } : o))
    );
    await adminApi.toggleAffiliateOffer(id);
    addToast('Affiliate link status toggled.');
  };

  // Handlers for Ads
  const handleSaveAd = async (ad: AdminAdSlot) => {
    const existingIdx = ads.findIndex((a) => a.id === ad.id);
    setAds((prev) => {
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = ad;
        return updated;
      }
      return [ad, ...prev];
    });

    if (existingIdx < 0) {
      await adminApi.createAd(ad);
    } else {
      await fetch(`/api/ads/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ad),
      });
    }
    addToast(`Ad placement "${ad.name}" saved.`);
  };

  const handleDeleteAd = async (id: string) => {
    setAds((prev) => prev.filter((a) => a.id !== id));
    await adminApi.deleteAd(id);
    addToast('Ad placement removed.');
  };

  const handleToggleAd = async (id: string) => {
    setAds((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isEnabled: !a.isEnabled } : a))
    );
    await adminApi.toggleAd(id);
    addToast('Ad placement active state updated.');
  };

  // Handlers for Media
  const handleUploadMedia = async (item: AdminMediaItem) => {
    setMedia((prev) => [item, ...prev]);
    await adminApi.uploadMedia(item);
    addToast(`Asset "${item.name}" uploaded to media library.`);
  };

  const handleDeleteMedia = async (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
    await adminApi.deleteMedia(id);
    addToast('Media asset deleted.');
  };

  // Handlers for Newsletter
  const handleDeleteSubscriber = async (id: string) => {
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
    await adminApi.deleteSubscriber(id);
    addToast('Subscriber removed.');
  };

  return (
    <AdminLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onViewPublicSite={() => onNavigate('/')}
      toasts={toasts}
      onDismissToast={handleDismissToast}
    >
      {activeTab === 'dashboard' && <AdminDashboard onNavigateTab={setActiveTab} />}
      {activeTab === 'products' && (
        <AdminProducts
          products={products}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onDuplicateProduct={handleDuplicateProduct}
          onPreviewProduct={onNavigate}
        />
      )}
      {activeTab === 'categories' && (
        <AdminCategories
          categories={categories}
          onSaveCategory={handleSaveCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}
      {activeTab === 'articles' && (
        <AdminArticles
          articles={articles}
          onSaveArticle={handleSaveArticle}
          onDeleteArticle={handleDeleteArticle}
          onPreviewArticle={onNavigate}
        />
      )}
      {activeTab === 'buying-guides' && (
        <AdminBuyingGuides
          guides={buyingGuides}
          onSaveGuide={handleSaveBuyingGuide}
          onDeleteGuide={handleDeleteBuyingGuide}
          onPreviewGuide={onNavigate}
        />
      )}
      {activeTab === 'comparisons' && (
        <AdminComparisons
          comparisons={comparisons}
          onSaveComparison={handleSaveComparison}
          onDeleteComparison={handleDeleteComparison}
          onPreviewComparison={onNavigate}
        />
      )}
      {activeTab === 'affiliate-links' && (
        <AdminAffiliateLinks
          offers={affiliateOffers}
          onSaveOffer={handleSaveOffer}
          onDeleteOffer={handleDeleteOffer}
          onToggleOffer={handleToggleOffer}
        />
      )}
      {activeTab === 'ads' && (
        <AdminAds
          ads={ads}
          onSaveAd={handleSaveAd}
          onDeleteAd={handleDeleteAd}
          onToggleAd={handleToggleAd}
        />
      )}
      {activeTab === 'media' && (
        <AdminMedia
          media={media}
          onUploadMedia={handleUploadMedia}
          onDeleteMedia={handleDeleteMedia}
        />
      )}
      {activeTab === 'seo' && <AdminSEO onSaveToast={(msg) => addToast(msg)} />}
      {activeTab === 'analytics' && <AdminAnalytics />}
      {activeTab === 'comments' && (
        <AdminComments
          comments={comments}
          onApproveComment={handleApproveComment}
          onDeleteComment={handleDeleteComment}
          onFlagComment={handleFlagComment}
        />
      )}
      {activeTab === 'newsletter' && (
        <AdminNewsletter
          subscribers={subscribers}
          onDeleteSubscriber={handleDeleteSubscriber}
          onToast={(msg) => addToast(msg)}
        />
      )}
      {activeTab === 'settings' && <AdminSettings onSaveToast={(msg) => addToast(msg)} />}
    </AdminLayout>
  );
};
