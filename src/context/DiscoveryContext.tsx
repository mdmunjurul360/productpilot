import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  subcategory: string;
  price: string;
  numericPrice: number;
  originalPrice?: string;
  discount?: string;
  rating: number;
  userRating: number;
  reviewsCount: number;
  image: string;
  gallery?: string[];
  merchant: 'Amazon' | 'eBay' | 'AliExpress' | 'Daraz';
  merchantsAvailable: ('Amazon' | 'eBay' | 'AliExpress' | 'Daraz')[];
  affiliateUrl: string;
  availability: 'In Stock' | 'Limited Stock' | 'Pre-order';
  badge?: 'Editor\'s Choice' | 'Best Seller' | 'Trending' | 'Hot Deal' | 'Top Rated' | 'Price Drop' | 'Premium Pick' | 'Best Value';
  shortDescription: string;
  specs: {
    dimensions: string;
    weight: string;
    battery: string;
    connectivity: string;
    performance: string;
    compatibility: string;
    warranty: string;
    material?: string;
    ancRating?: string;
  };
  pros: string[];
  cons: string[];
  releaseDate: string;
  isFeatured?: boolean;
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning';
}

interface DiscoveryContextType {
  // Favorites
  favorites: CatalogProduct[];
  addFavorite: (product: CatalogProduct) => void;
  removeFavorite: (productId: string) => void;
  toggleFavorite: (product: CatalogProduct) => void;
  isFavorite: (productId: string) => boolean;
  isSavedDrawerOpen: boolean;
  setIsSavedDrawerOpen: (open: boolean) => void;

  // Comparison
  compareList: CatalogProduct[];
  addToCompare: (product: CatalogProduct) => boolean; // returns false if max (4) reached
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: CatalogProduct) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  isCompareDockOpen: boolean;
  setIsCompareDockOpen: (open: boolean) => void;

  // Recently Viewed
  recentlyViewed: CatalogProduct[];
  addRecentlyViewed: (product: CatalogProduct) => void;
  clearRecentlyViewed: () => void;

  // Search Modal
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  dismissToast: (id: string) => void;
}

const DiscoveryContext = createContext<DiscoveryContextType | undefined>(undefined);

export const DiscoveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Favorites (LocalStorage)
  const [favorites, setFavorites] = useState<CatalogProduct[]>(() => {
    try {
      const saved = localStorage.getItem('productpilot_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Compare List (LocalStorage, max 4 products)
  const [compareList, setCompareList] = useState<CatalogProduct[]>(() => {
    try {
      const saved = localStorage.getItem('productpilot_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompareDockOpen, setIsCompareDockOpen] = useState(true);

  // Recently Viewed (LocalStorage, max 10 products)
  const [recentlyViewed, setRecentlyViewed] = useState<CatalogProduct[]>(() => {
    try {
      const saved = localStorage.getItem('productpilot_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Persist Favorites
  useEffect(() => {
    try {
      localStorage.setItem('productpilot_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage error saving favorites:', e);
    }
  }, [favorites]);

  // Persist Compare List
  useEffect(() => {
    try {
      localStorage.setItem('productpilot_compare', JSON.stringify(compareList));
    } catch (e) {
      console.warn('LocalStorage error saving compare list:', e);
    }
  }, [compareList]);

  // Persist Recently Viewed
  useEffect(() => {
    try {
      localStorage.setItem('productpilot_recently_viewed', JSON.stringify(recentlyViewed));
    } catch (e) {
      console.warn('LocalStorage error saving recently viewed:', e);
    }
  }, [recentlyViewed]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addFavorite = (product: CatalogProduct) => {
    setFavorites((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev;
      return [product, ...prev];
    });
    showToast(`Added "${product.name}" to your bookmarks.`);
  };

  const removeFavorite = (productId: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
    showToast('Removed from bookmarks.', 'info');
  };

  const toggleFavorite = (product: CatalogProduct) => {
    if (favorites.some((p) => p.id === product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some((p) => p.id === productId);
  };

  const addToCompare = (product: CatalogProduct): boolean => {
    if (compareList.some((p) => p.id === product.id)) {
      showToast(`"${product.name}" is already in comparison.`, 'info');
      return true;
    }
    if (compareList.length >= 4) {
      showToast('Maximum 4 products can be compared at once. Remove one first.', 'warning');
      return false;
    }
    setCompareList((prev) => [...prev, product]);
    showToast(`Added "${product.name}" to comparison (${compareList.length + 1}/4).`);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
    showToast('Removed from comparison.', 'info');
  };

  const toggleCompare = (product: CatalogProduct) => {
    if (compareList.some((p) => p.id === product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const isInCompare = (productId: string) => {
    return compareList.some((p) => p.id === productId);
  };

  const clearCompare = () => {
    setCompareList([]);
    showToast('Comparison list cleared.', 'info');
  };

  const addRecentlyViewed = (product: CatalogProduct) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    showToast('Recently viewed history cleared.', 'info');
  };

  return (
    <DiscoveryContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        isSavedDrawerOpen,
        setIsSavedDrawerOpen,

        compareList,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        isCompareDockOpen,
        setIsCompareDockOpen,

        recentlyViewed,
        addRecentlyViewed,
        clearRecentlyViewed,

        isSearchModalOpen,
        setIsSearchModalOpen,

        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
};

export const useDiscovery = () => {
  const context = useContext(DiscoveryContext);
  if (!context) {
    throw new Error('useDiscovery must be used within a DiscoveryProvider');
  }
  return context;
};
