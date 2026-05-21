"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  Video,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReelsPage() {
  const [reels, setReels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingReel, setEditingReel] = useState<any>(null);
  const [formData, setFormData] = useState({
    instagramId: '',
    title: '',
    category: '',
    status: 'Active',
    order: 0
  });

  const fetchReels = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/reels');
      const data = await res.json();
      if (Array.isArray(data)) setReels(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const openModal = (reel: any = null) => {
    if (reel) {
      setEditingReel(reel);
      setFormData({
        instagramId: reel.instagramId || '',
        title: reel.title || '',
        category: reel.category || '',
        status: reel.status || 'Active',
        order: reel.orderIndex !== undefined ? reel.orderIndex : (reel.order || 0)
      });
    } else {
      setEditingReel(null);
      setFormData({
        instagramId: '',
        title: '',
        category: '',
        status: 'Active',
        order: reels.length + 1
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editingReel ? 'PATCH' : 'POST';
      const body = editingReel ? { id: editingReel.id, ...formData } : formData;
      const res = await fetch('/api/admin/reels', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchReels();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteReel = async (dbId: string) => {
    if (!confirm('Are you sure you want to delete this Instagram Reel?')) return;
    try {
      const res = await fetch(`/api/admin/reels?id=${dbId}`, { method: 'DELETE' });
      if (res.ok) {
        setReels(reels.filter(r => r._id !== dbId));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const toggleStatus = async (reel: any) => {
    const nextStatus = reel.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch('/api/admin/reels', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: reel.id, status: nextStatus }),
      });
      if (res.ok) {
        setReels(reels.map(r => r.id === reel.id ? { ...r, status: nextStatus } : r));
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  return (
    <div className="p-8 bg-[#f5f7fb] min-h-screen">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6]">
         <div>
            <h1 className="text-2xl font-black text-[#1a2b4b] uppercase tracking-tighter italic italic-accent">Fabrics In Motion</h1>
            <p className="text-[#1a2b4b]/40 text-[9px] uppercase font-bold tracking-[.3em] mt-1 italic">Instagram Reels Feed Control</p>
         </div>
         
         <button 
           onClick={() => openModal()}
           className="bg-[#095181] text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[.2em] shadow-lg shadow-[#095181]/20 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all"
         >
            <Plus className="w-4 h-4" /> Link New Reel
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {isLoading ? (
           <div className="col-span-full py-40 flex flex-col items-center justify-center gap-4 text-primary/20">
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Synchronizing Reels...</span>
           </div>
         ) : reels.length === 0 ? (
           <div className="col-span-full py-20 bg-white rounded-3xl border border-[#d1d9e6] flex flex-col items-center justify-center gap-4 text-primary/30">
              <Video className="w-12 h-12" />
              <span className="text-xs font-bold uppercase tracking-widest">No Reels configured yet.</span>
           </div>
         ) : reels.map((reel) => (
           <div key={reel._id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#d1d9e6] flex flex-col gap-6 group hover:border-[#095181]/30 transition-all relative overflow-hidden">
              
              {/* Instagram Embed Preview Frame */}
              <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden relative border border-[#d1d9e6] h-[340px] mx-auto w-full max-w-[200px]">
                 <iframe
                   src={`https://www.instagram.com/reel/${reel.instagramId}/embed/`}
                   className="w-full h-full border-none"
                   allowFullScreen
                   scrolling="no"
                   loading="lazy"
                 ></iframe>
              </div>

              <div className="flex-1">
                 <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                       <span className="text-[#095181] text-[8px] font-black uppercase tracking-widest block mb-1">{reel.category || 'NO CATEGORY'}</span>
                       <h3 className="text-[#1a2b4b] text-sm font-black uppercase tracking-tighter leading-snug">{reel.title}</h3>
                    </div>
                    <button 
                      onClick={() => toggleStatus(reel)}
                      className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full transition-all flex-shrink-0",
                        reel.status === 'Active' ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-500 border border-red-100"
                      )}
                    >
                       {reel.status}
                    </button>
                 </div>
                 <div className="flex items-center gap-2 mt-4 text-[9px] text-[#1a2b4b]/40 font-medium">
                    <span className="font-bold">Reel ID:</span> {reel.instagramId}
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#f0f3f8]">
                 <a 
                   href={`https://instagram.com/reel/${reel.instagramId}`} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#095181] hover:underline"
                 >
                    View Original <ExternalLink className="w-3 h-3" />
                 </a>
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => openModal(reel)} 
                      className="p-2 bg-[#f8fafc] rounded-lg text-[#1a2b4b]/40 hover:bg-[#095181] hover:text-white transition-all shadow-sm"
                      title="Edit Reel"
                    >
                       <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => deleteReel(reel._id)} 
                      className="p-2 bg-[#f8fafc] rounded-lg text-accent hover:bg-accent hover:text-white transition-all shadow-sm"
                      title="Delete Reel"
                    >
                       <Trash2 className="w-3.5 h-3.5" />
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#1a2b4b]/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl border border-[#d1d9e6] overflow-hidden z-10">
              <div className="p-8 border-b border-[#f0f3f8] flex justify-between items-center bg-[#f8fafc]">
                 <h2 className="text-lg font-black text-[#1a2b4b] uppercase italic italic-accent">{editingReel ? 'Update Reel Info' : 'Add Instagram Reel'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-accent hover:scale-110 transition-transform">Close</button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Reel URL or ID</label>
                     <input 
                       required 
                       placeholder="https://www.instagram.com/reel/DVxuBIWEZOC/ or DVxuBIWEZOC"
                       className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#095181]/10" 
                       value={formData.instagramId} 
                       onChange={(e) => setFormData({...formData, instagramId: e.target.value})} 
                     />
                     <span className="text-[9px] text-[#1a2b4b]/30 font-medium block">We automatically extract the video ID from Instagram links.</span>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Title (Showcase Caption)</label>
                     <input 
                       required 
                       placeholder="e.g. Royal Wedding Collection"
                       className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#095181]/10" 
                       value={formData.title} 
                       onChange={(e) => setFormData({...formData, title: e.target.value})} 
                     />
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Category / Collection Tag</label>
                     <input 
                       required 
                       placeholder="e.g. Handloom Silk or Bespoke Suiting"
                       className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#095181]/10" 
                       value={formData.category} 
                       onChange={(e) => setFormData({...formData, category: e.target.value})} 
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Display Status</label>
                        <select 
                          className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none" 
                          value={formData.status} 
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                        >
                           <option value="Active">Active</option>
                           <option value="Inactive">Inactive</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Sorting Order</label>
                        <input 
                          type="number"
                          className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none" 
                          value={formData.order} 
                          onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})} 
                        />
                     </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-[#095181] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[.3em] shadow-xl shadow-[#095181]/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 mt-6"
                  >
                     {isSubmitting ? 'LINKING INSTAGRAM FEED...' : 'CONFIRM & SAVE'}
                  </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
