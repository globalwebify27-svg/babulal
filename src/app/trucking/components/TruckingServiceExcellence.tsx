"use client";

import React from 'react';
import { Settings, Hammer, Clock, ShieldCheck, Zap, Cog } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TruckingServiceExcellence() {
  return (
    <section className="py-32 lg:py-48 bg-gray-50 overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">
        
        <div className="text-center max-w-4xl mx-auto mb-32 space-y-8">
           <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-1 bg-[#DA222A]" />
              <span className="text-[#073E62] text-[11px] font-black uppercase tracking-[.6em]">Aftersales Ecosystem</span>
           </div>
           <h2 className="text-[#073E62] text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85]">
              Precision <br /><span className="text-[#DA222A] italic">Engineering Lab.</span>
           </h2>
           <p className="text-gray-400 text-lg font-medium italic max-w-2xl mx-auto">
             Commercial vehicles demand clinical reliability. Our specialized service centers are equipped with advanced diagnostic labs and certified technicians to minimize downtime.
           </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { 
              title: "Clinical Diagnostics", 
              desc: "Digital engine mapping and structural integrity screening for maximized vehicle life.",
              icon: Settings 
            },
            { 
              title: "i-Alert Monitoring", 
              desc: "Proactive telematics support to ensure fleet health is tracked in real-time.",
              icon: Zap 
            },
            { 
              title: "Authorized Spares", 
              desc: "100% Genuine parts inventory for optimal performance.",
              icon: ShieldCheck 
            }
          ].map((item, i) => (
            <div key={i} className="bg-white p-12 rounded-3xl border border-gray-100 shadow-xl hover:-translate-y-4 transition-all duration-500 group">
               <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#DA222A] transition-colors">
                  <item.icon className="w-8 h-8 text-[#073E62] group-hover:text-white transition-colors" />
               </div>
               <h3 className="text-[#073E62] text-xl font-black uppercase tracking-tighter mb-6">{item.title}</h3>
               <p className="text-gray-400 text-sm font-medium italic leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
