"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Users } from 'lucide-react';
import { BUSINESS_VERTICALS } from '@/lib/constants';
import { Haptics } from '@/lib/haptics';

export default function GroupHomepage() {
  return (
    <div className="bg-canvas">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[80vh] lg:h-screen bg-primary overflow-hidden flex items-center">

        {/* Cinematic Background */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1.02, opacity: 1 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/hero_rich.png"
            alt="Babulal Premsons Headquarters"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/40" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-24 grid lg:grid-cols-12 gap-6 lg:gap-10 items-center pt-16 lg:pt-28">

          {/* Left: Narrative */}
          <div className="lg:col-span-8">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex items-center gap-3 mb-4 lg:mb-8"
            >
              <span className="w-6 lg:w-12 h-[2px] bg-accent shrink-0" />
              <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-[.15em] lg:tracking-[.6em] text-white/90 whitespace-nowrap">
                Est. 1978 — Ranchi, Jharkhand
              </span>
            </motion.div>

            {/* Heading */}
            <div className="mb-4 lg:mb-10">
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-white font-black uppercase tracking-tighter leading-[0.88] drop-shadow-2xl"
                style={{ fontSize: 'clamp(2.5rem, 11vw, 6.5rem)' }}
              >
                Building<br />
                <span className="text-accent italic relative">
                  Trust.
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 2, duration: 1.5 }}
                    className="absolute -bottom-1 left-0 w-full h-1 bg-accent/40 origin-left"
                  />
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-2 lg:mt-4 hidden sm:block"
              >
                <div className="text-white/40 font-black uppercase tracking-[.15em] lg:tracking-[.3em] text-sm lg:text-xl">
                  Defining Legacy.
                </div>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 1 }}
              className="text-white/70 text-sm lg:text-lg font-medium leading-relaxed mb-6 lg:mb-10 border-l-2 border-accent/40 pl-4 lg:pl-10"
              suppressHydrationWarning
            >
              <span className="sm:hidden">Multi-sector conglomerate. 100+ years of excellence across Jharkhand.</span>
              <span className="hidden sm:inline">A diversified multi-billion dollar conglomerate governing strategic business verticals across Jharkhand with 100+ years of excellence.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.1, duration: 0.8 }}
              className="flex flex-wrap items-center gap-4 lg:gap-8"
            >
              <Link
                href="/contact"
                onClick={() => Haptics.medium()}
                className="group relative px-7 py-4 lg:px-10 lg:py-5 bg-accent text-white font-black uppercase tracking-[.2em] lg:tracking-[.3em] text-xs hover:bg-accent/90 transition-all overflow-hidden"
              >
                <span className="relative z-10 transition-transform group-hover:-translate-y-1 block">Enquire Now</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Link>
              <Link
                href="/about"
                onClick={() => Haptics.light()}
                className="group flex items-center gap-3 lg:gap-4 text-white/60 hover:text-white font-bold uppercase tracking-[.2em] text-[11px] transition-colors"
              >
                Learn More
                <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all duration-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Right: Stats (Desktop only) */}
          <div className="hidden lg:block lg:col-span-4 h-full relative pt-16">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 2.5, duration: 1.2 }}
              className="bg-white/[0.08] backdrop-blur-xl border border-white/10 p-12 relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-3xl rounded-full" />
              <div className="relative z-10 space-y-12">
                {[
                  { val: '100+', lbl: 'Years of Institutional Presence' },
                  { val: '5', lbl: 'Strategic Business Verticals' },
                  { val: '50K+', lbl: 'Network of Partners' },
                ].map((stat) => (
                  <div key={stat.lbl} className="group/stat">
                    <div className="text-4xl font-black text-white tracking-tight italic mb-2 group-hover/stat:text-accent transition-colors">
                      {stat.val}
                    </div>
                    <div className="text-[10px] font-black text-white/70 uppercase tracking-[.3em] leading-relaxed">
                      {stat.lbl}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-4 opacity-30"
        >
          <span className="text-[9px] font-black uppercase tracking-[.5em] text-white">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* Mobile Stats Strip */}
      <div className="lg:hidden bg-primary grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
        {[
          { val: '100+', lbl: 'Years' },
          { val: '5', lbl: 'Verticals' },
          { val: '50K+', lbl: 'Partners' },
        ].map((stat) => (
          <div key={stat.lbl} className="p-4 text-center">
            <div className="text-xl font-black text-accent italic">{stat.val}</div>
            <div className="text-[9px] font-black text-white/50 uppercase tracking-[.15em] mt-0.5">{stat.lbl}</div>
          </div>
        ))}
      </div>

      {/* ═══ PORTFOLIO ═══ */}
      <section id="divisions" className="bg-white py-20 lg:py-40 overflow-hidden">
        <div className="max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-24">

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12 mb-16 lg:mb-32 border-b border-primary/5 pb-10 lg:pb-16">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-6 lg:mb-8"
              >
                <div className="w-8 lg:w-12 h-[2px] bg-accent" />
                <span className="text-[10px] font-black uppercase tracking-[.5em] text-primary/40">Division of Power</span>
              </motion.div>
              <h2 className="text-primary font-black uppercase tracking-tighter leading-[0.85]" style={{ fontSize: 'clamp(2.5rem, 7vw, 7rem)' }}>
                Governing <br /><span className="text-accent italic">Diversity.</span>
              </h2>
            </div>
            <p className="max-w-sm text-primary/45 text-base lg:text-lg font-medium italic leading-relaxed border-l-2 border-accent/20 pl-6 lg:pl-10">
              India&apos;s legacy in retail textiles since 1978.
            </p>
          </div>

          {/* PORTFOLIO GRID */}
          {/* PORTFOLIO GRID - DYNAMIC BENTO STYLE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-10">

            {/* 01: TEXTILES (Main Legacy) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="lg:col-span-8 h-[400px] lg:h-[650px] group relative overflow-hidden bg-primary rounded-[0.5rem] lg:rounded-none"
            >
              <Link href="/textiles" className="block h-full">
                <Image src="/vertical_textiles.png" alt="Textiles" fill className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1500ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-10 lg:bottom-16 left-10 lg:left-16 z-10">
                  <span className="text-accent text-[9px] font-black uppercase tracking-[.4em] mb-3 block">Est. 1978</span>
                  <h3 className="text-white text-3xl lg:text-5xl font-black uppercase tracking-tighter italic">Babulal <br /><span className="text-white/40 group-hover:text-white">Premkumar.</span></h3>
                </div>
                <div className="absolute bottom-10 lg:bottom-16 right-10 lg:right-16">
                  <ArrowUpRight className="w-8 h-8 text-white/30 group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </Link>
            </motion.div>

            {/* 02: HONDA (Modern Mobility) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-4 h-[400px] lg:h-[650px] group relative overflow-hidden bg-primary"
            >
              <Link href="/honda" className="block h-full">
                <Image src="/vertical_honda.png" alt="Honda" fill className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10 z-10">
                  <span className="text-accent text-[9px] font-black uppercase tracking-[.4em] mb-2 block">Automotive</span>
                  <h3 className="text-white text-3xl font-black uppercase tracking-tighter">Premsons <br />Honda.</h3>
                </div>
              </Link>
            </motion.div>

            {/* 03: TRUCKING (Industrial Strength) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-6 h-[400px] lg:h-[500px] group relative overflow-hidden bg-[#1B365D]"
            >
              <Link href="/trucking" className="block h-full">
                <Image src="/vertical_trucks.png" alt="Trucking" fill className="object-cover opacity-50 grayscale group-hover:grayscale-0 transition-transform duration-[2s]" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
                <div className="absolute bottom-10 left-10 z-10">
                  <span className="text-accent text-[9px] font-black uppercase tracking-[.4em] mb-2 block">Logistics</span>
                  <h3 className="text-white text-3xl font-black uppercase tracking-tighter">Premsons <br />Motors.</h3>
                </div>
              </Link>
            </motion.div>

            {/* 04: BAJAJ (Logistics Hub) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 h-[400px] lg:h-[500px] group relative overflow-hidden bg-[#0A5181]"
            >
              <Link href="/bajaj" className="block h-full">
                <Image src="/vertical_bajaj.png" alt="Bajaj" fill className="object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-10 left-10 z-10">
                  <span className="text-accent text-[9px] font-black uppercase tracking-[.4em] mb-2 block">Transport</span>
                  <h4 className="text-white text-2xl font-black uppercase tracking-tighter">Premsons <br />Bajaj.</h4>
                </div>
              </Link>
            </motion.div>

            {/* 05: MANUFACTURING (MUVA) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-3 h-[400px] lg:h-[500px] group relative overflow-hidden bg-[#2D2D2D]"
            >
              <Link href="/muva-industries" className="block h-full">
                <Image src="/vertical_manufacturing.png" alt="Manufacturing" fill className="object-cover opacity-50 grayscale group-hover:grayscale-0 shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-10 left-10 z-10">
                  <span className="text-accent text-[9px] font-black uppercase tracking-[.4em] mb-2 block">Engineering</span>
                  <h4 className="text-white text-2xl font-black uppercase tracking-tighter">MUVA <br />Industries.</h4>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STATS & LEGACY ═══ */}
      <section className="bg-white py-20 lg:py-40 overflow-hidden">
        <div className="max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 bg-primary relative overflow-hidden group p-10 lg:p-16 flex flex-col justify-between min-h-[300px] lg:min-h-[500px]"
            >
              <Image src="/hero_rich.png" alt="Legacy" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover opacity-20 grayscale" />
              <div className="relative z-10">
                <h3 className="text-white font-black tracking-tighter leading-none italic" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}>
                  100<span className="text-accent">+</span>
                </h3>
                <div className="text-accent font-black uppercase tracking-[.3em] text-base lg:text-xl mt-3">Years of Influence</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="lg:col-span-5 bg-surface-dim p-10 lg:p-12 flex flex-col justify-center items-center text-center border border-primary/5 min-h-[250px]"
            >
              <h3 className="text-primary font-black tracking-tighter leading-none mb-4" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)' }}>
                50K<span className="text-accent">+</span>
              </h3>
              <div className="text-primary font-bold uppercase tracking-[.4em] text-xs">Trusted Partners</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CAREERS ═══ */}
      <section className="bg-canvas py-20 lg:py-40 overflow-hidden border-t border-primary/5">
        <div className="max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">

            {/* Text */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <div className="w-12 h-px bg-accent mb-8 lg:mb-12" />
                <h2 className="text-primary font-black uppercase tracking-tighter leading-none mb-8" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
                  Career <br /><span className="text-accent italic">Legacy.</span>
                </h2>
                <div className="space-y-4 text-primary/60 text-base font-medium leading-relaxed italic">
                  <p>Joining the Babulal Premsons Group transforms your professional journey into a legacy.</p>
                  <p>An environment defined by innovation, precision, and institutional collaboration.</p>
                </div>
                <div className="mt-10 lg:mt-16">
                  <Link href="/careers" className="group flex items-center gap-5">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full border border-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                      <ArrowUpRight className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <span className="text-primary font-black uppercase tracking-[.3em] text-xs">Join our ecosystem</span>
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Subsidiaries Card */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-white p-10 lg:p-16 shadow-xl border border-primary/5 relative overflow-hidden"
              >
                <div className="relative z-10 space-y-8 lg:space-y-12">
                  <div className="text-center pb-6 border-b border-primary/5">
                    <span className="text-accent text-[10px] font-black uppercase tracking-[.4em]">Our Subsidiaries</span>
                  </div>
                  <div className="space-y-6 lg:space-y-10">
                    {[
                      'Babulal Premkumar Textiles',
                      'Premsons Honda & Bajaj',
                      'Ashok Leyland Distribution',
                      'MUVA Engineering Hub'
                    ].map((name) => (
                      <div key={name} className="flex justify-center grayscale hover:grayscale-0 transition-all duration-500 opacity-60 hover:opacity-100">
                        <span className="text-2xl font-black tracking-tighter uppercase text-center text-primary">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Team Image */}
            <div className="lg:col-span-4 h-[380px] sm:h-[500px] lg:h-[800px] relative order-first lg:order-last">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="h-full w-full relative overflow-hidden shadow-2xl"
              >
                <Image src="/team_branded.png" alt="Babulal Premsons Team" fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                <div className="absolute bottom-8 left-6 right-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-white text-[10px] font-black uppercase tracking-[.4em] mb-1">Team Collective</span>
                    <span className="text-white/60 text-xs italic font-medium leading-relaxed hidden sm:block">
                      Defining the backbone of Jharkhand&apos;s commercial success.
                    </span>
                  </div>
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <Users className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
