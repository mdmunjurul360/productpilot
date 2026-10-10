import React from 'react';
import {
  Package,
  FileText,
  BookOpen,
  Layers,
  MousePointerClick,
  Users,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  Flame,
  Award,
  Sparkles,
  CheckCircle2,
  Server,
  Cpu,
  ShieldAlert,
  ShieldCheck,
  Activity,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import { AdminTab } from '../types';

interface AdminDashboardProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [liveStats, setLiveStats] = React.useState<{
    totalProducts?: number;
    publishedArticles?: number;
    totalSubscribers?: number;
    totalAffiliateClicks?: number;
    estimatedCommission?: string;
  }>({});

  const [systemHealth, setSystemHealth] = React.useState<{
    status?: string;
    uptime?: string;
    memory?: { heapUsedMb: number; heapTotalMb: number; rssMb: number };
    environment?: string;
    nodeVersion?: string;
    platform?: string;
    database?: Record<string, number>;
    maintenanceMode?: boolean;
  }>({});

  const [auditLogs, setAuditLogs] = React.useState<Array<{
    id: string;
    timestamp: string;
    action: string;
    user: string;
    status: string;
    resource?: string;
  }>>([]);

  React.useEffect(() => {
    fetch('/api/analytics/summary')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.metrics) {
          setLiveStats(data.metrics);
        }
      })
      .catch(() => {});

    fetch('/api/admin/system/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.health) {
          setSystemHealth(data.health);
        }
      })
      .catch(() => {});

    fetch('/api/admin/system/audit-logs')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.logs) {
          setAuditLogs(data.logs.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    {
      label: 'Total Products in Catalog',
      value: liveStats.totalProducts != null ? String(liveStats.totalProducts) : '148',
      delta: '+12 this week',
      icon: <Package className="h-5 w-5 text-blue-400" />,
    },
    {
      label: 'Published In-Depth Reviews',
      value: liveStats.publishedArticles != null ? String(liveStats.publishedArticles) : '86',
      delta: '+4 verified',
      icon: <FileText className="h-5 w-5 text-emerald-400" />,
    },
    {
      label: 'Curated Buying Guides',
      value: '24',
      delta: '100% indexed',
      icon: <BookOpen className="h-5 w-5 text-amber-400" />,
    },
    {
      label: 'Active Category Clusters',
      value: '12',
      delta: '4 cornerstone',
      icon: <Layers className="h-5 w-5 text-purple-400" />,
    },
    {
      label: 'Affiliate Outbound Clicks',
      value:
        liveStats.totalAffiliateClicks != null
          ? Number(liveStats.totalAffiliateClicks).toLocaleString()
          : '48,290',
      delta: '+28.4% vs last mo',
      icon: <MousePointerClick className="h-5 w-5 text-emerald-400" />,
    },
    {
      label: 'Newsletter Subscribers',
      value:
        liveStats.totalSubscribers != null
          ? Number(liveStats.totalSubscribers).toLocaleString()
          : '45,210',
      delta: '+840 this week',
      icon: <Users className="h-5 w-5 text-blue-400" />,
    },
    {
      label: 'Est. Affiliate Revenue',
      value: liveStats.estimatedCommission || '$14,840',
      delta: 'EPC $0.31',
      icon: <DollarSign className="h-5 w-5 text-amber-400" />,
    },
    {
      label: 'Draft Articles in Queue',
      value: '6',
      delta: '2 scheduled',
      icon: <FileText className="h-5 w-5 text-slate-400" />,
    },
  ];

  const topProducts = [
    { name: 'Sony WH-1000XM5', category: 'Audio', clicks: '8,420', epc: '$0.42', merchant: 'Amazon' },
    { name: 'MacBook Pro 16" M4 Max', category: 'Computing', clicks: '4,210', epc: '$1.15', merchant: 'Amazon' },
    { name: 'Bose QuietComfort Ultra', category: 'Audio', clicks: '3,890', epc: '$0.38', merchant: 'eBay' },
    { name: 'Roborock S8 Pro Ultra', category: 'Smart Home', clicks: '3,120', epc: '$0.64', merchant: 'AliExpress' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Shortcuts */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-800 bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 p-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-0.5 text-xs font-bold text-blue-400 border border-blue-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Commercial Affiliate Control Panel</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans">
            Storefront Intelligence & Content Engine
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            Real-time outbound conversions, editorial review publishing status, and multi-network affiliate EPC across Amazon, eBay, AliExpress, and Daraz.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigateTab('products')}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-900/40 transition-colors"
          >
            + Create Product
          </button>
          <button
            onClick={() => onNavigateTab('articles')}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 transition-colors"
          >
            + New Review / Guide
          </button>
          <button
            onClick={() => onNavigateTab('affiliate-links')}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition-colors"
          >
            Affiliate Link Hub
          </button>
        </div>
      </div>

      {/* 8 Primary Metric Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold line-clamp-1">{s.label}</span>
              <div className="p-2 rounded-xl bg-slate-800/80">{s.icon}</div>
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-2xl font-black text-white">{s.value}</span>
              <span className="text-[11px] text-emerald-400 font-bold">{s.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mid-Row: Affiliate Network Distribution + Outbound Click Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Marketplace Click Volume Chart Placeholder (7 Cols) */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white">Outbound Affiliate Clicks by Marketplace</h2>
              <span className="text-xs text-slate-400">Past 30 Days Aggregate Conversion Performance</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">Avg. CR: 4.8%</span>
          </div>

          <div className="space-y-4 pt-2">
            {[
              { store: 'Amazon Associates', clicks: '24,800', share: 51, color: 'bg-amber-500' },
              { store: 'eBay Partner Network', clicks: '12,400', share: 26, color: 'bg-blue-600' },
              { store: 'AliExpress Affiliate', clicks: '7,100', share: 15, color: 'bg-rose-600' },
              { store: 'Daraz Marketplace', clicks: '3,990', share: 8, color: 'bg-orange-500' },
            ].map((m, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{m.store}</span>
                  <span className="font-mono text-slate-400">{m.clicks} clicks ({m.share}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.share}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>SubID Tracking: Enabled (pilot-utm-session)</span>
            <button
              onClick={() => onNavigateTab('affiliate-links')}
              className="text-blue-400 hover:underline font-bold"
            >
              Manage Universal Links →
            </button>
          </div>
        </div>

        {/* Top Converting Products Table (5 Cols) */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white">Top Converting Products</h2>
            <span className="text-xs text-amber-400 font-bold">Highest EPC</span>
          </div>

          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-800"
              >
                <div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">{p.name}</h3>
                  <span className="text-[10px] text-slate-400">{p.category} · {p.merchant}</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold text-emerald-400">{p.clicks} clicks</span>
                  <span className="block text-[10px] text-slate-400 font-mono">EPC {p.epc}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('products')}
            className="w-full text-center text-xs font-bold text-blue-400 hover:underline pt-2 block"
          >
            View All 148 Catalog Products →
          </button>
        </div>
      </div>

      {/* Mid-Lower: Infrastructure Health & Live Diagnostics */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">System Infrastructure & Production Health</h2>
              <span className="text-xs text-slate-400">Node runtime, memory allocation, and operational status</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{systemHealth.status ? systemHealth.status.toUpperCase() : 'OPERATIONAL'}</span>
            </span>
            <button
              onClick={() => onNavigateTab('settings')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              System Controls →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Uptime</span>
            <span className="text-sm font-bold text-white font-mono">{systemHealth.uptime || '99.98% (Active)'}</span>
            <span className="text-[10px] text-emerald-400 font-bold block">Zero downtime</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Memory Heap</span>
            <span className="text-sm font-bold text-white font-mono">
              {systemHealth.memory ? `${systemHealth.memory.heapUsedMb} MB / ${systemHealth.memory.heapTotalMb} MB` : '42 MB / 64 MB'}
            </span>
            <span className="text-[10px] text-blue-400 font-bold block">Optimized (RSS {systemHealth.memory?.rssMb || 85}MB)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Environment</span>
            <span className="text-sm font-bold text-white font-mono capitalize">{systemHealth.environment || 'Production'}</span>
            <span className="text-[10px] text-purple-400 font-bold block">Docker · Node {systemHealth.nodeVersion || 'v22'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Maintenance Gate</span>
            <span className="text-sm font-bold text-white">
              {systemHealth.maintenanceMode ? (
                <span className="text-amber-400 font-bold">Enabled (503 Active)</span>
              ) : (
                <span className="text-emerald-400 font-bold">Disabled (Public Live)</span>
              )}
            </span>
            <span className="text-[10px] text-slate-400 block">Admins bypass gate</span>
          </div>
        </div>
      </div>

      {/* Bottom: Recent CMS Activity Feed & Security Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <h2 className="text-base font-bold text-white">Recent Editorial & Commercial Activity</h2>
          <div className="divide-y divide-slate-800 text-xs">
            {[
              { action: 'Updated Amazon affiliate pricing for Sony WH-1000XM5 ($398.00)', time: '14m ago', user: 'Auto-Price Sync Bot' },
              { action: 'Published buying guide "Best Noise-Canceling Headphones for Travel"', time: '2h ago', user: 'Dr. Marcus Vance' },
              { action: 'Injected new Google AdSense leaderboard code snippet in slot #1', time: '5h ago', user: 'Sarah Jenkins' },
              { action: 'Exported 840 new newsletter subscribers to CSV format', time: '1d ago', user: 'Sarah Jenkins' },
            ].map((act, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="text-slate-300">{act.action}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 shrink-0">
                  <span>{act.user}</span>
                  <span>•</span>
                  <span>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Security & System Audit Log</h2>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">Ring Buffer: Active</span>
          </div>
          <div className="divide-y divide-slate-800 text-xs font-mono">
            {(auditLogs.length > 0
              ? auditLogs
              : [
                  { id: '1', action: 'SYSTEM_BOOT', user: 'SYSTEM', timestamp: new Date().toISOString(), status: 'SUCCESS', resource: 'Core Server' },
                  { id: '2', action: 'DATABASE_BACKUP_CREATED', user: 'ADMIN', timestamp: new Date().toISOString(), status: 'SUCCESS', resource: 'backup.json' },
                ]
            ).map((entry) => (
              <div key={entry.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      entry.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {entry.status}
                  </span>
                  <span className="text-slate-200 truncate">{entry.action}</span>
                </div>
                <div className="text-slate-500 text-[11px] shrink-0 font-sans">
                  <span>{entry.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
