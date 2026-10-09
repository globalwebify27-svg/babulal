"use client";

import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Hash, 
  Type, 
  Layers, 
  Trash2, 
  Edit3, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const ATTRIBUTES = [
  { id: 1, name: 'Fabric', type: 'Select', values: ['Silk', 'Cotton', 'Chiffon', 'Georgette'], status: 'Active' },
  { id: 2, name: 'Work', type: 'Multi-Select', values: ['Zari', 'Embroidery', 'Handwork', 'Stone'], status: 'Active' },
  { id: 3, name: 'Pattern', type: 'Select', values: ['Floral', 'Solid', 'Geometric', 'Striped'], status: 'Active' },
];

export default function AttributesPage() {
  return (
    <div className="p-8 bg-[#f5f7fb] min-h-screen">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6]">
         <div>
            <h1 className="text-2xl font-black text-[#1a2b4b] uppercase tracking-tighter italic italic-accent">Global Attribute Engine</h1>
            <p className="text-[#1a2b4b]/40 text-[9px] uppercase font-bold tracking-[.3em] mt-1 italic">Define technical product specifications</p>
         </div>
         
         <button className="bg-[#095181] text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[.2em] shadow-lg shadow-[#095181]/20 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all">
            <Plus className="w-4 h-4" /> Define New Attribute
         </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
         {ATTRIBUTES.map((attr) => (
           <div key={attr.id} className="bg-white rounded-[2rem] p-8 shadow-sm border border-[#d1d9e6] group hover:border-[#095181]/30 transition-all">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-[#095181]/5 rounded-2xl flex items-center justify-center text-[#095181]">
                    <Sliders className="w-6 h-6" />
                 </div>
                 <div className="flex gap-2">
                    <Edit3 className="w-4 h-4 text-[#1a2b4b]/20 hover:text-[#095181] cursor-pointer transition-colors" />
                    <Trash2 className="w-4 h-4 text-[#1a2b4b]/20 hover:text-accent cursor-pointer transition-colors" />
                 </div>
              </div>

              <h3 className="text-[#1a2b4b] text-xl font-black uppercase tracking-tighter mb-1">{attr.name}</h3>
              <div className="flex items-center gap-2 mb-6">
                 <span className="text-[9px] font-black uppercase tracking-widest text-primary/40 bg-surface-dim px-2 py-0.5 rounded italic italic-accent">{attr.type}</span>
                 <span className="text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-2 py-0.5 rounded border border-green-100">{attr.status}</span>
              </div>

              <div className="space-y-2">
                 <div className="text-[9px] font-black uppercase tracking-widest text-[#1a2b4b]/20 mb-3">Stored Values</div>
                 <div className="flex flex-wrap gap-2">
                    {attr.values.map(val => (
                      <span key={val} className="px-3 py-1.5 bg-[#f8fafc] border border-[#d1d9e6] rounded-lg text-[10px] font-bold text-[#1a2b4b]/60 uppercase tracking-tight">
                         {val}
                      </span>
                    ))}
                    <button className="px-3 py-1.5 bg-white border border-dashed border-[#d1d9e6] rounded-lg text-[10px] font-bold text-[#1a2b4b]/20 uppercase tracking-tight hover:border-[#095181] hover:text-[#095181] transition-all">
                       + Add
                    </button>
                 </div>
              </div>
           </div>
         ))}

         {/* EMPTY STATE / ADD NEW CARD */}
         <div className="bg-white/50 rounded-[2rem] border-2 border-dashed border-[#d1d9e6] p-8 flex flex-col items-center justify-center text-center group hover:bg-white hover:border-[#095181]/20 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 text-[#1a2b4b]/10 group-hover:text-[#095181] transition-colors">
               <Plus className="w-8 h-8" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[.3em] text-[#1a2b4b]/20 group-hover:text-[#1a2b4b] transition-colors">Register Complex Attribute</span>
         </div>
      </div>

    </div>
  );
}
