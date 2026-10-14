export interface InternalLink {
  label: string;
  url: string;
}

export interface HomepageSeoSection {
  id?: number | string;
  heading: string;
  headingLevel: 'H2' | 'H3' | 'H4';
  content: string;
  bulletPoints: string[];
  internalLinks: InternalLink[];
  image?: string;
  imageAlt?: string;
  videoUrl?: string;
  orderIndex: number;
  isActive: boolean;
}

export interface VisualValuePillar {
  title: string;
  sub: string;
}

export interface VisualAwardCard {
  year: string;
  title: string;
  region: string;
}

export interface VisualMetricBadge {
  pre: string;
  stat: string;
  post: string;
}

export interface VisualLegacySection {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  awards: VisualAwardCard[];
  primaryNarrative: string;
  secondaryNarrative: string;
}

export interface VisualCuratedSection {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
}

export interface VisualSectionsData {
  valuePillars: VisualValuePillar[];
  legacy: VisualLegacySection;
  metrics: VisualMetricBadge[];
  curated: VisualCuratedSection;
}

export interface HomepageSeoData {
  id?: number;
  pageIdentifier: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;
  robotsIndex: 'index' | 'noindex';
  robotsFollow: 'follow' | 'nofollow';
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  h1: string;
  h1Subtext: string;
  introParagraph: string;
  status: string;
  sections: HomepageSeoSection[];
  visualSections?: VisualSectionsData;
}

export const DEFAULT_VISUAL_SECTIONS: VisualSectionsData = {
  valuePillars: [
    { title: "Latest Collection", sub: "Fresh Seasonal Inventory" },
    { title: "Lowest Rate 365 Days", sub: "No Sales, Just Honesty" },
    { title: "No Bundling", sub: "Buy Precisely What You Need" },
    { title: "Lowest Price 365 Days", sub: "Direct Retail Pricing" }
  ],
  legacy: {
    eyebrow: "Over 100 Years & 5 Generations of Goodwill & Trust",
    titlePrefix: "The Legacy Of",
    titleHighlight: "Babulal Premkumar.",
    awards: [
      { year: "2011 Award", title: "Best Wholesaler of Eastern India", region: "National & Regional Performance Award" },
      { year: "100+ Years", title: "5 Generations of Goodwill", region: "High-Level Customer Satisfaction & Trust" },
      { year: "Multi-Branded", title: "Fabrics & Garments Hub", region: "Women's, Men's & Home Furnishing" }
    ],
    primaryNarrative: "Babulal Premkumar is a Textile and Garments Distributor in Ranchi, Jharkhand. We are one of the oldest and most reputed firms in the region of Jharkhand. We have been serving customers for over 100 years and have built great relationships with them that date back to five generations—a true proof of our goodwill, high-level customer satisfaction, and trust.",
    secondaryNarrative: "We deal with multi-branded fabrics for women, men, and home furnishing. From luxurious sarees that exude elegance to durable denim that defines durability, our textile distribution services cater to a diverse array of demands."
  },
  metrics: [
    {
      pre: "Legacy Of",
      stat: "100+ YEARS",
      post: "Five Generations of Trust"
    },
    {
      pre: "Supply Hub For",
      stat: "2000+",
      post: "B2B Partners Across 6 States"
    },
    {
      pre: "Operational Legacy",
      stat: "100+ YEARS",
      post: "Century of Immutable Trust"
    },
    {
      pre: "Inventory Scale",
      stat: "10K+ SKUS",
      post: "Massive Warehousing Hub"
    }
  ],
  curated: {
    eyebrow: "Seasonal Anthology",
    titlePrefix: "Curated",
    titleHighlight: "Collections.",
    subtitle: "A cinematic showcase of Ranchi's finest textile engineering. Retail excellence for global partners."
  }
};

export const DEFAULT_HOMEPAGE_SEO: HomepageSeoData = {
  pageIdentifier: 'home',
  metaTitle: 'Babulal Premkumar | 100+ Years Legacy - Premium Textiles in Ranchi',
  metaDescription: 'Babulal Premkumar - A premium textile destination offering an exclusive collection of Sarees, Lehengas, Suits, and more. Based in Ranchi, Jharkhand with over 100+ Years Legacy.',
  metaKeywords: 'Babulal Premkumar, Ranchi, Textiles, Sarees, Lehengas, Suits, Kurtis, Mens Wear, Womens Western Wear, Kids Collection',
  canonicalUrl: 'https://babulalpremsons.com',
  robotsIndex: 'index',
  robotsFollow: 'follow',
  ogTitle: 'Babulal Premkumar | 100+ Years Legacy',
  ogDescription: 'Babulal Premkumar - A premium textile destination offering an exclusive collection of Sarees, Lehengas, Suits, and more. Based in Ranchi, Jharkhand with over 100+ Years Legacy.',
  ogImage: '/BabulalPremkumarHer.jpeg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Babulal Premkumar | 100+ Years Legacy',
  twitterDescription: 'Babulal Premkumar - A premium textile destination offering an exclusive collection of Sarees, Lehengas, Suits, and more.',
  twitterImage: '/BabulalPremkumarHer.jpeg',
  h1: 'Wholesale & Retail Textile Destination in Ranchi, Jharkhand',
  h1Subtext: 'Serving Eastern India across 5 generations with over a century of trust and unbundled procuring transparency.',
  introParagraph: 'Welcome to Babulal Premkumar, Ranchi’s historic textile institution. From authentic handloom Banarasi silks to contemporary bridal couture, menswear, and everyday fabrics, explore thousands of unbundled designs at lowest prices 365 days a year.',
  status: 'Published',
  sections: [
    {
      id: 'default-sec-1',
      heading: 'Eastern India’s Premier Wholesale Handloom & Bridal Fabric Hub',
      headingLevel: 'H2',
      content: 'Founded over 100 years ago, Babulal Premkumar has stood at the core of Jharkhand’s textile landscape. We directly bridge the gap between master artisan weavers across India—from Varanasi to Kanchipuram—and discerning retail and wholesale buyers.',
      bulletPoints: [
        'Direct weaver sourcing with transparent wholesale pricing 365 days a year',
        '100% unbundled purchasing—no forced bundling or minimum lot requirements',
        'Dedicated customer showroom in Ranchi with over 10,000+ live collections'
      ],
      internalLinks: [
        { label: 'Explore Sarees', url: '/saree' },
        { label: 'View Bridal Lehengas', url: '/lehenga' },
        { label: 'Contact Showroom', url: '/contact' }
      ],
      image: '/bridal_luxury.png',
      imageAlt: 'Luxury Bridal Lehengas and Heritage Sarees at Babulal Premkumar Ranchi',
      orderIndex: 0,
      isActive: true
    },
    {
      id: 'default-sec-2',
      heading: 'Diverse Fabric Collections for Every Celebration and Enterprise',
      headingLevel: 'H3',
      content: 'Our multi-floor enterprise showcases distinct verticals spanning sarees, designer lehengas, bespoke sherwanis, formal suiting, kidswear, and institutional bulk textiles.',
      bulletPoints: [
        'Pure Katan Silk, Organza, Tussar, and Georgette drapes',
        'Contemporary bridal wear with antique dabka and zardozi detailing',
        'Comprehensive garment logistics and national shipping capabilities'
      ],
      internalLinks: [
        { label: 'Suit & Dress Material', url: '/suit' },
        { label: 'Read Fashion Journal', url: '/blog' }
      ],
      image: '/silk_saree_royal.png',
      imageAlt: 'Banarasi and Pure Silk Sarees at Babulal Premkumar',
      orderIndex: 1,
      isActive: true
    }
  ],
  visualSections: DEFAULT_VISUAL_SECTIONS
};

export function parseJsonSafe<T>(str: unknown, fallback: T): T {
  if (!str) return fallback;
  if (typeof str !== 'string') return str as T;
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
