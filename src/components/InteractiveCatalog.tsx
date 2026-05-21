"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, X, FileText, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  attributes: Record<string, string>;
  isFeatured: boolean;
  category: string;
  subCategory?: string;
  description?: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface SubCategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
}

interface InteractiveCatalogProps {
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  verticalSlug: string;
  initialCategorySlug: string;
}

export default function InteractiveCatalog({
  products,
  categories,
  subCategories,
  verticalSlug,
  initialCategorySlug,
}: InteractiveCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (initialCategorySlug === 'all') return 'all';
    const found = categories.find(c => c.slug.toLowerCase() === initialCategorySlug.toLowerCase());
    return found ? found.name : 'all';
  });
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');

  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === 'all') return null;
    return categories.find(c => c.name.toLowerCase() === selectedCategory.toLowerCase());
  }, [selectedCategory, categories]);

  const filteredSubCategories = useMemo(() => {
    if (selectedCategory === 'all' || !activeCategoryObj) return [];
    return subCategories.filter(sc => sc.categoryId === activeCategoryObj.id);
  }, [selectedCategory, activeCategoryObj, subCategories]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      // 2. Sub-Category Filter
      if (selectedSubCategory !== 'all' && (!product.subCategory || product.subCategory.toLowerCase() !== selectedSubCategory.toLowerCase())) {
        return false;
      }
      // 3. Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesSub = product.subCategory?.toLowerCase().includes(query);
        const matchesAttr = Object.values(product.attributes || {}).some(val =>
          String(val).toLowerCase().includes(query)
        );
        return matchesName || matchesCat || matchesSub || matchesAttr;
      }
      return true;
    });
  }, [products, selectedCategory, selectedSubCategory, searchQuery]);

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    setSelectedSubCategory('all');
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSearchQuery('');
  };


  return (
    <div className="space-y-12">
      {/* ═══ FILTER CONTROL HUB ═══ */}
      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] border border-primary/5 space-y-6">
        <div className="grid md:grid-cols-12 gap-6 items-center">
          {/* Text Search */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A5181]/30" />
            <input
              type="text"
              placeholder="Search products by name, fabric, pattern, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-[#0A5181]/[0.02] border border-[#0A5181]/5 rounded-xl text-[#0A5181] text-sm font-medium placeholder-[#0A5181]/35 focus:outline-none focus:border-accent focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0A5181]/30 hover:text-[#0A5181] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Active Status & Reset */}
          <div className="md:col-span-6 flex items-center justify-between md:justify-end gap-6">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#0A5181]/40">
              Showing {filteredProducts.length} of {products.length} Products
            </span>
            {(selectedCategory !== 'all' || selectedSubCategory !== 'all' || searchQuery !== '') && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 text-accent text-[11px] font-black uppercase tracking-widest hover:text-[#0A5181] transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="space-y-4">
          <div className="text-[9px] font-black uppercase tracking-widest text-primary/30">Category</div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => handleCategorySelect('all')}
              className={cn(
                "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border",
                selectedCategory === 'all'
                  ? "bg-[#0A5181] text-white border-[#0A5181] shadow-lg shadow-[#0A5181]/15"
                  : "bg-white text-[#0A5181]/60 border-primary/5 hover:border-accent/35 hover:text-accent"
              )}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border",
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? "bg-[#0A5181] text-white border-[#0A5181] shadow-lg shadow-[#0A5181]/15"
                    : "bg-white text-[#0A5181]/60 border-primary/5 hover:border-accent/35 hover:text-accent"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Category Pills (Dynamic) */}
        {filteredSubCategories.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-primary/5">
            <div className="text-[9px] font-black uppercase tracking-widest text-primary/30">Sub-Category</div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={cn(
                  "px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border",
                  selectedSubCategory === 'all'
                    ? "bg-accent text-white border-accent shadow-md shadow-accent/15"
                    : "bg-white text-primary/60 border-primary/5 hover:border-accent/35 hover:text-accent"
                )}
              >
                All {selectedCategory}
              </button>
              {filteredSubCategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubCategory(sub.name)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border",
                    selectedSubCategory.toLowerCase() === sub.name.toLowerCase()
                      ? "bg-accent text-white border-accent shadow-md shadow-accent/15"
                      : "bg-white text-primary/60 border-primary/5 hover:border-accent/35 hover:text-accent"
                  )}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ═══ PRODUCT GRID ═══ */}
      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10"
          >
            {filteredProducts.map((product) => (
              <motion.div
                layout
                key={product._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative flex flex-col bg-white border border-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                {/* Image Showcase */}
                <div className="relative aspect-[3/4] overflow-hidden bg-primary/5">
                  {product.images?.[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-[10px] font-black uppercase tracking-widest text-primary/20">
                      No Media
                    </div>
                  )}

                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-accent text-white text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg">
                      Exclusive Design
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="p-3 sm:p-5 md:p-6 flex flex-col flex-1 justify-between min-h-[140px] sm:min-h-[180px]">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1 sm:mb-2">
                      <span className="text-[#DA222A] text-[8px] font-black uppercase tracking-widest">
                        {product.category}
                      </span>
                      {product.subCategory && (
                        <span className="text-[#0A5181]/40 text-[8px] font-bold uppercase tracking-widest hidden sm:inline">
                          {product.subCategory}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[#0A5181] text-xs sm:text-base font-black uppercase tracking-tight italic line-clamp-2 mb-2 sm:mb-4 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>

                    {/* SEO Technical Specifications Table */}
                    {product.attributes && Object.keys(product.attributes).length > 0 && (
                      <table className="w-full text-[8px] sm:text-[10px] border-t border-primary/5 pt-1.5 sm:pt-2">
                        <tbody>
                          {Object.entries(product.attributes).slice(0, 3).map(([key, val]) => (
                            <tr key={key} className="border-b border-gray-50 last:border-none">
                              <td className="py-1 sm:py-1.5 font-bold uppercase text-[#0A5181]/40 tracking-wider">{key}</td>
                              <td className="py-1 sm:py-1.5 text-right font-black text-[#0A5181] uppercase truncate max-w-[80px] sm:max-w-[120px]">{String(val)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Actions Grid */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-primary/5">
                    <Link
                      href={`/${verticalSlug}/product/${product.slug}`}
                      className="w-full py-2.5 sm:py-3.5 bg-[#DA222A] text-white text-[9px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.16em] flex items-center justify-center gap-2 hover:bg-[#0A5181] transition-all rounded-xl shadow-lg shadow-[#DA222A]/10 active:scale-[0.98] whitespace-nowrap"
                    >
                      <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200"
          >
            <ShoppingBag className="w-12 h-12 text-[#0A5181]/20 mx-auto mb-4" />
            <h3 className="text-xl font-black text-[#0A5181] uppercase tracking-tighter italic">No Matching Products</h3>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
              We couldn&apos;t find any products matching your selected filters or search query. Try resetting filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-3 bg-[#0A5181] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent transition-colors shadow-lg shadow-primary/10"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
