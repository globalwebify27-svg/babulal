"use client";

import React, { useState } from 'react';
import { MapPin, X, User, Phone, Mail, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StoreLocatorModal from './StoreLocatorModal';
import { Haptics } from '@/lib/haptics';

interface ProductActionButtonsProps {
  verticalSlug: string;
  productName: string;
}

export default function ProductActionButtons({ verticalSlug, productName }: ProductActionButtonsProps) {
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: 'Ranchi', // रांची or चास
    notes: ''
  });

  // Mapping long vertical slugs to modal types
  const getVerticalType = (slug: string): 'textile' | 'honda' | 'bajaj' | 'trucking' => {
    if (slug === 'textiles') return 'textile';
    if (slug === 'honda') return 'honda';
    if (slug === 'bajaj') return 'bajaj';
    if (slug === 'trucking') return 'trucking';
    return 'textile';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('LOADING');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || null,
          mobile: formData.mobile,
          city: formData.city, // Ranchi or Chas
          interest: `Price Inquiry: ${productName}`,
          notes: formData.notes || null,
          businessVertical: verticalSlug,
          source: 'FORM'
        }),
      });

      if (res.ok) {
        Haptics.success();
        setStatus('SUCCESS');
      } else {
        Haptics.medium();
        setStatus('ERROR');
      }
    } catch (err) {
      console.error(err);
      Haptics.medium();
      setStatus('ERROR');
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          onClick={() => {
            Haptics.medium();
            setIsInquiryModalOpen(true);
          }}
          className="flex-1 px-8 py-5 bg-[#0A5181] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-accent transition-all text-center shadow-xl shadow-primary/10 group"
        >
          Price Inquiry <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
        </button>
        <button 
          onClick={() => {
            Haptics.medium();
            setIsStoreModalOpen(true);
          }}
          className="flex-1 px-6 py-5 bg-white border-2 border-accent text-accent text-[11px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg group"
        >
          <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" /> Get Directions
        </button>
      </div>

      <StoreLocatorModal 
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        vertical={getVerticalType(verticalSlug)}
      />

      {/* Inquiry Pop-up Modal */}
      <AnimatePresence>
        {isInquiryModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInquiryModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-5 sm:p-7 z-10 text-[#0A5181] max-h-[92vh] flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsInquiryModalOpen(false)}
                className="absolute right-4 top-4 p-2 text-gray-400 hover:text-[#0A5181] transition-colors rounded-full hover:bg-gray-50"
              >
                <X className="w-5 h-5" />
              </button>

              {status === 'SUCCESS' ? (
                <div className="text-center py-6 flex-1 flex flex-col justify-center">
                  <div className="flex justify-center mb-5 shrink-0">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight italic mb-2 shrink-0">Enquiry Submitted!</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto mb-6 font-medium flex-1 overflow-y-auto">
                    Thank you for your interest in <span className="font-bold text-[#0A5181]">{productName}</span>. Our representative from the <span className="font-bold text-[#DA222A]">{formData.city}</span> branch will contact you shortly.
                  </p>
                  <button
                    onClick={() => {
                      setStatus('IDLE');
                      setFormData({
                        name: '',
                        email: '',
                        mobile: '',
                        city: 'Ranchi',
                        notes: ''
                      });
                      setIsInquiryModalOpen(false);
                    }}
                    className="w-full py-3.5 bg-[#0A5181] hover:bg-[#DA222A] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95 shrink-0"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden min-h-0 space-y-4">
                  {/* Fixed Header */}
                  <div className="shrink-0 pr-8">
                    <span className="text-[9px] font-black text-[#DA222A] uppercase tracking-[0.3em]">Price Inquiry</span>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight italic mt-0.5 max-w-full leading-tight truncate">
                      {productName}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-widest">
                      Wholesale & retail pricing requests
                    </p>
                  </div>

                  {/* Scrollable Fields */}
                  <div className="flex-1 overflow-y-auto space-y-3.5 sm:space-y-4 pr-1 -mr-1 min-h-0 py-1">
                    {/* Name Input */}
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 group-focus-within:text-accent transition-colors" />
                      <input
                        required
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-gray-50/50 border border-gray-100 focus:border-accent/30 focus:bg-white pl-12 pr-4 py-3 rounded-xl text-sm font-semibold transition-all outline-none"
                      />
                    </div>

                    {/* Mobile Input */}
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 group-focus-within:text-accent transition-colors" />
                      <input
                        required
                        type="tel"
                        placeholder="Mobile Number"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full bg-gray-50/50 border border-gray-100 focus:border-accent/30 focus:bg-white pl-12 pr-4 py-3 rounded-xl text-sm font-semibold transition-all outline-none"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 group-focus-within:text-accent transition-colors" />
                      <input
                        type="email"
                        placeholder="Email Address (Optional)"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-50/50 border border-gray-100 focus:border-accent/30 focus:bg-white pl-12 pr-4 py-3 rounded-xl text-sm font-semibold transition-all outline-none"
                      />
                    </div>

                    {/* Branch Preference Selection */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-[#0A5181]/50">
                        Select Preferred Branch Location
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            Haptics.light();
                            setFormData({ ...formData, city: 'Ranchi' });
                          }}
                          className={`flex items-center justify-between py-2.5 px-4 rounded-xl border transition-all text-left ${
                            formData.city === 'Ranchi'
                              ? 'border-[#DA222A] bg-[#DA222A]/5 text-[#DA222A] font-black'
                              : 'border-gray-100 bg-gray-50/20 text-[#0A5181]/60 font-semibold hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-3.5 h-3.5 ${formData.city === 'Ranchi' ? 'text-[#DA222A]' : 'text-gray-400'}`} />
                            <span className="text-[11px] uppercase tracking-wider">Ranchi</span>
                          </div>
                          {formData.city === 'Ranchi' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#DA222A]" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            Haptics.light();
                            setFormData({ ...formData, city: 'Chas' });
                          }}
                          className={`flex items-center justify-between py-2.5 px-4 rounded-xl border transition-all text-left ${
                            formData.city === 'Chas'
                              ? 'border-[#DA222A] bg-[#DA222A]/5 text-[#DA222A] font-black'
                              : 'border-gray-100 bg-gray-50/20 text-[#0A5181]/60 font-semibold hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <MapPin className={`w-3.5 h-3.5 ${formData.city === 'Chas' ? 'text-[#DA222A]' : 'text-gray-400'}`} />
                            <span className="text-[11px] uppercase tracking-wider">Chas</span>
                          </div>
                          {formData.city === 'Chas' && (
                            <div className="w-1.5 h-1.5 rounded-full bg-[#DA222A]" />
                          )}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Fixed Footer Submission Button */}
                  <div className="shrink-0 pt-2 border-t border-gray-50">
                    <button
                      type="submit"
                      disabled={status === 'LOADING'}
                      className="w-full bg-[#0A5181] text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-[#DA222A] transition-all shadow-xl shadow-[#0A5181]/15 flex items-center justify-center gap-3 active:scale-98"
                    >
                      {status === 'LOADING' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          Send Inquiry <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                  {status === 'ERROR' && (
                    <p className="text-[#DA222A] text-xs font-bold text-center mt-2 shrink-0">
                      Submission error. Please check connection and try again.
                    </p>
                  )}
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
