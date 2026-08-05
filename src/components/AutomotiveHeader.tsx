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
  Wrench,
  ShieldCheck,
  Calendar
} from 'lucide-react';

const CATEGORIES = [
  "Scooters", "Motorcycles", "Electric", "BigWing", "Service", "Spares", "Exchange", "Offers", "About", "Contact"
];

const AutomotiveHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-[100] transition-all duration-300">
      
      {/* ═══ THE HIDING DECK (Tiers 1 & 2) ═══ */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isScrolled ? 'lg:opacity-0 lg:max-h-0 lg:pointer-events-none lg:translate-y-[-100%]' : 'opacity-100 max-h-[400px] translate-y-0'}`}>
        
        {/* TIER 1: TICKER */}
        <div className="bg-[#DA222A] text-white py-0.5 md:py-1 overflow-hidden shadow-sm relative z-50">
          <div className="flex whitespace-nowrap animate-marquee font-bold text-[8px] md:text-[10px] uppercase tracking-[.3em]">
            <span className="mx-4 md:mx-8">Premsons Honda: Jharkhand&apos;s Largest Honda Wings Dealer</span>
            <span className="mx-4 md:mx-8">Book Your Service Online & Get Priority Inspection</span>
            <span className="mx-4 md:mx-8">Authorised Honda Genuine Spares & Accessories Hub</span>
            <span className="mx-4 md:mx-8">Premsons Honda: Jharkhand&apos;s Largest Honda Wings Dealer</span>
          </div>
        </div>

        {/* TIER 2: BRANDING */}
        <div className={`bg-white border-b border-gray-100 py-0.5 md:py-0.5 transition-all ${isScrolled ? 'shadow-lg' : ''}`}>
          <div className="max-w-[1700px] mx-auto px-4 md:px-12 flex items-center justify-between gap-4 md:gap-10">
            <Link href="/honda" className="relative w-32 md:w-44 lg:w-[220px] h-7 md:h-9 lg:h-10 transition-transform hover:scale-[1.01]">
              <Image 
                src="/BabulalPremkumar.png" 
                alt="Babulal Premkumar Premsons Honda" 
                fill 
                sizes="(max-width: 768px) 120px, 300px"
                className="object-contain object-left" 
                priority
              />
            </Link>

            <div className="hidden xl:flex flex-1 max-w-xl relative group">
              <input 
                type="text" 
                placeholder="Search Honda models, spares..." 
                className="w-full pl-6 pr-14 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-sm font-medium outline-none focus:bg-white focus:border-red-600/30 transition-all"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-black shadow-lg transition-transform active:scale-95">
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-4 md:gap-10">
               <div className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
                 <Link href="#service" className="hover:text-red-600 transition-colors flex items-center gap-2 italic font-bold">
                   <Wrench className="w-3.5 h-3.5" /> Book Service
                 </Link>
                 <Link href="#exchange" className="hover:text-red-600 transition-colors italic font-bold">Exchange</Link>
               </div>
               <button className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-1 md:py-1.5 bg-[#0A5181] text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded shadow-xl hover:bg-black transition-all">
                 <Calendar className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Test Ride</span><span className="sm:hidden">Ride</span>
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
        <div className="max-w-[1700px] mx-auto px-4 md:px-12">
          <nav className="flex items-center justify-start lg:justify-between gap-1 py-1 overflow-x-auto no-scrollbar snap-x">
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat} 
                href={`#${cat.toLowerCase()}`} 
                className="relative px-4 md:px-5 py-1.5 md:py-2 text-[10px] md:text-[11px] font-black uppercase tracking-[.2em] text-gray-700 hover:text-red-600 transition-colors group shrink-0 snap-start"
              >
                {cat}
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-red-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* ═══ MOBILE DRAWER ═══ */}
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
              <div className="relative w-28 h-7">
                <Image 
                  src="/BabulalPremkumar.png" 
                  alt="Premsons Honda" 
                  fill 
                  sizes="120px"
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
              {[
                { name: "Scooters", expandable: true },
                { name: "Motorcycles", expandable: true },
                { name: "Electric", expandable: false },
                { name: "BigWing", expandable: false },
                { name: "Service Booking", expandable: false },
                { name: "Exchange & Upgrade", expandable: false },
                { name: "Showroom Locator", expandable: false },
                { name: "About Premsons", expandable: false },
                { name: "Contact Us", expandable: false },
              ].map((item, i) => (
                <Link 
                  key={i}
                  href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-8 py-5 border-b border-gray-100 group active:bg-gray-50 transition-colors"
                >
                  <span className="text-[#DA222A] text-lg font-bold tracking-tight group-hover:translate-x-1 transition-transform">
                    {item.name}
                  </span>
                  {item.expandable && (
                    <ChevronDown className="w-6 h-6 text-[#DA222A]/40 group-hover:text-[#DA222A] transition-colors" />
                  )}
                </Link>
              ))}
            </nav>

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
    </header>
  );
};

export default AutomotiveHeader;
