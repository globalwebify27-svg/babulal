"use client";

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Globe, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ListPlus,
  FileCode,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import WordRichTextEditor from '@/components/admin/WordRichTextEditor';

interface Section {
  id?: number | string;
  heading: string;
  headingLevel: 'H2' | 'H3' | 'H4';
  content: string;
  bulletPoints: string[];
  image: string;
  imageAlt: string;
  videoUrl: string;
  orderIndex: number;
  isActive: boolean;
}

export default function CategorySEOEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const targetIdStr = resolvedParams.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'word' | 'structured'>('word');

  const [targetInfo, setTargetInfo] = useState<any>(null);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [seoId, setSeoId] = useState<number | null>(null);

  // SEO Form Fields
  const [h1, setH1] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robotsIndex, setRobotsIndex] = useState('index');
  const [robotsFollow, setRobotsFollow] = useState('follow');
  const [status, setStatus] = useState('Published');

  // Word Rich Text Content (HTML)
  const [htmlContent, setHtmlContent] = useState('');

  // Media & Intro
  const [introContent, setIntroContent] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerAlt, setBannerAlt] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [relatedCategoryIds, setRelatedCategoryIds] = useState<string[]>([]);
  const [showInventoryCatalog, setShowInventoryCatalog] = useState(false);

  // Dynamic Content Sections (Structured)
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetchSeoContent();
  }, [targetIdStr]);

  const fetchSeoContent = async () => {
    setIsLoading(true);
    try {
      let queryParam = '';
      if (targetIdStr.startsWith('subsub-')) {
        queryParam = `subSubCategoryId=${targetIdStr.replace('subsub-', '')}`;
      } else if (targetIdStr.startsWith('sub-')) {
        queryParam = `subCategoryId=${targetIdStr.replace('sub-', '')}`;
      } else if (targetIdStr.startsWith('cat-')) {
        queryParam = `categoryId=${targetIdStr.replace('cat-', '')}`;
      } else {
        queryParam = `id=${targetIdStr}`;
      }

      const res = await fetch(`/api/admin/category-content?${queryParam}`, { cache: 'no-store' });
      const data = await res.json();

      if (res.ok) {
        setTargetInfo(data.targetInfo);
        setAllCategories(data.allCategories || []);

        if (data.seoContent) {
          setSeoId(data.seoContent.id);
          setH1(data.seoContent.h1 || '');
          setMetaTitle(data.seoContent.metaTitle || '');
          setMetaDescription(data.seoContent.metaDescription || '');
          setCanonicalUrl(data.seoContent.canonicalUrl || '');
          setRobotsIndex(data.seoContent.robotsIndex || 'index');
          setRobotsFollow(data.seoContent.robotsFollow || 'follow');
          setStatus(data.seoContent.status || 'Published');
          setHtmlContent(data.seoContent.htmlContent || '');
          setIntroContent(data.seoContent.introContent || '');
          setBannerImage(data.seoContent.bannerImage || '');
          setBannerAlt(data.seoContent.bannerAlt || '');
          setYoutubeUrl(data.seoContent.youtubeUrl || '');
          setRelatedCategoryIds(data.seoContent.relatedCategoryIds || []);
          setShowInventoryCatalog(
            data.seoContent.showInventoryCatalog !== undefined && data.seoContent.showInventoryCatalog !== null 
              ? !!data.seoContent.showInventoryCatalog 
              : false
          );

          if (data.seoContent.htmlContent) {
            setActiveTab('word');
          }
        } else {
          // Pre-populate sensible defaults if new record
          if (data.targetInfo) {
            setH1(`Wholesale ${data.targetInfo.name} in Ranchi`);
            setMetaTitle(`${data.targetInfo.name} Wholesalers & Distributors in Ranchi | Babulal Premkumar`);
            setMetaDescription(`Direct wholesale supply of high-quality ${data.targetInfo.name}. Best prices, century-old legacy, fast regional distribution across Ranchi and Jharkhand.`);
          }
        }

        if (Array.isArray(data.sections)) {
          setSections(data.sections);
        }
      } else {
        setErrorMsg(data.error || 'Failed to load category content');
      }
    } catch (err: any) {
      console.error('Fetch SEO Content Error:', err);
      setErrorMsg('Error connecting to backend server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddSection = () => {
    setSections(prev => [
      ...prev,
      {
        heading: '',
        headingLevel: 'H2',
        content: '',
        bulletPoints: [],
        image: '',
        imageAlt: '',
        videoUrl: '',
        orderIndex: prev.length,
        isActive: true
      }
    ]);
  };

  const handleUpdateSection = (index: number, updates: Partial<Section>) => {
    setSections(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleDeleteSection = (index: number) => {
    setSections(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    setSections(prev => {
      const next = [...prev];
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIdx];
      next[targetIdx] = temp;
      return next.map((s, i) => ({ ...s, orderIndex: i }));
    });
  };

  const handleAddBulletPoint = (secIndex: number) => {
    setSections(prev => {
      const next = [...prev];
      const sec = next[secIndex];
      next[secIndex] = {
        ...sec,
        bulletPoints: [...(sec.bulletPoints || []), '']
      };
      return next;
    });
  };

  const handleUpdateBulletPoint = (secIndex: number, bulletIndex: number, text: string) => {
    setSections(prev => {
      const next = [...prev];
      const sec = next[secIndex];
      const bullets = [...(sec.bulletPoints || [])];
      bullets[bulletIndex] = text;
      next[secIndex] = { ...sec, bulletPoints: bullets };
      return next;
    });
  };

  const handleDeleteBulletPoint = (secIndex: number, bulletIndex: number) => {
    setSections(prev => {
      const next = [...prev];
      const sec = next[secIndex];
      next[secIndex] = {
        ...sec,
        bulletPoints: (sec.bulletPoints || []).filter((_, i) => i !== bulletIndex)
      };
      return next;
    });
  };

  const toggleRelatedCategory = (catId: string) => {
    setRelatedCategoryIds(prev => 
      prev.includes(catId)
        ? prev.filter(id => id !== catId)
        : [...prev, catId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      let categoryId = null;
      let subCategoryId = null;
      let subSubCategoryId = null;

      if (targetInfo) {
        if (targetInfo.type === 'subSubCategory') {
          subSubCategoryId = targetInfo.id;
        } else if (targetInfo.type === 'subCategory') {
          subCategoryId = targetInfo.id;
        } else {
          categoryId = targetInfo.id;
        }
      }

      const payload = {
        id: seoId,
        categoryId,
        subCategoryId,
        subSubCategoryId,
        h1,
        metaTitle,
        metaDescription,
        canonicalUrl,
        robotsIndex,
        robotsFollow,
        status,
        htmlContent,
        introContent,
        bannerImage,
        bannerAlt,
        youtubeUrl,
        relatedCategoryIds,
        showInventoryCatalog,
        sections
      };

      const res = await fetch('/api/admin/category-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setSeoId(data.id);
        setSuccessMsg('Category SEO & Content saved and published successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(data.error || 'Failed to save SEO content');
      }
    } catch (err: any) {
      console.error('Save SEO Error:', err);
      setErrorMsg('Error saving category content to server');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] flex flex-col items-center justify-center gap-4 text-[#095181]/40">
        <Loader2 className="w-10 h-10 animate-spin text-[#095181]" />
        <span className="text-xs font-black uppercase tracking-widest">Loading Category SEO Engine...</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f5f7fb] min-h-screen pb-32">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6]">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/categories"
            className="w-12 h-12 rounded-2xl bg-[#f8fafc] border border-[#d1d9e6] flex items-center justify-center text-[#1a2b4b] hover:bg-[#095181] hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-purple-100 text-purple-700">
                {targetInfo?.type === 'subSubCategory' ? `SUB-SUBCATEGORY SEO` : targetInfo?.type === 'subCategory' ? `SUBCATEGORY SEO` : `MAIN CATEGORY SEO`}
              </span>
              {targetInfo?.targetUrl && (
                <a 
                  href={targetInfo.targetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-[#095181] hover:underline flex items-center gap-1"
                >
                  View Public Page <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <h1 className="text-2xl font-black text-[#1a2b4b] uppercase tracking-tight italic italic-accent mt-1">
              {targetInfo?.name || 'Category'} SEO & Content CMS
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#f8fafc] p-2 rounded-2xl border border-[#d1d9e6]">
            <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest pl-2">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase outline-none transition-all cursor-pointer",
                status === 'Published' ? "bg-green-500 text-white" : "bg-amber-500 text-white"
              )}
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-[#095181] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[.2em] shadow-lg shadow-[#095181]/20 flex items-center justify-center gap-2 hover:bg-[#DA222A] transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'PUBLISHING...' : 'SAVE & PUBLISH'}
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {successMsg && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-xs font-bold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* SECTION 1: CORE SEO METADATA */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6] space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f0f3f8] pb-5">
            <Globe className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-base font-black text-[#1a2b4b] uppercase italic italic-accent">1. Core SEO Metadata</h2>
              <p className="text-[10px] font-bold text-[#1a2b4b]/40 uppercase tracking-widest">Customize Meta Titles, Descriptions, H1 Heading & Robots Instructions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#1a2b4b]/60 uppercase tracking-widest">
                Category Main Heading (H1 Tag)
              </label>
              <input
                type="text"
                placeholder={`e.g. Wholesale ${targetInfo?.name || 'Category'} in Ranchi`}
                value={h1}
                onChange={(e) => setH1(e.target.value)}
                className="w-full px-5 py-4 bg-[#f8fafc] border border-[#d1d9e6] rounded-2xl text-sm font-bold text-[#1a2b4b] outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <p className="text-[9px] text-[#1a2b4b]/30 font-bold uppercase tracking-widest">Replaces standard category title in hero section if specified.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-[10px] font-black text-[#1a2b4b]/60 uppercase tracking-widest">Meta Title Tag</label>
                  <span className="text-[9px] font-bold text-[#1a2b4b]/40">{metaTitle.length} / 60 chars</span>
                </div>
                <input
                  type="text"
                  placeholder="Meta Title for Google Search..."
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#d1d9e6] rounded-2xl text-xs font-bold text-[#1a2b4b] outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#1a2b4b]/60 uppercase tracking-widest">Canonical URL (Optional Override)</label>
                <input
                  type="text"
                  placeholder={targetInfo?.targetUrl ? `https://www.babulalpremsons.com${targetInfo.targetUrl}` : 'https://www.babulalpremsons.com/...'}
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#d1d9e6] rounded-2xl text-xs font-bold text-[#1a2b4b] outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-[10px] font-black text-[#1a2b4b]/60 uppercase tracking-widest">Meta Description Tag</label>
                <span className="text-[9px] font-bold text-[#1a2b4b]/40">{metaDescription.length} / 160 chars</span>
              </div>
              <textarea
                rows={3}
                placeholder="Comprehensive description for search engine result snippets..."
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#d1d9e6] rounded-2xl text-xs font-medium text-[#1a2b4b] outline-none focus:ring-2 focus:ring-purple-500/20 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#f8fafc] rounded-2xl border border-[#d1d9e6]">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Robots Index</label>
                <select
                  value={robotsIndex}
                  onChange={(e) => setRobotsIndex(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d1d9e6] rounded-xl text-xs font-bold text-[#1a2b4b]"
                >
                  <option value="index">Index (Allowed)</option>
                  <option value="noindex">NoIndex (Block)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Robots Follow</label>
                <select
                  value={robotsFollow}
                  onChange={(e) => setRobotsFollow(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#d1d9e6] rounded-xl text-xs font-bold text-[#1a2b4b]"
                >
                  <option value="follow">Follow Links</option>
                  <option value="nofollow">NoFollow Links</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: HERO BANNER & MEDIA */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6] space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f0f3f8] pb-5">
            <ImageIcon className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-base font-black text-[#1a2b4b] uppercase italic italic-accent">2. Category Banner & Video Media</h2>
              <p className="text-[10px] font-bold text-[#1a2b4b]/40 uppercase tracking-widest">Category Hero Image & YouTube Video Embeds</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#1a2b4b]/60 uppercase tracking-widest">Category Custom Cover Banner Image</label>
              <div className="flex items-center gap-4">
                {bannerImage && (
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-[#d1d9e6] bg-[#f8fafc] shrink-0">
                    <img src={bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <label className="flex-1 cursor-pointer">
                  <div className="w-full px-6 py-4 bg-[#f8fafc] border border-[#d1d9e6] border-dashed rounded-2xl text-[10px] font-black text-[#1a2b4b]/50 uppercase tracking-widest text-center hover:bg-[#095181]/5 transition-all">
                    {bannerImage ? 'CHANGE BANNER IMAGE' : '+ UPLOAD BANNER IMAGE'}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, (url) => setBannerImage(url))} 
                  />
                </label>
              </div>
              <input
                type="text"
                placeholder="Banner Image ALT Text (For Accessibility & Image SEO)..."
                value={bannerAlt}
                onChange={(e) => setBannerAlt(e.target.value)}
                className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-2xl text-xs font-bold text-[#1a2b4b] outline-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-[#1a2b4b]/60 uppercase tracking-widest">Category YouTube Video URL</label>
              <div className="relative">
                <Video className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a2b4b]/30" />
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... or embed link"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full pl-12 pr-5 py-3.5 bg-[#f8fafc] border border-[#d1d9e6] rounded-2xl text-xs font-bold text-[#1a2b4b] outline-none"
                />
              </div>
              <p className="text-[9px] text-[#1a2b4b]/30 font-bold uppercase tracking-widest">Renders an interactive responsive YouTube video frame on the category page.</p>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-[#f0f3f8]">
            <label className="text-[10px] font-black text-[#1a2b4b]/60 uppercase tracking-widest">Category Intro Paragraph (Displayed Below Hero)</label>
            <textarea
              rows={3}
              placeholder="Engaging introduction paragraph describing the craftsmanship, wholesale terms, and distribution network for this category..."
              value={introContent}
              onChange={(e) => setIntroContent(e.target.value)}
              className="w-full px-5 py-3.5 bg-[#f8fafc] border border-[#d1d9e6] rounded-2xl text-xs font-medium text-[#1a2b4b] outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION: INVENTORY CATALOG VISIBILITY */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6] space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f0f3f8] pb-5">
            <Eye className="w-6 h-6 text-emerald-600" />
            <div>
              <h2 className="text-base font-black text-[#1a2b4b] uppercase italic italic-accent">Inventory Catalog Visibility</h2>
              <p className="text-[10px] font-bold text-[#1a2b4b]/40 uppercase tracking-widest">Control whether the Inventory Catalog section renders on this public page</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-[#f8fafc] rounded-2xl border border-[#d1d9e6]">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-[#1a2b4b] uppercase tracking-wide">
                  Inventory Catalog Section
                </span>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded",
                  showInventoryCatalog 
                    ? "bg-emerald-100 text-emerald-700" 
                    : "bg-slate-200 text-slate-600"
                )}>
                  {showInventoryCatalog ? 'ENABLED (VISIBLE)' : 'DISABLED (HIDDEN BY DEFAULT)'}
                </span>
              </div>
              <p className="text-[10px] font-bold text-[#1a2b4b]/50 uppercase tracking-wider">
                {showInventoryCatalog 
                  ? "The Inventory Catalog filter sidebar, product grid, and empty states are currently visible on the public page."
                  : "The Inventory Catalog section is hidden. The page naturally collapses and 'Top Dash in Ranchi' moves up directly."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowInventoryCatalog(!showInventoryCatalog)}
              className={cn(
                "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer",
                showInventoryCatalog
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-slate-800 text-white hover:bg-slate-900"
              )}
            >
              {showInventoryCatalog ? 'Disable Catalog' : 'Enable Catalog'}
            </button>
          </div>
        </div>

        {/* SECTION 3: WORD-LIKE RICH TEXT SEO EDITOR */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f0f3f8] pb-5">
            <div className="flex items-center gap-3">
              <FileCode className="w-6 h-6 text-purple-600" />
              <div>
                <h2 className="text-base font-black text-[#1a2b4b] uppercase italic italic-accent">3. Word-Like Rich Text SEO Content & Inline Image Uploads</h2>
                <p className="text-[10px] font-bold text-[#1a2b4b]/40 uppercase tracking-widest">SEO Executive Editor: Format Headings, Bold Keywords, Bullet Points & Side-by-Side Images (Matching sareemanufacturers.com)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#f8fafc] p-1.5 rounded-2xl border border-[#d1d9e6]">
              <button
                type="button"
                onClick={() => setActiveTab('word')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5",
                  activeTab === 'word' ? "bg-purple-600 text-white shadow-md" : "text-[#1a2b4b]/60 hover:text-[#1a2b4b]"
                )}
              >
                <FileText className="w-3.5 h-3.5" /> Word WYSIWYG Editor
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('structured')}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5",
                  activeTab === 'structured' ? "bg-purple-600 text-white shadow-md" : "text-[#1a2b4b]/60 hover:text-[#1a2b4b]"
                )}
              >
                <Layers className="w-3.5 h-3.5" /> Structured Sections
              </button>
            </div>
          </div>

          {activeTab === 'word' ? (
            <div className="space-y-4">
              <p className="text-xs text-gray-500 font-medium italic">
                Use the Word-like toolbar below to write SEO content. Click **"+ Insert Image"** to upload side-by-side product photos floated next to paragraphs!
              </p>
              <WordRichTextEditor
                value={htmlContent}
                onChange={(html) => setHtmlContent(html)}
                placeholder="Start typing SEO styled content, headings, bullet lists, bold keywords, and insert side-by-side images..."
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-gray-500">Structured content section cards builder:</p>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-green-700 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Section Card
                </button>
              </div>

              {sections.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-[#d1d9e6] rounded-3xl bg-[#f8fafc]/50">
                  <p className="text-xs font-bold text-[#1a2b4b]/40 uppercase tracking-widest">No section cards created yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {sections.map((sec, idx) => (
                    <div key={idx} className="p-6 bg-[#f8fafc] border border-[#d1d9e6] rounded-3xl space-y-4 relative group">
                      <div className="flex items-center justify-between border-b border-[#d1d9e6] pb-3">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-xl bg-[#095181] text-white font-black text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <select
                            value={sec.headingLevel}
                            onChange={(e) => handleUpdateSection(idx, { headingLevel: e.target.value as any })}
                            className="px-3 py-1.5 bg-white border border-[#d1d9e6] rounded-xl text-xs font-black text-[#095181]"
                          >
                            <option value="H2">H2 Heading</option>
                            <option value="H3">H3 Subheading</option>
                            <option value="H4">H4 Section Title</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Section Heading Title..."
                            value={sec.heading}
                            onChange={(e) => handleUpdateSection(idx, { heading: e.target.value })}
                            className="flex-1 px-4 py-2 bg-white border border-[#d1d9e6] rounded-xl text-xs font-bold text-[#1a2b4b] outline-none min-w-[280px]"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleMoveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 bg-white border border-[#d1d9e6] rounded-lg text-[#1a2b4b]/40 hover:text-[#095181] disabled:opacity-30"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveSection(idx, 'down')}
                            disabled={idx === sections.length - 1}
                            className="p-1.5 bg-white border border-[#d1d9e6] rounded-lg text-[#1a2b4b]/40 hover:text-[#095181] disabled:opacity-30"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSection(idx)}
                            className="p-2 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        placeholder="Write detailed informative content..."
                        value={sec.content}
                        onChange={(e) => handleUpdateSection(idx, { content: e.target.value })}
                        className="w-full px-5 py-3.5 bg-white border border-[#d1d9e6] rounded-2xl text-xs font-medium text-[#1a2b4b] outline-none leading-relaxed"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM SAVE BAR */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/categories"
            className="px-8 py-4 bg-white border border-[#d1d9e6] rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#1a2b4b]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#095181] text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[.2em] shadow-xl shadow-[#095181]/20 flex items-center gap-2 hover:bg-[#DA222A] transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'SAVING...' : 'SAVE & PUBLISH ALL SEO CHANGES'}
          </button>
        </div>
      </form>
    </div>
  );
}
