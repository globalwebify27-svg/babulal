"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const HERO_SLIDES = [
  {
    title: "DOMINATING THE",
    subtitle: "Jharkhand's Largest Honda Wings Dealer",
    img: "/honda_hero.png",
    accent: "Premsons Honda Elite"
  },
  {
    title: "THE POWER OF",
    subtitle: "Precision Engineering & Global Trust",
    img: "/honda_service.png",
    accent: "Honda Genuine Service"
  },
];

interface HondaHeroProps {
  onTestRideClick: () => void;
}

export default function HondaHero({ onTestRideClick }: HondaHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(HERO_SLIDES);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch('/api/admin/banners?vertical=HONDA');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const dynamicSlides = data.filter(b => b.isActive).map(b => ({
            title: b.title,
            subtitle: b.subtitle || '',
            img: b.image,
            accent: b.position === 'HOME_HERO' ? 'Featured Selection' : 'Honda Elite'
          }));
          setSlides(dynamicSlides);
        }
      } catch (err) {
        console.error('Failed to fetch honda banners:', err);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  return (
    <section className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-[#0A5181] pt-24 md:pt-32">
      {/* ═══ MASTER BACKGROUND (BLUE GRADIENTS) ═══ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={slides[currentSlide].img}
            alt="Honda Excellence"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A5181] via-[#0A5181]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A5181] via-transparent to-[#0A5181]/20" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="max-w-4xl"
        >
           <div className="flex items-center gap-6 mb-8">
            <span className="w-12 h-[2px] bg-[#DA222A]" />
            <span className="text-white text-[10px] md:text-[12px] font-black uppercase tracking-[.6em] md:tracking-[.8em]">
              {slides[currentSlide].accent}
            </span>
          </div>

          <div className="min-h-[150px] md:min-h-[250px] lg:min-h-[320px]">
            <h1 className="text-white text-5xl md:text-[5rem] lg:text-[8rem] font-black tracking-tighter leading-[0.9] uppercase mb-10">
              {slides[currentSlide].title}<br />
              <span className="text-[#DA222A] italic">DREAMS.</span>
            </h1>
          </div>

          <div className="min-h-[60px] md:min-h-[80px]">
            <p className="text-white/80 text-lg md:text-2xl font-medium max-w-2xl italic mb-12 border-l-2 border-[#DA222A] pl-10 leading-relaxed">
              {slides[currentSlide].subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
            <button 
              onClick={onTestRideClick}
              className="px-10 py-5 bg-[#DA222A] text-white text-[10px] font-black uppercase tracking-[.4em] hover:bg-white hover:text-[#0A5181] transition-all shadow-2xl"
            >
              BOOK TEST RIDE
            </button>
            <button className="group flex items-center gap-4 text-white hover:text-[#DA222A] transition-colors uppercase font-black text-[10px] tracking-widest">
              Explore Models
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-[#DA222A] group-hover:bg-[#DA222A] transition-all overflow-hidden">
                <ArrowUpRight className="w-5 h-5 group-hover:text-white transition-colors" />
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-12 right-12 z-20 flex gap-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'bg-[#DA222A] w-12' : 'bg-white/40 w-4'}`}
          />
        ))}
      </div>
    </section>
  );
}
