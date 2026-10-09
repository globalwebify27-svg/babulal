"use client";

import React from 'react';
import { Star, TrendingUp, Gauge, ShieldCheck } from 'lucide-react';

export default function HondaValuePillars() {
  return (
    <section className="bg-[#0A5181] py-8 md:py-12 border-b border-white/10">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { title: "No. 1 in Jharkhand", sub: "Largest Honda Network", icon: Star },
            { title: "Verified Excellence", sub: "HMSI Performance Winner", icon: TrendingUp },
            { title: "Express Service", sub: "60-Min Quick Turnaround", icon: Gauge },
            { title: "Genuine Spares", sub: "100% Honda Authorised", icon: ShieldCheck }
          ].map((pillar, i) => (
            <div key={i} className="flex items-center gap-4 text-white group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#DA222A] transition-colors">
                <pillar.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h4 className="text-[10px] md:text-[13px] font-black uppercase tracking-widest">{pillar.title}</h4>
                <p className="text-white/40 text-[8px] md:text-[9px] font-bold uppercase tracking-widest mt-1">{pillar.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
