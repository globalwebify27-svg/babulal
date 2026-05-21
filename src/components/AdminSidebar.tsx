"use client";

import React from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  ExternalLink,
  LogOut,
  ChevronRight,
  Layers,
  Sliders,
  ImageIcon,
  FileText,
  MapPin,
  Globe,
  Video
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Manage Categories', icon: Layers, href: '/admin/categories' },
  { name: 'Manage Product', icon: ShoppingBag, href: '/admin/products' },
  { name: 'Product Attributes', icon: Sliders, href: '/admin/attributes' },
  { name: 'Manage Enquiry', icon: Users, href: '/admin/leads' },
  { name: 'Manage Banners', icon: ImageIcon, href: '/admin/banners' },
  { name: 'Manage Verticals', icon: Globe, href: '/admin/verticals' },
  { name: 'Instagram Reels', icon: Video, href: '/admin/reels' },
  { name: 'Manage Blog Article', icon: FileText, href: '/admin/blogs' },
  { name: 'Manage Locations', icon: MapPin, href: '/admin/locations' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-72 bg-white h-screen fixed left-0 top-0 border-r border-primary/5 flex flex-col z-50">
      {/* BRANDING */}
      <div className="p-8 pb-8">
        <Link href="/" className="block">
          <div className="relative h-16 w-full">
            <Image 
              src="/babulal_premsons.avif" 
              alt="Babulal Premsons Group" 
              fill 
              className="object-contain object-left"
            />
          </div>
        </Link>
        <p className="text-[8px] uppercase tracking-[.4em] font-black text-primary/20 mt-2 px-1">Command Center</p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-primary/50 hover:bg-surface-dim hover:text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5 transition-transform", isActive ? "" : "group-hover:scale-110")} />
                <span className="text-[11px] font-bold uppercase tracking-widest">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-6 border-t border-surface-dim space-y-4">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-primary/40 hover:text-primary transition-colors">
          <ExternalLink className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Visit Site</span>
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full flex items-center gap-3 px-4 py-3 text-accent hover:bg-accent/5 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Secure Logout</span>
        </button>
      </div>
    </div>
  );
}
