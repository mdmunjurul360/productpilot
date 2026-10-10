import React, { useEffect } from 'react';
import { JsonLdSchema } from './JsonLdSchema';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  schemas?: (Record<string, unknown> | Array<Record<string, unknown>>)[];
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  ogImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=630&auto=format&fit=crop&q=80',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  schemas = [],
}) => {
  const fullTitle = title.includes('ProductPilot') ? title : `${title} — ProductPilot`;
  const canonicalUrl = `https://productpilot.com${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = fullTitle;

    // 2. Helper to set or update meta tag
    const setMetaTag = (nameAttr: 'name' | 'property', attrValue: string, contentValue: string) => {
      let meta = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(nameAttr, attrValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', contentValue);
    };

    // 3. Primary Meta Tags
    setMetaTag('name', 'description', description);

    // 4. Canonical Tag
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // 5. OpenGraph Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', ogType);

    // 6. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 7. Article specific metadata for Google Discover
    if (ogType === 'article' && publishedTime) {
      setMetaTag('property', 'article:published_time', publishedTime);
      if (modifiedTime) setMetaTag('property', 'article:modified_time', modifiedTime);
      if (author) setMetaTag('property', 'article:author', author);
    }
  }, [fullTitle, description, canonicalUrl, ogImage, ogType, publishedTime, modifiedTime, author]);

  return (
    <>
      {schemas.map((schemaData, idx) => (
        <JsonLdSchema key={idx} data={schemaData} />
      ))}
    </>
  );
};
