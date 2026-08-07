"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Shield, ArrowRight } from 'lucide-react';
import { BUSINESS_VERTICALS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVerticalsOpen, setIsVerticalsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-[background-color,padding,border-color,box-shadow] duration-500 ease-in-out",
      isMobileMenuOpen 
        ? "bg-[#0A5181] py-1" 
        : isScrolled 
          ? "bg-white shadow-sm border-b border-primary/10 py-1" 
          : "bg-black/20 backdrop-blur-md py-2.5"
    )}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-6">

        {/* ── LOGO ── */}
        <Link href="/" className="shrink-0 group">
          <div className={cn(
            "relative transition-all duration-700",
            isScrolled ? "w-64 h-16 lg:w-[350px] lg:h-[84px]" : "w-60 h-14 lg:w-[320px] lg:h-[80px]"
          )}>
            <Image
              src="/babulal_premsons.avif"
              alt="Babulal Premsons Group"
              fill
              sizes="(max-width: 1024px) 320px, 400px"
              className={cn(
                "object-contain object-left transition-all duration-700",
                // At top or when menu is open: invert to white
                (!isScrolled || isMobileMenuOpen) && "brightness-0 invert drop-shadow-[0_0_18px_rgba(255,255,255,0.35)]"
              )}
              priority
              loading="eager"
            />
          </div>
        </Link>

        {/* ── DESKTOP NAV ── */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">

          <Link href="/about#legacy" className={cn(
            "text-[11px] font-bold uppercase tracking-[.2em] transition-colors duration-300",
            isScrolled ? "text-primary/75 hover:text-primary" : "text-white/80 hover:text-white"
          )}>
            Our Legacy
          </Link>
          <Link href="/about#philosophy" className={cn(
            "text-[11px] font-bold uppercase tracking-[.2em] transition-colors duration-300",
            isScrolled ? "text-primary/75 hover:text-primary" : "text-white/80 hover:text-white"
          )}>
            Leadership
          </Link>

          {/* VERTICALS DROPDOWN */}
          <div
            className="relative"
            onMouseEnter={() => setIsVerticalsOpen(true)}
            onMouseLeave={() => setIsVerticalsOpen(false)}
          >
            <button className={cn(
              "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.2em] transition-colors duration-300",
              isScrolled
                ? isVerticalsOpen ? "text-primary" : "text-primary/55 hover:text-primary"
                : isVerticalsOpen ? "text-white"  : "text-white/60 hover:text-white"
            )}>
              Businesses
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-400", isVerticalsOpen && "rotate-180")} />
            </button>

            <div className={cn(
              "absolute top-full left-1/2 -translate-x-1/2 pt-6 transition-all duration-300 origin-top",
              isVerticalsOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            )}>
              {/* arrow tip */}
              <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45" />
              <div className="bg-primary shadow-[0_30px_70px_rgba(0,0,0,0.5)] p-8 w-[400px] grid grid-cols-2 gap-x-6 gap-y-5 relative">
                {Object.values(BUSINESS_VERTICALS).map((v) => (
                  <Link
                    key={v.id}
                    href={`/${v.slug}`}
                    className="group/item flex flex-col gap-0.5 pb-3 border-b border-white/[0.06] hover:border-accent/30 transition-colors"
                  >
                    <span className="text-[9px] font-black uppercase tracking-[.3em] text-white/30 group-hover/item:text-accent transition-colors">{v.industry}</span>
                    <span className="text-sm font-bold text-white/75 group-hover/item:text-white group-hover/item:translate-x-0.5 transition-all duration-200">{v.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/contact" className={cn(
            "text-[11px] font-bold uppercase tracking-[.2em] transition-colors duration-300",
            isScrolled ? "text-primary/75 hover:text-primary" : "text-white/80 hover:text-white"
          )}>
            Contact
          </Link>
        </nav>

        {/* ── RIGHT SIDE ── */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/admin" className={cn(
            "transition-colors",
            isScrolled ? "text-primary/30 hover:text-primary/60" : "text-white/30 hover:text-white/60"
          )}>
            <Shield className="w-4 h-4" />
          </Link>

          {/* CTA — always accent red */}
          <Link
            href="/contact"
            className={cn(
              "text-white text-[10px] font-black uppercase tracking-[.25em] px-6 py-3 transition-all shadow-lg",
              isScrolled
                ? "bg-accent hover:bg-accent/90 shadow-accent/20"
                : "bg-accent/90 backdrop-blur-sm hover:bg-accent shadow-accent/30 border border-accent/50"
            )}
          >
            Enquire Now
          </Link>
        </div>

        {/* ── MOBILE TOGGLE ── */}
        <button
          className={cn("lg:hidden p-1 transition-colors", isScrolled ? "text-primary" : "text-white")}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* subtle accent pulse bar — only visible at top */}
      {!isScrolled && (
        <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-accent/40 to-transparent animate-shimmer" />
        </div>
      )}

      {/* ── MOBILE FULLSCREEN (ZERO LAG) ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-0 bg-[#0A5181] z-[70] flex flex-col"
          >
            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="relative w-40 h-10">
                <Image
                  src="/babulal_premsons.avif"
                  alt="Babulal Premsons Group"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="flex flex-col p-8 overflow-y-auto">
              {[
                { label: 'Our Legacy', href: '/about#legacy' },
                { label: 'Businesses', href: '/#divisions' },
                { label: 'Leadership', href: '/about#philosophy' },
                { label: 'Contact Us', href: '/contact' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                >
                  <Link
                    href={item.href}
                    className="group flex items-center justify-between py-6 border-b border-white/[0.05]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-xl font-bold text-white uppercase tracking-tighter group-active:text-accent group-active:translate-x-2 transition-all">{item.label}</span>
                    <ChevronDown className="w-5 h-5 text-accent -rotate-90" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto p-8 border-t border-white/10 space-y-4">
              <div className="text-[10px] font-black uppercase text-accent tracking-[0.4em] mb-4">Enterprise Hub</div>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-3 bg-[#DA222A] text-white py-5 rounded-sm font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-transform"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Enquire Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
