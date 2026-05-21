"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Loader2,
  CheckCircle2,
  Info,
  ChevronDown,
  FileText,
  UploadCloud
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { BUSINESS_VERTICALS } from '@/lib/constants';

// Group Verticals based on the Business logic
const VERTICALS = [
  { id: 'TEXTILES', name: 'Textiles & Apparel', shop: 'Babulal Premkumar' },
];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState<number | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [categories, setCategories] = useState<any[]>([]);
  const [dbSubCategories, setDbSubCategories] = useState<any[]>([]);
  const [dbSubSubCategories, setDbSubSubCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    subCategory: '',
    subSubCategory: '',
    businessVertical: 'TEXTILES',
    shortDescription: '',
    description: '',
    images: [''],
    isActive: true,
    attributes: {} as any,
    seo: {
      metaTitle: '',
      metaDescription: '',
    },
    brochureUrl: '',
    videoUrl: ''
  });

  // Fetch Categories from DB
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Fetch categories error:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products?id=${id}`);
        if (res.ok) {
          const data = await res.json();
          setFormData({
            ...data,
            name: data.name || '',
            slug: data.slug || '',
            category: data.category || '',
            businessVertical: data.businessVertical ? data.businessVertical.toUpperCase() : 'TEXTILES',
            shortDescription: data.shortDescription || '',
            description: data.description || '',
            images: data.images?.length > 0 ? data.images : [''],
            seo: {
              metaTitle: data.seo?.metaTitle || '',
              metaDescription: data.seo?.metaDescription || ''
            },
            subCategory: data.subCategory || '',
            subSubCategory: data.subSubCategory || '',
            brochureUrl: data.brochureUrl || '',
            videoUrl: data.videoUrl || ''
          });
        } else {
          setMessage({ type: 'error', text: 'Failed to load product' });
        }
      } catch (err) {
        setMessage({ type: 'error', text: 'Error fetching product' });
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Filter Categories by Vertical
  const activeCategories = categories.filter(cat => 
    cat.parentVertical?.toLowerCase() === formData.businessVertical.toLowerCase()
  );

  // Fetch SubCategories when Category Select changes
  useEffect(() => {
    const fetchSubs = async () => {
      const selectedCat = activeCategories.find(c => c.name === formData.category);
      if (selectedCat) {
        try {
          const res = await fetch(`/api/admin/sub-categories?categoryId=${selectedCat._id}`);
          const data = await res.json();
          setDbSubCategories(data);
          
          // Only auto-select if subCategory is empty (e.g. during a category change, not initial load)
          // But actually for Edit page, we should preserve the loaded subCategory if it matches the category
          if (!formData.subCategory && data.length > 0) {
            setFormData(prev => ({ ...prev, subCategory: data[0].name, subSubCategory: '' }));
          }
        } catch (err) {
          console.error('Fetch subs error:', err);
        }
      } else {
        setDbSubCategories([]);
      }
    };
    if (activeCategories.length > 0) fetchSubs();
  }, [formData.category, formData.businessVertical, categories]);

  // Fetch SubSubCategories when SubCategory Select changes
  useEffect(() => {
    const fetchSubSubs = async () => {
      const selectedSub = dbSubCategories.find(s => s.name === formData.subCategory);
      if (selectedSub) {
        try {
          const res = await fetch(`/api/admin/sub-sub-categories?subCategoryId=${selectedSub._id}`);
          const data = await res.json();
          setDbSubSubCategories(data);
          
          // Only auto-select if subSubCategory is empty
          if (!formData.subSubCategory && data.length > 0) {
            setFormData(prev => ({ ...prev, subSubCategory: data[0].name }));
          }
        } catch (err) {
          console.error('Fetch sub-subs error:', err);
        }
      } else {
        setDbSubSubCategories([]);
      }
    };
    if (dbSubCategories.length > 0) fetchSubSubs();
  }, [formData.subCategory, dbSubCategories]);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, name, slug });
  };

  const handleAttributeChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      attributes: { ...formData.attributes, [key]: value }
    });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const updateImage = (index: number, val: string) => {
    const newImages = [...formData.images];
    newImages[index] = val;
    setFormData({ ...formData, images: newImages });
  };

  const handleMultipleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Filter out too large files (5MB)
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) {
      setMessage({ type: 'error', text: 'Some images were too large (>5MB) and skipped.' });
    }

    setIsUploading(0); // Show loading state on the bulk uploader
    
    try {
      const uploadPromises = validFiles.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images.filter(img => img !== ''), ...base64Images]
      }));
      
      setMessage({ type: 'success', text: `Successfully processed ${base64Images.length} images.` });
    } catch (err) {
      console.error('Upload error:', err);
      setMessage({ type: 'error', text: 'Failed to process some images.' });
    } finally {
      setIsUploading(null);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please upload a valid PDF file for the catalog.' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Catalog PDF must be less than 10MB.' });
      return;
    }

    setIsUploading(999); // Specific flag for PDF
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, brochureUrl: reader.result as string }));
        setMessage({ type: 'success', text: 'Catalog PDF updated successfully.' });
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to process PDF.' });
    } finally {
      setIsUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const cleanFormData = {
      ...formData,
      images: formData.images.filter(img => img !== '')
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...cleanFormData }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: 'success', text: `Product updated successfully!` });
        setTimeout(() => router.push('/admin/products'), 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update product' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-12 max-w-[1400px] mx-auto min-h-screen bg-[#F8F9FA]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link href="/admin/products" className="p-3 bg-white rounded-full shadow-sm hover:bg-primary hover:text-white transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic">
              Edit <span className="text-accent underline decoration-accent/20 underline-offset-8">Listing</span>
            </h1>
            <p className="text-primary/40 text-[10px] uppercase tracking-[.3em] font-bold mt-2">Babulal Premsons Group Catalog</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
             onClick={handleSubmit}
             disabled={isSubmitting}
             className="w-full lg:w-auto bg-primary text-white px-12 py-5 rounded-sm text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary/95 shadow-xl shadow-primary/20 transition-all disabled:opacity-50"
           >
             {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             Save Changes
           </button>
        </div>
      </div>

      <div className="mb-12 flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-primary/5">
        <span className="text-[10px] font-black uppercase tracking-widest text-primary/40">Listing Status:</span>
        <button 
          onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
          className={cn(
            "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
            formData.isActive ? "bg-green-500 text-white shadow-lg shadow-green-200" : "bg-red-400 text-white shadow-lg shadow-red-100"
          )}
        >
          {formData.isActive ? "Active / Public" : "Hidden / Draft"}
        </button>
      </div>

      {message.text && (
        <div className={cn(
          "mb-10 p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 border shadow-sm",
          message.type === 'success' ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
        )}>
          {message.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <Info className="w-6 h-6" />}
          <span className="text-[11px] font-black uppercase tracking-wider leading-none">{message.text}</span>
        </div>
      )}

      <form className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
           <section className="bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-primary/5">
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-surface-dim">
                <span className="text-accent font-black text-xs uppercase tracking-[0.2em] bg-accent/5 px-3 py-1 rounded-full">01.</span>
                <h3 className="text-[11px] font-black uppercase tracking-[.4em] text-primary/40 italic">Business Vertical</h3>
              </div>
              <div className="flex items-center gap-4 bg-surface-dim p-6 rounded-2xl border border-primary/5">
                 <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-primary/20">T</div>
                 <div>
                    <h4 className="text-sm font-black text-primary uppercase tracking-tight">Textiles & Apparel</h4>
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest mt-0.5">Babulal Premkumar — Ranchi HQ</p>
                 </div>
              </div>
           </section>

           <section className="bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-primary/5">
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-surface-dim">
                <span className="text-accent font-black text-xs uppercase tracking-[0.2em] bg-accent/5 px-3 py-1 rounded-full">02.</span>
                <h3 className="text-[11px] font-black uppercase tracking-[.4em] text-primary/40 italic">Catalog Details</h3>
              </div>
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Product Display Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-surface-dim px-6 py-5 rounded-2xl text-[13px] font-bold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all text-primary placeholder:text-primary/20"
                      placeholder="e.g., Banarasi Zari Silk Saree"
                      value={formData.name}
                      onChange={handleNameChange}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Search-Engine Friendly Slug</label>
                    <div className="flex items-center gap-4 bg-surface-dim px-6 rounded-2xl focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                       <span className="text-primary/20 text-[11px] font-black uppercase tracking-widest hidden md:block">babulal.group/</span>
                       <input 
                         type="text" 
                         required
                         className="flex-1 bg-transparent py-5 text-[13px] font-bold border-none outline-none text-primary"
                         placeholder="loading-slug..."
                         value={formData.slug}
                         onChange={(e) => setFormData({...formData, slug: e.target.value})}
                       />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Category Node</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-surface-dim px-6 py-5 rounded-2xl text-[13px] font-bold border-none outline-none focus:ring-4 focus:ring-primary/5 cursor-pointer appearance-none text-primary"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: '', subSubCategory: ''})}
                      >
                         <option value="">Select Category</option>
                         {activeCategories.map((cat: any) => (
                           <option key={cat._id} value={cat.name}>{cat.name}</option>
                         ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Sub-Category</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-surface-dim px-6 py-5 rounded-2xl text-[13px] font-bold border-none outline-none focus:ring-4 focus:ring-primary/5 cursor-pointer appearance-none text-primary"
                        value={formData.subCategory}
                        onChange={(e) => setFormData({...formData, subCategory: e.target.value, subSubCategory: ''})}
                      >
                         <option value="">No Sub-Category</option>
                         {dbSubCategories.map((sub: any) => (
                           <option key={sub._id} value={sub.name}>{sub.name}</option>
                         ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Sub-Sub-Category</label>
                    <div className="relative">
                      <select 
                        className="w-full bg-surface-dim px-6 py-5 rounded-2xl text-[13px] font-bold border-none outline-none focus:ring-4 focus:ring-primary/5 cursor-pointer appearance-none text-primary"
                        value={formData.subSubCategory}
                        onChange={(e) => setFormData({...formData, subSubCategory: e.target.value})}
                      >
                         <option value="">No Sub-Sub-Category</option>
                         {dbSubSubCategories.map((subSub: any) => (
                           <option key={subSub._id} value={subSub.name}>{subSub.name}</option>
                         ))}
                      </select>
                      <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Short Description</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-surface-dim px-6 py-5 rounded-2xl text-[13px] font-semibold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all text-primary resize-none placeholder:text-primary/20"
                    placeholder="Brief 1-2 sentence overview shown below the product name..."
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Public Description</label>
                  <textarea 
                    rows={6}
                    className="w-full bg-surface-dim px-6 py-5 rounded-2xl text-[13px] font-semibold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all text-primary resize-none placeholder:text-primary/20"
                    placeholder="Describe product details..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
           </section>

           <section className="bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-primary/5">
              <div className="flex items-center gap-3 mb-10 pb-6 border-b border-surface-dim">
                <span className="text-accent font-black text-xs uppercase tracking-[0.2em] bg-accent/5 px-3 py-1 rounded-full">03.</span>
                <h3 className="text-[11px] font-black uppercase tracking-[.4em] text-primary/40 italic">Technical Specifications</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                 {Object.keys(formData.attributes || {}).map(key => (
                   <div key={key} className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <input 
                        type="text" 
                        className="w-full bg-surface-dim px-6 py-4 rounded-xl text-[13px] font-bold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                        value={formData.attributes[key]}
                        onChange={(e) => handleAttributeChange(key, e.target.value)}
                      />
                   </div>
                 ))}
              </div>
           </section>
        </div>

        <div className="lg:col-span-4 space-y-10">
           <section className="bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-primary/5">
              <div className="space-y-6">
                  {/* Bulk Upload Trigger Area - Refined Dropzone */}
                  <div className="relative">
                    <label className={cn(
                      "relative aspect-square md:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-surface-dim border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group/upload shadow-inner",
                      "border-primary/10 hover:border-accent/30 hover:bg-accent/[0.01]"
                    )}>
                        <div className="flex flex-col items-center text-center p-8">
                          <div className="relative mb-6">
                            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center group-hover/upload:rotate-6 group-hover/upload:scale-110 transition-all duration-700">
                               <ImageIcon className="w-8 h-8 text-primary/10 group-hover/upload:text-accent transition-colors" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg group-hover/upload:scale-110 transition-transform">
                               <Plus className="w-4 h-4 font-black" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-[12px] font-black uppercase tracking-[0.3em] text-primary italic">Media Vault</div>
                            <div className="text-[9px] font-bold text-primary/30 uppercase tracking-widest max-w-[160px] leading-relaxed">
                              Drag & drop high-res catalog assets here
                            </div>
                          </div>
                        </div>
                      
                      <input 
                        type="file" 
                        multiple
                        className="hidden" 
                        accept="image/*"
                        onChange={handleMultipleUpload}
                        disabled={isUploading !== null}
                      />
                    </label>
                  </div>

                  {/* Previews Grid */}
                  {formData.images.filter(img => img !== '').length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {formData.images.filter(img => img !== '').map((img, idx) => (
                        <div key={idx} className="group relative aspect-square rounded-[1.5rem] overflow-hidden bg-white border border-primary/5 shadow-sm hover:shadow-xl transition-all duration-500">
                           <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                type="button"
                                className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-accent transition-all"
                                onClick={() => {
                                  const newImgs = formData.images.filter((_, i) => i !== idx);
                                  if (newImgs.length === 0) newImgs.push('');
                                  setFormData({...formData, images: newImgs});
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                           </div>
                           <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest">
                             Asset {idx + 1}
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 border-2 border-dashed border-primary/5 rounded-[2.5rem] flex flex-col items-center justify-center bg-white/40">
                       <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center opacity-20 mb-4">
                         <ImageIcon className="w-8 h-8" />
                       </div>
                       <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.3em] italic">Awaiting Catalog Media</span>
                    </div>
                  )}

                   <div className="space-y-4 pt-6 border-t border-surface-dim">
                     <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60 italic flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                        Showcase Video (YouTube Link)
                     </label>
                     <div className="relative group">
                       <input 
                         type="text" 
                         placeholder="e.g. https://www.youtube.com/watch?v=..."
                         className="w-full bg-surface-dim px-6 py-5 rounded-2xl text-[12px] font-bold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all text-primary placeholder:text-primary/10"
                         value={formData.videoUrl}
                         onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                       />
                     </div>
                   </div>

                  <div className="p-6 bg-accent/[0.03] rounded-[1.5rem] flex gap-4 border border-accent/5">
                    <Info className="w-5 h-5 text-accent shrink-0" />
                    <p className="text-[10px] text-accent/60 uppercase font-black tracking-widest leading-[1.8]">
                      Optimized for 5MB Max. Supports PNG, JPG, WEBP.
                    </p>
                  </div>
              </div>
           </section>

           <section className="bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-primary/5">
              <div className="mb-10 pb-6 border-b border-surface-dim flex justify-between items-center">
                 <h3 className="text-[11px] font-black uppercase tracking-[.4em] text-primary/40 italic">Digital Catalog</h3>
                 <div className="px-3 py-1 bg-accent/10 rounded-full text-[8px] font-black text-accent uppercase tracking-widest">Optional</div>
              </div>
              
              <div className="space-y-6">
                  <label className={cn(
                    "relative w-full p-8 rounded-[1.5rem] bg-surface-dim border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group/pdf",
                    formData.brochureUrl ? "border-green-200 bg-green-50/10" : "border-primary/10 hover:border-accent/30 hover:bg-accent/[0.01]"
                  )}>
                     <div className="flex items-center gap-6">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-lg",
                          formData.brochureUrl ? "bg-green-500 text-white" : "bg-white text-primary/10 group-hover/pdf:text-accent group-hover/pdf:rotate-12"
                        )}>
                           <FileText className="w-6 h-6" />
                        </div>
                        <div>
                           <div className="text-[11px] font-black uppercase tracking-widest text-primary italic">
                              {formData.brochureUrl ? "Catalog Attached" : "Upload PDF Catalog"}
                           </div>
                           <div className="text-[9px] font-bold text-primary/30 uppercase tracking-widest mt-1">
                              {formData.brochureUrl ? "Click to replace current PDF" : "Max 10MB • Institutional Spec"}
                           </div>
                        </div>
                        {!formData.brochureUrl && <UploadCloud className="w-5 h-5 text-primary/10 ml-4 animate-bounce" />}
                     </div>
                     <input 
                       type="file" 
                       className="hidden" 
                       accept=".pdf"
                       onChange={handlePdfUpload}
                     />
                  </label>

                  {formData.brochureUrl && (
                    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-100 shadow-sm">
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-[9px] font-black text-green-700 uppercase tracking-widest">Document Ready for Publish</span>
                       </div>
                       <button 
                         type="button"
                         onClick={() => setFormData({...formData, brochureUrl: ''})}
                         className="text-primary/20 hover:text-red-500 transition-colors"
                       >
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  )}
              </div>
           </section>

           <section className="bg-white p-10 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-primary/5">
              <h3 className="text-[11px] font-black uppercase tracking-[.4em] text-primary/40 mb-10 pb-6 border-b border-surface-dim italic">SEO Authority</h3>
              <div className="space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Meta Title</label>
                   <input 
                     type="text" 
                     className="w-full bg-surface-dim px-6 py-4 rounded-xl text-[12px] font-bold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                     value={formData.seo.metaTitle}
                     onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaTitle: e.target.value}})}
                   />
                </div>
                <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Meta Description</label>
                   <textarea 
                     rows={4}
                     className="w-full bg-surface-dim px-6 py-4 rounded-xl text-[12px] font-semibold border-none outline-none focus:ring-4 focus:ring-primary/5 transition-all text-primary resize-none"
                     value={formData.seo.metaDescription}
                     onChange={(e) => setFormData({...formData, seo: {...formData.seo, metaDescription: e.target.value}})}
                   />
                </div>
              </div>
           </section>
        </div>
      </form>
    </div>
  );
}
