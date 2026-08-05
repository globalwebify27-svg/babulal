"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu,
  X,
  Cpu,
  ShieldCheck,
  Zap,
  Cog
} from 'lucide-react';

const MUVA_NAV = [
  { name: "Precision Lab", href: "#lab" },
  { name: "Manufacturing", href: "#manufacturing" },
  { name: "Custom Fabrication", href: "#fabrication" },
  { name: "Quality Control", href: "#qc" },
  { name: "Technology", href: "#tech" },
];

export default function MuvaHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-[100] group">
      
      {/* ═══ TOP TECHNICAL RIBBON ═══ */}
      {!isScrolled && (
        <div className="bg-[#073E62] text-[8px] md:text-[10px] font-black uppercase tracking-[.2em] md:tracking-[.4em] text-white px-6 md:px-12 h-6 md:h-8 flex justify-between items-center transition-all duration-300">
           <div className="flex gap-4 md:gap-8 items-center">
              <span className="flex items-center gap-2">
                 <ShieldCheck className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-[#DA222A]" /> ISO 9001:2015
              </span>
              <span className="hidden lg:flex items-center gap-2">
                 <Zap className="w-3.5 h-3.5 text-[#DA222A]" /> Industry 4.0 Ready Facility
              </span>
           </div>
           <div className="hidden sm:block text-[7px] md:text-[9px] font-black opacity-60">100+ Years Legacy — Engineering the Future</div>
        </div>
      )}

      {/* ═══ PRIMARY NAVIGATION ═══ */}
      <div className={`transition-all duration-500 bg-white/80 backdrop-blur-xl border-b border-gray-100 ${isScrolled ? 'py-2 shadow-2xl' : 'py-3 md:py-4'}`}>
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          <Link href="/muva-industries" className="flex items-center gap-4 group/logo">
             <div className={`relative transition-all duration-500 ${isScrolled ? 'h-8 w-[120px] md:h-10 md:w-[180px]' : 'h-10 w-[140px] md:h-16 md:w-[220px]'}`}>
                <Image 
                  src="/muvalogo.png" 
                  alt="MUVA Industries Logo" 
                  fill
                  sizes="(max-width: 768px) 140px, 220px"
                  className="object-contain object-left" 
                  priority 
                />
             </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-8">
            {MUVA_NAV.map((nav) => (
              <Link 
                key={nav.name} 
                href={nav.href} 
                className="text-[#073E62] text-[10px] font-black uppercase tracking-[.25em] whitespace-nowrap hover:text-[#DA222A] transition-all relative group/item"
              >
                {nav.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#DA222A] transition-all duration-500 group-hover/item:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-6">
             <Link 
               href="/contact"
               className="hidden sm:flex items-center gap-3 px-8 py-3 bg-[#073E62] text-white text-[10px] font-black uppercase tracking-[.4em] whitespace-nowrap hover:bg-[#DA222A] transition-all rounded-sm italic"
             >
                <Cpu className="w-4 h-4" /> Technical Inquiry
             </Link>

             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="xl:hidden p-3 text-[#073E62] bg-gray-50 rounded-full hover:bg-gray-100 transition-all border border-gray-200"
             >
               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-[85%] md:w-[450px] bg-white z-[210] flex flex-col p-10 shadow-[-20px_0_50px_rgba(0,0,0,0.2)]"
            >
              <div className="flex justify-between items-center mb-20">
                 <div className="relative w-40 h-10">
                    <Image 
                      src="/muvalogo.png" 
                      alt="MUVA Industries Logo" 
                      fill
                      className="object-contain object-left"
                    />
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#DA222A]">
                    <X className="w-7 h-7" />
                 </button>
              </div>

              <div className="space-y-12">
                 {MUVA_NAV.map((nav, i) => (
                   <Link 
                     key={i}
                     href={nav.href} 
                     onClick={() => setIsMobileMenuOpen(false)}
                     className="text-[#073E62] text-4xl font-black uppercase tracking-tighter hover:text-[#DA222A] transition-colors block"
                   >
                     {nav.name}
                   </Link>
                 ))}
              </div>

              <div className="mt-auto pt-10 border-t border-gray-100">
                 <button 
                   onClick={() => setIsMobileMenuOpen(false)}
                   className="w-full py-5 bg-[#073E62] text-white text-xs font-black uppercase tracking-[.4em] italic rounded-lg shadow-xl"
                 >
                    Consult Our Engineers
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
