import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  MousePointerClick,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Layers,
  ShoppingBag,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'ytd'>('30d');

  const stats = [
    {
      title: 'Estimated Affiliate Revenue',
      value: '$42,850.00',
      change: '+18.4%',
      isPositive: true,
      sub: 'Based on 4.5% avg blended commission',
      icon: <DollarSign className="h-5 w-5 text-emerald-400" />,
      badge: 'Projected',
    },
    {
      title: 'Total Outbound Clicks',
      value: '284,910',
      change: '+24.1%',
      isPositive: true,
      sub: 'Avg 9,497 clicks / day',
      icon: <MousePointerClick className="h-5 w-5 text-blue-400" />,
      badge: 'Live Tracking',
    },
    {
      title: 'Average Site CTR',
      value: '4.82%',
      change: '+0.64%',
      isPositive: true,
      sub: 'Buy Box & CTA interaction rate',
      icon: <TrendingUp className="h-5 w-5 text-purple-400" />,
      badge: 'High Intent',
    },
    {
      title: 'Unique High-Intent Visitors',
      value: '612,400',
      change: '+14.2%',
      isPositive: true,
      sub: 'Organic search & direct readers',
      icon: <Users className="h-5 w-5 text-amber-400" />,
      badge: '98.2% Organic',
    },
  ];

  const storeBreakdown = [
    { store: 'Amazon Associates', clicks: '148,200', pct: 52, revenue: '$24,450', color: 'bg-[#FF9900]' },
    { store: 'eBay Partner Network', clicks: '68,310', pct: 24, revenue: '$9,820', color: 'bg-[#0064D2]' },
    { store: 'AliExpress Portals', clicks: '45,600', pct: 16, revenue: '$6,280', color: 'bg-[#FF4747]' },
    { store: 'Daraz Affiliate', clicks: '22,800', pct: 8, revenue: '$2,300', color: 'bg-[#F85606]' },
  ];

  const topConvertingArticles = [
    {
      title: 'Sony WH-1000XM5 In-Depth Lab Review: Unrivaled Acoustic Isolation',
      url: '/reviews/sony-wh-1000xm5',
      clicks: 48920,
      ctr: '6.4%',
      estRevenue: '$7,820',
    },
    {
      title: 'The 7 Best Noise-Canceling Headphones for Long-Haul Travel (2026)',
      url: '/buying-guides/best-anc-headphones-travel',
      clicks: 41200,
      ctr: '5.8%',
      estRevenue: '$6,150',
    },
    {
      title: 'Apple MacBook Pro 16" M4 Max Workstation Review',
      url: '/reviews/apple-macbook-pro-16-m4-max',
      clicks: 34500,
      ctr: '4.2%',
      estRevenue: '$11,400',
    },
    {
      title: 'Sony WH-1000XM5 vs Bose QuietComfort Ultra Showdown',
      url: '/compare/sony-wh-1000xm5-vs-bose-qc-ultra',
      clicks: 29800,
      ctr: '5.1%',
      estRevenue: '$4,650',
    },
    {
      title: 'Roborock S8 Pro Ultra In-Depth Cleaning Lab Test',
      url: '/reviews/roborock-s8-pro-ultra',
      clicks: 24100,
      ctr: '4.7%',
      estRevenue: '$5,900',
    },
  ];

  const handleExportCSV = () => {
    const headers = ['Article Title', 'URL', 'Outbound Clicks', 'CTR', 'Estimated Revenue'];
    const rows = topConvertingArticles.map((a) => [
      `"${a.title.replace(/"/g, '""')}"`,
      a.url,
      a.clicks,
      a.ctr,
      `"${a.estRevenue}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `productpilot_analytics_${timeframe}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight font-sans">
            Affiliate & Audience Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time click tracking, conversion funnels, and publisher revenue forecasting
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Timeframe Filter */}
          <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs font-semibold">
            {(['7d', '30d', '90d', 'ytd'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`rounded-lg px-3 py-1 uppercase transition-colors ${
                  timeframe === t ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3.5 py-2 text-xs font-bold text-white transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 space-y-3 shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{s.title}</span>
              <div className="rounded-xl bg-slate-800 p-2 border border-slate-700">{s.icon}</div>
            </div>

            <div>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {s.value}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="flex items-center text-xs font-bold text-emerald-400">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  {s.change}
                </span>
                <span className="text-[11px] text-slate-500">vs prev {timeframe}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>{s.sub}</span>
              <span className="rounded bg-blue-500/10 text-blue-400 px-1.5 py-0.2 font-mono text-[9px]">
                {s.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chart Stage & Store Share */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Outbound Click Trend (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-md">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">
                Daily Outbound Affiliate Clicks (30-Day Trajectory)
              </h3>
              <p className="text-xs text-slate-400">
                Direct verified merchant redirects via <code className="text-blue-400 font-mono">/go/:slug</code>
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-mono font-bold">
              +24.1% MoM
            </span>
          </div>

          {/* Precision SVG Chart Visualizer */}
          <div className="space-y-2">
            <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80 flex items-end">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                <div className="border-b border-slate-700 w-full" />
                <div className="border-b border-slate-700 w-full" />
                <div className="border-b border-slate-700 w-full" />
                <div className="border-b border-slate-700 w-full" />
              </div>

              {/* Responsive Bar Series */}
              <div className="relative z-10 flex h-full w-full items-end justify-between gap-1 sm:gap-2">
                {[
                  35, 42, 38, 55, 60, 48, 52, 65, 70, 62, 58, 75, 82, 78, 85,
                  90, 84, 88, 92, 98, 89, 94, 102, 110, 105, 115, 120, 112, 128, 135
                ].map((val, i) => (
                  <div key={i} className="group relative flex-1 flex flex-col items-center h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 hidden group-hover:flex items-center rounded-lg bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 whitespace-nowrap z-20 shadow-md">
                      {(val * 85).toLocaleString()} Clicks
                    </div>
                    <div
                      className="w-full rounded-t-sm bg-gradient-to-t from-blue-700 to-blue-400 group-hover:from-emerald-600 group-hover:to-teal-300 transition-all duration-150"
                      style={{ height: `${(val / 140) * 100}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-2">
              <span>Day 1 (Sept 5)</span>
              <span>Day 15 (Sept 20)</span>
              <span>Day 30 (Today)</span>
            </div>
          </div>
        </div>

        {/* Store Share Breakdown (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Merchant Share</h3>
              <span className="text-xs text-slate-400 font-mono">4 Networks</span>
            </div>

            <div className="space-y-4 mt-4">
              {storeBreakdown.map((s, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200">{s.store}</span>
                    <span className="font-mono text-emerald-400 font-bold">{s.revenue}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{s.clicks} clicks</span>
                    <span>{s.pct}%</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800/80 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
              Optimization Tip
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              AliExpress conversion jumped 18% after adding coupon badges to tech accessories.
            </p>
          </div>
        </div>
      </div>

      {/* Top Converting Articles Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Top 5 Revenue Generating Articles</h3>
            <p className="text-xs text-slate-400">Ranked by outbound affiliate conversion volume</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Article Title & Path</th>
                <th className="pb-3 text-right">Outbound Clicks</th>
                <th className="pb-3 text-right">Click-Through Rate</th>
                <th className="pb-3 text-right pr-2">Est. Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topConvertingArticles.map((art, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pl-2 max-w-md">
                    <div className="font-bold text-white truncate">{art.title}</div>
                    <a
                      href={art.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>{art.url}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-slate-200">
                    {art.clicks.toLocaleString()}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-purple-400">
                    {art.ctr}
                  </td>
                  <td className="py-3 text-right pr-2 font-mono font-black text-emerald-400">
                    {art.estRevenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
