import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import AuthProvider from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A5181",
};

export const metadata: Metadata = {
  title: "Babulal Premsons Group | 100+ Years Legacy",
  description: "A diverse business group with interests in Textiles, Two-Wheelers, Commercial Vehicles, and Manufacturing. Based in Ranchi, Jharkhand. Over 100+ Years Legacy.",
  keywords: "Babulal Premsons, Ranchi, Textiles, Honda Dealer, Premsons Poddar Trucking, Bajaj Auto, Manufacturing",
  robots: "index, follow",
  openGraph: {
    title: "Babulal Premsons Group | 100+ Years Legacy",
    description: "A diverse business group with interests in Textiles, Two-Wheelers, Commercial Vehicles, and Manufacturing. Based in Ranchi, Jharkhand. Over 100+ Years Legacy.",
    type: "website",
    locale: "en_US",
    siteName: "Babulal Premsons Group",
  },
  twitter: {
    card: "summary_large_image",
    title: "Babulal Premsons Group | 100+ Years Legacy",
    description: "A diverse business group with interests in Textiles, Two-Wheelers, Commercial Vehicles, and Manufacturing. Based in Ranchi, Jharkhand. Over 100+ Years Legacy.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={cn(
          outfit.variable,
          "font-sans antialiased selection:bg-accent selection:text-white"
        )}
      >
        <AuthProvider>
          <NavbarWrapper />
          <main className="min-h-screen overflow-x-hidden">
            {children}
          </main>
          <FooterWrapper />
        </AuthProvider>
      </body>
    </html>
  );
}
