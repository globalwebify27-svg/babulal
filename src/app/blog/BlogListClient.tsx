"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  User, 
  Clock, 
  ArrowRight, 
  Tag, 
  BookOpen, 
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import { BlogPost } from '@/lib/blogs';
import { Haptics } from '@/lib/haptics';

interface BlogListClientProps {
  initialBlogs: BlogPost[];
  categories: string[];
}

export default function BlogListClient({ initialBlogs, categories }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Filter blogs based on category and search query
  const filteredBlogs = useMemo(() => {
    return initialBlogs.filter((blog) => {
      const matchesCategory = 
        selectedCategory === 'ALL' || 
        blog.category?.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !query ||
        blog.title?.toLowerCase().includes(query) ||
        blog.excerpt?.toLowerCase().includes(query) ||
        blog.author?.toLowerCase().includes(query) ||
        blog.tags?.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [initialBlogs, selectedCategory, searchQuery]);

  // Featured blog: first featured blog, or first blog in list
  const featuredBlog = useMemo(() => {
    if (selectedCategory !== 'ALL' || searchQuery.trim() !== '') return null;
    return initialBlogs.find((b) => b.isFeatured) || initialBlogs[0] || null;
  }, [initialBlogs, selectedCategory, searchQuery]);

  // Rest of blogs (excluding featured blog if displayed on hero)
  const regularBlogs = useMemo(() => {
    if (featuredBlog && selectedCategory === 'ALL' && searchQuery.trim() === '') {
      return filteredBlogs.filter((b) => b.id !== featuredBlog.id);
    }
    return filteredBlogs;
  }, [filteredBlogs, featuredBlog, selectedCategory, searchQuery]);

  const displayedBlogs = regularBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < regularBlogs.length;

  const handleLoadMore = () => {
    Haptics.light();
    setVisibleCount((prev) => prev + 6);
  };

  const allCategoryTabs = ['ALL', ...categories];

  return (
    <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-16">
      
      {/* ═══ CATEGORIES & SEARCH FILTER BAR ═══ */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-12 border-b border-gray-100 pb-8">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2 lg:pb-0">
          {allCategoryTabs.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => {
                  Haptics.light();
                  setSelectedCategory(cat);
                  setVisibleCount(9);
                }}
                className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#DA222A] text-white shadow-lg shadow-[#DA222A]/20 scale-105'
                    : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {cat === 'ALL' ? 'All Articles' : cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-80 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(9);
            }}
            placeholder="Search articles, topics..."
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium outline-none focus:bg-white focus:border-[#DA222A]/40 focus:ring-2 focus:ring-[#DA222A]/10 transition-all text-gray-800 placeholder:text-gray-400"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ═══ HERO FEATURED POST (Shown when not filtering) ═══ */}
      {featuredBlog && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Link
            href={`/blog/${featuredBlog.slug}`}
            className="group block bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-500"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image Column */}
              <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[460px] overflow-hidden bg-gray-100">
                <Image
                  src={featuredBlog.featuredImage || '/silk_saree_royal.png'}
                  alt={featuredBlog.imageAlt || featuredBlog.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
                <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
                  <span className="bg-[#DA222A] text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Featured Story
                  </span>
                  <span className="bg-[#0A5181] text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-lg">
                    {featuredBlog.category}
                  </span>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-5 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#DA222A]" />
                      {featuredBlog.publishedAt 
                        ? new Date(featuredBlog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#0A5181]" />
                      {featuredBlog.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A5181] tracking-tight leading-[1.15] mb-4 group-hover:text-[#DA222A] transition-colors">
                    {featuredBlog.title}
                  </h2>

                  {featuredBlog.subtitle && (
                    <p className="text-sm font-semibold text-gray-500 italic mb-4 line-clamp-2">
                      {featuredBlog.subtitle}
                    </p>
                  )}

                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {featuredBlog.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#0A5181]/10 text-[#0A5181] flex items-center justify-center font-black text-xs">
                      {featuredBlog.author ? featuredBlog.author[0] : 'B'}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">{featuredBlog.author}</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{featuredBlog.authorRole || 'Editorial Specialist'}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-2 text-[#DA222A] text-xs font-black uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    Read Story <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* ═══ ARTICLES GRID ═══ */}
      {displayedBlogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayedBlogs.map((blog, idx) => (
            <motion.article
              key={blog.id || blog.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Card Image */}
              <Link href={`/blog/${blog.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-gray-100">
                <Image
                  src={blog.featuredImage || '/silk_saree_royal.png'}
                  alt={blog.imageAlt || blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-[#0A5181] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    {blog.category}
                  </span>
                </div>
              </Link>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Meta Bar */}
                  <div className="flex items-center gap-3 text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#DA222A]" />
                      {blog.publishedAt 
                        ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {blog.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="text-lg sm:text-xl font-black text-[#0A5181] tracking-tight leading-snug mb-3 group-hover:text-[#DA222A] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 line-clamp-3">
                    {blog.excerpt || 'Explore this in-depth guide and design story from Babulal Premsons.'}
                  </p>
                </div>

                {/* Footer Bar */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    By <strong className="text-gray-700">{blog.author}</strong>
                  </span>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-1 text-[#DA222A] text-[11px] font-black uppercase tracking-wider group-hover:translate-x-1 transition-transform"
                  >
                    Read <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-200 mb-16">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-[#0A5181] uppercase tracking-tight mb-2">No Articles Found</h3>
          <p className="text-gray-400 text-xs uppercase tracking-widest max-w-md mx-auto mb-6">
            {searchQuery
              ? `No articles matched your search for "${searchQuery}". Try a different keyword.`
              : 'There are currently no published articles in this category. Check back soon for fresh editorial updates.'}
          </p>
          {(searchQuery || selectedCategory !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="px-6 py-2.5 bg-[#0A5181] text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#DA222A] transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

      {/* ═══ LOAD MORE BUTTON ═══ */}
      {hasMore && (
        <div className="text-center mb-16">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3.5 bg-white border-2 border-[#0A5181] text-[#0A5181] text-xs font-black uppercase tracking-widest rounded-full hover:bg-[#0A5181] hover:text-white transition-all shadow-md active:scale-95"
          >
            Load More Stories
          </button>
        </div>
      )}

      {/* ═══ NEWSLETTER / ARCHIVE CALLOUT ═══ */}
      <div className="bg-[#0A5181] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DA222A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.3em] block mb-3">Century of Wisdom</span>
          <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight leading-tight mb-4">
            Curated Fashion & Fabric Insights Directly from Eastern India&apos;s Oldest Hub
          </h3>
          <p className="text-white/80 text-sm leading-relaxed mb-6 font-medium">
            Explore authentic handloom guides, wedding collection previews, and seasonal styling recommendations preserved across five generations of excellence.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="px-8 py-3 bg-[#DA222A] text-white text-[11px] font-black uppercase tracking-widest rounded-md hover:bg-black transition-colors shadow-lg"
            >
              Connect with Stylists
            </Link>
            <Link
              href="/textiles"
              className="px-8 py-3 bg-white/10 border border-white/20 text-white text-[11px] font-black uppercase tracking-widest rounded-md hover:bg-white hover:text-[#0A5181] transition-all"
            >
              Browse Textile Catalog
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
