"use client";

import React from 'react';
import Image from 'next/image';
import { MapPin, ArrowUpRight, Navigation, Phone, Clock } from 'lucide-react';

const TRUCKING_STORES = [
  { city: "Ranchi HQ", address: "7CJ7+JJP, NH 20, Rampur, Ganrke, Jharkhand - 834010", type: "Sales, Service & Spares" }
];

interface TruckingShowroomLocatorProps {
  onTestRideClick: () => void;
}

export default function TruckingShowroomLocator({ onTestRideClick }: TruckingShowroomLocatorProps) {
  return (
    <section className="py-32 lg:py-48 bg-[#073E62] relative overflow-hidden">
      {/* ═══ GEOMETRIC WATERMARK ═══ */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='10' cy='10' r='1' fill='white' opacity='0.5'/%3E%3Ccircle cx='50' cy='30' r='0.8' fill='white' opacity='0.4'/%3E%3Ccircle cx='80' cy='70' r='1.2' fill='white' opacity='0.3'/%3E%3Ccircle cx='30' cy='80' r='0.6' fill='white' opacity='0.5'/%3E%3Ccircle cx='70' cy='15' r='0.9' fill='white' opacity='0.4'/%3E%3C/svg%3E\")"} } />
      
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-16 xl:px-24 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-10 xl:gap-24 items-center">
           <div className="lg:col-span-5 xl:col-span-4 space-y-12">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-1 bg-[#DA222A]" />
                 <span className="text-white text-[11px] font-black uppercase tracking-[.6em]">Ranchi Showroom</span>
              </div>
              <h2 className="text-white text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tighter italic leading-[0.85]">
                 Flagship <br /><span className="text-[#DA222A]">Facility.</span>
              </h2>
              <p className="text-white/40 text-lg font-medium italic border-l-2 border-white/10 pl-8 max-w-sm">
                Our state-of-the-art facility in Ranchi provides commercial transport sales, clinical servicing, and genuine parts.
              </p>
              <button 
                onClick={onTestRideClick}
                className="group flex items-center gap-6 bg-[#DA222A] px-10 py-5 rounded-sm hover:bg-white transition-all shadow-2xl"
              >
                 <span className="text-white group-hover:text-[#073E62] text-xs font-black uppercase tracking-[.4em] italic">Get Directions</span>
                 <Navigation className="w-5 h-5 text-white group-hover:text-[#073E62]" />
              </button>
           </div>

           <div className="lg:col-span-7 xl:col-span-8 grid md:grid-cols-2 gap-8">
              {TRUCKING_STORES.map((store, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 p-10 rounded-2xl group hover:bg-[#DA222A] transition-all duration-700 relative overflow-hidden">
                   {/* Strategic Glass Overlay for Hover */}
                   <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-10">
                         <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <MapPin className="w-6 h-6 text-white" />
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-widest text-[#DA222A] group-hover:text-white italic">{store.type}</span>
                      </div>
                      <h4 className="text-white text-3xl font-black italic tracking-tighter mb-4 transition-colors">{store.city}</h4>
                      <p className="text-white/40 group-hover:text-white/80 text-sm font-medium italic mb-10 leading-relaxed transition-colors">{store.address}</p>
                      <div className="flex items-center gap-4 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                         Navigate Hub <ArrowUpRight className="w-4 h-4" />
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </section>
  );
}
