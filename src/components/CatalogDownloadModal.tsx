"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  Download, 
  ChevronRight, 
  BookOpen, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CatalogDownloadModal = ({ isOpen, onClose }: CatalogModalProps) => {
  const [step, setStep] = useState(1); // 1: Category, 2: Sub-Category, 3: Download
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setStep(1);
      setSelectedCategory(null);
      setSelectedSubCategory(null);
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // We need only categories from textiles vertical
      const res = await fetch('/api/admin/categories');
      const allCats = await res.json();
      const textileCats = allCats.filter((c: any) => c.parentVertical?.toLowerCase() === 'textiles');
      
      // Filter categories to only those that have at least one sub-category with a catalog
      // This is a bit heavy client-side, but since the list is small it's okay for now.
      // Better: Create a specific API for this.
      const catsWithBrochures = [];
      for (const cat of textileCats) {
          const subRes = await fetch(`/api/admin/sub-categories?categoryId=${cat._id}`);
          const subs = await subRes.json();
          if (subs.some((s: any) => s.brochureUrl)) {
              catsWithBrochures.push(cat);
          }
      }
      setCategories(catsWithBrochures);
    } catch (err) {
      console.error('Failed to fetch catalog categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (category: any) => {
    setSelectedCategory(category);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sub-categories?categoryId=${category._id}`);
      const data = await res.json();
      setSubCategories(data.filter((s: any) => s.brochureUrl));
      setStep(2);
    } catch (err) {
      console.error('Failed to fetch subs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubSelect = (sub: any) => {
    setSelectedSubCategory(sub);
    setStep(3);
  };

  const goBack = () => {
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0A5181]/40 backdrop-blur-md"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
               <div className="flex items-center gap-4">
                  {step > 1 && (
                    <button onClick={goBack} className="p-2 hover:bg-white rounded-full transition-all text-primary">
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  )}
                  <div>
                    <h2 className="text-xl font-black text-primary uppercase italic tracking-tight italic-accent">Collection Catalogs</h2>
                    <p className="text-[9px] font-black text-primary/30 uppercase tracking-widest mt-1">Download official institutional guides</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 bg-white rounded-full text-red-500 shadow-sm hover:rotate-90 transition-all">
                  <X className="w-5 h-5" />
               </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-100 w-full">
               <motion.div 
                 initial={{ width: '0%' }}
                 animate={{ width: `${(step / 3) * 100}%` }}
                 className="h-full bg-accent transition-all duration-500"
               />
            </div>

            <div className="p-8 min-h-[400px] flex flex-col">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-primary/20">
                   <Loader2 className="w-10 h-10 animate-spin" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Compiling Collection Inventory...</span>
                </div>
              ) : (
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                         <h3 className="text-[11px] font-black text-primary/40 uppercase tracking-[0.2em] mb-6">Select Department</h3>
                         <div className="grid grid-cols-1 gap-3">
                            {categories.map((cat) => (
                              <button 
                                key={cat._id}
                                onClick={() => handleCategorySelect(cat)}
                                className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-accent hover:shadow-xl hover:shadow-accent/5 transition-all group"
                              >
                                 <div className="flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                                       <ShoppingBag className="w-6 h-6" />
                                    </div>
                                    <div>
                                       <div className="text-sm font-black text-primary uppercase tracking-tight">{cat.name}</div>
                                       <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Available Document Packs</div>
                                    </div>
                                 </div>
                                 <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                         </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                         <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[11px] font-black text-primary/40 uppercase tracking-[0.2em]">Select Specific Catalog</h3>
                            <div className="px-3 py-1 bg-primary/5 rounded-full text-[9px] font-black text-primary uppercase tracking-widest">
                               {selectedCategory?.name} Section
                            </div>
                         </div>
                         <div className="grid grid-cols-1 gap-3">
                            {subCategories.map((sub) => (
                              <button 
                                key={sub._id}
                                onClick={() => handleSubSelect(sub)}
                                className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl hover:border-accent hover:shadow-xl transition-all group"
                              >
                                 <div className="flex items-center gap-4 text-left">
                                    <div className="w-10 h-10 bg-accent/5 rounded-lg flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                       <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="text-sm font-black text-primary uppercase tracking-tight">{sub.name} Catalog</div>
                                 </div>
                                 <Download className="w-5 h-5 text-gray-200 group-hover:text-accent transition-all" />
                              </button>
                            ))}
                         </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-10"
                      >
                         <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-8 border border-green-100 shadow-inner">
                            <CheckCircle2 className="w-12 h-12" />
                         </div>
                         <h3 className="text-2xl font-black text-primary uppercase tracking-tighter italic italic-accent text-center">Catalog Ready</h3>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2 text-center max-w-[280px]">
                            Official {selectedSubCategory?.name} price list and portfolio.
                         </p>

                         <div className="mt-12 w-full space-y-4">
                            <a 
                              href={selectedSubCategory?.brochureUrl}
                              download={`${selectedSubCategory?.name}-Catalog.pdf`}
                              className="w-full bg-accent text-white py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl shadow-accent/20 hover:-translate-y-1 transition-all"
                            >
                               <Download className="w-5 h-5" /> Download PDF Now
                            </a>
                            <button 
                              onClick={() => setStep(1)}
                              className="w-full py-4 text-[9px] font-black text-primary/40 uppercase tracking-widest hover:text-primary transition-colors flex items-center justify-center gap-2 group"
                            >
                               Browse Other Departments <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50/50 border-t border-gray-50 text-[9px] font-bold text-primary/30 uppercase tracking-[0.2em] flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Retail Access Active
               </div>
               <span>Babulal Premsons Group • Ranchi</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CatalogDownloadModal;
