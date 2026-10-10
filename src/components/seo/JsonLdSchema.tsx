import React from 'react';

interface JsonLdSchemaProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export const JsonLdSchema: React.FC<JsonLdSchemaProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

// 1. Organization Schema (Google Knowledge Graph & E-E-A-T)
export const createOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ProductPilot',
  alternateName: 'ProductPilot Lab & Editorial Publishing',
  url: 'https://productpilot.com',
  logo: 'https://productpilot.com/logo.svg',
  description: 'Independent hardware testing laboratory, in-depth editorial product reviews, and consumer electronics comparison engine.',
  foundingDate: '2022',
  sameAs: [
    'https://twitter.com/ProductPilotLab',
    'https://youtube.com/@ProductPilotLab',
    'https://facebook.com/ProductPilotLab',
    'https://linkedin.com/company/productpilot',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'editorial@productpilot.com',
    contactType: 'Editorial & Hardware Inquiries',
    areaServed: 'Worldwide',
    availableLanguage: ['English'],
  },
  knowsAbout: [
    'Audio Engineering',
    'Active Noise Cancellation Benchmarking',
    'Display Technology & OLED Calibration',
    'Computer Hardware & Workstations',
    'Smart Home Automation',
  ],
});

// 2. WebSite Schema with Sitelinks Searchbox
export const createWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ProductPilot',
  url: 'https://productpilot.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://productpilot.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
});

// 3. WebPage Schema
export const createWebPageSchema = (page: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: page.title,
  description: page.description,
  url: page.url,
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    name: 'ProductPilot',
    url: 'https://productpilot.com',
  },
  ...(page.datePublished && { datePublished: page.datePublished }),
  ...(page.dateModified && { dateModified: page.dateModified }),
});

// 4. BreadcrumbList Schema
export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `https://productpilot.com${item.url}`,
  })),
});

// 5. Product & Review Schema (Full Google Rich Snippet compliance)
export const createProductReviewSchema = (review: {
  name: string;
  image: string;
  description: string;
  brand: string;
  score: number;
  author: string;
  publishedDate: string;
  lowPrice: string;
  highPrice: string;
  sku?: string;
  mpn?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: review.name,
  image: [review.image],
  description: review.description,
  sku: review.sku || `PP-${review.name.replace(/[^A-Za-z0-9]/g, '-').toUpperCase().slice(0, 12)}`,
  mpn: review.mpn || review.name,
  brand: {
    '@type': 'Brand',
    name: review.brand,
  },
  review: {
    '@type': 'Review',
    name: `${review.name} In-Depth Lab Review`,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.score,
      bestRating: 10,
      worstRating: 1,
    },
    author: {
      '@type': 'Person',
      name: review.author,
      jobTitle: 'Senior Audio Engineer & Reviewer',
      affiliation: {
        '@type': 'Organization',
        name: 'ProductPilot Test Labs',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'ProductPilot',
      logo: {
        '@type': 'ImageObject',
        url: 'https://productpilot.com/logo.svg',
      },
    },
    datePublished: review.publishedDate,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: review.score,
    bestRating: 10,
    worstRating: 1,
    reviewCount: 48,
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: parseFloat(review.lowPrice.replace(/[^0-9.]/g, '') || '0'),
    highPrice: parseFloat(review.highPrice.replace(/[^0-9.]/g, '') || '0'),
    offerCount: 4,
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'Amazon, eBay, AliExpress, Daraz',
    },
  },
});

// 6. Article & NewsArticle Schema (Google Discover Ready)
export const createArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorRole?: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  image: [article.image],
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': article.url,
  },
  author: {
    '@type': 'Person',
    name: article.authorName,
    jobTitle: article.authorRole || 'Editorial Staff & Hardware Specialist',
  },
  publisher: {
    '@type': 'Organization',
    name: 'ProductPilot',
    logo: {
      '@type': 'ImageObject',
      url: 'https://productpilot.com/logo.svg',
    },
  },
});

// 7. FAQPage Schema
export const createFaqSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

// 8. VideoObject Schema (for YouTube Lab Testing embeds)
export const createVideoObjectSchema = (video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  embedUrl: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: video.name,
  description: video.description,
  thumbnailUrl: [video.thumbnailUrl],
  uploadDate: video.uploadDate,
  embedUrl: video.embedUrl,
});

// 9. ItemList Schema (for Category Hubs & Comparison Matrices)
export const createItemListSchema = (list: {
  name: string;
  description: string;
  itemListElement: { name: string; url: string; position: number; image?: string }[];
}) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: list.name,
  description: list.description,
  numberOfItems: list.itemListElement.length,
  itemListElement: list.itemListElement.map((item) => ({
    '@type': 'ListItem',
    position: item.position,
    name: item.name,
    url: item.url.startsWith('http') ? item.url : `https://productpilot.com${item.url}`,
    ...(item.image && { image: item.image }),
  })),
});

// 10. Person Schema (Author credentials for E-E-A-T)
export const createPersonSchema = (person: {
  name: string;
  role: string;
  bio: string;
  avatar: string;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: person.name,
  jobTitle: person.role,
  description: person.bio,
  image: person.avatar,
  worksFor: {
    '@type': 'Organization',
    name: 'ProductPilot Testing Lab',
  },
});
