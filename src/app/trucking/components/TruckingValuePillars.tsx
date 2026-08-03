"use client";

import React from 'react';
import { ShieldCheck, Truck, Zap, Settings2 } from 'lucide-react';

export default function TruckingValuePillars() {
  return (
    <section className="py-24 bg-[#073E62] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='none'/%3E%3Crect width='1' height='1' fill='white' opacity='0.4'/%3E%3C/svg%3E\")"}} />
      
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { title: "M & HCV Expertise", sub: "Premsons Poddar Certified", icon: ShieldCheck },
            { title: "Statewide Network", sub: "9+ Strategic Hubs", icon: Truck },
            { title: "Express Uptime", sub: "Prioritized Service Bays", icon: Zap },
            { title: "Technical Mastery", sub: "Heavy-Duty DNA", icon: Settings2 }
          ].map((pillar, i) => (
            <div key={i} className="flex flex-col md:flex-row items-center md:items-start gap-6 group text-center md:text-left transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#DA222A] group-hover:border-[#DA222A] group-hover:rotate-12 transition-all duration-500">
                <pillar.icon className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h4 className="text-white text-[13px] font-black uppercase tracking-[.3em]">{pillar.title}</h4>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{pillar.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
