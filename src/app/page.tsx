import React from 'react';
import type { Metadata } from 'next';
import pool, { initDb } from "@/lib/db";
import TextileClient from "./textiles/TextileClient";
import { getHomepageSeoData } from "@/lib/homepage-seo";

import { toSafeImageUrl, sanitizeProductImages } from "@/lib/media-helper";

// CRITICAL: Enable Incremental Static Regeneration (ISR)
// This caches the page, making loads nearly instant for subsequent users.
export const revalidate = 60; 

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getHomepageSeoData();

  const title = seo.metaTitle || "Babulal Premkumar | 100+ Years Legacy";
  const description = seo.metaDescription || "Babulal Premkumar - A premium textile destination offering an exclusive collection of Sarees, Lehengas, Suits, and more. Based in Ranchi, Jharkhand with over 100+ Years Legacy.";
  let canonical = seo.canonicalUrl || "https://babulalpremkumar.com";
  if (canonical.includes('babulalpremsons.com')) {
    canonical = canonical.replace('babulalpremsons.com', 'babulalpremkumar.com');
  }
  const isIndex = seo.robotsIndex !== 'noindex';
  const isFollow = seo.robotsFollow !== 'nofollow';

  return {
    metadataBase: new URL(canonical.startsWith('http') ? canonical : 'https://babulalpremkumar.com'),
    title,
    description,
    keywords: seo.metaKeywords || undefined,
    alternates: {
      canonical
    },
    robots: {
      index: isIndex,
      follow: isFollow
    },
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: canonical,
      siteName: "Babulal Premkumar",
      images: seo.ogImage ? [{ url: seo.ogImage }] : undefined,
      type: (seo.ogType as any) || "website"
    },
    twitter: {
      card: (seo.twitterCard as any) || "summary_large_image",
      title: seo.twitterTitle || seo.ogTitle || title,
      description: seo.twitterDescription || seo.ogDescription || description,
      images: seo.twitterImage ? [seo.twitterImage] : undefined
    }
  };
}

/**
 * ═══ DATA RESOLVER (OPTIMIZED) ═══
 * Bypasses client-side rendering to eliminate loading screens.
 */
async function fetchTextileCatalogData() {
  await initDb();

  // Execute all queries in parallel for maximum performance
  const [
    [categoriesRows],
    [subCategoriesRows],
    [subSubCategoriesRows],
    [productsRows],
    [bannersRows],
    [reelsRows]
  ]: any[] = await Promise.all([
    pool.query(
      "SELECT * FROM categories WHERE LOWER(parentVertical) = 'textiles' AND status = 'Active' ORDER BY orderIndex ASC"
    ),
    pool.query(
      "SELECT * FROM sub_categories WHERE status = 'Active' ORDER BY orderIndex ASC"
    ),
    pool.query(
      "SELECT * FROM sub_sub_categories WHERE status = 'Active' ORDER BY orderIndex ASC"
    ),
    pool.query(
      "SELECT * FROM products WHERE LOWER(businessVertical) = 'textiles' ORDER BY createdAt DESC LIMIT 500"
    ),
    pool.query(
      "SELECT * FROM banners WHERE LOWER(vertical) = 'textiles' AND position = 'HOME_HERO' AND isActive = TRUE ORDER BY orderIndex ASC"
    ),
    pool.query(
      "SELECT * FROM reels WHERE status = 'Active' ORDER BY orderIndex ASC, id DESC"
    )
  ]);

  const subSubCategories = subSubCategoriesRows.map((ss: any) => ({
    ...ss,
    _id: ss.id.toString(),
    subCategoryId: ss.subCategoryId.toString(),
    order: ss.orderIndex
  }));

  const subCategories = subCategoriesRows.map((sub: any) => {
    const subIdStr = sub.id.toString();
    return {
      ...sub,
      _id: subIdStr,
      image: toSafeImageUrl('sub_categories', sub.id, sub.image),
      categoryId: sub.categoryId.toString(),
      order: sub.orderIndex,
      subSubCategories: subSubCategories.filter((ss: any) => ss.subCategoryId === subIdStr)
    };
  });

  const categories = categoriesRows.map((cat: any) => {
    const catIdStr = cat.id.toString();
    return {
      ...cat,
      _id: catIdStr,
      image: toSafeImageUrl('categories', cat.id, cat.image),
      cardImage: cat.cardImage ? toSafeImageUrl('categories', cat.id, cat.cardImage, undefined, 'cardImage') : null,
      order: cat.orderIndex,
      showInHeader: !!cat.showInHeader,
      topBusiness: !!cat.topBusiness,
      isCurated: !!cat.isCurated,
      subcategories: subCategories.filter((sub: any) => sub.categoryId === catIdStr)
    };
  });

  const products = productsRows.map((prod: any) => {
    const rawImages = prod.images ? JSON.parse(prod.images) : [];
    return {
      ...prod,
      _id: prod.id.toString(),
      images: sanitizeProductImages(prod.id, rawImages),
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
  });

  const banners = bannersRows.map((ban: any) => ({
    ...ban,
    _id: ban.id.toString(),
    image: toSafeImageUrl('banners', ban.id, ban.image),
    img: toSafeImageUrl('banners', ban.id, ban.img || ban.image),
    order: ban.orderIndex,
    isActive: !!ban.isActive
  }));

  const reels = reelsRows.map((reel: any) => ({
    ...reel,
    _id: reel.id.toString(),
    id: reel.instagramId,
    instagramId: reel.instagramId,
    order: reel.orderIndex
  }));

  return {
    categories,
    products,
    banners,
    reels
  };
}

export default async function HomePage() {
  const [catalogData, seoData] = await Promise.all([
    fetchTextileCatalogData(),
    getHomepageSeoData()
  ]);

  const { categories, products, banners, reels } = catalogData;

  return (
    <TextileClient 
      initialCategories={categories}
      initialProducts={products}
      initialBanners={banners}
      initialReels={reels}
      seoData={seoData}
    />
  );
}
