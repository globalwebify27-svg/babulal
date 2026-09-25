"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Only render global Footer on pages like /about and /contact that do not embed their own Footer.
  // All vertical pages, category pages (/saree, /saree/fancy-sarees), product pages, and homepage render their own Footer.
  const shouldShowGlobalFooter = pathname === '/about' || pathname === '/contact';
  
  if (!shouldShowGlobalFooter) return null;
  
  return <Footer />;
}
