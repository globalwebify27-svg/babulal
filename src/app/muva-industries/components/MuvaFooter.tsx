"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Settings,
  ShieldCheck,
  Cpu,
  ChevronRight
} from 'lucide-react';

export default function MuvaFooter() {
  return (
    <footer className="bg-[#073E62] text-white pt-32 pb-12 overflow-hidden border-t-8 border-[#DA222A] relative">
      
      {/* ═══ INDUSTRIAL LOGO WATERMARK ═══ */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/[0.01] skew-x-[-15deg] translate-x-1/4 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[60vw] h-[60vw] opacity-[0.02] select-none pointer-events-none -mt-20 -ml-20 grayscale brightness-200">
         <Image 
            src="/muvalogo.png" 
            alt="MUVA Watermark" 
            fill 
            className="object-contain"
         />
      </div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24 pb-20 border-b border-white/5">
          <div className="lg:col-span-5 space-y-12">
            <div>
               <div className="relative w-64 h-16 mb-6">
                  <Image 
                    src="/muvalogo.png" 
                    alt="MUVA Industries Logo" 
                    fill 
                    className="object-contain object-left brightness-0 invert"
                  />
               </div>
               <p className="text-white/50 text-base font-medium italic leading-relaxed max-w-md">
                 Engineering reliability and precision across Jharkhand with over 100 years of group legacy. A specialized manufacturing vertical of the Babulal Premsons Group.
               </p>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-12">
             <div className="space-y-10">
                <h4 className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.4em]">Expertise</h4>
                <ul className="space-y-5">
                  {['CNC Component Hub', 'Custom Fabrications', 'Machinery Spares', 'Structural Systems', 'Precision Die-Casting'].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-white/40 text-[11px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-3 group">
                        <ChevronRight className="w-3 h-3 text-[#DA222A]" /> {item}
                      </Link>
                    </li>
                  ))}
                </ul>
             </div>

             <div className="space-y-10">
                <h4 className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.4em]">Trust</h4>
                <div className="flex flex-col gap-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#DA222A]">
                         <ShieldCheck className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60 leading-tight">ISO 9001:2015 <br />Certified Hub</span>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-[#DA222A]">
                         <Cpu className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/60 leading-tight">Industry 4.0 <br />Infrastructure</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-10 pt-12 text-[10px] font-bold text-white/20 uppercase tracking-[.4em]">
           <p>© 2026 MUVA INDUSTRIES. A BABULAL PREMSONS UNIT.</p>
           <div className="flex gap-8">
              <Link href="#" className="hover:text-white transition-colors">Safety Code</Link>
              <Link href="#" className="hover:text-white transition-colors">Quality Manual</Link>
              <Link href="#" className="hover:text-white transition-colors">Technical T&C</Link>
           </div>
        </div>

      </div>
    </footer>
  );
}
