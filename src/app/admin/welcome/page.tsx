"use client";

import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Video, 
  MessageSquare, 
  Phone, 
  Mail, 
  MapPin, 
  Save, 
  ExternalLink, 
  Loader2, 
  CheckCircle,
  Building
} from 'lucide-react';

export default function WelcomePageAdmin() {
  const [settings, setSettings] = useState<any>({
    welcomeTitle: '',
    welcomeMessage: '',
    introTitle: '',
    introContent: '',
    videoUrl: '',
    videoTitle: '',
    feedbackUrl: '',
    contactPhone: '',
    contactEmail: '',
    address: '',
    googleMapsUrl: '',
    whatsappNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/admin/welcome-settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        } else {
          setError('Failed to load welcome settings.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load welcome settings.');
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    
    try {
      const res = await fetch('/api/admin/welcome-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (res.ok) {
        setSuccess(true);
        const data = await res.json();
        setSettings(data);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to save settings.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[.3em] text-primary/40">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f5f7fb] min-h-screen pb-24">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 bg-white p-8 rounded-[2rem] shadow-sm border border-[#d1d9e6]">
         <div>
            <h1 className="text-2xl font-black text-primary tracking-tighter uppercase italic">
              Customer Welcome <span className="text-accent underline decoration-accent/10 underline-offset-8">Page Manager</span>
            </h1>
            <p className="text-primary/40 text-[9px] uppercase font-bold tracking-[.3em] mt-2 italic">
              Configure the WhatsApp Welcome Landing Page for Babulal Premkumar
            </p>
         </div>
         <div>
            <a 
              href="/welcome" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/95 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3"
            >
               Preview Page <ExternalLink className="w-4 h-4" />
            </a>
         </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
        {/* SUCCESS / ERROR ALERTS */}
        {success && (
          <div className="bg-green-50 text-green-800 p-6 rounded-2xl border border-green-200 flex items-center gap-4 animate-reveal">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Settings Saved Successfully</p>
              <p className="text-xs text-green-700/80 mt-1">The public customer welcome page has been updated in real-time.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-800 p-6 rounded-2xl border border-red-200 flex items-center gap-4 animate-reveal">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider">Save Error</p>
              <p className="text-xs text-red-700/80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* ═══ SECTION 1: WELCOME & INTRO ═══ */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-[#d1d9e6] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f0f3f8] pb-4">
            <HeartHandshake className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-black text-primary uppercase tracking-tighter italic">Welcome & Introduction</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Welcome Title</label>
              <input 
                type="text" 
                name="welcomeTitle"
                value={settings.welcomeTitle}
                onChange={handleChange}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                placeholder="e.g. Welcome to Babulal Premkumar"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Welcome Message</label>
              <textarea 
                name="welcomeMessage"
                value={settings.welcomeMessage}
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                placeholder="Write a warm greeting message to your customers..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#f0f3f8]">
              <div className="md:col-span-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">About Section Title</label>
                <input 
                  type="text" 
                  name="introTitle"
                  value={settings.introTitle}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                  placeholder="e.g. Our Legacy"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">About Section Content</label>
                <textarea 
                  name="introContent"
                  value={settings.introContent}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                  placeholder="Tell customers about Babulal Premkumar..."
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SECTION 2: SHOPPING GUIDE VIDEO & FEEDBACK ═══ */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-[#d1d9e6] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f0f3f8] pb-4">
            <Video className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-black text-primary uppercase tracking-tighter italic">Guide Video & Feedback</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Video Title</label>
              <input 
                type="text" 
                name="videoTitle"
                value={settings.videoTitle}
                onChange={handleChange}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                placeholder="e.g. Shopping Guide Video"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Embed Video URL</label>
              <input 
                type="text" 
                name="videoUrl"
                value={settings.videoUrl}
                onChange={handleChange}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                placeholder="e.g. https://www.youtube.com/embed/..."
              />
              <p className="text-[9px] text-primary/40 mt-2 font-bold uppercase tracking-widest">
                Use a YouTube embed link (e.g. <code className="text-accent bg-accent/5 px-1 py-0.5 rounded">https://www.youtube.com/embed/VIDEO_ID</code>) or a direct MP4 URL.
              </p>
            </div>

            <div className="md:col-span-2 pt-4 border-t border-[#f0f3f8]">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Customer Feedback / Google Review Link</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-primary/30">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  name="feedbackUrl"
                  value={settings.feedbackUrl}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-12 pr-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                  placeholder="e.g. https://g.page/r/your-google-review-link/review"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ SECTION 3: CONTACT INFORMATION ═══ */}
        <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-[#d1d9e6] shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-[#f0f3f8] pb-4">
            <Building className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-black text-primary uppercase tracking-tighter italic">Contact Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Contact Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-primary/30">
                  <Phone className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-12 pr-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                  placeholder="e.g. +91 93347 00444"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">WhatsApp Number (with country code)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-primary/30">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                </div>
                <input 
                  type="text" 
                  name="whatsappNumber"
                  value={settings.whatsappNumber}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-12 pr-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                  placeholder="e.g. +919334700444"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Contact Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-primary/30">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-12 pr-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                  placeholder="e.g. contact@babulalpremkumar.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Google Maps Directions Link</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-primary/30">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <input 
                  type="text" 
                  name="googleMapsUrl"
                  value={settings.googleMapsUrl}
                  onChange={handleChange}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-12 pr-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                  placeholder="e.g. https://goo.gl/maps/..."
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Physical Store Address</label>
              <div className="relative">
                <div className="absolute top-4 left-5 pointer-events-none text-primary/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <textarea 
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] focus:border-primary focus:ring-1 focus:ring-primary rounded-xl pl-12 pr-5 py-4 text-sm font-medium text-primary outline-none transition-all"
                  placeholder="e.g. Main Road, Ranchi, Jharkhand"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ ACTION BAR ═══ */}
        <div className="flex items-center gap-4 pt-4">
          <button 
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-12 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:opacity-95 shadow-xl shadow-primary/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Welcome Configuration
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
