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
  Maximize2
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
          className="outline-none min-h-[320px] prose max-w-none text-[#1a2b4b] text-sm leading-relaxed focus:outline-none"
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
