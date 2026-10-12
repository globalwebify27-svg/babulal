import React from 'react';
import { Metadata } from 'next';
import pool, { initDb } from '@/lib/db';
import { getPublishedBlogs, getBlogCategories } from '@/lib/blogs';
import TextileHeader from '@/components/TextileHeader';
import Footer from '@/components/Footer';
import MobileBottomMenu from '@/components/MobileBottomMenu';
import BlogListClient from './BlogListClient';
import CoverBreadcrumbs from '@/components/CoverBreadcrumbs';

export const revalidate = 60; // Incremental Static Regeneration

const SITE_URL = 'https://babulalpremsons.com';

export const metadata: Metadata = {
  title: 'Blog & Editorial Journal | Babulal Premsons',
  description: 'Explore the Babulal Premsons Journal: expert insights on Banarasi silk, bridal lehenga trends, handloom textile care, and heritage fashion in Ranchi, Jharkhand.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Blog & Editorial Journal | Babulal Premsons',
    description: 'Explore the Babulal Premsons Journal: expert insights on Banarasi silk, bridal lehenga trends, handloom textile care, and heritage fashion in Ranchi, Jharkhand.',
    url: `${SITE_URL}/blog`,
    siteName: 'Babulal Premkumar',
    images: [
      {
        url: `${SITE_URL}/BabulalPremkumarHer.jpeg`,
        width: 1200,
        height: 630,
        alt: 'Babulal Premsons Editorial Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Editorial Journal | Babulal Premsons',
    description: 'Explore the Babulal Premsons Journal: expert insights on Banarasi silk, bridal lehenga trends, handloom textile care, and heritage fashion.',
    images: [`${SITE_URL}/BabulalPremkumarHer.jpeg`],
  },
};

/**
 * Fetch categories for the TextileHeader navigation
 */
async function fetchHeaderCategories() {
  await initDb();
  const [
    [categoriesRows],
    [subCategoriesRows],
    [subSubCategoriesRows]
  ]: any[] = await Promise.all([
    pool.query(
      "SELECT id, name, slug, image, cardImage, showInHeader, orderIndex FROM categories WHERE LOWER(parentVertical) = 'textiles' AND status = 'Active' ORDER BY orderIndex ASC"
    ),
    pool.query(
      "SELECT id, name, slug, categoryId, orderIndex FROM sub_categories WHERE status = 'Active' ORDER BY orderIndex ASC"
    ),
    pool.query(
      "SELECT id, name, slug, subCategoryId, orderIndex FROM sub_sub_categories WHERE status = 'Active' ORDER BY orderIndex ASC"
    )
  ]);

  const subSubCategories = subSubCategoriesRows.map((ss: any) => ({
    ...ss,
    _id: ss.id.toString(),
    subCategoryId: ss.subCategoryId.toString()
  }));

  const subCategories = subCategoriesRows.map((sub: any) => {
    const subIdStr = sub.id.toString();
    return {
      ...sub,
      _id: subIdStr,
      categoryId: sub.categoryId.toString(),
      subSubCategories: subSubCategories.filter((ss: any) => ss.subCategoryId === subIdStr)
    };
  });

  return categoriesRows.map((cat: any) => {
    const catIdStr = cat.id.toString();
    return {
      ...cat,
      _id: catIdStr,
      showInHeader: !!cat.showInHeader,
      subcategories: subCategories.filter((sub: any) => sub.categoryId === catIdStr)
    };
  });
}

export default async function BlogIndexPage() {
  const [headerCategories, { blogs }, categoriesList] = await Promise.all([
    fetchHeaderCategories(),
    getPublishedBlogs({ limit: 50 }),
    getBlogCategories()
  ]);

  // JSON-LD Structured Data for Blog Collection Page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Babulal Premsons Editorial Journal',
    description: 'Fashion, handloom heritage, bridal couture, and fabric care articles by Babulal Premsons.',
    url: `${SITE_URL}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'Babulal Premsons Group',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/BabulalPremkumar.png`
      }
    },
    blogPost: blogs.map((b) => ({
      '@type': 'BlogPosting',
      headline: b.title,
      description: b.excerpt,
      url: `${SITE_URL}/blog/${b.slug}`,
      datePublished: b.publishedAt || b.createdAt,
      dateModified: b.updatedAt,
      author: {
        '@type': 'Person',
        name: b.author
      }
    }))
  };

  return (
    <div className="bg-white min-h-screen pt-24 lg:pt-[130px] pb-20 md:pb-0">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Website Header with BLOG active link */}
      <TextileHeader categories={headerCategories.filter((c: any) => c.showInHeader)} />

      {/* ═══ EDITORIAL HERO BANNER ═══ */}
      <section className="relative bg-[#0A5181] text-white py-14 lg:py-20 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(218,34,42,0.25),_transparent_50%)] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
          <CoverBreadcrumbs 
            items={[
              { label: 'Home', url: '/' },
              { label: 'Blog' }
            ]} 
            className="mb-6"
          />

          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#DA222A]" />
              <span className="text-[#FFD700] text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">
                The Babulal Premsons Journal
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[1.05] mb-6 drop-shadow-md">
              Heritage, Elegance & <span className="text-[#DA222A]">Couture Stories.</span>
            </h1>

            <p className="text-white/80 text-sm sm:text-base font-medium leading-relaxed italic max-w-2xl">
              Deep dives into centuries of Indian weaving traditions, bridal trends, ethnic styling guides, and textile craftsmanship directly from our curators in Ranchi, Jharkhand.
            </p>
          </div>
        </div>
      </section>

      {/* Main Blog Listing Content */}
      <main>
        <BlogListClient 
          initialBlogs={blogs} 
          categories={categoriesList} 
        />
      </main>

      {/* Footer & Mobile Menu */}
      <Footer />
      <MobileBottomMenu categories={headerCategories} />
    </div>
  );
}
