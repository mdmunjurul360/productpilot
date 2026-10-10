import React from 'react';
import { ShieldCheck, Award, Microscope, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

interface TrustSectionProps {
  onNavigate: (path: string) => void;
}

export const TrustSection: React.FC<TrustSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-14 sm:py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Our Editorial Guarantee
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mt-1.5 font-sans">
            Why Discerning Shoppers Trust ProductPilot
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
            Unlike review farms flooded with sponsored brand listicles, ProductPilot operates an independent testing facility with strict scientific benchmarks. We purchase our test gear and report flaws without compromise.
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <HeartHandshake className="h-6 w-6 text-emerald-400" />,
              title: '100% Unpaid Editorial Verdicts',
              desc: 'We never accept paid review placements, manufacturer kickbacks, or sponsored rankings. Our final scores cannot be bought.',
            },
            {
              icon: <Microscope className="h-6 w-6 text-blue-400" />,
              title: 'Acoustics & Hardware Testing Labs',
              desc: 'From anechoic noise attenuation chambers to thermal stress benchmarks, we verify every claimed decibel, nit, and watt.',
            },
            {
              icon: <Award className="h-6 w-6 text-amber-400" />,
              title: 'Expert Research Council',
              desc: 'Reviews are directed by accredited acoustic engineers, display calibrators, and certified ergonomic professionals.',
            },
            {
              icon: <ShieldCheck className="h-6 w-6 text-purple-400" />,
              title: 'Multi-Store Price Transparency',
              desc: 'We present live pricing across Amazon, eBay, AliExpress, and Daraz so you always capture the optimal verified deal.',
            },
          ].map((pillar, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-slate-800 bg-slate-800/60 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-slate-700/80 mb-4 shadow-inner">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Verified Independent Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Laboratory Statistics Bar */}
        <div className="mt-12 rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="pt-4 md:pt-0">
              <span className="block text-2xl sm:text-3xl font-black text-white">2,480+</span>
              <span className="text-xs text-slate-400 mt-1 block">Hardware Products Tested</span>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400">14,200+</span>
              <span className="text-xs text-slate-400 mt-1 block">Hours in Acoustics & Stress Labs</span>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="block text-2xl sm:text-3xl font-black text-amber-400">$0.00</span>
              <span className="text-xs text-slate-400 mt-1 block">Manufacturer Sponsorships Accepted</span>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6">
              <span className="block text-2xl sm:text-3xl font-black text-blue-400">340,000+</span>
              <span className="text-xs text-slate-400 mt-1 block">Monthly Readers Buying Smarter</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('/how-we-test')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 text-xs font-bold transition-colors border border-slate-700"
            >
              <span>Inspect Our Full Laboratory Testing Protocols</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
