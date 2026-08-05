"use client";

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';

const SHOWROOMS = [
  {
    city: "Ranchi (Flagship)",
    address: "Shanti Complex, Harmu Road, Near Kishoreganj Chowk, Ranchi - 834002",
    details: "Primary Sales & Premium Wings Service Hub",
    phone: "+91 97714 52801"
  },
  {
    city: "Bokaro",
    address: "M-5, City Center, Sector 4, Near Jai Jawan Petrol Pump - 827004",
    details: "Full Scale Sales, Service & Spare Parts",
    phone: "+91 97714 80360"
  },
  {
    city: "Dhanbad",
    address: "Saraidhela, Opposite Imma Bhawan, Near Big Bazar - 828127",
    details: "Authorized Honda Sales & Service Hub",
    phone: "+91 80515 00030"
  },
  {
    city: "Chandwa",
    address: "Near Indra Gandhi Chowk, Ranchi-Daltonganj Main Road - 829203",
    details: "Strategic Sales Point for Latehar Region",
    phone: "+91 90655 27793"
  }
];

interface HondaShowroomLocatorProps {
  onTestRideClick: () => void;
}

export default function HondaShowroomLocator({ onTestRideClick }: HondaShowroomLocatorProps) {
  return (
    <section id="showrooms" className="relative py-32 bg-[#073E62] overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#DA222A]/5 skew-x-12 translate-x-1/4 pointer-events-none" />
      
      <div className="relative z-10 max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20">
          <div className="max-w-3xl">
            <span className="text-[#DA222A] text-[10px] font-black uppercase tracking-[.6em] mb-6 block">Our Network</span>
            <h2 className="text-white text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Strategic <br /> <span className="text-[#DA222A]">Presence.</span>
            </h2>
          </div>
          <p className="text-white/40 text-sm md:text-lg font-medium italic max-w-md lg:text-right border-r-2 border-[#DA222A] pr-10">
            Jharkhand&apos;s most extensive Honda authorized network, bringing precision mobility to every major hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SHOWROOMS.map((site, i) => (
            <div 
              key={i} 
              className="group bg-white/5 backdrop-blur-sm border border-white/10 p-10 hover:bg-white hover:border-white transition-all duration-500 rounded-2xl flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-full bg-[#DA222A] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-white group-hover:text-[#0A5181] text-2xl font-black uppercase tracking-tight mb-4 transition-colors">
                {site.city}
              </h3>
              
              <p className="text-white/60 group-hover:text-gray-500 text-sm font-medium leading-relaxed mb-8 flex-grow transition-colors">
                {site.address}
              </p>

              <div className="space-y-4 pt-8 border-t border-white/10 group-hover:border-gray-100 transition-colors">
                <div className="flex items-center gap-3 text-white/40 group-hover:text-[#0A5181]/60 text-[10px] font-black uppercase tracking-widest transition-colors">
                  <Phone className="w-3.5 h-3.5" /> {site.phone}
                </div>
                <div className="flex items-center gap-3 text-white/40 group-hover:text-[#DA222A] text-[10px] font-black uppercase tracking-widest transition-colors">
                  <Clock className="w-3.5 h-3.5" /> 09:30 AM - 07:00 PM
                </div>
              </div>

              <Link 
                href={`https://www.google.com/maps/search/Premsons+Honda+${site.city}+${site.address}`}
                target="_blank"
                className="mt-10 flex items-center gap-2 text-white group-hover:text-[#DA222A] text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Get Directions <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">Central Inquiry</span>
                <span className="text-white text-xl font-black">+91 651 220 7555</span>
              </div>
              <div className="w-[1px] h-10 bg-white/10 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">Corporate Email</span>
                <span className="text-white text-xl font-black">Group@babulalpremsons.com</span>
              </div>
           </div>
           <button 
             onClick={onTestRideClick}
             className="px-12 py-5 bg-[#DA222A] text-white text-[10px] font-black uppercase tracking-[.4em] hover:bg-white hover:text-[#0A5181] transition-all shadow-2xl"
           >
              BOOK A VISIT
           </button>
        </div>
      </div>
    </section>
  );
}
