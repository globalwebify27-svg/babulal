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
  Eraser
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

  const handleAddLink = () => {
    const url = prompt('Enter website link URL:');
    if (url) {
      execCmd('createLink', url);
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

    let styleString = '';
    if (imageFloat === 'right') {
      styleString = `float: right; margin-left: 24px; margin-bottom: 16px; max-width: ${imageWidth}; width: 100%; border-radius: 16px; shadow: 0 4px 12px rgba(0,0,0,0.1);`;
    } else if (imageFloat === 'left') {
      styleString = `float: left; margin-right: 24px; margin-bottom: 16px; max-width: ${imageWidth}; width: 100%; border-radius: 16px; shadow: 0 4px 12px rgba(0,0,0,0.1);`;
    } else {
      styleString = `display: block; margin: 20px auto; max-width: 100%; width: 100%; border-radius: 16px; shadow: 0 4px 12px rgba(0,0,0,0.1);`;
    }

    const imgTag = `<img src="${imagePreview}" alt="${imageAlt || 'SEO Content Image'}" style="${styleString}" />`;

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
          onClick={() => execCmd('bold')}
          title="Bold (Ctrl+B)"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCmd('italic')}
          title="Italic (Ctrl+I)"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCmd('underline')}
          title="Underline (Ctrl+U)"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <Underline className="w-4 h-4" />
        </button>

        <button
          type="button"
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
          onClick={() => execCmd('insertUnorderedList')}
          title="Bullet Points List"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
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
          onClick={() => execCmd('justifyLeft')}
          title="Align Left"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCmd('justifyCenter')}
          title="Align Center"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
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
          onClick={handleAddLink}
          title="Insert Hyperlink"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
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
          onClick={() => execCmd('undo')}
          title="Undo"
          className="p-2 rounded-xl bg-white border border-[#d1d9e6] hover:bg-[#095181] hover:text-white transition-all text-[#1a2b4b]"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
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
          className="outline-none min-h-[320px] max-w-none text-[#1a2b4b] text-sm md:text-base leading-relaxed space-y-4 font-normal [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-[#0A5181] [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-bold [&_h3]:text-[#0A5181] [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-base [&_h4]:font-bold [&_h4]:text-[#0A5181] [&_h4]:mt-3 [&_h4]:mb-1 [&_p]:text-sm [&_p]:md:text-base [&_p]:leading-relaxed [&_p]:text-gray-700 [&_p]:my-3 [&_ul]:space-y-2 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-sm [&_li]:md:text-base [&_li]:text-gray-700 [&_img]:rounded-2xl [&_img]:shadow-lg [&_img]:my-4 focus:outline-none"
          style={{ wordBreak: 'break-word' }}
        />
        {!value && (
          <div className="absolute top-6 left-6 pointer-events-none text-gray-300 text-sm font-medium italic">
            {placeholder}
          </div>
        )}
      </div>

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
