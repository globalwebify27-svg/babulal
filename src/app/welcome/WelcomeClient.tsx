"use client";

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Video, 
  Star, 
  Compass, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Home,
  MessageCircle,
  Gift,
  Coins
} from 'lucide-react';
import Image from 'next/image';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface WelcomeClientProps {
  data: {
    welcomeTitle: string;
    welcomeMessage: string;
    introTitle: string;
    introContent: string;
    videoUrl: string;
    videoTitle: string;
    feedbackUrl: string;
    contactPhone: string;
    contactEmail: string;
    address: string;
    googleMapsUrl: string;
    whatsappNumber: string;
  };
}

export default function WelcomeClient({ data }: WelcomeClientProps) {
  const [showBottomMenu, setShowBottomMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      // Show bottom menu after scrolling down 150px
      if (window.scrollY > 150) {
        setShowBottomMenu(true);
      } else {
        setShowBottomMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to format WhatsApp message link
  const cleanWhatsappNumber = data.whatsappNumber ? data.whatsappNumber.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=Hello%20Babulal%20Premkumar,%20I%20just%20visited%20your%20store!`;

  // Check if videoUrl is embeddable or YouTube URL
  let embedVideoUrl = data.videoUrl;
  if (data.videoUrl && data.videoUrl.includes('youtube.com/watch')) {
    try {
      const urlObj = new URL(data.videoUrl);
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        embedVideoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {}
  } else if (data.videoUrl && data.videoUrl.includes('youtu.be/')) {
    try {
      const videoId = data.videoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        embedVideoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {}
  } else if (data.videoUrl && data.videoUrl.includes('youtube.com/shorts/')) {
    try {
      const videoId = data.videoUrl.split('youtube.com/shorts/')[1]?.split('?')[0];
      if (videoId) {
        embedVideoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {}
  }

  const isShorts = data.videoUrl && (data.videoUrl.includes('/shorts/') || data.videoUrl.includes('youtube.com/shorts'));

  const VERTICALS = [
    { name: 'Textiles & Handloom', href: '/textiles', desc: 'Premium ethnic wear & custom tailoring', color: 'border-l-4 border-amber-500' },
    { name: 'Honda Two-Wheelers', href: '/honda', desc: 'Authorized sales, service & spares', color: 'border-l-4 border-red-600' },
    { name: 'Bajaj Motorcycles', href: '/bajaj', desc: 'Explore the performance range', color: 'border-l-4 border-blue-600' },
    { name: 'Commercial Trucking', href: '/trucking', desc: 'Ashok Leyland commercial partner', color: 'border-l-4 border-slate-600' },
    { name: 'Muva Industries', href: '/muva-industries', desc: 'Industrial and manufacturing solutions', color: 'border-l-4 border-emerald-600' },
  ];

  return (
    <div className="bg-[#F4F6F9] min-h-screen text-slate-800 font-sans leading-relaxed selection:bg-accent selection:text-white pb-32">
      
      {/* ═══ BRANDING HEADER ═══ */}
      <header className="bg-gradient-to-b from-[#063352] to-primary text-white relative overflow-hidden py-24 px-6 text-center shadow-xl">
        {/* Symmetrical Corner Identifiers */}
        {mounted && (
          <>
            <div className="absolute top-6 left-6 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/40 pointer-events-none select-none">
              ESTD. 1978
            </div>
            <div className="absolute top-6 right-6 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/40 pointer-events-none select-none">
              RANCHI, JH
            </div>
          </>
        )}

        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-accent/[0.04] rounded-full translate-y-1/2 pointer-events-none animate-pulse" />

        <div className="max-w-xl mx-auto relative z-10 space-y-6">
          <div className="relative w-52 h-20 mx-auto bg-white rounded-3xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center border border-white animate-reveal">
            <div className="relative w-full h-full">
              <Image 
                src="/babulal_premsons.avif" 
                alt="Babulal Premsons Group Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-400" /> Valued Customer Portal
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic text-white leading-tight">
            {data.welcomeTitle}
          </h1>
          
          <p className="text-sm md:text-base text-white/80 leading-relaxed font-medium max-w-lg mx-auto">
            {data.welcomeMessage}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 -mt-10 relative z-20 space-y-8">
        
        {/* ═══ QUICK CONNECT CARD (4-COLUMNS) ═══ */}
        <div className="bg-white rounded-[2rem] p-6 shadow-2xl border border-slate-100/50 grid grid-cols-4 gap-2 text-center items-start animate-reveal" style={{ animationDelay: '100ms' }}>
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-green-500 group-hover:text-white shadow-sm">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">WhatsApp</span>
          </a>

          <a 
            href={`tel:${data.contactPhone}`}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white shadow-sm">
              <Phone className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Call Us</span>
          </a>

          <a 
            href={data.googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent transition-all duration-300 group-hover:scale-105 group-hover:bg-accent group-hover:text-white shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Directions</span>
          </a>

          <a 
            href={data.feedbackUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white shadow-sm">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Reviews</span>
          </a>
        </div>

        {/* ═══ ATTRACTIVE FOLLOW TO WIN CASH PRIZE SECTION ═══ */}
        <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden text-white border-2 border-pink-500/20 group animate-reveal" style={{ animationDelay: '200ms' }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-start mb-6">
            <div className="bg-amber-400/20 border border-amber-400/40 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400 animate-spin" /> Limited Campaign
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 shadow-inner">
              <Gift className="w-6 h-6 animate-bounce" />
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <h3 className="text-2xl font-black uppercase italic tracking-tight leading-tight flex flex-col gap-1">
              <span>Follow Us &</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 pr-3 pb-1">
                Win Cash Prizes!
              </span>
            </h3>
            
            <p className="text-xs text-purple-200 font-semibold leading-relaxed">
              We appreciate your business! Follow our official handle on Instagram, stay tuned, and stand a chance to win mega cash rewards & gift vouchers.
            </p>

            <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/10 text-center">
              <div className="space-y-1">
                <div className="text-[10px] font-black text-amber-400 uppercase">Step 1</div>
                <div className="text-[10px] font-bold text-white/90">Click Follow</div>
              </div>
              <div className="space-y-1 border-x border-white/10">
                <div className="text-[10px] font-black text-amber-400 uppercase">Step 2</div>
                <div className="text-[10px] font-bold text-white/90">Like Reels</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-black text-amber-400 uppercase">Step 3</div>
                <div className="text-[10px] font-bold text-white/90">Win Weekly</div>
              </div>
            </div>

            <div className="pt-2">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-xs uppercase tracking-widest py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-0.5 active:scale-95 group/btn relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-shimmer" />
                <InstagramIcon className="w-5 h-5 animate-pulse" />
                Follow us on Instagram
              </a>
            </div>
          </div>
        </section>

        {/* ═══ SHOPPING GUIDE VIDEO ═══ */}
        {embedVideoUrl && (
          <section className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100/50 animate-reveal" style={{ animationDelay: '300ms' }}>
            <div className="p-6 border-b border-slate-50 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="font-black text-slate-800 uppercase tracking-tighter text-sm italic">{data.videoTitle || 'Shopping Guide'}</h3>
            </div>
            <div className={`relative w-full bg-slate-950 ${(mounted && isShorts) ? 'aspect-[9/16] max-w-[340px] mx-auto my-4 rounded-2xl overflow-hidden' : 'aspect-video'}`}>
              <iframe 
                src={embedVideoUrl}
                title={data.videoTitle || 'Shopping Guide'}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </div>
          </section>
        )}

        {/* ═══ CUSTOMER FEEDBACK LINK ═══ */}
        {data.feedbackUrl && (
          <section className="bg-gradient-to-br from-[#FEF9E7] to-[#FDF2E9] rounded-[2rem] p-6 shadow-2xl border border-amber-200/50 relative overflow-hidden group transition-all duration-300 hover:shadow-amber-100/50 animate-reveal" style={{ animationDelay: '350ms' }}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/10 rotate-45 translate-x-12 -translate-y-12 pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 flex-shrink-0">
                <Star className="w-7 h-7 fill-current text-white" />
              </div>
              <div className="space-y-3 flex-1">
                <h4 className="font-black uppercase tracking-tight text-amber-950 text-sm italic">Share Your Experience</h4>
                <p className="text-xs text-amber-900/80 leading-relaxed font-semibold">
                  We strive to provide the best service. Please take a moment to leave a review and guide others.
                </p>
                <a 
                  href={data.feedbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#095181] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-[#095181]/25 hover:-translate-y-0.5"
                >
                  Write Google Review <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* ═══ COMPANY INTRODUCTION ═══ */}
        <section className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100/50 space-y-4 animate-reveal" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-black text-slate-800 uppercase tracking-tighter text-sm italic">{data.introTitle || 'Our Legacy'}</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {data.introContent}
          </p>
        </section>

        {/* ═══ STORE ADDRESS ═══ */}
        <section className="bg-white rounded-[2rem] p-6 shadow-2xl border border-slate-100/50 flex items-start gap-4 animate-reveal" style={{ animationDelay: '450ms' }}>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Our Showroom Address</h4>
            <p className="text-xs text-slate-700 font-bold leading-tight">{data.address}</p>
            {data.googleMapsUrl && (
              <a 
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[9px] font-black text-accent uppercase tracking-widest pt-2 hover:underline"
              >
                Get Directions <ChevronRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </section>

        {/* ═══ GROUP DIVISIONS ═══ */}
        <section className="space-y-4 animate-reveal" style={{ animationDelay: '500ms' }}>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Babulal Premsons Group Verticals</h4>
          <div className="space-y-3">
            {VERTICALS.map((vert) => (
              <a 
                key={vert.name}
                href={vert.href}
                className={`bg-white rounded-2xl p-4 shadow-lg border border-slate-100/50 hover:border-primary/20 flex items-center justify-between group transition-all duration-300 hover:-translate-y-0.5 ${vert.color}`}
              >
                <div className="space-y-0.5">
                  <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors">{vert.name}</h5>
                  <p className="text-[10px] text-slate-500 font-semibold">{vert.desc}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ═══ FOOTER LOGO & COPYRIGHT ═══ */}
        <footer className="text-center space-y-3 pt-6 border-t border-slate-200/50">
          <div className="relative w-36 h-10 mx-auto opacity-30 grayscale">
            <Image 
              src="/babulal_premsons.avif" 
              alt="Babulal Premsons Group Logo" 
              fill
              className="object-contain"
            />
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
            © {new Date().getFullYear()} Babulal Premsons Group. All rights reserved.
          </p>
        </footer>

      </main>

      {/* ═══ MOBILE BOTTOM NAVIGATION MENU (SLIDE-IN ON SCROLL) ═══ */}
      <div 
        className={`fixed bottom-4 inset-x-4 z-[100] md:hidden bg-primary/95 text-white rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(9,81,129,0.3)] backdrop-blur-lg pb-safe h-16 px-4 transition-all duration-500 ease-out transform ${
          showBottomMenu ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-28 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between h-full">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center flex-1 h-full text-white/80 active:scale-95 transition-all"
          >
            <Home className="w-5 h-5 text-white" />
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">Welcome</span>
          </button>

          <a 
            href={data.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center flex-1 h-full text-white/80 active:scale-95 transition-all border-l border-white/5"
          >
            <MapPin className="w-5 h-5 text-amber-400" />
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">Directions</span>
          </a>

          <a 
            href={data.feedbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center flex-1 h-full text-white/80 active:scale-95 transition-all border-l border-white/5"
          >
            <Star className="w-5 h-5 text-amber-400 fill-current" />
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">Reviews</span>
          </a>

          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center flex-1 h-full text-white/80 active:scale-95 transition-all border-l border-white/5"
          >
            <MessageCircle className="w-5 h-5 text-green-400" />
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">WhatsApp</span>
          </a>

          <a 
            href={`tel:${data.contactPhone}`}
            className="flex flex-col items-center justify-center flex-1 h-full text-white/80 active:scale-95 transition-all border-l border-white/5"
          >
            <Phone className="w-5 h-5 text-rose-400" />
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">Call Store</span>
          </a>
        </div>
      </div>

    </div>
  );
}
