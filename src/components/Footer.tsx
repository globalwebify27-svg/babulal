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

const DEFAULT_TEXTILE_CATEGORIES = [
  { name: 'Saree', href: '/textiles/category/sarees' },
  { name: 'Lehenga', href: '/textiles/category/lehnga' },
  { name: 'Suits', href: '/textiles/category/suits' },
  { name: 'Kurti', href: '/textiles/category/kurtis' },
  { name: "Women's Western Wear", href: '/textiles/category/womens-western-wear' },
  { name: 'Kids Collection', href: '/textiles/category/kids-wear' },
  { name: "Men's Wear", href: '/textiles/category/mens-wear' },
  { name: 'Luggages', href: '/textiles/category/luggages' }
];

const Footer = ({ categoriesProp }: { categoriesProp?: any[] }) => {
  const [categories, setCategories] = React.useState(DEFAULT_TEXTILE_CATEGORIES);

  React.useEffect(() => {
    if (categoriesProp && categoriesProp.length > 0) {
      setCategories(categoriesProp.map((c: any) => ({
        name: c.name,
        href: `/textiles/category/${c.slug}`
      })));
      return;
    }

    async function fetchCategories() {
      try {
        const res = await fetch('/api/admin/categories?vertical=textiles');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data.map((c: any) => ({
              name: c.name,
              href: `/textiles/category/${c.slug}`
            })));
          }
        }
      } catch (err) {
        // Fallback to default textile categories
      }
    }
    fetchCategories();
  }, [categoriesProp]);

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
                alt="Babulal Premkumar"
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
              <Link href="tel:+917667985545" className="text-white text-xl md:text-2xl lg:text-3xl font-black italic tracking-tighter block group-hover:text-[#DA222A] transition-colors">
                +91 76679 85545
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
                { name: 'Premkumar Textiles' },
                { name: 'Premsons Honda' },
                { name: 'Premsons & Poddar Trucking' },
                { name: 'Premsons Bajaj' },
                { name: 'MUVA Industries' }
              ].map((unit) => (
                <div key={unit.name} className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-3">
                  {unit.name}
                </div>
              ))}
            </div>
          </div>

          {/* Textile Navigation */}
          <div className="space-y-6 lg:space-y-8 text-center sm:text-left">
            <h4 className="text-white text-[11px] lg:text-[12px] font-black uppercase tracking-[0.4em]">Textile Boutique</h4>
            <div className="flex flex-col gap-3 lg:gap-4">
              {categories.map((item) => (
                <Link key={item.name} href={item.href} className="text-white/40 text-xs md:text-sm font-medium italic hover:text-[#DA222A] transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Corporate Hub */}
          <div className="space-y-6 lg:space-y-8 text-center sm:text-left">
            <h4 className="text-white text-[11px] lg:text-[12px] font-black uppercase tracking-[0.4em]">Corporate Hub</h4>
            <div className="flex flex-col gap-3 lg:gap-4">
              {[
                { name: 'About Group Legacy', href: '/about', isLink: true },
                { name: 'Contact & Support', href: '/contact', isLink: true },
                { name: 'Premsons Honda', isLink: false },
                { name: 'Trucking Logistics', isLink: false },
                { name: 'Premsons Bajaj', isLink: false },
                { name: 'MUVA Industries', isLink: false }
              ].map((link) => (
                link.isLink ? (
                  <Link key={link.name} href={link.href!} className="text-white/40 text-xs md:text-sm font-medium italic hover:text-[#DA222A] transition-colors">
                    {link.name}
                  </Link>
                ) : (
                  <div key={link.name} className="text-white/40 text-xs md:text-sm font-medium italic">
                    {link.name}
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Global HQ */}
          <div className="space-y-8 text-center sm:text-left">
            <div className="space-y-6">
              <h4 className="text-white text-[11px] lg:text-[12px] font-black uppercase tracking-[0.4em]">Global H.Q.</h4>
              <a 
                href="https://maps.google.com/?q=Babulal+Premkumar+Building+Upper+Bazar+Ranchi+Jharkhand+834001" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-white/40 hover:text-white group transition-colors"
              >
                <MapPin className="w-5 h-5 group-hover:text-[#DA222A] transition-colors shrink-0 sm:mt-1" />
                <p className="text-xs md:text-sm font-medium italic leading-relaxed">
                  Babulal Premkumar Building,<br />
                  Upper Bazar, Ranchi,<br />
                  Jharkhand - 834001, India
                </p>
              </a>
            </div>

            <div className="flex gap-4 pt-6 md:pt-4 border-t border-white/5 justify-center sm:justify-start">
              {[
                { Icon: Globe, href: '/textiles', label: 'Website' },
                { Icon: Mail, href: 'mailto:contact@babulalpremsons.com', label: 'Email' },
                { Icon: MessageCircle, href: 'https://wa.me/917667985545?text=Hello', label: 'WhatsApp', external: true },
                { Icon: Send, href: '/contact', label: 'Enquiry' }
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  title={item.label}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center text-white/40 hover:bg-[#DA222A] hover:text-white transition-all duration-500 shadow-xl border border-white/10"
                >
                  <item.Icon className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM TIER: COMPLIANCE & LEGAL */}
        <div className="pt-8 md:pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-white/30 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-center w-full justify-between">
            <p>© 2026 Babulal Premkumar. All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-white transition-colors">Compliance Protocols</Link>
              <Link href="/about" className="hover:text-white transition-colors">Privacy Shield</Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
