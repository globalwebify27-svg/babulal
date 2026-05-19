"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ArrowUpRight,
  ChevronRight,
  ShoppingBag,
  TrendingUp,
  Users,
  Globe,
  Star,
  Download,
  ChevronLeft,
  Video,
  Phone,
  Mail,
  MessageCircle,
  Award,
  Factory,
  ArrowRight,
  MapPin,
  X,
  Droplets,
  Layers,
  PackageCheck,
  CheckCircle2,
  Minimize,
  PenTool,
  Scissors,
  Shirt,
  ClipboardCheck,
  Flame,
  Box,
  Truck,
  Play,
} from 'lucide-react';
import TextileHeader from '@/components/TextileHeader';
import Footer from '@/components/Footer';
import InquiryForm from '@/components/InquiryForm';
import { Haptics } from '@/lib/haptics';

const HERO_SLIDES = [
  {
    title: "THE WORLD'S FINEST THREADS",
    subtitle: "The Ultimate House of Brands Under One Roof",
    img: "/textile_factory.png",
    accent: "A Legacy of 100+ Years"
  },
  {
    title: "WINGS OF JHARKHAND",
    subtitle: "Five Generations of Excellence Since 1917",
    img: "/bridal_luxury.png",
    accent: "Strategic Textile Leadership"
  },
];

const LATEST_COLLECTIONS = [
  { name: 'Royal Saree', price: 'Elite Brand Partner', img: '/silk_saree_royal.png' },
  { name: 'Bridal Lehenga', price: 'Excellence in Distribution', img: '/bridal_luxury.png' },
  { name: 'Luxury Saree', price: 'Multi-Decade Alliance', img: '/silk_saree_royal.png' },
  { name: 'Mens Wear', price: '25 Years of Association', img: '/mens_sherwani.png' },
  { name: 'Premium Fabric', price: 'Luxury Fabric Portfolio', img: '/textile_logistics.png' },
];

// ═══ TYPES ═══
interface Reel {
  id: string;
  title: string;
  category: string;
  img: string;
}

// ═══ COMPONENTS ═══
const ReelCard = ({ reel, index }: { reel: Reel, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className="group relative aspect-[9/16] bg-black rounded-[2rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/5"
    >
      <iframe
        src={`https://www.instagram.com/reel/${reel.id}/embed/`}
        className="w-full h-full border-none"
        allowFullScreen
        scrolling="no"
        loading="lazy"
      ></iframe>

      {/* Subtle Bottom Metadata Gradient (Non-interactive) */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none opacity-60" />

      {/* Decorative Brand Label */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
        <span className="text-[#DA222A] text-[8px] font-black uppercase tracking-[0.3em] drop-shadow-lg">{reel.category}</span>
        <h4 className="text-white text-sm font-bold uppercase tracking-tighter leading-none">{reel.title}</h4>
      </div>
    </motion.div>
  );
};

interface TextileClientProps {
  initialCategories: any[];
  initialProducts: any[];
  initialBanners?: any[];
}

export default function TextileClient({ initialCategories, initialProducts, initialBanners }: TextileClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sareeScrollRef = useRef<HTMLDivElement>(null);
  const suitScrollRef = useRef<HTMLDivElement>(null);
  const kurtiScrollRef = useRef<HTMLDivElement>(null);
  const kidsScrollRef = useRef<HTMLDivElement>(null);
  const reelsScrollRef = useRef<HTMLDivElement>(null);

  // Exhibition State Management — The Interactive Layer
  const [sareeProgress, setSareeProgress] = useState(0);
  const [suitProgress, setSuitProgress] = useState(0);
  const [kurtiProgress, setKurtiProgress] = useState(0);
  const [kidsProgress, setKidsProgress] = useState(0);
  const [isSareePaused, setIsSareePaused] = useState(false);
  const [isSuitPaused, setIsSuitPaused] = useState(false);
  const [isKurtiPaused, setIsKurtiPaused] = useState(false);

  // Dynamic Data States (Pre-populated from Server)
  const [products] = useState<any[]>(initialProducts);
  // Only display categories toggled as 'Curated' in the Curated Collections section
  const curatedCategories = initialCategories.filter((cat: any) => cat.isCurated);
  const kidsCategory = initialCategories.find(
    (cat: any) => cat.slug === 'kids-collection' || cat.name.toLowerCase().includes('kids')
  );
  const [banners] = useState<any[]>(initialBanners && initialBanners.length > 0 ? initialBanners : HERO_SLIDES);
  const [isLoading] = useState(false); // Never loading because data is SSR

  // Removed Inquiry Modal state to favor direct product page navigation as per user request

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // SCROLL SYNC ENGINE — Connects scroll position to Dot Index
  const handleScrollSync = (ref: React.RefObject<HTMLDivElement | null>, setProgress: (val: number) => void) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    const scrollMax = scrollWidth - clientWidth;
    const scrollPercent = scrollMax > 0 ? scrollLeft / scrollMax : 0;
    setProgress(scrollPercent);
  };

  // Saree Auto-Scroll Engine — With Smart Pause
  useEffect(() => {
    const scrollContainer = sareeScrollRef.current;
    if (!scrollContainer || isSareePaused) return;

    const autoScroll = setInterval(() => {
      if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: 400, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(autoScroll);
  }, [isSareePaused]);

  // Suit Auto-Scroll Engine — With Smart Pause
  useEffect(() => {
    const scrollContainer = suitScrollRef.current;
    if (!scrollContainer || isSuitPaused) return;

    const autoScroll = setInterval(() => {
      if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: 400, behavior: 'smooth' });
      }
    }, 4500);

    return () => clearInterval(autoScroll);
  }, [isSuitPaused]);

  // Dynamic Data Sections - Robust Filtering for Variations
  const sarees = products.filter(p => {
    const cat = p.category?.toLowerCase() || '';
    return cat === 'saree' || cat === 'sarees';
  }).slice(0, 10);

  const suits = products.filter(p => {
    const cat = p.category?.toLowerCase() || '';
    return cat === 'suit' || cat === 'suits';
  }).slice(0, 10);

  const kurtis = products.filter(p => {
    const cat = p.category?.toLowerCase() || '';
    return cat === 'kurti' || cat === 'kurtis';
  }).slice(0, 10);

  const kidsWear = products.filter(p => {
    const cat = p.category?.toLowerCase() || '';
    const slug = p.slug?.toLowerCase() || '';
    return cat === 'kids-wear' || cat === 'kids wear' || cat === 'kids' || cat.includes('kids') || slug.includes('kids');
  }).slice(0, 10);

  // Removed activeImageIndex as part of modal cleanup

  // Kurti Auto-Scroll Engine — With Smart Pause
  useEffect(() => {
    const scrollContainer = kurtiScrollRef.current;
    if (!scrollContainer || isKurtiPaused) return;

    const autoScroll = setInterval(() => {
      if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: 400, behavior: 'smooth' });
      }
    }, 5000);

    return () => clearInterval(autoScroll);
  }, [isKurtiPaused]);

  // Kids Auto-Scroll Engine
  useEffect(() => {
    const scrollContainer = kidsScrollRef.current;
    if (!scrollContainer) return;

    const autoScroll = setInterval(() => {
      if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: 400, behavior: 'smooth' });
      }
    }, 5500);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-24 lg:pt-[140px]">

      <TextileHeader categories={initialCategories.filter(cat => cat.showInHeader)} />

      {/* ═══ HERO — THE BALANCED AWARD HERO ═══ */}
      <section className="relative h-[85vh] min-h-[650px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={banners[currentSlide].image || banners[currentSlide].img}
              alt={banners[currentSlide].title}
              fill
              sizes="100vw"
              className={cn(
                "object-cover opacity-90 transition-all duration-700",
                banners[currentSlide].alignment === 'top' ? "object-top" : 
                banners[currentSlide].alignment === 'bottom' ? "object-bottom" : "object-center"
              )}
              priority
            />
            {/* High-Contrast Gradient Masking — Flipped for Left Alignment */}
            <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Diamond Nav Arrows — PUSHED TO EXTREMES */}
        <button
          onClick={() => setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 rotate-45 flex items-center justify-center transition-all group hidden md:flex active:scale-90"
        >
          <ChevronLeft className="w-5 h-5 -rotate-45" />
        </button>
        <button
          onClick={() => setCurrentSlide(prev => (prev + 1) % banners.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 rotate-45 flex items-center justify-center transition-all group hidden md:flex active:scale-90"
        >
          <ChevronRight className="w-5 h-5 -rotate-45" />
        </button>

        <div className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-32 h-full flex flex-col justify-center items-start text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 md:px-6 md:py-1.5 inline-block rounded-lg border border-white/40 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[.4em] mb-4 md:mb-6 drop-shadow-md">
                {banners[currentSlide].accent || "SEASONAL COLLECTION"}
              </div>

              <h1 className="font-extrabold tracking-tighter leading-none mb-8 md:mb-10 drop-shadow-2xl">
                <span className="text-[#FFD700] block text-4xl md:text-6xl lg:text-8xl mb-2 md:mb-4 drop-shadow-2xl uppercase">{banners[currentSlide].title}</span>
                {banners[currentSlide].subtitle && (
                  <span className="text-white block text-2xl md:text-3xl lg:text-5xl italic leading-tight drop-shadow-2xl mt-2">{banners[currentSlide].subtitle}</span>
                )}
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <button
                  onClick={() => Haptics.medium()}
                  className="w-full sm:w-auto px-10 py-4 md:py-5 bg-red-600 text-white text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-all hover:bg-black shadow-2xl flex items-center justify-center gap-2"
                >
                  Request Catalog <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </section>

      {/* ═══ INSTITUTIONAL VALUE PILLARS ═══ */}
      <section className="bg-[#0A5181] py-8 md:py-12 border-b border-white/10">
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { title: "Latest Collection", sub: "Fresh Seasonal Inventory", icon: Star },
              { title: "Lowest Rate 365 Days", sub: "No Sales, Just Honesty", icon: TrendingUp },
              { title: "No Bundling", sub: "Buy Precisely What You Need", icon: PackageCheck },
              { title: "Lowest Price 365 Days", sub: "Direct Retail Pricing", icon: ShoppingBag }
            ].map((pillar, i) => (
              <div key={i} className="flex items-center gap-4 text-white group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#DA222A] transition-colors">
                  <pillar.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-[10px] md:text-[13px] font-black uppercase tracking-widest">{pillar.title}</h4>
                  <p className="text-white/40 text-[8px] md:text-[9px] font-bold uppercase tracking-widest mt-1">{pillar.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MANUFACTURING EXCELLENCE — THE ART GALLERY STAGING ═══ */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* The Minimalist Signature Pulse */}
        <div className="absolute top-[-20%] left-[-10%] w-[1200px] h-[1200px] border-[100px] border-[#DA222A]/[0.02] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] border-[1px] border-[#0A5181]/[0.08] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-5%] right-[0%] w-[600px] h-[600px] border-[1px] border-[#0A5181]/[0.05] rounded-full pointer-events-none" />

        {/* Professional Axis Lines */}
        <div className="absolute top-0 left-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#0A5181]/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-[15%] w-[1px] h-full bg-gradient-to-b from-transparent via-[#0A5181]/5 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-12 md:mb-16 px-4">
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="w-8 md:w-12 h-[1px] bg-[#0A5181]/20" />
              <span className="text-[#0A5181] text-[10px] md:text-[11px] font-black uppercase tracking-[.4em] md:tracking-[.6em]">A Century of Immutable Trust</span>
              <div className="w-8 md:w-12 h-[1px] bg-[#0A5181]/20" />
            </div>
            <h2 className="text-[#0A5181] text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-8 md:mb-10">
              The Legacy Of <br className="hidden sm:block" /><span className="text-[#DA222A]">Babulal Premkumar.</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { year: "2019-20", title: "Raymond Top Retailer", region: "Bihar & Jharkhand" },
                { year: "2018-19", title: "Raymond Growth Award", region: "Regional Winner" },
                { year: "2021", title: "Linen Club Excellence", region: "Distribution Leadership" }
              ].map((award, idx) => (
                <div key={idx} className="bg-white p-6 border-l-4 border-[#DA222A] shadow-sm text-left">
                  <div className="text-[#DA222A] text-[9px] font-black uppercase tracking-widest mb-1">{award.year}</div>
                  <h5 className="text-[#0A5181] text-xs font-black uppercase tracking-widest">{award.title}</h5>
                  <p className="text-gray-400 text-[10px] uppercase font-bold mt-1">{award.region}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-base md:text-xl lg:text-2xl font-medium max-w-4xl mx-auto italic leading-relaxed">
              We define industry standards with a fixed-pricing strategy. From Sri Hanumanbux Poddar to the 5th generation leadership, <br className="hidden lg:block" /> we service 2000+ partners across 6 states from our Tupudana supply hub.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-gray-100 rounded-2xl md:rounded-3xl overflow-hidden">
            {[
              {
                pre: "Legacy Of",
                stat: "100+ YEARS",
                post: "Five Generations of Trust",
                Icon: Award
              },
              {
                pre: "Supply Hub For",
                stat: "2000+",
                post: "B2B Partners Across 6 States",
                Icon: Users
              },
              {
                pre: "Operational Since",
                stat: "1917",
                post: "Century of Immutable Trust",
                Icon: Globe
              },
              {
                pre: "Inventory Scale",
                stat: "10K+ SKUS",
                post: "Massive Warehousing Hub",
                Icon: Factory
              }
            ].map((item, i) => (
              <div
                key={i}
                className={`flex-1 px-4 py-12 md:px-12 md:py-20 flex flex-col items-center text-center group transition-all duration-700 hover:bg-gray-50/50 ${i % 2 === 0 ? 'border-r border-gray-100/30' : ''
                  } ${i < 2 ? 'border-b lg:border-b-0 border-gray-100/30' : ''} ${i === 1 ? 'lg:border-r border-gray-100/30' : ''}`}
              >
                <div className="relative mb-8 md:mb-12">
                  <div className="absolute inset-0 bg-[#0A5181]/10 rounded-full blur-xl md:blur-2xl group-hover:bg-[#DA222A]/10 transition-all duration-700" />
                  <div className="relative w-16 h-16 md:w-24 md:h-24 bg-[#DA222A] rounded-full flex items-center justify-center text-white shadow-2xl border-4 md:border-[6px] border-white ring-1 ring-[#0A5181]/20">
                    <item.Icon className="w-6 h-6 md:w-10 md:h-10" />
                  </div>
                </div>

                <div className="text-gray-400 text-[8px] md:text-[10px] font-black uppercase tracking-[.4em] mb-2 md:mb-4 group-hover:text-[#0A5181] transition-colors">
                  {item.pre}
                </div>

                <div className="text-[#DA222A] text-2xl md:text-5xl font-black tracking-tighter mb-2 md:mb-4 group-hover:translate-y-[-4px] transition-all duration-500">
                  {item.stat}
                </div>

                <div className="text-gray-900 text-[9px] md:text-[11px] font-black uppercase tracking-[.2em] px-2">
                  {item.post}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE BOUTIQUE EXHIBITION — CURATED COLLECTIONS ═══ */}
      <section id="collections" className="relative py-24 bg-white overflow-hidden">
        {/* Abstract Collection Layers */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none" />

        <div className="max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-24">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-12 h-[1px] bg-[#DA222A]" />
                <span className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.6em]">Seasonal Anthology</span>
              </div>
              <h2 className="text-[#0A5181] text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-4">
                Curated <br /><span className="text-[#DA222A]">Collections.</span>
              </h2>
              <p className="text-gray-400 text-lg md:text-xl font-medium max-w-xl italic mt-6 leading-relaxed">
                A cinematic showcase of Ranchi&apos;s finest textile engineering. <br className="hidden lg:block" /> Retail excellence for global partners.
              </p>
            </div>
            <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[.4em] text-gray-400">
              <div className="flex items-center gap-2 group cursor-pointer hover:text-[#0A5181] transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-[#DA222A]" /> Retail Excellence
              </div>
              <div className="flex items-center gap-2 group cursor-pointer hover:text-[#0A5181] transition-colors">
                Global Exports
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {isLoading ? (
              // PREMIUM SHIMMER LOADING STATES
              [1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse space-y-6">
                  <div className="h-10 w-2/3 bg-gray-100 rounded-lg mb-4" />
                  <div className="aspect-[4/5] bg-gray-100 rounded-3xl" />
                </div>
              ))
            ) : curatedCategories.length > 0 ? (
              curatedCategories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  onClick={() => Haptics.light()}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                  className="group cursor-pointer flex flex-col"
                >
                  <Link href={`/textiles/category/${cat.slug}`} className="block h-full">
                    {/* Category Meta Above Image */}
                    <div className="flex justify-between items-center px-4 mb-6">
                      <div>
                        <h4 className="text-[#0A5181] text-2xl font-black tracking-tighter mb-1 transition-colors">{cat.name}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[#DA222A] text-[9px] font-black uppercase tracking-[.4em]">
                            Featured Collection
                          </span>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-[#DA222A] group-hover:text-[#DA222A] transition-all">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-3xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
                      <div className="absolute inset-0 bg-[#0A5181]/0 group-hover:bg-[#0A5181]/40 transition-all duration-700 z-10" />
                      <Image
                        src={cat.image || '/textile_factory.png'}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-all duration-1000 ease-out"
                      />

                      {/* Hover Detail Panel */}
                      <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 translate-y-8 group-hover:translate-y-0 transition-all duration-500">
                        <div className="bg-white/95 backdrop-blur-xl p-8 rounded-xl shadow-2xl text-center">
                          <p className="text-[#DA222A] text-[9px] font-black uppercase tracking-[.3em] mb-2">Master Collection</p>
                          <h4 className="text-gray-900 text-2xl font-black tracking-tight mb-4">Explore {cat.name}</h4>
                          <span className="w-full py-4 bg-[#0A5181] text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-[#DA222A] transition-colors flex justify-center items-center shadow-lg shadow-primary/20">
                            View Inventory
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              // EMPTY STATE
              <div className="col-span-1 md:col-span-2 lg:col-span-2">
                <div className="bg-gray-50 p-12 rounded-3xl border-2 border-dashed border-gray-200 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-primary uppercase tracking-tighter">New Collection Arriving Soon</h3>
                  <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">Our catalog is currently being updated for the season.</p>
                </div>
              </div>
            )}

            {/* View More Institutional Card */}
            <div className="lg:translate-y-12 flex flex-col">
              <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center p-12 text-center group hover:bg-[#0A5181]/5 hover:border-[#0A5181]/20 transition-all cursor-not-allowed min-h-[500px]">
                <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-8 h-8 text-[#0A5181]" />
                </div>
                <h4 className="text-[#0A5181] text-2xl font-black tracking-tighter mb-4">Explore Full <br />Inventory.</h4>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-8 leading-relaxed">
                  Access our complete 2026 line sheet and technical specifications.
                </p>
                <div className="flex items-center gap-2 text-[#DA222A] text-[10px] font-black uppercase tracking-widest">
                  Coming Soon <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ RANGE OF SAREES — THE BOUTIQUE EXHIBITION ═══ */}
      <section className="relative py-20 bg-gray-50/30 overflow-hidden border-b border-gray-100">
        <div className="max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-24">
          <div className="text-center mb-20 px-4">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-6 uppercase">
              <span className="text-[#DA222A]">Range Of</span> <span className="text-[#0A5181]">Sarees</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-medium max-w-4xl mx-auto leading-relaxed tracking-tight">
              Elevate Your Ethnic Elegance With Our Stunning Range Of Sarees. From Traditional Weaves To Contemporary Designs, Explore A Diverse Collection That Exudes Grace And Sophistication.
            </p>
            <div className="w-24 h-1 bg-[#DA222A]/20 mx-auto mt-8" />
          </div>

          <div
            ref={sareeScrollRef}
            onMouseEnter={() => setIsSareePaused(true)}
            onMouseLeave={() => setIsSareePaused(false)}
            onScroll={() => handleScrollSync(sareeScrollRef, setSareeProgress)}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory"
          >
            {sarees.length > 0 ? sarees.map((p, i) => (
              <Link
                key={p._id}
                href={`/textiles/product/${p.slug}`}
                onClick={() => Haptics.light()}
                className="min-w-[280px] md:min-w-[calc(33.33%-1.5rem)] lg:min-w-[calc(20%-1.2rem)] snap-center group cursor-pointer block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white mb-6 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] group-hover:shadow-2xl transition-all duration-700">
                  <Image
                    src={p.images?.[0] || "/saree_boutique_red.png"}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  {p.images?.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black text-white uppercase tracking-widest">
                      +{p.images.length - 1} View
                    </div>
                  )}
                </div>
                <div className="text-center px-4">
                  <h4 className="text-[#DA222A] text-lg font-black mb-1 group-hover:translate-y-[-2px] transition-transform">{p.name}</h4>
                  <p className="text-gray-900 text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Explore Collection</p>
                </div>
              </Link>
            )) : (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="min-w-[280px] md:min-w-[calc(33.33%-1.5rem)] lg:min-w-[calc(20%-1.2rem)] aspect-[3/4] bg-gray-100 animate-pulse rounded-sm" />
              ))
            )}
          </div>

          {/* Institutional Progress Indicators — Saree Section */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2, 3, 4].map((dot) => (
              <div
                key={dot}
                className={`h-1.5 rounded-full transition-all duration-500 ${Math.round(sareeProgress * 4) === dot ? 'bg-[#DA222A] w-8' : 'bg-gray-200 w-3'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RANGE OF SUITS — THE BOUTIQUE EXHIBITION ═══ */}
      <section className="relative py-20 bg-gray-50/50 overflow-hidden border-b border-gray-100">
        <div className="max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-24">
          <div className="text-center mb-20 px-4">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-6 uppercase">
              <span className="text-[#DA222A]">Range Of</span> <span className="text-[#0A5181]">Suits</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-medium max-w-4xl mx-auto leading-relaxed tracking-tight">
              Step Into Timeless Sophistication With Our Exquisite Range Of Suits. From Classic Cuts To Contemporary Styles, Discover Impeccable Tailoring And Luxurious Fabrics For Every Occasion.
            </p>
            <div className="w-24 h-1 bg-[#DA222A]/20 mx-auto mt-8" />
          </div>

          <div
            ref={suitScrollRef}
            onMouseEnter={() => setIsSuitPaused(true)}
            onMouseLeave={() => setIsSuitPaused(false)}
            onScroll={() => handleScrollSync(suitScrollRef, setSuitProgress)}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory"
          >
            {suits.length > 0 ? suits.map((p, i) => (
              <Link
                key={p._id}
                href={`/textiles/product/${p.slug}`}
                onClick={() => Haptics.light()}
                className="min-w-[280px] md:min-w-[calc(33.33%-1.5rem)] lg:min-w-[calc(20%-1.2rem)] snap-center group cursor-pointer block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white mb-6 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] group-hover:shadow-2xl transition-all duration-700">
                  <Image
                    src={p.images?.[0] || "/suit_boutique_purple.png"}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  {p.images?.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black text-white uppercase tracking-widest">
                      +{p.images.length - 1} View
                    </div>
                  )}
                </div>
                <div className="text-center px-4">
                  <h4 className="text-[#DA222A] text-lg font-black mb-1 group-hover:translate-y-[-2px] transition-transform">{p.name}</h4>
                  <p className="text-gray-900 text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Explore Collection</p>
                </div>
              </Link>
            )) : (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="min-w-[280px] md:min-w-[calc(33.33%-1.5rem)] lg:min-w-[calc(20%-1.2rem)] aspect-[3/4] bg-gray-100 animate-pulse rounded-sm" />
              ))
            )}
          </div>

          {/* Institutional Progress Indicators — Suit Section */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2, 3, 4].map((dot) => (
              <div
                key={dot}
                className={`h-1.5 rounded-full transition-all duration-500 ${Math.round(suitProgress * 4) === dot ? 'bg-[#DA222A] w-8' : 'bg-gray-200 w-3'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RANGE OF KURTIS — THE BOUTIQUE EXHIBITION ═══ */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-24">
          <div className="text-center mb-20 px-4">
            <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-6 uppercase">
              <span className="text-[#DA222A]">Range Of</span> <span className="text-[#0A5181]">Kurtis</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-medium max-w-4xl mx-auto leading-relaxed tracking-tight">
              Experience Effortless Style And Comfort With Babulal Premkumar Limited&apos;s Diverse Range Of Kurtis. Explore Vibrant Colors, Intricate Designs, And Quality Fabrics That Redefine Contemporary Elegance.
            </p>
            <div className="w-24 h-1 bg-[#DA222A]/20 mx-auto mt-8" />
          </div>

          <div
            ref={kurtiScrollRef}
            onMouseEnter={() => setIsKurtiPaused(true)}
            onMouseLeave={() => setIsKurtiPaused(false)}
            onScroll={() => handleScrollSync(kurtiScrollRef, setKurtiProgress)}
            className="flex gap-6 overflow-x-auto no-scrollbar pb-8 snap-x snap-mandatory"
          >
            {kurtis.length > 0 ? kurtis.map((p, i) => (
              <Link
                key={p._id}
                href={`/textiles/product/${p.slug}`}
                onClick={() => Haptics.light()}
                className="min-w-[280px] md:min-w-[calc(33.33%-1.5rem)] lg:min-w-[calc(20%-1.2rem)] snap-center group cursor-pointer block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-white mb-6 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.1)] group-hover:shadow-2xl transition-all duration-700">
                  <Image
                    src={p.images?.[0] || "/kurti_boutique_yellow.png"}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  {p.images?.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black text-white uppercase tracking-widest">
                      +{p.images.length - 1} View
                    </div>
                  )}
                </div>
                <div className="text-center px-4">
                  <h4 className="text-[#DA222A] text-lg font-black mb-1 group-hover:translate-y-[-2px] transition-transform">{p.name}</h4>
                  <p className="text-gray-900 text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">Explore Collection</p>
                </div>
              </Link>
            )) : (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="min-w-[280px] md:min-w-[calc(33.33%-1.5rem)] lg:min-w-[calc(20%-1.2rem)] aspect-[3/4] bg-gray-100 animate-pulse rounded-sm" />
              ))
            )}
          </div>

          {/* Institutional Progress Indicators — Kurti Section */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2, 3, 4].map((dot) => (
              <div
                key={dot}
                className={`h-1.5 rounded-full transition-all duration-500 ${Math.round(kurtiProgress * 4) === dot ? 'bg-[#DA222A] w-8' : 'bg-gray-200 w-3'
                  }`}
              />
            ))}
          </div>
        </div>
      </section>


      {/* ═══ QUALITY CONTROL — THE INDUSTRIAL COMMAND CENTER ═══ */}
      <section className="relative py-16 overflow-hidden border-t border-gray-100">
        {/* Cinematic Backdrop Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/qc_bg_lab.png"
            alt="Textile Lab"
            fill
            className="object-cover opacity-10 grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-24">
          <div className="text-center mb-12 px-4">
            <h2 className="text-[#DA222A] text-2xl md:text-3xl font-black tracking-tight mb-4">Quality Control</h2>
            <p className="text-gray-900 text-sm md:text-base font-bold max-w-4xl mx-auto leading-relaxed">
              Quality Control Is Our Priority. With Rigorous Standards And Meticulous Attention To Detail, <br className="hidden lg:block" /> We Ensure Each Garment Meets The Highest Standards Of Craftsmanship.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 lg:gap-12 pt-6 pb-6">
            {[
              { name: "Color Bleeding Test", icon: Droplets },
              { name: "Fusing Test", icon: Layers },
              { name: "Dispatching Test", icon: PackageCheck },
              { name: "Finishing Test", icon: CheckCircle2 },
              { name: "Shrinkage Test", icon: Minimize }
            ].map((qc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                {/* The Architectural Diamond */}
                <div className="w-32 h-32 md:w-40 md:h-40 bg-[#DA222A] rotate-45 flex items-center justify-center relative overflow-hidden shadow-2xl group-hover:bg-[#095181] group-hover:scale-105 group-hover:rotate-[225deg] transition-all duration-1000 shadow-[#DA222A]/20">
                  {/* Subtle Diamond Texture Overlay */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:10px_10px]" />

                  {/* Centered Content (Inverse Rotation) */}
                  <div className="-rotate-45 group-hover:-rotate-[225deg] transition-transform duration-1000 text-center flex flex-col items-center gap-3 px-4 z-10">
                    <qc.icon className="w-6 h-6 md:w-8 md:h-8 text-white stroke-[1.5px]" />
                    <span className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] leading-tight max-w-[100px]">
                      {qc.name}
                    </span>
                  </div>
                </div>

                {/* Decorative Elite Pulse (Desktop Only) */}
                <div className="absolute -inset-1.5 border-2 border-[#DA222A]/10 rotate-45 group-hover:rotate-[225deg] group-hover:border-[#095181]/20 transition-all duration-1000 -z-10" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EXPLORE OUR LATEST ARRIVALS — THE GALLERIA ═══ */}
      <section className="relative py-24 bg-white border-b border-gray-100">
        <div className="max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <div className="max-w-4xl">
              <h2 className="text-[#DA222A] text-3xl md:text-4xl font-black tracking-tight mb-4">Explore Our Latest Arrivals</h2>
              <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
                Discover The Essence Of Elegance With Babulal Premkumar&apos;s Latest Collection. From Timeless Sarees To Trendy <br className="hidden lg:block" /> Lehengas, Exquisite Suits, And Stylish Kurtis, Our Selection Brings The Finest In Traditional And Contemporary <br className="hidden lg:block" /> Fashion. Whether It&apos;s Vibrant Prints, Intricate Embroidery, Or Luxurious Fabrics, Each Piece Is Crafted To Perfection. <br className="hidden lg:block" /> Refresh Your Wardrobe With Our Captivating Designs, Perfect For Every Occasion!
              </p>
            </div>
            <button className="px-10 py-3 border-2 border-[#DA222A]/20 text-[#DA222A] text-[10px] font-black uppercase tracking-[.2em] rounded-sm hover:bg-[#DA222A] hover:text-white transition-all">
              VIEW ALL
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((p, i) => (
              <motion.div
                key={p._id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col bg-white border border-gray-100/50 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-sm overflow-hidden"
              >
                <Link href={`/textiles/product/${p.slug}`} onClick={() => Haptics.light()} className="relative aspect-[3/4] overflow-hidden block cursor-pointer">
                  <Image
                    src={p.images?.[0] || "/latest_arrivals_saree.png"}
                    alt={p.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                </Link>
                <div className="p-6 flex flex-col flex-1 text-center justify-between min-h-[160px]">
                  <Link href={`/textiles/product/${p.slug}`} onClick={() => Haptics.light()}>
                    <h4 className="text-sm md:text-base font-bold tracking-tight mb-6 line-clamp-2 px-2 text-gray-900 group-hover:text-[#DA222A] transition-colors cursor-pointer">
                      {p.name}
                    </h4>
                  </Link>
                  <div className="flex gap-2 mt-auto">
                    <Link href={`/textiles/product/${p.slug}`} onClick={() => Haptics.light()} className="flex-1 py-3 bg-[#DA222A] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                      <Star className="w-3 h-3 fill-current" />
                      Catalog
                    </Link>
                    <button className="flex-1 py-3 bg-[#1A1A1A] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#0A5181] transition-colors">
                      <Mail className="w-3 h-3" />
                      Enquire Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ KIDS COLLECTION — THE MINIATURE GALLERIA ═══ */}
      <section className="relative py-20 bg-gray-50/20 overflow-hidden border-b border-gray-100">
        <div className="max-w-[1700px] mx-auto px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

            {/* Left Pillar: The Cinematic Banner */}
            <div className="w-full lg:w-[450px] shrink-0 relative aspect-[3/4] lg:aspect-auto h-[600px] lg:h-[700px] overflow-hidden rounded-sm shadow-2xl group">
              <Image
                src={kidsCategory?.image || "/kids_boutique_yellow.png"}
                alt="Kids Collection"
                fill
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-12">
                <h3 className="text-[#DA222A] text-2xl font-black italic tracking-tighter mb-4">KIDS WEAR</h3>
                <h4 className="text-white text-4xl font-black leading-[1.1] mb-8">
                  LIMITED <br /> EDITION <br /> TREND <br /> COLLECTION
                </h4>
                <button className="w-fit px-8 py-3 border border-white text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  EXPLORE MORE
                </button>
              </div>
            </div>

            {/* Right Pillar: The Exhibition Slider */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-end mb-12">
                <div className="max-w-2xl">
                  <h2 className="text-[#DA222A] text-3xl md:text-4xl font-black tracking-tight mb-6">Kids Collection</h2>
                  <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed">
                    Step Into A World Of Adorable Fashion With Babulal Premkumar Limited&apos;s Kids Collection. <br className="hidden lg:block" /> From Charming Outfits To Playful Accessories, Dress Your Little Ones In Style And Comfort For Every Occasion.
                  </p>
                </div>
                {/* Institutional Navigation Triggers */}
                <div className="hidden md:flex gap-2">
                  <button
                    onClick={() => kidsScrollRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
                    className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => kidsScrollRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
                    className="w-12 h-12 border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div
                ref={kidsScrollRef}
                onScroll={() => handleScrollSync(kidsScrollRef, setKidsProgress)}
                className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pt-4"
              >
                {kidsWear.length > 0 ? kidsWear.map((p, i) => (
                  <Link
                    key={p._id}
                    href={`/textiles/product/${p.slug}`}
                    onClick={() => Haptics.light()}
                    className="flex-none w-[280px] md:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] xl:w-[calc(25%-1.2rem)] snap-center group cursor-pointer flex flex-col h-full"
                  >
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-100 border border-gray-100 group-hover:shadow-xl transition-all duration-700 shrink-0">
                      <Image
                        src={p.images?.[0] || "/kids_boutique_yellow.png"}
                        alt={p.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
                    </div>
                    <div className="text-center p-6 bg-white border border-t-0 border-gray-100 flex-1 flex flex-col items-center justify-between">
                      <h4 className="text-gray-900 text-sm md:text-base font-bold tracking-tight mb-2 group-hover:text-[#DA222A] transition-colors line-clamp-2">
                        {p.name}
                      </h4>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-auto">Explore Collection</p>
                    </div>
                  </Link>
                )) : (
                  [1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-none w-[280px] md:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-1.5rem)] xl:w-[calc(25%-1.2rem)] snap-center flex flex-col h-full">
                      <div className="w-full aspect-[4/5] bg-gray-100 animate-pulse border border-gray-100 shrink-0" />
                      <div className="flex-1 min-h-[130px] bg-white border border-t-0 border-gray-100 animate-pulse" />
                    </div>
                  ))
                )}
              </div>

              {/* Institutional Progress Indicators — Kids Section */}
              <div className="flex justify-center gap-2 mt-8">
                {[0, 1, 2, 3, 4].map((dot) => (
                  <div
                    key={dot}
                    className={`h-1.5 rounded-full transition-all duration-500 ${Math.round(kidsProgress * 4) === dot ? 'bg-[#DA222A] w-8' : 'bg-gray-200 w-3'
                      }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ PRODUCTION STRENGTH — THE ASYMMETRICAL SUPPLY WAVE ═══ */}
      <section className="relative py-32 overflow-hidden bg-white">
        {/* Technical Blueprint Layer — ENHANCED VISIBILITY */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#DA222A 2px, transparent 2px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative z-10 max-w-[1700px] mx-auto px-12 lg:px-24">
          <div className="text-center mb-28 px-4">
            <h2 className="text-[#DA222A] text-2xl md:text-3xl font-black tracking-[0.2em] mb-4 uppercase">Institutional Supply Chain</h2>
            <h3 className="text-[#0A5181] text-3xl md:text-5xl font-black tracking-tight mb-8">Supply Chain Mastery</h3>
            <p className="text-gray-500 text-sm md:text-base font-medium max-w-4xl mx-auto leading-relaxed">
              Our Supply Chain Excellence Lies In Strategic Sourcing, Innovation, And Operational Efficiency. We Deliver Elite Value, <br className="hidden lg:block" /> Meeting Global Demands With Distribution Leadership And Peerless Trust.
            </p>
          </div>

          {/* The Supply Wave Connector */}
          <div className="relative h-auto lg:h-[650px]">
            {/* The Cinematic Wave Line (Desktop) — THICKER & MORE VISIBLE */}
            <svg className="absolute top-0 left-0 w-full h-full hidden lg:block opacity-20" preserveAspectRatio="none">
              <path
                d="M 0 320 C 200 120, 400 520, 600 320 C 800 120, 1000 520, 1200 320 C 1400 120, 1600 320, 1700 320"
                fill="none"
                stroke="#DA222A"
                strokeWidth="3"
                strokeDasharray="12 12"
              />
            </svg>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-y-24 gap-x-8 lg:gap-4 h-full pt-32 md:pt-48 lg:pt-64">
              {[
                { name: "Trend Scouting", icon: PenTool, num: "01", offset: "-mt-32" },
                { name: "Strategic Sourcing", icon: Scissors, num: "02", offset: "mt-32" },
                { name: "Vendor Aggregation", icon: Shirt, num: "03", offset: "-mt-16" },
                { name: "Quality Assurance", icon: ClipboardCheck, num: "04", offset: "mt-16" },
                { name: "Partner Finishing", icon: Flame, num: "05", offset: "-mt-32" },
                { name: "Secure Vaulting", icon: Box, num: "06", offset: "mt-32" },
                { name: "Elite Distribution", icon: Truck, num: "07", offset: "mt-0" }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, y: i % 2 === 0 ? -60 : 60 }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className={`relative flex flex-col items-center group ${i === 6 ? 'col-span-2 md:col-span-1' : ''}`}
                >
                  {/* Step Marker — MORE VISIBLE */}
                  <div className="absolute -top-10 md:-top-14 text-[9px] md:text-[12px] font-black uppercase text-[#DA222A] opacity-30 group-hover:opacity-100 transition-all bg-white px-2 py-0.5 md:px-3 md:py-1 border border-[#DA222A]/10 rounded-full">
                    Step {step.num}
                  </div>

                  {/* Floating Tech Pod */}
                  <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 mb-6 md:mb-8">
                    {/* Shadow Ripple */}
                    <div className="absolute inset-0 bg-[#DA222A]/20 rounded-full blur-xl group-hover:bg-[#0A5181]/30 transition-colors" />

                    {/* Pulsing Outer Orbit */}
                    <div className="absolute -inset-2 border-2 border-[#DA222A]/20 rounded-full group-hover:border-[#DA222A] animate-[pulse_2s_infinite] opacity-0 group-hover:opacity-100" />

                    {/* The Primary Hub */}
                    <div className="absolute inset-0 bg-[#DA222A] rounded-full flex items-center justify-center shadow-2xl group-hover:bg-[#095181] group-hover:rotate-[360deg] transition-all duration-1000 z-10 border-4 border-white/10">
                      <step.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="text-gray-900 text-[10px] md:text-[11px] lg:text-[13px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em] mb-1 md:mb-2 group-hover:text-[#DA222A] transition-colors">
                      {step.name}
                    </h4>
                    <p className="text-gray-400 text-[8px] md:text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Supply Excellence
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BBP STUDIO — FABRICS IN MOTION (REELS) ═══ */}
      <section className="relative py-28 bg-[#fafafa] overflow-hidden">
        <div className="max-w-[1700px] mx-auto px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-1 bg-[#DA222A]" />
                <span className="text-[#DA222A] text-[10px] font-black uppercase tracking-[0.4em]">Cinematic Showcase</span>
              </div>
              <h2 className="text-[#0A5181] text-4xl lg:text-6xl font-black tracking-tighter leading-tight">
                Fabrics In <br /><span className="text-[#DA222A]">Motion.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { id: "DVxuBIWEZOC", title: "Royal Wedding Collection", category: "Handloom Silk", img: "/reels/wedding.png" },
              { id: "DTiK-Z6Ed8U", title: "Handcrafted Luxury", category: "Bespoke Suiting", img: "/reels/suits.png" },
              { id: "DTSqfNBkZVy", title: "Textile Heritage Show", category: "Legacy Collection", img: "/reels/heritage.png" },
              { id: "DTC2iElEcQ0", title: "New Arrival Exhibit", category: "Modern Ethnic", img: "/reels/ethnic.png" },
              { id: "DRPEMCeEZ1A", title: "Editorial Showcase", category: "Corporate Wear", img: "/reels/corporate.png" },
              { id: "DQ_iBc5EqHZ", title: "Bridal Masterpiece", category: "Wedding Special", img: "/reels/bridal.png" }
            ].map((reel, i) => (
              <ReelCard key={reel.id} reel={reel} index={i} />
            ))}
          </div>


          <div className="mt-16 flex flex-col items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-red-50 rounded-full border border-red-100">
              <div className="w-2 h-2 bg-[#DA222A] rounded-full animate-pulse" />
              <span className="text-[#DA222A] text-[10px] font-black uppercase tracking-widest">Live Updates Available @babulalpremkumar</span>
            </div>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="px-12 py-5 bg-[#0A5181] text-white text-[11px] font-black uppercase tracking-[.4em] rounded hover:bg-[#DA222A] transition-all shadow-2xl flex items-center gap-4"
            >
              Visit Official Instagram <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ LATEST BLOGS EXHIBITION ═══ */}
      <section className="relative py-28 bg-white overflow-hidden">
        <div className="max-w-[1700px] mx-auto px-12 lg:px-24">
          <div className="text-center mb-20 px-4">
            <h2 className="text-[#DA222A] text-2xl md:text-3xl font-black tracking-tight mb-4">Latest Blogs</h2>
            <p className="text-gray-500 text-sm md:text-base font-medium max-w-4xl mx-auto leading-relaxed">
              Explore The Fashion Frontier With Babulal Premkumar Limited&apos;s Latest Blogs. Dive Into Trend Insights, Style Tips, And <br className="hidden lg:block" /> Behind-The-Scenes Stories, Curated To Inspire Your Wardrobe And Elevate Your Fashion Game.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Pattu Silk Saree Retail in Telangana Crafting Timeless Silk Elegance",
                img: "/blog_pattu.png",
                excerpt: "The Pattu Silk Saree Retail in Telangana are the skilled people who keep this beautiful tradition alive. They do ..."
              },
              {
                title: "Kanchipuram Saree Retail in Telangana: Complete Buying Guide",
                img: "/blog_kanchipuram.png",
                excerpt: "The Kanchipuram Saree Retail in Telangana are the people who create these masterpieces. Known as the Queen of Sil..."
              },
              {
                title: "Gadwal Saree Retail in Telangana Preserving a Rich Handloom Legacy",
                img: "/blog_gadwal.png",
                excerpt: "Gadwal Saree Retail in Telangana do their magic. These sarees are very special because they bring two different t..."
              }
            ].map((blog, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group border border-gray-100 rounded-sm overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={blog.img}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-8">
                  <h4 className="text-gray-900 text-lg md:text-xl font-bold leading-snug mb-4 group-hover:text-[#DA222A] transition-colors line-clamp-2">
                    {blog.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <span className="text-[#DA222A] text-xs font-black uppercase tracking-widest border-b-2 border-transparent group-hover:border-[#DA222A] transition-all">
                    Read More
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>




      {/* Global Sticky Action Shelf — PERMANENT PIPELINE */}
      <div className="fixed right-8 bottom-10 z-[110] hidden md:flex flex-col gap-3">
        {[
          { Icon: MessageCircle, color: "bg-[#25D366]" },
          { Icon: Mail, color: "bg-[#DA222A]" },
          { Icon: Phone, color: "bg-[#0A5181]" }
        ].map((item, i) => (
          <div
            key={i}
            className={`${item.color} w-11 h-11 rounded-full flex items-center justify-center text-white cursor-pointer shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-white/20`}
          >
            <item.Icon className="w-5 h-5" />
          </div>
        ))}
      </div>

      <Footer />

      {/* Removed Inquiry Modal as per user request */}
    </div>
  );
}
