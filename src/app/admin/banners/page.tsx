"use client";

import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, 
  Plus, 
  Eye, 
  Trash2, 
  Edit3, 
  Layers,
  Link as LinkIcon,
  Monitor,
  Smartphone,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const VERTICAL_OPTIONS = ['TEXTILES', 'HONDA', 'BAJAJ', 'TRUCKING', 'MANUFACTURING', 'HOME'];
const POSITION_OPTIONS = [
  { id: 'HOME_HERO', label: 'Main Home Slider' },
  { id: 'VERTICAL_HERO', label: 'Vertical Landing Hero' },
  { id: 'PROMO_SECTION', label: 'Promotional Section' }
];

export default function BannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    vertical: 'HOME',
    image: '',
    link: '',
    position: 'HOME_HERO',
    alignment: 'center',
    isActive: true,
    order: 0
  });

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      const data = await res.json();
      if (Array.isArray(data)) setBanners(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openModal = (banner: any = null) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        vertical: banner.vertical || 'HOME',
        image: banner.image || '',
        link: banner.link || '',
        position: banner.position || 'HOME_HERO',
        alignment: banner.alignment || 'center',
        isActive: banner.isActive,
        order: banner.order || 0
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        vertical: 'HOME',
        image: '',
        link: '',
        position: 'HOME_HERO',
        alignment: 'center',
        isActive: true,
        order: banners.length
      });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setFormData({ ...formData, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editingBanner ? 'PATCH' : 'POST';
      const body = editingBanner ? { id: editingBanner.id, ...formData } : formData;
      const res = await fetch('/api/admin/banners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        fetchBanners();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      if (res.ok) setBanners(banners.filter(b => b.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const toggleStatus = async (banner: any) => {
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: banner.id, isActive: !banner.isActive }),
      });
      if (res.ok) {
        setBanners(banners.map(b => b.id === banner.id ? { ...b, isActive: !b.isActive } : b));
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
            <h1 className="text-2xl font-black text-[#1a2b4b] uppercase tracking-tighter italic italic-accent">Hero Media Control</h1>
            <p className="text-[#1a2b4b]/40 text-[9px] uppercase font-bold tracking-[.3em] mt-1 italic">Master banner & slider management</p>
         </div>
         
         <button 
           onClick={() => openModal()}
           className="bg-[#095181] text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[.2em] shadow-lg shadow-[#095181]/20 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all"
         >
            <Plus className="w-4 h-4" /> Upload New Creative
         </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
         {isLoading ? (
           <div className="p-40 flex flex-col items-center justify-center gap-4 text-primary/20">
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Synchronizing Assets...</span>
           </div>
         ) : banners.map((banner) => (
           <div key={banner.id} className="bg-white rounded-3xl p-6 shadow-sm border border-[#d1d9e6] flex items-center gap-8 group hover:border-[#095181]/30 transition-all">
              <div className="w-48 h-28 bg-[#f8fafc] rounded-2xl flex flex-col items-center justify-center text-[#1a2b4b]/10 border border-[#d1d9e6] relative overflow-hidden">
                 {banner.image ? (
                   <img src={banner.image} className="w-full h-full object-cover" />
                 ) : (
                   <ImageIcon className="w-8 h-8" />
                 )}
              </div>

              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[#1a2b4b] text-lg font-black uppercase tracking-tighter">{banner.title}</h3>
                    <button 
                      onClick={() => toggleStatus(banner)}
                      className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full transition-all",
                        banner.isActive ? "bg-green-50 text-green-600 border border-green-100" : "bg-red-50 text-red-500 border border-red-100"
                      )}
                    >
                       {banner.isActive ? "Active" : "Inactive"}
                    </button>
                 </div>
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-6">
                       <div className="flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-[#1a2b4b]/20" />
                          <span className="text-[10px] font-bold text-[#1a2b4b]/40 uppercase tracking-widest">{banner.vertical}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <Monitor className="w-3.5 h-3.5 text-[#1a2b4b]/20" />
                          <span className="text-[10px] font-bold text-[#1a2b4b]/40 uppercase tracking-widest">{banner.position.replace('_', ' ')}</span>
                       </div>
                    </div>
                    {banner.subtitle && (
                       <p className="text-[9px] text-[#1a2b4b]/40 uppercase font-medium italic">{banner.subtitle}</p>
                    )}
                 </div>
              </div>

              <div className="flex items-center gap-4 px-6 border-l border-[#f0f3f8]">
                 <div onClick={() => openModal(banner)} className="flex flex-col items-center gap-1 group/btn cursor-pointer">
                    <div className="p-3 bg-[#f8fafc] rounded-xl text-[#1a2b4b]/30 group-hover/btn:bg-[#095181] group-hover/btn:text-white transition-all shadow-sm">
                       <Edit3 className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#1a2b4b]/20">Edit</span>
                 </div>
                 <div onClick={() => deleteBanner(banner.id)} className="flex flex-col items-center gap-1 group/btn cursor-pointer">
                    <div className="p-3 bg-[#f8fafc] rounded-xl text-[#1a2b4b]/30 group-hover/btn:bg-accent group-hover/btn:text-white transition-all shadow-sm">
                       <Trash2 className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#1a2b4b]/20">Delete</span>
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
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl border border-[#d1d9e6] overflow-hidden">
              <div className="p-8 border-b border-[#f0f3f8] flex justify-between items-center bg-[#f8fafc]">
                 <h2 className="text-xl font-black text-[#1a2b4b] uppercase italic italic-accent">{editingBanner ? 'Refine Creative' : 'Deploy New Banner'}</h2>
                 <button onClick={() => setIsModalOpen(false)} className="text-[10px] font-black uppercase tracking-widest text-accent hover:scale-110 transition-transform">Close</button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Banner Title</label>
                        <input required className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#095181]/10" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Banner Subtitle (Optional)</label>
                        <input className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-[#095181]/10" value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Business Vertical</label>
                        <select className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none" value={formData.vertical} onChange={(e) => setFormData({...formData, vertical: e.target.value})}>
                           {VERTICAL_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                     </div>
                  </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Hero Asset (Base64)</label>
                    <div className="flex items-center gap-4">
                       {formData.image && (
                         <div className="w-24 h-16 rounded-xl overflow-hidden border border-[#d1d9e6]">
                            <img src={formData.image} className="w-full h-full object-cover" />
                         </div>
                       )}
                       <label className="flex-1 cursor-pointer">
                          <div className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] border-dashed rounded-xl text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest text-center hover:bg-white transition-all">
                             {formData.image ? 'CHANGE CREATIVE' : 'UPLOAD NEW ASSET'}
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                       </label>
                    </div>
                 </div>

                  <div className="grid grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Display Position</label>
                        <select className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value as any})}>
                           {POSITION_OPTIONS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Image Alignment</label>
                        <select className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none" value={formData.alignment} onChange={(e) => setFormData({...formData, alignment: e.target.value as any})}>
                           <option value="top">Top</option>
                           <option value="center">Center</option>
                           <option value="bottom">Bottom</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Action Link (Optional)</label>
                        <input className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none" placeholder="/textiles/summer-24" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} />
                     </div>
                  </div>

                 <button type="submit" disabled={isSubmitting} className="w-full bg-[#095181] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[.3em] shadow-xl shadow-[#095181]/20 hover:-translate-y-1 transition-all disabled:opacity-50">
                    {isSubmitting ? 'UPLOADING CREATIVE...' : 'AUTHORIZE & DEPLOY'}
                 </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
