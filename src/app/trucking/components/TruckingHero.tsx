"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowUpRight, Gauge, ShieldCheck, Zap, Truck } from 'lucide-react';

interface TruckingHeroProps {
  onTestRideClick: () => void;
}

export default function TruckingHero({ onTestRideClick }: TruckingHeroProps) {
  return (
    <section className="relative h-[100vh] min-h-[800px] flex items-center bg-[#073E62] overflow-hidden pt-32 lg:pt-40">
      
      {/* ═══ PRE-PAGE LOADING DELAYED REVEAL OVERLAY ═══ */}
      <motion.div 
        initial={{ y: 0 }}
        animate={{ y: '-100%' }}
        transition={{ duration: 1, delay: 0.5, ease: [0.77, 0, 0.175, 1] }}
        className="absolute inset-0 bg-[#DA222A] z-[70] origin-top"
      />

      {/* ═══ CINEMATIC TRUCKING BACKDROP (HIGH GAIN) ═══ */}
      <motion.div 
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image 
          src="/vertical_trucks.png" 
          alt="Premsons & Poddar Trucking Fleet" 
          fill 
          sizes="100vw"
          className="object-cover object-center scale-105"
          priority
        />
        {/* Architectural Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#073E62] via-[#073E62]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#073E62] via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-[#073E62]/20 mix-blend-multiply z-10" />
      </motion.div>

      {/* ═══ TECHNICAL DECOR — BLUEPRINT OVERLAY ═══ */}
      <div className="absolute inset-0 z-[5] pointer-events-none opacity-20">
         <div className="absolute top-0 left-0 w-full h-px bg-white/20" />
         <div className="absolute top-0 left-1/2 w-px h-full bg-white/10" />
         <div className="absolute bottom-40 right-24 w-80 h-80 border border-white/10 rounded-full animate-pulse" />
      </div>

      <div className="relative z-20 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 w-full">
         <div className="grid lg:grid-cols-12 gap-10 items-start lg:items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-12">
               <motion.div
                 initial={{ opacity: 0, x: -50 }}
                 animate={{ opacity: 1, x: 0 }}
                 transition={{ delay: 1, duration: 1 }}
                 className="flex items-center gap-6"
               >
                  <label className="bg-[#DA222A] text-white text-[10px] font-black uppercase tracking-[.5em] px-4 py-1">Authorized</label>
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-[.6em]">Commercial Vehicle & HCV Partner (since 2017)</span>
               </motion.div>

               <div className="relative">
                  {/* Subtle Background Watermark */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 2 }}
                    className="absolute -top-20 -left-10 text-[20vw] font-black text-white/[0.03] select-none pointer-events-none leading-none italic"
                  >
                    TRUCKING
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-white font-black uppercase tracking-tighter leading-[0.9] pt-4"
                    style={{ fontSize: 'clamp(3rem, 7vw, 9rem)' }}
                  >
                     ENGINEERING <br />
                     <span className="text-[#DA222A] italic relative">
                        THE POWER
                        <motion.span 
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 2, duration: 1.5 }}
                          className="absolute -bottom-2 left-0 w-full h-3 bg-[#DA222A]/20 origin-left"
                        />
                     </span>
                     <br /> OF SCALE.
                  </motion.h1>
               </div>

               <motion.p
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1.8, duration: 1 }}
                 className="text-white/70 text-lg md:text-xl font-medium italic border-l-4 border-[#DA222A] pl-10 max-w-2xl leading-relaxed"
               >
                  Redefining Jharkhand&apos;s commercial landscape with Jharkhand&apos;s No.1 M & HCV Dealership excellence. Delivering durability, efficiency, and scale since inception. 
               </motion.p>

               <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 2.1, duration: 0.8 }}
                 className="flex flex-wrap gap-8 items-center"
               >
                  <button 
                    onClick={onTestRideClick}
                    className="group relative px-12 py-6 bg-[#DA222A] text-white text-xs font-black uppercase tracking-[.4em] italic shadow-[0_20px_40px_-10px_rgba(218,34,42,0.4)] overflow-hidden"
                  >
                     <span className="relative z-10 flex items-center gap-4">
                        LOCATE TRUCK HUB <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                     </span>
                     <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <Link href="#fleet" className="flex items-center gap-4 text-white/50 hover:text-white font-black uppercase tracking-widest text-[10px] group transition-all">
                     View 2026 Fleet Range
                     <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#073E62] transition-all">
                        <ChevronRight className="w-4 h-4" />
                     </div>
                  </Link>
               </motion.div>
            </div>

            {/* Right Side Glassmorphic Feature Cards (Desktop) */}
            <div className="hidden lg:col-span-5 lg:flex flex-col gap-8">
               {[
                 { label: 'Payload Capacity', val: '55.0T', unit: 'Metric Tons', detail: 'Class-Leading Multi-Axle Power' },
                 { label: 'State Presence', val: '9+', unit: 'Strategic Hubs', detail: 'Dominating Jharkhand Highways' },
                 { label: 'Service Uptime', val: '24/7', unit: 'Support Lab', detail: 'High-Precision Diagnostics' }
               ].map((stat, i) => (
                 <motion.div 
                   key={i}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.3 + (i * 0.2), duration: 0.8 }}
                    className="group bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-10 relative overflow-hidden flex items-center justify-between hover:border-[#DA222A]/50 transition-all duration-700"
                 >
                    <div className="relative z-10">
                       <div className="text-[#DA222A] text-[10px] font-black uppercase tracking-[.3em] mb-2">{stat.label}</div>
                       <div className="text-white text-5xl font-black italic tracking-tighter leading-none mb-2">
                          {stat.val}<span className="text-[10px] font-bold text-white/30 ml-3 uppercase tracking-widest">{stat.unit}</span>
                       </div>
                       <div className="text-white/40 text-[9px] font-bold uppercase tracking-widest">{stat.detail}</div>
                    </div>
                    {/* Ghosted Stat Icon/Element */}
                    <div className="text-white/[0.02] text-8xl font-black group-hover:text-[#DA222A]/10 transition-colors pointer-events-none">
                       0{i+1}
                    </div>
                    <div className="absolute left-0 top-0 h-full w-[2px] bg-[#DA222A] scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
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
        <span className="text-[8px] font-black uppercase tracking-[.6em] text-white/60">Shift Down</span>
      </motion.div>

      {/* BOTTOM TRANSITION — RAW STEEL GRADIENT */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white via-white/40 to-transparent z-10" />
    </section>
  );
}
