"use client";

import React, { useState } from 'react';
import HondaHeader from './components/HondaHeader';
import HondaFooter from './components/HondaFooter';
import HondaHero from './components/HondaHero';
import HondaValuePillars from './components/HondaValuePillars';
import HondaLegacy from './components/HondaLegacy';
import HondaServiceExcellence from './components/HondaServiceExcellence';
import HondaShowroomLocator from './components/HondaShowroomLocator';
import TestRideModal from './components/TestRideModal';

export default function HondaVerticalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  return (
    <div className="bg-white min-h-screen font-sans antialiased text-gray-900 overflow-x-hidden">
      {/* ═══ REDESIGNED AUTOMOTIVE NAVIGATION ENGINE ═══ */}
      <HondaHeader onTestRideClick={openModal} />

      <main>
        {/* ═══ HERO — THE AUTOMOTIVE EXHIBITION ═══ */}
        <HondaHero onTestRideClick={openModal} />

        {/* ═══ INSTITUTIONAL VALUE PILLARS ═══ */}
        <HondaValuePillars />

        {/* ═══ THE LEGACY — QUANTIFYING TRUST ═══ */}
        <HondaLegacy />



        {/* ═══ SERVICE EXCELLENCE — THE CLINICAL AUTOMOTIVE LAB ═══ */}
        <HondaServiceExcellence />

        {/* ═══ SHOWROOM LOCATOR — STRATEGIC HUB ACCESS ═══ */}
        <HondaShowroomLocator onTestRideClick={openModal} />
      </main>

      {/* ═══ REDESIGNED VELOCITY LAB FOOTER ═══ */}
      <HondaFooter />

      {/* ═══ GLOBAL TEST RIDE MODAL ═══ */}
      <TestRideModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
