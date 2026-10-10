# ProductPilot — Enterprise Production Deployment, Infrastructure & Disaster Recovery Runbook

**Version:** 2.4.0-production  
**Classification:** Operational Runbook & Architecture Specification  
**Application:** ProductPilot Commercial Affiliate & Editorial Review Platform  

---

## 1. System Overview & Runtime Topology

ProductPilot runs as a modern, high-performance full-stack application:
- **Client Tier:** React 19 SPA powered by Vite with tree-shaken Lucide icons, Tailwind CSS, code-split routes, and zero Cumulative Layout Shift (CLS).
- **Server Tier:** Express.js running on Node.js 22 LTS with HTTP-Only secure cookies, token-bucket rate limiting, OWASP-compliant security headers, and structured JSON telemetry.
- **Data Tier:** Atomic persistence engine with SHA-256 checksums, soft-deletion (`isDeleted`), relational foreign-key integrity checking, and in-memory $O(1)$ slug search indexes.
- **Ecosystem Ready:** Native multi-network affiliate monetization (Amazon, eBay, AliExpress, Daraz), Google AdSense compliant ad containers, full XML Sitemap Index, and Schema.org JSON-LD suites.

---

## 2. Environment Configuration Matrix

The application supports three isolated operating tiers:

| Variable | Development | Staging | Production | Description |
| :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | `development` | `staging` | `production` | Enables/disables Vite middleware, debug logs, and CSP policies |
| `PORT` | `3000` | `3000` | `3000` (or injected) | Local TCP binding port |
| `BASE_URL` | `http://localhost:3000` | `https://stage.productpilot.com` | `https://productpilot.com` | Canonical base URL for SEO, OpenGraph, and Sitemaps |
| `ADMIN_EMAIL` | `admin@productpilot.com` | `admin@productpilot.com` | `ops@productpilot.com` | Primary super administrator login handle |
| `ADMIN_SESSION_SECRET` | Dev secret key | 32+ character key | High-entropy 64-char key | HMAC-SHA256 signature secret for admin session tokens |
| `EMAIL_PROVIDER` | `console` | `console` or `smtp` | `resend` / `sendgrid` / `smtp` | Transactional email delivery driver |
| `AMAZON_AFFILIATE_TAG` | `pilot-20` | `pilot-stage-20` | `pilot-20` | Amazon Associates tag injected on outbound retail links |

---

## 3. Containerized Deployment (Docker & Kubernetes)

### 3.1 Building the Production Image
```bash
docker build -t productpilot:latest .
```

### 3.2 Running via Docker Compose
```bash
docker compose up -d
```

### 3.3 Production Healthcheck Probe
The container includes a native zero-dependency health check probe running every 30 seconds:
- **Probe URL:** `http://localhost:3000/api/ping`
- **Expected Return:** `{"status":"ok","timestamp":"..."}` (HTTP 200)
- **Comprehensive Diagnostic Endpoint:** `http://localhost:3000/api/health`

---

## 4. Multi-Platform Deployment Guides

### 4.1 Vercel (Edge & Serverless)
1. Import repository into Vercel Dashboard.
2. The bundled `vercel.json` provides edge rewrites:
   - `/api/*` proxies to the server backend.
   - `/go/*` proxies to the cloaked affiliate router.
   - `/*` routes to `index.html` SPA entry.
3. Configure environment variables in Project Settings.
4. Deploy:
   ```bash
   vercel --prod
   ```

### 4.2 Netlify
1. Netlify automatically detects `netlify.toml` in the repository root.
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy:
   ```bash
   netlify deploy --prod
   ```

### 4.3 Cloudflare Pages
1. Build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
2. Root headers and routing rules are pre-configured in `public/_headers` and `public/_routes.json`.

---

## 5. Database Backup, Integrity Auditing & Disaster Recovery

### 5.1 Automated & Manual Backups
Backups are serialized JSON snapshots containing all products, articles, categories, affiliate links, and settings. Each backup is stamped with a SHA-256 hash.

#### Trigger Backup via API:
```bash
curl -X POST http://localhost:3000/api/admin/system/backup/create \
  -H "Cookie: productpilot_admin_session=<YOUR_TOKEN>" \
  -H "Content-Type: application/json"
```

#### Download Backup for Offsite Archival:
```bash
curl -O http://localhost:3000/api/admin/system/backup/download/<BACKUP_ID> \
  -H "Cookie: productpilot_admin_session=<YOUR_TOKEN>"
```

### 5.2 Recovery Procedure (RTO < 2 minutes, RPO < 1 hour)
If data corruption occurs:
1. Identify the target backup snapshot ID from `/api/admin/system/backups` or the Admin Settings UI.
2. Execute restore command:
   ```bash
   curl -X POST http://localhost:3000/api/admin/system/backup/restore \
     -H "Cookie: productpilot_admin_session=<YOUR_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"id": "<BACKUP_ID>"}'
   ```
3. The restore engine automatically creates a safety snapshot `PRE_RESTORE` before applying changes.
4. Verify database health:
   ```bash
   curl http://localhost:3000/api/admin/system/db-audit \
     -H "Cookie: productpilot_admin_session=<YOUR_TOKEN>"
   ```

### 5.3 Automated Database Self-Healing
If any category or product relationships become orphaned due to manual edits:
- Call `POST /api/admin/system/db-repair`
- The auditor will automatically reconcile foreign keys and repair orphaned affiliate product pointers.

---

## 6. Maintenance Mode Procedures

When performing database migrations or server maintenance:
1. Navigate to **Admin Panel > Settings > Maintenance Mode**.
2. Toggle **Maintenance Mode Enabled**.
3. Provide a user-facing explanation (e.g., *"ProductPilot is currently undergoing scheduled infrastructure upgrades. We will be back online in 10 minutes."*).
4. Save settings.
5. All non-admin public requests will immediately receive HTTP 503 Service Unavailable with the branded maintenance card, while authenticated administrators retain access.

---

## 7. Security Hardening Checklist

- [x] **Content Security Policy (CSP):** Configured for Google AdSense (`pagead2.googlesyndication.com`), Google Analytics (`google-analytics.com`), and Google Tag Manager.
- [x] **X-Frame-Options:** Set to `SAMEORIGIN` to prevent clickjacking.
- [x] **X-Content-Type-Options:** Set to `nosniff` against MIME sniffing.
- [x] **Referrer-Policy:** Set to `strict-origin-when-cross-origin`.
- [x] **Rate Limiting:** Token-bucket throttles auth attempts (max 6 / 15 mins) and writes (max 60 / min).
- [x] **Cloaked Outbound Affiliate Engine:** `/go/:slug` with `rel="sponsored nofollow noopener noreferrer"`.
- [x] **Error Shielding:** Zero stack traces exposed to clients in production.
- [x] **Audit Logging:** Every administrative action is recorded with timestamp, operator ID, and client IP.

---

## 8. Post-Deployment Verification (Smoke Test)

Run the following smoke commands after any production deployment:

```bash
# 1. Verify healthcheck returns healthy status
curl -s http://localhost:3000/api/health | grep '"status":"healthy"'

# 2. Verify XML Sitemap index is valid XML
curl -s http://localhost:3000/sitemap.xml | grep '<sitemapindex'

# 3. Verify Robots.txt allows search engines
curl -s http://localhost:3000/robots.txt | grep 'User-agent: *'

# 4. Verify cloaked affiliate redirect
curl -s -I http://localhost:3000/go/sony-wh-1000xm5 | grep 'HTTP/1.1 302'

# 5. Verify security headers
curl -s -I http://localhost:3000/ | grep 'x-content-type-options: nosniff'
```
