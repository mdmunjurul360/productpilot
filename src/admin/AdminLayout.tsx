import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  BookOpen,
  Scale,
  Link2,
  Tv,
  Image,
  Globe,
  Mail,
  TrendingUp,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
  CheckCircle2,
  AlertCircle,
  PanelRightClose,
  PanelRightOpen,
  Activity,
  Sparkles,
  MousePointerClick,
  ShieldCheck,
} from 'lucide-react';
import { AdminTab, ToastMessage } from './types';
import { useAdminAuth } from './AdminAuthContext';
import { useTheme } from '../context/ThemeContext';
import { ProductPilotLogo } from '../components/brand/ProductPilotLogo';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onViewPublicSite: () => void;
  toasts: ToastMessage[];
  onDismissToast: (id: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onTabChange,
  onViewPublicSite,
  toasts,
  onDismissToast,
  children,
}) => {
  const { user, logout } = useAdminAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [adminNote, setAdminNote] = useState(() => {
    return localStorage.getItem('productpilot_admin_quicknote') || '• Review Sony WH-1000XM5 affiliate link priority\n• Add 300x600 skyscraper banner to Best Keyboards roundup';
  });

  const handleSaveNote = (val: string) => {
    setAdminNote(val);
    localStorage.setItem('productpilot_admin_quicknote', val);
  };

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'products', label: 'Products & Gear', icon: <Package className="h-4 w-4" />, badge: '4' },
    { id: 'categories', label: 'Categories', icon: <Layers className="h-4 w-4" /> },
    { id: 'articles', label: 'Articles & Reviews', icon: <FileText className="h-4 w-4" />, badge: 'New' },
    { id: 'buying-guides', label: 'Buying Guides', icon: <BookOpen className="h-4 w-4" />, badge: '3' },
    { id: 'comparisons', label: 'Comparisons', icon: <Scale className="h-4 w-4" /> },
    { id: 'affiliate-links', label: 'Affiliate Links', icon: <Link2 className="h-4 w-4" /> },
    { id: 'ads', label: 'Ad Placements', icon: <Tv className="h-4 w-4" /> },
    { id: 'media', label: 'Media Library', icon: <Image className="h-4 w-4" /> },
    { id: 'newsletter', label: 'Subscribers', icon: <Mail className="h-4 w-4" /> },
    { id: 'seo', label: 'SEO & Schemas', icon: <Globe className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics & Revenue', icon: <TrendingUp className="h-4 w-4" />, badge: 'Live' },
    { id: 'comments', label: 'Comments Moderation', icon: <MessageSquare className="h-4 w-4" />, badge: '2' },
    { id: 'settings', label: 'Site Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Toast Notifications Container */}
      <div className="fixed top-5 right-5 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl p-4 text-xs font-semibold shadow-2xl transition-all animate-in slide-in-from-top-3 ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-200 border border-emerald-500/40'
                : toast.type === 'error'
                ? 'bg-rose-950/95 text-rose-200 border border-rose-500/40'
                : 'bg-slate-900/95 text-slate-200 border border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => onDismissToast(toast.id)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-slate-800 bg-slate-900/95 p-4 select-none shrink-0 overflow-y-auto">
        <div className="space-y-5">
          {/* Brand Wordmark */}
          <div className="flex items-center justify-between px-2 pt-2">
            <ProductPilotLogo variant="light" size="sm" showTagline={false} />
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Management Modules
            </span>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-md px-1.5 py-0.2 text-[10px] font-bold ${
                        isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <img
              src={user?.avatar}
              alt={user?.name}
              className="h-9 w-9 rounded-xl object-cover ring-1 ring-slate-700"
            />
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-white truncate">{user?.name}</span>
              <span className="block text-[10px] text-emerald-400 font-semibold truncate">
                Super Admin
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onViewPublicSite}
              className="flex items-center justify-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 p-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              title="Go to Live Site"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Site</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center gap-1 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 p-2 text-xs font-semibold text-rose-300 hover:text-rose-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Admin CMS</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
              <span className="font-bold text-white uppercase tracking-wider">
                {activeTab.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 text-xs text-emerald-300 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>284,910 Outbound Clicks MTD</span>
            </div>

            <button
              onClick={toggleTheme}
              className="rounded-xl border border-slate-800 bg-slate-800/60 p-2 text-slate-400 hover:text-white transition-colors"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Right Widget Panel Toggle */}
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className={`rounded-xl border p-2 text-xs font-semibold transition-colors ${
                isRightPanelOpen
                  ? 'border-blue-500 bg-blue-600 text-white'
                  : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
              title="Toggle Quick Intelligence Panel"
              aria-label="Toggle Quick Intelligence Panel"
            >
              {isRightPanelOpen ? (
                <PanelRightClose className="h-4 w-4" />
              ) : (
                <PanelRightOpen className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={onViewPublicSite}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-bold text-white transition-colors shadow-sm"
            >
              <span>View Storefront</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        {/* Content Area with Optional Right Panel */}
        <div className="flex-1 flex overflow-hidden">
          <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">{children}</main>

          {/* Right Optional Panel (Widgets & Live Feed) */}
          {isRightPanelOpen && (
            <aside className="w-80 border-l border-slate-800 bg-slate-900/90 backdrop-blur-md p-5 flex flex-col justify-between overflow-y-auto hidden xl:flex shrink-0 animate-in slide-in-from-right duration-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                      Live Pulse Feed
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsRightPanelOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Real-time Click Stream */}
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Recent Outbound Redirects
                  </span>
                  <div className="space-y-2">
                    {[
                      { store: 'Amazon', product: 'Sony WH-1000XM5', time: '1m ago', code: 'US' },
                      { store: 'eBay', product: 'Sony WH-1000XM5', time: '3m ago', code: 'UK' },
                      { store: 'AliExpress', product: 'Roborock S8 Pro', time: '6m ago', code: 'DE' },
                      { store: 'Amazon', product: 'MacBook Pro 16" M4', time: '11m ago', code: 'CA' },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-slate-950 p-2.5 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <strong className="text-white text-[11px] truncate max-w-[120px]">
                              {item.product}
                            </strong>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Via {item.store} • {item.code}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Health */}
                <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    System Architecture
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Dynamic Sitemap:</span>
                      <span className="text-emerald-400 font-mono text-[11px]">200 OK</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Affiliate Cloaker:</span>
                      <span className="text-emerald-400 font-mono text-[11px]">Active</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>Robots Policy:</span>
                      <span className="text-emerald-400 font-mono text-[11px]">Strict</span>
                    </div>
                  </div>
                </div>

                {/* Quick Scratchpad */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Admin Quick Notes
                  </span>
                  <textarea
                    value={adminNote}
                    onChange={(e) => handleSaveNote(e.target.value)}
                    rows={4}
                    placeholder="Quick internal reminder notes..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 outline-none focus:border-blue-500 resize-none font-mono"
                  />
                  <span className="block text-[9px] text-slate-500 italic">
                    Persisted locally in session storage
                  </span>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative flex w-full max-w-xs flex-col justify-between bg-slate-900 p-5 shadow-2xl overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <ProductPilotLogo variant="light" size="sm" showTagline={false} />
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold ${
                      activeTab === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="rounded-md bg-slate-800 px-1.5 py-0.2 text-[10px] font-bold text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={onViewPublicSite}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800 p-2.5 text-xs font-bold text-white"
              >
                <span>Live Public Site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-rose-950/80 p-2.5 text-xs font-bold text-rose-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
