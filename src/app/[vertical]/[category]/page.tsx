import React from 'react';
import pool, { initDb } from '@/lib/db';
import { BUSINESS_VERTICALS, VerticalID } from '@/lib/constants';
import InquiryForm from '@/components/InquiryForm';
import { PlayCircle, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import InteractiveCatalog from '@/components/InteractiveCatalog';
import TextileHeader from '@/components/TextileHeader';
import AutomotiveHeader from '@/components/AutomotiveHeader';
import Image from 'next/image';
import Footer from '@/components/Footer';
import MobileBottomMenu from '@/components/MobileBottomMenu';

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
  const categoryName = categorySlug.toLowerCase() === 'all' ? 'All Products' : categorySlug.replace(/-/g, ' ');

  // Fetch products, categories, and subcategories for the vertical
  let products: any[] = [];
  let categories: any[] = [];
  let subCategories: any[] = [];

  try {
    await initDb();
    
    // Fetch categories and subcategories for filters
    const [catRows]: any = await pool.query(
      'SELECT * FROM categories WHERE LOWER(parentVertical) = ? ORDER BY orderIndex ASC',
      [verticalSlug.toLowerCase()]
    );

    const [subRows]: any = await pool.query(
      'SELECT * FROM sub_categories WHERE status = "Active" ORDER BY orderIndex ASC'
    );

    // Map subcategories
    const allSubs = subRows.map((sub: any) => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      categoryId: sub.categoryId
    }));

    // Map categories with their subcategories attached
    categories = catRows.map((cat: any) => {
      const catIdStr = cat.id.toString();
      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        image: cat.image,
        showInHeader: !!cat.showInHeader,
        topBusiness: !!cat.topBusiness,
        isCurated: !!cat.isCurated,
        subcategories: allSubs.filter((sub: any) => sub.categoryId.toString() === catIdStr)
      };
    });

    subCategories = allSubs;

    let productsQuery = 'SELECT * FROM products WHERE businessVertical = ? AND isActive = TRUE ORDER BY isFeatured DESC, createdAt DESC';
    let productsParams = [verticalSlug];
    
    if (categorySlug.toLowerCase() !== 'all') {
      productsQuery = 'SELECT * FROM products WHERE businessVertical = ? AND LOWER(category) = ? AND isActive = TRUE ORDER BY isFeatured DESC, createdAt DESC';
      productsParams = [verticalSlug, categoryName.toLowerCase()];
    }

    const [rows]: any = await pool.query(productsQuery, productsParams);
    products = rows.map(mapProduct);
  } catch (error) {
    console.error('Database fetch error during build:', error);
  }

  if (!vertical) return <div>Vertical not found</div>;

  const descriptionText = categorySlug.toLowerCase() === 'all'
    ? `Explore our entire ${vertical.industry} inventory from ${vertical.name}. Filter by categories, fabric types, and patterns to find exactly what you need.`
    : `Direct ${vertical.industry} supply from ${vertical.name}. We provide high-quality wholesale solutions for ${categoryName} with regional distribution reach in Ranchi and across India.`;

  // Dynamically select hero background image
  const heroBgImage = categorySlug.toLowerCase() === 'all'
    ? (vertical.image || '/textile_factory.png')
    : (categories.find(c => c.slug.toLowerCase() === categorySlug.toLowerCase())?.image || vertical.image || '/bridal_luxury.png');

  return (
    <div className="bg-canvas min-h-screen pb-20 md:pb-0">
      {verticalSlug === 'textiles' && (
        <TextileHeader categories={categories.filter((c: any) => c.showInHeader)} />
      )}
      {(verticalSlug === 'honda' || verticalSlug === 'bajaj' || verticalSlug === 'trucking') && (
        <AutomotiveHeader />
      )}

      {/* CATEGORY HERO - SEO Optimized (H1) */}
      <section className="relative bg-[#0A5181] overflow-hidden pt-48 pb-24 px-6 md:px-12">
        {/* Background Image with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src={heroBgImage}
            alt={`${categoryName} background`}
            fill
            sizes="100vw"
            className="object-cover opacity-25 object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A5181] via-[#0A5181]/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto z-10">
          <div className="flex items-center gap-3 text-accent text-[11px] font-bold uppercase tracking-[0.2em] mb-6 opacity-80">
            <Link href="/" className="hover:text-white transition-colors">Group Hub</Link>
            <ArrowRight className="w-3.5 h-3.5" />
            <Link href={`/${verticalSlug}`} className="hover:text-white transition-colors">{vertical.name}</Link>
          </div>

          {/* SEO Requirement: H1 = Category + Nature of Business */}
          <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-none capitalize italic">
            {categoryName} <span className="text-white/20 not-italic font-medium">{vertical.seoPattern}</span>
          </h1>

          <p className="max-w-2xl text-white/70 text-lg font-medium leading-relaxed italic">
            {descriptionText}
          </p>
        </div>
      </section>

      {/* PRODUCT GRID WITH FILTER SYSTEM */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <InteractiveCatalog
          products={products}
          categories={categories}
          subCategories={subCategories}
          verticalSlug={verticalSlug}
          initialCategorySlug={categorySlug}
        />
      </section>

      {/* LEAD CAPTURE - CONTINUOUS CONVERSION */}
      <section className="py-24 bg-surface-dim px-6" id="inquiry-form-section">
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

      {verticalSlug === 'textiles' && (
        <Footer />
      )}
      {verticalSlug === 'textiles' && (
        <MobileBottomMenu categories={categories} />
      )}
    </div>
  );
}
