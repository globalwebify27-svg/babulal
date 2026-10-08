import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-surface-dim min-h-screen overflow-x-hidden">
      <AdminSidebar />
      <main className="ml-72 flex-1 relative min-w-0 max-w-[calc(100vw-18rem)]">
        {/* Subtle decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/[0.02] rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-40 left-40 w-64 h-64 bg-accent/[0.02] rounded-full blur-[80px] pointer-events-none" />
        
        {/* Content Container */}
        <div className="relative z-10 min-h-screen w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
