"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface RichContentRendererProps {
  html: string;
  className?: string;
}

/**
 * Clean & sanitize DOM nodes to prevent XSS attacks while preserving formatting
 */
function sanitizeDomNode(node: Node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();

    // Remove unsafe script or style tags
    if (tagName === 'script' || tagName === 'style') {
      el.remove();
      return;
    }

    // Remove inline event handlers (onload, onerror, onclick, etc.)
    const attrs = Array.from(el.attributes);
    for (const attr of attrs) {
      if (attr.name.startsWith('on') || attr.value.toLowerCase().startsWith('javascript:')) {
        el.removeAttribute(attr.name);
      }
    }

    // Recursively sanitize children
    Array.from(el.childNodes).forEach(sanitizeDomNode);
  }
}

/**
 * Normalizes raw HTML content for natural document flow:
 * - Floats images to the right (or left if specified) on desktop/tablet
 * - Allows text to wrap around the image naturally
 * - Automatically releases text to 100% FULL width after the image ends
 * - On mobile (< 768px), resets float to none and sets image to 100% block width
 */
function normalizeContentHtml(html: string): string {
  if (!html || typeof window === 'undefined') {
    return html || '';
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Clean dangerous elements/attributes
    Array.from(doc.body.childNodes).forEach(sanitizeDomNode);

    // Normalize images and image wrappers (<figure>, <p><img ...></p>, <img>)
    const imgElements = Array.from(doc.body.querySelectorAll('img'));
    
    imgElements.forEach((img) => {
      const src = img.getAttribute('src');
      if (!src) return;

      const alt = img.getAttribute('alt') || 'Category Media';
      const existingStyle = img.getAttribute('style') || '';
      const existingAlign = img.getAttribute('data-align') || '';
      
      let align = 'right';
      if (existingAlign === 'left' || existingStyle.includes('float: left') || existingStyle.includes('float:left')) {
        align = 'left';
      } else if (existingAlign === 'none' || existingStyle.includes('margin: 20px auto') || existingStyle.includes('display: block')) {
        align = 'none';
      }

      // Create a controlled figure element
      const figure = doc.createElement('figure');
      figure.setAttribute('data-align', align);

      if (align === 'right') {
        figure.className = 'content-flow-image float-none md:float-right md:ml-8 md:mb-5 md:mt-1 w-full md:w-[360px] max-w-full md:max-w-[42%] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-md bg-gray-50 my-6 md:my-2 clear-right';
      } else if (align === 'left') {
        figure.className = 'content-flow-image float-none md:float-left md:mr-8 md:mb-5 md:mt-1 w-full md:w-[360px] max-w-full md:max-w-[42%] rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-md bg-gray-50 my-6 md:my-2 clear-left';
      } else {
        figure.className = 'content-flow-image float-none mx-auto my-6 w-full max-w-2xl rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 shadow-md bg-gray-50';
      }

      // Clean image inline style to prevent overriding responsive float/width rules
      img.removeAttribute('style');
      img.className = 'w-full h-auto max-h-[540px] object-cover object-center rounded-2xl md:rounded-3xl block';

      // Check if image is wrapped inside a parent <p> or <figure>
      const parent = img.parentElement;
      if (parent && (parent.tagName === 'FIGURE' || (parent.tagName === 'P' && parent.childNodes.length === 1))) {
        figure.appendChild(img.cloneNode(true));
        parent.parentNode?.replaceChild(figure, parent);
      } else {
        figure.appendChild(img.cloneNode(true));
        img.parentNode?.replaceChild(figure, img);
      }
    });

    return doc.body.innerHTML;
  } catch (err) {
    console.error('Failed to normalize HTML content flow:', err);
    return html;
  }
}

export default function RichContentRenderer({ html, className }: RichContentRendererProps) {
  const normalizedHtml = useMemo(() => normalizeContentHtml(html), [html]);

  if (!html) return null;

  return (
    <div 
      className={cn(
        "rich-content-flow w-full max-w-none text-[#1a2b4b] text-sm md:text-base leading-relaxed space-y-4 font-normal",
        "after:content-[''] after:table after:clear-both",
        "[&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A5181] [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:clear-none",
        "[&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-bold [&_h3]:text-[#0A5181] [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:clear-none",
        "[&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#0A5181] [&_h4]:mt-3 [&_h4]:mb-1",
        "[&_p]:text-sm [&_p]:md:text-base [&_p]:leading-relaxed [&_p]:text-gray-700 [&_p]:my-3",
        "[&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:list-decimal [&_ol]:pl-5",
        "[&_li]:text-sm [&_li]:md:text-base [&_li]:text-gray-700",
        "[&_a]:text-[#0A5181] [&_a]:underline [&_strong]:font-bold",
        className
      )}
      dangerouslySetInnerHTML={{ __html: normalizedHtml }}
    />
  );
}
