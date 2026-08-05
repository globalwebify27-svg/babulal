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
  Menu,
  X,
  Settings,
  Calendar,
  Zap,
  Navigation,
  AlertCircle,
  Mail,
  MessageCircle
} from 'lucide-react';

const HONDA_NAV = [
  { name: "Scooters", href: "#scooters" },
  { name: "Motorcycles", href: "#motorcycles" },
  { name: "BigWing", href: "#bigwing" },
  { name: "Service", href: "#service" },
  { name: "Spares", href: "#spares" },
  { name: "Showrooms", href: "#showrooms" },
];

interface HondaHeaderProps {
  onTestRideClick: () => void;
}

const HondaHeader = ({ onTestRideClick }: HondaHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-[100] group">
      
      {/* ═══ TOP TECHNICAL RIBBON (CORPORATE BLUE) ═══ */}
      {!isScrolled && (
        <div className="bg-[#0A5181] text-[10px] font-black uppercase tracking-[.4em] text-white px-6 md:px-12 h-8 flex justify-start items-center transition-all duration-300">
          <div className="flex gap-8 items-center">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-3 h-3 text-[#DA222A]" /> Honda Authorized
            </span>
            <span className="hidden lg:flex items-center gap-2">
              <Zap className="w-3 h-3 text-[#DA222A]" /> Wings of Jharkhand
            </span>
          </div>
        </div>
      )}

      {/* ═══ PRIMARY NAVIGATION (WHITE - PREMIUM) ═══ */}
      <div className={`transition-all duration-500 bg-white border-b border-gray-100 ${isScrolled ? 'py-1 shadow-xl' : 'py-2'}`}>
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* Logo Integration (Clean on White) */}
          <Link href="/honda" className="flex items-center gap-4 group/logo">
            <div className={`relative transition-all duration-500 ${isScrolled ? 'w-[180px] h-10' : 'w-[240px] h-14'}`}>
               <Image 
                src="/permsonsHonda.jpg" 
                alt="Premsons Honda" 
                fill 
                sizes="(max-width: 768px) 200px, 350px"
                className="object-contain" 
                priority
               />
            </div>
          </Link>

          {/* Desktop Nav Engine (Blue/Red Protocol) */}
          <nav className="hidden lg:flex items-center gap-10">
            {HONDA_NAV.map((nav) => (
              <Link 
                key={nav.name} 
                href={nav.href} 
                className="text-[#073E62] text-[11px] font-black uppercase tracking-[.25em] hover:text-[#DA222A] transition-all relative group/item"
              >
                {nav.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#DA222A] transition-all duration-500 group-hover/item:w-full" />
              </Link>
            ))}
          </nav>

          {/* Institutional Actions */}
          <div className="flex items-center gap-6">
             <div className="hidden xl:flex items-center gap-6 text-[#073E62]/40">
                <Search className="w-5 h-5 hover:text-[#DA222A] cursor-pointer" />
                <Navigation className="w-5 h-5 hover:text-[#DA222A] cursor-pointer" />
             </div>
             
             <button 
               onClick={onTestRideClick}
               className="hidden sm:flex items-center gap-3 px-6 py-2 bg-[#0A5181] text-white text-[10px] font-black uppercase tracking-[.3em] hover:bg-[#DA222A] transition-all shadow-lg rounded-sm italic"
             >
                <Calendar className="w-4 h-4" /> TEST RIDE
             </button>

             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="lg:hidden p-3 text-[#0A5181] bg-gray-50 rounded-full hover:bg-gray-100 transition-all border border-gray-200"
             >
               {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </div>

      {/* ═══ MOBILE DRAWER ENGINE ═══ */}
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
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] md:w-[450px] bg-white z-[210] flex flex-col p-8 shadow-[-20px_0_50px_rgba(0,0,0,0.2)]"
            >
              <div className="flex justify-between items-center mb-16">
                 <div className="relative w-48 h-12">
                   <Image src="/permsonsHonda.jpg" alt="Premsons Honda" fill className="object-contain" />
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#DA222A] border border-gray-100">
                    <X className="w-7 h-7" />
                 </button>
              </div>

              <div className="space-y-10">
                 {HONDA_NAV.map((nav, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.1 }}
                   >
                     <Link 
                       href={nav.href} 
                       onClick={() => setIsMobileMenuOpen(false)}
                       className="text-[#073E62] text-4xl font-black uppercase tracking-tighter hover:text-[#DA222A] transition-colors flex items-center justify-between group"
                     >
                       {nav.name}
                       <ChevronDown className="w-6 h-6 text-gray-200 group-hover:text-[#DA222A] -rotate-90" />
                     </Link>
                   </motion.div>
                 ))}
              </div>

              <div className="mt-auto space-y-8 pt-12 border-t border-gray-100">
                 <div className="flex gap-6">
                    <Link href="#" className="w-14 h-14 rounded-full bg-[#0A5181] flex items-center justify-center text-white hover:bg-[#DA222A] transition-all">
                       <Phone className="w-6 h-6" />
                    </Link>
                    <Link href="#" className="w-14 h-14 rounded-full bg-[#0A5181] flex items-center justify-center text-white hover:bg-[#DA222A] transition-all">
                       <Mail className="w-6 h-6" />
                    </Link>
                    <Link href="#" className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-[#DA222A] transition-all">
                       <MessageCircle className="w-6 h-6" />
                    </Link>
                 </div>
                 <p className="text-gray-300 text-[10px] font-bold uppercase tracking-[.4em]">Premsons Honda — The Power of Dreams</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HondaHeader;
