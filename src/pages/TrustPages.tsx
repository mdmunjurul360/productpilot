import React from 'react';
import { ShieldCheck, Mail, Building, Scale, BookOpen, AlertTriangle } from 'lucide-react';

interface TrustPageProps {
  onNavigate?: (path: string) => void;
}

export const AboutPage: React.FC<TrustPageProps> = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="text-center mb-12">
      <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">About ProductPilot</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400">Independent, Data-Driven Editorial Reviews</p>
    </div>
    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">
      <p>ProductPilot was founded with a singular mission: to cut through marketing hype and deliver objective, empirical product testing. We believe consumers deserve transparent data before making purchasing decisions.</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8">Our Methodology</h3>
      <p>We don't accept sponsored reviews or manufacturer stipends. Every product we test is either purchased anonymously or acquired under strict embargoes that guarantee our editorial independence.</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-8">The Team</h3>
      <p>Our team consists of former engineers, acoustic technicians, and industry analysts. We operate out of dedicated testing facilities to ensure our benchmarks are accurate and repeatable.</p>
    </div>
  </div>
);

export const ContactPage: React.FC<TrustPageProps> = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="text-center mb-12">
      <Mail className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Contact the Editorial Desk</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400">We're here to help you make better decisions.</p>
    </div>
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 max-w-2xl mx-auto">
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
          <input type="text" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <input type="email" className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
          <textarea rows={5} className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"></textarea>
        </div>
        <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white font-bold hover:bg-blue-700 transition-colors">
          Send Secure Message
        </button>
      </form>
    </div>
  </div>
);

export const PrivacyPolicyPage: React.FC<TrustPageProps> = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="mb-12">
      <ShieldCheck className="h-12 w-12 text-blue-600 mb-4" />
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Privacy Policy (GDPR / CCPA)</h1>
      <p className="text-slate-500">Last Updated: October 2026</p>
    </div>
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
      <h3>1. Information We Collect</h3>
      <p>We collect minimal telemetry to improve performance. For newsletter subscribers, we securely store your email using AES-256 encryption.</p>
      <h3>2. How We Use Your Data</h3>
      <p>Data is used exclusively to deliver editorial content and optimize page load speeds. We do not sell personally identifiable information to data brokers.</p>
      <h3>3. Your Rights</h3>
      <p>Under GDPR and CCPA, you have the right to request deletion of your data at any time. Contact our Data Protection Officer at privacy@productpilot.com.</p>
    </div>
  </div>
);

export const TermsPage: React.FC<TrustPageProps> = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="mb-12">
      <Scale className="h-12 w-12 text-slate-600 dark:text-slate-400 mb-4" />
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Terms of Service</h1>
    </div>
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
      <p>By accessing ProductPilot, you agree to these terms and conditions of use.</p>
      <h3>Content Copyright</h3>
      <p>All reviews, lab data, images, and comparative analysis are copyrighted intellectual property. Scraping or republishing our benchmarks without explicit licensing is strictly prohibited.</p>
      <h3>Limitation of Liability</h3>
      <p>Product prices and availability change rapidly on retail partner sites. We are not responsible for discrepancies between our listed prices and the final checkout price at third-party merchants.</p>
    </div>
  </div>
);

export const CookiePolicyPage: React.FC<TrustPageProps> = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="mb-12">
      <BookOpen className="h-12 w-12 text-amber-500 mb-4" />
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Cookie Consent Policy</h1>
    </div>
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
      <p>We use cookies strictly for essential platform functionality and aggregate anonymous analytics.</p>
      <ul>
        <li><strong>Essential Cookies:</strong> Used for session management (Admin portal) and saving your Shortlist locally.</li>
        <li><strong>Analytics Cookies:</strong> We use privacy-respecting analytics to see which reviews are most popular.</li>
        <li><strong>Affiliate Cookies:</strong> When you click a merchant link, the merchant may place a tracking cookie to attribute the sale to ProductPilot.</li>
      </ul>
    </div>
  </div>
);

export const AffiliateDisclosurePage: React.FC<TrustPageProps> = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <div className="mb-12">
      <AlertTriangle className="h-12 w-12 text-rose-500 mb-4" />
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Affiliate Commission Disclosure</h1>
    </div>
    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
      <p className="text-lg font-bold">In compliance with FTC guidelines, please assume that any links on ProductPilot leading to products or services are affiliate links.</p>
      <p>This means if you click on a link and make a purchase, ProductPilot may receive a small commission at absolutely no extra cost to you.</p>
      <h3>Our Independence Guarantee</h3>
      <p>Our affiliate partnerships do NOT dictate our reviews. If a product is bad, we will say so. We routinely recommend products from which we earn zero commission if they are genuinely the best in class.</p>
    </div>
  </div>
);
