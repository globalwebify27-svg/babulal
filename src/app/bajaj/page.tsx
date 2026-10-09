"use client";

import React, { useState } from 'react';
import BajajHeader from './components/BajajHeader';
import BajajFooter from './components/BajajFooter';
import BajajHero from './components/BajajHero';
import BajajValuePillars from './components/BajajValuePillars';
import BajajLegacy from './components/BajajLegacy';
import BajajServiceExcellence from './components/BajajServiceExcellence'; 
import BajajShowroomLocator from './components/BajajShowroomLocator';
import StoreLocatorModal from '@/components/StoreLocatorModal';

export default function BajajVerticalPage() {
  const [isStoreLocatorOpen, setIsStoreLocatorOpen] = useState(false);

  const openStoreLocator = () => setIsStoreLocatorOpen(true);

  return (
    <div className="bg-white min-h-screen font-sans antialiased text-gray-900 overflow-x-hidden">
      {/* ═══ REDESIGNED BAJAJ NAVIGATION ENGINE ═══ */}
      <BajajHeader onTestRideClick={openStoreLocator} />

      <main>
        {/* ═══ HERO — THE BAJAJ EXHIBITION ═══ */}
        <BajajHero onTestRideClick={openStoreLocator} />

        {/* ═══ INSTITUTIONAL VALUE PILLARS ═══ */}
        <BajajValuePillars />

        {/* ═══ THE LEGACY — QUANTIFYING TRUST ═══ */}
        <BajajLegacy />

        {/* ═══ SERVICE EXCELLENCE ═══ */}
        <BajajServiceExcellence />

        {/* ═══ SHOWROOM LOCATOR — STRATEGIC HUB ACCESS ═══ */}
        <BajajShowroomLocator onTestRideClick={openStoreLocator} />
      </main>

      {/* ═══ BAJAJ VELOCITY FOOTER ═══ */}
      <BajajFooter />

      {/* ═══ GLOBAL STORE LOCATOR MODAL ═══ */}
      <StoreLocatorModal isOpen={isStoreLocatorOpen} onClose={() => setIsStoreLocatorOpen(false)} />
    </div>
  );
}
