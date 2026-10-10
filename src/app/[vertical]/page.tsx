import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import pool, { initDb } from '@/lib/db';
import { renderTextileCategoryPage } from '@/app/textiles/category/[slug]/render';
import TextilesPage from '../textiles/page';
import HondaPage from '../honda/page';
import BajajPage from '../bajaj/page';
import TruckingPage from '../trucking/page';
import MuvaPage from '../muva-industries/page';

interface VerticalPageProps {
  params: Promise<{
    vertical: string;
  }>;
}

// Static routes that should not be handled dynamically by [vertical]
const STATIC_BYPASS_ROUTES = new Set([
  'about',
  'contact',
  'admin',
  'auth',
  'welcome',
  'welcome-chas',
  'api',
  'sitemap.xml',
  'robots.txt'
]);

export async function generateMetadata({ params }: VerticalPageProps): Promise<Metadata> {
  const { vertical: slug } = await params;
  const lowerSlug = slug.toLowerCase();

  if (STATIC_BYPASS_ROUTES.has(lowerSlug)) {
    return { title: 'Babulal Premsons Group' };
  }

  await initDb();
  
  // 1. Check if it's a main category
  const [rows]: any = await pool.query(
    "SELECT * FROM categories WHERE LOWER(slug) = ? AND status = 'Active' LIMIT 1",
    [lowerSlug]
  );

  if (rows.length > 0) {
    const cat = rows[0];
    const canonicalUrl = `https://babulalpremsons.com/${cat.slug}`;

    let isIndex = cat.robotsIndex !== undefined && cat.robotsIndex !== null ? !!cat.robotsIndex : false;
    let isFollow = cat.robotsFollow !== undefined && cat.robotsFollow !== null ? !!cat.robotsFollow : true;

    try {
      const [seoRows]: any = await pool.query(
        'SELECT robotsIndex, robotsFollow FROM category_seo_content WHERE categoryId = ? AND subCategoryId IS NULL AND status = "Published" LIMIT 1',
        [cat.id]
      );
      if (seoRows.length > 0) {
        if (seoRows[0].robotsIndex === 'index' || seoRows[0].robotsIndex === true || seoRows[0].robotsIndex === 1) isIndex = true;
        else if (seoRows[0].robotsIndex === 'noindex' || seoRows[0].robotsIndex === false || seoRows[0].robotsIndex === 0) isIndex = false;
        if (seoRows[0].robotsFollow === 'nofollow' || seoRows[0].robotsFollow === false || seoRows[0].robotsFollow === 0) isFollow = false;
      }
    } catch (err) {
      console.error('Fetch category robots error:', err);
    }

    return {
      title: `${cat.name} Collection | Babulal Premkumar`,
      description: `Explore our premium wholesale ${cat.name} collection at Babulal Premkumar (100+ Years Legacy in Ranchi, Jharkhand).`,
      robots: {
        index: isIndex,
        follow: isFollow,
      },
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${cat.name} Collection | Babulal Premkumar`,
        description: `Explore our premium wholesale ${cat.name} collection at Babulal Premkumar.`,
        url: canonicalUrl,
      },
    };
  }

  // 2. Check if it's a subcategory
  const [subRows]: any = await pool.query(
    "SELECT s.* FROM sub_categories s JOIN categories c ON s.categoryId = c.id WHERE LOWER(s.slug) = ? AND s.status = 'Active' AND c.status = 'Active' LIMIT 1",
    [lowerSlug]
  );

  if (subRows.length > 0) {
    const sub = subRows[0];
    const canonicalUrl = `https://babulalpremsons.com/${sub.slug}`;

    let isIndex = sub.robotsIndex !== undefined && sub.robotsIndex !== null ? !!sub.robotsIndex : false;
    let isFollow = sub.robotsFollow !== undefined && sub.robotsFollow !== null ? !!sub.robotsFollow : true;

    try {
      const [seoRows]: any = await pool.query(
        'SELECT robotsIndex, robotsFollow FROM category_seo_content WHERE subCategoryId = ? AND status = "Published" LIMIT 1',
        [sub.id]
      );
      if (seoRows.length > 0) {
        if (seoRows[0].robotsIndex === 'index' || seoRows[0].robotsIndex === true || seoRows[0].robotsIndex === 1) isIndex = true;
        else if (seoRows[0].robotsIndex === 'noindex' || seoRows[0].robotsIndex === false || seoRows[0].robotsIndex === 0) isIndex = false;
        if (seoRows[0].robotsFollow === 'nofollow' || seoRows[0].robotsFollow === false || seoRows[0].robotsFollow === 0) isFollow = false;
      }
    } catch (err) {
      console.error('Fetch subcategory robots error:', err);
    }

    return {
      title: `${sub.name} Collection | Babulal Premkumar`,
      description: `Explore wholesale ${sub.name} at Babulal Premkumar. Regional distribution in Ranchi, Jharkhand.`,
      robots: {
        index: isIndex,
        follow: isFollow,
      },
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${sub.name} Collection | Babulal Premkumar`,
        description: `Explore wholesale ${sub.name} at Babulal Premkumar.`,
        url: canonicalUrl,
      },
    };
  }

  return { title: 'Babulal Premsons Group' };
}

export default async function SingleSegmentRoute({ params }: VerticalPageProps) {
  const { vertical: slug } = await params;
  const lowerSlug = slug.toLowerCase();

  if (STATIC_BYPASS_ROUTES.has(lowerSlug)) {
    notFound();
  }

  // Handle known vertical landing pages
  if (lowerSlug === 'textiles') {
    return <TextilesPage />;
  }
  if (lowerSlug === 'honda') {
    return <HondaPage />;
  }
  if (lowerSlug === 'bajaj') {
    return <BajajPage />;
  }
  if (lowerSlug === 'trucking') {
    return <TruckingPage />;
  }
  if (lowerSlug === 'muva-industries') {
    return <MuvaPage />;
  }

  await initDb();
  
  // 1. Look up Category by slug
  const [rows]: any = await pool.query(
    "SELECT * FROM categories WHERE LOWER(slug) = ? AND status = 'Active' LIMIT 1",
    [lowerSlug]
  );

  if (rows.length > 0) {
    const categoryObj = rows[0];
    return renderTextileCategoryPage(categoryObj.slug);
  }

  // 2. Look up Subcategory by slug
  const [subRows]: any = await pool.query(
    "SELECT s.*, c.slug as parentSlug FROM sub_categories s JOIN categories c ON s.categoryId = c.id WHERE LOWER(s.slug) = ? AND s.status = 'Active' AND c.status = 'Active' LIMIT 1",
    [lowerSlug]
  );

  if (subRows.length > 0) {
    const subCategory = subRows[0];
    return renderTextileCategoryPage(subCategory.parentSlug, subCategory.slug);
  }

  notFound();
}
