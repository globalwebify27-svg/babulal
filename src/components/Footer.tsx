"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Send,
  MessageCircle
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#073E62] pt-24 pb-12 overflow-hidden border-t-8 border-[#DA222A]">
      {/* ═══ INSTITUTIONAL WATERMARK ═══ */}
      <div className="absolute top-0 right-0 text-[30vw] md:text-[20vw] font-black text-white/[0.03] select-none pointer-events-none leading-none -mt-12 overflow-hidden">
        BBP
      </div>
      <div className="absolute bottom-10 left-0 text-[15vw] md:text-[10vw] font-black text-white/[0.02] select-none pointer-events-none leading-none mb-12 ml-6 md:ml-12 overflow-hidden">
        100+ YEARS
      </div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">

        {/* TOP TIER: BRAND & GLOBAL ACTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-16 lg:mb-24 border-b border-white/5 pb-16">
          <div className="w-full lg:max-w-xl text-center lg:text-left">
            <div className="relative w-full max-w-[300px] h-24 lg:max-w-[450px] lg:h-[140px] mb-8 mx-auto lg:mx-0">
              <Image
                src="/babulal_premsons.avif"
                alt="Babulal Premsons Group"
                fill
                sizes="(max-width: 1024px) 300px, 450px"
                className="object-contain object-center lg:object-left brightness-0 invert"
                priority
                loading="eager"
              />
            </div>
            <p className="text-white/40 text-base md:text-lg font-medium italic leading-relaxed max-w-md mx-auto lg:mx-0">
              The Ultimate House of Brands — A Diversified Industrial Legacy Engineering Success Across Five Generations For Over 100 Years.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-6 lg:gap-12">
            <div className="w-full sm:w-auto bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 group hover:border-[#DA222A] transition-all duration-500 text-center sm:text-left">
              <p className="text-[#DA222A] text-[10px] font-black uppercase tracking-[0.3em] mb-4">Institutional Desk</p>
              <Link href="tel:+916512207555" className="text-white text-xl md:text-2xl lg:text-3xl font-black italic tracking-tighter block group-hover:text-[#DA222A] transition-colors">
                +91 651 220 7555
              </Link>
            </div>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 bg-[#DA222A] text-white text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-[#073E62] transition-all duration-500 rounded-sm flex items-center justify-center shadow-2xl"
            >
              Strategic Enquiry
            </Link>
          </div>
        </div>

        {/* MIDDLE TIER: THE LINK ECOSYSTEM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 mb-16 lg:mb-24 px-2 lg:px-0">

          {/* Vertical Portfolio */}
          <div className="space-y-6 lg:space-y-8 text-center sm:text-left">
            <h4 className="text-white text-[11px] lg:text-[12px] font-black uppercase tracking-[0.4em]">Business Units</h4>
            <div className="flex flex-col gap-3 lg:gap-4">
              {[
                { name: 'Premkumar Textiles', slug: 'textiles' },
                { name: 'Premsons Honda', slug: 'honda' },
                { name: 'Premsons & Poddar Trucking', slug: 'trucking' },
                { name: 'Premsons Bajaj', slug: 'bajaj' },
                { name: 'MUVA Industries', slug: 'muva-industries' }
              ].map((unit) => (
                <Link key={unit.name} href={`/${unit.slug}`} className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-widest hover:text-[#DA222A] transition-all flex items-center justify-center sm:justify-start gap-3 group">
                  <span className="hidden sm:block w-0 group-hover:w-4 h-[2px] bg-[#DA222A] transition-all" />
                  {unit.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Textile Navigation */}
          <div className="space-y-6 lg:space-y-8 text-center sm:text-left">
            <h4 className="text-white text-[11px] lg:text-[12px] font-black uppercase tracking-[0.4em]">Textile Boutique</h4>
            <div className="flex flex-col gap-3 lg:gap-4">
              {['Elite Sarees', 'Designer Suits', 'Luxury Kurtis', 'Kids Collection', 'Retail Hub'].map((cat) => (
                <Link key={cat} href="#" className="text-white/40 text-xs md:text-sm font-medium italic hover:text-[#DA222A] transition-colors">
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Corporate Hub */}
          <div className="space-y-6 lg:space-y-8 text-center sm:text-left">
            <h4 className="text-white text-[11px] lg:text-[12px] font-black uppercase tracking-[0.4em]">Corporate Hub</h4>
            <div className="flex flex-col gap-3 lg:gap-4">
              {['Our Legacy', 'Technical Specs', 'Quality Protocols', 'Global Logistics', 'Career Pipeline'].map((link) => (
                <Link key={link} href="#" className="text-white/40 text-xs md:text-sm font-medium italic hover:text-[#DA222A] transition-colors">
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Global HQ */}
          <div className="space-y-8 text-center sm:text-left">
            <div className="space-y-6">
              <h4 className="text-white text-[11px] lg:text-[12px] font-black uppercase tracking-[0.4em]">Global H.Q.</h4>
              <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-white/40 group">
                <MapPin className="w-5 h-5 group-hover:text-[#DA222A] transition-colors shrink-0 sm:mt-1" />
                <p className="text-xs md:text-sm font-medium italic leading-relaxed">
                  Babulal Premkumar Building,<br />
                  Upper Bazar, Ranchi,<br />
                  Jharkhand - 834001, India
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-6 md:pt-4 border-t border-white/5 justify-center sm:justify-start">
              {[Globe, Mail, MessageCircle, Send].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-[#DA222A] hover:text-white transition-all duration-500 shadow-xl border border-white/10">
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM TIER: COMPLIANCE & LEGAL */}
        <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-white/30 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-center">
            <p>© 2026 Babulal Premsons Group. All Rights Reserved.</p>
            <div className="hidden md:block w-px h-4 bg-white/10" />
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Compliance Protocols</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacy Shield</Link>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 pt-6 md:pt-0 w-full md:w-auto justify-center">
            <span className="text-[#DA222A] text-[8px] md:text-[9px] font-black uppercase tracking-[0.6em] border-r border-white/10 pr-4">Institutional Red</span>
            <span className="text-[#0A5181] text-[8px] md:text-[9px] font-black uppercase tracking-[0.6em]">Corporate Blue</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
