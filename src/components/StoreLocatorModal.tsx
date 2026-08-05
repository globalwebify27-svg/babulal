"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, MapPin, Navigation, Globe } from 'lucide-react';

const BAJAJ_STORES = [
  {
    city: "Ranchi",
    locations: [
      { name: "Premsons Bajaj - Main Showroom", address: "Mahatma Gandhi Main Rd, near Sujata Chowk, opp. Ranchi Club Complex, Hindpiri, Ranchi, Jharkhand - 834001", mapUrl: "https://maps.google.com/?q=Premsons+Bajaj+Ranchi" },
      { name: "Premsons Bajaj - Tupudana", address: "Hatia Rd, Pugudu, Tupudana, Ranchi, Jharkhand - 834003", mapUrl: "https://maps.google.com/?q=Premsons+Bajaj+Tupudana" },
      { name: "Premsons Bajaj - BIT Mesra", address: "Near BIT Mesra, Ranchi", mapUrl: "https://maps.google.com/?q=Premsons+Bajaj+BIT+Mesra" },
      { name: "Premsons Bajaj - Nagri", address: "Nagri, Ranchi", mapUrl: "https://maps.google.com/?q=Premsons+Bajaj+Nagri" }
    ]
  },
  {
    city: "Khunti",
    locations: [
      { name: "Premsons Bajaj - Khunti", address: "Piratoli, Main Rd, Mishra Colony, Khunti, Jharkhand - 835210", mapUrl: "https://maps.google.com/?q=Premsons+Bajaj+Khunti" }
    ]
  }
];

const TRUCKING_STORES = [
  {
    city: "Ranchi",
    locations: [
      { name: "Premsons & Poddar Trucking - Ranchi (HQ)", address: "7CJ7+JJP, NH 20, Rampur, Ganrke, Jharkhand - 834010", mapUrl: "https://maps.google.com/?q=Premsons+Poddar+Trucking+Rampur+Ranchi" }
    ]
  }
];

const TEXTILE_STORES = [
  {
    city: "Ranchi",
    locations: [
      { 
        name: "Babulal Premkumar - Upper Bazar (HQ)", 
        address: "Babulal Premkumar Building, Upper Bazar, Ranchi, Jharkhand - 834001", 
        mapUrl: "https://www.google.com/maps/place/Babulal+Premkumar/@23.3731426,85.3212812,17z/data=!3m1!4b1!4m6!3m5!1s0x39f4e1bf745d1d33:0x73a012c9b9d71786!8m2!3d23.3731426!4d85.3212812!16s%2Fg%2F11h2m9h6bl!18m1!1e1" 
      }
    ]
  },
  {
    city: "Bokaro / Chas",
    locations: [
      { 
        name: "Babulal Premkumar - Chas Outlet", 
        address: "Bypass Road, Chas, Bokaro, Jharkhand - 827013", 
        mapUrl: "https://maps.app.goo.gl/otSWt3CdpQNa4qWVA" 
      }
    ]
  }
];

const HONDA_STORES = [
  {
    city: "Ranchi",
    locations: [
      { name: "Premsons Honda - Harmu Road (Flagship)", address: "Shanti Complex, Harmu Rd, near Kishoreganj Chowk, Kumhartoli, Ranchi, Jharkhand - 834001", mapUrl: "https://maps.google.com/?q=Premsons+Honda+Harmu+Road+Ranchi" }
    ]
  },
  {
    city: "Bokaro",
    locations: [
      { name: "Premsons Honda - City Center", address: "Sector 4, City Center, Bokaro - 827004", mapUrl: "https://maps.google.com/?q=Premsons+Honda+Bokaro" }
    ]
  },
  {
    city: "Dhanbad",
    locations: [
      { name: "Premsons Honda - Saraidhela", address: "Saraidhela, Dhanbad - 828127", mapUrl: "https://maps.google.com/?q=Premsons+Honda+Dhanbad" }
    ]
  },
  {
    city: "Chandwa",
    locations: [
      { name: "Premsons Honda - Chandwa Outlet", address: "Near Indira Gandhi Chowk, Ranchi-Daltonganj Main Road - 829203", mapUrl: "https://maps.google.com/?q=Premsons+Honda+Chandwa" }
    ]
  }
];

interface StoreLocatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vertical?: 'bajaj' | 'trucking' | 'honda' | 'textile';
}

export default function StoreLocatorModal({ isOpen, onClose, vertical = 'bajaj' }: StoreLocatorModalProps) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const STORES_DATA = 
    vertical === 'trucking' ? TRUCKING_STORES : 
    vertical === 'textile' ? TEXTILE_STORES : 
    vertical === 'honda' ? HONDA_STORES : 
    BAJAJ_STORES;

  const resetAndClose = () => {
    setSelectedCity(null);
    onClose();
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-2 md:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#073E62]/90 backdrop-blur-md"
            onClick={resetAndClose}
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-[#0A5181] px-6 py-5 md:px-8 md:py-6 flex justify-between items-center shrink-0 border-b-4 border-[#DA222A]">
              <div>
                <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter">
                  {vertical === 'trucking' ? 'Fleet Locator' : 'Store Locator'}
                </h2>
                <p className="text-white/60 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1">
                  {selectedCity ? `Find us in ${selectedCity}` : 'Find your nearest center'}
                </p>
              </div>
              <button onClick={resetAndClose} className="text-white hover:rotate-90 transition-transform p-1">
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            <div className="p-5 md:p-8 overflow-y-auto no-scrollbar flex-1">
              {/* STEP 1: CITY SELECTION */}
              {!selectedCity ? (
                <div className="space-y-4">
                  <p className="text-gray-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-6 inline-flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#DA222A]" /> Select your city
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {STORES_DATA.map((cityData) => (
                      <button 
                        key={cityData.city}
                        onClick={() => handleCitySelect(cityData.city)}
                        className="group flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:border-[#DA222A] hover:bg-gray-50 transition-all text-left"
                      >
                        <span className="text-[#073E62] text-lg font-black uppercase tracking-tight group-hover:text-[#DA222A] transition-colors">{cityData.city}</span>
                        <ChevronRight className="w-6 h-6 text-gray-200 group-hover:text-[#DA222A] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* STEP 2: SHOWROOM LOCATIONS */
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <button 
                      onClick={() => setSelectedCity(null)} 
                      className="text-[#DA222A] text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2"
                    >
                      <ChevronRight className="w-3 h-3 rotate-180" /> Back to Cities
                    </button>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      {STORES_DATA.find(c => c.city === selectedCity)?.locations.length} Locations Found
                    </span>
                  </div>

                  <div className="space-y-4">
                    {STORES_DATA.find(c => c.city === selectedCity)?.locations.map((loc, i) => (
                      <div 
                        key={i}
                        className="p-6 border border-gray-100 rounded-2xl bg-white hover:border-[#0A5181] hover:shadow-xl transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-[#073E62] text-base md:text-lg font-black uppercase tracking-tight">{loc.name}</h4>
                          <Globe className="w-5 h-5 text-gray-200 group-hover:text-[#DA222A] transition-colors" />
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm font-medium italic leading-relaxed mb-6">
                          {loc.address}
                        </p>
                        <a 
                          href={loc.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-6 py-3 bg-[#0A5181] text-white text-[9px] font-black uppercase tracking-[.3em] hover:bg-[#DA222A] transition-all rounded-lg shadow-lg"
                        >
                          <Navigation className="w-3.5 h-3.5" /> Get Directions
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer (Branding) */}
            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-center items-center">
               <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Babulal Premsons Group</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
