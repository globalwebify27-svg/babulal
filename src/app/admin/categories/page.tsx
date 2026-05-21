"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Image as ImageIcon, 
  Edit3, 
  Trash2, 
  Briefcase, 
  Eye,
  Loader2,
  RefreshCcw,
  CheckCircle2,
  Layers,
  Star,
  FileText,
  UploadCloud
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentVertical: 'textiles',
    image: '',
    showInHeader: true,
    isCurated: false,
    status: 'Active',
    order: 0
  });

  // Sub-Category States
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [activeParentNode, setActiveParentNode] = useState<any>(null);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [newSubName, setNewSubName] = useState('');
  const [newSubBrochureUrl, setNewSubBrochureUrl] = useState('');
  const [isSubmittingSub, setIsSubmittingSub] = useState(false);

  // Sub-Sub-Category States
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const [subSubCategories, setSubSubCategories] = useState<any[]>([]);
  const [subSubCategoriesLoading, setSubSubCategoriesLoading] = useState(false);
  const [newSubSubName, setNewSubSubName] = useState('');
  const [isSubmittingSubSub, setIsSubmittingSubSub] = useState(false);

  const toggleSubSubExpanded = async (subId: string) => {
    if (expandedSubId === subId) {
      setExpandedSubId(null);
    } else {
      setExpandedSubId(subId);
      setNewSubSubName('');
      await fetchSubSubCategories(subId);
    }
  };

  const fetchSubSubCategories = async (subId: string) => {
    setSubSubCategoriesLoading(true);
    try {
      const res = await fetch(`/api/admin/sub-sub-categories?subCategoryId=${subId}`);
      const data = await res.json();
      setSubSubCategories(data);
    } catch (err) {
      console.error('Failed to fetch sub-subs:', err);
    } finally {
      setSubSubCategoriesLoading(false);
    }
  };

  const handleAddSubSubCategory = async (subId: string) => {
    if (!newSubSubName) return;
    setIsSubmittingSubSub(true);
    try {
      const res = await fetch('/api/admin/sub-sub-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSubSubName,
          subCategoryId: subId
        })
      });
      if (res.ok) {
        setNewSubSubName('');
        await fetchSubSubCategories(subId);
      }
    } catch (err) {
      console.error('Add sub-sub error:', err);
    } finally {
      setIsSubmittingSubSub(false);
    }
  };

  const handleDeleteSubSub = async (id: string) => {
    if (!confirm('Delete this sub-sub-node?')) return;
    try {
      const res = await fetch(`/api/admin/sub-sub-categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (expandedSubId) {
          await fetchSubSubCategories(expandedSubId);
        }
      }
    } catch (err) {
      console.error('Delete sub-sub error:', err);
    }
  };

  // Open Sub-Node Manager
  const openSubManager = async (category: any) => {
    setActiveParentNode(category);
    setExpandedSubId(null);
    setIsSubModalOpen(true);
    fetchSubCategories(category._id);
  };

  const fetchSubCategories = async (catId: string) => {
    try {
      const res = await fetch(`/api/admin/sub-categories?categoryId=${catId}`);
      const data = await res.json();
      setSubCategories(data);
    } catch (err) {
      console.error('Failed to fetch subs:', err);
    }
  };

  const handleSubBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>, subId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF catalog.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      if (subId) {
        // Direct Update for existing sub
        try {
          const res = await fetch('/api/admin/sub-categories', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: subId, brochureUrl: base64 })
          });
          if (res.ok) fetchSubCategories(activeParentNode._id);
        } catch (err) {
          console.error('Update sub brochure error:', err);
        }
      } else {
        // Set state for new sub
        setNewSubBrochureUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubCategory = async () => {
    if (!newSubName || !activeParentNode) return;
    setIsSubmittingSub(true);
    try {
      const res = await fetch('/api/admin/sub-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSubName,
          category: activeParentNode._id,
          brochureUrl: newSubBrochureUrl
        })
      });
      if (res.ok) {
        setNewSubName('');
        setNewSubBrochureUrl('');
        fetchSubCategories(activeParentNode._id);
        fetchCategories(); // Refresh main list to update count
      }
    } catch (err) {
      console.error('Add sub error:', err);
    } finally {
      setIsSubmittingSub(false);
    }
  };

  const handleDeleteSub = async (id: string) => {
    if (!confirm('Delete this sub-node?')) return;
    try {
      const res = await fetch(`/api/admin/sub-categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSubCategories(activeParentNode._id);
        fetchCategories(); // Refresh main list to update count
      }
    } catch (err) {
      console.error('Delete sub error:', err);
    }
  };

  // Fetch Categories
  const fetchCategories = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/categories', { cache: 'no-store' });
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Update Category Field (Toggle Status/Header)
  const updateCategory = async (id: string, updates: any) => {
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (res.ok) {
        const updatedDoc = await res.json();
        console.log('SERVER UPDATED CATEGORY:', updatedDoc);
        setCategories(prev => prev.map(cat => cat._id === id ? { ...cat, ...updates } : cat));
      } else {
        const errorData = await res.json();
        console.error('SERVER UPDATE ERROR:', errorData);
        alert(errorData.error || 'Failed to update field');
      }
    } catch (err) {
      console.error('Failed to update category:', err);
      alert('Connection error while updating category');
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also affect products in this category.')) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter(cat => cat._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
    }
  };

  const openModal = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        parentVertical: category.parentVertical,
        image: category.image || '',
        showInHeader: category.showInHeader,
        isCurated: category.isCurated || false,
        status: category.status,
        order: category.order
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        parentVertical: 'textiles',
        image: '',
        showInHeader: true,
        isCurated: false,
        status: 'Active',
        order: categories.length
      });
    }
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const method = editingCategory ? 'PATCH' : 'POST';
      const body = editingCategory ? { id: editingCategory._id, ...formData } : formData;
      const res = await fetch('/api/admin/categories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchCategories();
        setIsModalOpen(false);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save category');
      }
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#f5f7fb] min-h-screen">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6]">
         <div>
            <h1 className="text-2xl font-black text-[#1a2b4b] uppercase tracking-tighter italic italic-accent flex items-center gap-3">
               Category Master Control
               {isRefreshing && <RefreshCcw className="w-5 h-5 animate-spin text-accent" />}
            </h1>
            <p className="text-[#1a2b4b]/40 text-[9px] uppercase font-bold tracking-[.3em] mt-1 italic">Managing {categories.length} dynamic vertical nodes</p>
         </div>
         
         <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a2b4b]/20 group-focus-within:text-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search Category..."
                 className="pl-12 pr-6 py-4 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold w-full md:w-80 outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-[#1a2b4b]/20"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            
            <button 
              onClick={() => openModal()}
              className="bg-[#095181] text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[.2em] shadow-lg shadow-[#095181]/20 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all"
            >
               <Plus className="w-4 h-4" /> Add New Node
            </button>
         </div>
      </div>

      {/* CATEGORY LIST TABLE */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-[#d1d9e6] overflow-hidden min-h-[400px]">
         {isLoading ? (
           <div className="p-40 flex flex-col items-center justify-center gap-4 text-primary/20">
              <Loader2 className="w-10 h-10 animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest">Accessing MongoDB Vault...</span>
           </div>
         ) : filteredCategories.length === 0 ? (
           <div className="p-40 text-center">
              <Layers className="w-16 h-16 text-[#d1d9e6] mx-auto mb-6" />
              <h3 className="text-[#1a2b4b] text-xl font-black uppercase italic italic-accent">No Categories Synced</h3>
              <p className="text-[#1a2b4b]/30 text-xs font-bold uppercase tracking-widest mt-2">Start adding nodes to the vertical hierarchy.</p>
           </div>
         ) : (
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead>
                    <tr className="bg-[#f8fafc]/50">
                       <th className="px-8 py-5 text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-[.2em] border-b border-[#f0f3f8] w-20">No.</th>
                       <th className="px-8 py-5 text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-[.2em] border-b border-[#f0f3f8]">Category Structure</th>
                       <th className="px-8 py-5 text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-[.2em] border-b border-[#f0f3f8]">Assets</th>
                       <th className="px-8 py-5 text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-[.2em] border-b border-[#f0f3f8]">Header</th>
                       <th className="px-8 py-5 text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-[.2em] border-b border-[#f0f3f8]">Curated</th>
                       <th className="px-8 py-5 text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-[.2em] border-b border-[#f0f3f8]">Priority</th>
                       <th className="px-8 py-5 text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-[.2em] border-b border-[#f0f3f8] w-48 text-center">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-[#f0f3f8]">
                    {filteredCategories.map((cat, idx) => (
                      <tr key={cat._id} className="group hover:bg-[#fcfdfe] transition-all duration-300">
                         <td className="px-8 py-6">
                            <span className="text-sm font-bold text-[#1a2b4b]/40">{idx + 1}.</span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="space-y-1.5">
                               <div className="text-sm font-black text-[#1a2b4b] uppercase tracking-tight group-hover:text-primary transition-colors flex items-center gap-2">
                                  {cat.name}
                                  {cat.status === 'Active' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                                  {cat.isCurated && <Star className="w-3.5 h-3.5 text-accent" />}
                               </div>
                               <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-bold text-[#1a2b4b]/30 uppercase tracking-widest bg-surface-dim px-2 py-0.5 rounded">Nodes: {cat.subCategoryCount || 0}</span>
                                  <span className="text-[9px] font-bold text-[#1a2b4b]/30 uppercase tracking-widest">{cat.parentVertical?.toUpperCase()}</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <button className="flex items-center gap-2 text-[#1a2b4b] text-[10px] font-bold uppercase tracking-widest hover:text-[#095181] transition-colors">
                               <Eye className="w-3.5 h-3.5" /> View Media
                            </button>
                         </td>
                         <td className="px-8 py-6">
                            <div 
                              onClick={() => updateCategory(cat._id, { showInHeader: !cat.showInHeader })}
                              className={cn(
                               "w-10 h-5 rounded-full p-1 cursor-pointer transition-all duration-300",
                               cat.showInHeader ? "bg-[#095181]" : "bg-[#d1d9e6]"
                            )}>
                               <div className={cn(
                                  "w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300 transform",
                                  cat.showInHeader ? "translate-x-5" : "translate-x-0"
                               )} />
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            {cat.parentVertical?.toLowerCase() === 'textiles' ? (
                              <div 
                                onClick={() => updateCategory(cat._id, { isCurated: !cat.isCurated })}
                                className={cn(
                                 "w-10 h-5 rounded-full p-1 cursor-pointer transition-all duration-300",
                                 cat.isCurated ? "bg-accent" : "bg-[#d1d9e6]"
                              )}>
                                 <div className={cn(
                                    "w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-300 transform",
                                    cat.isCurated ? "translate-x-5" : "translate-x-0"
                                 )} />
                              </div>
                            ) : (
                              <span className="text-[10px] text-gray-300 font-bold uppercase italic tracking-widest">N/A</span>
                            )}
                         </td>
                         <td className="px-8 py-6">
                            <input 
                              type="text" 
                              className="w-16 px-4 py-2 border border-[#d1d9e6] rounded-lg text-xs font-black text-[#1a2b4b] bg-white text-center"
                              defaultValue={cat.order}
                              onBlur={(e) => updateCategory(cat._id, { order: parseInt(e.target.value) })}
                            />
                         </td>
                         <td className="px-8 py-6">
                             <div className="flex items-center justify-center gap-4">
                                <Edit3 
                                  onClick={() => openModal(cat)}
                                  className="w-4 h-4 text-[#1a2b4b]/40 hover:text-[#095181] cursor-pointer transition-all hover:scale-110" 
                                />
                                <Trash2 
                                  onClick={() => deleteCategory(cat._id)}
                                  className="w-4 h-4 text-[#1a2b4b]/40 hover:text-accent cursor-pointer transition-all hover:scale-110" 
                                />
                                 <button 
                                   onClick={() => openSubManager(cat)}
                                   className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
                                 >
                                    Manage Sub-Nodes
                                 </button>
                                 <button 
                                   onClick={() => updateCategory(cat._id, { status: cat.status === 'Active' ? 'Inactive' : 'Active' })}
                                  className={cn(
                                   "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all",
                                   cat.status === 'Active' ? "border-green-100 text-green-600 bg-green-50" : "border-red-100 text-red-500 bg-red-50"
                                )}
                                >
                                   {cat.status}
                                </button>
                             </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
         )}
         
         <div className="p-8 bg-[#f8fafc]/50 border-t border-[#f0f3f8] flex justify-between items-center text-[10px] font-bold text-[#1a2b4b]/20 uppercase tracking-widest">
            <p className="italic italic-accent">Synced with MongoDB Cloud Atlas v2.0</p>
         </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#1a2b4b]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#d1d9e6] overflow-hidden"
            >
              <div className="p-8 border-b border-[#f0f3f8] flex justify-between items-center bg-[#f8fafc]">
                <h2 className="text-xl font-black text-[#1a2b4b] uppercase italic italic-accent">{editingCategory ? 'Edit Node' : 'Add New Node'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-[#1a2b4b]/20 hover:text-accent font-black">CLOSE</button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Category Name</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Business Vertical</label>
                    <select 
                      className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
                      value={formData.parentVertical}
                      onChange={(e) => setFormData({ ...formData, parentVertical: e.target.value })}
                    >
                      <option value="textiles">Textiles</option>
                      <option value="honda">Honda</option>
                      <option value="bajaj">Bajaj</option>
                      <option value="trucking">Trucking</option>
                      <option value="manufacturing">Manufacturing</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Banner Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {formData.image && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#d1d9e6] bg-[#f8fafc]">
                        <img src={formData.image} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] border-dashed rounded-xl text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest text-center hover:bg-white transition-all">
                        {formData.image ? 'CHANGE IMAGE' : 'UPLOAD NODE ASSET'}
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-4 bg-[#f8fafc] rounded-2xl border border-[#d1d9e6]">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="showInHeader"
                      checked={formData.showInHeader}
                      onChange={(e) => setFormData({ ...formData, showInHeader: e.target.checked })}
                      className="w-4 h-4 rounded text-primary focus:ring-primary/10"
                    />
                    <label htmlFor="showInHeader" className="text-[10px] font-black text-[#1a2b4b] uppercase tracking-widest cursor-pointer">Show in Header</label>
                  </div>
                  {formData.parentVertical?.toLowerCase() === 'textiles' && (
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="isCurated"
                        checked={formData.isCurated}
                        onChange={(e) => setFormData({ ...formData, isCurated: e.target.checked })}
                        className="w-4 h-4 rounded text-accent focus:ring-accent/10"
                      />
                      <label htmlFor="isCurated" className="text-[10px] font-black text-accent uppercase tracking-widest cursor-pointer">Promote to Curated</label>
                    </div>
                  )}
                  <div className="flex-1 flex items-center justify-end gap-3">
                    <label className="text-[10px] font-black text-[#1a2b4b]/40 uppercase tracking-widest">Order:</label>
                    <input 
                      type="number" 
                      className="w-16 px-3 py-2 bg-white border border-[#d1d9e6] rounded-lg text-xs font-black text-center"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#095181] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[.3em] shadow-xl shadow-[#095181]/20 hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'PRESERVING NODE...' : 'AUTHORIZE & SAVE'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUB-CATEGORY MODAL */}
      <AnimatePresence>
        {isSubModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSubModalOpen(false)}
              className="absolute inset-0 bg-[#1a2b4b]/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl h-[80vh] rounded-[2.5rem] shadow-2xl border border-[#d1d9e6] overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-[#f0f3f8] flex justify-between items-center bg-[#f8fafc]">
                 <div>
                    <h2 className="text-xl font-black text-[#1a2b4b] uppercase italic italic-accent">Sub-Nodes Hierarchy</h2>
                    <p className="text-[9px] font-black text-[#1a2b4b]/30 uppercase tracking-widest">Mapping children for: {activeParentNode?.name}</p>
                 </div>
                 <button onClick={() => setIsSubModalOpen(false)} className="text-[#1a2b4b]/20 hover:text-accent font-black">CLOSE ENGINE</button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 bg-[#fcfdfe]">
                 {/* Create Sub-Node Form */}
                 <div className="mb-10 p-6 bg-white rounded-2xl border border-[#d1d9e6] shadow-sm">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Initialize New Sub-Node</h3>
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-3">
                           <input 
                             type="text" 
                             placeholder="Sub-node name (e.g., Banarasi Silk)"
                             className="w-full px-5 py-3 bg-[#f8fafc] border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
                             value={newSubName}
                             onChange={(e) => setNewSubName(e.target.value)}
                           />
                           
                           <label className={cn(
                             "flex items-center gap-3 p-3 border-2 border-dashed rounded-xl cursor-pointer transition-all",
                             newSubBrochureUrl ? "bg-green-50 border-green-200" : "bg-[#f8fafc] border-[#d1d9e6] hover:bg-white"
                           )}>
                              <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shadow-md",
                                newSubBrochureUrl ? "bg-green-500 text-white" : "bg-white text-primary/20"
                              )}>
                                 <FileText className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                 <div className="text-[9px] font-black uppercase text-primary tracking-widest">
                                    {newSubBrochureUrl ? "Catalog Ready" : "Attach PDF Catalog"}
                                 </div>
                                 <div className="text-[8px] font-bold text-primary/20 uppercase tracking-widest leading-none mt-1">
                                    {newSubBrochureUrl ? "Click to change" : "Max 10MB Institutional Spec"}
                                 </div>
                              </div>
                              <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleSubBrochureUpload(e)} />
                           </label>
                        </div>
                        <button 
                          onClick={handleAddSubCategory}
                          disabled={isSubmittingSub || !newSubName}
                          className="bg-[#095181] text-white px-8 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#DA222A] transition-all disabled:opacity-50 h-fit py-5 shadow-lg shadow-[#095181]/20"
                        >
                           {isSubmittingSub ? <Loader2 className="w-3 h-3 animate-spin"/> : <Plus className="w-3 h-3" />} Complete Node
                        </button>
                    </div>
                 </div>

                 {/* List */}
                 <div className="space-y-3">
                    {subCategories.length === 0 ? (
                      <div className="py-20 text-center opacity-20">
                         <Layers className="w-10 h-10 mx-auto mb-4" />
                         <p className="text-[10px] font-black uppercase tracking-widest text-[#1a2b4b]">No child nodes established.</p>
                      </div>
                    ) : (
                      subCategories.map((sub, idx) => (
                        <div key={idx} className="border border-[#f0f3f8] bg-white rounded-xl overflow-hidden hover:border-primary/20 transition-all">
                           <div className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors">
                              <div className="flex items-center gap-4">
                                 <span className="text-[10px] font-bold text-[#1a2b4b]/20">{idx + 1}.</span>
                                 <h4 className="text-xs font-black text-[#1a2b4b] uppercase tracking-tight">{sub.name}</h4>
                              </div>
                              <div className="flex items-center gap-3">
                                 <button
                                   type="button"
                                   onClick={() => toggleSubSubExpanded(sub._id)}
                                   className={cn(
                                     "text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded transition-all flex items-center gap-1.5",
                                     expandedSubId === sub._id 
                                       ? "bg-accent text-white" 
                                       : "bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary"
                                   )}
                                 >
                                   Sub-Sub-Nodes
                                   <span className="text-[8px] opacity-80">{expandedSubId === sub._id ? "▲" : "▼"}</span>
                                 </button>
                                 <label className={cn(
                                   "w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all",
                                   sub.brochureUrl ? "bg-green-100 text-green-600" : "bg-gray-50 text-gray-300 hover:bg-primary/10 hover:text-primary"
                                 )}>
                                    <FileText className="w-4 h-4" />
                                    <input type="file" className="hidden" accept=".pdf" onChange={(e) => handleSubBrochureUpload(e, sub._id)} />
                                 </label>
                                 <Trash2 
                                   onClick={() => handleDeleteSub(sub._id)}
                                   className="w-3.5 h-3.5 text-[#1a2b4b]/20 hover:text-accent cursor-pointer transition-all" 
                                 />
                              </div>
                           </div>
                           
                           {/* Expanded Sub-Sub-Categories Area */}
                           {expandedSubId === sub._id && (
                             <div className="p-4 bg-gray-50 border-t border-[#f0f3f8] space-y-4">
                               <div className="flex items-center justify-between">
                                 <h5 className="text-[9px] font-black uppercase tracking-widest text-[#1a2b4b]/50">Sub-Sub-Nodes of {sub.name}</h5>
                               </div>
                               
                               {/* List of Sub-subcategories */}
                               <div className="space-y-2">
                                 {subSubCategoriesLoading ? (
                                   <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest py-1">
                                     <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" /> Loading Sub-Sub-Nodes...
                                   </div>
                                 ) : subSubCategories.length === 0 ? (
                                   <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest italic py-1">No sub-sub-nodes defined yet.</p>
                                 ) : (
                                   <div className="flex flex-wrap gap-2">
                                     {subSubCategories.map((subSub) => (
                                       <div key={subSub._id} className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-lg pl-3 pr-2 py-1.5 shadow-sm text-xs font-semibold text-[#1a2b4b] uppercase tracking-wide">
                                         <span>{subSub.name}</span>
                                         <button 
                                           type="button"
                                           onClick={() => handleDeleteSubSub(subSub._id)}
                                           className="text-gray-300 hover:text-red-500 font-bold transition-colors ml-1 p-0.5"
                                         >
                                           ×
                                         </button>
                                       </div>
                                     ))}
                                   </div>
                                 )}
                               </div>
                               
                               {/* Add new Sub-subcategory form */}
                               <div className="flex gap-2">
                                 <input 
                                   type="text"
                                   placeholder="New Sub-Sub-Node name (e.g. Lehenga)"
                                   className="flex-1 px-4 py-2 bg-white border border-[#d1d9e6] rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10 text-primary"
                                   value={newSubSubName}
                                   onChange={(e) => setNewSubSubName(e.target.value)}
                                 />
                                 <button
                                   type="button"
                                   onClick={() => handleAddSubSubCategory(sub._id)}
                                   disabled={isSubmittingSubSub || !newSubSubName}
                                   className="bg-[#095181] text-white px-5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 hover:bg-[#DA222A] transition-all disabled:opacity-50"
                                 >
                                   Add
                                 </button>
                               </div>
                             </div>
                           )}
                        </div>
                      ))
                    )}
                 </div>
              </div>

              <div className="p-8 border-t border-[#f0f3f8] bg-[#f8fafc] flex justify-between items-center text-[10px] font-black text-[#1a2b4b]/20 uppercase tracking-[0.2em]">
                 <span className="italic">Sub-Node Partition active</span>
                 <span>Total Children: {subCategories.length}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
