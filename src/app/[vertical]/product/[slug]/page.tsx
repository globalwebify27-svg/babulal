import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import pool, { initDb } from '@/lib/db';
import { BUSINESS_VERTICALS, VerticalID } from '@/lib/constants';
import ProductGallery from '@/components/ProductGallery';
import InquiryForm from '@/components/InquiryForm';
import TextileHeader from '@/components/TextileHeader';
import ProductActionButtons from '@/components/ProductActionButtons';
import Footer from '@/components/Footer';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  Award,
  ChevronRight,
  Share2,
  Download
} from 'lucide-react';

import SocialShare from '@/components/SocialShare';

interface ProductPageProps {
  params: {
    vertical: string;
    slug: string;
  };
}

function mapProduct(prod: any) {
  if (!prod) return null;
  return {
    ...prod,
    _id: prod.id.toString(),
    images: prod.images ? JSON.parse(prod.images) : [],
    attributes: prod.attributes ? JSON.parse(prod.attributes) : {},
    isFeatured: !!prod.isFeatured,
    isActive: !!prod.isActive,
    seo: {
      h1: prod.h1,
      metaTitle: prod.metaTitle,
      metaDescription: prod.metaDescription,
      altText: prod.altText
    }
  };
}

function mapCategory(cat: any) {
  if (!cat) return null;
  return {
    ...cat,
    _id: cat.id.toString(),
    order: cat.orderIndex,
    showInHeader: !!cat.showInHeader,
    topBusiness: !!cat.topBusiness,
    isCurated: !!cat.isCurated
  };
}

// ══ SEO & METADATA ══
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug, vertical: verticalSlug } = await params;
  await initDb();
  
  const [rows]: any = await pool.query(
    'SELECT * FROM products WHERE slug = ? AND businessVertical = ? LIMIT 1',
    [slug, verticalSlug]
  );

  if (rows.length === 0) return { title: 'Product Not Found' };
  
  const product = mapProduct(rows[0])!;
  const vertical = Object.values(BUSINESS_VERTICALS).find(v => v.slug === verticalSlug);

  return {
    title: `${product.name} | ${vertical?.name || 'Babulal Premsons'}`,
    description: product.seo?.metaDescription || product.description?.substring(0, 160),
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function SingleProductPage({ params }: ProductPageProps) {
  const { slug, vertical: verticalSlug } = await params;

  await initDb();
  
  const [rows]: any = await pool.query(
    'SELECT * FROM products WHERE slug = ? AND businessVertical = ? LIMIT 1',
    [slug, verticalSlug]
  );

  if (rows.length === 0) notFound();

  const product = mapProduct(rows[0])!;
  const vertical = Object.values(BUSINESS_VERTICALS).find(v => v.slug === verticalSlug);

  // Logic for Related Products
  const [relatedRows]: any = await pool.query(
    'SELECT * FROM products WHERE businessVertical = ? AND category = ? AND id != ? LIMIT 4',
    [verticalSlug, product.category, product.id]
  );
  const relatedProducts = relatedRows.map(mapProduct);

  // Fetch Sub-Category Catalog if product doesn't have its own
  let subCategoryCatalog = null;
  if (product.subCategory) {
    const [subRows]: any = await pool.query(
      'SELECT * FROM sub_categories WHERE name = ? LIMIT 1',
      [product.subCategory]
    );
    if (subRows.length > 0) {
      subCategoryCatalog = {
        ...subRows[0],
        _id: subRows[0].id.toString(),
        order: subRows[0].orderIndex
      };
    }
  }

  const finalBrochureUrl = product.brochureUrl || subCategoryCatalog?.brochureUrl;

  // Fetch all categories for the header if we are in textiles
  let navCategories: any[] = [];
  if (verticalSlug === 'textiles') {
    const [catRows]: any = await pool.query(
      "SELECT * FROM categories WHERE LOWER(parentVertical) = 'textiles' ORDER BY orderIndex ASC"
    );
    navCategories = catRows.map(mapCategory);
  }

  // JSON-LD Structured Data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: vertical?.name || 'Babulal Premsons',
    },
    offers: {
      '@type': 'AggregateOffer',
      offerCount: '1',
      lowPrice: '0', // Wholesale usually hidden
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {verticalSlug === 'textiles' && (
        <TextileHeader categories={JSON.parse(JSON.stringify(navCategories.filter((c: any) => c.showInHeader)))} />
      )}

      <main className="pt-28 md:pt-48 lg:pt-64 pb-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">

          {/* ══ BREADCRUMBS ══ */}
          {(() => {
            const categorySlug = product.category?.toLowerCase().replace(/\s+/g, '-');
            return (
              <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#0A5181]/40 mb-12">
                <Link href="/" className="hover:text-accent transition-colors">Group Hub</Link>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/${verticalSlug}`} className="hover:text-accent transition-colors">{vertical?.name}</Link>
                <ChevronRight className="w-3 h-3" />
                <Link
                  href={verticalSlug === 'textiles' ? `/${verticalSlug}/category/${categorySlug}` : `/${verticalSlug}`}
                  className="hover:text-accent transition-colors"
                >
                  {product.category}
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-accent">{product.name}</span>
              </nav>
            );
          })()}

          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

            {/* ══ LEFT: INTERACTIVE GALLERY ══ */}
            <div className="lg:col-span-7">
              <div className="sticky top-40">
                <ProductGallery
                  images={product.images}
                  productName={product.name}
                  videoUrl={product.videoUrl}
                />
              </div>
            </div>

            {/* ══ RIGHT: PRODUCT DETAILS ══ */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 bg-accent/5 text-accent text-[10px] font-bold uppercase tracking-widest rounded-full border border-accent/10">
                    {product.subCategory || product.category}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-1 bg-accent rounded-full" />)}
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0A5181] tracking-tighter italic uppercase leading-[1.1] mb-2">
                  {product.name}
                </h1>

                <p className="text-lg text-primary/60 font-medium leading-relaxed italic">
                  {product.description || `Premium wholesale supply of ${product.name}. Direct from Babulal Premkumar, Ranchi's leading textile distributor since 1978.`}
                </p>

                <ProductActionButtons
                  verticalSlug={verticalSlug}
                  productName={product.name}
                />

                <div className="pt-6 border-t border-primary/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <SocialShare productName={product.name} />
                </div>
              </div>

              {/* Specification Table (Architectural Style) */}
              <div className="bg-white rounded-[2rem] p-6 sm:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-primary/5">
                <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-primary italic">Technical Specifications</h3>
                  <Share2 className="w-4 h-4 text-primary/20 cursor-pointer hover:text-accent transition-colors" />
                </div>

                <table className="w-full text-sm">
                  <tbody>
                    {product.attributes && Object.entries(product.attributes).map(([key, val]) => (
                      <tr key={key} className="border-b border-gray-50 last:border-none">
                        <td className="py-4 text-[9px] font-black uppercase tracking-widest text-[#0A5181]/40">{key}</td>
                        <td className="py-4 text-right font-bold text-[#0A5181] uppercase tracking-tight">{(val as any)}</td>
                      </tr>
                    ))}
                    <tr className="border-b border-gray-50">
                      <td className="py-4 text-[9px] font-black uppercase tracking-widest text-[#0A5181]/40">Origin</td>
                      <td className="py-4 text-right font-bold text-[#0A5181] uppercase tracking-tight">Ranchi, Jharkhand</td>
                    </tr>
                    <tr>
                      <td className="py-4 text-[9px] font-black uppercase tracking-widest text-[#0A5181]/40">Inventory SKU</td>
                      <td className="py-4 text-right font-bold text-[#0A5181] uppercase tracking-tight">BP-{product._id.toString().slice(-6)}</td>
                    </tr>
                  </tbody>
                </table>

                {finalBrochureUrl && (
                  <Link
                    href={finalBrochureUrl}
                    target="_blank"
                    download={`${product.name}-catalog.pdf`}
                    className="mt-8 w-full flex items-center justify-center gap-3 py-4 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-accent hover:text-white transition-all group"
                  >
                    <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Download Digital Brochure
                  </Link>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg text-accent">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter opacity-40">Original Legacy</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg text-accent">
                    <Truck className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter opacity-40">In-Store Only</span>
                </div>
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg text-accent">
                    <Award className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-tighter opacity-40">Certified Quality</span>
                </div>
              </div>
            </div>
          </div>

          {/* ══ INQUIRY SECTION ══ */}
          <section id="inquiry" className="mt-20 md:mt-32 bg-[#0A5181] rounded-[2rem] md:rounded-[3rem] px-5 py-12 md:p-12 lg:p-24 relative overflow-hidden">
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <Image src="/textile_factory.png" fill className="object-cover" alt="Background" />
            </div>

            <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-accent" />
                  <span className="text-accent text-[11px] font-black uppercase tracking-[0.4em]">Wholesale & Retail</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.95]">
                  Direct <span className="text-white/20">Supply</span> Desk.
                </h2>
                <p className="text-white/40 max-w-md font-medium leading-relaxed italic">
                  Get institutional pricing, custom catalogues, and logistics planning for your retail boutique or distribution network.
                </p>

                <div className="flex flex-wrap gap-10 pt-8">
                  <div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Available Reach</div>
                    <div className="text-white font-black italic uppercase">Ranchi H.Q. Only</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Lead Time</div>
                    <div className="text-white font-black italic uppercase">Real-time Stock</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-2 sm:p-4 shadow-3xl">
                <InquiryForm
                  verticalId={verticalSlug?.toUpperCase() as VerticalID}
                  interestDefault={`Order Inquiry: ${product.name}`}
                  className="border-none shadow-none"
                />
              </div>
            </div>
          </section>

          {/* ══ RELATED PRODUCTS ══ */}
          {relatedProducts.length > 0 && (
            <section className="mt-40">
              <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 mb-20">
                <div className="space-y-2">
                  <span className="text-accent text-[11px] font-black uppercase tracking-[0.4em]">Curated Collection</span>
                  <h2 className="text-5xl lg:text-7xl font-black text-[#0A5181] tracking-tighter italic uppercase leading-none">
                    Discover <span className="text-[#0A5181]/20">Similar</span> Pieces.
                  </h2>
                </div>
                <Link
                  href={verticalSlug === 'textiles' ? `/${verticalSlug}/category/${product.category?.toLowerCase().replace(/\s+/g, '-')}` : `/${verticalSlug}`}
                  className="text-[11px] font-black text-accent uppercase tracking-widest hover:translate-x-3 transition-transform inline-flex items-center gap-4 group"
                >
                  Browse Portfolio <div className="w-12 h-[2px] bg-accent group-hover:w-16 transition-all" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                {relatedProducts.map((p: any) => (
                  <Link key={p._id} href={`/${verticalSlug}/product/${p.slug}`} className="group block">
                    <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-white shadow-2xl mb-8 border border-gray-100">
                      <Image
                        src={p.images?.[0] || (p.category === 'Kurti' ? "/kurti_boutique_yellow.png" : "/saree_boutique_red.png")}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A5181]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-accent translate-y-4 group-hover:translate-y-0 transition-transform">
                          <ArrowLeft className="w-5 h-5 rotate-180" />
                        </div>
                      </div>
                    </div>
                    <h4 className="text-[#0A5181] text-lg font-black uppercase tracking-tight italic mb-1 group-hover:text-accent transition-colors">{p.name}</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-[1px] bg-accent/20" />
                      <p className="text-[9px] font-black text-accent/40 uppercase tracking-widest">{p.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
