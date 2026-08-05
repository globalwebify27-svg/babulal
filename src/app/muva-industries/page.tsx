"use client";

import React from 'react';
import MuvaHeader from './components/MuvaHeader';
import MuvaHero from './components/MuvaHero';
import MuvaValuePillars from './components/MuvaValuePillars';
import MuvaLegacy from './components/MuvaLegacy';
import MuvaFooter from './components/MuvaFooter';

export default function MuvaVerticalPage() {
  return (
    <div className="bg-white min-h-screen font-sans antialiased text-gray-900 overflow-x-hidden">
      {/* ═══ TECHNICAL NAVIGATION ═══ */}
      <MuvaHeader />

      <main>
        {/* ═══ HERO — PRECISION CRAFTED ═══ */}
        <MuvaHero />

        {/* ═══ DOMAINS OF ENGINEERING ═══ */}
        <MuvaValuePillars />

        {/* ═══ TITANIUM ROOTS — THE 100+ YEARS LEGACY ═══ */}
        <MuvaLegacy />

        {/* ═══ MANUFACTURING CALL TO ACTION ═══ */}
        <section className="py-24 bg-white border-y border-gray-100 flex items-center justify-center">
           <div className="text-center space-y-12 max-w-4xl px-6">
              <h2 className="text-[#073E62] text-4xl lg:text-6xl font-black uppercase tracking-tighter">
                Engineering <span className="text-[#DA222A] italic">Partner</span> of Choice.
              </h2>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-10 text-[10px] font-black uppercase tracking-[.6em] text-gray-300">
                 <span>Strategic R&D</span>
                 <div className="hidden sm:block w-2 h-2 rounded-full bg-[#DA222A]" />
                 <span>Precision Casting</span>
                 <div className="hidden sm:block w-2 h-2 rounded-full bg-[#DA222A]" />
                 <span>High-Volume Production</span>
              </div>
           </div>
        </section>
      </main>

      {/* ═══ INDUSTRIAL FOOTER ═══ */}
      <MuvaFooter />
    </div>
  );
}
