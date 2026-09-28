"use client";

import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  Smartphone, 
  Trash2, 
  Edit3, 
  Navigation,
  Globe,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const LOCATIONS = [
  { id: 1, name: 'Main HQ / Textiles', address: 'Ranchi, Jharkhand, India', contact: '+91 93347 00444', vertical: 'Textiles', status: 'Active' },
  { id: 2, name: 'Honda Branch Shop', address: 'Chas, Bokaro, Jharkhand', contact: '+91 92346 00555', vertical: 'Honda', status: 'Active' },
];

export default function LocationsPage() {
  return (
    <div className="p-8 bg-[#f5f7fb] min-h-screen">
      
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6]">
         <div>
            <h1 className="text-2xl font-black text-[#1a2b4b] uppercase tracking-tighter italic italic-accent">Store Branch Manager</h1>
            <p className="text-[#1a2b4b]/40 text-[9px] uppercase font-bold tracking-[.3em] mt-1 italic">Managing physical group presence</p>
         </div>
         
         <button className="bg-[#095181] text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[.2em] shadow-lg shadow-[#095181]/20 flex items-center justify-center gap-2 hover:-translate-y-1 transition-all">
            <Plus className="w-4 h-4" /> Register New Branch
         </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-[#d1d9e6] overflow-hidden">
         <table className="w-full text-left">
            <thead>
               <tr className="bg-[#f8fafc]/50">
                  <th className="px-8 py-5 text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-[.2em] border-b border-[#f0f3f8]">Branch Identity</th>
                  <th className="px-8 py-5 text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-[.2em] border-b border-[#f0f3f8]">Operational Base</th>
                  <th className="px-8 py-5 text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-[.2em] border-b border-[#f0f3f8]">Contact Gateway</th>
                  <th className="px-8 py-5 text-[9px] font-black text-[#1a2b4b]/40 uppercase tracking-[.2em] border-b border-[#f0f3f8] text-center">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3f8]">
               {LOCATIONS.map((loc) => (
                 <tr key={loc.id} className="group hover:bg-[#fcfdfe] transition-all">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#095181]/5 rounded-2xl flex items-center justify-center text-[#095181]">
                             <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-[#1a2b4b] uppercase tracking-tighter">{loc.name}</h4>
                             <span className="text-[9px] font-black uppercase tracking-widest text-primary/40 italic italic-accent">{loc.vertical}</span>
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="space-y-1">
                          <div className="text-[11px] font-bold text-[#1a2b4b]/60 leading-tight">{loc.address}</div>
                          <div className="flex items-center gap-2 text-[9px] font-black text-green-600 uppercase tracking-widest">
                             <Navigation className="w-3 h-3" /> Active on Maps
                          </div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2 text-[10px] font-bold text-[#1a2b4b]/70">
                          <Smartphone className="w-3.5 h-3.5" /> {loc.contact}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center justify-center gap-3">
                          <button className="p-3 bg-surface-dim rounded-xl text-[#1a2b4b]/30 hover:bg-[#095181] hover:text-white transition-all shadow-sm">
                             <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-3 bg-surface-dim rounded-xl text-[#1a2b4b]/30 hover:bg-accent hover:text-white transition-all shadow-sm">
                             <Trash2 className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

    </div>
  );
}
