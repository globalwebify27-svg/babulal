export const BUSINESS_VERTICALS = {
  TEXTILES: {
    id: "textiles",
    name: "Babulal Premkumar",
    industry: "Textiles & Garment Distribution",
    slug: "textiles",
    color: "#095181",
    accent: "#DA222A",
    tagline: "Textile & Garment Distributors in Ranchi, Jharkhand — Serving Customers for Over 100 Years.",
    seoPattern: "Textile & Garment Distributor in Ranchi, Jharkhand",
    categories: ["Saree", "Kurti", "Lehenga", "Suit", "Fabric"],
    image: "/vertical_textiles.png"
  },
  /*
  HONDA: {
    id: "honda",
    name: "Premsons Honda",
    industry: "Automotive Mobility",
    slug: "honda",
    color: "#000000",
    accent: "#DA222A",
    tagline: "Authorised Dealer of Honda Motorcycles & Scooters in Ranchi, Bokaro, Dhanbad & Chandwa.",
    seoPattern: "Honda Two-Wheeler Showroom in Ranchi, Bokaro, Dhanbad & Chandwa",
    categories: ["Scooter", "Motorcycle", "Superbike"],
    image: "/vertical_honda.png"
  },
  BAJAJ: {
    id: "bajaj",
    name: "Premsons Bajaj",
    industry: "Last-mile Logistics",
    slug: "bajaj",
    color: "#0A5181",
    accent: "#DA222A",
    tagline: "Authorised Bajaj Three-Wheeler Distributor.",
    seoPattern: "Bajaj Auto-rickshaw Dealer Jharkhand",
    categories: ["Passenger", "Cargo", "Electric"],
    image: "/vertical_bajaj.png"
  },
  TRUCKING: {
    id: "trucking",
    name: "Premsons & Poddar Trucking",
    industry: "Commercial Logistics",
    slug: "trucking",
    color: "#1B365D",
    accent: "#DA222A",
    tagline: "Commercial Vehicle Logistics & Trucking Hub since 1995.",
    seoPattern: "Premsons Poddar Trucking Showroom Ranchi",
    categories: ["HCV", "LCV", "Buses"],
    image: "/vertical_trucks.png"
  },
  MUVA: {
    id: "muva-industries",
    name: "MUVA Industries",
    industry: "Industrial Engineering",
    slug: "muva-industries",
    color: "#2D2D2D",
    accent: "#DA222A",
    tagline: "Innovating Industrial Solutions since 2012.",
    seoPattern: "Manufacturing and Engineering Ranchi",
    categories: ["Precision", "Casting", "Assembly"],
    image: "/vertical_manufacturing.png"
  }
  */
} as const;

export type VerticalID = keyof typeof BUSINESS_VERTICALS;
export type Vertical = typeof BUSINESS_VERTICALS[VerticalID];

/**
 * Inventory Catalog Section Visibility Configuration
 * Default: false (disabled by default as per Requirement 1).
 * Designed for future Admin Panel control (site-wide or per-category).
 */
export interface InventoryCatalogConfig {
  enabled: boolean;
}

export const INVENTORY_CATALOG_CONFIG: InventoryCatalogConfig = {
  enabled: false,
};

export function isInventoryCatalogEnabled(_categorySlug?: string): boolean {
  return INVENTORY_CATALOG_CONFIG.enabled;
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://babulalpremsons.com';
export const DEFAULT_WHATSAPP_NUMBER = '+91 76679 85545';


