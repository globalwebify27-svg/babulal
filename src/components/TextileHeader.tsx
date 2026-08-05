"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  Phone, 
  Globe, 
  User,
  ShoppingBag,
  Menu,
  X,
  BookOpen,
  Mail,
  MessageCircle,
  Download
} from 'lucide-react';
import CatalogDownloadModal from './CatalogDownloadModal';

const CATEGORIES = [
  "Saree", "Lehenga", "Suit", "Kurti", "Dupatta", "Blouse", "Petticoat", "Kids Wear", "Bottom Wear", "Mens Wear", "Towel"
];

interface TextileHeaderProps {
  categories?: any[];
}

const TextileHeader = ({ categories = [] }: TextileHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [marqueeTexts, setMarqueeTexts] = useState<string[]>([
    "Jharkhand's Leading Retail Textile Hub For Over 100 Years",
    "Global Shipping Now Available to 50+ Countries",
    "New Bridal Collection 2026 Launching Soon"
  ]);

  const toggleCategory = (slug: string) => {
    setExpandedCategory(expandedCategory === slug ? null : slug);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMarquee = async () => {
      try {
        const res = await fetch('/api/admin/landing-content?vertical=textiles');
        const data = await res.json();
        if (data.marqueeTexts && Array.isArray(data.marqueeTexts) && data.marqueeTexts.length > 0) {
          setMarqueeTexts(data.marqueeTexts);
        }
      } catch (err) {
        console.error('Failed to fetch marquee texts:', err);
      }
    };
    fetchMarquee();
  }, []);

  const repeatedMarquees = [...marqueeTexts, ...marqueeTexts, ...marqueeTexts, ...marqueeTexts];

  return (
    <header className="w-full fixed top-0 left-0 z-[100] transition-all duration-300">
      
      {/* ═══ THE HIDING DECK (Tiers 1 & 2) ═══ */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isScrolled ? 'lg:opacity-0 lg:max-h-0 lg:pointer-events-none lg:translate-y-[-100%]' : 'opacity-100 max-h-[400px] translate-y-0'}`}>
        
        {/* TIER 1: TICKER */}
        <div className="bg-[#DA222A] text-white py-1.5 md:py-2 overflow-hidden shadow-sm relative z-50">
          <div className="flex whitespace-nowrap animate-marquee font-bold text-[8px] md:text-[10px] uppercase tracking-[.3em]">
            {repeatedMarquees.map((text, idx) => (
              <span key={idx} className="mx-4 md:mx-8">{text}</span>
            ))}
          </div>
        </div>

        {/* TIER 2: BRANDING */}
        <div className={`bg-white border-b border-gray-100 py-2 md:py-2 transition-all ${isScrolled ? 'shadow-lg' : ''}`}>
          <div className="max-w-[1700px] mx-auto px-4 md:px-12 flex items-center justify-between gap-4 md:gap-10">
            <Link href="/textiles" className="relative w-48 md:w-72 lg:w-[480px] h-10 md:h-14 lg:h-16 transition-transform hover:scale-[1.01]">
              <Image 
                src="/BabulalPremkumar.png" 
                alt="Babulal Premkumar" 
                fill 
                sizes="(max-width: 768px) 200px, 600px"
                className="object-contain object-left" 
                priority
              />
            </Link>

            <div className="hidden xl:flex flex-1 max-w-xl relative group">
              <input 
                type="text" 
                placeholder="Search catalog..." 
                className="w-full pl-6 pr-14 py-3 bg-gray-50 border border-gray-100 rounded-full text-sm font-medium outline-none focus:bg-white focus:border-red-600/30 transition-all"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-black shadow-lg transition-transform active:scale-95">
                <Search className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-4 md:gap-10">
               <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
                 <Link href="#about" className="hover:text-red-600 transition-colors">About Us</Link>
                 <Link href="#contact" className="hover:text-red-600 transition-colors">Contact</Link>
               </div>
                <button 
                  onClick={() => setIsCatalogModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#DA222A] text-white text-[9px] md:text-[11px] font-black uppercase tracking-[0.05em] md:tracking-widest rounded-lg shadow-xl shadow-[#DA222A]/20 hover:bg-black transition-all active:scale-[0.96] animate-blink whitespace-nowrap"
                >
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                  </span>
                  <span className="hidden sm:inline">Lowest Rate 365 Days</span>
                  <span className="sm:hidden">Lowest Rate</span>
                </button>
               <button 
                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                 className="xl:hidden p-2 text-gray-600"
               >
                 {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ TIER 3: THE PERMANENT STICKY NAV ═══ */}
      <div className={`bg-white border-b border-gray-100 shadow-sm transition-all duration-300 hidden lg:block ${isScrolled ? 'shadow-xl bg-white/95 backdrop-blur-xl' : ''}`}>
        <div className="max-w-[1400px] mx-auto px-8 relative">
          <nav className="flex items-center justify-center gap-3 py-1 lg:overflow-visible overflow-x-auto no-scrollbar snap-x">
            {/* DYNAMIC HEADER CATEGORIES */}
            {(categories.length > 0 ? categories : [
              { name: "Sarees", slug: "sarees" },
              { name: "Suits", slug: "suits" },
              { name: "Kurtis", slug: "kurtis" },
              { name: "Kids Wear", slug: "kids-wear" },
              { name: "Lehenga", slug: "lehenga" },
              { name: "Home Furnishing", slug: "home-furnishings" },
              { name: "Mens Wear", slug: "mens-wear" },
              { name: "Uniforms", slug: "uniforms" }
            ]).map((cat) => {
              const hasSubs = cat.subcategories && cat.subcategories.length > 0;
              return (
                <div key={cat.slug} className="group relative shrink-0 snap-start">
                  <Link 
                    href={`/textiles/category/${cat.slug}`} 
                    className="relative flex items-center gap-1 px-4 py-3.5 md:py-4.5 text-[10px] md:text-[11.5px] font-black uppercase tracking-[.18em] text-gray-700 hover:text-red-600 transition-colors"
                  >
                    {cat.name}
                    {hasSubs && (
                      <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-red-600 group-hover:rotate-180 transition-all duration-300" />
                    )}
                    <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-600 transition-all duration-300 group-hover:w-full" />
                  </Link>

                  {hasSubs && (
                    <div className="absolute left-0 top-full pt-1 opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-[150] w-[240px]">
                      <div className="bg-white border border-gray-100 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden py-2 backdrop-blur-md">
                        {cat.subcategories.map((sub: any, idx: number) => (
                          <Link
                            key={`${sub.slug}-${idx}`}
                            href={`/textiles/category/${cat.slug}?sub=${sub.slug}`}
                            className="flex items-center justify-between px-5 py-3 text-[11px] font-black uppercase tracking-widest text-gray-600 hover:text-red-600 hover:bg-gray-50/50 hover:pl-7 transition-all duration-200 group/item"
                          >
                            <span>{sub.name}</span>
                            <ChevronDown className="w-3.5 h-3.5 -rotate-90 opacity-0 group-hover/item:opacity-100 text-red-600 transition-all duration-200" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ═══ MOBILE DRAWER (Institutional Redesing) ═══ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="xl:hidden fixed inset-0 bg-white z-[200] flex flex-col overflow-y-auto no-scrollbar"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="relative w-40 h-10">
                <Image 
                  src="/BabulalPremkumar.png" 
                  alt="Babulal Premkumar" 
                  fill 
                  sizes="200px"
                  className="object-contain object-left" 
                />
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-[#DA222A] hover:bg-gray-50 rounded-full transition-colors"
              >
                <X className="w-8 h-8 stroke-[2.5px]" />
              </button>
            </div>

            {/* Menu Links */}
            <nav className="flex flex-col">
              {/* Combine dynamic categories and static utility links */}
              {[
                { name: "Home", slug: "home", type: 'utility', href: '/textiles' },
                ...(categories.length > 0 
                  ? categories.map(c => ({ name: c.name, slug: c.slug, type: 'category', subcategories: c.subcategories }))
                  : [
                      { name: "Saree", slug: "sarees", type: 'category', subcategories: [] },
                      { name: "Suit", slug: "suits", type: 'category', subcategories: [] },
                      { name: "Kurti", slug: "kurtis", type: 'category', subcategories: [] },
                      { name: "Kids Wear", slug: "kids-wear", type: 'category', subcategories: [] },
                      { name: "Lehenga", slug: "lehenga", type: 'category', subcategories: [] },
                    ]
                ),
                { name: "Retail Hub", slug: "sarees", type: 'utility', href: '/textiles/category/sarees' },
                { name: "Blog", slug: "blog", type: 'utility', href: '#blog' },
                { name: "Contact Us", slug: "contact", type: 'utility', href: '#contact' },
              ].map((item: any, i) => {
                const isCategory = item.type === 'category';
                const hasSubs = isCategory && item.subcategories && item.subcategories.length > 0;
                
                return (
                  <div key={i} className="border-b border-gray-100 flex flex-col">
                    <div className="flex items-center justify-between">
                      <Link 
                        href={isCategory ? `/textiles/category/${item.slug}` : (item.href || `#${item.slug}`)}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex-1 px-8 py-5 text-[#DA222A] text-lg font-bold tracking-tight group active:bg-gray-50 transition-colors"
                      >
                        {item.name}
                      </Link>
                      {hasSubs && (
                        <button
                          onClick={() => toggleCategory(item.slug)}
                          className="px-6 py-5 text-[#DA222A] hover:bg-gray-50 transition-colors"
                        >
                          <ChevronDown className={`w-6 h-6 transform transition-transform duration-300 ${expandedCategory === item.slug ? 'rotate-180 text-red-600' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Subcategories Accordion */}
                    {hasSubs && (
                      <div className={`overflow-hidden transition-all duration-300 bg-gray-50/50 ${expandedCategory === item.slug ? 'max-h-[300px] border-t border-gray-50' : 'max-h-0'}`}>
                        <div className="pl-12 pr-8 py-3 flex flex-col gap-4">
                          {item.subcategories.map((sub: any, idx: number) => (
                            <Link
                              key={`${sub.slug}-${idx}`}
                              href={`/textiles/category/${item.slug}?sub=${sub.slug}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-[12px] font-black uppercase tracking-widest text-gray-500 hover:text-[#DA222A] py-1 transition-colors"
                            >
                              • {sub.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="px-8 py-10">
               <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCatalogModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-[#DA222A] text-white text-[11px] font-black uppercase tracking-widest rounded shadow-xl"
               >
                 <Download className="w-5 h-5 text-white" /> Download Catalogs
               </button>
            </div>

            {/* Bottom Contact Quick Links */}
            <div className="p-8 bg-gray-50/50 mt-auto">
              <div className="flex justify-center gap-8">
                <Link href="tel:+916512207555" className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#0A5181]">
                  <Phone className="w-5 h-5" />
                </Link>
                <Link href="mailto:Group@babulalpremsons.com" className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#DA222A]">
                  <Mail className="w-5 h-5" />
                </Link>
                <Link href="#" className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-[#25D366]">
                  <MessageCircle className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CatalogDownloadModal 
        isOpen={isCatalogModalOpen} 
        onClose={() => setIsCatalogModalOpen(false)} 
      />
    </header>
  );
};

export default TextileHeader;
