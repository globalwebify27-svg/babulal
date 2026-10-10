import React from 'react';
import CategoryContent from "./CategoryContent";
import pool, { initDb } from "@/lib/db";

export async function fetchCategoryHeaderData(slug: string) {
  await initDb();
  const [rows]: any = await pool.query(
    'SELECT * FROM categories WHERE LOWER(slug) = ? AND status = "Active" LIMIT 1',
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

export async function fetchSubCategoriesData(categoryId: string) {
  await initDb();
  
  const [rows]: any = await pool.query(
    `SELECT s.*, seo.bannerImage as seoBannerImage 
     FROM sub_categories s 
     LEFT JOIN category_seo_content seo ON s.id = seo.subCategoryId 
       AND (seo.status IS NULL OR seo.status = 'Published') 
     WHERE s.categoryId = ? AND s.status = 'Active'
     ORDER BY s.orderIndex ASC`,
    [Number(categoryId)]
  );

  return rows.map((sub: any) => ({
    ...sub,
    _id: sub.id.toString(),
    category: sub.categoryId.toString(),
    order: sub.orderIndex,
    seoBannerImage: sub.seoBannerImage || null
  }));
}

export async function fetchProductsData() {
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

export async function fetchAllCategoriesData() {
  await initDb();
  const [
    [categoriesRows],
    [subCategoriesRows],
    [subSubCategoriesRows]
  ]: any[] = await Promise.all([
    pool.query(
      "SELECT * FROM categories WHERE LOWER(parentVertical) = 'textiles' AND status = 'Active' ORDER BY orderIndex ASC"
    ),
    pool.query(
      `SELECT s.*, seo.bannerImage as seoBannerImage 
       FROM sub_categories s 
       LEFT JOIN category_seo_content seo ON s.id = seo.subCategoryId 
         AND (seo.status IS NULL OR seo.status = 'Published') 
       WHERE s.status = 'Active' 
       ORDER BY s.orderIndex ASC`
    ),
    pool.query(
      "SELECT * FROM sub_sub_categories WHERE status = 'Active' ORDER BY orderIndex ASC"
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
      categoryId: sub.categoryId.toString(),
      order: sub.orderIndex,
      seoBannerImage: sub.seoBannerImage || null,
      subSubCategories: subSubCategories.filter((ss: any) => ss.subCategoryId === subIdStr)
    };
  });

  return categoriesRows.map((cat: any) => {
    const catIdStr = cat.id.toString();
    return {
      ...cat,
      _id: catIdStr,
      order: cat.orderIndex,
      showInHeader: !!cat.showInHeader,
      topBusiness: !!cat.topBusiness,
      isCurated: !!cat.isCurated,
      subcategories: subCategories.filter((sub: any) => sub.categoryId === catIdStr)
    };
  });
}

export async function fetchSubSubCategoriesData() {
  await initDb();
  const [rows]: any = await pool.query(
    "SELECT * FROM sub_sub_categories WHERE status = 'Active' ORDER BY orderIndex ASC"
  );
  return rows.map((subSub: any) => ({
    ...subSub,
    _id: subSub.id.toString(),
    subCategoryId: subSub.subCategoryId.toString(),
    order: subSub.orderIndex
  }));
}

export async function fetchSeoContentData(catId: string, subSlug?: string, subSubSlug?: string) {
  await initDb();
  try {
    let subCatId: number | null = null;
    let subSubCatId: number | null = null;

    if (subSlug && catId) {
      const [subRows]: any = await pool.query(
        'SELECT id FROM sub_categories WHERE categoryId = ? AND LOWER(slug) = ? LIMIT 1',
        [Number(catId), subSlug.toLowerCase()]
      );
      if (subRows.length > 0) {
        subCatId = subRows[0].id;

        if (subSubSlug) {
          const [subSubRows]: any = await pool.query(
            'SELECT id FROM sub_sub_categories WHERE subCategoryId = ? AND LOWER(slug) = ? LIMIT 1',
            [subCatId, subSubSlug.toLowerCase()]
          );
          if (subSubRows.length > 0) {
            subSubCatId = subSubRows[0].id;
          }
        }
      }
    }

    let seoQuery = '';
    let seoParams: any[] = [];

    if (subSubCatId) {
      seoQuery = 'SELECT * FROM category_seo_content WHERE subSubCategoryId = ? AND status = "Published" LIMIT 1';
      seoParams = [subSubCatId];
    } else if (subCatId) {
      seoQuery = 'SELECT * FROM category_seo_content WHERE subCategoryId = ? AND subSubCategoryId IS NULL AND status = "Published" LIMIT 1';
      seoParams = [subCatId];
    } else if (catId && catId !== "0") {
      seoQuery = 'SELECT * FROM category_seo_content WHERE categoryId = ? AND subCategoryId IS NULL AND subSubCategoryId IS NULL AND status = "Published" LIMIT 1';
      seoParams = [Number(catId)];
    }

    if (!seoQuery) return { seoContent: null, seoSections: [], relatedCategories: [] };

    const [seoRows]: any = await pool.query(seoQuery, seoParams);
    if (seoRows.length === 0) {
      return { seoContent: null, seoSections: [], relatedCategories: [] };
    }

    const seoContent = seoRows[0];
    const [secRows]: any = await pool.query(
      'SELECT * FROM category_seo_sections WHERE seoContentId = ? AND isActive = TRUE ORDER BY orderIndex ASC',
      [seoContent.id]
    );

    const seoSections = secRows.map((sec: any) => ({
      ...sec,
      bulletPoints: sec.bulletPoints ? JSON.parse(sec.bulletPoints) : []
    }));

    let relatedCategories: any[] = [];
    const relatedIds = seoContent.relatedCategoryIds ? JSON.parse(seoContent.relatedCategoryIds) : [];
    if (relatedIds.length > 0) {
      const placeholders = relatedIds.map(() => '?').join(',');
      const [relRows]: any = await pool.query(
        `SELECT id, name, slug, image, cardImage FROM categories WHERE id IN (${placeholders}) AND status = 'Active'`,
        relatedIds
      );
      relatedCategories = relRows.map((c: any) => ({ ...c, _id: c.id.toString() }));
    }

    return { seoContent, seoSections, relatedCategories };
  } catch (err) {
    console.error('Fetch SEO Content Data Error:', err);
    return { seoContent: null, seoSections: [], relatedCategories: [] };
  }
}

export async function renderTextileCategoryPage(slug: string, initialSubSlug?: string, initialSubSubSlug?: string) {
  const category = await fetchCategoryHeaderData(slug);
  const subCategoriesPromise = fetchSubCategoriesData(category._id ? category._id.toString() : "0");
  const subSubCategoriesPromise = fetchSubSubCategoriesData();
  const productsPromise = fetchProductsData();
  const navCategoriesPromise = fetchAllCategoriesData();
  const seoDataPromise = fetchSeoContentData(category._id ? category._id.toString() : "0", initialSubSlug, initialSubSubSlug);

  return (
    <CategoryContent 
      initialCategory={category}
      subCategoriesPromise={subCategoriesPromise}
      subSubCategoriesPromise={subSubCategoriesPromise}
      productsPromise={productsPromise}
      navCategoriesPromise={navCategoriesPromise}
      seoDataPromise={seoDataPromise}
      slug={slug}
      initialSubSlug={initialSubSlug}
      initialSubSubSlug={initialSubSubSlug}
    />
  );
}
