"use client";

import React, { useState } from 'react';
import { 
  Star, 
  MessageCircle, 
  ArrowLeft, 
  Loader2,
  CheckCircle,
  Phone,
  MapPin,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface FeedbackClientProps {
  data: {
    welcomeTitle: string;
    contactPhone: string;
    whatsappNumber: string;
    address: string;
    googleMapsUrl: string;
  };
}

export default function FeedbackClient({ data }: FeedbackClientProps) {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Your Name is required');
      return;
    }
    if (!mobileNumber.trim()) {
      setError('Mobile Number is required');
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/welcome-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          mobileNumber: mobileNumber,
          rating: rating,
          comment: comment,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setName('');
        setMobileNumber('');
        setRating(5);
        setComment('');
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to submit feedback');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  const cleanWhatsappNumber = data.whatsappNumber ? data.whatsappNumber.replace(/[^0-9]/g, '') : '';
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=Hello%20Babulal%20Premkumar,%20I%20have%20submitted%20my%20feedback!`;

  return (
    <div className="bg-[#F4F6F9] min-h-screen text-slate-800 font-sans leading-relaxed selection:bg-accent selection:text-white pb-32">
      
      {/* ═══ HEADER ═══ */}
      <header className="bg-gradient-to-b from-[#063352] to-[#095181] text-white relative overflow-hidden py-16 px-6 text-center shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="max-w-xl mx-auto relative z-10 space-y-4">
          
          <div className="flex justify-between items-center">
            <Link 
              href="/welcome" 
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-white transition-colors bg-white/10 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            
            <div className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/40 select-none">
              RANCHI, JH
            </div>
          </div>

          <div className="relative w-44 h-16 mx-auto bg-white rounded-2xl p-3 shadow-md flex items-center justify-center border border-white">
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

          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-[0.25em] px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-400" /> Share Your Experience
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase italic text-white leading-tight">
            Store Feedback
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 -mt-8 relative z-20">
        
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100/50 text-left">
          
          {success ? (
            <div className="py-12 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Feedback Submitted!</h2>
              <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
                Thank you for your valuable response. Your feedback has been sent directly to the store manager.
              </p>
              
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  href="/welcome"
                  className="w-full bg-[#095181] text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#095181]/25 hover:opacity-95 active:scale-95 transition-all text-center"
                >
                  Return to Portal
                </Link>
                
                {data.whatsappNumber && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-500 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-green-500/25 hover:opacity-95 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" /> Connect on WhatsApp
                  </a>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="bg-[#f8fafc] border border-slate-100 p-4 rounded-2xl">
                <h3 className="font-black text-[#095181] uppercase text-xs mb-1">Dear Customer,</h3>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                  We really appreciate you as our valued customer. To help us improve our service, we would like to have your feedback.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-2xl text-xs font-bold border border-red-100">
                  {error}
                </div>
              )}

              {/* Name field */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Your Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3.5 text-xs font-bold text-slate-800 outline-none transition-all"
                />
              </div>

              {/* Mobile Number field */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Mobile Number *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="Enter Your Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3.5 text-xs font-bold text-slate-800 outline-none transition-all"
                />
              </div>

              {/* Rating Selector */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Give us your rating *</label>
                  <span className="text-[10px] font-black text-[#095181] uppercase tracking-wider">
                    {rating === 5 ? 'Excellent' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Very Poor'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-[#f8fafc] p-4 rounded-xl border border-slate-100">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-0.5 transition-all duration-150 transform hover:scale-125 focus:outline-none"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || rating) 
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
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Remark (Optional)</label>
                <textarea 
                  placeholder="Share details of your own experience"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3.5 text-xs font-bold text-slate-800 outline-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#095181] text-white font-black text-xs uppercase tracking-widest py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-[#095181]/25 active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>

            </form>
          )}

        </div>

        {/* ═══ STORE INFO FOOTER ═══ */}
        <div className="mt-8 bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-slate-100 flex items-start gap-4 text-left">
          <MapPin className="w-6 h-6 text-[#095181] flex-shrink-0" />
          <div className="space-y-1">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Our Address</h4>
            <p className="text-[10px] text-slate-700 font-bold leading-tight">{data.address}</p>
          </div>
        </div>

      </main>

    </div>
  );
}
