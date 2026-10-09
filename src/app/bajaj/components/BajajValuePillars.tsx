"use client";

import React from 'react';
import Image from 'next/image';
import { Star, TrendingUp, Gauge, ShieldCheck } from 'lucide-react';

export default function BajajValuePillars() {
  return (
    <section className="relative py-4 lg:py-24 overflow-hidden bg-[#0A5181]">
      {/* ═══ TECHNICAL BLUEPRINT BACKGROUND ═══ */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
         <Image 
           src="/bajaj_tech_blueprint.png" 
           alt="Technical Blueprint" 
           fill 
           sizes="100vw"
           className="object-cover object-center" 
         />
      </div>
      <div className="absolute inset-0 bg-[#0A5181]/80 backdrop-blur-[2px] z-10" />

      <div className="max-w-[1700px] mx-auto px-4 md:px-12 lg:px-24 relative z-20">
        <div className="grid grid-cols-4 gap-2 md:gap-12">
          {[
            { titleShort: "Legacy", title: "3-Wheeler Legacy", sub: "1.5M+ Units", icon: Star },
            { titleShort: "Strength", title: "Industrial Strength", sub: "Heavy-Duty Chassis", icon: TrendingUp },
            { titleShort: "Braking", title: "Hydraulic Braking", icon: Gauge, sub: "Road Safety" },
            { titleShort: "Service", title: "5-Star Service Hub", sub: "Namkum Mega-Plant", icon: ShieldCheck }
          ].map((pillar, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4 text-white group text-center md:text-left">
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#DA222A] group-hover:rotate-[360deg] transition-all duration-700 border border-white/5">
                <pillar.icon className="w-5 h-5 md:w-7 h-7 text-white" />
              </div>
              <div>
                <h4 className="text-[8px] md:text-[14px] font-black uppercase tracking-[0.1em] md:tracking-widest leading-tight">
                  <span className="md:hidden">{pillar.titleShort}</span>
                  <span className="hidden md:block">{pillar.title}</span>
                </h4>
                <p className="hidden md:block text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none mt-2">{pillar.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
