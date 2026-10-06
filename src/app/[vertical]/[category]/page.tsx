import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import pool, { initDb } from '@/lib/db';
import { BUSINESS_VERTICALS, VerticalID, isInventoryCatalogEnabled } from '@/lib/constants';
import InquiryForm from '@/components/InquiryForm';
import { PlayCircle, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import InteractiveCatalog from '@/components/InteractiveCatalog';
import TextileHeader from '@/components/TextileHeader';
import AutomotiveHeader from '@/components/AutomotiveHeader';
import Image from 'next/image';
import Footer from '@/components/Footer';
import MobileBottomMenu from '@/components/MobileBottomMenu';
import CoverBreadcrumbs from '@/components/CoverBreadcrumbs';
import { renderTextileCategoryPage } from '@/app/textiles/category/[slug]/render';

interface CategoryPageProps {
  params: Promise<{
    vertical: string;
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { vertical: verticalSlug, category: categorySlug } = await params;
  const categoryName = categorySlug.toLowerCase() === 'all' ? 'All Products' : categorySlug.replace(/-/g, ' ');
  const isSubCategory = verticalSlug.toLowerCase() !== 'textiles' && verticalSlug.toLowerCase() !== 'honda' && verticalSlug.toLowerCase() !== 'bajaj' && verticalSlug.toLowerCase() !== 'trucking';
  
  const canonicalUrl = isSubCategory 
    ? `https://www.babulalpremsons.com/${verticalSlug}/${categorySlug}`
    : `https://www.babulalpremsons.com/${categorySlug}`;

  let isIndex = false;
  let isFollow = true;

  try {
    await initDb();
    const [catRows]: any = await pool.query(
      'SELECT id, robotsIndex, robotsFollow FROM categories WHERE LOWER(slug) = ? LIMIT 1',
      [categorySlug.toLowerCase()]
    );
    if (catRows.length > 0) {
      isIndex = catRows[0].robotsIndex !== undefined && catRows[0].robotsIndex !== null ? !!catRows[0].robotsIndex : false;
      isFollow = catRows[0].robotsFollow !== undefined && catRows[0].robotsFollow !== null ? !!catRows[0].robotsFollow : true;

      const [seoRows]: any = await pool.query(
        'SELECT robotsIndex, robotsFollow FROM category_seo_content WHERE categoryId = ? AND subCategoryId IS NULL AND status = "Published" LIMIT 1',
        [catRows[0].id]
      );
      if (seoRows.length > 0) {
        if (seoRows[0].robotsIndex === 'index' || seoRows[0].robotsIndex === true || seoRows[0].robotsIndex === 1) isIndex = true;
        else if (seoRows[0].robotsIndex === 'noindex' || seoRows[0].robotsIndex === false || seoRows[0].robotsIndex === 0) isIndex = false;
        if (seoRows[0].robotsFollow === 'nofollow' || seoRows[0].robotsFollow === false || seoRows[0].robotsFollow === 0) isFollow = false;
      }
    } else {
      const [subRows]: any = await pool.query(
        'SELECT id, robotsIndex, robotsFollow FROM sub_categories WHERE LOWER(slug) = ? LIMIT 1',
        [categorySlug.toLowerCase()]
      );
      if (subRows.length > 0) {
        isIndex = subRows[0].robotsIndex !== undefined && subRows[0].robotsIndex !== null ? !!subRows[0].robotsIndex : false;
        isFollow = subRows[0].robotsFollow !== undefined && subRows[0].robotsFollow !== null ? !!subRows[0].robotsFollow : true;

        const [seoRows]: any = await pool.query(
          'SELECT robotsIndex, robotsFollow FROM category_seo_content WHERE subCategoryId = ? AND status = "Published" LIMIT 1',
          [subRows[0].id]
        );
        if (seoRows.length > 0) {
          if (seoRows[0].robotsIndex === 'index' || seoRows[0].robotsIndex === true || seoRows[0].robotsIndex === 1) isIndex = true;
          else if (seoRows[0].robotsIndex === 'noindex' || seoRows[0].robotsIndex === false || seoRows[0].robotsIndex === 0) isIndex = false;
          if (seoRows[0].robotsFollow === 'nofollow' || seoRows[0].robotsFollow === false || seoRows[0].robotsFollow === 0) isFollow = false;
        }
      }
    }
  } catch (err) {
    console.error('Fetch category robots error:', err);
  }

  return {
    title: `${categoryName} Collection | Babulal Premkumar`,
    description: `Explore wholesale ${categoryName} at Babulal Premkumar. Regional distribution in Ranchi, Jharkhand.`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: isIndex,
      follow: isFollow
    },
    openGraph: {
      title: `${categoryName} Collection | Babulal Premkumar`,
      description: `Explore wholesale ${categoryName} at Babulal Premkumar.`,
      url: canonicalUrl,
    },
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
  await initDb();

  // 1. If vertical is "textiles", render Textile Category Page for categorySlug
  if (verticalSlug.toLowerCase() === 'textiles') {
    return renderTextileCategoryPage(categorySlug);
  }

  // 2. Check if verticalSlug is a parent Category slug (e.g. /saree/fancy-sarees)
  const [parentCatRows]: any = await pool.query(
    'SELECT * FROM categories WHERE LOWER(slug) = ? LIMIT 1',
    [verticalSlug.toLowerCase()]
  );

  if (parentCatRows.length > 0) {
    // verticalSlug is parent category (e.g. 'saree'), categorySlug is subcategory (e.g. 'fancy-sarees')
    return renderTextileCategoryPage(parentCatRows[0].slug, categorySlug);
  }

  const vertical = Object.values(BUSINESS_VERTICALS).find(v => v.slug === verticalSlug);
  if (!vertical) {
    notFound();
  }

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
          <CoverBreadcrumbs 
            items={[
              { label: 'Home', url: '/' },
              { label: vertical.name, url: `/${verticalSlug}` },
              { label: categoryName, url: `/${verticalSlug}/${categorySlug}` }
            ]}
          />

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
      {isInventoryCatalogEnabled(categorySlug) && (
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <InteractiveCatalog
            products={products}
            categories={categories}
            subCategories={subCategories}
            verticalSlug={verticalSlug}
            initialCategorySlug={categorySlug}
          />
        </section>
      )}

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
