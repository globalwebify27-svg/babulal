"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, MessageSquare, Building2, ChevronRight } from 'lucide-react';
import InquiryForm from '@/components/InquiryForm';
import { BUSINESS_VERTICALS, VerticalID } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Haptics } from '@/lib/haptics';

export default function ContactPage() {
  const [activeVertical, setActiveVertical] = useState<VerticalID>('TEXTILES');

  const contactDetails = {
    headquarters: "Babulal Premsons Building, Upper Bazar, Ranchi, Jharkhand - 834001",
    phone: "+91 62049 00000",
    email: "info@premsons.com",
    hours: "Monday - Saturday: 10:00 AM - 8:30 PM",
  };

  return (
    <div className="bg-canvas min-h-screen pt-28 pb-20">
      <div className="max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-24">
        
        {/* Page Header */}
        <div className="mb-12 lg:mb-20 border-b border-primary/5 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-8 lg:w-12 h-[2px] bg-accent" />
            <span className="text-[10px] font-black uppercase tracking-[.5em] text-primary/40">Connect With Us</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-primary font-black uppercase tracking-tighter leading-none"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
          >
            Contact <span className="text-accent italic">Our Team.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-primary/60 text-base lg:text-lg max-w-2xl font-medium leading-relaxed"
          >
            Get in touch with our corporate office or route your inquiry directly to one of our division leads for quick assistance.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 md:p-10 border border-primary/5 rounded-2xl shadow-xl space-y-8"
            >
              <h2 className="text-xl font-black uppercase tracking-wider text-primary border-b border-primary/5 pb-4 flex items-center gap-3">
                <Building2 className="w-5 h-5 text-accent" /> Corporate Office
              </h2>
              
              <div className="space-y-6">
                {/* Location */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-primary/50 mb-1">Address</h4>
                    <p className="text-sm font-semibold text-primary/80 leading-relaxed">
                      {contactDetails.headquarters}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-primary/50 mb-1">Phone</h4>
                    <a 
                      href={`tel:${contactDetails.phone.replace(/\s+/g, '')}`}
                      className="text-sm font-bold text-primary hover:text-accent transition-colors"
                    >
                      {contactDetails.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-primary/50 mb-1">Email</h4>
                    <a 
                      href={`mailto:${contactDetails.email}`}
                      className="text-sm font-bold text-primary hover:text-accent transition-colors"
                    >
                      {contactDetails.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-primary/50 mb-1">Business Hours</h4>
                    <p className="text-sm font-semibold text-primary/85">
                      {contactDetails.hours}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Map Placeholder/Link */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-primary text-white p-8 rounded-2xl relative overflow-hidden group shadow-xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,var(--color-accent),transparent)] opacity-40" />
              <div className="relative z-10 space-y-4">
                <h3 className="text-lg font-black uppercase tracking-wider italic">Visit Our Headquarters</h3>
                <p className="text-xs text-white/70 font-medium leading-relaxed">
                  Located at Upper Bazar, Ranchi, Jharkhand. Click below to view interactive navigation on Google Maps.
                </p>
                <a 
                  href="https://maps.google.com/?q=Babulal+Premsons+Building+Upper+Bazar+Ranchi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent hover:text-white transition-colors pt-2"
                >
                  Get Directions <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right: Department Select & Form */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-primary/40 block mb-3">
                  Select Business Division
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {(Object.keys(BUSINESS_VERTICALS) as VerticalID[]).map((key) => {
                    const isActive = activeVertical === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          Haptics.light();
                          setActiveVertical(key);
                        }}
                        className={cn(
                          "px-4 py-3 rounded-lg text-[10px] font-black uppercase tracking-wider border text-center transition-all duration-300",
                          isActive
                            ? "bg-primary border-primary text-white shadow-md shadow-primary/10"
                            : "bg-white border-primary/5 text-primary/65 hover:bg-primary/5"
                        )}
                      >
                        {BUSINESS_VERTICALS[key].name.split(' ').slice(-1)[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Container */}
              <div className="relative">
                <InquiryForm 
                  key={activeVertical} 
                  verticalId={activeVertical} 
                  interestDefault={`Inquiry for ${BUSINESS_VERTICALS[activeVertical].name}`}
                />
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}
