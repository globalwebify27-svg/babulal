"use client";

import React, { useState } from 'react';
import { MessageCircle, Share2, Check, Copy } from 'lucide-react';
import { Haptics } from '@/lib/haptics';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const handleCopy = async () => {
    Haptics.light();
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="flex items-center gap-3 py-4">
      <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest mr-2 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5 text-[#0A5181]" /> Share Story:
      </span>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => Haptics.light()}
        className="w-9 h-9 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center shadow-sm"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4" />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => Haptics.light()}
        className="w-9 h-9 rounded-full bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all flex items-center justify-center shadow-sm font-bold text-xs"
        title="Share on Facebook"
      >
        f
      </a>

      {/* Twitter / X */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => Haptics.light()}
        className="w-9 h-9 rounded-full bg-black/10 text-black hover:bg-black hover:text-white transition-all flex items-center justify-center shadow-sm font-bold text-xs"
        title="Share on X"
      >
        𝕏
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className={`px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
          copied 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3" /> Copied
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" /> Copy Link
          </>
        )}
      </button>
    </div>
  );
}
