import React from 'react';
import pool, { initDb } from "@/lib/db";
import TextileClient from "./TextileClient";

// CRITICAL: Enable Incremental Static Regeneration (ISR)
// This caches the page, making loads nearly instant for subsequent users.
export const revalidate = 60; 

/**
 * ═══ DATA RESOLVER (OPTIMIZED) ═══
 * Bypasses client-side rendering to eliminate loading screens.
 */
async function fetchTextileCatalogData() {
  await initDb();

  // Execute all queries in parallel for maximum performance
  const [
    [categoriesRows],
    [productsRows],
    [bannersRows]
  ]: any[] = await Promise.all([
    pool.query(
      "SELECT * FROM categories WHERE LOWER(parentVertical) = 'textiles' ORDER BY orderIndex ASC"
    ),
    pool.query(
      "SELECT * FROM products WHERE LOWER(businessVertical) = 'textiles' ORDER BY createdAt DESC LIMIT 500"
    ),
    pool.query(
      "SELECT * FROM banners WHERE LOWER(vertical) = 'textiles' AND position = 'HOME_HERO' AND isActive = TRUE ORDER BY orderIndex ASC"
    )
  ]);

  const categories = categoriesRows.map((cat: any) => ({
    ...cat,
    _id: cat.id.toString(),
    order: cat.orderIndex,
    showInHeader: !!cat.showInHeader,
    topBusiness: !!cat.topBusiness,
    isCurated: !!cat.isCurated
  }));

  const products = productsRows.map((prod: any) => ({
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
  }));

  const banners = bannersRows.map((ban: any) => ({
    ...ban,
    _id: ban.id.toString(),
    order: ban.orderIndex,
    isActive: !!ban.isActive
  }));

  return {
    categories,
    products,
    banners
  };
}

export default async function TextileVerticalPage() {
  const { categories, products, banners } = await fetchTextileCatalogData();

  return (
    <TextileClient 
      initialCategories={categories}
      initialProducts={products}
      initialBanners={banners}
    />
  );
}
