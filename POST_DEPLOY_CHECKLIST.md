# Post-Deployment Checklist

After successfully deploying ProductPilot to your VPS and pointing your domain via DNS, run through this checklist to ensure complete production readiness.

## 1. Authentication & Security
- [ ] **Admin Login:** Navigate to `https://yourdomain.com/admin` and verify login succeeds with your `ADMIN_EMAIL` and password.
- [ ] **HTTPS:** Verify that your SSL certificate is active (padlock icon in browser) and `http://` traffic forces a redirect to `https://`.
- [ ] **Secrets:** Ensure `.env` is properly hidden from public view (visiting `https://yourdomain.com/.env` must return 404).

## 2. Core Functional Tests
- [ ] **Product CRUD:** Inside the Admin Panel, create a test product, verify it appears on the homepage, edit it, and then delete it.
- [ ] **Affiliate Redirects:** Click a primary "Buy on Amazon" or similar outbound button. Ensure it passes through `/go/:slug` without 404ing and lands on the correct merchant page.
- [ ] **Analytics Logging:** After clicking an affiliate link, return to the Admin Analytics dashboard to ensure the click was registered.

## 3. SEO & Crawlers
- [ ] **Sitemap:** Visit `https://yourdomain.com/sitemap.xml` and verify all linked sub-sitemaps load correctly.
- [ ] **robots.txt:** Visit `https://yourdomain.com/robots.txt` and ensure `Disallow: /admin` and `Disallow: /go/` are present.
- [ ] **Google Search Console:** Add your domain as a property and submit your `sitemap.xml`.
- [ ] **Google Analytics:** If using tracking, insert your GA tag into the `index.html` file (or via Admin Ad Slots).

## 4. Performance Verification
- [ ] **Lighthouse Audit:** Run a Google Lighthouse scan on a product page. Ensure Mobile/Desktop scores are green (90+).
- [ ] **Mobile Responsiveness:** View the homepage, categories, and comparison matrix on a physical mobile device.

Once complete, your affiliate platform is officially launched.
