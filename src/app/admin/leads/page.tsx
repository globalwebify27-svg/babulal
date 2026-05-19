"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText,
  Loader2,
  Filter,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const url = filter === 'ALL' 
        ? '/api/admin/leads' 
        : `/api/admin/leads?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setLeads(data);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      }
    } catch (err) {
      console.error('Failed to update lead:', err);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.mobile.includes(search) ||
    l.businessVertical.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tighter uppercase italic italic-accent">Global Lead Inbox</h1>
          <p className="text-primary/40 text-[11px] uppercase tracking-[.3em] font-bold mt-2">Omni-channel inquiry management</p>
        </div>
        <div className="flex gap-4 p-1 bg-white rounded-lg shadow-sm border border-primary/5">
           {['ALL', 'NEW', 'IN_PROGRESS', 'CLOSED'].map((s) => (
             <button
               key={s}
               onClick={() => setFilter(s)}
               className={cn(
                 "text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-md transition-all",
                 filter === s ? "bg-primary text-white" : "text-primary/30 hover:text-primary"
               )}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative mb-8 group">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30 group-focus-within:text-accent transition-colors" />
         <input 
           type="text" 
           placeholder="Search leads by name, phone or division..." 
           className="w-full bg-white px-14 py-4 rounded-xl text-sm font-semibold outline-none border border-primary/5 focus:ring-2 focus:ring-accent/10 transition-all shadow-sm"
           value={search}
           onChange={(e) => setSearch(e.target.value)}
         />
      </div>

      {/* LEADS LIST */}
      <div className="space-y-4">
         {isLoading ? (
           <div className="p-24 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
           </div>
         ) : filteredLeads.length === 0 ? (
           <div className="p-24 text-center bg-white rounded-2xl border border-primary/5 shadow-sm">
              <div className="flex justify-center mb-6">
                 <div className="bg-surface-dim p-10 rounded-full">
                    <Filter className="w-10 h-10 text-primary/10" />
                 </div>
              </div>
              <h4 className="text-xl font-bold text-primary mb-2 tracking-tighter uppercase italic italic-accent">No Leads Found</h4>
              <p className="text-primary/30 text-xs font-bold uppercase tracking-widest">The inquiry inbox is currently empty for this filter.</p>
           </div>
         ) : (
           <AnimatePresence mode="popLayout">
             {filteredLeads.map((lead) => (
               <motion.div
                 layout
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 key={lead.id}
                 className="bg-white p-6 rounded-2xl shadow-sm border border-primary/5 flex items-center justify-between group hover:border-accent/30 transition-all"
               >
                 <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center relative",
                      lead.source === 'WHATSAPP' ? "bg-green-50 text-green-500" : "bg-primary/5 text-primary"
                    )}>
                       {lead.source === 'WHATSAPP' ? <MessageCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                       {lead.status === 'NEW' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-white animate-pulse" />}
                    </div>
                    <div>
                       <div className="flex items-center gap-3">
                          <h4 className="text-sm font-bold text-primary tracking-tight transition-colors group-hover:text-accent">{lead.name}</h4>
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-surface-dim text-primary/40 rounded italic italic-accent">{lead.businessVertical}</span>
                       </div>
                       <div className="flex items-center gap-4 mt-1">
                          <span className="text-[11px] font-bold text-primary/40 leading-none">{lead.mobile}</span>
                          <div className="w-1 h-1 bg-primary/10 rounded-full" />
                          <span className="text-[10px] font-bold text-primary/20 uppercase tracking-tighter flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {new Date(lead.createdAt).toLocaleString()}
                          </span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-8">
                    {lead.interest && (
                       <div className="hidden lg:block text-right">
                          <div className="text-[9px] font-bold text-primary/20 uppercase tracking-widest mb-1">Interest</div>
                          <div className="text-[11px] font-extrabold text-primary/60 italic uppercase">{lead.interest}</div>
                       </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                       {lead.status !== 'CLOSED' && (
                         <button 
                           onClick={() => updateStatus(lead.id, 'CLOSED')}
                           className="p-3 rounded-lg bg-surface-dim text-primary/30 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                           title="Mark as Resolved"
                         >
                            <CheckCircle2 className="w-4 h-4" />
                         </button>
                       )}
                       {lead.status === 'NEW' && (
                         <button 
                           onClick={() => updateStatus(lead.id, 'IN_PROGRESS')}
                           className="p-3 rounded-lg bg-surface-dim text-primary/30 hover:bg-primary hover:text-white transition-all shadow-sm"
                           title="Start Processing"
                         >
                            <ArrowRight className="w-4 h-4" />
                         </button>
                       )}
                       <button 
                         className="p-3 rounded-lg bg-surface-dim text-primary/30 hover:bg-accent hover:text-white transition-all shadow-sm"
                         title="Archive Lead"
                       >
                          <XCircle className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>
         )}
      </div>
    </div>
  );
}
