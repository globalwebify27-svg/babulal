"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, History, TrendingUp, Globe } from 'lucide-react';

export default function TruckingLegacy() {
  return (
    <section className="py-32 lg:py-48 bg-white overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">
        
        {/* CHAPTER 1: THE ACCELERATION */}
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-40">
           <div className="space-y-12">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-1 bg-[#DA222A]" />
                 <span className="text-[#073E62] text-[11px] font-black uppercase tracking-[.6em]">The 2017 Milestone</span>
              </div>
              <h2 className="text-[#073E62] text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">
                 Building the <br /><span className="text-[#DA222A]">Commercial Backbone.</span>
              </h2>
              <p className="text-gray-500 text-xl md:text-2xl font-medium italic border-l-8 border-[#DA222A]/10 pl-10 max-w-xl leading-relaxed">
                Established in 2017, Premsons & Poddar Trucking rapidly ascended to become the No. 1 dealer in Jharkhand, redefining the M & HCV dealership experience.
              </p>
              
              <div className="grid grid-cols-2 gap-12 pt-8">
                 <div className="space-y-4">
                    <div className="flex items-center gap-4 text-[#DA222A]">
                       <Award className="w-8 h-8" />
                       <span className="text-4xl font-black italic tracking-tighter">DEBUT #1</span>
                    </div>
                    <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Best Debuted Dealer in India</div>
                 </div>
                 <div className="space-y-4">
                     <div className="flex items-center gap-4 text-[#073E62]">
                        <Globe className="w-8 h-8" />
                        <span className="text-4xl font-black italic tracking-tighter">Ranchi</span>
                     </div>
                     <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Flagship Facility</div>
                 </div>
              </div>
           </div>

           <div className="relative group">
              <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                 <Image 
                   src="/vertical_trucks.png" 
                   alt="Trucking Legacy" 
                   fill 
                   className="object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                 />
                 <div className="absolute inset-0 bg-[#073E62]/20 mix-blend-multiply" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#073E62]/60 to-transparent" />
              </div>
              {/* Floating Floating Info */}
              <div className="absolute -bottom-12 xl:-right-12 bg-[#073E62] p-12 rounded-2xl shadow-2xl hidden md:block border-4 border-white">
                 <TrendingUp className="w-12 h-12 text-[#DA222A] mb-4" />
                 <div className="text-white text-lg font-black uppercase tracking-widest italic">Industry Dominance</div>
                 <div className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-2">Setting National Benchmarks</div>
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
