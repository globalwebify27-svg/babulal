import { MetadataRoute } from 'next';
import pool, { initDb } from '@/lib/db';
import { generateSlug } from '@/lib/slug';

// Revalidate sitemap at most once every hour (3600 seconds)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://babulalpremkumar.com';

  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/honda`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/bajaj`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/trucking`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/muva-industries`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  try {
    await initDb();

    // 1. Fetch Active, Indexable Level-1 Categories
    const [categories]: any = await pool.query(`
      SELECT c.slug, c.updatedAt, c.createdAt, c.robotsIndex, csc.robotsIndex as seoIndex
      FROM categories c
      LEFT JOIN category_seo_content csc ON c.id = csc.categoryId AND csc.subCategoryId IS NULL AND csc.subSubCategoryId IS NULL AND csc.status = 'Published'
      WHERE c.status = 'Active'
    `);
    const categoryEntries: MetadataRoute.Sitemap = categories
      .filter((cat: any) => cat.robotsIndex !== false && cat.robotsIndex !== 0 && cat.seoIndex !== 'noindex')
      .map((cat: any) => ({
        url: `${baseUrl}/${cat.slug}`,
        lastModified: cat.updatedAt ? new Date(cat.updatedAt) : (cat.createdAt ? new Date(cat.createdAt) : new Date()),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));

    // 2. Fetch Active, Indexable Level-2 Sub-categories (respecting parent hierarchy & directives)
    const [subCategories]: any = await pool.query(`
      SELECT sc.slug as subSlug, sc.updatedAt, sc.createdAt, sc.robotsIndex as subIndex, c.robotsIndex as catIndex, csc.robotsIndex as seoIndex
      FROM sub_categories sc 
      JOIN categories c ON sc.categoryId = c.id 
      LEFT JOIN category_seo_content csc ON sc.id = csc.subCategoryId AND csc.subSubCategoryId IS NULL AND csc.status = 'Published'
      WHERE sc.status = 'Active' AND c.status = 'Active'
    `);
    const subCategoryEntries: MetadataRoute.Sitemap = subCategories
      .filter((sub: any) => 
        sub.subIndex !== false && sub.subIndex !== 0 &&
        sub.catIndex !== false && sub.catIndex !== 0 &&
        sub.seoIndex !== 'noindex'
      )
      .map((sub: any) => ({
        url: `${baseUrl}/${sub.subSlug}`,
        lastModified: sub.updatedAt ? new Date(sub.updatedAt) : (sub.createdAt ? new Date(sub.createdAt) : new Date()),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    // 3. Fetch Active, Indexable Level-3 Sub-sub-categories (respecting full parent hierarchy & directives)
    const [subSubCategories]: any = await pool.query(`
      SELECT ssc.slug as subSubSlug, ssc.updatedAt, ssc.createdAt, ssc.robotsIndex as subSubIndex, sc.robotsIndex as subIndex, c.robotsIndex as catIndex, csc.robotsIndex as seoIndex
      FROM sub_sub_categories ssc 
      JOIN sub_categories sc ON ssc.subCategoryId = sc.id 
      JOIN categories c ON sc.categoryId = c.id 
      LEFT JOIN category_seo_content csc ON ssc.id = csc.subSubCategoryId AND csc.status = 'Published'
      WHERE ssc.status = 'Active' AND sc.status = 'Active' AND c.status = 'Active'
    `);
    const subSubCategoryEntries: MetadataRoute.Sitemap = subSubCategories
      .filter((subSub: any) =>
        subSub.subSubIndex !== false && subSub.subSubIndex !== 0 &&
        subSub.subIndex !== false && subSub.subIndex !== 0 &&
        subSub.catIndex !== false && subSub.catIndex !== 0 &&
        subSub.seoIndex !== 'noindex'
      )
      .map((subSub: any) => ({
        url: `${baseUrl}/${subSub.subSubSlug}`,
        lastModified: subSub.updatedAt ? new Date(subSub.updatedAt) : (subSub.createdAt ? new Date(subSub.createdAt) : new Date()),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));

    // 4. Fetch Active, Indexable Products
    const [products]: any = await pool.query(`
      SELECT p.slug, p.category, p.createdAt, p.robotsIndex as prodIndex, c.robotsIndex as catIndex
      FROM products p
      LEFT JOIN categories c ON (LOWER(p.category) = LOWER(c.name) OR LOWER(p.category) = LOWER(c.slug)) AND c.status = 'Active'
      WHERE p.isActive = 1
    `);
    const productEntries: MetadataRoute.Sitemap = products
      .filter((prod: any) => {
        if (prod.prodIndex === false || prod.prodIndex === 0) return false;
        if (prod.prodIndex === null || prod.prodIndex === undefined) {
          if (prod.catIndex === false || prod.catIndex === 0) return false;
        }
        return true;
      })
      .map((prod: any) => {
        const catSlug = prod.category ? generateSlug(prod.category) : 'textiles';
        return {
          url: `${baseUrl}/${catSlug}/product/${prod.slug}`,
          lastModified: prod.createdAt ? new Date(prod.createdAt) : new Date(),
          changeFrequency: 'daily',
          priority: 0.6,
        };
      });

    // 5. Fetch Published, Indexable Blogs
    let blogEntries: MetadataRoute.Sitemap = [];
    try {
      const [blogs]: any = await pool.query(
        'SELECT slug, updatedAt, createdAt, publishedAt, robotsIndex FROM blogs WHERE status = "Published"'
      );
      blogEntries = blogs
        .filter((b: any) => b.robotsIndex !== false && b.robotsIndex !== 0)
        .map((b: any) => ({
          url: `${baseUrl}/blog/${b.slug}`,
          lastModified: b.updatedAt 
            ? new Date(b.updatedAt) 
            : (b.publishedAt ? new Date(b.publishedAt) : (b.createdAt ? new Date(b.createdAt) : new Date())),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
    } catch (e) {
      // Blogs table initialized fallback
    }

    // Combine all entries and guarantee strict URL deduplication
    const allEntries = [
      ...staticEntries,
      ...categoryEntries,
      ...subCategoryEntries,
      ...subSubCategoryEntries,
      ...productEntries,
      ...blogEntries,
    ];

    const urlMap = new Map<string, MetadataRoute.Sitemap[number]>();
    for (const entry of allEntries) {
      const safeUrl = entry.url.replace(/&(?!(amp|lt|gt|quot|apos);)/g, '&amp;');
      if (!urlMap.has(safeUrl)) {
        urlMap.set(safeUrl, { ...entry, url: safeUrl });
      }
    }

    return Array.from(urlMap.values());
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticEntries;
  }
}
