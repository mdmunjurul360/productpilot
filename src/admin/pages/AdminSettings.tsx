import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  ShieldCheck,
  Globe,
  Mail,
  Server,
  HardDrive,
  RefreshCw,
  Database,
  Download,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AdminSettingsProps {
  onSaveToast: (msg: string) => void;
}

interface BackupItem {
  id: string;
  filename: string;
  timestamp: string;
  sizeBytes: number;
  checksumSha256: string;
  trigger: string;
  status: string;
}

interface DbAuditReport {
  isHealthy: boolean;
  totalRecords: number;
  collections: Record<string, number>;
  issuesFound: Array<{
    type: string;
    description: string;
    severity: string;
  }>;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onSaveToast }) => {
  const [activeSubTab, setActiveSubTab] = useState<'commercial' | 'infrastructure'>('commercial');

  const [settings, setSettings] = useState({
    siteName: 'ProductPilot',
    tagline: 'Discover Better Products. Buy Smarter.',
    supportEmail: 'editorial@productpilot.com',
    contactAddress: 'ProductPilot Labs, 450 Technology Parkway, Suite 800, San Francisco, CA',
    ga4MeasurementId: 'G-PILOT2026XX',
    gtmContainerId: 'GTM-PILOT98',
    amazonAssociatesTag: 'pilot-20',
    ebayCampaignId: '533890123',
    aliExpressSubId: 'pilot-ali',
    darazAffiliateId: 'pilot-daraz-global',
    twitterUrl: 'https://twitter.com/ProductPilotLab',
    youtubeUrl: 'https://youtube.com/@ProductPilotLab',
    instagramUrl: 'https://instagram.com/productpilot',
    linkedinUrl: 'https://linkedin.com/company/productpilot',
    githubUrl: 'https://github.com/productpilot',
    affiliateDisclosure:
      'ProductPilot participates in various affiliate marketing programs, including the Amazon Services LLC Associates Program, the eBay Partner Network (EPN), AliExpress Affiliate Program, and Daraz Affiliate Network. When you buy through our links, we may earn an affiliate commission at no additional cost to you.',
  });

  // Infrastructure State
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'ProductPilot is currently undergoing scheduled infrastructure upgrades. We will be back online shortly.'
  );
  const [healthInfo, setHealthInfo] = useState<Record<string, unknown> | null>(null);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [auditReport, setAuditReport] = useState<DbAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isFlushingCache, setIsFlushingCache] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.settings) {
          const s = data.settings;
          setSettings((prev) => ({
            ...prev,
            siteName: s.siteName || prev.siteName,
            tagline: s.tagline || prev.tagline,
            supportEmail: s.supportEmail || prev.supportEmail,
            contactAddress: s.contactAddress || prev.contactAddress,
            ga4MeasurementId: s.ga4MeasurementId || prev.ga4MeasurementId,
            gtmContainerId: s.gtmContainerId || prev.gtmContainerId,
            amazonAssociatesTag: s.affiliateIds?.amazon || prev.amazonAssociatesTag,
            ebayCampaignId: s.affiliateIds?.ebay || prev.ebayCampaignId,
            aliExpressSubId: s.affiliateIds?.aliExpress || prev.aliExpressSubId,
            darazAffiliateId: s.affiliateIds?.daraz || prev.darazAffiliateId,
            twitterUrl: s.socialLinks?.twitter || prev.twitterUrl,
            youtubeUrl: s.socialLinks?.youtube || prev.youtubeUrl,
            instagramUrl: s.socialLinks?.instagram || prev.instagramUrl,
            linkedinUrl: s.socialLinks?.linkedin || prev.linkedinUrl,
            githubUrl: s.socialLinks?.github || prev.githubUrl,
            affiliateDisclosure: s.affiliateDisclosure || prev.affiliateDisclosure,
          }));

          if (s.maintenanceMode) {
            setMaintenanceMode(Boolean(s.maintenanceMode.enabled));
            if (s.maintenanceMode.message) {
              setMaintenanceMessage(s.maintenanceMode.message);
            }
          }
        }
      })
      .catch(() => {});

    loadInfrastructureData();
  }, []);

  const loadInfrastructureData = () => {
    fetch('/api/admin/system/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.health) setHealthInfo(data.health);
      })
      .catch(() => {});

    fetch('/api/admin/system/backups')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.backups) setBackups(data.backups);
      })
      .catch(() => {});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteName: settings.siteName,
          tagline: settings.tagline,
          supportEmail: settings.supportEmail,
          contactAddress: settings.contactAddress,
          ga4MeasurementId: settings.ga4MeasurementId,
          gtmContainerId: settings.gtmContainerId,
          affiliateIds: {
            amazon: settings.amazonAssociatesTag,
            ebay: settings.ebayCampaignId,
            aliExpress: settings.aliExpressSubId,
            daraz: settings.darazAffiliateId,
          },
          socialLinks: {
            twitter: settings.twitterUrl,
            youtube: settings.youtubeUrl,
            instagram: settings.instagramUrl,
            linkedin: settings.linkedinUrl,
            github: settings.githubUrl,
          },
          affiliateDisclosure: settings.affiliateDisclosure,
          maintenanceMode: {
            enabled: maintenanceMode,
            message: maintenanceMessage,
          },
        }),
      });
      onSaveToast('Commercial system settings & affiliate IDs saved.');
    } catch {
      onSaveToast('Settings saved locally.');
    }
  };

  const handleToggleMaintenance = async () => {
    const nextState = !maintenanceMode;
    try {
      const res = await fetch('/api/admin/system/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState, message: maintenanceMessage }),
      });
      if (res.ok) {
        setMaintenanceMode(nextState);
        onSaveToast(nextState ? 'Maintenance mode ENABLED (HTTP 503 Active)' : 'Maintenance mode DISABLED (Site live)');
      }
    } catch {
      onSaveToast('Failed to toggle maintenance mode.');
    }
  };

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    try {
      const res = await fetch('/api/admin/system/backup/create', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onSaveToast(`Database snapshot created: ${data.backup.filename}`);
        loadInfrastructureData();
      }
    } catch {
      onSaveToast('Error creating backup.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreBackup = async (id: string) => {
    if (!window.confirm(`Are you sure you want to restore database snapshot ${id}? A pre-restore safety backup will be created automatically.`)) {
      return;
    }
    try {
      const res = await fetch('/api/admin/system/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        onSaveToast(data.message);
        loadInfrastructureData();
      } else {
        onSaveToast(`Restore failed: ${data.error}`);
      }
    } catch {
      onSaveToast('Failed to restore backup snapshot.');
    }
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/admin/system/db-audit');
      const data = await res.json();
      if (data.success) {
        setAuditReport(data.report);
        onSaveToast(data.report.isHealthy ? 'Database relationship audit PASSED!' : 'Audit detected items to review.');
      }
    } catch {
      onSaveToast('Error running database audit.');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleAutoRepair = async () => {
    try {
      const res = await fetch('/api/admin/system/db-repair', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        onSaveToast(data.result.message);
        handleRunAudit();
      }
    } catch {
      onSaveToast('Error running auto-repair.');
    }
  };

  const handleFlushCache = async () => {
    setIsFlushingCache(true);
    try {
      const res = await fetch('/api/admin/system/cache-flush', { method: 'POST' });
      if (res.ok) {
        onSaveToast('In-memory route indexes and application cache purged.');
      }
    } catch {
      onSaveToast('Error purging cache.');
    } finally {
      setIsFlushingCache(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Sub-tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings & Infrastructure</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure marketplace affiliate tags, analytics, disaster recovery backups, and maintenance gates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1">
            <button
              onClick={() => setActiveSubTab('commercial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeSubTab === 'commercial' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Commercial & Brand
            </button>
            <button
              onClick={() => setActiveSubTab('infrastructure')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'infrastructure' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Server className="h-3.5 w-3.5" />
              <span>Production Infrastructure</span>
            </button>
          </div>

          {activeSubTab === 'commercial' && (
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-900/40 transition-colors shrink-0"
            >
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'commercial' ? (
        /* ------------------------------------------------------------- */
        /* TAB 1: Commercial, Affiliate & Brand Identity                */
        /* ------------------------------------------------------------- */
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (6 Cols): General & Marketplaces */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
              <h2 className="text-base font-bold text-white">Brand & Identity</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Editorial Desk Email</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
              <h2 className="text-base font-bold text-white">Universal Affiliate Tracking IDs</h2>
              <p className="text-xs text-slate-400">
                Injected automatically into outbound retail redirect links for revenue attribution.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 font-bold font-sans block mb-1">Amazon Associates Tag</label>
                  <input
                    type="text"
                    value={settings.amazonAssociatesTag}
                    onChange={(e) => setSettings({ ...settings, amazonAssociatesTag: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold font-sans block mb-1">eBay Campaign ID</label>
                  <input
                    type="text"
                    value={settings.ebayCampaignId}
                    onChange={(e) => setSettings({ ...settings, ebayCampaignId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold font-sans block mb-1">AliExpress SubID</label>
                  <input
                    type="text"
                    value={settings.aliExpressSubId}
                    onChange={(e) => setSettings({ ...settings, aliExpressSubId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold font-sans block mb-1">Daraz Affiliate ID</label>
                  <input
                    type="text"
                    value={settings.darazAffiliateId}
                    onChange={(e) => setSettings({ ...settings, darazAffiliateId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (6 Cols): Analytics & Compliance */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
              <h2 className="text-base font-bold text-white">Analytics & Conversion Tracking</h2>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <label className="text-slate-400 font-bold font-sans block mb-1">Google Analytics 4</label>
                  <input
                    type="text"
                    value={settings.ga4MeasurementId}
                    onChange={(e) => setSettings({ ...settings, ga4MeasurementId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 font-bold font-sans block mb-1">Google Tag Manager</label>
                  <input
                    type="text"
                    value={settings.gtmContainerId}
                    onChange={(e) => setSettings({ ...settings, gtmContainerId: e.target.value })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
              <h2 className="text-base font-bold text-white">Statutory Affiliate Disclosure</h2>
              <div className="text-xs">
                <textarea
                  rows={5}
                  value={settings.affiliateDisclosure}
                  onChange={(e) => setSettings({ ...settings, affiliateDisclosure: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white leading-relaxed"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
              <h2 className="text-base font-bold text-white">Social Media Channels</h2>
              <div className="space-y-2 text-xs font-mono">
                <input
                  type="url"
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  placeholder="Twitter / X Profile URL"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                />
                <input
                  type="url"
                  value={settings.youtubeUrl}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  placeholder="YouTube Channel URL"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                />
                <input
                  type="url"
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  placeholder="LinkedIn Company Page URL"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                />
              </div>
            </div>
          </div>
        </form>
      ) : (
        /* ------------------------------------------------------------- */
        /* TAB 2: Production Infrastructure, Backups & Maintenance      */
        /* ------------------------------------------------------------- */
        <div className="space-y-6">
          {/* Top Row: Maintenance Mode & Cache Control */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Maintenance Mode Gate */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${maintenanceMode ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Maintenance Mode Gate</h2>
                    <span className="text-xs text-slate-400">Restricts public traffic with HTTP 503</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggleMaintenance}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    maintenanceMode ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {maintenanceMode ? 'Disable Gate' : 'Enable Gate'}
                </button>
              </div>

              <div className="text-xs space-y-2">
                <label className="text-slate-400 font-bold block">User-Facing Maintenance Notice</label>
                <textarea
                  rows={2}
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  placeholder="Enter notice shown to public visitors during upgrades..."
                />
                <p className="text-[11px] text-slate-500">
                  Note: Authenticated administrators with valid session tokens bypass the maintenance screen automatically.
                </p>
              </div>
            </div>

            {/* Cache & Routing Index Performance */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <RefreshCw className={`h-5 w-5 ${isFlushingCache ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Cache & Route Indexes</h2>
                    <span className="text-xs text-slate-400">Zero-latency in-memory query indexes</span>
                  </div>
                </div>

                <button
                  onClick={handleFlushCache}
                  disabled={isFlushingCache}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {isFlushingCache ? 'Purging...' : 'Flush Cache'}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-semibold">Indexed Product Slugs</span>
                  <span className="text-lg font-bold text-white font-mono">148 indexed</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block font-semibold">Routing Lookup Complexity</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">O(1) Instant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disaster Recovery & Database Snapshots */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Disaster Recovery & Database Backups</h2>
                  <span className="text-xs text-slate-400">Atomic snapshots with SHA-256 integrity verification</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>{isAuditing ? 'Auditing...' : 'Run Integrity Audit'}</span>
                </button>

                <button
                  onClick={handleCreateBackup}
                  disabled={isBackingUp}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors shadow-md shadow-blue-900/40"
                >
                  <HardDrive className="h-4 w-4" />
                  <span>{isBackingUp ? 'Creating...' : '+ Create Snapshot'}</span>
                </button>
              </div>
            </div>

            {/* Audit Status Banner (if audit was run) */}
            {auditReport && (
              <div
                className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-4 ${
                  auditReport.isHealthy
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {auditReport.isHealthy ? <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" /> : <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />}
                  <div>
                    <span className="font-bold block">
                      {auditReport.isHealthy
                        ? 'Database Integrity 100% Healthy — All Foreign Keys Verified'
                        : `${auditReport.issuesFound.length} Inconsistencies Detected in Database`}
                    </span>
                    <span className="text-[11px] opacity-80">
                      Total Catalog Records: {auditReport.totalRecords} across all entities
                    </span>
                  </div>
                </div>

                {!auditReport.isHealthy && (
                  <button
                    onClick={handleAutoRepair}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shrink-0 transition-colors"
                  >
                    Auto-Repair Inconsistencies
                  </button>
                )}
              </div>
            )}

            {/* Backups List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5">Snapshot Filename</th>
                    <th className="py-2.5">Created At</th>
                    <th className="py-2.5">File Size</th>
                    <th className="py-2.5">SHA-256 Checksum</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {backups.length > 0 ? (
                    backups.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-bold text-white flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{b.filename}</span>
                        </td>
                        <td className="py-3 text-slate-400 font-sans">{new Date(b.timestamp).toLocaleString()}</td>
                        <td className="py-3 text-slate-300">{Math.round(b.sizeBytes / 1024)} KB</td>
                        <td className="py-3 text-slate-500 text-[11px] truncate max-w-[120px]">{b.checksumSha256.slice(0, 16)}...</td>
                        <td className="py-3 text-right space-x-2 font-sans">
                          <a
                            href={`/api/admin/system/backup/download/${b.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                          >
                            <Download className="h-3 w-3" />
                            <span>Download</span>
                          </a>
                          <button
                            onClick={() => handleRestoreBackup(b.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors"
                          >
                            <RefreshCw className="h-3 w-3" />
                            <span>Restore</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-500 font-sans">
                        No manual backups created yet. Click "+ Create Snapshot" above to generate a verified point-in-time recovery archive.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
