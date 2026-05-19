import React from 'react';
import { Metadata } from 'next';
import CategoryContent from "./CategoryContent";
import pool, { initDb } from "@/lib/db";

// CRITICAL: Prevent Next.js from caching the empty SQL response
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * ═══ DATA RESOLVER (STREAMING DB ACCESS) ═══
 */
async function fetchCategoryHeaderData(slug: string) {
  await initDb();
  const [rows]: any = await pool.query(
    'SELECT * FROM categories WHERE LOWER(slug) = ? LIMIT 1',
    [slug.toLowerCase()]
  );
  
  if (rows.length === 0) {
    return { name: slug.toUpperCase(), image: "/bridal_luxury.png" };
  }

  const cat = rows[0];
  return {
    ...cat,
    _id: cat.id.toString(),
    order: cat.orderIndex,
    showInHeader: !!cat.showInHeader,
    topBusiness: !!cat.topBusiness,
    isCurated: !!cat.isCurated
  };
}

async function fetchSubCategoriesData(categoryId: string) {
  await initDb();
  
  const [rows]: any = await pool.query(
    'SELECT * FROM sub_categories WHERE categoryId = ? ORDER BY orderIndex ASC',
    [Number(categoryId)]
  );

  return rows.map((sub: any) => ({
    ...sub,
    _id: sub.id.toString(),
    category: sub.categoryId.toString(),
    order: sub.orderIndex
  }));
}

async function fetchProductsData() {
  await initDb();
  const [rows]: any = await pool.query(
    "SELECT * FROM products WHERE LOWER(businessVertical) = 'textiles' ORDER BY createdAt DESC LIMIT 150"
  );
  
  return rows.map((prod: any) => ({
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
}

async function fetchAllCategoriesData() {
  await initDb();
  const [rows]: any = await pool.query(
    "SELECT * FROM categories WHERE LOWER(parentVertical) = 'textiles' ORDER BY orderIndex ASC"
  );

  return rows.map((cat: any) => ({
    ...cat,
    _id: cat.id.toString(),
    order: cat.orderIndex,
    showInHeader: !!cat.showInHeader,
    topBusiness: !!cat.topBusiness,
    isCurated: !!cat.isCurated
  }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  return { title: `${params?.slug?.toUpperCase() || "Category"} Collection` };
}

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params?.slug;

  if (!slug) return <div className="pt-40 text-center">Invalid Segment</div>;

  // Await the category immediately so the Hero can render
  const category = await fetchCategoryHeaderData(slug);

  // Do NOT await these! Trigger them in parallel to stream the promises down.
  const subCategoriesPromise = fetchSubCategoriesData(category._id ? category._id.toString() : "0");
  const productsPromise = fetchProductsData();
  const navCategoriesPromise = fetchAllCategoriesData();

  return (
    <CategoryContent 
      initialCategory={category}
      subCategoriesPromise={subCategoriesPromise}
      productsPromise={productsPromise}
      navCategoriesPromise={navCategoriesPromise}
      slug={slug}
    />
  );
}
