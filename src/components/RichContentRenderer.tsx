"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface RichContentRendererProps {
  html: string;
  className?: string;
  onQuoteClick?: () => void;
}

/**
 * Clean & sanitize HTML string to prevent XSS attacks while preserving formatting.
 * Safe for both Server (Node.js) and Client (Browser) environments.
 */
function sanitizeHtml(html: string): string {
  if (!html) return '';
  let out = html;

  // 1. Strip script and style blocks
  out = out.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  out = out.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // 2. Strip inline event handlers (onload, onerror, onclick, etc.)
  out = out.replace(/\s+on[a-z]+=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 3. Neutralize unsafe protocols in href and src (javascript:, data:, vbscript:)
  out = out.replace(/\bhref\s*=\s*["']\s*(?:javascript|data|vbscript):[^"']*["']/gi, 'href="#"');
  out = out.replace(/\bsrc\s*=\s*["']\s*(?:javascript|vbscript):[^"']*["']/gi, 'src=""');

  return out;
}

/**
 * Transforms an image tag or media block into a standardized responsive floating figure card
 * with a 'GET QUOTE' button overlay matching the brand reference design.
 */
function transformMediaElement(parentAttrs: string, innerHtml: string): string {
  const imgMatch = innerHtml.match(/<img\b([^>]+)>/i);
  if (!imgMatch) {
    return innerHtml;
  }

  const imgAttrs = imgMatch[1];

  // Extract src
  const srcMatch = imgAttrs.match(/src=["']([^"']+)["']/i);
  if (!srcMatch) return innerHtml;
  const src = srcMatch[1];

  // Extract alt
  const altMatch = imgAttrs.match(/alt=["']([^"']*)["']/i);
  const alt = (altMatch && altMatch[1]) ? altMatch[1] : 'Category Media';

  // Determine alignment (checks parent figure data-align/style and image attributes)
  const combinedAttrs = `${parentAttrs || ''} ${imgAttrs || ''}`;
  let align = 'right';

  const alignMatch = combinedAttrs.match(/data-align=["']([^"']+)["']/i);
  if (alignMatch) {
    const a = alignMatch[1].toLowerCase();
    if (a === 'left' || a === 'none' || a === 'right') {
      align = a;
    }
  } else if (/float:\s*left/i.test(combinedAttrs)) {
    align = 'left';
  } else if (/margin:\s*20px\s*auto|display:\s*block/i.test(combinedAttrs) && !/float/i.test(combinedAttrs)) {
    align = 'none';
  }

  let figureClasses = '';
  if (align === 'right') {
    figureClasses = 'relative content-flow-image float-none md:float-right md:ml-8 md:mb-5 md:mt-1 w-full md:w-[360px] max-w-full md:max-w-[42%] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-md bg-gray-50 my-6 md:my-2 clear-right group';
  } else if (align === 'left') {
    figureClasses = 'relative content-flow-image float-none md:float-left md:mr-8 md:mb-5 md:mt-1 w-full md:w-[360px] max-w-full md:max-w-[42%] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-md bg-gray-50 my-6 md:my-2 clear-left group';
  } else {
    figureClasses = 'relative content-flow-image float-none mx-auto my-6 w-full max-w-2xl rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-md bg-gray-50 group';
  }

  return `<figure data-align="${align}" class="${figureClasses}"><img src="${src}" alt="${alt}" class="w-full h-auto max-h-[540px] object-cover object-center rounded-2xl md:rounded-3xl block" /><div class="absolute bottom-4 left-0 right-0 px-4 flex justify-center z-10"><button type="button" data-action="quote-btn" class="w-full max-w-[88%] py-3 px-6 bg-[#DA222A] hover:bg-[#0A5181] text-white text-xs sm:text-sm font-black uppercase tracking-[0.18em] rounded-full shadow-xl shadow-[#DA222A]/30 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-white/20 select-none">GET QUOTE</button></div></figure>`;
}

/**
 * Normalizes raw HTML content for natural document flow:
 * - Deterministic & Isomorphic: runs identically on both Server (Node.js SSR) and Client (Browser)
 * - Eliminates React 19 hydration mismatches on dangerouslySetInnerHTML
 * - Floats images to the right (or left if specified) on desktop/tablet
 * - Allows text to wrap around the image naturally
 * - Automatically releases text to 100% full width after the image ends
 * - On mobile (< 768px), resets float to none and sets image to 100% block width
 * - Overlays a red GET QUOTE button at the bottom of the image card (matching reference UI)
 * - Safely unwraps any non-image content accidentally nested inside figures
 */
function normalizeContentHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  let clean = sanitizeHtml(html);

  // 1. Remove empty figure tags like <figure ...><br></figure> or <figure ...></figure>
  clean = clean.replace(/<figure\b[^>]*>\s*(?:<br\s*\/?>)?\s*<\/figure>/gi, '');

  // 2. Strip external clipboard fragment markers
  clean = clean.replace(/<!--\s*StartFragment\s*-->/gi, '');
  clean = clean.replace(/<!--\s*EndFragment\s*-->/gi, '');

  // 3. Strip external editor attributes (e.g. copied from ProseMirror / Notion / Claude)
  clean = clean.replace(/\scontenteditable=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  clean = clean.replace(/\srole=(?:"textbox"|'textbox')/gi, '');
  clean = clean.replace(/\saria-(?:label|multiline|describedby)=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  clean = clean.replace(/\sdata-(?:markdown-copy-content|newline-selection-appearance|table-selection-appearance|lpop-[a-z-]+|path-to-node)=(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  clean = clean.replace(/\stranslate=(?:"no"|'no')/gi, '');

  // 4. Strip hardcoded inline width styles from non-figure/non-img elements (e.g. width: 727.995px)
  clean = clean.replace(/(<(?:div|p|h[1-6]|ul|ol|li|span|section|article)\b[^>]*)\sstyle=(["'])([\s\S]*?)\2/gi, (match, prefix, quote, styleStr) => {
    let cleaned = styleStr
      .replace(/\bwidth\s*:\s*[^;]+;?/gi, '')
      .replace(/\bmin-width\s*:\s*[^;]+;?/gi, '')
      .replace(/\bmax-width\s*:\s*(?:100vw|none|[^;]+!important);?/gi, '')
      .replace(/\bclear\s*:\s*none\s*;?/gi, '')
      .replace(/--tw-[a-z0-9-]+(?:\s*:\s*[^;]*)?;?/gi, '')
      .replace(/\bcaret-color\s*:\s*[^;]+;?/gi, '')
      .replace(/\bscrollbar-[a-z-]+\s*:\s*[^;]+;?/gi, '')
      .replace(/\boutline\s*:\s*[^;]+;?/gi, '')
      .replace(/\bwhite-space\s*:\s*(?:break-spaces|pre-line)\s*;?/gi, '')
      .trim();

    cleaned = cleaned.replace(/;+/g, ';').replace(/^;|;$/g, '').trim();
    if (!cleaned) return prefix;
    return `${prefix} style=${quote}${cleaned}${quote}`;
  });

  // 5. Unwrap redundant editor wrapper divs (ProseMirror, writing-block-editor, content-mUPWP6, relative z-[1], etc.)
  for (let i = 0; i < 5; i++) {
    const prev = clean;
    clean = clean.replace(/<div\b[^>]*class=(["'])[^"']*(?:ProseMirror|writing-block-editor|magic-edit-minimal|content-mUPWP6|content-xaiQhS|relative z-\[1\])[^"']*\1[^>]*>([\s\S]*?)<\/div>/gi, '$2');
    if (clean === prev) break;
  }

  // 6. Unwrap pseudo-H2 wrappers that actually wrap paragraphs, lists, or block elements
  clean = clean.replace(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi, (match, inner) => {
    if (/<(?:p|ul|ol|div|figure)\b/i.test(inner)) {
      return inner;
    }
    return match;
  });

  // 7. Unwrap redundant double container divs
  for (let i = 0; i < 3; i++) {
    const prev = clean;
    clean = clean.replace(/<div>\s*<div>([\s\S]*?)<\/div>\s*<\/div>/gi, '<div>$1</div>');
    if (clean === prev) break;
  }

  // 8. Unwrap any <figure ...> that does NOT contain an <img> (e.g. text blocks accidentally wrapped in figure)
  clean = clean.replace(/<figure\b[^>]*>((?:(?!<figure\b|<img\b)[\s\S])*?)<\/figure>/gi, (match, figInner) => {
    if (!/<img\b/i.test(figInner)) {
      return `<div>${figInner}</div>`;
    }
    return match;
  });

  // 9. Transform figures containing an <img>
  clean = clean.replace(/<figure\b([^>]*)>([\s\S]*?<img\b[^>]+>[\s\S]*?)<\/figure>/gi, (match, figAttrs, figInner) => {
    return transformMediaElement(figAttrs, figInner);
  });

  // 10. Transform <p> tags containing ONLY an <img>
  clean = clean.replace(/<p\b[^>]*>\s*(<img\b[^>]+>)\s*<\/p>/gi, (match, imgTag) => {
    if (/data-action="quote-btn"/i.test(match)) return match;
    return transformMediaElement('', imgTag);
  });

  // 11. Transform standalone <img> tags that are NOT inside a content-flow-image figure
  clean = clean.replace(/<img\b([^>]+)>/gi, (match, imgAttrs) => {
    if (/object-cover/i.test(imgAttrs) && /rounded-2xl/i.test(imgAttrs)) {
      return match;
    }
    return transformMediaElement('', match);
  });

  // 12. Normalize hyperlinks: ensure external links have target="_blank" and rel="noopener noreferrer"
  clean = clean.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    const hrefMatch = attrs.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    if (!hrefMatch) return match;

    const href = hrefMatch[1].trim();
    const isExternal = /^https?:\/\//i.test(href) && !href.includes('babulalpremkumar.com') && !href.includes('localhost');
    const hasTarget = /\btarget\s*=/i.test(attrs);
    const hasRel = /\brel\s*=/i.test(attrs);

    let newAttrs = attrs;

    // If target="_blank" is already set, ensure rel="noopener noreferrer"
    if (/\btarget\s*=\s*["']_blank["']/i.test(attrs)) {
      if (!hasRel) {
        newAttrs += ' rel="noopener noreferrer"';
      }
    } else if (isExternal && !hasTarget) {
      newAttrs += ' target="_blank" rel="noopener noreferrer"';
    }

    return `<a${newAttrs}>`;
  });

  return clean;
}

export default function RichContentRenderer({ html, className, onQuoteClick }: RichContentRendererProps) {
  const normalizedHtml = useMemo(() => normalizeContentHtml(html), [html]);

  if (!html) return null;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // 1. Quote button action
    const btn = target.closest('[data-action="quote-btn"]');
    if (btn && onQuoteClick) {
      e.preventDefault();
      e.stopPropagation();
      onQuoteClick();
      return;
    }

    // 2. Anchor tag safety
    const anchor = target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.toLowerCase().startsWith('javascript:')) {
        e.preventDefault();
        return;
      }
    }
  };

  return (
    <div 
      onClick={handleClick}
      suppressHydrationWarning
      className={cn(
        "rich-content-flow w-full max-w-none text-[#1a2b4b] text-sm md:text-base leading-relaxed space-y-4 font-normal",
        "after:content-[''] after:table after:clear-both",
        "[&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A5181] [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:w-full [&_h2]:block",
        "[&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-bold [&_h3]:text-[#0A5181] [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:w-full [&_h3]:block",
        "[&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#0A5181] [&_h4]:mt-4 [&_h4]:mb-1 [&_h4]:w-full",
        "[&_p]:text-sm [&_p]:md:text-base [&_p]:leading-relaxed [&_p]:text-gray-700 [&_p]:my-3.5 [&_p]:w-full",
        "[&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:w-full",
        "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:w-full",
        "[&_li]:text-sm [&_li]:md:text-base [&_li]:text-gray-700",
        "[&_a]:text-[#0A5181] [&_a]:underline [&_a]:font-semibold [&_a]:cursor-pointer hover:[&_a]:text-[#DA222A] [&_a]:transition-colors [&_strong]:font-bold",
        className
      )}
      dangerouslySetInnerHTML={{ __html: normalizedHtml }}
    />
  );
}
