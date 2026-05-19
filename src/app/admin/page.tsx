"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  Layers, 
  FileText, 
  Phone, 
  Activity,
  Calendar,
  Loader2,
  Package,
  TrendingUp,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/dashboard/stats');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-[10px] font-black uppercase tracking-[.3em] text-primary/40">Loading Group Intelligence...</p>
        </div>
      </div>
    );
  }

  const STATS = [
    { label: 'Total Enquiries', value: data?.stats?.totalLeads || 0, icon: Users, color: 'bg-[#095181]' },
    { label: 'Live Listings', value: data?.stats?.totalProducts || 0, icon: Package, color: 'bg-accent shadow-accent/20 shadow-xl' },
    { label: '30-Day Velocity', value: data?.stats?.monthlyLeads || 0, icon: TrendingUp, color: 'bg-[#095181]' },
    { label: 'Group Divisions', value: '5', icon: Layers, color: 'bg-[#095181]' },
    { label: 'Active Showrooms', value: '2', icon: MapPin, color: 'bg-[#095181]' },
    { label: 'Digital Presence', value: 'Online', icon: Activity, color: 'bg-[#095181]' },
  ];

  return (
    <div className="p-8 bg-[#f5f7fb] min-h-screen">
      
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
         <div>
            <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic">
              Group <span className="text-accent underline decoration-accent/10 underline-offset-8">Intelligence</span>
            </h1>
            <p className="text-primary/40 text-[10px] uppercase font-bold tracking-[.4em] mt-2 italic">Official Command Center: Babulal Premsons Group</p>
         </div>
         <div className="flex gap-4">
            <div className="bg-white px-6 py-4 rounded-xl border border-primary/10 flex items-center gap-4 shadow-sm">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Systems Optimal</span>
            </div>
         </div>
      </div>

      {/* ═══ STATS GRID ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
         {STATS.map((stat, idx) => (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: idx * 0.05 }}
             key={stat.label} 
             className={cn("p-10 rounded-3xl shadow-2xl border border-white/10 relative overflow-hidden group transition-all duration-500 hover:-translate-y-2", stat.color)}
           >
              {/* Cinematic Shine Overlay */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rotate-45 translate-x-24 -translate-y-24 group-hover:scale-125 transition-transform duration-1000" />
              
              <div className="flex items-start justify-between relative z-10">
                 <div>
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-[.3em] mb-4">{stat.label}</div>
                    <div className="text-white text-5xl font-black tracking-tighter leading-none">{stat.value}</div>
                 </div>
                 <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-md">
                    <stat.icon className="w-8 h-8 text-white" />
                 </div>
              </div>
           </motion.div>
         ))}
      </div>

      {/* ═══ RECENT ACTIVITY TABLE ═══ */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-primary/5 overflow-hidden">
         <div className="p-10 border-b border-surface-dim flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <h2 className="text-primary text-xl font-black uppercase tracking-tighter italic">Live Transmission</h2>
               </div>
               <p className="text-primary/30 text-[9px] font-black uppercase tracking-widest mt-1">Real-time Lead Capture from Digital Portals</p>
            </div>
            <button className="bg-primary text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/95 shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3">
               Universal Lead Ledger <ChevronRight className="w-4 h-4" />
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-surface-dim/50">
                     <th className="px-10 py-5 text-[10px] font-black text-primary/40 uppercase tracking-[.3em] border-b border-surface-dim">Source</th>
                     <th className="px-10 py-5 text-[10px] font-black text-primary/40 uppercase tracking-[.3em] border-b border-surface-dim">Consignee/Sender</th>
                     <th className="px-10 py-5 text-[10px] font-black text-primary/40 uppercase tracking-[.3em] border-b border-surface-dim">Interest Profile</th>
                     <th className="px-10 py-5 text-[10px] font-black text-primary/40 uppercase tracking-[.3em] border-b border-surface-dim text-center">Protocol</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-surface-dim">
                  {data?.latestLeads?.length > 0 ? (
                    data.latestLeads.map((enq: any) => (
                      <tr key={enq.id} className="group hover:bg-surface-dim/30 transition-all duration-300">
                         <td className="px-10 py-8">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary">
                                  {enq.businessVertical === 'textiles' ? <Layers className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{enq.businessVertical}</span>
                            </div>
                         </td>
                         <td className="px-10 py-8">
                            <div className="space-y-1">
                               <div className="text-sm font-black text-primary uppercase tracking-tight flex items-center gap-2">
                                  {enq.name}
                                  {enq.status === 'NEW' && <span className="bg-accent/10 text-accent text-[8px] px-2 py-0.5 rounded-full">LIVE</span>}
                               </div>
                               <div className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">
                                  Origin: <span className="text-primary/60">{enq.city || 'Unknown'}</span>
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-8">
                            <div className="space-y-1.5">
                               <div className="text-[11px] font-black text-primary uppercase tracking-wider italic italic-accent line-clamp-1">
                                  {enq.interest}
                               </div>
                               <div className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">
                                  {new Date(enq.createdAt).toLocaleDateString()} — {new Date(enq.createdAt).toLocaleTimeString()}
                               </div>
                            </div>
                         </td>
                         <td className="px-10 py-8">
                            <div className="flex justify-center">
                               <a 
                                 href={`tel:${enq.mobile}`}
                                 className="bg-primary p-4 rounded-2xl text-white shadow-xl shadow-primary/20 hover:-translate-y-1 hover:bg-accent transition-all duration-300"
                               >
                                  <Phone className="w-4 h-4" />
                               </a>
                            </div>
                         </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                           <UserCheck className="w-12 h-12" />
                           <p className="text-[10px] font-black uppercase tracking-[.4em]">Awaiting Incoming Transmissions</p>
                        </div>
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
