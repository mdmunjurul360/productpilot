import React, { useState } from 'react';
import {
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Search,
  Filter,
  ShieldCheck,
  CornerDownRight,
  Send,
} from 'lucide-react';
import { AdminComment } from '../types';

interface AdminCommentsProps {
  comments: AdminComment[];
  onApproveComment: (id: string) => void;
  onDeleteComment: (id: string) => void;
  onFlagComment: (id: string) => void;
}

export const AdminComments: React.FC<AdminCommentsProps> = ({
  comments,
  onApproveComment,
  onDeleteComment,
  onFlagComment,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const filteredComments = comments.filter((c) => {
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchesQuery =
      c.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const handleSendReply = (id: string) => {
    if (!replyText.trim()) return;
    onApproveComment(id);
    setReplyingToId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight font-sans">
            Community Comments & Observations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Moderate verified reader feedback, lab inquiries, and owner observations
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'pending', 'approved', 'flagged'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {status}
              {status === 'pending' && (
                <span className="ml-1.5 rounded-full bg-amber-500/20 text-amber-300 px-1.5 py-0.2 text-[10px]">
                  {comments.filter((c) => c.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search observations by author, content, or product name..."
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/90 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {filteredComments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400 text-xs">
            No reader comments found matching current filter criteria.
          </div>
        ) : (
          filteredComments.map((c) => (
            <div
              key={c.id}
              className={`rounded-3xl border p-5 transition-all space-y-3 ${
                c.status === 'pending'
                  ? 'border-amber-500/40 bg-slate-900/90 ring-1 ring-amber-500/20'
                  : c.status === 'flagged'
                  ? 'border-rose-500/40 bg-slate-900/90'
                  : 'border-slate-800 bg-slate-900/90'
              }`}
            >
              {/* Comment Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-white font-bold text-xs">
                    {c.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{c.author}</span>
                      {c.verifiedBuyer && (
                        <span className="flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 text-[10px] font-bold">
                          <ShieldCheck className="h-3 w-3" /> Verified Owner
                        </span>
                      )}
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] font-bold uppercase ${
                          c.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : c.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      On <strong className="text-slate-300">{c.productName}</strong> • {c.submittedAt}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  {c.status !== 'approved' && (
                    <button
                      onClick={() => onApproveComment(c.id)}
                      className="flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 text-xs font-bold transition-colors"
                      title="Approve Comment"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  <button
                    onClick={() => setReplyingToId(replyingToId === c.id ? null : c.id)}
                    className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 text-xs font-bold transition-colors"
                  >
                    <CornerDownRight className="h-3.5 w-3.5 text-blue-400" />
                    <span>Reply</span>
                  </button>

                  <button
                    onClick={() => onFlagComment(c.id)}
                    className="rounded-xl bg-slate-800 hover:bg-amber-900/60 text-slate-400 hover:text-amber-300 p-2 text-xs transition-colors"
                    title="Flag as Sensitive / Suspicious"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteComment(c.id)}
                    className="rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 p-2 text-xs transition-colors"
                    title="Delete Comment"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Comment Content */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-10">
                "{c.content}"
              </p>

              {/* Reply Box */}
              {replyingToId === c.id && (
                <div className="ml-10 mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type official editorial response from ProductPilot Staff..."
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleSendReply(c.id)}
                    className="flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 text-xs font-bold transition-colors"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
