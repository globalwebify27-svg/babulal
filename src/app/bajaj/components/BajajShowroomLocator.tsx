"use client";

import React from 'react';
import Image from 'next/image';
import { MapPin, Phone, MessageCircle, Navigation, Star, ArrowUpRight } from 'lucide-react';

const BAJAJ_LOCATIONS = [
   {
      city: "RANCHI MAIN HQ",
      type: "Flagship Experience Center",
      address: "Mahatma Gandhi Main Rd, near Sujata Chowk, opp. Ranchi Club Complex, Hindpiri, Ranchi, Jharkhand - 834001",
      phone: "+91 94711 95711"
   },
   {
      city: "TUPUDANA HUB",
      type: "Commercial Sales & Service",
      address: "Hatia Rd, Pugudu, Tupudana, Ranchi, Jharkhand - 834003",
      phone: "+91 92644 47809"
   },
   {
      city: "KHUNTI REGIONAL",
      type: "District Sales & Service Point",
      address: "Piratoli, Main Rd, Mishra Colony, Khunti, Jharkhand - 835210",
      phone: "+91 92644 43102"
   }
];

interface BajajShowroomLocatorProps {
   onTestRideClick: () => void;
}

export default function BajajShowroomLocator({ onTestRideClick }: BajajShowroomLocatorProps) {
   return (
      <section id="showrooms" className="relative bg-white pt-16 lg:pt-32 pb-16 overflow-hidden">

         <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">

            {/* ═══ HEADER: MINIMALIST & BOLD ═══ */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-24 gap-8 border-b-2 border-gray-100 pb-12">
               <div className="max-w-2xl">
                  <span className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.6em] mb-4 block">Dealer Network</span>
                  <h2 className="text-[#073E62] text-5xl lg:text-8xl font-black tracking-tighter leading-none lowercase">
                     visit our <span className="text-[#DA222A]">hubs.</span>
                  </h2>
               </div>
               <button
                  onClick={onTestRideClick}
                  className="flex items-center gap-4 text-[#073E62] hover:text-[#DA222A] transition-colors group"
               >
                  <span className="text-[10px] font-black uppercase tracking-[.4em]">View on Map</span>
                  <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#DA222A] transition-all">
                     <ArrowUpRight className="w-5 h-5" />
                  </div>
               </button>
            </div>

            {/* ═══ SPLIT LAYOUT: LIST VS IMAGE ═══ */}
            <div className="flex flex-col xl:flex-row gap-12 lg:gap-20">

               {/* LEFT: INTERACTIVE HUB LIST */}
               <div className="flex-1 space-y-4">
                  {BAJAJ_LOCATIONS.map((loc, i) => (
                     <div key={i} className="group flex items-center justify-between p-6 lg:p-10 bg-gray-50 hover:bg-[#073E62] transition-all duration-500 rounded-2xl cursor-pointer">
                        <div className="flex gap-4 lg:gap-8 items-start">
                           <div className="text-gray-200 group-hover:text-white/10 text-2xl lg:text-4xl font-black italic tracking-tighter transition-colors">0{i + 1}</div>
                           <div>
                              <h4 className="text-[#073E62] group-hover:text-white text-lg lg:text-2xl font-black tracking-tighter mb-1 transition-colors">{loc.city}</h4>
                              <p className="text-gray-400 group-hover:text-[#DA222A] text-[9px] lg:text-[10px] font-black uppercase tracking-widest mb-4 transition-colors">{loc.type}</p>
                              <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <div className="text-white/60 text-xs font-medium italic flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-[#DA222A]" /> {loc.address}
                                 </div>
                                 <div className="text-white text-xs font-black tracking-widest flex items-center gap-2">
                                    <Phone className="w-3 h-3 text-[#DA222A]" /> {loc.phone}
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                           <Navigation className="w-5 h-5 text-[#073E62]" />
                        </div>
                     </div>
                  ))}
               </div>

               {/* RIGHT: SHOWROOM AMBIENCE IMAGE */}
               <div className="flex-1 relative">
                  <div className="relative aspect-[3/2] sm:aspect-[16/10] xl:aspect-square rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(7,62,98,0.3)] bg-gray-100">
                     <Image
                        src="/BajajShowroom.jpg"
                        alt="Premsons Bajaj HQ"
                        fill
                        sizes="(max-width: 1280px) 100vw, 50vw"
                        className="object-contain"
                        priority
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#073E62]/90 via-[#073E62]/40 to-transparent" />

                     <div className="absolute top-4 right-4 md:top-10 md:right-10 flex flex-col items-end gap-2">
                        <div className="bg-[#073E62]/90 backdrop-blur-md px-4 py-2 md:px-8 md:py-3.5 rounded-full border border-white/20 text-white shadow-2xl text-[8px] md:text-[10px] font-black tracking-[0.4em] uppercase flex items-center gap-2 md:gap-3">
                           <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#DA222A] rounded-full animate-pulse shadow-[0_0_10px_#DA222A]" />
                           Live in Ranchi
                        </div>
                     </div>

                     <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 max-w-[85%] md:max-w-sm">
                        <h3 className="text-white text-2xl md:text-4xl font-black tracking-tighter leading-none mb-3 md:mb-4 drop-shadow-2xl">
                           The Ultimate <br />Bajaj Experience.
                        </h3>
                        <p className="text-white/80 text-[11px] md:text-sm italic font-medium leading-relaxed drop-shadow-lg">
                           Visit our flagship centers for specialized technical consulting and spot-financing tools.
                        </p>
                     </div>
                  </div>
               </div>

            </div>

         </div>

         {/* Tonal transition to footer */}
         <div className="h-32 w-full bg-gradient-to-b from-white to-gray-50" />
      </section>
   );
}
