export const BUSINESS_VERTICALS = {
  TEXTILES: {
    id: "textiles",
    name: "Babulal Premkumar",
    industry: "Textiles & Apparel",
    slug: "textiles",
    color: "#095181",
    accent: "#DA222A",
    tagline: "India's Legacy in Wholesale & Retail Textiles since 1978.",
    seoPattern: "Saree & Apparel Wholesale & Retail in Ranchi",
    categories: ["Saree", "Kurti", "Lehenga", "Suit", "Fabric"],
    image: "/vertical_textiles.png"
  },
  HONDA: {
    id: "honda",
    name: "Premsons Honda",
    industry: "Automotive Mobility",
    slug: "honda",
    color: "#000000",
    accent: "#DA222A",
    tagline: "Jharkhand's Largest Authorised Honda Dealer.",
    seoPattern: "Honda Two-Wheeler Showroom in Ranchi",
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
    name: "Premsons & Poddars Trucking",
    industry: "Commercial Logistics",
    slug: "trucking",
    color: "#1B365D",
    accent: "#DA222A",
    tagline: "Ashok Leyland Mainline Dealer since 1995.",
    seoPattern: "Ashok Leyland Truck Showroom Ranchi",
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
} as const;

export type VerticalID = keyof typeof BUSINESS_VERTICALS;
export type Vertical = typeof BUSINESS_VERTICALS[VerticalID];
