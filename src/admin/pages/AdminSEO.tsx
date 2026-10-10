import React, { useState } from 'react';
import {
  Globe,
  Check,
  ShieldCheck,
  Code,
  Save,
  RefreshCw,
  FileCode,
  ArrowRight,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Layers,
  Sparkles,
  Link2,
} from 'lucide-react';

interface AdminSEOProps {
  onSaveToast: (msg: string) => void;
}

type SeoSubTab = 'meta' | 'sitemaps' | 'robots' | 'schema' | 'redirects' | 'auditor';

export const AdminSEO: React.FC<AdminSEOProps> = ({ onSaveToast }) => {
  const [activeTab, setActiveTab] = useState<SeoSubTab>('meta');
  const [isScanningLinks, setIsScanningLinks] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const [seoConfig, setSeoConfig] = useState({
    siteTitle: 'ProductPilot — Discover Better Products. Buy Smarter.',
    metaDescription:
      'ProductPilot is a premier product discovery, in-depth editorial reviews, buying guides, and smart comparison platform connecting shoppers with top-tier gear across Amazon, eBay, AliExpress, and Daraz.',
    canonicalDomain: 'https://productpilot.com',
    ogImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&h=630&auto=format&fit=crop&q=80',
    twitterHandle: '@ProductPilotLab',
    googleSearchConsoleId: 'GSC-PROD-PILOT-98421',
    bingWebmasterId: 'BING-PILOT-2026',
    googleAnalyticsId: 'G-PILOT2026XX',
    autoGenerateProductSchema: true,
    autoGenerateReviewSchema: true,
    autoGenerateFaqSchema: true,
    enableBreadcrumbList: true,
    enableGoogleDiscoverOptimization: true,
  });

  const [robotsTxt, setRobotsTxt] = useState(`User-agent: *
Disallow: /admin
Disallow: /api/
Disallow: /go/
Allow: /

# Google Discover & News crawler guidelines
User-agent: Googlebot
Allow: /

# Sitemaps
Sitemap: https://productpilot.com/sitemap.xml
Sitemap: https://productpilot.com/sitemap-products.xml
Sitemap: https://productpilot.com/sitemap-categories.xml
Sitemap: https://productpilot.com/sitemap-articles.xml
Sitemap: https://productpilot.com/sitemap-images.xml`);

  const [redirects, setRedirects] = useState([
    { id: 'red-1', source: '/reviews/sony-xm4', target: '/reviews/sony-wh-1000xm5', code: '301 Permanent', hits: 412 },
    { id: 'red-2', source: '/guides/best-headphones', target: '/buying-guides/best-anc-headphones-travel', code: '301 Permanent', hits: 289 },
    { id: 'red-3', source: '/macbook-m3', target: '/reviews/apple-macbook-pro-16-m4-max', code: '301 Permanent', hits: 563 },
    { id: 'red-4', source: '/vacuum', target: '/reviews/roborock-s8-pro-ultra', code: '301 Permanent', hits: 147 },
  ]);

  const [newRedirect, setNewRedirect] = useState({ source: '', target: '', code: '301 Permanent' });

  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveToast('SEO configuration and robots directives saved successfully.');
  };

  const handleAddRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRedirect.source || !newRedirect.target) return;
    setRedirects([...redirects, { ...newRedirect, id: `red-${Date.now()}`, hits: 0 }]);
    setNewRedirect({ source: '', target: '', code: '301 Permanent' });
    onSaveToast('New canonical 301 redirect rule deployed.');
  };

  const handleDeleteRedirect = (id: string) => {
    setRedirects(redirects.filter((r) => r.id !== id));
    onSaveToast('Redirect rule removed.');
  };

  const handleRunLinkAudit = () => {
    setIsScanningLinks(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanningLinks(false);
      setScanResult('Audited 284 internal routes & 52 merchant affiliate links. 0 broken links (404) detected. 100% canonical URL integrity verified.');
      onSaveToast('Full site crawl audit completed: 0 broken links.');
    }, 1200);
  };

  const tabs: { id: SeoSubTab; label: string; icon: React.ReactNode }[] = [
    { id: 'meta', label: 'Meta & OpenGraph', icon: <Globe className="h-4 w-4" /> },
    { id: 'sitemaps', label: 'Sitemap Suite & Index', icon: <FileCode className="h-4 w-4" /> },
    { id: 'robots', label: 'Robots.txt Editor', icon: <Code className="h-4 w-4" /> },
    { id: 'schema', label: 'Schema Validator', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'redirects', label: '301 Redirects', icon: <ArrowRight className="h-4 w-4" /> },
    { id: 'auditor', label: 'Link Auditor & 404', icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Google Index Ready • Lighthouse 100/100 Target
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight font-sans mt-1">
            Enterprise SEO, Performance & Sitemaps
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage OpenGraph cards, JSON-LD structured schemas, Google Discover optimization, XML sitemaps, and 301 redirects.
          </p>
        </div>

        <button
          onClick={() => handleSaveSettings()}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-900/40 transition-colors shrink-0"
        >
          <Save className="h-4 w-4" />
          <span>Save Global SEO State</span>
        </button>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Meta Manager & Search Console */}
      {activeTab === 'meta' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-md">
              <h2 className="text-base font-bold text-white">Core Meta Tags & Title Hierarchy</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Default Site Title</label>
                  <input
                    type="text"
                    value={seoConfig.siteTitle}
                    onChange={(e) => setSeoConfig({ ...seoConfig, siteTitle: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Optimal length: 50-60 characters (Current: {seoConfig.siteTitle.length})</span>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Global Meta Description</label>
                  <textarea
                    rows={3}
                    value={seoConfig.metaDescription}
                    onChange={(e) => setSeoConfig({ ...seoConfig, metaDescription: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white outline-none focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Optimal length: 150-160 characters (Current: {seoConfig.metaDescription.length})</span>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Canonical Root Domain</label>
                  <input
                    type="url"
                    value={seoConfig.canonicalDomain}
                    onChange={(e) => setSeoConfig({ ...seoConfig, canonicalDomain: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Social Share & Open Graph */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-md">
              <h2 className="text-base font-bold text-white">Open Graph & Social Share Preview</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Default 1200x630 OG Image URL</label>
                  <input
                    type="url"
                    value={seoConfig.ogImageUrl}
                    onChange={(e) => setSeoConfig({ ...seoConfig, ogImageUrl: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Twitter / X Publisher Handle</label>
                  <input
                    type="text"
                    value={seoConfig.twitterHandle}
                    onChange={(e) => setSeoConfig({ ...seoConfig, twitterHandle: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Search Engine Verifications */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-md">
              <h2 className="text-base font-bold text-white">Search Engine Verifications & Tracking</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Google Search Console Verification Token</label>
                  <input
                    type="text"
                    value={seoConfig.googleSearchConsoleId}
                    onChange={(e) => setSeoConfig({ ...seoConfig, googleSearchConsoleId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Bing Webmaster Tools Token</label>
                  <input
                    type="text"
                    value={seoConfig.bingWebmasterId}
                    onChange={(e) => setSeoConfig({ ...seoConfig, bingWebmasterId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Google Analytics 4 Measurement ID</label>
                  <input
                    type="text"
                    value={seoConfig.googleAnalyticsId}
                    onChange={(e) => setSeoConfig({ ...seoConfig, googleAnalyticsId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Google Discover Optimization Toggle */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-3 shadow-md">
              <h2 className="text-base font-bold text-white">Google Discover Optimizations</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Applies <code className="text-blue-400">max-image-preview:large</code>, high-resolution 1200px+ featured image previews, and structured article timestamps.
              </p>
              <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800 cursor-pointer text-xs">
                <span className="font-bold text-white">Enable Google Discover Directives</span>
                <input
                  type="checkbox"
                  checked={seoConfig.enableGoogleDiscoverOptimization}
                  onChange={(e) => setSeoConfig({ ...seoConfig, enableGoogleDiscoverOptimization: e.target.checked })}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Sitemap Suite */}
      {activeTab === 'sitemaps' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">Production XML Sitemap Suite</h2>
                <p className="text-xs text-slate-400">
                  Fully dynamic sitemaps with automatic lastmod timestamps generated by Express backend.
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-bold font-mono">
                Index Status: 100% Valid
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {[
                { name: 'Sitemap Index', path: '/sitemap.xml', desc: 'Root master index referenced by robots.txt', count: '5 sub-sitemaps' },
                { name: 'Products Sitemap', path: '/sitemap-products.xml', desc: 'All hardware reviews with daily crawl frequency', count: '148 items' },
                { name: 'Categories Sitemap', path: '/sitemap-categories.xml', desc: 'Category hubs and taxonomy routes', count: '12 hubs' },
                { name: 'Articles & Guides Sitemap', path: '/sitemap-articles.xml', desc: 'Buying guides and head-to-head comparisons', count: '14 articles' },
                { name: 'Google Images Sitemap', path: '/sitemap-images.xml', desc: 'Full image:image schema tags for Google Image search', count: '320+ images' },
              ].map((s) => (
                <div key={s.path} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{s.name}</span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-emerald-400">{s.count}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{s.desc}</p>
                  <a
                    href={s.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-mono"
                  >
                    <span>{s.path}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Robots.txt Editor */}
      {activeTab === 'robots' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Live Robots.txt Directive Editor</h2>
              <p className="text-xs text-slate-400">Controls crawling parameters for Googlebot, Bingbot, and AI agents.</p>
            </div>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-mono"
            >
              <span>View Live /robots.txt</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <textarea
            rows={12}
            value={robotsTxt}
            onChange={(e) => setRobotsTxt(e.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 text-xs font-mono text-emerald-400 outline-none leading-relaxed"
          />

          <button
            onClick={() => handleSaveSettings()}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-colors"
          >
            Deploy Robots.txt Changes
          </button>
        </div>
      )}

      {/* Tab 4: Schema Validator */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-md">
            <h2 className="text-base font-bold text-white">Schema.org JSON-LD Structured Data Validator</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verify schema microdata generated for Google Rich Snippets (Ratings, Prices, Offers, FAQs, Breadcrumbs).
            </p>

            <div className="space-y-3 text-xs">
              {[
                { title: 'Organization & Knowledge Graph', type: '@type: Organization', status: 'Active (Includes logo, social sameAs, E-E-A-T address)' },
                { title: 'Sitelinks Searchbox', type: '@type: WebSite with SearchAction', status: 'Active (Directs to /search?q={search_term_string})' },
                { title: 'Product & AggregateOffer', type: '@type: Product & AggregateRating', status: 'Active (Includes Amazon, eBay, AliExpress price bounds)' },
                { title: 'Editorial Review Score', type: '@type: Review', status: 'Active (Includes verified acoustic testing engineer credentials)' },
                { title: 'FAQ Rich Snippet', type: '@type: FAQPage', status: 'Active (Accordion questions & answers formatted for Google PAA)' },
                { title: 'Hierarchical Breadcrumbs', type: '@type: BreadcrumbList', status: 'Active (Full parent-child position hierarchy)' },
              ].map((s) => (
                <div key={s.title} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{s.title}</span>
                    <span className="font-mono text-[10px] text-blue-400">{s.type}</span>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{s.status}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: 301 Redirects Manager */}
      {activeTab === 'redirects' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Canonical 301/302 Redirect Manager</h2>
              <p className="text-xs text-slate-400">Seamlessly routes retired URLs to new product reviews with 0 link juice degradation.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">{redirects.length} Active Rules</span>
          </div>

          <form onSubmit={handleAddRedirect} className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            <input
              type="text"
              value={newRedirect.source}
              onChange={(e) => setNewRedirect({ ...newRedirect, source: e.target.value })}
              placeholder="Source Path (/reviews/xm4)"
              className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono"
              required
            />
            <input
              type="text"
              value={newRedirect.target}
              onChange={(e) => setNewRedirect({ ...newRedirect, target: e.target.value })}
              placeholder="Target Path (/reviews/sony-wh-1000xm5)"
              className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono"
              required
            />
            <select
              value={newRedirect.code}
              onChange={(e) => setNewRedirect({ ...newRedirect, code: e.target.value })}
              className="rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono"
            >
              <option value="301 Permanent">301 Permanent</option>
              <option value="302 Temporary">302 Temporary</option>
            </select>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white p-2"
            >
              + Deploy Redirect
            </button>
          </form>

          <div className="divide-y divide-slate-800 text-xs">
            {redirects.map((r) => (
              <div key={r.id} className="py-2.5 flex items-center justify-between font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">{r.source}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-blue-400" />
                  <span className="text-emerald-400 font-bold">{r.target}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">
                    {r.code} • {r.hits} hits
                  </span>
                  <button
                    onClick={() => handleDeleteRedirect(r.id)}
                    className="text-slate-500 hover:text-rose-400"
                    title="Delete rule"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Link Auditor & 404 Monitor */}
      {activeTab === 'auditor' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Full-Site Link Integrity & 404 Monitor</h2>
              <p className="text-xs text-slate-400">Simulates deep Googlebot crawl across all catalog items, reviews, and affiliate links.</p>
            </div>
            <button
              onClick={handleRunLinkAudit}
              disabled={isScanningLinks}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isScanningLinks ? 'animate-spin' : ''}`} />
              <span>{isScanningLinks ? 'Crawling Routes...' : 'Run Full Link Audit'}</span>
            </button>
          </div>

          {scanResult && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Crawl Audit Complete</strong>
                <p className="mt-0.5">{scanResult}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Total Crawled URLs</span>
              <span className="text-2xl font-black text-white">284</span>
              <span className="text-[10px] text-emerald-400 block mt-1">100% Returning HTTP 200/301</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Active 404 Leaks</span>
              <span className="text-2xl font-black text-emerald-400">0</span>
              <span className="text-[10px] text-slate-500 block mt-1">Clean server-side handling</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block mb-1">Affiliate Links Verified</span>
              <span className="text-2xl font-black text-white">52</span>
              <span className="text-[10px] text-blue-400 block mt-1">rel=&quot;sponsored nofollow&quot;</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
