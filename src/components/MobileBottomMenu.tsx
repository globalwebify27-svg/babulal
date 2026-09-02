"use client";

import React, { useState } from 'react';
import { Home, Phone, X, ChevronRight, ArrowRight } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SubCategory {
  id: number | string;
  name: string;
  slug: string;
}

interface Category {
  id?: number | string;
  name: string;
  slug: string;
  subcategories?: SubCategory[];
}

interface MobileBottomMenuProps {
  categories?: Category[];
}

export default function MobileBottomMenu({ categories = [] }: MobileBottomMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeCategoryForModal, setActiveCategoryForModal] = useState<Category | null>(null);

  const handleHomeAction = () => {
    router.push('/textiles');
  };

  const handleCallAction = () => {
    window.location.href = 'tel:+917667985545';
  };

  const handleCategoryClick = (cat: Category) => {
    if (cat.subcategories && cat.subcategories.length > 0) {
      setActiveCategoryForModal(cat);
    } else {
      router.push(`/textiles/category/${cat.slug}`);
    }
  };

  const displayCategories = categories && categories.length > 0
    ? categories
    : [
        { name: 'Saree', slug: 'saree', subcategories: [] },
        { name: 'Lehenga', slug: 'lehenga', subcategories: [] },
        { name: 'Suit', slug: 'suit', subcategories: [] },
        { name: 'Kurti', slug: 'kurti', subcategories: [] }
      ];

  return (
    <>
      {/* ═══ MOBILE BOTTOM NAVIGATION MENU (RED & STYLISH) ═══ */}
      <div className="fixed bottom-0 left-0 right-0 z-[150] md:hidden bg-[#DA222A] text-white border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.15)] pb-safe h-16">
        <div className="flex items-center justify-between h-full relative">
          
          {/* FIXED LEFT: Home Button */}
          <button
            onClick={handleHomeAction}
            className={cn(
              "flex flex-col items-center justify-center shrink-0 w-16 h-full border-r border-white/10 active:scale-95 transition-transform",
              pathname === '/textiles' ? "text-white bg-white/5" : "text-white/70"
            )}
          >
            <Home className="w-4.5 h-4.5" />
            <span className="text-[8px] font-black uppercase tracking-wider mt-1">Home</span>
          </button>

          {/* SCROLLING MIDDLE: Real categories from DB */}
          <div 
            className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 px-3 h-full overscroll-x-contain touch-pan-x"
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {displayCategories.map((cat) => {
              const active = pathname === `/textiles/category/${cat.slug}`;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat)}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border flex items-center gap-1",
                    active
                      ? "bg-white text-[#DA222A] border-white shadow-md scale-105"
                      : "bg-white/10 text-white/80 border-white/5 hover:bg-white/20 active:scale-95"
                  )}
                >
                  <span>{cat.name}</span>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <span className="w-1.5 h-1.5 bg-[#DA222A]/20 active:bg-white rounded-full bg-white/30" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Scroll Edge Fading Masks */}
          <div className="absolute left-[64px] top-0 bottom-0 w-4 bg-gradient-to-r from-[#DA222A] to-transparent pointer-events-none z-10" />
          <div className="absolute right-[64px] top-0 bottom-0 w-4 bg-gradient-to-l from-[#DA222A] to-transparent pointer-events-none z-10" />

          {/* FIXED RIGHT: Call Button */}
          <button
            onClick={handleCallAction}
            className="flex flex-col items-center justify-center shrink-0 w-16 h-full border-l border-white/10 text-white/80 active:scale-95 transition-transform"
          >
            <Phone className="w-4.5 h-4.5" />
            <span className="text-[8px] font-black uppercase tracking-wider mt-1">Call Desk</span>
          </button>
        </div>
      </div>

      {/* ═══ BOTTOM MODAL DRAWER FOR SUBCATEGORIES ═══ */}
      {activeCategoryForModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 z-[200] transition-opacity"
            onClick={() => setActiveCategoryForModal(null)}
          />
          
          {/* Drawer content */}
          <div className="fixed bottom-0 inset-x-0 bg-white rounded-t-3xl z-[210] p-6 max-h-[70vh] overflow-y-auto shadow-2xl border-t border-gray-100 text-[#0A5181] md:hidden animate-in slide-in-from-bottom duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#DA222A] tracking-widest">Explore Collection</span>
                <h3 className="text-xl font-black uppercase italic tracking-tight">{activeCategoryForModal.name}</h3>
              </div>
              <button
                onClick={() => setActiveCategoryForModal(null)}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {activeCategoryForModal.subcategories?.map((sub: any) => (
                <button
                  key={sub.slug}
                  onClick={() => {
                    setActiveCategoryForModal(null);
                    router.push(`/textiles/category/${activeCategoryForModal.slug}?sub=${sub.slug}`);
                  }}
                  className="flex items-center justify-between p-3.5 bg-gray-50 hover:bg-red-50 hover:text-[#DA222A] rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-colors border border-gray-100"
                >
                  <span>{sub.name}</span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              ))}
            </div>

            {/* View All Button */}
            <button
              onClick={() => {
                setActiveCategoryForModal(null);
                router.push(`/textiles/category/${activeCategoryForModal.slug}`);
              }}
              className="w-full py-4 bg-[#DA222A] hover:bg-[#DA222A]/90 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#DA222A]/20"
            >
              View Full {activeCategoryForModal.name} Range <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </>
  );
}
