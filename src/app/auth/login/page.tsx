"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-primary/5 overflow-hidden z-10">
        
        {/* BRAND SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-primary relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px:20px]" />
           
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-16 h-20">
                 {mounted && (
                   <div className="relative h-20 w-full animate-in fade-in duration-700">
                      <Image
                        src="/babulal_premsons.avif"
                        alt="Babulal Premsons"
                        fill
                        className="object-contain object-left brightness-0 invert"
                      />
                   </div>
                 )}
              </div>
              
              <h2 className="text-white text-5xl font-black tracking-tighter leading-none mb-6 italic italic-accent">
                 Command <br /> Center.
              </h2>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-[.4em] leading-loose">
                 Authorized Personnel Only. <br /> Secure Administrative Control Gateway.
              </p>
           </div>

           <div className="relative z-10 flex gap-10">
              <div className="flex items-center gap-3 text-white/30">
                 <ShieldCheck className="w-5 h-5" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-3 text-white/30">
                 <Globe className="w-5 h-5" />
                 <span className="text-[9px] font-black uppercase tracking-widest">Global Ecosystem</span>
              </div>
           </div>
        </div>

        {/* LOGIN SIDE */}
        <div className="p-10 md:p-16 lg:p-20 flex flex-col justify-center">
           <div className="mb-12">
              <h1 className="text-primary text-3xl font-black tracking-tighter uppercase mb-2">Secure Login</h1>
              <p className="text-primary/30 text-[10px] uppercase font-bold tracking-widest leading-none">Access your group dashboard</p>
           </div>

           {error && (
             <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold uppercase tracking-tight flex items-center gap-3">
                <Lock className="w-4 h-4" /> {error}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-[.3em] text-primary/40 ml-1">Email Address</label>
                 <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      required
                      className="w-full bg-surface-dim border-none rounded-2xl py-5 px-14 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                      placeholder="admin@premsons.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] font-black uppercase tracking-[.3em] text-primary/40 ml-1">Password</label>
                 <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="password" 
                      required
                      className="w-full bg-surface-dim border-none rounded-2xl py-5 px-14 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[.3em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] disabled:opacity-50 group"
              >
                 {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                   <>Authentication <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                 )}
              </button>
           </form>

           <div className="mt-12 text-center">
              <p className="text-primary/30 text-[10px] font-bold uppercase tracking-widest">
                 New management personnel?
                 <Link href="/auth/signup" className="text-primary hover:text-accent ml-2 underline underline-offset-4">Register here</Link>
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
