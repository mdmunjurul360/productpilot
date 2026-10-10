# ProductPilot — Enterprise Hardware Review & Smart Affiliate Platform

> **Discover Better Products. Buy Smarter.**  
> Production-Grade Editorial Review, Intelligent Comparison, and Multi-Merchant Monetization Engine.

---

## 1. Project Overview

ProductPilot is an enterprise-grade web application built to compete with top editorial publications such as *Wirecutter* and *RTINGS*. It combines laboratory testing benchmarks with automated affiliate monetization across **Amazon Associates**, **eBay Partner Network (EPN)**, **AliExpress Affiliate**, and **Daraz Marketplace**.

## 2. Features

- **Publication-Grade Editorial Reviews:** Benchmark charts, noise attenuation curves, pros/cons breakdown, and multi-merchant real-time offer tables.
- **Intelligent Global Discovery (`⌘K`):** Instant search with fuzzy query matching, category filters, and live keyword highlighting.
- **Head-to-Head Comparison Engine:** Interactive comparison matrix with spec highlighting, winner verdict badges, and comparison docks.
- **Monetization & AdSense Ready:** Clean reserved containers with zero Cumulative Layout Shift (CLS), labeled sponsored links, and cloaked outbound redirect routes (`/go/:slug`).
- **Technical SEO & Structured Data:** Automatic JSON-LD schema generation, XML Sitemap Index, and dynamic canonical meta tags.
- **Production Resilience:** Centralized structured logging, error boundaries, disaster recovery snapshots, and maintenance mode gating.

## 3. Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Vite 8, Lucide React
- **Backend:** Node.js, Express, custom JSON Atomic Database
- **Security:** Helmet, rate limiting, crypto (PBKDF2/Scrypt, HMAC-SHA256)
- **Validation:** Zod

## 4. Screenshots

*(Replace these with actual screenshots of your application)*

| Homepage | Review Article |
|----------|----------------|
| ![Homepage Placeholder](https://via.placeholder.com/400x250.png?text=Homepage+Screenshot) | ![Review Article Placeholder](https://via.placeholder.com/400x250.png?text=Review+Article+Screenshot) |

| Smart Search | Admin Dashboard |
|--------------|-----------------|
| ![Smart Search Placeholder](https://via.placeholder.com/400x250.png?text=Smart+Search+Screenshot) | ![Admin Dashboard Placeholder](https://via.placeholder.com/400x250.png?text=Admin+Dashboard+Screenshot) |

## 5. Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/productpilot.git
   cd productpilot
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   # Edit .env and configure your secrets
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5000`.

## 6. Environment Variables

Copy `.env.example` to `.env` to configure your target tier:

| Environment Variable | Description |
| :--- | :--- |
| `NODE_ENV` | `development`, `staging`, `production` |
| `PORT` | Network port for the Express full-stack listener (Default: `5000`) |
| `BASE_URL` | Canonical base URL used for OpenGraph cards, sitemaps |
| `ADMIN_EMAIL` | Super administrator login account |
| `ADMIN_PASSWORD_HASH` | Bcrypt or Scrypt hash of your admin password |
| `ADMIN_SESSION_SECRET` | High-entropy HMAC-SHA256 signature secret for admin session tokens |
| `RATE_LIMIT_MAX` | Token-bucket requests per minute window limit |
| `AMAZON_AFFILIATE_TAG` | Amazon Associates tag |
| `EBAY_CAMPAIGN_ID` | eBay Partner Network identifier |
| `ALIEXPRESS_SUB_ID` | AliExpress affiliate tracking parameter |
| `DARAZ_AFFILIATE_ID` | Daraz affiliate publisher ID |
| `GA4_MEASUREMENT_ID` | Google Analytics 4 event collection ID |
| `GTM_CONTAINER_ID` | Google Tag Manager container tag |
| `EMAIL_PROVIDER` | `console`, `smtp`, `sendgrid`, `resend`, `ses` |
| `EMAIL_FROM` | Sender address for newsletter |

## 7. AI Transparency Notice

*Note: AI tools and LLMs were used during the early prototyping and scaffolding phases of this project to accelerate boilerplate generation. All subsequent integration, debugging, security auditing, customization, testing, and ongoing maintenance were performed manually by the author to ensure professional grade quality and security.*

## 8. License

This project is licensed under the MIT License - see the LICENSE file for details.
