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
  X,
  Loader2
} from 'lucide-react';
import Image from 'next/image';

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

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim()) {
      setReviewError('Name is required');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    try {
      const res = await fetch('/api/welcome-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: reviewName,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      if (res.ok) {
        setReviewSuccess(true);
        setReviewName('');
        setReviewRating(5);
        setReviewComment('');
        setTimeout(() => {
          setReviewSuccess(false);
          setShowReviewModal(false);
        }, 2000);
      } else {
        const errData = await res.json();
        setReviewError(errData.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      setReviewError('An unexpected error occurred.');
    } finally {
      setSubmittingReview(false);
    }
  };

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

          <button 
            onClick={() => setShowReviewModal(true)} 
            className="flex flex-col items-center gap-2 group w-full"
          >
            <div className="w-14 h-14 mx-auto bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-white shadow-sm">
              <Star className="w-6 h-6 fill-current" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Reviews</span>
          </button>
        </div>

        {/* ═══ SHOPPING GUIDE VIDEO ═══ */}
        {embedVideoUrl && (
          <section className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-slate-100/50 animate-reveal" style={{ animationDelay: '200ms' }}>
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
        <section className="bg-gradient-to-br from-[#FEF9E7] to-[#FDF2E9] rounded-[2rem] p-6 shadow-2xl border border-amber-200/50 relative overflow-hidden group transition-all duration-300 hover:shadow-amber-100/50 animate-reveal" style={{ animationDelay: '250ms' }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/10 rotate-45 translate-x-12 -translate-y-12 pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 flex-shrink-0 animate-pulse">
              <Star className="w-7 h-7 fill-current text-white" />
            </div>
            <div className="space-y-3 flex-1 text-left">
              <h4 className="font-black uppercase tracking-tight text-amber-950 text-sm italic">Share Your Experience</h4>
              <p className="text-xs text-amber-900/80 leading-relaxed font-semibold">
                We strive to provide the best service. Please take a moment to leave a review and guide others.
              </p>
              <button 
                onClick={() => setShowReviewModal(true)}
                className="inline-flex items-center gap-2 bg-[#095181] text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:opacity-95 transition-all shadow-lg shadow-[#095181]/25 hover:-translate-y-0.5"
              >
                Write Review <Star className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          </div>
        </section>

        {/* ═══ COMPANY INTRODUCTION ═══ */}
        <section className="bg-white rounded-[2rem] p-6 md:p-8 shadow-2xl border border-slate-100/50 space-y-4 animate-reveal" style={{ animationDelay: '300ms' }}>
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
        <section className="bg-white rounded-[2rem] p-6 shadow-2xl border border-slate-100/50 flex items-start gap-4 animate-reveal" style={{ animationDelay: '350ms' }}>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 flex-shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1 text-left">
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
        <section className="space-y-4 animate-reveal" style={{ animationDelay: '400ms' }}>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Babulal Premsons Group Verticals</h4>
          <div className="space-y-3">
            {VERTICALS.map((vert) => (
              <a 
                key={vert.name}
                href={vert.href}
                className={`bg-white rounded-2xl p-4 shadow-lg border border-slate-100/50 hover:border-primary/20 flex items-center justify-between group transition-all duration-300 hover:-translate-y-0.5 ${vert.color}`}
              >
                <div className="space-y-0.5 text-left">
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
        className={`fixed bottom-4 inset-x-4 z-[90] md:hidden bg-primary/95 text-white rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(9,81,129,0.3)] backdrop-blur-lg pb-safe h-16 px-4 transition-all duration-500 ease-out transform ${
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

          <button 
            onClick={() => setShowReviewModal(true)}
            className="flex flex-col items-center justify-center flex-1 h-full text-white/80 active:scale-95 transition-all border-l border-white/5"
          >
            <Star className="w-5 h-5 text-amber-400 fill-current" />
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">Reviews</span>
          </button>

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

      {/* ═══ CUSTOMER REVIEW MODAL ═══ */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-reveal">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative animate-reveal">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-[#063352] to-primary text-white">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-current" />
                <h3 className="font-black uppercase tracking-tight text-sm italic">Submit Feedback</h3>
              </div>
              <button 
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleReviewSubmit} className="p-6 space-y-6 text-left">
              {reviewSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <Star className="w-8 h-8 fill-current" />
                  </div>
                  <h4 className="font-black text-slate-800 uppercase tracking-tight text-base">Thank You!</h4>
                  <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                    Your feedback has been successfully submitted. We appreciate your response.
                  </p>
                </div>
              ) : (
                <>
                  {reviewError && (
                    <div className="bg-red-50 text-red-800 p-4 rounded-xl text-xs font-bold border border-red-100">
                      {reviewError}
                    </div>
                  )}

                  {/* Name field */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none transition-all"
                    />
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1 transition-all duration-150 transform hover:scale-125"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              star <= (hoveredRating || reviewRating) 
                                ? 'text-amber-400 fill-current' 
                                : 'text-slate-200'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comments field */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Comments (Optional)</label>
                    <textarea 
                      placeholder="Share your shopping experience with us..."
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-xs font-bold text-slate-800 outline-none transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-[#095181] text-white font-black text-xs uppercase tracking-widest py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-[#095181]/20 active:scale-95 disabled:opacity-50"
                  >
                    {submittingReview ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                      </>
                    ) : (
                      'Submit Feedback'
                    )}
                  </button>
                </>
              )}
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
