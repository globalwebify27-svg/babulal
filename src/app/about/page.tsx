"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, History, Landmark, Building2, MapPin } from 'lucide-react';

const TIMELINE = [
  { year: "100+ Years", title: "The Foundation", desc: "Shri Babulal Premkumar established the first textile trading post in Main Road, Ranchi, setting the standard for quality in the region." },
  { year: "Expansion", title: "Automotive Expansion", desc: "Leveraging a reputation for trust, the group diversified into two-wheelers, becoming one of the most successful dealerships in Jharkhand." },
  { year: "Logistics", title: "Logistics & Manufacturing", desc: "Strategic entry into Commercial Vehicles with Premsons Poddar Trucking and the birth of MUVA Industries for precision engineering." },
  { year: "Modern Era", title: "Global Digital Hub", desc: "A transition toward high-end B2B exports and digital transformation of the group's operational legacy." },
];

export default function AboutPage() {
  return (
    <div className="bg-canvas">

      {/* LEGACY HERO */}
      <section id="legacy" className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-primary py-24 lg:py-0 lg:h-[70vh]">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(218,34,42,0.15) 0%, transparent 50%)" }} />
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent text-[11px] font-bold uppercase tracking-[.4em] mb-6"
          >
            100+ Years — The Ranchi Legacy
          </motion.h4>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white font-black italic tracking-tighter leading-none mb-8 uppercase"
            style={{ fontSize: 'clamp(2rem, 7vw, 5rem)' }}
          >
            Integrity is our Architecture.
          </motion.h1>
          <p className="text-white/60 text-base lg:text-lg font-medium max-w-2xl mx-auto leading-relaxed italic">
            Babulal Premkumar is a premium textile destination built on the bedrock of trust, dedication, and architectural business excellence.
          </p>
        </div>
      </section>

      {/* THE STORY */}
      <section id="philosophy" className="py-16 lg:py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-32 items-start">

          {/* Left: Philosophy (sticky on desktop) */}
          <div className="lg:sticky lg:top-40">
            <h2 className="text-primary font-extrabold tracking-tight mb-6 leading-[0.9]" style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>
              The Babulal<br /> <span className="text-accent italic font-black uppercase">Philosophy</span>
            </h2>
            <p className="text-primary/60 text-base lg:text-lg font-medium leading-relaxed mb-8 italic">
              &ldquo;Business is not just about commerce; it&apos;s about the legacy you build within your community.&rdquo; — Founder&apos;s Vision.
            </p>
            <div className="space-y-6">
              {[
                { icon: Award, label: "Uncompromising Quality", desc: "From fabrics to 3-wheelers, every product is a promise of group excellence." },
                { icon: Landmark, label: "Ranchi Heritage", desc: "A deep core belief in the growth of Jharkhand and the surrounding region." },
              ].map((v, i) => (
                <div key={i} className="flex items-start gap-4 sm:gap-8 group">
                  <div className="bg-primary w-11 lg:w-16 h-20 lg:h-36 rounded-full shadow-xl shadow-primary/20 text-white flex flex-col items-center pt-4 lg:pt-7 shrink-0 transition-all duration-500 group-hover:bg-accent group-hover:-translate-y-2">
                    <v.icon className="w-4 h-4 lg:w-7 lg:h-7" />
                    <div className="mt-auto mb-4 w-1 h-1 bg-white/20 rounded-full" />
                  </div>
                  <div className="pt-1">
                    <h5 className="text-sm lg:text-xl font-black text-primary tracking-tight mb-2 uppercase italic leading-tight">{v.label}</h5>
                    <p className="text-[10px] lg:text-[12px] font-black text-primary/60 uppercase tracking-[.15em] leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="space-y-16 lg:space-y-40 mt-8 lg:mt-0">
            {TIMELINE.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="text-6xl lg:text-9xl font-black text-primary/5 tracking-tighter absolute -top-8 lg:-top-12 -left-4 lg:-left-12 select-none group-hover:text-accent/10 transition-colors duration-700">{step.year}</div>
                <div className="pl-6 lg:pl-12 border-l border-primary/10 relative z-10">
                  <h4 className="text-[10px] font-bold text-accent uppercase tracking-[.4em] mb-3">Milestone {i + 1}</h4>
                  <h3 className="text-2xl lg:text-4xl font-bold text-primary tracking-tight mb-4">{step.title}</h3>
                  <p className="text-primary/50 text-base font-medium leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SCALE & REACH */}
      <section className="bg-white py-16 lg:py-32 border-t border-surface-dim overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {[
            { icon: Building2, label: "5 Verticals", sub: "Textiles to Automotive" },
            { icon: MapPin, label: "20+ Cities", sub: "Wide Supply Chain" },
            { icon: ShieldCheck, label: "ISO Certified", sub: "Process Excellence" },
            { icon: History, label: "100 Years", sub: "Operational Legacy" }
          ].map((v, i) => (
            <div key={i} className="text-center group">
              <div className="flex justify-center mb-4 lg:mb-6">
                <div className="bg-primary/5 p-5 lg:p-8 rounded-full group-hover:bg-primary transition-all duration-700">
                  <v.icon className="w-6 h-6 lg:w-8 lg:h-8 text-primary group-hover:text-white" />
                </div>
              </div>
              <h5 className="text-[13px] font-bold text-primary uppercase tracking-widest">{v.label}</h5>
              <p className="text-[11px] font-bold text-primary/30 uppercase tracking-[.3em] mt-2">{v.sub}</p>
            </div>
          ))}
        </div>
      </section>



    </div>
  );
}
