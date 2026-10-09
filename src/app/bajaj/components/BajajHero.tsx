"use client";

import React from 'react';
import Image from 'next/image';

interface BajajHeroProps {
   onTestRideClick: () => void;
}

export default function BajajHero({ onTestRideClick }: BajajHeroProps) {
   return (
    <section className="relative h-[40vh] md:h-screen md:min-h-[700px] w-full bg-[#f0f8ff] overflow-hidden">

      {/* ═══ FULL RANGE PRODUCT IMAGE ═══ */}
      <div className="absolute inset-x-0 bottom-0 top-16 md:top-0 md:inset-0 z-0">
        <Image
          src="/bajajheroo.png"
          alt="Bajaj Full Range"
          fill
          priority
          sizes="100vw"
          className="object-contain object-bottom"
        />
      </div>

    </section>
   );
}
