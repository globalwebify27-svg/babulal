import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import AuthProvider from "@/components/AuthProvider";
import { cn } from "../lib/utils";

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
  metadataBase: new URL('https://babulalpremkumar.com'),
  title: "Babulal Premkumar | 100+ Years Legacy",
  description: "Babulal Premkumar - A premium textile destination offering an exclusive collection of Sarees, Lehengas, Suits, and more. Based in Ranchi, Jharkhand with over 100+ Years Legacy.",
  keywords: "Babulal Premkumar, Ranchi, Textiles, Sarees, Lehengas, Suits, Kurtis, Mens Wear, Womens Western Wear, Kids Collection",
  robots: "index, follow",
  openGraph: {
    title: "Babulal Premkumar | 100+ Years Legacy",
    description: "Babulal Premkumar - A premium textile destination offering an exclusive collection of Sarees, Lehengas, Suits, and more. Based in Ranchi, Jharkhand with over 100+ Years Legacy.",
    type: "website",
    locale: "en_US",
    siteName: "Babulal Premkumar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Babulal Premkumar | 100+ Years Legacy",
    description: "Babulal Premkumar - A premium textile destination offering an exclusive collection of Sarees, Lehengas, Suits, and more. Based in Ranchi, Jharkhand with over 100+ Years Legacy.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Babulal Premkumar",
  "url": "https://babulalpremkumar.com/",
  "logo": "https://babulalpremkumar.com/_next/image?url=%2FBabulalPremkumar.png&w=828&q=75",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91 7667985545",
    "contactType": "customer service",
    "areaServed": "IN",
    "availableLanguage": ["en", "Hindi"],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Babulal Premkumar",
  "image": "https://babulalpremkumar.com/_next/image?url=%2FBabulalPremkumar.png&w=828&q=75",
  "@id": "https://babulalpremkumar.com/",
  "url": "https://babulalpremkumar.com/",
  "telephone": "+91 7667985545",
  "priceRange": "₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Near, Gandhi Chowk, Upper Bazar, Ranchi, Jharkhand 834001",
    "addressLocality": "Ranchi",
    "postalCode": "834001",
    "addressCountry": "IN",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 23.3716429,
    "longitude": 85.3221622,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7P9BQ523MY" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-7P9BQ523MY');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
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
