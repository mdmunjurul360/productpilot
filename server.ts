import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/routes';
import { db } from './server/db';
import { config } from './server/config';
import { logger } from './server/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = config.port;
  const isProd = config.isProd;
  const BASE_URL = config.baseUrl;

  // 1. Correlation ID & Observability Telemetry Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const reqId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
    res.setHeader('X-Request-ID', reqId);
    (req as unknown as { requestId: string }).requestId = reqId;
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      if (req.path.startsWith('/api') && req.path !== '/api/ping') {
        logger.info(`${req.method} ${req.path} [${res.statusCode}] - ${duration}ms`, undefined, reqId);
      }
    });
    next();
  });

  // 2. Security & Body Parsers
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 3. Maintenance Mode Interceptor
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (db.settings.maintenanceMode?.enabled) {
      const isBypass =
        req.path.startsWith('/api/auth') ||
        req.path.startsWith('/api/admin') ||
        req.cookies?.productpilot_admin_session ||
        req.path === '/api/ping' ||
        req.path.startsWith('/assets/');

      if (!isBypass) {
        if (req.path.startsWith('/api')) {
          return res.status(503).json({
            success: false,
            maintenance: true,
            message: db.settings.maintenanceMode.message || 'System currently undergoing scheduled maintenance.',
          });
        }
        return res.status(503).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ProductPilot — Scheduled Maintenance</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#020617; color:#f8fafc; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; box-sizing:border-box; }
    .card { max-width:480px; width:100%; background:#0f172a; border:1px solid #1e293b; padding:40px 32px; border-radius:24px; text-align:center; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); }
    .badge { display:inline-block; padding:4px 12px; background:rgba(37,99,235,0.15); border:1px solid rgba(37,99,235,0.3); border-radius:999px; font-size:12px; font-weight:700; color:#60a5fa; margin-bottom:16px; }
    h1 { font-size:22px; margin:0 0 12px 0; color:#ffffff; font-weight:800; }
    p { font-size:14px; line-height:1.6; color:#94a3b8; margin:0 0 24px 0; }
    .footer { font-size:11px; color:#64748b; border-top:1px solid #1e293b; pt:16px; margin-top:16px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">ProductPilot Infrastructure</div>
    <h1>Scheduled Maintenance</h1>
    <p>${db.settings.maintenanceMode.message || 'We are currently performing routine infrastructure upgrades to ensure high availability and sub-second performance. We will be back online shortly.'}</p>
    <div class="footer">ProductPilot Labs · Operational Status Verified</div>
  </div>
</body>
</html>`);
      }
    }
    next();
  });

  // 4. Production Security Headers & CSP (Google AdSense & Analytics Ready)
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // AdSense & Script CSP
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self' https: data: blob:; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com data:; " +
      "img-src 'self' data: blob: https:; " +
      "connect-src 'self' https:; " +
      "frame-src 'self' https://www.youtube.com https://googleads.g.doubleclick.net https://pagead2.googlesyndication.com;"
    );
    next();
  });

  // 3. 301 Canonical URL Redirects Middleware
  const KNOWN_REDIRECTS: Record<string, string> = {
    '/reviews/sony-xm4': '/reviews/sony-wh-1000xm5',
    '/reviews/xm5': '/reviews/sony-wh-1000xm5',
    '/guides/best-headphones': '/buying-guides/best-anc-headphones-travel',
    '/macbook-m3': '/reviews/apple-macbook-pro-16-m4-max',
    '/reviews/macbook-pro': '/reviews/apple-macbook-pro-16-m4-max',
    '/vacuum': '/reviews/roborock-s8-pro-ultra',
  };

  app.use((req: Request, res: Response, next: NextFunction) => {
    const target = KNOWN_REDIRECTS[req.path];
    if (target) {
      return res.redirect(301, target);
    }
    next();
  });

  // 4. Universal Cloaked Affiliate Redirect Engine (/go/:slug) with UTM preservation
  app.get('/go/:slug', (req: Request, res: Response) => {
    const slug = req.params.slug;
    const offer = db.affiliateOffers.find(
      (o) =>
        o.id === slug ||
        o.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug ||
        o.affiliateUrl.includes(slug)
    );

    if (offer && offer.isEnabled) {
      offer.clicksCount += 1;
      db.saveToDisk();

      // Append standard UTM tracking parameters for merchant attribution
      try {
        const dest = new URL(offer.affiliateUrl);
        if (!dest.searchParams.has('utm_source')) dest.searchParams.set('utm_source', 'productpilot');
        if (!dest.searchParams.has('utm_medium')) dest.searchParams.set('utm_medium', 'affiliate_editorial');
        if (!dest.searchParams.has('utm_campaign')) dest.searchParams.set('utm_campaign', offer.store.toLowerCase());
        res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
        return res.redirect(302, dest.toString());
      } catch {
        return res.redirect(302, offer.affiliateUrl);
      }
    }

    // Fallback to Amazon search if specific cloaked link not found
    return res.redirect(302, `https://amazon.com?tag=${db.settings.affiliateIds.amazon}`);
  });

  // 5. XML Sitemap Index (/sitemap.xml)
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-main.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-products.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-categories.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-articles.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-images.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    res.send(xml);
  });

  // 5a. Main Static Sitemap (/sitemap-main.xml)
  app.get('/sitemap-main.xml', (_req: Request, res: Response) => {
    const staticRoutes = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/categories', priority: '0.85', changefreq: 'weekly' },
      { path: '/buying-guides', priority: '0.85', changefreq: 'weekly' },
      { path: '/compare', priority: '0.85', changefreq: 'weekly' },
      { path: '/deals', priority: '0.9', changefreq: 'daily' },
      { path: '/how-we-test', priority: '0.7', changefreq: 'monthly' },
      { path: '/affiliate-disclosure', priority: '0.6', changefreq: 'monthly' },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  });

  // 5b. Product Reviews Sitemap (/sitemap-products.xml)
  app.get('/sitemap-products.xml', (_req: Request, res: Response) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${db.products
  .map(
    (p) => `  <url>
    <loc>${BASE_URL}/reviews/${p.slug}</loc>
    <lastmod>${p.updatedAt ? p.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  });

  // 5c. Category Sitemap (/sitemap-categories.xml)
  app.get('/sitemap-categories.xml', (_req: Request, res: Response) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${db.categories
  .map(
    (c) => `  <url>
    <loc>${BASE_URL}/category/${c.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  });

  // 5d. Articles & Buying Guides Sitemap (/sitemap-articles.xml)
  app.get('/sitemap-articles.xml', (_req: Request, res: Response) => {
    const guides = [
      { slug: 'best-anc-headphones-travel', priority: '0.85' },
      { slug: 'best-robot-vacuums-pet-hair', priority: '0.85' },
      { slug: 'best-laptops-music-production', priority: '0.8' },
    ];

    const comparisons = [
      { slug: 'sony-wh-1000xm5-vs-bose-qc-ultra', priority: '0.85' },
      { slug: 'macbook-pro-16-m4-vs-dell-xps-16', priority: '0.8' },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${guides
  .map(
    (g) => `  <url>
    <loc>${BASE_URL}/buying-guides/${g.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${g.priority}</priority>
  </url>`
  )
  .join('\n')}
${comparisons
  .map(
    (c) => `  <url>
    <loc>${BASE_URL}/compare/${c.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${c.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  });

  // 5e. Google Images Sitemap (/sitemap-images.xml)
  app.get('/sitemap-images.xml', (_req: Request, res: Response) => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${db.products
  .map(
    (p) => `  <url>
    <loc>${BASE_URL}/reviews/${p.slug}</loc>
    <image:image>
      <image:loc>${p.featuredImage}</image:loc>
      <image:title>${p.name.replace(/&/g, '&amp;')}</image:title>
      <image:caption>${(p.shortDescription || p.name).replace(/&/g, '&amp;')}</image:caption>
    </image:image>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  });

  // 6. Dynamic Robots.txt
  app.get('/robots.txt', (_req: Request, res: Response) => {
    const robots = `User-agent: *
Disallow: /admin
Disallow: /api/
Disallow: /go/
Allow: /

# Google Discover & News crawler guidelines
User-agent: Googlebot
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml
Sitemap: ${BASE_URL}/sitemap-products.xml
Sitemap: ${BASE_URL}/sitemap-articles.xml
Sitemap: ${BASE_URL}/sitemap-images.xml
`;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(robots);
  });

  // 6b. Affiliate Redirects & Click Tracking
  app.get('/go/:slug', (req: Request, res: Response) => {
    const slug = req.params.slug;
    const requestedStore = (req.query.store as string)?.toLowerCase();

    const product = db.products.find(p => p.slug === slug && !p.isDeleted);
    let offer = null;

    if (product) {
      const offers = db.affiliateOffers.filter(o => o.productId === product.id && o.isEnabled && !o.isDeleted);
      if (offers.length > 0) {
        if (requestedStore) {
          offer = offers.find(o => o.store.toLowerCase() === requestedStore) || offers[0];
        } else {
          offer = offers[0];
        }
      }
    }

    if (!offer) {
      return res.status(404).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Offer Not Found — ProductPilot</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#020617; color:#f8fafc; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; box-sizing:border-box; }
    .card { max-width:480px; width:100%; background:#0f172a; border:1px solid #1e293b; padding:40px 32px; border-radius:24px; text-align:center; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); }
    .badge { display:inline-block; padding:4px 12px; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); border-radius:999px; font-size:12px; font-weight:700; color:#f87171; margin-bottom:16px; }
    h1 { font-size:22px; margin:0 0 12px 0; color:#ffffff; font-weight:800; }
    p { font-size:14px; line-height:1.6; color:#94a3b8; margin:0 0 24px 0; }
    a { display:inline-block; padding:10px 20px; background:#2563eb; color:white; text-decoration:none; border-radius:8px; font-weight:600; font-size:14px; }
    a:hover { background:#1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">404 - Offer Expired</div>
    <h1>Offer No Longer Available</h1>
    <p>The affiliate link you clicked has expired or the product is no longer available from our partners.</p>
    <a href="/">Return to Homepage</a>
  </div>
</body>
</html>`);
    }

    // Record click for analytics (modifying in-memory DB)
    offer.clicksCount = (offer.clicksCount || 0) + 1;

    // Preserve tracking parameters by appending query string if needed
    let finalUrl = offer.affiliateUrl;
    try {
      const urlObj = new URL(finalUrl);
      Object.keys(req.query).forEach(key => {
        if (key !== 'store') {
          urlObj.searchParams.append(key, req.query[key] as string);
        }
      });
      finalUrl = urlObj.toString();
    } catch (e) {
      // Ignored if URL is invalidly formatted in DB
    }
    
    // Server-side redirect
    res.redirect(302, finalUrl);
  });

  // 7. Mount Core Health & Observability Probes
  app.get('/api/ping', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    const mem = process.memoryUsage();
    res.setHeader('Cache-Control', 'no-cache, no-store');
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      environment: config.env,
      version: '2.4.0',
      memory: {
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
      },
      counts: {
        products: db.products.filter((p) => !p.isDeleted).length,
        articles: db.articles.filter((a) => !a.isDeleted).length,
        categories: db.categories.length,
        subscribers: db.subscribers.filter((s) => !s.isDeleted).length,
      },
    });
  });

  // 8. Mount Main API Router
  app.use('/api', apiRouter);

  // 9. Centralized Production Error Handling Middleware (No Stack Traces Leaked)
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const reqId = (req as unknown as { requestId?: string }).requestId;
    logger.error('Unhandled server exception', err, undefined, reqId);
    if (res.headersSent) return;
    res.status(500).json({
      success: false,
      error: 'An internal server processing error occurred. Please retry shortly.',
      requestId: reqId,
    });
  });

  // 10. Vite Integration in Development
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ProductPilot full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start ProductPilot server:', err);
  process.exit(1);
});
