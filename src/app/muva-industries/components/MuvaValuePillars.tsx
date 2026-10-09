"use client";

import React from 'react';
import { Target, ShieldCheck, Zap, Cog, Cpu, Microscope, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MuvaValuePillars() {
  return (
    <section className="py-32 lg:py-48 bg-white overflow-hidden relative">
      {/* ═══ ARCHITECTURAL OVERLAYS ═══ */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #073E62 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      
      {/* Ghosted Branding Watermark */}
      <div className="absolute top-20 -right-20 text-[25vw] font-black text-gray-100/40 select-none pointer-events-none rotate-12">
        MUVA
      </div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-24 items-start mb-40 relative">
           {/* Technical vertical line */}
           <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gray-100 hidden lg:block" />
           <div className="lg:col-span-12 max-w-4xl">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-1 bg-[#DA222A]" />
                 <span className="text-[#073E62] text-[11px] font-black uppercase tracking-[.6em]">Our Engineering Philosophy</span>
              </div>
              <h2 
                className="text-[#073E62] font-black uppercase tracking-tighter leading-[0.85] mb-12"
                style={{ fontSize: 'clamp(2rem, 5vw, 6rem)' }}
              >
                 Precision <br /><span className="text-[#DA222A] italic">Without Compromise.</span>
              </h2>
              <p className="text-gray-400 text-xl font-medium italic max-w-2xl leading-relaxed border-l-2 border-gray-100 pl-10">
                MUVA Industries operates at the intersection of traditional engineering and Industry 4.0 technical innovation. We don&apos;t just manufacture; we engineer reliability.
              </p>
           </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {[
            { 
              title: "Micron Level Accuracy", 
              desc: "State-of-the-art diagnostic tools ensuring tolerances of 0.01mm across all production lines.",
              icon: Microscope 
            },
            { 
              title: "Advanced Fabrication", 
              desc: "Specialized in sub-system components and heavy industrial machinery parts.",
              icon: Layers 
            },
            { 
              title: "Digital Integration", 
              desc: "Cloud-monitored manufacturing processes for real-time quality assurance of every component.",
              icon: Cpu 
            },
            { 
              title: "Legacy Mastery", 
              desc: "Rooted in 100+ years of BBP Group engineering excellence and manufacturing heritage.",
              icon: Cog 
            }
          ].map((pillar, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-50 border border-gray-100 p-10 hover:bg-[#073E62] transition-all duration-700 group flex flex-col h-[340px]"
            >
               <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:bg-[#DA222A] transition-all mb-12">
                  <pillar.icon className="w-8 h-8 text-[#073E62] group-hover:text-white transition-all" />
               </div>
               
               <div>
                  <h3 className="text-[#073E62] group-hover:text-white text-2xl font-black uppercase tracking-tighter mb-4 transition-all">{pillar.title}</h3>
                  <p className="text-gray-400 group-hover:text-white/40 text-sm font-medium italic leading-relaxed transition-all">{pillar.desc}</p>
               </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
