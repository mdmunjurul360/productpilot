import { UNIFIED_CATALOG } from './unifiedCatalog';
import { TRENDING_PRODUCTS, FEATURED_CATEGORIES, LATEST_REVIEWS, BUYING_GUIDES } from './homepageData';

export async function syncFrontendWithBackend() {
  try {
    const res = await fetch('/api/frontend-sync');
    if (!res.ok) throw new Error('Failed to fetch backend data');
    const data = await res.json();
    
    if (data.success && data.catalog) {
      // Overwrite static arrays with dynamic data
      UNIFIED_CATALOG.length = 0;
      UNIFIED_CATALOG.push(...data.catalog);

      TRENDING_PRODUCTS.length = 0;
      TRENDING_PRODUCTS.push(...data.trending);

      FEATURED_CATEGORIES.length = 0;
      FEATURED_CATEGORIES.push(...data.categories);

      LATEST_REVIEWS.length = 0;
      LATEST_REVIEWS.push(...data.reviews);

      BUYING_GUIDES.length = 0;
      BUYING_GUIDES.push(...data.buyingGuides);
      
      console.log('Successfully unified frontend architecture with backend dynamic API.');
    }
  } catch (error) {
    console.error('Failed to sync frontend with backend:', error);
  }
}
