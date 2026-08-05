"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  MessageCircle, 
  ShieldCheck, 
  Truck,
  Settings,
  Star,
  ChevronRight
} from 'lucide-react';

const TruckingFooter = () => {
  return (
    <footer className="relative bg-[#073E62] text-white pt-32 pb-12 overflow-hidden border-t-8 border-[#DA222A]">
      
      {/* ═══ INDUSTRIAL BACKGROUND WATERMARK ═══ */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-white/[0.02] skew-x-[-15deg] translate-x-1/2 pointer-events-none" />
      <div className="absolute top-0 left-0 text-[18vw] font-black text-white/[0.01] select-none pointer-events-none leading-none -mt-20 -ml-20">
        TRUCK
      </div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* TOP LAYER: THE STRATEGIC HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24 pb-20 border-b border-white/5">
          
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-8">
              <Link href="/trucking" className="inline-block relative w-64 h-16">
                 <Image 
                    src="/poddarlogo.png" 
                    alt="Premsons & Poddar Trucking Logo" 
                    fill 
                    className="object-contain object-left brightness-0 invert"
                 />
              </Link>
              <p className="text-white/60 text-lg font-medium italic leading-relaxed max-w-lg">
                Driving the commercial arteries of Jharkhand since 2017. Award winning excellence in M & HCV sales, service, and technical logistics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/5">
               <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#DA222A]">
                     <Star className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#DA222A] mb-1">National Recognition</p>
                     <p className="text-white text-[11px] font-black uppercase leading-tight italic">Best Debuted Dealer <br />in India</p>
                  </div>
               </div>
               <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#DA222A]">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#DA222A] mb-1">Scale of Trust</p>
                     <p className="text-white text-[11px] font-black uppercase leading-tight italic">Authorized M & HCV <br />Center</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            
            <div className="space-y-10">
              <h4 className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.4em]">The Fleet</h4>
              <ul className="space-y-5">
                {['M & HCV Trucks', 'Tippers & Construction', 'Passenger Buses', 'Haulage Selection', 'LCV Range'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/50 text-[11px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-3 group">
                      <div className="w-5 h-[1px] bg-[#DA222A]/30 group-hover:w-8 transition-all" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-10">
              <h4 className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.4em]">Solutions</h4>
              <ul className="space-y-5">
                {['i-Alert Telematics', 'Fleet Finance', 'Reconditioned Parts', 'Fleet Management', 'Driver Training'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/50 text-[11px] font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-3 group">
                      <div className="w-5 h-[1px] bg-[#DA222A]/30 group-hover:w-8 transition-all" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-10 col-span-2 md:col-span-1">
              <h4 className="text-[#DA222A] text-[11px] font-black uppercase tracking-[.4em]">Regional HQ</h4>
              <div className="space-y-8">
                <div className="flex gap-5">
                   <MapPin className="w-5 h-5 text-[#DA222A] shrink-0" />
                   <p className="text-white/60 text-xs font-medium italic leading-relaxed">
                     7CJ7+JJP, NH 20, Rampur,<br />
                     Ganrke, Jharkhand - 834010
                   </p>
                </div>
                <div className="flex gap-5">
                   <Phone className="w-5 h-5 text-[#DA222A] shrink-0" />
                   <p className="text-white/60 text-xs font-medium italic leading-relaxed">
                     Sales & Support: +91 651 220 7555
                   </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM LAYER: CORPORATE GOVERNANCE */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 border-t border-white/5 pt-12">
           <div className="flex flex-col md:flex-row items-center gap-8">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[.4em]">© 2026 Premsons & Poddar Trucking. A Babulal Premsons Enterprise.</p>
              <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest text-white/20">
                 <Link href="#" className="hover:text-white transition-colors">Compliance</Link>
                 <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                 <Link href="#" className="hover:text-white transition-colors">HCV Terms</Link>
              </div>
           </div>
           
           <div className="flex gap-6">
              {[Globe, MessageCircle, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-white/40 hover:bg-[#DA222A] hover:text-white transition-all transform hover:-translate-y-1">
                   <Icon className="w-5 h-5" />
                </Link>
              ))}
           </div>
        </div>

      </div>
    </footer>
  );
};

export default TruckingFooter;
