import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import pool, { initDb } from '@/lib/db';
import { renderTextileCategoryPage } from '@/app/textiles/category/[slug]/render';

interface SubCategoryPageProps {
  params: Promise<{
    vertical: string;
    category: string;
    subCategory: string;
  }>;
}

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const { vertical: verticalSlug, category: categorySlug, subCategory: subCategorySlug } = await params;
  const subCategoryName = subCategorySlug.replace(/-/g, ' ');
  const canonicalUrl = `https://www.babulalpremsons.com/${verticalSlug}/${categorySlug}/${subCategorySlug}`;

  let isIndex = false;
  let isFollow = true;

  try {
    await initDb();
    const [subSubRows]: any = await pool.query(
      'SELECT id FROM sub_sub_categories WHERE LOWER(slug) = ? LIMIT 1',
      [subCategorySlug.toLowerCase()]
    );
    if (subSubRows.length > 0) {
      const [seoRows]: any = await pool.query(
        'SELECT robotsIndex, robotsFollow FROM category_seo_content WHERE subSubCategoryId = ? AND status = "Published" LIMIT 1',
        [subSubRows[0].id]
      );
      if (seoRows.length > 0) {
        if (seoRows[0].robotsIndex === 'index' || seoRows[0].robotsIndex === true || seoRows[0].robotsIndex === 1) isIndex = true;
        if (seoRows[0].robotsFollow === 'nofollow' || seoRows[0].robotsFollow === false || seoRows[0].robotsFollow === 0) isFollow = false;
      }
    }
  } catch (err) {
    console.error('Fetch SEO error:', err);
  }

  return {
    title: `${subCategoryName} Collection | Babulal Premkumar`,
    description: `Explore wholesale ${subCategoryName} at Babulal Premkumar. Regional distribution in Ranchi, Jharkhand.`,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: isIndex,
      follow: isFollow
    }
  };
}

export default async function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { vertical: verticalSlug, category: categorySlug, subCategory: subCategorySlug } = await params;
  await initDb();

  // 1. If vertical is "textiles", e.g. /textiles/kids-collection/boys-wear
  if (verticalSlug.toLowerCase() === 'textiles') {
    return renderTextileCategoryPage(categorySlug, subCategorySlug);
  }

  // 2. Check if verticalSlug is a parent Category slug (e.g. /kids-collection/boys-wear/shorts)
  const [parentCatRows]: any = await pool.query(
    'SELECT * FROM categories WHERE LOWER(slug) = ? LIMIT 1',
    [verticalSlug.toLowerCase()]
  );

  if (parentCatRows.length > 0) {
    return renderTextileCategoryPage(parentCatRows[0].slug, categorySlug, subCategorySlug);
  }

  notFound();
}
