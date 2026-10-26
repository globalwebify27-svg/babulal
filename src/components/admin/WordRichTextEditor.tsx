"use client";

import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Undo, 
  Redo, 
  Heading1, 
  Heading2, 
  Heading3,
  Upload,
  PanelLeft,
  PanelRight,
  Maximize2,
  Type,
  Eraser,
  ExternalLink,
  Unlink,
  AlertCircle,
  X,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WordRichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export default function WordRichTextEditor({ value, onChange, placeholder = "Start writing styled SEO content...", className }: WordRichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageAlt, setImageAlt] = useState<string>('');
  const [imageFloat, setImageFloat] = useState<'right' | 'left' | 'none'>('right');
  const [imageWidth, setImageWidth] = useState<'40%' | '50%' | '100%'>('40%');

  // Hyperlink Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState<string>('');
  const [linkText, setLinkText] = useState<string>('');
  const [linkOpenInNewTab, setLinkOpenInNewTab] = useState<boolean>(false);
  const [linkError, setLinkError] = useState<string>('');
  const [savedRange, setSavedRange] = useState<Range | null>(null);
  const [selectedAnchor, setSelectedAnchor] = useState<HTMLAnchorElement | null>(null);
  const [isCursorInLink, setIsCursorInLink] = useState(false);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Sync value from parent into contentEditable innerHTML when value changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execCmd = (command: string, valueArg: string = '') => {
    document.execCommand(command, false, valueArg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleHeadingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) return;
    if (val === 'p') {
      execCmd('formatBlock', '<p>');
    } else {
      execCmd('formatBlock', `<${val}>`);
    }
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sizeVal = e.target.value;
    if (!sizeVal) return;

    if (sizeVal === 'default') {
      document.execCommand('removeFormat', false);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
      return;
    }

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = sizeVal;
      try {
        range.surroundContents(span);
      } catch (err) {
        document.execCommand('styleWithCSS', false, 'true');
        document.execCommand('fontSize', false, '7');
        if (editorRef.current) {
          const fontEls = editorRef.current.querySelectorAll('font[size="7"]');
          fontEls.forEach((fontEl) => {
            const replacement = document.createElement('span');
            replacement.style.fontSize = sizeVal;
            replacement.innerHTML = fontEl.innerHTML;
            fontEl.parentNode?.replaceChild(replacement, fontEl);
          });
        }
      }
    } else {
      document.execCommand('styleWithCSS', false, 'true');
      document.execCommand('fontSize', false, '7');
      if (editorRef.current) {
        const fontEls = editorRef.current.querySelectorAll('font[size="7"]');
        fontEls.forEach((fontEl) => {
          const replacement = document.createElement('span');
          replacement.style.fontSize = sizeVal;
          replacement.innerHTML = fontEl.innerHTML;
          fontEl.parentNode?.replaceChild(replacement, fontEl);
        });
      }
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');

    if (html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Clean inline font-size, font-family, and huge margins from pasted content
      const allElements = doc.body.querySelectorAll('*');
      allElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.fontSize = '';
          el.style.fontFamily = '';
          el.style.lineHeight = '';
          el.style.backgroundColor = '';
          el.removeAttribute('size');
          el.removeAttribute('face');

          // Convert H1 to H2 for SEO category hierarchy
          if (el.tagName === 'H1') {
            const h2 = doc.createElement('h2');
            h2.innerHTML = el.innerHTML;
            el.parentNode?.replaceChild(h2, el);
          }
        }
      });

      const cleanedHtml = doc.body.innerHTML;
      document.execCommand('insertHTML', false, cleanedHtml);
    } else if (text) {
      const formatted = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => `<p>${line}</p>`)
        .join('');
      document.execCommand('insertHTML', false, formatted || text);
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const checkSelectionState = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      const range = sel.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        let node: Node | null = range.commonAncestorContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
        const inLink = !!(node && (node as HTMLElement).closest && (node as HTMLElement).closest('a'));
        setIsCursorInLink(inLink);
        return;
      }
    }
    setIsCursorInLink(false);
  };

  useEffect(() => {
    if (isLinkModalOpen) {
      setTimeout(() => {
        urlInputRef.current?.focus();
        urlInputRef.current?.select();
      }, 50);
    }
  }, [isLinkModalOpen]);

  const validateAndNormalizeUrl = (raw: string): { valid: boolean; normalized: string; error?: string } => {
    const trimmed = raw.trim();
    if (!trimmed) {
      return { valid: false, normalized: '', error: 'Please enter a destination URL or relative path' };
    }

    const lower = trimmed.toLowerCase();

    // 1. Strictly reject unsafe protocols
    if (
      lower.startsWith('javascript:') ||
      lower.startsWith('data:') ||
      lower.startsWith('vbscript:') ||
      lower.startsWith('file:')
    ) {
      return {
        valid: false,
        normalized: '',
        error: 'Unsafe protocol detected. JavaScript and data URIs are not allowed.'
      };
    }

    // 2. Approved full protocols
    if (
      lower.startsWith('https://') ||
      lower.startsWith('http://') ||
      lower.startsWith('mailto:') ||
      lower.startsWith('tel:')
    ) {
      return { valid: true, normalized: trimmed };
    }

    // 3. Approved root-relative or hash paths (/saree, /about-us, #section)
    if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
      return { valid: true, normalized: trimmed };
    }

    // 4. Domain-like (e.g. "babulalpremkumar.com", "example.com/page", "www.google.com")
    if (/^[a-zA-Z0-9][-a-zA-Z0-9.]*\.[a-zA-Z]{2,}/.test(trimmed)) {
      return { valid: true, normalized: `https://${trimmed}` };
    }

    // 5. Default internal relative slug (e.g. "saree" -> "/saree")
    return { valid: true, normalized: `/${trimmed}` };
  };

  const handleAddLink = () => {
    setLinkError('');
    const sel = window.getSelection();
    let currentRange: Range | null = null;
    let anchorEl: HTMLAnchorElement | null = null;

    if (sel && sel.rangeCount > 0 && editorRef.current) {
      const r = sel.getRangeAt(0);
      if (editorRef.current.contains(r.commonAncestorContainer)) {
        currentRange = r;
        let node: Node | null = r.commonAncestorContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
        if (node && (node as HTMLElement).closest) {
          anchorEl = (node as HTMLElement).closest('a');
        }
      }
    }

    if (anchorEl) {
      setSelectedAnchor(anchorEl);
      setLinkUrl(anchorEl.getAttribute('href') || '');
      setLinkText(anchorEl.textContent || '');
      setLinkOpenInNewTab(anchorEl.getAttribute('target') === '_blank');
      setSavedRange(currentRange ? currentRange.cloneRange() : null);
    } else {
      setSelectedAnchor(null);
      const text = currentRange ? currentRange.toString() : '';
      setLinkText(text);
      setLinkUrl('');
      setLinkOpenInNewTab(false);
      setSavedRange(currentRange ? currentRange.cloneRange() : null);
    }

    setIsLinkModalOpen(true);
  };

  const handleApplyLink = () => {
    const check = validateAndNormalizeUrl(linkUrl);
    if (!check.valid) {
      setLinkError(check.error || 'Invalid URL');
      return;
    }

    const finalUrl = check.normalized;
    const displayText = linkText.trim() || finalUrl;

    // A. Editing existing anchor
    if (selectedAnchor && editorRef.current?.contains(selectedAnchor)) {
      selectedAnchor.setAttribute('href', finalUrl);
      selectedAnchor.textContent = displayText;

      if (linkOpenInNewTab) {
        selectedAnchor.setAttribute('target', '_blank');
        selectedAnchor.setAttribute('rel', 'noopener noreferrer');
      } else {
        selectedAnchor.removeAttribute('target');
        selectedAnchor.removeAttribute('rel');
      }

      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
      closeLinkModal();
      return;
    }

    // B. Inserting a new anchor
    if (editorRef.current) {
      editorRef.current.focus();

      const sel = window.getSelection();
      let range = savedRange;

      if (range && sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      } else if (sel && sel.rangeCount > 0 && editorRef.current.contains(sel.getRangeAt(0).commonAncestorContainer)) {
        range = sel.getRangeAt(0);
      }

      const a = document.createElement('a');
      a.href = finalUrl;
      a.textContent = displayText;
      if (linkOpenInNewTab) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }

      if (range && editorRef.current.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        range.insertNode(a);

        // Insert non-breaking space after link so typing can continue smoothly outside
        const space = document.createTextNode('\u00A0');
        if (a.parentNode) {
          a.parentNode.insertBefore(space, a.nextSibling);
        }

        const newRange = document.createRange();
        newRange.setStartAfter(space);
        newRange.collapse(true);
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      } else {
        editorRef.current.appendChild(a);
      }

      onChange(editorRef.current.innerHTML);
    }

    closeLinkModal();
  };

  const handleRemoveLink = () => {
    if (selectedAnchor && selectedAnchor.parentNode) {
      const parent = selectedAnchor.parentNode;
      while (selectedAnchor.firstChild) {
        parent.insertBefore(selectedAnchor.firstChild, selectedAnchor);
      }
      parent.removeChild(selectedAnchor);

      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
    closeLinkModal();
  };

  const closeLinkModal = () => {
    setIsLinkModalOpen(false);
    setLinkUrl('');
    setLinkText('');
    setLinkOpenInNewTab(false);
    setLinkError('');
    setSelectedAnchor(null);
    setSavedRange(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (anchor && editorRef.current?.contains(anchor)) {
      e.preventDefault();
      setSelectedAnchor(anchor as HTMLAnchorElement);
      setLinkUrl(anchor.getAttribute('href') || '');
      setLinkText(anchor.textContent || '');
      setLinkOpenInNewTab(anchor.getAttribute('target') === '_blank');
      setLinkError('');
      setIsLinkModalOpen(true);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setIsImageModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImageIntoEditor = () => {
    if (!imagePreview) return;

    const altText = imageAlt || 'SEO Content Image';
    const imgTag = `<figure class="content-media-figure" data-align="${imageFloat}"><img src="${imagePreview}" alt="${altText}" /></figure><p><br></p>`;

    if (editorRef.current) {
      editorRef.current.focus();
      execCmd('insertHTML', imgTag);
    }

    setIsImageModalOpen(false);
    setImagePreview('');
    setImageAlt('');
  };

  return (
    <div className={cn("border border-[#d1d9e6] rounded-3xl overflow-hidden bg-white shadow-sm flex flex-col", className)}>
      {/* WORD-LIKE TOOLBAR */}
      <div className="bg-[#f8fafc] border-b border-[#d1d9e6] p-3 flex flex-wrap items-center gap-2 select-none">
        
        {/* HEADING SELECTOR */}
        <select
          onChange={handleHeadingChange}
          defaultValue="p"
          className="px-3 py-1.5 bg-white border border-[#d1d9e6] rounded-xl text-xs font-black text-[#1a2b4b] outline-none cursor-pointer hover:border-[#095181] transition-all"
        >
          <option value="p">Normal Text</option>
          <option value="h2">Heading 2 (H2)</option>
          <option value="h3">Heading 3 (H3)</option>
          <option value="h4">Heading 4 (H4)</option>
        </select>

        {/* FONT SIZE SELECTOR (DYNAMIC TEXT SIZE CONTROL) */}
        <select
          onChange={handleFontSizeChange}
          defaultValue="default"
          className="px-3 py-1.5 bg-white border border-[#d1d9e6] rounded-xl text-xs font-black text-[#095181] outline-none cursor-pointer hover:border-[#095181] transition-all"
          title="Dynamic Text Size"
        >
          <option value="default">Font Size (Auto)</option>
          <option value="12px">12px (Small)</option>
          <option value="14px">14px (Normal)</option>
          <option value="16px">16px (Medium)</option>
          <option value="18px">18px (Large)</option>
          <option value="20px">20px (XL)</option>
          <option value="24px">24px (2XL - Heading)</option>
          <option value="28px">28px (3XL - Title)</option>
          <option value="32px">32px (4XL - Huge)</option>
        </select>

        <div className="h-5 w-px bg-[#d1d9e6] mx-1" />

        {/* TEXT STYLES */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('bold')}
          title="Bold (Ctrl+B)"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('italic')}
          title="Italic (Ctrl+I)"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('underline')}
          title="Underline (Ctrl+U)"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <Underline className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('strikeThrough')}
          title="Strikethrough"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-[#d1d9e6] mx-1" />

        {/* LISTS */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('insertUnorderedList')}
          title="Bullet Points List"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('insertOrderedList')}
          title="Numbered List"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-[#d1d9e6] mx-1" />

        {/* ALIGNMENT */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('justifyLeft')}
          title="Align Left"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('justifyCenter')}
          title="Align Center"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('justifyRight')}
          title="Align Right"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-[#d1d9e6] mx-1" />

        {/* LINK & INLINE IMAGE UPLOAD */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleAddLink}
          title={isCursorInLink ? "Edit / Remove Hyperlink" : "Insert Hyperlink"}
          className={cn(
            "p-2 rounded-xl border transition-all flex items-center gap-1",
            isCursorInLink 
              ? "bg-[#095181] text-white border-[#095181] shadow-sm" 
              : "bg-white border-[#d1d9e6] hover:bg-[#095181] hover:text-white text-[#1a2b4b]"
          )}
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <label title="Insert Inline Image (Side-by-Side or Full Width)" className="cursor-pointer">
          <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white transition-all flex items-center gap-1.5 text-[10px] font-black uppercase">
            <ImageIcon className="w-4 h-4" /> + Insert Image
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
        </label>

        <div className="h-5 w-px bg-[#d1d9e6] mx-1" />

        {/* UNDO / REDO */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('undo')}
          title="Undo"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCmd('redo')}
          title="Redo"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* EDITOR CANVAS AREA */}
      <div className="p-6 relative min-h-[350px] bg-white flex-1 overflow-y-auto">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onPaste={handlePaste}
          onClick={handleCanvasClick}
          onKeyUp={checkSelectionState}
          onMouseUp={checkSelectionState}
          className="outline-none min-h-[320px] max-w-none text-[#1a2b4b] text-sm md:text-base leading-relaxed space-y-4 font-normal [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A5181] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-bold [&_h3]:text-[#0A5181] [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#0A5181] [&_h4]:mt-3 [&_h4]:mb-1 [&_p]:text-sm [&_p]:md:text-base [&_p]:leading-relaxed [&_p]:text-gray-700 [&_p]:my-3 [&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-sm [&_li]:md:text-base [&_li]:text-gray-700 [&_img]:rounded-2xl [&_img]:shadow-lg [&_img]:my-4 [&_a]:text-[#0A5181] [&_a]:underline [&_a]:font-semibold [&_a]:cursor-pointer hover:[&_a]:text-[#DA222A] [&_a]:transition-colors focus:outline-none"
          style={{ wordBreak: 'break-word' }}
        />
        {!value && (
          <div className="absolute top-6 left-6 pointer-events-none text-gray-300 text-sm font-medium italic">
            {placeholder}
          </div>
        )}
      </div>

      {/* HYPERLINK MODAL */}
      {isLinkModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              closeLinkModal();
            }
          }}
        >
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#d1d9e6] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#f0f3f8] pb-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#095181]" />
                <h3 className="text-base font-black uppercase text-[#1a2b4b] italic italic-accent">
                  {selectedAnchor ? 'Edit Hyperlink' : 'Insert Hyperlink'}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeLinkModal}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {linkError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs font-bold text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{linkError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#1a2b4b]/60 uppercase tracking-widest flex items-center justify-between">
                  <span>Destination URL or Path *</span>
                  <span className="text-gray-400 font-normal">e.g. /saree or https://...</span>
                </label>
                <input
                  ref={urlInputRef}
                  type="text"
                  placeholder="https://example.com or /saree"
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    if (linkError) setLinkError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyLink();
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold text-[#1a2b4b] outline-none focus:ring-2 focus:ring-[#095181]/20 focus:border-[#095181]"
                />
                <p className="text-[10px] text-gray-400 font-medium">
                  Supports internal paths (<code>/saree</code>), external URLs (<code>https://...</code>), <code>mailto:</code>, and <code>tel:</code>.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#1a2b4b]/60 uppercase tracking-widest">
                  Display Link Text (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Link text to display in the article..."
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyLink();
                    }
                  }}
                  className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold text-[#1a2b4b] outline-none focus:ring-2 focus:ring-[#095181]/20 focus:border-[#095181]"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={linkOpenInNewTab}
                    onChange={(e) => setLinkOpenInNewTab(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#095181] focus:ring-[#095181] cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#1a2b4b]">Open link in new tab (<code>target="_blank"</code>)</span>
                    <p className="text-[10px] text-gray-400 font-medium">Adds <code>rel="noopener noreferrer"</code> for security.</p>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#f0f3f8]">
              {selectedAnchor ? (
                <button
                  type="button"
                  onClick={handleRemoveLink}
                  className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Remove hyperlink and keep text"
                >
                  <Unlink className="w-3.5 h-3.5" /> Remove Link
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeLinkModal}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyLink}
                  className="px-5 py-2.5 bg-[#095181] hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {selectedAnchor ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Update Link
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-3.5 h-3.5" /> Insert Link
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INLINE IMAGE LAYOUT MODAL */}
      {isImageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#d1d9e6] shadow-2xl space-y-5">
            <h3 className="text-base font-black uppercase text-[#1a2b4b] italic italic-accent">
              Configure Inline Image Layout
            </h3>

            {imagePreview && (
              <div className="w-full h-44 rounded-2xl overflow-hidden border border-[#d1d9e6] bg-[#f8fafc]">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#1a2b4b]/50 uppercase tracking-widest">Image Alt Text (SEO)</label>
              <input
                type="text"
                placeholder="Descriptive alt text for image..."
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#1a2b4b]/50 uppercase tracking-widest">Layout & Alignment (Side-by-Side Reference)</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setImageFloat('right')}
                  className={cn(
                    "p-3 rounded-xl border text-[10px] font-black uppercase flex flex-col items-center gap-1 transition-all",
                    imageFloat === 'right' ? "bg-purple-600 text-white border-purple-600" : "bg-[#f8fafc] text-[#1a2b4b]"
                  )}
                >
                  <PanelRight className="w-4 h-4" /> Side (Right)
                </button>
                <button
                  type="button"
                  onClick={() => setImageFloat('left')}
                  className={cn(
                    "p-3 rounded-xl border text-[10px] font-black uppercase flex flex-col items-center gap-1 transition-all",
                    imageFloat === 'left' ? "bg-purple-600 text-white border-purple-600" : "bg-[#f8fafc] text-[#1a2b4b]"
                  )}
                >
                  <PanelLeft className="w-4 h-4" /> Side (Left)
                </button>
                <button
                  type="button"
                  onClick={() => setImageFloat('none')}
                  className={cn(
                    "p-3 rounded-xl border text-[10px] font-black uppercase flex flex-col items-center gap-1 transition-all",
                    imageFloat === 'none' ? "bg-purple-600 text-white border-purple-600" : "bg-[#f8fafc] text-[#1a2b4b]"
                  )}
                >
                  <Maximize2 className="w-4 h-4" /> Full Width
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="px-5 py-2.5 bg-gray-100 rounded-xl text-xs font-bold uppercase text-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImageIntoEditor}
                className="px-6 py-2.5 bg-[#095181] text-white rounded-xl text-xs font-black uppercase shadow-lg hover:bg-purple-600 transition-all"
              >
                Insert Image into Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
