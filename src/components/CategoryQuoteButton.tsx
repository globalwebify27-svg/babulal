"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppQuoteUrl } from '@/lib/whatsapp';
import { DEFAULT_WHATSAPP_NUMBER } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CategoryQuoteButtonProps {
  categoryName: string;
  parentCategory?: string;
  categoryUrl: string;
  whatsappNumber?: string;
  className?: string;
  variant?: 'solid' | 'outline' | 'compact';
}

export default function CategoryQuoteButton({
  categoryName,
  parentCategory = 'Textiles',
  categoryUrl,
  whatsappNumber: propWhatsappNumber,
  className,
  variant = 'solid'
}: CategoryQuoteButtonProps) {
  const [activeNumber, setActiveNumber] = useState<string>(propWhatsappNumber || DEFAULT_WHATSAPP_NUMBER);

  useEffect(() => {
    if (propWhatsappNumber) {
      setActiveNumber(propWhatsappNumber);
      return;
    }

    // Fetch site-wide active WhatsApp number if not explicitly passed as prop
    let isMounted = true;
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data?.whatsappNumber) {
          setActiveNumber(data.whatsappNumber);
        }
      })
      .catch(() => {
        // Fallback to default number if fetch fails
      });

    return () => {
      isMounted = false;
    };
  }, [propWhatsappNumber]);

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const quoteUrl = buildWhatsAppQuoteUrl(
      activeNumber,
      parentCategory,
      categoryName,
      categoryUrl
    );

    if (!quoteUrl) {
      alert('WhatsApp inquiry is currently unavailable.');
      return;
    }

    window.open(quoteUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleQuoteClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 font-black uppercase tracking-wider rounded-xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer select-none",
        variant === 'solid' && "bg-[#25D366] text-white hover:bg-[#20ba5a] py-2 px-3 text-[10px] sm:text-xs",
        variant === 'outline' && "border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white py-2 px-3 text-[10px] sm:text-xs",
        variant === 'compact' && "bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white py-1.5 px-2.5 text-[9px]",
        className
      )}
      title={`Request quote for ${categoryName}`}
    >
      <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0" />
      <span>Get Quote</span>
    </button>
  );
}
