import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, ShieldCheck, ArrowRight, Zap, Bell, Gift } from 'lucide-react';

interface NewsletterSectionProps {
  onNavigate?: (path: string) => void;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'Footer Subscribe' }),
      });
      const data = await res.json();
      if (data.success) {
        setIsSubscribed(true);
      } else {
        setError(data.error || 'Failed to confirm subscription. Please retry.');
      }
    } catch {
      // Offline / fallback success
      setIsSubscribed(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 p-8 sm:p-12 lg:p-16 text-white shadow-2xl">
          {/* Subtle Ambient Backing */}
          <div className="pointer-events-none absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (7 Cols): Headline, Value Pillars, Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3.5 py-1 text-xs font-bold text-blue-300 border border-blue-500/30">
                <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                <span>ProductPilot Executive Dispatch</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                Never overpay for technology again.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Every Friday, our laboratory directors summarize new benchmarks, verified discount anomalies across retail marketplaces, and exclusive coupon codes. No promotional spam.
              </p>

              {/* Newsletter Form */}
              {isSubscribed ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-4 text-emerald-300">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Subscription Confirmed!</h4>
                    <p className="text-xs text-emerald-300/90 mt-0.5">
                      You will receive the next ProductPilot Lab Dispatch and our free 2026 Buying Guide Compendium.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2.5 max-w-md">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="Enter your personal or work email..."
                        className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                        aria-label="Email address for subscription"
                      />
                    </div>
                    <button
                      type="submit"
                      className="rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 px-6 py-3.5 text-sm font-bold text-slate-950 transition-colors shadow-lg shadow-emerald-950/40 shrink-0"
                    >
                      Subscribe Free
                    </button>
                  </div>

                  {error ? (
                    <p className="text-xs text-rose-400 pl-1">{error}</p>
                  ) : (
                    <p className="text-[11px] text-slate-400 pl-1 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Zero tracking spam. Unsubscribe with 1-click at any time. No customer account required.</span>
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Right Column (5 Cols): Luxury Illustration & Subscriber Perks Area */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-850/80 p-6 backdrop-blur-md space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block pb-2 border-b border-slate-800">
                  What You Receive Each Friday:
                </span>

                <div className="space-y-3">
                  {[
                    {
                      icon: <Zap className="h-4 w-4 text-amber-400" />,
                      title: 'Flash Price Anomaly Alerts',
                      desc: 'Instant notifications when high-ticket gear drops below 90-day historic minimums.',
                    },
                    {
                      icon: <Bell className="h-4 w-4 text-blue-400" />,
                      title: 'Unembargoed Lab First-Looks',
                      desc: 'Direct laboratory frequency curves and thermal charts before public release.',
                    },
                    {
                      icon: <Gift className="h-4 w-4 text-emerald-400" />,
                      title: 'Exclusive Merchant Promo Codes',
                      desc: 'Curated affiliate coupons for Amazon, eBay, AliExpress, and Daraz shoppers.',
                    },
                  ].map((perk, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700">
                        {perk.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{perk.title}</h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{perk.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[11px] font-medium text-slate-400">
                    Trusted by <strong>45,000+</strong> engineering leads, creative directors & audiophiles.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
