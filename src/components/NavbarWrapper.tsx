"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Only render global Navbar on pages like /about and /contact that do not embed their own header.
  // All vertical pages, category pages (/saree, /saree/fancy-sarees), product pages, and homepage render their own Header/Navbar.
  const shouldShowGlobalNavbar = pathname === '/about' || pathname === '/contact';
  
  if (!shouldShowGlobalNavbar) return null;
  
  return <Navbar />;
}
