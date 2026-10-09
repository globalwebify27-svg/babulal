"use client";

import React from 'react';
import Image from 'next/image';
import { Settings, Shield, Zap, ChevronRight } from 'lucide-react';

export default function HondaServiceExcellence() {
  return (
    <section className="relative py-32 bg-white overflow-hidden">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 grid lg:grid-cols-2 gap-20 items-center">
         <div className="relative aspect-[16/10] lg:aspect-square overflow-hidden rounded-3xl shadow-2xl group">
           <Image src="/honda_service.png" alt="Honda Service Center" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
           <div className="absolute inset-0 bg-[#0A5181]/20 mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity" />
         </div>

         <div>
            <span className="text-[#DA222A] text-[10px] font-black uppercase tracking-[.6em] mb-6 block">Service Protocol</span>
            <h2 className="text-[#0A5181] text-5xl lg:text-7xl font-black tracking-tighter leading-none mb-10">Clinical <br />Precision.</h2>
            <div className="space-y-8">
              {[
                { title: "Authorised H-Service", desc: "Equipped with the latest Honda-diagnostic tools for pinpoint accuracy.", icon: Settings },
                { title: "Genuine Spares Hub", sub: "Only 100% genuine Honda parts used to ensure vehicle longevity.", icon: Shield },
                { title: "Express 60-Min Servicing", sub: "Zero compromise on quality with rapid turnaround times.", icon: Zap }
              ].map((item, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 group-hover:bg-[#DA222A] transition-colors">
                    <item.icon className="w-8 h-8 text-[#0A5181] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                     <h4 className="text-gray-900 text-xl font-black uppercase tracking-tight mb-2">{item.title}</h4>
                     <p className="text-gray-500 font-medium italic leading-relaxed">{item.desc || item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-16 px-12 py-5 bg-[#0A5181] text-white text-[10px] font-black uppercase tracking-[.4em] hover:bg-[#DA222A] transition-all flex items-center gap-4">
              BOOK YOUR APPOINTMENT <ChevronRight className="w-4 h-4" />
            </button>
         </div>
      </div>
    </section>
  );
}
