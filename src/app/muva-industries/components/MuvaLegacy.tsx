"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Shield, Target, History, Award } from 'lucide-react';

export default function MuvaLegacy() {
  return (
    <section className="py-32 lg:py-48 bg-[#073E62] relative overflow-hidden">
      {/* ═══ GEOMETRIC ARCHITECTURAL GRID ═══ */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-32 items-center">
           
           <div className="space-y-16">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-1 bg-[#DA222A]" />
                 <span className="text-white text-[11px] font-black uppercase tracking-[.6em]">The Engineering Soul</span>
              </div>
              
              <h2 
                className="text-white font-black uppercase tracking-tighter leading-[0.85] italic"
                style={{ fontSize: 'clamp(2rem, 5vw, 6rem)' }}
              >
                 Built on <br /><span className="text-[#DA222A]">Titanium Roots.</span>
              </h2>

              <div className="space-y-12">
                 <p className="text-white/60 text-xl font-medium italic border-l-4 border-[#DA222A] pl-10 max-w-xl leading-relaxed">
                   MUVA Industries Limited is the leading manufacturer of MonoBlock Concrete Sleepers since 1988. We are the largest PSC Railway Sleeper manufacturer in Jharkhand. Apart from Railways, the company supplies to other big houses such as – Rites Limited, NTPC Limited, Bokaro Steel Plant, Durgapur Steel Plant, Electro Steels Limited, ARSS Infrastructure Projects Ltd, Sonar Bangla Cement Plant.
                 </p>
                 
                 <div className="grid md:grid-cols-2 gap-12 pt-8">
                    <div className="space-y-4">
                       <Award className="w-8 h-8 text-[#DA222A]" />
                       <h4 className="text-white text-lg font-black uppercase tracking-tighter">100+ Years</h4>
                       <p className="text-white/40 text-xs font-medium italic leading-relaxed">Of relentless precision in a changing industrial landscape.</p>
                    </div>
                    <div className="space-y-4">
                       <Shield className="w-8 h-8 text-[#DA222A]" />
                       <h4 className="text-white text-lg font-black uppercase tracking-tighter">Quality First</h4>
                       <p className="text-white/40 text-xs font-medium italic leading-relaxed">Adhering to clinical manufacturing standards since inception.</p>
                    </div>
                 </div>
              </div>
           </div>

            <div className="relative h-[550px] md:h-[700px] group overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-white/10">
               {/* ═══ CINEMATIC BACKGROUND ═══ */}
               <Image 
                 src="/vertical_manufacturing.png" 
                 alt="MUVA Legacy" 
                 fill 
                 className="object-cover grayscale opacity-30 group-hover:opacity-60 transition-all duration-[2000ms] group-hover:scale-110" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#073E62] via-transparent to-transparent opacity-90" />
               
               {/* ═══ TECHNICAL CALLOUTS (The "X-Ray" Effect) ═══ */}
               <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="absolute top-1/3 left-1/4"
                  >
                     <div className="w-24 h-[1px] bg-white/20 -rotate-45 origin-left" />
                     <div className="text-[7px] font-black uppercase tracking-[.4em] text-white/40 mt-1">Core_Engineered://Tolerances</div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute bottom-1/2 right-1/3"
                  >
                     <div className="w-32 h-[1px] bg-[#DA222A]/40 rotate-12 origin-right" />
                     <div className="text-[7px] font-black uppercase tracking-[.4em] text-[#DA222A] mt-1 text-right">Structural_Integrity://Certified</div>
                  </motion.div>
               </div>

               {/* ═══ GLASS DATA PLATE ═══ */}
               <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 z-20 backdrop-blur-2xl bg-white/[0.03] border border-white/10 p-6 md:p-12 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl transition-all duration-700 group-hover:-translate-y-4">
                  <div className="flex justify-between items-start mb-6 md:mb-8">
                     <div>
                        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                           <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#DA222A] animate-pulse" />
                           <span className="text-white text-[7px] md:text-[9px] font-black uppercase tracking-[.3em] md:tracking-[.5em]">Live_Heritage_Stream</span>
                        </div>
                        <h3 className="text-white text-2xl md:text-4xl font-black uppercase tracking-tighter italic">
                           Ancestral <span className="text-[#DA222A]">DNA.</span>
                        </h3>
                     </div>
                     <div className="text-right hidden sm:block">
                        <div className="text-white/20 text-[6px] md:text-[7px] font-black uppercase tracking-[.4em]">Museum Grade</div>
                        <div className="text-white text-xl md:text-3xl font-black italic">#01</div>
                     </div>
                  </div>
                  
                  <p className="text-white/40 text-[9px] md:text-[11px] font-medium leading-relaxed italic border-l border-white/10 pl-4 md:pl-8 mb-6 md:mb-8">
                     Every micro-component sculpted within these walls is a manifestation of four decades of industrial evolution.
                  </p>
                  
                  <div className="flex items-center gap-6 md:gap-12 text-[7px] md:text-[8px] font-black uppercase tracking-[.2em] md:tracking-[.3em] text-[#DA222A]">
                     <div className="flex flex-col gap-0.5 md:gap-1">
                        <span className="text-white/20">ESTABLISHED</span>
                        <span>100_YEARS_LEGACY</span>
                     </div>
                     <div className="flex flex-col gap-0.5 md:gap-1">
                        <span className="text-white/20">PRECISION_REF</span>
                        <span>GRADE_A_ISO</span>
                     </div>
                  </div>
               </div>
            </div>

        </div>
      </div>
    </section>
  );
}
