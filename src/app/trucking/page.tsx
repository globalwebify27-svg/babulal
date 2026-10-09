"use client";

import React, { useState } from 'react';
import TruckingHeader from './components/TruckingHeader';
import TruckingFooter from './components/TruckingFooter';
import TruckingHero from './components/TruckingHero';
import TruckingValuePillars from './components/TruckingValuePillars';
import TruckingLegacy from './components/TruckingLegacy';
import TruckingServiceExcellence from './components/TruckingServiceExcellence';
import TruckingShowroomLocator from './components/TruckingShowroomLocator';
import StoreLocatorModal from '@/components/StoreLocatorModal'; // Using the group's locator modal

export default function TruckingVerticalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  return (
    <div className="bg-white min-h-screen font-sans antialiased text-gray-900 overflow-x-hidden">
      {/* ═══ INDUSTRIAL NAVIGATION SYSTEM ═══ */}
      <TruckingHeader onTestRideClick={openModal} />

      <main>
        {/* ═══ HERO — THE POWER OF SCALE ═══ */}
        <TruckingHero onTestRideClick={openModal} />

        {/* ═══ CROSS-INDUSTRIAL VALUE PILLARS ═══ */}
        <TruckingValuePillars />

        {/* ═══ THE LEGACY — DECADES OF DOMINANCE ═══ */}
        <TruckingLegacy />

        {/* ═══ SERVICE EXCELLENCE — THE TECHNICAL LAB ═══ */}
        <TruckingServiceExcellence />

        {/* ═══ STRATEGIC NETWORK — REGIONAL HUBS ═══ */}
        <TruckingShowroomLocator onTestRideClick={openModal} />
      </main>

      {/* ═══ CORPORATE GOVERNANCE FOOTER ═══ */}
      <TruckingFooter />

      {/* ═══ STRATEGIC LOCATOR MODAL ═══ */}
      <StoreLocatorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        vertical="trucking"
      />
    </div>
  );
}
