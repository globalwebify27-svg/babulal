"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, MapPin, Calendar, User, Phone, Mail, Clock, Navigation } from 'lucide-react';

const CITIES = [
  { name: "Ranchi", showrooms: ["Shanti Complex, Harmu Road, Near Kishoreganj Chowk, Ranchi - 834002"] },
  { name: "Bokaro", showrooms: ["M-5, City Center, Sector 4, Near Jai Jawan Petrol Pump - 827004"] },
  { name: "Dhanbad", showrooms: ["Saraidhela, Opposite Imma Bhawan, Near Big Bazar - 828127"] },
  { name: "Chandwa", showrooms: ["Near Indra Gandhi Chowk, Ranchi-Daltonganj Main Road - 829203"] }
];

const SLOTS = [
  "09:30 AM - 11:30 AM",
  "11:30 AM - 01:30 PM",
  "01:30 PM - 03:30 PM",
  "03:30 PM - 05:30 PM",
  "05:30 PM - 07:00 PM"
];

interface TestRideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TestRideModal({ isOpen, onClose }: TestRideModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    city: '',
    showroom: '',
    name: '',
    phone: '',
    email: '',
    slot: ''
  });

  const resetAndClose = () => {
    setStep(1);
    setFormData({ city: '', showroom: '', name: '', phone: '', email: '', slot: '' });
    onClose();
  };

  const handleCitySelect = (city: string) => {
    setFormData({ ...formData, city, showroom: '' });
    setStep(2);
  };

  const handleShowroomSelect = (showroom: string) => {
    setFormData({ ...formData, showroom });
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Test Ride Booked Successfully for ${formData.name} at ${formData.showroom}!`);
    resetAndClose();
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
            className="relative w-full max-w-xl bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="bg-[#DA222A] px-6 py-5 md:px-8 md:py-6 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter">Book Your Test Ride</h2>
                <p className="text-white/60 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1">Step {step} of 3 — {step === 1 ? 'Select City' : step === 2 ? 'Select Showroom' : 'Final Details'}</p>
              </div>
              <button onClick={resetAndClose} className="text-white hover:rotate-90 transition-transform p-1">
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            <div className="p-5 md:p-8 overflow-y-auto no-scrollbar flex-1">
              {/* STEP 1: CITY SELECTION */}
              {step === 1 && (
                <div className="space-y-3 md:space-y-4">
                  <p className="text-gray-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-4 md:mb-6 inline-flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Where would you like to visit?
                  </p>
                  <div className="grid grid-cols-1 gap-2 md:gap-3">
                    {CITIES.map((city) => (
                      <button 
                        key={city.name}
                        onClick={() => handleCitySelect(city.name)}
                        className="group flex items-center justify-between p-4 md:p-5 border border-gray-100 rounded-xl hover:border-[#DA222A] hover:bg-gray-50 transition-all text-left"
                      >
                        <span className="text-[#073E62] text-base md:text-lg font-black uppercase tracking-tight group-hover:text-[#DA222A] transition-colors">{city.name}</span>
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-200 group-hover:text-[#DA222A] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: SHOWROOM SELECTION */}
              {step === 2 && (
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <button onClick={() => setStep(1)} className="text-[#DA222A] text-[10px] font-black uppercase tracking-widest hover:underline">Back to Cities</button>
                  </div>
                  <p className="text-gray-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest mb-4 md:mb-6 inline-flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5" /> Select center in {formData.city}:
                  </p>
                  <div className="grid grid-cols-1 gap-2 md:gap-3">
                    {CITIES.find(c => c.name === formData.city)?.showrooms.map((showroom) => (
                      <button 
                        key={showroom}
                        onClick={() => handleShowroomSelect(showroom)}
                        className="group flex items-center justify-between p-4 md:p-5 border border-gray-100 rounded-xl hover:border-[#DA222A] hover:bg-gray-50 transition-all text-left"
                      >
                        <span className="text-[#073E62] text-xs md:text-sm font-bold uppercase tracking-widest group-hover:text-[#DA222A] transition-colors">{showroom}</span>
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-gray-200 group-hover:text-[#DA222A] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: USER DETAILS & SLOT */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="flex items-center gap-2 mb-4 md:mb-6">
                    <button type="button" onClick={() => setStep(2)} className="text-[#DA222A] text-[10px] font-black uppercase tracking-widest hover:underline">Back to Showrooms</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        required
                        type="text" 
                        placeholder="Full Name"
                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#DA222A] transition-all text-sm font-bold placeholder:font-medium"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        required
                        type="tel" 
                        placeholder="Phone Number"
                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#DA222A] transition-all text-sm font-bold placeholder:font-medium"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                    <div className="relative md:col-span-2">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        required
                        type="email" 
                        placeholder="Email Address"
                        className="w-full pl-12 pr-4 py-3 md:py-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#DA222A] transition-all text-sm font-bold placeholder:font-medium"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-400 text-[10px] md:text-[11px] font-black uppercase tracking-widest inline-flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5" /> Preferred Time Slot:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData({...formData, slot})}
                          className={`p-3 md:p-4 border rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all text-center ${formData.slot === slot ? 'border-[#DA222A] bg-[#DA222A] text-white' : 'border-gray-100 text-gray-400 hover:border-[#DA222A] hover:text-[#DA222A]'}`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 md:py-5 bg-[#0A5181] text-white text-[10px] md:text-[11px] font-black uppercase tracking-[.4em] hover:bg-[#DA222A] transition-all shadow-xl rounded-xl mt-4"
                  >
                    CONFIRM BOOKING
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
