import React, { useState } from 'react';
import { Share2, Link2, Check, Twitter, Facebook, Linkedin } from 'lucide-react';

interface SocialShareBarProps {
  title: string;
  url?: string;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({ title, url }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://productpilot.com');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = (network: 'x' | 'facebook' | 'linkedin' | 'pinterest') => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    let target = '';

    switch (network) {
      case 'x':
        target = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=ProductPilot`;
        break;
      case 'facebook':
        target = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        target = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'pinterest':
        target = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
        break;
    }

    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer,width=600,height=500');
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xs">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
        <Share2 className="h-4 w-4 text-blue-600" />
        <span>Share Review:</span>
      </div>

      <div className="flex items-center gap-2">
        {/* X / Twitter */}
        <button
          onClick={() => handleShare('x')}
          className="rounded-xl p-2 bg-slate-100 hover:bg-slate-900 hover:text-white dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 transition-colors"
          title="Share on X"
          aria-label="Share on X"
        >
          <Twitter className="h-3.5 w-3.5" />
        </button>

        {/* Facebook */}
        <button
          onClick={() => handleShare('facebook')}
          className="rounded-xl p-2 bg-slate-100 hover:bg-[#1877F2] hover:text-white dark:bg-slate-800 dark:hover:bg-[#1877F2] text-slate-700 dark:text-slate-300 transition-colors"
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <Facebook className="h-3.5 w-3.5" />
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => handleShare('linkedin')}
          className="rounded-xl p-2 bg-slate-100 hover:bg-[#0A66C2] hover:text-white dark:bg-slate-800 dark:hover:bg-[#0A66C2] text-slate-700 dark:text-slate-300 transition-colors"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-3.5 w-3.5" />
        </button>

        {/* Pinterest */}
        <button
          onClick={() => handleShare('pinterest')}
          className="rounded-xl p-2 bg-slate-100 hover:bg-[#BD081C] hover:text-white dark:bg-slate-800 dark:hover:bg-[#BD081C] text-slate-700 dark:text-slate-300 transition-colors"
          title="Save to Pinterest"
          aria-label="Save to Pinterest"
        >
          <span className="font-black text-xs">P</span>
        </button>

        {/* Copy Link Button */}
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
            copied
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
          }`}
          title="Copy direct review link"
          aria-label="Copy direct review link"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
          <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
};
