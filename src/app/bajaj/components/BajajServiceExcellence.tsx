"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Settings, Wrench, ShieldCheck, Clock, Zap, CheckCircle2 } from 'lucide-react';

const PROTOCOLS = [
  {
    title: "MEGA-HUB CAPACITY",
    desc: "Our Namkum Industrial Hub features 20+ service bays for zero-wait technical support.",
    icon: Settings
  },
  {
    title: "GENUINE SPARES ONLY",
    desc: "100% replacement guarantee with official Bajaj Auto-rickshaw parts.",
    icon: ShieldCheck
  },
  {
    title: "DTS-i EXPERTS",
    desc: "Certified engineers specialized in Digital Twin Spark engine optimization.",
    icon: Wrench
  },
  {
    title: "EXPRESS LOGISTICS",
    desc: "Minimized downtime with ready-stock conversion kits and major components.",
    icon: Zap
  }
];

export default function BajajServiceExcellence() {
  return (
    <section id="service" className="relative py-16 lg:py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
           
           {/* LEFT: THE VISUAL HUB */}
           <div className="flex-1 relative group">
              <div className="relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white">
                 <Image 
                   src="/bajaj_service_hub.png" 
                   alt="Bajaj Service Excellence" 
                   fill 
                   sizes="(max-width: 1024px) 100vw, 50vw"
                   className="object-cover group-hover:scale-105 transition-transform duration-1000" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#073E62]/60 to-transparent" />
                 
                 {/* Floating Technician Badge */}
                 <div className="absolute bottom-10 left-10 bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-gray-100">
                    <div className="w-12 h-12 rounded-full bg-[#DA222A] flex items-center justify-center text-white">
                       <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                       <div className="text-[#073E62] text-sm font-black uppercase tracking-widest leading-none mb-1">Certified Staff</div>
                       <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Bajaj Authorized</div>
                    </div>
                 </div>
              </div>
              
              {/* Technical Detail Card */}
              <div className="absolute -top-10 -right-10 bg-[#0A5181] p-10 rounded-3xl shadow-2xl hidden xl:block animate-pulse">
                 <Clock className="w-8 h-8 text-white mb-4" />
                 <div className="text-white text-xl font-black italic tracking-tighter">4500 KM</div>
                 <div className="text-white/40 text-[9px] font-bold uppercase tracking-[0.3em]">SERVICE CYCLE</div>
              </div>
           </div>

          {/* RIGHT: THE PROTOCOLS */}
           <div className="flex-1 space-y-8 lg:space-y-12">
              <div>
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-[2px] bg-[#DA222A]" />
                    <span className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.6em]">Service Science</span>
                 </div>
                 <h2 className="text-[#073E62] text-5xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-8">
                    Maximum Uptime. <br /><span className="text-gray-400">Zero Compromise.</span>
                 </h2>
                 <p className="text-gray-500 text-base md:text-xl font-medium italic leading-relaxed max-w-xl">
                    Our technical infrastructure is designed for the commercial operator. We understand that every hour in the shed is an hour of lost revenue.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {PROTOCOLS.map((p, i) => (
                   <div key={i} className="bg-white p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#DA222A]/20 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-[#DA222A] mb-6 group-hover:bg-[#DA222A] group-hover:text-white transition-all">
                         <p.icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-[#073E62] text-[12px] font-black uppercase tracking-widest mb-3">{p.title}</h4>
                      <p className="text-gray-500 text-[11px] leading-relaxed font-medium uppercase opacity-60">
                         {p.desc}
                      </p>
                   </div>
                 ))}
              </div>

              <button className="flex items-center gap-6 group">
                 <div className="w-16 h-16 rounded-full bg-[#0A5181] flex items-center justify-center text-white group-hover:bg-[#DA222A] transition-all">
                    <Zap className="w-8 h-8" />
                 </div>
                 <div className="text-left">
                    <div className="text-[#073E62] text-sm font-black uppercase tracking-widest mb-1 group-hover:text-[#DA222A] transition-all">Book Express Service</div>
                    <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Guaranteed 24-Hour Turnaround</div>
                 </div>
              </button>
           </div>

        </div>
      </div>
    </section>
  );
}
