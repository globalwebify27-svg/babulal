"use client";

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Save, 
  ChevronRight, 
  Info, 
  MessageSquare, 
  MapPin, 
  Phone, 
  Mail,
  Loader2,
  CheckCircle2,
  Globe,
  Megaphone,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const VERTICALS = [
  { id: 'TEXTILES', name: 'Babulal Premkumar', color: '#095181' },
  { id: 'HONDA', name: 'Premsons Honda', color: '#E11B22' },
  { id: 'BAJAJ', name: 'Premsons Bajaj', color: '#00529B' },
  { id: 'TRUCKING', name: 'Commercial Vehicles', color: '#F26522' },
  { id: 'MANUFACTURING', name: 'MUVA Industries', color: '#2E3192' },
];

export default function VerticalsAdminPage() {
  const [activeVertical, setActiveVertical] = useState(VERTICALS[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState<any>({
    vertical: '',
    heroTitle: '',
    heroSubtitle: '',
    aboutSection: { title: 'Our Legacy', content: '' },
    contactEmail: '',
    contactPhone: '',
    address: '',
    facebookPixel: { id: '', enabled: false },
    marqueeTexts: []
  });

  const fetchContent = async (vId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/landing-content?vertical=${vId}`);
      const data = await res.json();
      if (data.id) {
        setFormData({
          ...data,
          marqueeTexts: data.marqueeTexts || []
        });
      } else {
        setFormData({
          vertical: vId,
          heroTitle: `Welcome to ${VERTICALS.find(v => v.id === vId)?.name}`,
          heroSubtitle: 'Redefining Excellence',
          aboutSection: { title: 'Our Legacy', content: '' },
          contactEmail: '',
          contactPhone: '',
          address: '',
          facebookPixel: { id: '', enabled: false },
          marqueeTexts: vId === 'TEXTILES' ? [
            "Jharkhand's Leading Retail Textile Hub Since 1978",
            "Global Shipping Now Available to 50+ Countries",
            "New Bridal Collection 2026 Launching Soon"
          ] : []
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContent(activeVertical.id);
  }, [activeVertical]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/landing-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setMessage('Content updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 lg:p-12 bg-[#F8F9FA] min-h-screen">
      <div className="flex flex-col lg:flex-row gap-12 max-w-[1400px] mx-auto">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-primary/5">
            <h2 className="text-[10px] font-black uppercase tracking-[.3em] text-primary/30 mb-8 italic">Business Verticals</h2>
            <div className="space-y-3">
              {VERTICALS.map(v => (
                <button 
                  key={v.id}
                  onClick={() => setActiveVertical(v)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all group",
                    activeVertical.id === v.id ? "bg-primary text-white shadow-xl shadow-primary/20 scale-105" : "bg-surface-dim hover:bg-white border border-transparent hover:border-primary/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{v.name.split(' ')[1] || v.name}</span>
                  </div>
                  <ChevronRight className={cn("w-4 h-4 transition-transform", activeVertical.id === v.id ? "translate-x-1" : "opacity-0")} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#095181] p-8 rounded-[2rem] text-white shadow-xl shadow-[#095181]/20">
             <Globe className="w-8 h-8 opacity-20 mb-4" />
             <h3 className="text-sm font-black uppercase tracking-wider mb-2 leading-tight">Landing Page Strategy</h3>
             <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest leading-relaxed">Changes here reflect instantly on the public vertical pages.</p>
          </div>
        </div>

        {/* CONTENT EDITOR */}
        <div className="flex-1">
          {isLoading ? (
            <div className="h-[600px] flex flex-col items-center justify-center gap-4 text-primary/20 bg-white rounded-[3rem] shadow-sm border border-primary/5">
              <Loader2 className="w-12 h-12 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest">Building Content Bridge...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* HERO SECTION */}
              <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-primary/5">
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-primary/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-[11px] font-black uppercase tracking-[.4em] text-primary/40 italic">Hero Communication</h3>
                      <p className="text-[8px] font-bold text-primary/20 uppercase tracking-widest mt-1">Main Landing Display</p>
                    </div>
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                    Save Content
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Hero Primary Title</label>
                    <input 
                      type="text" 
                      className="w-full bg-surface-dim px-6 py-4 rounded-xl text-sm font-bold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                      value={formData.heroTitle}
                      onChange={(e) => setFormData({...formData, heroTitle: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Hero Supporting Subtitle</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-surface-dim px-6 py-4 rounded-xl text-sm font-semibold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                      value={formData.heroSubtitle}
                      onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              {/* ANNOUNCEMENT BAR (MARQUEE) - ONLY FOR TEXTILES */}
              {activeVertical.id === 'TEXTILES' && (
                <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-primary/5">
                  <div className="flex items-center gap-3 mb-10 pb-6 border-b border-primary/5">
                     <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                       <h3 className="text-[11px] font-black uppercase tracking-[.4em] text-primary/40 italic">Announcement Ticker</h3>
                       <p className="text-[8px] font-bold text-primary/20 uppercase tracking-widest mt-1">Top Header Marquee Texts</p>
                     </div>
                  </div>
                  <div className="space-y-4">
                    {(formData.marqueeTexts || []).map((text: string, index: number) => (
                      <div key={index} className="flex gap-3 items-center">
                        <input
                          type="text"
                          className="flex-1 bg-surface-dim px-6 py-4 rounded-xl text-sm font-bold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                          value={text}
                          onChange={(e) => {
                            const newMarquees = [...formData.marqueeTexts];
                            newMarquees[index] = e.target.value;
                            setFormData({ ...formData, marqueeTexts: newMarquees });
                          }}
                          placeholder="Enter announcement text..."
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newMarquees = formData.marqueeTexts.filter((_: any, i: number) => i !== index);
                            setFormData({ ...formData, marqueeTexts: newMarquees });
                          }}
                          className="w-12 h-12 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all shrink-0"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          marqueeTexts: [...(formData.marqueeTexts || []), ""]
                        });
                      }}
                      className="flex items-center gap-2 border-2 border-dashed border-primary/20 hover:border-primary text-primary px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all w-full justify-center"
                    >
                      <Plus className="w-4 h-4" />
                      Add Announcement
                    </button>
                  </div>
                </section>
              )}

              {/* ABOUT SECTION */}
              <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-primary/5">
                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-primary/5">
                   <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                      <Info className="w-5 h-5 text-primary" />
                   </div>
                   <h3 className="text-[11px] font-black uppercase tracking-[.4em] text-primary/40 italic">Institution Legacy</h3>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Section Title</label>
                    <input 
                      type="text" 
                      className="w-full bg-surface-dim px-6 py-4 rounded-xl text-sm font-bold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                      value={formData.aboutSection.title}
                      onChange={(e) => setFormData({...formData, aboutSection: {...formData.aboutSection, title: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Legacy Content / Narrative</label>
                    <textarea 
                      rows={6}
                      className="w-full bg-surface-dim px-6 py-4 rounded-xl text-sm font-medium border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none leading-relaxed"
                      value={formData.aboutSection.content}
                      onChange={(e) => setFormData({...formData, aboutSection: {...formData.aboutSection, content: e.target.value}})}
                    />
                  </div>
                </div>
              </section>

              {/* CONTACT FOOTER */}
              <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-primary/5">
                 <div className="flex items-center gap-3 mb-10 pb-6 border-b border-primary/5">
                    <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center">
                       <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-[11px] font-black uppercase tracking-[.4em] text-primary/40 italic">Point of Contact</h3>
                 </div>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-primary/20" />
                          <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Inquiry Email</label>
                       </div>
                       <input 
                         type="email" 
                         className="w-full bg-surface-dim px-6 py-4 rounded-xl text-sm font-bold border-none outline-none"
                         value={formData.contactEmail}
                         onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                       />
                    </div>
                    <div className="space-y-3">
                       <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-primary/20" />
                          <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Helpdesk Phone</label>
                       </div>
                       <input 
                         type="text" 
                         className="w-full bg-surface-dim px-6 py-4 rounded-xl text-sm font-bold border-none outline-none"
                         value={formData.contactPhone}
                         onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                       />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                       <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-primary/20" />
                          <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Business Address</label>
                       </div>
                       <input 
                         type="text" 
                         className="w-full bg-surface-dim px-6 py-4 rounded-xl text-sm font-bold border-none outline-none"
                         value={formData.address}
                         onChange={(e) => setFormData({...formData, address: e.target.value})}
                       />
                    </div>
                 </div>
              </section>

              {message && (
                <div className="fixed bottom-12 right-12 bg-green-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-8">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-widest">{message}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
