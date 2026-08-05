"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Clock,
  Settings,
  ChevronRight,
  Shield,
  Video,
  Navigation
} from 'lucide-react';

const HondaFooter = () => {
  return (
    <footer className="relative bg-[#073E62] text-white pt-28 pb-12 overflow-hidden border-t-8 border-[#DA222A]">
      
      {/* ═══ ARCHITECTURAL BACKGROUND ELEMENTS ═══ */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/[0.03] skew-x-[-20deg] translate-x-1/2 pointer-events-none" />
      <div className="absolute top-0 left-0 text-[15vw] font-black text-white/[0.02] select-none pointer-events-none leading-none -mt-10 -ml-10">
        POWER
      </div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* TOP TIER: STRATEGIC LINKS & BRANDING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24 pb-20 border-b border-white/5">
          
          {/* Brand Manifesto */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <Link href="/honda" className="inline-block relative">
                 <div className="relative w-[220px] h-16 bg-white rounded p-2 mb-4">
                    <Image src="/permsonsHonda.jpg" alt="Premsons Honda" fill className="object-contain" />
                 </div>
                 <div className="text-[10px] font-black tracking-[.6em] text-white/50 mt-2 uppercase">Authorised Dealer — Wings of Jharkhand</div>
              </Link>
              <p className="text-white/60 text-lg font-medium italic leading-relaxed max-w-lg">
                Delivering Japanese engineering excellence and clinical automotive service precision to Ranchi since 2002.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 items-center pt-8 border-t border-white/5">
               <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#DA222A] transition-colors">
                     <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Authenticity</p>
                     <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Genuine Spares</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#DA222A] transition-colors">
                     <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Precision</p>
                     <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">H-Diag Experts</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Quick Ecosystem Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            
            {/* Range Hub */}
            <div className="space-y-8">
              <h4 className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.4em]">The Range</h4>
              <ul className="space-y-4">
                {['Scooters', 'Motorcycles', 'BigWing', 'EV Segment', 'Pre-Owned'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/60 text-sm font-medium hover:text-[#DA222A] transition-colors flex items-center gap-2 group italic">
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Service Ops */}
            <div className="space-y-8">
              <h4 className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.4em]">Ownership</h4>
              <ul className="space-y-4">
                {['Service Booking', 'Honda Shield', 'AMC Plans', 'Finance Desk', 'Insurance'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/60 text-sm font-medium hover:text-[#DA222A] transition-colors flex items-center gap-2 group italic">
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div className="space-y-8 col-span-2 md:col-span-1">
              <h4 className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.4em]">Strategic HQ</h4>
              <div className="space-y-6">
                <div className="flex gap-4 group cursor-default">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-[#DA222A]" />
                   </div>
                   <p className="text-white/60 text-xs font-medium leading-relaxed italic">
                     Shanti Complex, Harmu Rd,<br />
                     Near Kishoreganj Chowk, Kumhartoli,<br />
                     Ranchi, Jharkhand - 834001
                   </p>
                </div>
                <div className="flex gap-4 group cursor-default">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-[#DA222A]" />
                   </div>
                    <p className="text-white/60 text-xs font-medium leading-relaxed italic">
                      Support:<br />
                      +91 97714 52801
                    </p>
                </div>
                <div className="flex gap-4 group cursor-default">
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-[#DA222A]" />
                   </div>
                   <p className="text-white/60 text-xs font-medium leading-relaxed italic">
                     Showroom Hours:<br />
                     Mon - Sat / 09:30 AM - 07:30 PM
                   </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM TIER: COMPLIANCE & LEGAL */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-[.3em] text-white/30">
           <div className="flex items-center gap-8">
              <p>© 2026 Premsons Honda. Part of Babulal Premsons Group.</p>
              <div className="hidden lg:block w-px h-4 bg-white/5" />
              <Link href="#" className="hover:text-white transition-colors">Consumer Rights</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
           </div>
           
           <div className="flex gap-6">
              {[Globe, MessageCircle, Video, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/30 hover:bg-[#DA222A] hover:text-white transition-all transform hover:-translate-y-1">
                   <Icon className="w-4 h-4" />
                </Link>
              ))}
           </div>
        </div>

      </div>
    </footer>
  );
};

export default HondaFooter;
