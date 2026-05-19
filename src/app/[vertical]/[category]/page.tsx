import React from 'react';
import pool, { initDb } from '@/lib/db';
import { BUSINESS_VERTICALS, VerticalID } from '@/lib/constants';
import InquiryForm from '@/components/InquiryForm';
import { PlayCircle, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface CategoryPageProps {
  params: {
    vertical: string;
    category: string;
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { vertical: verticalSlug, category: categorySlug } = await params;
  const vertical = Object.values(BUSINESS_VERTICALS).find(v => v.slug === verticalSlug);
  const categoryName = categorySlug.replace(/-/g, ' ');

  // Fetch products for this specific business and category
  // Using SEO-friendly ordering (Featured first)
  let products: any[] = [];
  try {
    await initDb();
    const [rows]: any = await pool.query(
      'SELECT * FROM products WHERE businessVertical = ? AND LOWER(category) = ? AND isActive = TRUE ORDER BY isFeatured DESC, createdAt DESC',
      [verticalSlug, categoryName.toLowerCase()]
    );
    products = rows.map(mapProduct);
  } catch (error) {
    console.error('Database fetch error during build:', error);
  }

  if (!vertical) return <div>Vertical not found</div>;

  return (
    <div className="bg-canvas min-h-screen">

      {/* CATEGORY HERO - SEO Optimized (H1) */}
      <section className="bg-primary pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-accent text-[11px] font-bold uppercase tracking-widest mb-6 opacity-60">
            <Link href="/">Group Hub</Link>
            <ArrowRight className="w-3 h-3" />
            <Link href={`/${verticalSlug}`}>{vertical.name}</Link>
          </div>

          {/* SEO Requirement: H1 = Category + Nature of Business */}
          <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-none capitalize">
            {categoryName} <span className="text-white/20 italic">{vertical.seoPattern}</span>
          </h1>

          <p className="max-w-2xl text-white/50 text-lg font-medium leading-relaxed">
            Direct {vertical.industry} supply from {vertical.name}. We provide high-quality wholesale solutions for {categoryName} with regional distribution reach in Ranchi and across India.
          </p>
        </div>
      </section>

      {/* PRODUCT GRID - SEO Requirement: 30-35 products per page */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-primary text-3xl font-bold tracking-tight italic">Trending Catalog</h2>
          <span className="text-[11px] font-bold text-primary/30 uppercase tracking-widest">{products.length} Designs Unveiled</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {products.map((product) => (
            <div key={product._id} className="group architectural-card p-4 rounded-xl">
              <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-md bg-primary/5">
                {product.images?.[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface-dim" />
                )}

                {product.isFeatured && (
                  <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-lg">
                    Exclusive Design
                  </div>
                )}
              </div>

              {/* PRODUCT DETAILS TABLE (SEO Requirement) */}
              <div className="mb-4">
                <h3 className="text-primary text-xl font-bold tracking-tight mb-4">{product.name}</h3>
                <table className="seo-table text-[12px] opacity-60">
                  <tbody>
                    {product.attributes && Object.entries(product.attributes).slice(0, 3).map(([key, val]: [string, any]) => (
                      <tr key={key} className="border-b border-surface-dim">
                        <td className="py-2 font-bold uppercase tracking-widest text-[9px]">{key}</td>
                        <td className="py-2 text-right">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CTA BUTTONS - B2B Focus */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button className="bg-primary text-white py-3 rounded-md text-[10px] font-bold uppercase tracking-widest hover:opacity-90 transition-all">
                  Get Quote
                </button>
                <Link 
                  href={`/${verticalSlug}/product/${product.slug}`}
                  className="flex items-center justify-center gap-2 text-primary/40 text-[10px] font-bold uppercase tracking-widest hover:text-accent transition-all"
                >
                  <FileText className="w-3 h-3" /> Details
                </Link>
              </div>
            </div>
          ))}

          {/* PLACEHOLDER PRODUCTS IF DATABASE IS EMPTY (For Presentation) */}
          {products.length === 0 && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="architectural-card p-6 rounded-xl animate-pulse bg-white/50 h-[450px]">
              <div className="bg-surface-dim h-60 rounded-md mb-6" />
              <div className="h-6 bg-surface-dim w-3/4 mb-4" />
              <div className="h-4 bg-surface-dim w-1/2 mb-2" />
              <div className="h-4 bg-surface-dim w-1/3" />
            </div>
          ))}
        </div>
      </section>

      {/* LEAD CAPTURE - CONTINUOUS CONVERSION */}
      <section className="py-24 bg-surface-dim px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="max-w-xl">
            <h4 className="text-accent text-[11px] font-bold uppercase tracking-[.4em] mb-6">Bulk Supply Inquiry</h4>
            <h2 className="text-primary text-5xl font-bold tracking-tight leading-[0.95] mb-8">
              Direct <span className="italic italic-accent font-extrabold uppercase">{categoryName}</span> Wholesale Supply.
            </h2>
            <p className="text-primary/60 font-medium leading-relaxed">We cater to retail shop owners, boutique hubs, and distribution agents. Get our latest print catalogs, bridal lookbooks, and high-quality {categoryName} inventory price lists today.</p>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-6">
                <div className="bg-white p-4 rounded-full shadow-sm text-primary">
                  <PlayCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary italic">Factory Tour Video</div>
                  <div className="text-[11px] font-bold text-primary/30 uppercase tracking-widest">Process & Quality Control</div>
                </div>
              </div>
            </div>
          </div>

          <InquiryForm
            verticalId={verticalSlug.toUpperCase() as VerticalID}
            interestDefault={`Bulk Order for ${categoryName}`}
            className="lg:translate-y-[-50px]"
          />
        </div>
      </section>

    </div>
  );
}
