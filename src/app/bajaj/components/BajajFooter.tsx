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
  Video
} from 'lucide-react';

const BajajFooter = () => {
  return (
    <footer className="relative bg-[#073E62] text-white pt-28 pb-12 overflow-hidden border-t-8 border-[#DA222A]">

      {/* ═══ ARCHITECTURAL BACKGROUND ELEMENTS ═══ */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/[0.03] skew-x-[-20deg] translate-x-1/2 pointer-events-none" />
      <div className="absolute top-0 left-0 text-[15vw] font-black text-white/[0.02] select-none pointer-events-none leading-none -mt-10 -ml-10">
        PREMSONS BAJAJ
      </div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">

        {/* TOP TIER: STRATEGIC LINKS & BRANDING */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24 pb-20 border-b border-white/5">

          {/* Brand Manifesto */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <Link href="/bajaj" className="inline-block relative">
                <div className="relative w-48 h-12 mb-4">
                  <Image
                    src="/bajajlogo.png"
                    alt="Premsons Bajaj Logo"
                    fill
                    sizes="(max-width: 768px) 192px, 256px"
                    className="object-contain"
                  />
                </div>
                <div className="text-[10px] font-black tracking-[.6em] text-white/50 mt-2 uppercase">Authorized 3-Wheeler Hub — Wings of Jharkhand</div>
              </Link>
              <p className="text-white/60 text-lg font-medium italic leading-relaxed max-w-lg">
                Empowering the entrepreneurs of Jharkhand with Bajaj's legendary 3-wheeler fuel efficiency and structural durability since 2019.
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
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Support</p>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest">Mega Service Hub</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Ecosystem Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">

            <div className="space-y-8">
              <h4 className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.4em]">The Range</h4>
              <ul className="space-y-4">
                {['RE Passenger', 'Maxima Cargo', 'Compact Diesel', 'Mega Smart', 'Electric Autos'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/60 text-sm font-medium hover:text-[#DA222A] transition-colors flex items-center gap-2 group italic">
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.4em]">Ownership</h4>
              <ul className="space-y-4">
                {['Service Booking', 'Bajaj Finance', 'Warranty Desk', 'Bulk Inquiry', 'Permit Support'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/60 text-sm font-medium hover:text-[#DA222A] transition-colors flex items-center gap-2 group italic">
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8 col-span-2 md:col-span-1">
              <h4 className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.4em]">Main Center</h4>
              <div className="space-y-6">
                <div className="flex gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[#DA222A]" />
                  </div>
                  <p className="text-white/60 text-xs font-medium leading-relaxed italic">
                    Mahatma Gandhi Main Rd, near Sujata Chowk,<br />
                    opp. Ranchi Club Complex, Hindpiri,<br />
                    Ranchi, Jharkhand - 834001
                  </p>
                </div>
                <div className="flex gap-4 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-[#DA222A]" />
                  </div>
                  <p className="text-white/60 text-xs font-medium leading-relaxed italic">
                    Ranchi HQ: +91 94711 95711<br />
                    Tupudana: +91 92644 47809
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM TIER: COMPLIANCE & LEGAL */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-[.3em] text-white/30">
          <div className="flex items-center gap-8">
            <p>© 2026 Premsons Bajaj. Part of Babulal Premsons Group.</p>
            <div className="hidden lg:block w-px h-4 bg-white/5" />
            <Link href="#" className="hover:text-white transition-colors">Business Compliance</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Shield</Link>
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

export default BajajFooter;
