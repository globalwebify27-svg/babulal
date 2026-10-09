import { MetadataRoute } from 'next';
import pool, { initDb } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://babulalpremsons.com';

  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/honda`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/bajaj`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/trucking`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/muva-industries`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    await initDb();

    // 1. Fetch Categories
    const [categories]: any = await pool.query('SELECT slug, updatedAt FROM categories WHERE status = "Active"');
    const categoryEntries: MetadataRoute.Sitemap = categories.map((cat: any) => ({
      url: `${baseUrl}/${cat.slug}`,
      lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 2. Fetch Sub-categories
    const [subCategories]: any = await pool.query(`
      SELECT sc.slug as subSlug, c.slug as catSlug, sc.updatedAt 
      FROM sub_categories sc 
      JOIN categories c ON sc.categoryId = c.id 
      WHERE sc.status = 'Active'
    `);
    const subCategoryEntries: MetadataRoute.Sitemap = subCategories.map((sub: any) => ({
      url: `${baseUrl}/${sub.subSlug}`,
      lastModified: sub.updatedAt ? new Date(sub.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    // 3. Fetch Products
    const [products]: any = await pool.query('SELECT slug, category, createdAt FROM products WHERE isActive = TRUE');
    const productEntries: MetadataRoute.Sitemap = products.map((prod: any) => {
      const catSlug = prod.category ? prod.category.toLowerCase().replace(/\s+/g, '-') : 'textiles';
      return {
        url: `${baseUrl}/${catSlug}/product/${prod.slug}`,
        lastModified: prod.createdAt ? new Date(prod.createdAt) : new Date(),
        changeFrequency: 'daily',
        priority: 0.6,
      };
    });

    return [...staticEntries, ...categoryEntries, ...subCategoryEntries, ...productEntries];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticEntries;
  }
}
