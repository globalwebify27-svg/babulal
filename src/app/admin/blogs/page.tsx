"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Eye, 
  Trash2, 
  Edit3, 
  Calendar,
  User,
  Globe,
  MoreVertical
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const ARTICLES = [
  { id: 1, title: 'The Evolution of Banarasi Silk', vertical: 'Textiles', author: 'Ahmad Sana', status: 'Published', date: '21 Mar 2024' },
  { id: 2, title: '10 Maintenance Tips for Honda Activa', vertical: 'Honda', author: 'Staff Writer', status: 'Draft', date: '15 Mar 2024' },
];

export default function BlogsPage() {
  return (
    <div className="p-8 bg-[#f5f7fb] min-h-screen">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6]">
         <div>
            <h1 className="text-2xl font-black text-[#1a2b4b] uppercase tracking-tighter italic italic-accent">Editorial Control</h1>
            <p className="text-[#1a2b4b]/40 text-[9px] uppercase font-bold tracking-[.3em] mt-1 italic">Manage group-wide blog & news content</p>
         </div>
         
         <button className="bg-[#095181] text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[.2em] shadow-lg shadow-[#095181]/20 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all">
            <Plus className="w-4 h-4" /> Create New Article
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {ARTICLES.map((article) => (
           <div key={article.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-[#d1d9e6] group hover:border-[#095181]/30 transition-all flex flex-col">
              <div className="h-48 bg-[#f8fafc] flex items-center justify-center border-b border-[#f0f3f8] relative">
                 <FileText className="w-16 h-16 text-[#1a2b4b]/5" />
                 <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-[#095181] text-white text-[8px] font-black uppercase tracking-[.2em] px-3 py-1 rounded-full shadow-lg">
                       {article.vertical}
                    </span>
                 </div>
              </div>
              
              <div className="p-8 flex-1">
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[#1a2b4b] text-xl font-black uppercase tracking-tighter leading-tight group-hover:text-[#095181] transition-colors">
                       {article.title}
                    </h3>
                    <MoreVertical className="w-5 h-5 text-[#1a2b4b]/20" />
                 </div>
                 
                 <div className="flex items-center gap-6 mb-8 mt-6">
                    <div className="flex items-center gap-2">
                       <User className="w-3.5 h-3.5 text-[#1a2b4b]/30" />
                       <span className="text-[10px] font-bold text-[#1a2b4b]/40 uppercase tracking-widest">{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar className="w-3.5 h-3.5 text-[#1a2b4b]/30" />
                       <span className="text-[10px] font-bold text-[#1a2b4b]/40 uppercase tracking-widest">{article.date}</span>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-[#f0f3f8]">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md",
                      article.status === 'Published' ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-500"
                    )}>
                       {article.status}
                    </span>
                    <div className="flex items-center gap-2">
                       <button className="p-3 bg-surface-dim rounded-xl text-[#1a2b4b]/30 hover:bg-[#095181] hover:text-white transition-all shadow-sm">
                          <Edit3 className="w-4 h-4" />
                       </button>
                       <button className="p-3 bg-surface-dim rounded-xl text-[#1a2b4b]/30 hover:bg-accent hover:text-white transition-all shadow-sm">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
         ))}
      </div>

    </div>
  );
}
