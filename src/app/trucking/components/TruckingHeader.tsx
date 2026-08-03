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
  Navigation,
  AlertCircle,
  Zap,
  ShieldCheck,
  Truck
} from 'lucide-react';

const TRUCKING_NAV = [
  { name: "Heavy Duty", href: "#heavy" },
  { name: "Tipper Range", href: "#tippers" },
  { name: "Buses", href: "#buses" },
  { name: "ICV Range", href: "#icv" },
  { name: "Service & Spares", href: "#service" },
  { name: "Showrooms", href: "#showrooms" },
];

interface TruckingHeaderProps {
  onTestRideClick: () => void;
}

const TruckingHeader = ({ onTestRideClick }: TruckingHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-[100] group">
      
      {/* ═══ TOP STRATEGIC RIBBON (TRUCKING BLUE) ═══ */}
      {!isScrolled && (
        <div className="bg-[#073E62] text-[10px] font-black uppercase tracking-[.4em] text-white px-6 md:px-12 h-8 flex justify-between items-center transition-all duration-300">
          <div className="flex gap-8 items-center">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DA222A]" /> Premsons & Poddar Trucking Partner
            </span>
            <span className="hidden lg:flex items-center gap-2">
               <AlertCircle className="w-3.5 h-3.5 text-[#DA222A]" /> Best Debuted Dealer in India
            </span>
          </div>
          <div className="flex gap-6 items-center">
             <Link href="tel:+916512207555" className="hover:text-[#DA222A] transition-colors font-bold tracking-[.1em]">24/7 Support: +91 651 220 7555</Link>
          </div>
        </div>
      )}

      {/* ═══ PRIMARY NAVIGATION (INDUSTRIAL WHITE) ═══ */}
      <div className={`transition-all duration-500 bg-white border-b border-gray-100 ${isScrolled ? 'py-1 shadow-2xl' : 'py-3'}`}>
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 flex items-center justify-between">
          
          <Link href="/trucking" className="flex items-center gap-4 group/logo">
            <div className={`relative transition-all duration-500 flex items-center gap-4 ${isScrolled ? 'h-10 w-[180px]' : 'h-16 w-[240px]'}`}>
               <Image 
                  src="/poddarlogo.png" 
                  alt="Premsons & Poddar Trucking Logo" 
                  fill
                  sizes="(max-width: 768px) 180px, 240px"
                  className="object-contain object-left" 
                  priority 
               />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-10">
            {TRUCKING_NAV.map((nav) => (
              <Link 
                key={nav.name} 
                href={nav.href} 
                className="text-[#073E62] text-[11px] font-black uppercase tracking-[.3em] hover:text-[#DA222A] transition-all relative group/item"
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
               className="hidden sm:flex items-center gap-3 px-8 py-3 bg-[#0A5181] text-white text-[10px] font-black uppercase tracking-[.4em] hover:bg-[#DA222A] transition-all shadow-[0_10px_20px_-5px_rgba(7,62,98,0.3)] rounded-sm italic"
             >
                <Truck className="w-4 h-4" /> TRUCK LOCATOR
             </button>

             <button 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="xl:hidden p-3 text-[#0A5181] bg-gray-50 rounded-full hover:bg-gray-100 transition-all border border-gray-200"
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
                 <div className="relative w-48 h-12">
                    <Image 
                      src="/poddarlogo.png" 
                      alt="Premsons & Poddar Trucking Logo" 
                      fill
                      className="object-contain object-left"
                    />
                 </div>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#DA222A]">
                    <X className="w-7 h-7" />
                 </button>
              </div>

              <div className="space-y-12">
                 {TRUCKING_NAV.map((nav, i) => (
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
                   onClick={() => {
                     setIsMobileMenuOpen(false);
                     onTestRideClick();
                   }}
                   className="w-full py-5 bg-[#0A5181] text-white text-xs font-black uppercase tracking-[.4em] italic rounded-lg shadow-xl"
                 >
                    Locate Experience Center
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TruckingHeader;
