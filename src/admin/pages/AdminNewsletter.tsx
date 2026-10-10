import React, { useState } from 'react';
import { Mail, Download, Search, Trash2, CheckCircle2, Users } from 'lucide-react';
import { AdminSubscriber } from '../types';

interface AdminNewsletterProps {
  subscribers: AdminSubscriber[];
  onDeleteSubscriber: (id: string) => void;
  onToast: (msg: string) => void;
}

export const AdminNewsletter: React.FC<AdminNewsletterProps> = ({
  subscribers,
  onDeleteSubscriber,
  onToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscribers = subscribers.filter((s) =>
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Email,Source,DateJoined,Status\n' +
      subscribers.map((s) => `${s.email},${s.source},${s.dateJoined},${s.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `productpilot_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onToast(`Exported ${subscribers.length} subscriber records to CSV.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter Audience & Email Dispatches</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Total active list of commercial subscribers receiving Friday lab reviews and price drop notifications.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/40 transition-colors shrink-0"
        >
          <Download className="h-4 w-4" />
          <span>Export All to CSV</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subscriber email address..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none"
          />
        </div>

        <span className="text-xs text-slate-400">
          Total Subscribers: <strong className="text-white">{subscribers.length}</strong>
        </span>
      </div>

      {/* Subscribers Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-950/60">
                <th className="py-3.5 px-4 font-bold">Subscriber Email</th>
                <th className="py-3.5 px-4 font-bold">Acquisition Source</th>
                <th className="py-3.5 px-4 font-bold">Date Joined</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                    <span>{sub.email}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{sub.source}</td>
                  <td className="py-3 px-4 text-slate-400">{sub.dateJoined}</td>
                  <td className="py-3 px-4">
                    <span className="rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 px-2 py-0.5 text-[10px] font-bold">
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onDeleteSubscriber(sub.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-950 hover:text-rose-400"
                      title="Unsubscribe / Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
