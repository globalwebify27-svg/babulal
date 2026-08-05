"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  Phone,
  Menu,
  X,
  Calendar,
  Zap,
  Navigation,
  AlertCircle,
  Mail,
  MessageCircle
} from 'lucide-react';

const BAJAJ_NAV = [
  { name: "RE Passenger", href: "#passenger" },
  { name: "Maxima Cargo", href: "#cargo" },
  { name: "Electric", href: "#electric" },
  { name: "Service", href: "#service" },
  { name: "Spares", href: "#spares" },
  { name: "Showrooms", href: "#showrooms" },
];

interface BajajHeaderProps {
  onTestRideClick: () => void;
}

const BajajHeader = ({ onTestRideClick }: BajajHeaderProps) => {
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
        <div className="bg-[#0A5181] text-[8px] md:text-[10px] font-black uppercase tracking-[.2em] md:tracking-[.4em] text-white px-6 md:px-12 h-6 md:h-8 flex justify-start items-center transition-all duration-300">
          <div className="flex gap-4 md:gap-8 items-center">
            <span className="flex items-center gap-2">
              <AlertCircle className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#DA222A]" /> Bajaj Authorized
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <Zap className="w-3 h-3 text-[#DA222A]" /> No. 1 in Jharkhand
            </span>
          </div>
        </div>
      )}

      {/* ═══ PRIMARY NAVIGATION (WHITE - PREMIUM) ═══ */}
      <div className={`transition-all duration-500 bg-white border-b border-gray-100 ${isScrolled ? 'py-1 shadow-xl' : 'py-2'}`}>
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 flex items-center justify-between">

          <Link href="/bajaj" className="flex items-center gap-4 group/logo">
            <div className={`relative transition-all duration-500 flex items-center gap-3 ${isScrolled ? 'h-10' : 'h-14'}`}>
              <div className="relative h-full aspect-[4/1]">
                <Image
                  src="/bajajlogo.png"
                  alt="Premsons Bajaj Logo"
                  fill
                  sizes="(max-width: 768px) 160px, 200px"
                  className="object-contain"
                  priority
                />
              </div>
              {/* <div className="hidden sm:block border-l-2 border-gray-100 pl-4">
                  <div className="text-[#073E62] font-black text-sm italic tracking-tighter leading-none">PREMSONS <span className="text-[#DA222A]">BAJAJ</span></div>
                  <div className="text-[7px] font-bold uppercase tracking-[0.3em] opacity-40 mt-1">3-Wheeler Division</div>
               </div> */}
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {BAJAJ_NAV.map((nav) => (
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

          {/* Actions */}
          <div className="flex items-center gap-6">
            <button
              onClick={onTestRideClick}
              className="hidden sm:flex items-center gap-3 px-6 py-2 bg-[#0A5181] text-white text-[10px] font-black uppercase tracking-[.3em] hover:bg-[#DA222A] transition-all shadow-lg rounded-sm italic"
            >
              <Navigation className="w-4 h-4" /> STORE LOCATOR
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
              className="fixed right-0 top-0 bottom-0 w-[85%] md:w-[450px] bg-white z-[210] flex flex-col p-8 shadow-[-20px_0_50px_rgba(0,0,0,0.2)]"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-3">
                  <div className="relative w-24 h-8">
                    <Image
                      src="/bajajlogo.png"
                      alt="Premsons Bajaj Logo"
                      fill
                      sizes="150px"
                      className="object-contain"
                    />
                  </div>
                  <div className="text-[#073E62] font-black text-xl italic tracking-tighter border-l-2 border-gray-100 pl-3">PREMSONS <span className="text-[#DA222A]">BAJAJ</span></div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#DA222A]">
                  <X className="w-7 h-7" />
                </button>
              </div>

              <div className="space-y-10">
                {BAJAJ_NAV.map((nav, i) => (
                  <Link
                    key={i}
                    href={nav.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-[#073E62] text-3xl font-black uppercase tracking-tighter hover:text-[#DA222A] transition-colors block"
                  >
                    {nav.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default BajajHeader;
