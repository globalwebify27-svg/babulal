"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  ShoppingBag,
  History,
  LayoutGrid,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { BUSINESS_VERTICALS } from '@/lib/constants';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const url = filter === 'ALL' 
        ? '/api/admin/products' 
        : `/api/admin/products?vertical=${filter.toLowerCase()}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tighter uppercase italic italic-accent">Product Inventory</h1>
          <p className="text-primary/40 text-[11px] uppercase tracking-[.3em] font-bold mt-2">Manage listings live from MongoDB</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={fetchProducts}
             className="bg-white p-3 rounded-md shadow-sm border border-primary/5 hover:bg-primary hover:text-white transition-all text-primary"
           >
              <History className={cn("w-5 h-5", isLoading && "animate-spin")} />
           </button>
           <Link 
             href="/admin/products/new"
             className="bg-accent text-white text-[11px] px-8 py-3 tracking-widest font-bold uppercase rounded-sm flex items-center gap-2 group shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition-all"
           >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add New Listing
           </Link>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-primary/5 mb-8 flex flex-col md:flex-row gap-6 items-center">
         <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 group-focus-within:text-accent transition-colors" />
            <input 
              type="text" 
              placeholder="Search product by name or category..." 
              className="w-full bg-surface-dim px-12 py-3 rounded-md text-sm font-semibold outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 transition-all border-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         
         <div className="hidden md:flex items-center gap-3 px-6 py-3 bg-surface-dim rounded-lg border border-primary/5">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[.2em] text-primary/60">Filtering: Textiles Only</span>
         </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-primary/5 overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-primary/2 border-b border-surface-dim">
                  <tr>
                     <th className="px-6 py-5 text-[10px] uppercase font-bold text-primary/40 tracking-widest">Product / Category</th>
                     <th className="px-6 py-5 text-[10px] uppercase font-bold text-primary/40 tracking-widest">Vertical</th>
                     <th className="px-6 py-5 text-[10px] uppercase font-bold text-primary/40 tracking-widest">Status</th>
                     <th className="px-6 py-5 text-[10px] uppercase font-bold text-primary/40 tracking-widest">Created At</th>
                     <th className="px-6 py-5 text-[10px] uppercase font-bold text-primary/40 tracking-widest text-right">Controls</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-surface-dim">
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((item) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={item._id} 
                        className="hover:bg-surface-dim/50 transition-colors group"
                      >
                        <td className="px-6 py-6 font-medium">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/5 rounded-md flex items-center justify-center text-primary/20 group-hover:bg-accent group-hover:text-white transition-all overflow-hidden relative">
                                  {item.images?.[0] ? (
                                    <img src={item.images[0]} alt={item.name} className="object-cover w-full h-full" />
                                  ) : (
                                    <ShoppingBag className="w-6 h-6" />
                                  )}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-primary tracking-tight">{item.name}</div>
                                    <div className="text-[10px] font-bold text-primary/30 uppercase tracking-widest mt-1">{item.category}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-6">
                            <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm border",
                              item.businessVertical === 'textiles' ? "border-primary/20 text-primary" : "border-accent/20 text-accent"
                            )}>
                                {item.businessVertical}
                            </span>
                        </td>
                        <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full", item.isActive ? "bg-green-500" : "bg-red-400")} />
                                <span className="text-[11px] font-bold text-primary">{item.isActive ? "Active" : "Hidden"}</span>
                            </div>
                        </td>
                        <td className="px-6 py-6">
                            <span className="text-[11px] font-bold text-primary/30 uppercase">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-6 text-right">
                            <div className="flex justify-end gap-2">
                                <Link 
                                  href={`/admin/products/${item._id}`}
                                  className="p-2.5 rounded-md bg-surface-dim text-primary/40 hover:bg-primary hover:text-white transition-all outline-none"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Link>
                                <button 
                                  onClick={() => deleteProduct(item._id)}
                                  className="p-2.5 rounded-md bg-surface-dim text-primary/40 hover:bg-accent hover:text-white transition-all shadow-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                                <Link 
                                  href={`/products/${item.slug}`}
                                  target="_blank"
                                  className="p-2.5 rounded-md bg-surface-dim text-primary/40 hover:bg-primary hover:text-white transition-all"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
               </tbody>
            </table>
         </div>

         {/* LOADING & EMPTY STATES */}
         {isLoading && (
           <div className="p-24 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
           </div>
         )}

         {!isLoading && filteredProducts.length === 0 && (
           <div className="p-24 text-center">
              <div className="flex justify-center mb-6">
                 <div className="bg-surface-dim p-10 rounded-full">
                    <ImageIcon className="w-10 h-10 text-primary/10" />
                 </div>
              </div>
              <h4 className="text-xl font-bold text-primary mb-2 tracking-tighter uppercase italic italic-accent">Collection Empty</h4>
              <p className="text-primary/30 text-xs font-bold uppercase tracking-widest leading-loose">No dynamic listings found for this vertical. <br /> Use the &apos;Add New Listing&apos; button to start your first inventory.</p>
           </div>
         )}
      </div>

    </div>
  );
}
