"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronRight, Cpu, Settings, Zap } from 'lucide-react';
import Link from 'next/link';

export default function MuvaHero() {
  return (
    <section className="relative h-[100vh] min-h-[850px] flex items-center bg-[#073E62] overflow-hidden pt-24 lg:pt-32">
      
      {/* ═══ PRE-PAGE LOADING REVEAL ═══ */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        transition={{ duration: 1, delay: 0.5, ease: [0.77, 0, 0.175, 1] }}
        className="absolute inset-0 bg-[#DA222A] z-[70] origin-top"
      />

      {/* ═══ INDUSTRIAL MANUFACTURING BACKDROP ═══ */}
      <motion.div 
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image 
          src="/vertical_manufacturing.png" 
          alt="MUVA Industries - Precision Manufacturing Hub" 
          fill 
          sizes="100vw"
          className="object-cover object-center grayscale opacity-40 scale-105"
          priority
        />
        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#073E62] via-[#073E62]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#073E62] via-transparent to-transparent z-10" />
      </motion.div>

      {/* ═══ TECHNICAL DECOR — GRID SYSTEM ═══ */}
      <div className="absolute inset-0 z-[5] pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20" />
         <div className="absolute bottom-40 right-24 w-px h-full bg-white/10" />
         <div className="absolute top-1/4 left-1/4 w-80 h-80 border border-white/5 rounded-full flex items-center justify-center">
            <div className="w-40 h-40 border border-white/5 rounded-full animate-spin-slow" />
         </div>
      </div>

      <div className="relative z-20 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 w-full">
         <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-8">
               <motion.div
                 initial={{ opacity: 0, x: -50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 1, duration: 1 }}
                 className="flex items-center gap-4"
               >
                  <div className="w-8 h-[1px] bg-[#DA222A]" />
                  <span className="text-white/60 text-[9px] font-black uppercase tracking-[.6em]">ISO 9001:2015 ACCREDITED</span>
               </motion.div>

               <div className="relative">
                  <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-white font-black uppercase tracking-tighter leading-[0.9] pt-2"
                    style={{ fontSize: 'clamp(2rem, 5vw, 6rem)' }}
                  >
                     PRECISION <br />
                     <span className="text-[#DA222A] italic">CRAFTED.</span> <br />
                     LABORATORY SCALE.
                  </motion.h1>
               </div>

               <motion.p
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1.8, duration: 1 }}
                 className="text-white/70 text-base font-medium italic border-l-2 border-[#DA222A] pl-8 max-w-xl leading-relaxed"
               >
                  Defining the future of precision manufacturing in Jharkhand backed by over 100 years of group legacy. Our multi-vertical facility integrates advanced robotics with legacy craftsmanship.
               </motion.p>

               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 2.1, duration: 0.8 }}
                 className="flex flex-wrap gap-6 items-center"
               >
                  <Link 
                    href="/contact"
                    className="group relative px-8 py-4 bg-[#DA222A] text-white text-[10px] font-black uppercase tracking-[.4em] italic shadow-[0_15px_30px_-10px_rgba(218,34,42,0.3)] overflow-hidden"
                  >
                     <span className="relative z-10 flex items-center gap-4">
                        REQUEST BLUEPRINT <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     </span>
                     <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>

                  <Link href="#tech" className="flex items-center gap-3 text-white/50 hover:text-white font-black uppercase tracking-widest text-[9px] group transition-all">
                     Technical Capabilities
                     <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#073E62] transition-all">
                        <ChevronRight className="w-3 h-3" />
                      </div>
                  </Link>
               </motion.div>
            </div>

            {/* Right Side Technical Stats (Desktop) */}
            <div className="hidden lg:col-span-4 lg:flex flex-col gap-4">
               {[
                 { label: 'Tolerance level', val: '0.01mm', detail: 'Micron-Level Precision' },
                 { label: 'Facility Area', val: '50K+', detail: 'Sq. Ft. Production Floor' }
               ].map((stat, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.3 + (i * 0.2), duration: 0.8 }}
                    className="group bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 relative overflow-hidden flex items-center justify-between hover:border-[#DA222A]/50 transition-all duration-700"
                 >
                    <div className="relative z-10">
                       <div className="text-[#DA222A] text-[9px] font-black uppercase tracking-[.3em] mb-1">{stat.label}</div>
                       <div className="text-white text-3xl font-black italic tracking-tighter leading-none mb-1">{stat.val}</div>
                       <div className="text-white/40 text-[8px] font-bold uppercase tracking-widest">{stat.detail}</div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-0 group-hover:opacity-10 group-hover:translate-x-4 transition-all duration-700">
                       <Cpu className="w-20 h-20 text-white" />
                    </div>
                    <div className="absolute left-0 top-0 h-full w-[1.5px] bg-[#DA222A] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                 </motion.div>
               ))}
            </div>

         </div>
      </div>

      {/* ═══ SCROLL INDICATOR ═══ */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 opacity-40 z-30"
      >
        <div className="w-px h-20 bg-gradient-to-b from-white to-transparent" />
        <span className="text-[8px] font-black uppercase tracking-[.6em] text-white/60">Industrial Flow</span>
      </motion.div>

    </section>
  );
}
