import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  ArrowUp,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  Lock,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  Github,
  HelpCircle,
} from 'lucide-react';
import { ProductPilotLogo } from '../brand/ProductPilotLogo';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const currentYear = new Date().getFullYear();

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(path);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid business or personal email address.');
      return;
    }
    setEmailError('');
    setIsSubscribed(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-300">
      {/* Newsletter Engagement Banner (High-Conversion Capsule) */}
      <div className="border-b border-slate-800 bg-slate-950/80 px-4 sm:px-6 lg:px-8 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
            <div className="lg:col-span-6 space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>The ProductPilot Weekly Dispatch</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
                Never overpay for tech or miss a verified price drop.
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                Get our weekly breakdown of verified lab reviews, exclusive retail coupon codes, and price anomalies across Amazon, eBay, and AliExpress.
              </p>
            </div>

            <div className="lg:col-span-6">
              {isSubscribed ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">You&apos;re subscribed to ProductPilot Dispatch</h4>
                    <p className="text-xs text-emerald-300/90 mt-0.5">
                      Check your inbox shortly for our 2026 Best Gear Buyer&apos;s Compendium. Zero spam. Unsubscribe at any time.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError('');
                        }}
                        placeholder="Enter your email for lab drops..."
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        aria-label="Email address for newsletter"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 active:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 shrink-0"
                    >
                      Subscribe Free
                    </button>
                  </div>
                  {emailError ? (
                    <p className="text-xs text-rose-400 pl-1">{emailError}</p>
                  ) : (
                    <p className="text-[11px] text-slate-500 pl-1">
                      We protect your privacy. Read our{' '}
                      <a
                        href="/privacy-policy"
                        onClick={(e) => handleLinkClick('/privacy-policy', e)}
                        className="text-slate-400 underline hover:text-slate-200"
                      >
                        Privacy Policy
                      </a>
                      . No account required.
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main 5-Column Navigation Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand & Testing Pledge */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-4">
            <ProductPilotLogo variant="light" size="md" showTagline={false} />
            <p className="text-xs text-slate-400 leading-relaxed">
              ProductPilot is an authoritative product intelligence, testing, and multi-network affiliate discovery engine. We help shoppers discover superior gear, verify real specifications, and bypass marketing hype.
            </p>

            {/* Social Channels */}
            <div className="pt-1 flex items-center gap-3 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-white transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white transition-colors">
                <Github className="h-4 w-4" />
              </a>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>100% Unpaid Editorial Verdicts</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Award className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Acoustic & Hardware Lab Testing</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Lock className="h-4 w-4 text-blue-400 shrink-0" />
                <span>256-Bit Encrypted Link Cloaking</span>
              </div>
            </div>
          </div>

          {/* Column 2: Discover Verticals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Categories & Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'All Categories Index', path: '/categories' },
                { name: 'Audio & Visual', path: '/category/audio-visual' },
                { name: 'Computing & Workstations', path: '/category/computing' },
                { name: 'Smart Living & Matter', path: '/category/smart-home' },
                { name: 'Gaming & Esports', path: '/category/gaming' },
                { name: 'Cameras & Lenses', path: '/category/cameras' },
                { name: 'Home Office & Ergonomics', path: '/category/home-office' },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    onClick={(e) => handleLinkClick(item.path, e)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tools & Utilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Tools & Decision Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Head-to-Head Compare Matrix', path: '/compare' },
                { name: 'Today\'s Verified Price Drops', path: '/deals' },
                { name: 'Curated Buying Guides 2026', path: '/buying-guides' },
                { name: 'In-Depth Reviews Archive', path: '/reviews' },
                { name: 'Frequently Asked Questions (FAQ)', path: '/faq' },
                { name: 'XML Editorial Sitemap', path: '/sitemap.xml' },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    onClick={(e) => handleLinkClick(item.path, e)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Editorial & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Editorial Standards
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'About ProductPilot', path: '/about' },
                { name: 'How We Test in Our Labs', path: '/how-we-test' },
                { name: 'Editorial Independence Policy', path: '/editorial-standards' },
                { name: 'Verified Lab Contributors', path: '/authors' },
                { name: 'Corrections & Fact-Checking', path: '/corrections' },
                { name: 'Contact Editorial Desk', path: '/contact' },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    onClick={(e) => handleLinkClick(item.path, e)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Regulatory & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'Affiliate Commission Disclosure', path: '/affiliate-disclosure' },
                { name: 'Privacy Policy (GDPR / CCPA)', path: '/privacy-policy' },
                { name: 'Terms & Conditions of Service', path: '/terms-and-conditions' },
                { name: 'Cookie Consent Policy', path: '/cookie-policy' },
                { name: 'Security Vulnerability Disclosure', path: '/security' },
                { name: 'Admin Management Portal', path: '/admin' },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    onClick={(e) => handleLinkClick(item.path, e)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mandatory Statutory FTC / Marketplace Disclaimer Box */}
        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-xs text-slate-400 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Statutory Affiliate Notice & Commercial Relationship Disclosure</span>
          </div>
          <p>
            ProductPilot participates in various affiliate marketing programs, including the <strong>Amazon Services LLC Associates Program</strong>, the <strong>eBay Partner Network (EPN)</strong>, <strong>AliExpress Affiliate Program</strong>, and <strong>Daraz Affiliate Network</strong>. These programs are designed to provide a means for independent review publishers to earn advertising fees by linking to retail merchant partner websites.
          </p>
          <p>
            Product prices, coupons, and inventory availability are accurate as of the last recorded timestamp and are subject to change by retail merchants without notice. Any price or availability information displayed on partner merchant sites at the time of purchase will apply to the purchase of the product. ProductPilot does not handle order fulfillment, returns, warranties, or customer service for merchant purchases.
          </p>
        </div>

        {/* Bottom Bar (Copyright & Back to Top) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 pt-6 text-xs text-slate-500 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {currentYear} ProductPilot Inc. All rights reserved.</span>
            <span>•</span>
            <span>Designed for Commercial Scale</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">99.98% Uptime SLA</span>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
