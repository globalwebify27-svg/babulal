"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Loader2, Phone, User, Mail, MapPin } from 'lucide-react';
import { BUSINESS_VERTICALS, VerticalID } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface InquiryFormProps {
  verticalId: VerticalID;
  interestDefault?: string;
  className?: string;
}

export default function InquiryForm({ verticalId, interestDefault = "General Inquiry", className }: InquiryFormProps) {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    city: '',
    interest: interestDefault,
    notes: ''
  });

  const business = BUSINESS_VERTICALS[verticalId];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('LOADING');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          businessVertical: business.id,
          source: 'FORM'
        }),
      });

      if (res.ok) setStatus('SUCCESS');
      else setStatus('ERROR');
    } catch (err) {
      console.error(err);
      setStatus('ERROR');
    }
  };

  if (status === 'SUCCESS') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("bg-white p-12 rounded-2xl shadow-2xl text-center border-t-4 border-accent", className)}
      >
        <div className="flex justify-center mb-8">
           <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
           </div>
        </div>
        <h3 className="text-3xl font-extrabold text-primary tracking-tight mb-4 uppercase italic">Thank You!</h3>
        <p className="text-primary/50 font-medium leading-relaxed mb-8 max-w-sm mx-auto">
          Our team from <span className="text-primary font-bold">{business.name}</span> will contact you shortly regarding your {interestDefault} interest.
        </p>
        <button 
           onClick={() => setStatus('IDLE')}
           className="text-xs font-bold uppercase tracking-widest text-accent hover:underline decoration-2 underline-offset-8"
        >
           Send Another Inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <div className={cn("bg-white p-6 md:p-12 rounded-2xl shadow-2xl border border-primary/5 relative overflow-hidden", className)}>
      
      {/* Visual Accent */}
      <div className="absolute top-0 left-0 w-1 h-32 bg-accent opacity-20" />
      
      <div className="mb-10 text-primary">
         <h4 className="text-[10px] font-bold uppercase tracking-[.4em] text-accent mb-4">Official Enquiry</h4>
         <h3 className="text-2xl font-bold tracking-tight mb-2">Connect with {business.name}</h3>
         <p className="text-[13px] text-primary/40 font-medium leading-relaxed italic">A Ranchi Legacy. 100+ Years of Dedicated Service.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative group">
            <User className="absolute left-4 top-4 w-4 h-4 text-primary/30 group-focus-within:text-accent transition-colors" />
            <input 
              required
              type="text" 
              placeholder="Full Name"
              className="w-full bg-surface-dim px-12 py-4 rounded-md text-sm font-semibold border-none focus:ring-2 focus:ring-accent/10 focus:bg-white transition-all outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="relative group">
            <Phone className="absolute left-4 top-4 w-4 h-4 text-primary/30 group-focus-within:text-accent transition-colors" />
            <input 
              required
              type="tel" 
              placeholder="Mobile Number"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
              maxLength={10}
              minLength={10}
              className="w-full bg-surface-dim px-12 py-4 rounded-md text-sm font-semibold border-none focus:ring-2 focus:ring-accent/10 focus:bg-white transition-all outline-none"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           <div className="relative group">
            <Mail className="absolute left-4 top-4 w-4 h-4 text-primary/30 group-focus-within:text-accent transition-colors" />
            <input 
              type="email" 
              placeholder="Email Address (Optional)"
              className="w-full bg-surface-dim px-12 py-4 rounded-md text-sm font-semibold border-none focus:ring-2 focus:ring-accent/10 focus:bg-white transition-all outline-none"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
           <div className="relative group">
            <MapPin className="absolute left-4 top-4 w-4 h-4 text-primary/30 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="City / State"
              className="w-full bg-surface-dim px-12 py-4 rounded-md text-sm font-semibold border-none focus:ring-2 focus:ring-accent/10 focus:bg-white transition-all outline-none"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
        </div>

        <div className="relative">
           <textarea 
             placeholder="How can we help?"
             rows={3}
             className="w-full bg-surface-dim px-6 py-4 rounded-md text-sm font-semibold border-none focus:ring-2 focus:ring-accent/10 focus:bg-white transition-all outline-none resize-none"
             value={formData.notes}
             onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
           />
        </div>

        <button 
           type="submit"
           disabled={status === 'LOADING'}
           className="w-full bg-primary text-white py-5 rounded-md font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95"
        >
           {status === 'LOADING' ? (
             <Loader2 className="w-4 h-4 animate-spin" />
           ) : (
             <>Submit Enquiry <Send className="w-4 h-4" /></>
           )}
        </button>

        {status === 'ERROR' && (
          <p className="text-accent text-xs font-bold text-center">There was an error. Please contact us directly.</p>
        )}
      </form>
    </div>
  );
}
