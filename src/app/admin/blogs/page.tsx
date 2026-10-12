"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FileText, 
  Plus, 
  Eye, 
  Trash2, 
  Edit3, 
  Calendar, 
  User, 
  Search, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Upload, 
  X, 
  ExternalLink,
  Loader2,
  RefreshCw,
  SlidersHorizontal,
  Globe,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Haptics } from '@/lib/haptics';

interface AdminBlog {
  id: number;
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  featuredImage?: string | null;
  imageAlt?: string;
  author: string;
  authorRole?: string;
  category: string;
  tags: string[];
  status: 'Published' | 'Draft' | 'Archived';
  isFeatured: boolean;
  readTime: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  publishedAt?: string | null;
  createdAt: string;
}

const DEFAULT_CATEGORIES = [
  "Heritage & Craft",
  "Bridal Couture",
  "Care & Styling",
  "Fashion & Trends",
  "Men's Styling",
  "Festive Collection"
];

export default function BlogsPage() {
  const [articles, setArticles] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<AdminBlog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Form State
  const [formData, setFormData] = useState<{
    id?: number;
    title: string;
    slug: string;
    subtitle: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    imageAlt: string;
    author: string;
    authorRole: string;
    category: string;
    tags: string;
    status: 'Published' | 'Draft' | 'Archived';
    isFeatured: boolean;
    readTime: string;
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
  }>({
    title: '',
    slug: '',
    subtitle: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    imageAlt: '',
    author: 'Babulal Premsons Editorial',
    authorRole: 'Fashion & Textile Specialist',
    category: 'Fashion & Trends',
    tags: '',
    status: 'Published',
    isFeatured: false,
    readTime: '5 min read',
    metaTitle: '',
    metaDescription: '',
    canonicalUrl: '',
  });

  // Fetch articles from API
  const fetchArticles = async () => {
    setLoading(true);
    try {
      let url = '/api/admin/blogs';
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [statusFilter]);

  // Open Create Modal
  const handleOpenCreate = () => {
    Haptics.light();
    setFormData({
      title: '',
      slug: '',
      subtitle: '',
      excerpt: '',
      content: '<h2>Introduction</h2><p>Write your article content here...</p>',
      featuredImage: '',
      imageAlt: '',
      author: 'Babulal Premsons Editorial',
      authorRole: 'Fashion & Textile Specialist',
      category: 'Heritage & Craft',
      tags: 'Fashion, Ethnic Wear, Ranchi',
      status: 'Published',
      isFeatured: false,
      readTime: '5 min read',
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
    });
    setActiveTab('edit');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (article: AdminBlog) => {
    Haptics.light();
    setFormData({
      id: article.id,
      title: article.title,
      slug: article.slug,
      subtitle: article.subtitle || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      featuredImage: article.featuredImage || '',
      imageAlt: article.imageAlt || '',
      author: article.author || 'Babulal Premsons Editorial',
      authorRole: article.authorRole || 'Fashion & Textile Specialist',
      category: article.category || 'Fashion & Trends',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : '',
      status: article.status || 'Draft',
      isFeatured: !!article.isFeatured,
      readTime: article.readTime || '5 min read',
      metaTitle: article.metaTitle || '',
      metaDescription: article.metaDescription || '',
      canonicalUrl: article.canonicalUrl || '',
    });
    setActiveTab('edit');
    setIsModalOpen(true);
  };

  // Handle Image Upload to Base64
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          featuredImage: reader.result as string,
          imageAlt: prev.imageAlt || prev.title || file.name.replace(/\.[^/.]+$/, ''),
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const isNew = !prev.id;
      const autoSlug = val
        .toLowerCase()
        .replace(/['’]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      return {
        ...prev,
        title: val,
        slug: isNew ? autoSlug : prev.slug,
        metaTitle: isNew ? `${val} | Babulal Premsons Journal` : prev.metaTitle,
      };
    });
  };

  // Save Article (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter an article title.');
      return;
    }
    if (!formData.content.trim()) {
      alert('Please enter article content.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isUpdating = !!formData.id;
      const url = '/api/admin/blogs';
      const method = isUpdating ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchArticles();
      } else {
        const errorData = await res.json();
        alert(`Failed to save article: ${errorData.error || 'Server error'}`);
      }
    } catch (err) {
      console.error('Error saving article:', err);
      alert('An unexpected error occurred while saving the article.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Toggle Publish / Draft
  const handleToggleStatus = async (article: AdminBlog) => {
    Haptics.light();
    const newStatus = article.status === 'Published' ? 'Draft' : 'Published';
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: article.id,
          status: newStatus,
        }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === article.id ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Delete Article Confirmation
  const confirmDelete = async () => {
    if (!articleToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/blogs?id=${articleToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
        setIsDeleteModalOpen(false);
        setArticleToDelete(null);
      } else {
        alert('Failed to delete article.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error deleting article.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Content Insertion Helper
  const insertContentTag = (openTag: string, closeTag: string) => {
    setFormData((prev) => ({
      ...prev,
      content: `${prev.content}\n${openTag}Sample text${closeTag}`,
    }));
  };

  // Stats calculation
  const totalCount = articles.length;
  const publishedCount = articles.filter((a) => a.status === 'Published').length;
  const draftCount = articles.filter((a) => a.status === 'Draft').length;
  const featuredCount = articles.filter((a) => a.isFeatured).length;

  return (
    <div className="p-6 md:p-10 bg-[#f5f7fb] min-h-screen">
      
      {/* ═══ HEADER BAR ═══ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6]">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#095181] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#095181]">
              Publishing CMS
            </span>
          </div>
          <h1 className="text-3xl font-black text-[#1a2b4b] uppercase tracking-tighter italic mt-1">
            Editorial Control
          </h1>
          <p className="text-[#1a2b4b]/50 text-xs font-bold tracking-wider mt-1">
            Manage public fashion blog posts, heritage guides, and bridal trend articles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchArticles}
            className="p-3.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
            title="Refresh List"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>

          <Link
            href="/blog"
            target="_blank"
            className="px-5 py-3.5 bg-white border border-gray-200 text-[#095181] rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-gray-50 flex items-center gap-2 shadow-sm"
          >
            <Eye className="w-4 h-4" /> View Public Blog
          </Link>

          <button
            onClick={handleOpenCreate}
            className="bg-[#095181] text-white px-7 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[.2em] shadow-lg shadow-[#095181]/20 flex items-center justify-center gap-2 hover:bg-[#073d61] hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Create New Article
          </button>
        </div>
      </div>

      {/* ═══ METRICS CARDS ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Articles', val: totalCount, icon: FileText, color: 'text-[#095181]' },
          { label: 'Published & Live', val: publishedCount, icon: CheckCircle2, color: 'text-green-600' },
          { label: 'Saved Drafts', val: draftCount, icon: Clock, color: 'text-orange-500' },
          { label: 'Featured Stories', val: featuredCount, icon: Sparkles, color: 'text-[#DA222A]' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-[#d1d9e6] shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.val}</h3>
            </div>
            <stat.icon className={`w-8 h-8 opacity-20 ${stat.color}`} />
          </div>
        ))}
      </div>

      {/* ═══ SEARCH & FILTER CONTROLS ═══ */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#d1d9e6] mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Pills */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
          {['ALL', 'Published', 'Draft', 'Archived'].map((status) => (
            <button
              key={status}
              onClick={() => {
                Haptics.light();
                setStatusFilter(status);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-[#095181] text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchArticles()}
            placeholder="Search by title, author, slug..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:bg-white focus:border-[#095181] transition-all"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* ═══ ARTICLES LIST / GRID ═══ */}
      {loading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#095181]" />
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Editorial Articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-[#d1d9e6] hover:border-[#095181]/40 hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Thumbnail / Header Area */}
              <div className="h-44 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                {article.featuredImage ? (
                  <Image
                    src={article.featuredImage}
                    alt={article.imageAlt || article.title}
                    fill
                    sizes="400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <FileText className="w-12 h-12 text-gray-300" />
                )}

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                  <span className="bg-[#095181] text-white text-[8px] font-black uppercase tracking-[.2em] px-3 py-1 rounded-full shadow-md">
                    {article.category}
                  </span>
                  {article.isFeatured && (
                    <span className="bg-[#DA222A] text-white text-[8px] font-black uppercase tracking-[.2em] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md",
                      article.status === 'Published'
                        ? "bg-green-600 text-white"
                        : article.status === 'Draft'
                        ? "bg-orange-500 text-white"
                        : "bg-gray-600 text-white"
                    )}
                  >
                    {article.status}
                  </span>
                </div>
              </div>

              {/* Body Area */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[#1a2b4b] text-base font-black uppercase tracking-tight leading-snug line-clamp-2 mb-2 group-hover:text-[#095181] transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
                    {article.excerpt || 'No excerpt available.'}
                  </p>

                  <div className="flex items-center gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5 truncate">
                      <User className="w-3 h-3 text-gray-400" />
                      {article.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {article.readTime}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(article)}
                      className={cn(
                        "text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg border transition-colors",
                        article.status === 'Published'
                          ? "border-orange-200 text-orange-600 hover:bg-orange-50"
                          : "border-green-200 text-green-600 hover:bg-green-50"
                      )}
                      title="Quick toggle status"
                    >
                      {article.status === 'Published' ? 'Unpublish' : 'Publish'}
                    </button>

                    {article.status === 'Published' && (
                      <Link
                        href={`/blog/${article.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-[#095181] hover:bg-gray-50 rounded-lg transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(article)}
                      className="p-2.5 bg-gray-50 hover:bg-[#095181] hover:text-white rounded-xl text-gray-600 transition-colors shadow-sm"
                      title="Edit Article"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setArticleToDelete(article);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-2.5 bg-gray-50 hover:bg-red-600 hover:text-white rounded-xl text-gray-600 transition-colors shadow-sm"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-white rounded-3xl border border-[#d1d9e6]">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-black text-[#1a2b4b] uppercase tracking-tight mb-2">No Articles Found</h3>
          <p className="text-gray-400 text-xs uppercase tracking-widest max-w-sm mx-auto mb-6">
            No blog articles match your current filter settings. Click below to publish your first article.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-6 py-3 bg-[#095181] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#073d61] transition-colors"
          >
            Create New Article
          </button>
        </div>
      )}

      {/* ═══ CREATE / EDIT MODAL ═══ */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[90vh] flex flex-col my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-3xl sticky top-0 z-20">
              <div>
                <h2 className="text-xl font-black text-[#1a2b4b] uppercase tracking-tight">
                  {formData.id ? 'Edit Blog Article' : 'Create New Blog Article'}
                </h2>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                  Live publishing engine for Babulal Premsons
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Edit / Preview Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg transition-all",
                      activeTab === 'edit' ? "bg-white text-[#095181] shadow-sm" : "text-gray-500"
                    )}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className={cn(
                      "px-3 py-1.5 rounded-lg transition-all",
                      activeTab === 'preview' ? "bg-white text-[#095181] shadow-sm" : "text-gray-500"
                    )}
                  >
                    Preview
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form Body */}
            <div className="p-8 overflow-y-auto flex-1">
              {activeTab === 'edit' ? (
                <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Row 1: Title & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-700 tracking-wider mb-2">
                        Article Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. The Evolution of Banarasi Silk"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#095181]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-700 tracking-wider mb-2">
                        URL Slug (SEO) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="the-evolution-of-banarasi-silk"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#095181]"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        Public link: /blog/{formData.slug || 'your-slug'}
                      </span>
                    </div>
                  </div>

                  {/* Row 2: Subtitle & Excerpt */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-700 tracking-wider mb-2">
                        Subtitle (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        placeholder="A concise secondary heading..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#095181]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-700 tracking-wider mb-2">
                        Excerpt / Summary (Lead text)
                      </label>
                      <input
                        type="text"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Short 2-line summary for cards and search snippets..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#095181]"
                      />
                    </div>
                  </div>

                  {/* Row 3: Category, Author, Read Time, Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-700 tracking-wider mb-2">
                        Category
                      </label>
                      <input
                        type="text"
                        list="category-suggestions"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#095181]"
                      />
                      <datalist id="category-suggestions">
                        {DEFAULT_CATEGORIES.map((c) => (
                          <option key={c} value={c} />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-700 tracking-wider mb-2">
                        Author Name
                      </label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#095181]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-700 tracking-wider mb-2">
                        Read Time
                      </label>
                      <input
                        type="text"
                        value={formData.readTime}
                        onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                        placeholder="5 min read"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#095181]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-700 tracking-wider mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#095181]"
                      >
                        <option value="Published">Published (Live)</option>
                        <option value="Draft">Draft (Internal)</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Featured Image & Alt text */}
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-black uppercase text-gray-700 tracking-wider flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[#095181]" /> Featured Image
                      </label>
                      {formData.featuredImage && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, featuredImage: '' })}
                          className="text-[10px] font-bold text-red-600 hover:underline"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#095181] file:text-white hover:file:bg-[#073d61] file:cursor-pointer"
                        />
                        <div className="mt-2 text-[10px] text-gray-400">
                          Or enter direct image URL / path below:
                        </div>
                        <input
                          type="text"
                          value={formData.featuredImage.startsWith('data:') ? '(Uploaded Base64 Image)' : formData.featuredImage}
                          onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                          placeholder="/silk_saree_royal.png or https://..."
                          className="w-full mt-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        {formData.featuredImage ? (
                          <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm shrink-0">
                            <Image
                              src={formData.featuredImage}
                              alt={formData.imageAlt || 'Preview'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-28 h-20 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-[10px] font-bold shrink-0">
                            No Image
                          </div>
                        )}

                        <div className="flex-1">
                          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                            Image Alt Description (SEO)
                          </label>
                          <input
                            type="text"
                            value={formData.imageAlt}
                            onChange={(e) => setFormData({ ...formData, imageAlt: e.target.value })}
                            placeholder="Descriptive text for accessibility & Google Image search"
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 5: Content Editor Toolbar & Textarea */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-black uppercase text-gray-700 tracking-wider">
                        Article Content (HTML / Text) *
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => insertContentTag('<h2>', '</h2>')}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded"
                        >
                          + H2
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContentTag('<h3>', '</h3>')}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded"
                        >
                          + H3
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContentTag('<p>', '</p>')}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded"
                        >
                          + P
                        </button>
                        <button
                          type="button"
                          onClick={() => insertContentTag('<ul><li>', '</li></ul>')}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded"
                        >
                          + List
                        </button>
                      </div>
                    </div>

                    <textarea
                      required
                      rows={12}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your article HTML content here..."
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-mono leading-relaxed outline-none focus:bg-white focus:border-[#095181]"
                    />
                  </div>

                  {/* Row 6: Tags & Featured Toggle */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <label className="block text-[11px] font-black uppercase text-gray-700 tracking-wider mb-2">
                        Tags (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="Banarasi Silk, Handloom, Bridal Trends"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-[#095181]"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-6">
                      <label className="relative flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                          className="w-4 h-4 text-[#DA222A] rounded border-gray-300 focus:ring-[#DA222A]"
                        />
                        <div>
                          <span className="text-xs font-black uppercase tracking-wider text-gray-900 block">
                            Set as Featured Story
                          </span>
                          <span className="text-[10px] text-gray-400 block">
                            Highlights this story at the top of the blog page
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Row 7: SEO Overrides Accordion */}
                  <details className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs">
                    <summary className="font-black uppercase tracking-wider text-[#095181] cursor-pointer">
                      SEO & Meta Tags Settings (Optional Overrides)
                    </summary>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                          Meta Title Override
                        </label>
                        <input
                          type="text"
                          value={formData.metaTitle}
                          onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                          placeholder="Custom Google title"
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                          Canonical URL Override
                        </label>
                        <input
                          type="text"
                          value={formData.canonicalUrl}
                          onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                          placeholder="https://babulalpremsons.com/blog/..."
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-gray-600 mb-1">
                          Meta Description
                        </label>
                        <textarea
                          rows={2}
                          value={formData.metaDescription}
                          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                          placeholder="Search engine summary (recommended 150-160 characters)"
                          className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </details>

                </form>
              ) : (
                /* LIVE PREVIEW TAB */
                <div className="space-y-6">
                  <div className="border-b border-gray-100 pb-6">
                    <span className="text-[#DA222A] text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-red-50 rounded-full inline-block mb-3">
                      {formData.category}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0A5181] uppercase tracking-tight mb-2">
                      {formData.title || 'Untitled Article'}
                    </h1>
                    {formData.subtitle && (
                      <p className="text-sm font-medium text-gray-500 italic mb-3">
                        {formData.subtitle}
                      </p>
                    )}
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-3">
                      <span>By {formData.author}</span>
                      <span>•</span>
                      <span>{formData.readTime}</span>
                    </div>
                  </div>

                  {formData.featuredImage && (
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gray-100">
                      <Image
                        src={formData.featuredImage}
                        alt={formData.imageAlt || 'Preview'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {formData.excerpt && (
                    <div className="p-4 bg-gray-50 border-l-4 border-[#DA222A] text-sm italic text-gray-600 rounded-r-xl">
                      {formData.excerpt}
                    </div>
                  )}

                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 border border-gray-300 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="blog-form"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#095181] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#073d61] shadow-lg shadow-[#095181]/20 flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {formData.id ? 'Save Changes' : 'Publish Article'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ═══ DELETE CONFIRMATION MODAL ═══ */}
      {isDeleteModalOpen && articleToDelete && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsDeleteModalOpen(false);
              setArticleToDelete(null);
            }
          }}
        >
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-[#1a2b4b] uppercase tracking-tight mb-2">
              Confirm Deletion
            </h3>

            <p className="text-gray-500 text-xs leading-relaxed mb-6">
              Are you sure you want to permanently delete the article <strong>&ldquo;{articleToDelete.title}&rdquo;</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setArticleToDelete(null);
                }}
                className="px-5 py-2.5 border border-gray-300 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-red-600 text-white text-xs font-black uppercase tracking-wider rounded-xl hover:bg-red-700 transition-colors shadow-md flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />} Delete Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
