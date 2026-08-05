"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, Users, Globe, Factory, ArrowRight } from 'lucide-react';

export default function BajajLegacy() {
   return (
      <section className="relative py-16 lg:py-32 bg-white overflow-hidden">
         {/* Schematic Background Pattern */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#0A5181 1px, transparent 1px)', backgroundSize: '30px 30px' }}
         />

         <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">

            {/* CHAPTER 1: THE FOUNDATION */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-32 mb-20 lg:mb-40">
               <div className="flex-1 space-y-6 lg:space-y-10 order-2 lg:order-1">
                  <div className="inline-flex items-center gap-4">
                     <div className="w-12 h-1 bg-[#DA222A]" />
                     <span className="text-[#0A5181] text-[11px] font-black uppercase tracking-[.6em]">Heritage of Excellence</span>
                  </div>
                  <h2 className="text-[#0A5181] text-4xl sm:text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                     Empowering <br /><span className="text-[#DA222A]">Entrepreneurs.</span>
                  </h2>
                  <p className="text-gray-500 text-base md:text-xl lg:text-2xl font-medium italic leading-relaxed max-w-2xl border-l-4 lg:border-l-8 border-[#DA222A]/10 pl-6 lg:pl-8">
                      Backed by over 100 years of group legacy, Premsons Bajaj has been a premier authorized dealer of Bajaj Auto, providing thousands with the tools for last-mile logistics and passenger transport.
                  </p>

                  <div className="grid grid-cols-2 gap-8 pt-8">
                     <div>
                        <div className="text-[#DA222A] text-4xl font-black tracking-tighter mb-2">1.5M+</div>
                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Global Legacy</div>
                     </div>
                     <div>
                        <div className="text-[#0A5181] text-4xl font-black tracking-tighter mb-2">NO. 1</div>
                        <div className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Jharkhand Dealer</div>
                     </div>
                  </div>
               </div>

               <div className="flex-1 relative order-1 lg:order-2">
                  <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                     <Image
                        src="/bajaj_re_passenger.png"
                        alt="Bajaj Technical Engineering"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-tr from-[#073E62]/40 to-transparent" />
                  </div>
                  {/* Technical Floating Card */}
                  <div className="absolute -bottom-10 -left-10 bg-[#0A5181] p-10 rounded-2xl shadow-2xl hidden md:block border-4 border-white">
                     <Factory className="w-10 h-10 text-white mb-4" />
                     <div className="text-white text-sm font-black uppercase tracking-widest leading-none mb-1">Mega Hub</div>
                     <div className="text-white/40 text-[9px] font-bold uppercase tracking-widest">State-of-the-Art Operations</div>
                  </div>
               </div>
            </div>

            {/* CHAPTER 2: THE INDUSTRIAL SCALE */}
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-32">
               <div className="flex-1 relative w-full">
                  <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                     <Image
                        src="/bajaj_maxima_cargo.png"
                        alt="Industrial Scale"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                     />
                     <div className="absolute inset-0 bg-gradient-to-tr from-[#DA222A]/20 to-transparent" />
                  </div>
                  {/* Floating Stat Orbit */}
                  <div className="absolute -top-8 -right-4 lg:-top-12 lg:-right-12 w-32 h-32 lg:w-48 lg:h-48 bg-white rounded-full flex flex-col items-center justify-center shadow-2xl border-2 border-gray-100 hidden sm:flex">
                     <div className="text-[#DA222A] text-3xl lg:text-5xl font-black tracking-tighter leading-none">600</div>
                     <div className="text-gray-400 text-[8px] lg:text-[10px] font-black uppercase tracking-widest">KG Payload</div>
                  </div>
               </div>

               <div className="flex-1 space-y-6 lg:space-y-10">
                  <div className="inline-flex items-center gap-4">
                     <div className="w-12 h-1 bg-[#0A5181]" />
                     <span className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.6em]">Logistics Mastery</span>
                  </div>
                  <h2 className="text-[#0A5181] text-4xl sm:text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                     The Maxima <br /><span className="text-[#DA222A]">Dominance.</span>
                  </h2>
                  <p className="text-gray-500 text-base lg:text-xl font-medium italic leading-relaxed max-w-2xl">
                     Redefining the commercial landscapes of Ranchi and beyond. Our 3-wheelers are the backbone of local trade, offering unmatched torque and fuel savings.
                  </p>

                  <div className="space-y-6">
                     {['Digital Twin Spark Ignition (DTS-i)', 'Independent Trailing Arm Suspension', 'Hydraulic Expanding Drum Brakes'].map(tech => (
                        <div key={tech} className="flex items-center gap-6 group cursor-default">
                           <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-[#DA222A] group-hover:border-[#DA222A] transition-all">
                              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                           </div>
                           <span className="text-[#073E62] text-sm font-black uppercase tracking-widest">{tech}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

         </div>
      </section>
   );
}
