"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Hide the global Footer on vertical-specific pages that have their own specialized footer
  const shouldHide = pathname?.startsWith('/textiles') || 
                     pathname?.startsWith('/honda') || 
                     pathname?.startsWith('/bajaj') ||
                     pathname?.startsWith('/trucking') ||
                     pathname?.startsWith('/muva-industries') ||
                     pathname?.startsWith('/admin') ||
                     pathname?.startsWith('/auth') ||
                     pathname?.startsWith('/welcome');
  
  if (shouldHide) return null;
  
  return <Footer />;
}
