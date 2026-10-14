"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Globe, 
  Search, 
  Share2, 
  FileText, 
  Layers, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ChevronUp, 
  ChevronDown, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  ListPlus, 
  Loader2, 
  Sliders, 
  X,
  Award,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  HomepageSeoData, 
  HomepageSeoSection, 
  InternalLink, 
  DEFAULT_HOMEPAGE_SEO, 
  DEFAULT_VISUAL_SECTIONS, 
  VisualSectionsData,
  VisualLegacySection,
  VisualAwardCard,
  VisualMetricBadge,
  VisualCuratedSection
} from '@/lib/homepage-seo-types';

export default function HomepageSeoAdminPage() {
  const [activeTab, setActiveTab] = useState<'metadata' | 'content' | 'visual' | 'technical'>('metadata');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [robotsIndex, setRobotsIndex] = useState<'index' | 'noindex'>('index');
  const [robotsFollow, setRobotsFollow] = useState<'follow' | 'nofollow'>('follow');
  
  // Social Media
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [ogType, setOgType] = useState('website');
  const [twitterCard, setTwitterCard] = useState('summary_large_image');
  const [twitterTitle, setTwitterTitle] = useState('');
  const [twitterDescription, setTwitterDescription] = useState('');
  const [twitterImage, setTwitterImage] = useState('');

  // Page Content
  const [h1, setH1] = useState('');
  const [h1Subtext, setH1Subtext] = useState('');
  const [introParagraph, setIntroParagraph] = useState('');
  const [status, setStatus] = useState('Published');
  const [sections, setSections] = useState<HomepageSeoSection[]>([]);
  const [visualSections, setVisualSections] = useState<VisualSectionsData>(DEFAULT_VISUAL_SECTIONS);

  // Confirmation Modals
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [noindexConfirmOpen, setNoindexConfirmOpen] = useState(false);

  // Original state snapshot for dirty checking and discarding
  const [originalData, setOriginalData] = useState<HomepageSeoData | null>(null);

  const populateForm = useCallback((data: HomepageSeoData) => {
    setMetaTitle(data.metaTitle || '');
    setMetaDescription(data.metaDescription || '');
    setMetaKeywords(data.metaKeywords || '');
    setCanonicalUrl(data.canonicalUrl || '');
    setRobotsIndex(data.robotsIndex || 'index');
    setRobotsFollow(data.robotsFollow || 'follow');

    setOgTitle(data.ogTitle || '');
    setOgDescription(data.ogDescription || '');
    setOgImage(data.ogImage || '');
    setOgType(data.ogType || 'website');
    setTwitterCard(data.twitterCard || 'summary_large_image');
    setTwitterTitle(data.twitterTitle || '');
    setTwitterDescription(data.twitterDescription || '');
    setTwitterImage(data.twitterImage || '');

    setH1(data.h1 || '');
    setH1Subtext(data.h1Subtext || '');
    setIntroParagraph(data.introParagraph || '');
    setStatus(data.status || 'Published');
    setSections(JSON.parse(JSON.stringify(data.sections || [])));
    setVisualSections(JSON.parse(JSON.stringify(data.visualSections || DEFAULT_VISUAL_SECTIONS)));
    setIsDirty(false);
  }, []);

  const fetchSeoData = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/homepage-seo', { cache: 'no-store' });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to load SEO settings');
      }
      const data: HomepageSeoData = json.settings || DEFAULT_HOMEPAGE_SEO;
      setOriginalData(data);
      populateForm(data);
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      const msg = err instanceof Error ? err.message : 'Error fetching homepage SEO settings';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  }, [populateForm]);

  useEffect(() => {
    fetchSeoData();
  }, [fetchSeoData]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  // Safe discard changes
  const handleDiscardChanges = () => {
    if (originalData) {
      populateForm(originalData);
    }
    setDiscardConfirmOpen(false);
    setIsDirty(false);
  };

  // Section Management
  const handleAddSection = () => {
    markDirty();
    const newSection: HomepageSeoSection = {
      id: `new-${Date.now()}`,
      heading: '',
      headingLevel: 'H2',
      content: '',
      bulletPoints: [''],
      internalLinks: [{ label: '', url: '' }],
      image: '',
      imageAlt: '',
      videoUrl: '',
      orderIndex: sections.length,
      isActive: true
    };
    setSections([...sections, newSection]);
  };

  const handleUpdateSection = (index: number, updates: Partial<HomepageSeoSection>) => {
    markDirty();
    setSections(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) {
      return;
    }
    markDirty();
    setSections(prev => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next.map((sec, idx) => ({ ...sec, orderIndex: idx }));
    });
  };

  const handleDeleteSectionConfirm = (index: number) => {
    markDirty();
    setSections(prev => prev.filter((_, i) => i !== index).map((sec, idx) => ({ ...sec, orderIndex: idx })));
    setDeleteConfirmIndex(null);
  };

  // Bullet point helpers
  const handleAddBullet = (secIndex: number) => {
    markDirty();
    const nextBullets = [...(sections[secIndex].bulletPoints || []), ''];
    handleUpdateSection(secIndex, { bulletPoints: nextBullets });
  };

  const handleUpdateBullet = (secIndex: number, bulletIndex: number, val: string) => {
    markDirty();
    const nextBullets = [...(sections[secIndex].bulletPoints || [])];
    nextBullets[bulletIndex] = val;
    handleUpdateSection(secIndex, { bulletPoints: nextBullets });
  };

  const handleRemoveBullet = (secIndex: number, bulletIndex: number) => {
    markDirty();
    const nextBullets = (sections[secIndex].bulletPoints || []).filter((_, i) => i !== bulletIndex);
    handleUpdateSection(secIndex, { bulletPoints: nextBullets });
  };

  // Internal link helpers
  const handleAddLink = (secIndex: number) => {
    markDirty();
    const nextLinks = [...(sections[secIndex].internalLinks || []), { label: '', url: '' }];
    handleUpdateSection(secIndex, { internalLinks: nextLinks });
  };

  const handleUpdateLink = (secIndex: number, linkIndex: number, field: keyof InternalLink, val: string) => {
    markDirty();
    const nextLinks = [...(sections[secIndex].internalLinks || [])];
    nextLinks[linkIndex] = { ...nextLinks[linkIndex], [field]: val };
    handleUpdateSection(secIndex, { internalLinks: nextLinks });
  };

  const handleRemoveLink = (secIndex: number, linkIndex: number) => {
    markDirty();
    const nextLinks = (sections[secIndex].internalLinks || []).filter((_, i) => i !== linkIndex);
    handleUpdateSection(secIndex, { internalLinks: nextLinks });
  };

  // Visual Sections Helpers
  const handleUpdateValuePillar = (index: number, field: 'title' | 'sub', val: string) => {
    markDirty();
    setVisualSections(prev => {
      const nextPillars = [...prev.valuePillars];
      nextPillars[index] = { ...nextPillars[index], [field]: val };
      return { ...prev, valuePillars: nextPillars };
    });
  };

  const handleUpdateLegacy = (field: keyof VisualLegacySection, val: any) => {
    markDirty();
    setVisualSections(prev => ({
      ...prev,
      legacy: { ...prev.legacy, [field]: val }
    }));
  };

  const handleUpdateLegacyAward = (index: number, field: keyof VisualAwardCard, val: string) => {
    markDirty();
    setVisualSections(prev => {
      const nextAwards = [...prev.legacy.awards];
      nextAwards[index] = { ...nextAwards[index], [field]: val };
      return {
        ...prev,
        legacy: { ...prev.legacy, awards: nextAwards }
      };
    });
  };

  const handleUpdateMetric = (index: number, field: keyof VisualMetricBadge, val: string) => {
    markDirty();
    setVisualSections(prev => {
      const nextMetrics = [...prev.metrics];
      nextMetrics[index] = { ...nextMetrics[index], [field]: val };
      return { ...prev, metrics: nextMetrics };
    });
  };

  const handleUpdateCurated = (field: keyof VisualCuratedSection, val: string) => {
    markDirty();
    setVisualSections(prev => ({
      ...prev,
      curated: { ...prev.curated, [field]: val }
    }));
  };

  const handleResetVisualSections = () => {
    markDirty();
    setVisualSections(JSON.parse(JSON.stringify(DEFAULT_VISUAL_SECTIONS)));
  };

  // Save Payload
  const handleSave = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    // Validation
    if (!metaTitle.trim()) {
      setErrorMsg('Meta Title is required.');
      setActiveTab('metadata');
      return;
    }

    if (!canonicalUrl.trim()) {
      setErrorMsg('Canonical URL is required.');
      setActiveTab('metadata');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<HomepageSeoData> = {
        metaTitle: metaTitle.trim(),
        metaDescription: metaDescription.trim(),
        metaKeywords: metaKeywords.trim(),
        canonicalUrl: canonicalUrl.trim(),
        robotsIndex,
        robotsFollow,
        ogTitle: ogTitle.trim() || metaTitle.trim(),
        ogDescription: ogDescription.trim() || metaDescription.trim(),
        ogImage: ogImage.trim(),
        ogType,
        twitterCard,
        twitterTitle: twitterTitle.trim() || ogTitle.trim() || metaTitle.trim(),
        twitterDescription: twitterDescription.trim() || ogDescription.trim() || metaDescription.trim(),
        twitterImage: twitterImage.trim() || ogImage.trim(),
        h1: h1.trim(),
        h1Subtext: h1Subtext.trim(),
        introParagraph: introParagraph.trim(),
        status,
        visualSections,
        sections: sections.map((sec, idx) => ({
          ...sec,
          orderIndex: idx,
          bulletPoints: (sec.bulletPoints || []).filter(bp => bp.trim() !== ''),
          internalLinks: (sec.internalLinks || []).filter(l => l.label.trim() !== '' && l.url.trim() !== '')
        }))
      };

      const res = await fetch('/api/admin/homepage-seo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save settings');
      }

      setSuccessMsg('Homepage SEO configuration successfully saved and published! Cache revalidated.');
      setIsDirty(false);
      setOriginalData(payload as HomepageSeoData);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: unknown) {
      console.error('Save error:', err);
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred while saving.';
      setErrorMsg(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Warning when leaving with dirty state
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#095181]" />
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1a2b4b]/50">
            Loading Homepage SEO Settings...
          </p>
        </div>
      </div>
    );
  }

  // Previews Data
  const previewTitle = metaTitle || 'Babulal Premkumar | 100+ Years Legacy';
  const previewUrl = canonicalUrl || 'https://babulalpremsons.com';
  const previewDescription = metaDescription || 'A premium textile destination offering an exclusive collection of Sarees, Lehengas, Suits, and more in Ranchi.';
  const previewOgTitle = ogTitle || metaTitle || previewTitle;
  const previewOgDesc = ogDescription || metaDescription || previewDescription;
  const previewOgImg = ogImage || '/BabulalPremkumarHer.jpeg';

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* ══ HEADER BAR ══ */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#d1d9e6] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-[#095181] border border-blue-200 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#095181]" /> Homepage SEO Management
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
              Target: Public Homepage (/)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1a2b4b] uppercase tracking-tight">
            Homepage Search &amp; Content Engine
          </h1>
          <p className="text-xs text-[#1a2b4b]/60 font-medium mt-1 max-w-2xl">
            Configure dynamic search engine metadata, Open Graph sharing cards, single H1 heading hierarchy, and editable semantic content sections for the public homepage.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-[#f8fafc] border border-[#d1d9e6] text-[#095181] hover:bg-[#095181] hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Public Site
          </Link>

          {isDirty && (
            <button
              type="button"
              onClick={() => setDiscardConfirmOpen(true)}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Discard
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-[#DA222A] hover:bg-[#095181] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save &amp; Publish
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dirty State / Feedback Notification */}
      {isDirty && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 font-medium">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>You have unsaved changes. Remember to click <strong>Save &amp; Publish</strong> to apply them to the live homepage.</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs text-red-700 font-semibold">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-xs text-green-800 font-bold">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ══ NAVIGATION TABS ══ */}
      <div className="flex items-center gap-2 border-b border-[#d1d9e6] pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('metadata')}
          className={cn(
            "px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all",
            activeTab === 'metadata'
              ? "bg-[#095181] text-white shadow-md shadow-[#095181]/20"
              : "text-[#1a2b4b]/60 hover:text-[#1a2b4b] hover:bg-white"
          )}
        >
          <Search className="w-4 h-4" /> Search &amp; Social Metadata
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={cn(
            "px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all",
            activeTab === 'content'
              ? "bg-[#095181] text-white shadow-md shadow-[#095181]/20"
              : "text-[#1a2b4b]/60 hover:text-[#1a2b4b] hover:bg-white"
          )}
        >
          <FileText className="w-4 h-4" /> Semantic SEO Content ({sections.length} Sections)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('visual')}
          className={cn(
            "px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all",
            activeTab === 'visual'
              ? "bg-[#095181] text-white shadow-md shadow-[#095181]/20"
              : "text-[#1a2b4b]/60 hover:text-[#1a2b4b] hover:bg-white"
          )}
        >
          <Sliders className="w-4 h-4" /> Visual Sections (Legacy, Metrics &amp; Pillars)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('technical')}
          className={cn(
            "px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all",
            activeTab === 'technical'
              ? "bg-[#095181] text-white shadow-md shadow-[#095181]/20"
              : "text-[#1a2b4b]/60 hover:text-[#1a2b4b] hover:bg-white"
          )}
        >
          <Globe className="w-4 h-4" /> Technical Controls &amp; Crawling
        </button>
      </div>

      {/* ════ TAB 1: SEARCH & SOCIAL METADATA ════ */}
      {activeTab === 'metadata' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: Metadata Fields */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#d1d9e6] space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-base font-black text-[#1a2b4b] uppercase tracking-wide flex items-center gap-2">
                  <Search className="w-4 h-4 text-[#095181]" /> Core Search Engine Meta Tags
                </h2>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Required For Google &amp; Bing</span>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1a2b4b] uppercase tracking-wider">
                    Meta Title <span className="text-red-500">*</span>
                  </label>
                  <span className={cn(
                    "text-[10px] font-black",
                    metaTitle.length > 60 ? "text-amber-600" : "text-green-600"
                  )}>
                    {metaTitle.length}/60 chars (recommended: 50-60)
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => { markDirty(); setMetaTitle(e.target.value); }}
                  placeholder="e.g. Babulal Premkumar | 100+ Years Legacy - Premium Textiles in Ranchi"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-semibold text-[#1a2b4b] focus:bg-white focus:border-[#095181] focus:ring-2 focus:ring-[#095181]/10 outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1">Appears as the primary clickable headline in search engine result pages.</p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1a2b4b] uppercase tracking-wider">
                    Meta Description <span className="text-red-500">*</span>
                  </label>
                  <span className={cn(
                    "text-[10px] font-black",
                    metaDescription.length > 160 ? "text-amber-600" : "text-green-600"
                  )}>
                    {metaDescription.length}/160 chars (recommended: 150-160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => { markDirty(); setMetaDescription(e.target.value); }}
                  placeholder="e.g. Babulal Premkumar - A premium textile destination offering an exclusive collection of Sarees, Lehengas, Suits, and more in Ranchi with over 100+ Years Legacy."
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-medium text-[#1a2b4b] focus:bg-white focus:border-[#095181] focus:ring-2 focus:ring-[#095181]/10 outline-none transition-all resize-y"
                />
                <p className="text-[10px] text-gray-400 mt-1">Summary snippet that appears underneath the title in search listings.</p>
              </div>

              {/* Canonical URL */}
              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-1.5">
                  Canonical URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => { markDirty(); setCanonicalUrl(e.target.value); }}
                  placeholder="https://babulalpremsons.com"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-semibold text-[#1a2b4b] focus:bg-white focus:border-[#095181] focus:ring-2 focus:ring-[#095181]/10 outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1">Prevents duplicate content penalties by declaring the authoritative URL of the homepage.</p>
              </div>

              {/* Keywords (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#1a2b4b] uppercase tracking-wider">
                    Meta Keywords <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-gray-400">Comma-separated</span>
                </div>
                <input
                  type="text"
                  value={metaKeywords}
                  onChange={(e) => { markDirty(); setMetaKeywords(e.target.value); }}
                  placeholder="Babulal Premkumar, Ranchi, Textiles, Sarees, Lehengas, Wholesale Fabric"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-medium text-[#1a2b4b] focus:bg-white focus:border-[#095181] focus:ring-2 focus:ring-[#095181]/10 outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1">Maintained for internal reference and secondary crawlers; not treated as a primary Google ranking signal.</p>
              </div>
            </div>

            {/* Social Sharing & Open Graph */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#d1d9e6] space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-base font-black text-[#1a2b4b] uppercase tracking-wide flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#095181]" /> Open Graph &amp; Social Sharing Cards
                </h2>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">WhatsApp, Facebook, Twitter, LinkedIn</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-1.5">
                  Open Graph Title
                </label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => { markDirty(); setOgTitle(e.target.value); }}
                  placeholder={metaTitle || "Babulal Premkumar | 100+ Years Legacy"}
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-medium text-[#1a2b4b] focus:bg-white focus:border-[#095181] outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1">Leaves blank to automatically mirror the Meta Title above.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-1.5">
                  Open Graph Description
                </label>
                <textarea
                  rows={2}
                  value={ogDescription}
                  onChange={(e) => { markDirty(); setOgDescription(e.target.value); }}
                  placeholder={metaDescription || "Summary for social media link previews..."}
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-medium text-[#1a2b4b] focus:bg-white focus:border-[#095181] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-1.5">
                  Open Graph Image URL
                </label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => { markDirty(); setOgImage(e.target.value); }}
                  placeholder="/BabulalPremkumarHer.jpeg or https://..."
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-medium text-[#1a2b4b] focus:bg-white focus:border-[#095181] outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1">Featured image displayed when the homepage is shared on WhatsApp, LinkedIn, or Facebook (1200x630 recommended).</p>
              </div>
            </div>
          </div>

          {/* Right Column: Real-time Live Previews */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Google SERP Preview */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#d1d9e6] space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-black text-[#1a2b4b] uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-blue-600" /> Google Search Result Preview
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-600">Approximate</span>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-800">
                    B
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-800 leading-none">Babulal Premkumar</span>
                    <span className="text-[10px] text-gray-500 truncate max-w-[280px]">{previewUrl}</span>
                  </div>
                </div>
                
                <h3 className="text-base text-[#1a0dab] hover:underline font-medium cursor-pointer leading-snug line-clamp-2">
                  {previewTitle}
                </h3>

                <p className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                  {previewDescription}
                </p>
              </div>

              <p className="text-[10px] text-gray-400 italic">
                Notice: Search engine previews are an algorithmic approximation. Google and other search engines may dynamically alter snippets based on user search queries.
              </p>
            </div>

            {/* Social Share Card Preview */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#d1d9e6] space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-black text-[#1a2b4b] uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-purple-600" /> Social Card Preview
                </span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700">Open Graph</span>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-gray-50">
                <div className="aspect-[1.91/1] bg-gray-200 relative overflow-hidden flex items-center justify-center">
                  {previewOgImg ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={previewOgImg}
                      alt={previewOgTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="p-4 bg-white border-t border-gray-100 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                    babulalpremsons.com
                  </span>
                  <h4 className="text-xs font-bold text-[#1a2b4b] line-clamp-1">
                    {previewOgTitle}
                  </h4>
                  <p className="text-[11px] text-gray-600 line-clamp-2 leading-normal">
                    {previewOgDesc}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ════ TAB 2: HOMEPAGE SEO CONTENT (H1 & REPEATABLE SECTIONS) ════ */}
      {activeTab === 'content' && (
        <div className="space-y-6">

          {/* Main H1 & Intro Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#d1d9e6] space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded bg-blue-100 text-[#095181]">
                  Semantic Root
                </span>
                <span className="text-xs text-gray-400 font-bold">•</span>
                <span className="text-[11px] font-bold text-gray-500">Only 1 H1 Tag rendered on public homepage</span>
              </div>
              <h2 className="text-lg font-black text-[#1a2b4b] uppercase tracking-wide">
                Homepage Primary H1 &amp; Intro Narrative
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main H1 */}
              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-1.5">
                  Main H1 Heading <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={h1}
                  onChange={(e) => { markDirty(); setH1(e.target.value); }}
                  placeholder="e.g. Wholesale & Retail Textile Destination in Ranchi, Jharkhand"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-black text-[#1a2b4b] focus:bg-white focus:border-[#095181] outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1">The primary H1 topic for web crawlers. The rotating hero banner will automatically downgrade to H2 to protect keyword density.</p>
              </div>

              {/* H1 Subtext */}
              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-1.5">
                  H1 Supporting Text / Eyebrow
                </label>
                <input
                  type="text"
                  value={h1Subtext}
                  onChange={(e) => { markDirty(); setH1Subtext(e.target.value); }}
                  placeholder="e.g. Serving Eastern India across 5 generations with over a century of trust."
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-medium text-[#1a2b4b] focus:bg-white focus:border-[#095181] outline-none transition-all"
                />
                <p className="text-[10px] text-gray-400 mt-1">Contextual sub-heading displayed immediately above or below the primary H1.</p>
              </div>
            </div>

            {/* Introductory Paragraph */}
            <div>
              <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-1.5">
                Introductory Narrative Paragraph
              </label>
              <textarea
                rows={4}
                value={introParagraph}
                onChange={(e) => { markDirty(); setIntroParagraph(e.target.value); }}
                placeholder="Write rich introductory copy establishing brand authority, geographic focus in Ranchi/Jharkhand, product verticals, and value propositions..."
                className="w-full px-4 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-normal text-[#1a2b4b] leading-relaxed focus:bg-white focus:border-[#095181] outline-none transition-all resize-y"
              />
              <p className="text-[10px] text-gray-400 mt-1">Rendered server-side to ensure search crawlers can index core business value without relying on JavaScript.</p>
            </div>
          </div>

          {/* Repeatable Content Sections */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#d1d9e6] shadow-sm">
              <div>
                <h3 className="text-base font-black text-[#1a2b4b] uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#095181]" /> Configurable Content Sections ({sections.length})
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Add, edit, reorder, and toggle individual content sections without modifying code.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSection}
                className="px-5 py-2.5 rounded-2xl bg-[#095181] hover:bg-[#1a2b4b] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-[#095181]/20 transition-all self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Add Section
              </button>
            </div>

            {sections.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-[#d1d9e6] space-y-3">
                <FileText className="w-8 h-8 text-gray-300 mx-auto" />
                <h4 className="text-sm font-bold text-[#1a2b4b] uppercase tracking-wider">No SEO Content Sections Defined</h4>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  Click the button below to add your first structured content section with configurable headings, bullet points, and internal links.
                </p>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold uppercase tracking-wider text-[#095181]"
                >
                  Create First Section
                </button>
              </div>
            ) : (
              sections.map((section, index) => (
                <div
                  key={section.id || index}
                  className={cn(
                    "bg-white rounded-3xl p-6 md:p-8 shadow-sm border transition-all space-y-6",
                    section.isActive ? "border-[#d1d9e6]" : "border-gray-200 opacity-60 bg-gray-50/50"
                  )}
                >
                  {/* Section Header Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#095181] text-white text-xs font-black flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-[#1a2b4b] uppercase tracking-wider truncate max-w-md">
                          {section.heading || `Untitled Section ${index + 1}`}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase">
                          <span>Level: {section.headingLevel}</span>
                          <span>•</span>
                          <span>{section.isActive ? 'Active' : 'Disabled'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order & State Actions */}
                    <div className="flex items-center gap-2">
                      {/* Active Toggle */}
                      <button
                        type="button"
                        onClick={() => handleUpdateSection(index, { isActive: !section.isActive })}
                        className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors",
                          section.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        )}
                      >
                        {section.isActive ? 'Enabled' : 'Disabled'}
                      </button>

                      {/* Move Up */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveSection(index, 'up')}
                        title="Move Up"
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>

                      {/* Move Down */}
                      <button
                        type="button"
                        disabled={index === sections.length - 1}
                        onClick={() => handleMoveSection(index, 'down')}
                        title="Move Down"
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-all"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmIndex(index)}
                        title="Delete Section"
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section Heading & Level */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-9">
                      <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-1.5">
                        Section Heading <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => handleUpdateSection(index, { heading: e.target.value })}
                        placeholder="e.g. Eastern India’s Premier Wholesale Handloom & Bridal Fabric Hub"
                        className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-bold text-[#1a2b4b] focus:bg-white focus:border-[#095181] outline-none transition-all"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-1.5">
                        Heading Level
                      </label>
                      <select
                        value={section.headingLevel}
                        onChange={(e) => handleUpdateSection(index, { headingLevel: e.target.value as 'H2' | 'H3' | 'H4' })}
                        className="w-full px-4 py-2.5 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-black text-[#1a2b4b] focus:bg-white focus:border-[#095181] outline-none transition-all cursor-pointer"
                      >
                        <option value="H2">H2 (Recommended)</option>
                        <option value="H3">H3 (Sub-section)</option>
                        <option value="H4">H4 (Minor topic)</option>
                      </select>
                    </div>
                  </div>

                  {/* Section Paragraph Content */}
                  <div>
                    <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-1.5">
                      Paragraph Copy
                    </label>
                    <textarea
                      rows={3}
                      value={section.content}
                      onChange={(e) => handleUpdateSection(index, { content: e.target.value })}
                      placeholder="Detailed content expanding on this specific sub-topic..."
                      className="w-full px-4 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-sm font-normal text-[#1a2b4b] leading-relaxed focus:bg-white focus:border-[#095181] outline-none transition-all resize-y"
                    />
                  </div>

                  {/* Bullet Points */}
                  <div className="p-4 bg-[#f8fafc] rounded-2xl border border-gray-200/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1a2b4b] uppercase tracking-wider flex items-center gap-1.5">
                        <ListPlus className="w-3.5 h-3.5 text-[#095181]" /> Bullet Points &amp; Value Lists
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddBullet(index)}
                        className="text-[10px] font-black uppercase text-[#095181] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Point
                      </button>
                    </div>

                    {(section.bulletPoints || []).map((point, bpIdx) => (
                      <div key={bpIdx} className="flex items-center gap-2">
                        <span className="text-[#095181] font-black text-xs">•</span>
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => handleUpdateBullet(index, bpIdx, e.target.value)}
                          placeholder="e.g. 100% unbundled purchasing—no forced lot bundling"
                          className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#1a2b4b] focus:border-[#095181] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(index, bpIdx)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Internal Links */}
                  <div className="p-4 bg-[#f8fafc] rounded-2xl border border-gray-200/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1a2b4b] uppercase tracking-wider flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-[#095181]" /> Relevant Internal Links (SEO Equity)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddLink(index)}
                        className="text-[10px] font-black uppercase text-[#095181] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Link
                      </button>
                    </div>

                    {(section.internalLinks || []).map((link, lIdx) => (
                      <div key={lIdx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                        <div className="sm:col-span-5">
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleUpdateLink(index, lIdx, 'label', e.target.value)}
                            placeholder="Anchor Text (e.g. Explore Sarees)"
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#1a2b4b] focus:border-[#095181] outline-none"
                          />
                        </div>
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            value={link.url}
                            onChange={(e) => handleUpdateLink(index, lIdx, 'url', e.target.value)}
                            placeholder="URL Path (e.g. /saree or /lehenga)"
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-[#1a2b4b] focus:border-[#095181] outline-none"
                          />
                        </div>
                        <div className="sm:col-span-1 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveLink(index, lIdx)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Media (Image & Alt Text & Video) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Optional Image URL
                      </label>
                      <input
                        type="text"
                        value={section.image || ''}
                        onChange={(e) => handleUpdateSection(index, { image: e.target.value })}
                        placeholder="/bridal_luxury.png"
                        className="w-full px-3 py-2 bg-[#f8fafc] border border-gray-200 rounded-xl text-xs font-medium text-[#1a2b4b] focus:bg-white focus:border-[#095181] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Image Alt Text (SEO)
                      </label>
                      <input
                        type="text"
                        value={section.imageAlt || ''}
                        onChange={(e) => handleUpdateSection(index, { imageAlt: e.target.value })}
                        placeholder="Descriptive alt text for Google Images"
                        className="w-full px-3 py-2 bg-[#f8fafc] border border-gray-200 rounded-xl text-xs font-medium text-[#1a2b4b] focus:bg-white focus:border-[#095181] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                        Optional Video / YouTube URL
                      </label>
                      <input
                        type="text"
                        value={section.videoUrl || ''}
                        onChange={(e) => handleUpdateSection(index, { videoUrl: e.target.value })}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full px-3 py-2 bg-[#f8fafc] border border-gray-200 rounded-xl text-xs font-medium text-[#1a2b4b] focus:bg-white focus:border-[#095181] outline-none"
                      />
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ════ TAB 3: VISUAL HOMEPAGE SECTIONS ════ */}
      {activeTab === 'visual' && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-[#095181]/10 via-[#da222a]/5 to-transparent rounded-3xl border border-[#095181]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#095181] text-white text-[10px] font-black uppercase tracking-wider mb-2">
                <Sparkles className="w-3 h-3" /> Live Visual Section Controls
              </div>
              <h2 className="text-xl font-black text-[#1a2b4b] uppercase tracking-tight">
                Visual Homepage Sections (Legacy, Metrics &amp; Pillars)
              </h2>
              <p className="text-xs text-gray-600 mt-1 max-w-2xl">
                Edit the text, headlines, stats, and narrative paragraphs across the 4 primary visual sections on the homepage. Changes take effect on the live website immediately after saving.
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetVisualSections}
              className="px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset to Default Copy
            </button>
          </div>

          {/* ═══ BLOCK 1: THE 100+ YEARS LEGACY & REGIONAL AWARDS ═══ */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#d1d9e6] space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#da222a]/10 text-[#da222a] flex items-center justify-center font-black text-sm">
                01
              </div>
              <div>
                <h3 className="text-base font-black text-[#1a2b4b] uppercase tracking-tight">
                  The Legacy &amp; Regional Awards Section (Screenshot 1)
                </h3>
                <p className="text-xs text-gray-500">
                  Controls the prominent brand heritage narrative, regional wholesale awards, and customer trust copy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-2">
                  Eyebrow Badge Text
                </label>
                <input
                  type="text"
                  value={visualSections.legacy.eyebrow}
                  onChange={(e) => handleUpdateLegacy('eyebrow', e.target.value)}
                  placeholder="Over 100 Years & 5 Generations of Goodwill & Trust"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#095181]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Displayed in tracking uppercase above the legacy headline.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-2">
                  Title Prefix
                </label>
                <input
                  type="text"
                  value={visualSections.legacy.titlePrefix}
                  onChange={(e) => handleUpdateLegacy('titlePrefix', e.target.value)}
                  placeholder="The Legacy Of"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#095181]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">First part of the headline (rendered in Navy).</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-2">
                  Title Highlight
                </label>
                <input
                  type="text"
                  value={visualSections.legacy.titleHighlight}
                  onChange={(e) => handleUpdateLegacy('titleHighlight', e.target.value)}
                  placeholder="Babulal Premkumar."
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-2xl text-xs font-bold text-[#da222a] focus:outline-none focus:border-[#da222a]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Highlighted brand name (rendered in Crimson Red).</span>
              </div>
            </div>

            {/* The 3 Award Cards */}
            <div>
              <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-3">
                The 3 Award &amp; Distinction Cards
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {visualSections.legacy.awards.map((award, aIdx) => (
                  <div key={aIdx} className="p-4 bg-[#f8fafc] rounded-2xl border-l-4 border-l-[#da222a] border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-gray-400">Card #{aIdx + 1}</span>
                      <Award className="w-3.5 h-3.5 text-[#da222a]" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Year / Tag</label>
                      <input
                        type="text"
                        value={award.year}
                        onChange={(e) => handleUpdateLegacyAward(aIdx, 'year', e.target.value)}
                        placeholder="2011 Award"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#da222a] focus:outline-none focus:border-[#da222a]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Title</label>
                      <input
                        type="text"
                        value={award.title}
                        onChange={(e) => handleUpdateLegacyAward(aIdx, 'title', e.target.value)}
                        placeholder="Best Wholesaler of Eastern India"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#095181] focus:outline-none focus:border-[#095181]"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Subtitle / Region</label>
                      <input
                        type="text"
                        value={award.region}
                        onChange={(e) => handleUpdateLegacyAward(aIdx, 'region', e.target.value)}
                        placeholder="National & Regional Performance Award"
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-medium text-gray-700 focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Narratives */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-2">
                  Primary Narrative Paragraph (Lead Italic Copy)
                </label>
                <textarea
                  rows={3}
                  value={visualSections.legacy.primaryNarrative}
                  onChange={(e) => handleUpdateLegacy('primaryNarrative', e.target.value)}
                  placeholder="Babulal Premkumar is a Textile and Garments Distributor in Ranchi, Jharkhand..."
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-2xl text-xs font-medium text-gray-800 leading-relaxed focus:outline-none focus:border-[#095181]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Rendered in large italic lead font beneath the awards. High SEO keyword relevance for Ranchi, Jharkhand, and wholesale distribution.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-2">
                  Secondary Narrative Paragraph (Fabric Categories &amp; Offerings)
                </label>
                <textarea
                  rows={3}
                  value={visualSections.legacy.secondaryNarrative}
                  onChange={(e) => handleUpdateLegacy('secondaryNarrative', e.target.value)}
                  placeholder="We deal with multi-branded fabrics for women, men, and home furnishing..."
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-2xl text-xs font-normal text-gray-700 leading-relaxed focus:outline-none focus:border-[#095181]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Body text outlining product variety: sarees, denim, suitings, home furnishing.</span>
              </div>
            </div>
          </div>

          {/* ═══ BLOCK 2: INSTITUTIONAL VALUE STRIP ═══ */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#d1d9e6] space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#095181]/10 text-[#095181] flex items-center justify-center font-black text-sm">
                02
              </div>
              <div>
                <h3 className="text-base font-black text-[#1a2b4b] uppercase tracking-tight">
                  Institutional Value Pillars Strip (Screenshot 2)
                </h3>
                <p className="text-xs text-gray-500">
                  Controls the 4 blue value strip items displayed immediately under the Hero banner slider.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {visualSections.valuePillars.map((pillar, pIdx) => (
                <div key={pIdx} className="p-4 bg-[#095181]/5 rounded-2xl border border-[#095181]/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#095181]">Pillar #{pIdx + 1}</span>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Title</label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => handleUpdateValuePillar(pIdx, 'title', e.target.value)}
                      placeholder="Latest Collection"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#1a2b4b] focus:outline-none focus:border-[#095181]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-600 uppercase tracking-wider block mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={pillar.sub}
                      onChange={(e) => handleUpdateValuePillar(pIdx, 'sub', e.target.value)}
                      placeholder="Fresh Seasonal Inventory"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-medium text-gray-600 focus:outline-none focus:border-[#095181]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ BLOCK 3: RED CIRCLE METRIC BADGES ═══ */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#d1d9e6] space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#da222a]/10 text-[#da222a] flex items-center justify-center font-black text-sm">
                03
              </div>
              <div>
                <h3 className="text-base font-black text-[#1a2b4b] uppercase tracking-tight">
                  Four Heritage Metric Badges (Screenshot 3)
                </h3>
                <p className="text-xs text-gray-500">
                  Controls the 4 circular statistical highlights proving years of trust, B2B footprint, and warehouse inventory scale.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {visualSections.metrics.map((metric, mIdx) => (
                <div key={mIdx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-gray-400">Badge #{mIdx + 1}</span>
                    <span className="w-6 h-6 rounded-full bg-[#da222a] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                      {mIdx + 1}
                    </span>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Pre-Label</label>
                    <input
                      type="text"
                      value={metric.pre}
                      onChange={(e) => handleUpdateMetric(mIdx, 'pre', e.target.value)}
                      placeholder="Legacy Of"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 focus:outline-none focus:border-[#095181]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-[#da222a] uppercase tracking-wider block mb-1">Stat Number</label>
                    <input
                      type="text"
                      value={metric.stat}
                      onChange={(e) => handleUpdateMetric(mIdx, 'stat', e.target.value)}
                      placeholder="100+ YEARS"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-[#da222a] focus:outline-none focus:border-[#da222a]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Post-Description</label>
                    <input
                      type="text"
                      value={metric.post}
                      onChange={(e) => handleUpdateMetric(mIdx, 'post', e.target.value)}
                      placeholder="Five Generations of Trust"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-[11px] font-bold text-gray-800 focus:outline-none focus:border-gray-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ BLOCK 4: CURATED COLLECTIONS HEADER ═══ */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#d1d9e6] space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#095181]/10 text-[#095181] flex items-center justify-center font-black text-sm">
                04
              </div>
              <div>
                <h3 className="text-base font-black text-[#1a2b4b] uppercase tracking-tight">
                  Curated Collections Showcase Header (Screenshot 4)
                </h3>
                <p className="text-xs text-gray-500">
                  Controls the introductory heading, seasonal tag, and narrative description introducing the textile catalog.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-2">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={visualSections.curated.eyebrow}
                  onChange={(e) => handleUpdateCurated('eyebrow', e.target.value)}
                  placeholder="Seasonal Anthology"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-2xl text-xs font-bold text-[#da222a] focus:outline-none focus:border-[#da222a]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Displayed with red accent bar before the title.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-2">
                  Title Prefix
                </label>
                <input
                  type="text"
                  value={visualSections.curated.titlePrefix}
                  onChange={(e) => handleUpdateCurated('titlePrefix', e.target.value)}
                  placeholder="Curated"
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-2xl text-xs font-bold text-[#095181] focus:outline-none focus:border-[#095181]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Main section title (Navy).</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-2">
                  Title Highlight
                </label>
                <input
                  type="text"
                  value={visualSections.curated.titleHighlight}
                  onChange={(e) => handleUpdateCurated('titleHighlight', e.target.value)}
                  placeholder="Collections."
                  className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-2xl text-xs font-bold text-[#da222a] focus:outline-none focus:border-[#da222a]"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Second word highlighted in Crimson Red.</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider mb-2">
                Showcase Narrative Subtitle
              </label>
              <textarea
                rows={2}
                value={visualSections.curated.subtitle}
                onChange={(e) => handleUpdateCurated('subtitle', e.target.value)}
                placeholder="A cinematic showcase of Ranchi's finest textile engineering. Retail excellence for global partners."
                className="w-full px-4 py-3 bg-[#f8fafc] border border-gray-200 rounded-2xl text-xs font-medium text-gray-800 leading-relaxed focus:outline-none focus:border-[#095181]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">Appears under the title describing the curated showcase.</span>
            </div>
          </div>

        </div>
      )}

      {/* ════ TAB 4: TECHNICAL CONTROLS & ROBOTS ════ */}
      {activeTab === 'technical' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#d1d9e6] space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="text-base font-black text-[#1a2b4b] uppercase tracking-wide flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#095181]" /> Technical SEO &amp; Robot Directives
            </h2>
            <p className="text-xs text-gray-500 font-medium mt-1">
              Control search engine crawler behavior. Be cautious with indexing directives.
            </p>
          </div>

          {/* Destructive Warning if noindex is selected */}
          {robotsIndex === 'noindex' && (
            <div className="p-5 bg-red-50 border-2 border-red-500 rounded-2xl flex items-start gap-3.5 text-red-900 animate-pulse">
              <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-wider text-red-800">
                  Critical Warning: Homepage Set to &quot;NOINDEX&quot;
                </h4>
                <p className="text-xs leading-relaxed text-red-700">
                  You have configured the robots directive to <strong>noindex</strong>. This explicitly commands Google, Bing, and all major search engines to <strong>remove the public homepage from their search indexes</strong>. Only leave this enabled if the site is temporarily private or in maintenance.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Robots Index Directives */}
            <div className="p-5 bg-[#f8fafc] rounded-2xl border border-gray-200 space-y-3">
              <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider">
                Robots Indexing Directive
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="robotsIndex"
                    checked={robotsIndex === 'index'}
                    onChange={() => { markDirty(); setRobotsIndex('index'); }}
                    className="w-4 h-4 text-[#095181]"
                  />
                  <span className="text-xs font-bold text-gray-800">index (Allow indexing)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="robotsIndex"
                    checked={robotsIndex === 'noindex'}
                    onChange={() => {
                      markDirty();
                      setNoindexConfirmOpen(true);
                    }}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-xs font-bold text-red-700">noindex (Block indexing)</span>
                </label>
              </div>
              <p className="text-[10px] text-gray-500">
                Default: <strong>index</strong>. Setting to noindex generates a &lt;meta name=&quot;robots&quot; content=&quot;noindex&quot;&gt; tag.
              </p>
            </div>

            {/* Robots Follow Directives */}
            <div className="p-5 bg-[#f8fafc] rounded-2xl border border-gray-200 space-y-3">
              <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider">
                Robots Link Following Directive
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="robotsFollow"
                    checked={robotsFollow === 'follow'}
                    onChange={() => { markDirty(); setRobotsFollow('follow'); }}
                    className="w-4 h-4 text-[#095181]"
                  />
                  <span className="text-xs font-bold text-gray-800">follow (Follow internal links)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="robotsFollow"
                    checked={robotsFollow === 'nofollow'}
                    onChange={() => { markDirty(); setRobotsFollow('nofollow'); }}
                    className="w-4 h-4 text-gray-800"
                  />
                  <span className="text-xs font-bold text-gray-800">nofollow (Do not follow)</span>
                </label>
              </div>
              <p className="text-[10px] text-gray-500">
                Default: <strong>follow</strong>. Instructs search engines to crawl through navigation links on the homepage.
              </p>
            </div>
          </div>

          {/* Publication Status */}
          <div className="p-5 bg-[#f8fafc] rounded-2xl border border-gray-200 space-y-3">
            <label className="block text-xs font-bold text-[#1a2b4b] uppercase tracking-wider">
              Homepage SEO Configuration Status
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'Published'}
                  onChange={() => { markDirty(); setStatus('Published'); }}
                  className="w-4 h-4 text-green-600"
                />
                <span className="text-xs font-bold text-green-700">Published (Active on live website)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'Draft'}
                  onChange={() => { markDirty(); setStatus('Draft'); }}
                  className="w-4 h-4 text-amber-600"
                />
                <span className="text-xs font-bold text-amber-700">Draft (Staged settings)</span>
              </label>
            </div>
          </div>

        </div>
      )}

      {/* ══ CONFIRMATION MODAL: DELETE SECTION ══ */}
      {deleteConfirmIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-[#1a2b4b] uppercase tracking-tight">
              Delete Content Section?
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to remove section <strong>#{deleteConfirmIndex + 1}: &quot;{sections[deleteConfirmIndex]?.heading || 'Untitled'}&quot;</strong>? This action cannot be undone once changes are saved.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmIndex(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSectionConfirm(deleteConfirmIndex)}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 shadow-md shadow-red-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CONFIRMATION MODAL: DISCARD CHANGES ══ */}
      {discardConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-[#1a2b4b] uppercase tracking-tight">
              Discard Unsaved Changes?
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              All modifications made during this session will be reverted to the last saved database state.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDiscardConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-200"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 shadow-md shadow-red-600/20"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CONFIRMATION MODAL: NOINDEX WARNING ══ */}
      {noindexConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 border-2 border-red-500">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-red-600 uppercase tracking-tight">
              Severe Warning: Blocking Search Engines
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Setting robots to <strong>noindex</strong> will command Google, Bing, and other search engines to completely <strong>de-index and remove the public homepage</strong> from search results. This will drop all organic ranking and organic search traffic until re-indexed.
            </p>
            <p className="text-xs font-bold text-gray-900">
              Are you completely certain you want to enable &quot;noindex&quot;?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setNoindexConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-200"
              >
                Cancel (Keep Indexed)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRobotsIndex('noindex');
                  setNoindexConfirmOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 shadow-md shadow-red-600/20"
              >
                Yes, Enable Noindex
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
