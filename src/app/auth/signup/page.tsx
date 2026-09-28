"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../../lib/utils';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STAFF' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary/[0.03] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-[550px] bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-primary/5 p-12 lg:p-16 z-10">
        
        <div className="mb-12">
           <div className="relative h-16 w-full mb-8">
              {mounted && (
                <Image
                  src="/babulal_premsons.avif"
                  alt="Babulal Premsons"
                  fill
                  className="object-contain object-left animate-in fade-in duration-700"
                />
              )}
           </div>
           <h1 className="text-primary text-2xl font-black tracking-tighter uppercase mb-2 italic italic-accent">Personnel Registration</h1>
           <p className="text-primary/30 text-[10px] uppercase font-bold tracking-widest leading-none">Create your administrative identity</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-3">
             <Lock className="w-4 h-4" /> {error}
          </div>
        )}

        {success ? (
          <div className="text-center py-10 space-y-4">
             <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500 mb-6 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
             </div>
             <h3 className="text-primary text-xl font-bold italic italic-accent uppercase">Registration Successful!</h3>
             <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">Redirecting to secure login gateway...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[.3em] text-primary/40 ml-1">Full Name</label>
                <div className="relative group">
                   <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-primary transition-colors" />
                   <input 
                     type="text" 
                     required
                     className="w-full bg-surface-dim border-none rounded-2xl py-4 px-14 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10"
                     placeholder="Ahmad Sana"
                     value={formData.name}
                     onChange={(e) => setFormData({...formData, name: e.target.value})}
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[.3em] text-primary/40 ml-1">Work Email</label>
                <div className="relative group">
                   <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-primary transition-colors" />
                   <input 
                     type="email" 
                     required
                     className="w-full bg-surface-dim border-none rounded-2xl py-4 px-14 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10"
                     placeholder="ahmad@premsons.com"
                     value={formData.email}
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
                   />
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[.3em] text-primary/40 ml-1">Security Password</label>
                <div className="relative group">
                   <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 group-focus-within:text-primary transition-colors" />
                   <input 
                     type="password" 
                     required
                     className="w-full bg-surface-dim border-none rounded-2xl py-4 px-14 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10"
                     placeholder="••••••••"
                     value={formData.password}
                     onChange={(e) => setFormData({...formData, password: e.target.value})}
                   />
                </div>
             </div>

             <button 
               type="submit" 
               disabled={isLoading}
               className="w-full py-5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[.3em] flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50 group"
             >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>Create Account <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                )}
             </button>
          </form>
        )}

        {!success && (
          <div className="mt-12 text-center">
             <p className="text-primary/30 text-[10px] font-bold uppercase tracking-widest">
                Already have an account?
                <Link href="/auth/login" className="text-primary hover:text-accent ml-2 underline underline-offset-4">Authenticate here</Link>
             </p>
          </div>
        )}
      </div>
    </div>
  );
}
