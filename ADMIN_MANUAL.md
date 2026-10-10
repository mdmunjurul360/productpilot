# ProductPilot — Super Administrator Operations Manual

**Target Audience:** Editorial Directors, Content Managers, and Systems Administrators  
**Access URL:** `/admin` or click "Editorial Control Panel" in the site footer  
**Default Credentials:** `admin@productpilot.com` / `pilot2026`  

---

## 1. Authentication & Session Security

- **Login Screen:** Access via `/admin` when unauthenticated.
- **Session Duration:** 24 hours standard; 30 days if "Keep me signed in for 30 days" is selected.
- **Session Protection:** Secured with an HTTP-Only encrypted cookie (`productpilot_admin_session`) and signed using HMAC-SHA256.
- **Rate Limiting:** Failed login attempts are throttled to a maximum of 6 tries per 15-minute window to prevent brute force attacks.

---

## 2. Catalog & Hardware Management

### 2.1 Adding a New Hardware Product
1. In the sidebar, select **Products & Gear**.
2. Click **+ Add Product**.
3. Complete the specifications:
   - **Name & Model:** e.g., *Sony WH-1000XM5*
   - **Category & Subcategory:** Select from active taxonomy nodes.
   - **Brand:** Assign manufacturer.
   - **Editorial Rating:** Enter a score between 1.0 and 10.0.
   - **Pros & Cons:** Add bullet points verified during laboratory testing.
   - **Who Should Buy / Who Should Avoid:** Target audience guidance.
4. Set status to `Draft`, `Published`, or `Scheduled`.
5. Click **Save Product**.

### 2.2 Managing Categories
1. In the sidebar, select **Categories**.
2. Create or organize primary categories (e.g., *Audio & Visual*, *Computing & Laptops*, *Smart Home*).
3. Assign custom icons and SVG badges.
4. Set category SEO Title and Meta Description for Google search indexing.

---

## 3. Commercial Monetization & Affiliate Links

### 3.1 Managing Affiliate Offers
1. In the sidebar, select **Affiliate Links**.
2. Add retail offers for specific products:
   - **Supported Merchants:** Amazon, eBay, AliExpress, Daraz, or Custom Retailer.
   - **Price & Discount:** Current retail price, list price, and coupon code (if available).
   - **Availability:** In Stock, Limited Stock, Out of Stock, or Pre-order.
   - **Priority:** Higher priority merchants appear at the top of price comparison tables.
3. Every link is automatically cloaked through `/go/:slug` with UTM attribution and `rel="sponsored nofollow noopener noreferrer"`.

### 3.2 Advertisement Slots (Google AdSense & Direct Sponsors)
1. In the sidebar, select **Ad Placements**.
2. Available slot locations:
   - `Header Leaderboard (728x90)`
   - `Sidebar Skyscraper (300x600)`
   - `In-Content Medium Rectangle (300x250)`
   - `After Content Banner`
   - `Mobile Sticky Footer Banner (320x50)`
3. Toggle slots active or inactive instantly without redeploying code.
4. Paste Google AdSense `ins` snippet or custom sponsor HTML banners.

---

## 4. Technical SEO & Schema Verification

1. In the sidebar, select **SEO & Schemas**.
2. Audit URL route configurations:
   - Dynamic Meta Title & Description
   - Canonical URL enforcement
   - OpenGraph 1200x630 featured share preview
   - Schema type assignment (`Product`, `Review`, `FAQPage`, `BreadcrumbList`)
3. Test XML Sitemap availability at `/sitemap.xml`.

---

## 5. System Infrastructure & Disaster Recovery

### 5.1 Creating a Point-in-Time Database Backup
1. Navigate to **Site Settings > Production Infrastructure**.
2. Click **+ Create Snapshot**.
3. A verified JSON archive with a SHA-256 integrity hash is immediately generated.
4. Click **Download** to save an offsite copy to your local machine.

### 5.2 Restoring from a Snapshot
1. In **Production Infrastructure**, locate the desired snapshot in the backup history table.
2. Click **Restore**.
3. A pre-restore safety snapshot is automatically created before applying the restored data.

### 5.3 Database Integrity Self-Healing
1. In **Production Infrastructure**, click **Run Integrity Audit**.
2. The auditor scans all relational links between categories, products, and affiliate offers.
3. If any orphaned relations are detected, click **Auto-Repair Inconsistencies** to reconcile them automatically.

### 5.4 Enabling Maintenance Mode
1. In **Production Infrastructure**, toggle **Maintenance Mode Gate**.
2. Provide a visitor message (e.g., *"ProductPilot is currently undergoing scheduled infrastructure upgrades."*).
3. Public visitors will receive an HTTP 503 Maintenance screen.
4. Authenticated administrators bypass the maintenance screen and retain full system access.
