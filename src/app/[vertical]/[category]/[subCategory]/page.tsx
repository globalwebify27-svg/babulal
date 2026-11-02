import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import pool, { initDb } from '@/lib/db';

interface SubCategoryPageProps {
  params: Promise<{
    vertical: string;
    category: string;
    subCategory: string;
  }>;
}

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 60;

export async function generateMetadata({ params }: SubCategoryPageProps): Promise<Metadata> {
  const { vertical: verticalSlug, category: categorySlug, subCategory: subCategorySlug } = await params;
  const subCategoryName = subCategorySlug.replace(/-/g, ' ');
  const canonicalUrl = `https://www.babulalpremsons.com/${subCategorySlug.toLowerCase()}`;

  let isIndex = false;
  let isFollow = true;
  let metaTitle = `${subCategoryName} Collection | Babulal Premkumar`;
  let metaDescription = `Explore wholesale ${subCategoryName} at Babulal Premkumar. Regional distribution in Ranchi, Jharkhand.`;
  let finalCanonicalUrl = canonicalUrl;

  try {
    await initDb();
    const [subSubRows]: any = await pool.query(
      `SELECT ss.id, ss.slug, ss.name, ss.robotsIndex, ss.robotsFollow 
       FROM sub_sub_categories ss 
       WHERE (LOWER(ss.slug) = ? OR LOWER(ss.name) = ?) AND ss.status = "Active" 
       LIMIT 1`,
      [subCategorySlug.toLowerCase(), subCategorySlug.toLowerCase().replace(/-/g, ' ')]
    );

    if (subSubRows.length > 0) {
      finalCanonicalUrl = `https://www.babulalpremsons.com/${subSubRows[0].slug}`;
      const [seoRows]: any = await pool.query(
        'SELECT robotsIndex, robotsFollow, metaTitle, metaDescription, canonicalUrl FROM category_seo_content WHERE subSubCategoryId = ? AND status = "Published" LIMIT 1',
        [subSubRows[0].id]
      );
      if (seoRows.length > 0) {
        if (seoRows[0].robotsIndex === 'index' || seoRows[0].robotsIndex === true || seoRows[0].robotsIndex === 1) isIndex = true;
        if (seoRows[0].robotsFollow === 'nofollow' || seoRows[0].robotsFollow === false || seoRows[0].robotsFollow === 0) isFollow = false;
        
        if (seoRows[0].metaTitle) metaTitle = seoRows[0].metaTitle;
        if (seoRows[0].metaDescription) metaDescription = seoRows[0].metaDescription;
        if (seoRows[0].canonicalUrl) {
          finalCanonicalUrl = seoRows[0].canonicalUrl;
        }
      }
    }
  } catch (err) {
    console.error('Fetch SEO error:', err);
  }

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: finalCanonicalUrl,
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

  const lowerVertical = verticalSlug.toLowerCase();
  const lowerCategory = categorySlug.toLowerCase();
  const lowerSubCategory = subCategorySlug.toLowerCase();
  const nameSubCategory = lowerSubCategory.replace(/-/g, ' ');

  // 1. Look up exact sub_sub_category under this parent category and subcategory
  const [ssRows]: any = await pool.query(
    `SELECT ss.slug 
     FROM sub_sub_categories ss 
     JOIN sub_categories s ON ss.subCategoryId = s.id 
     JOIN categories c ON s.categoryId = c.id 
     WHERE (LOWER(ss.slug) = ? OR LOWER(ss.name) = ?) 
       AND (LOWER(s.slug) = ? OR LOWER(s.name) = ?) 
       AND (LOWER(c.slug) = ? OR LOWER(c.name) = ?) 
       AND ss.status = 'Active' 
     LIMIT 1`,
    [
      lowerSubCategory,
      nameSubCategory,
      lowerCategory,
      lowerCategory.replace(/-/g, ' '),
      lowerVertical,
      lowerVertical.replace(/-/g, ' ')
    ]
  );

  if (ssRows.length > 0) {
    permanentRedirect(`/${ssRows[0].slug}`);
  }

  // 2. If vertical is "textiles" e.g. /textiles/kids-collection/boys-wear or /textiles/boys-wear/jeans
  if (lowerVertical === 'textiles') {
    // Check if subCategorySlug is an active subcategory
    const [subCheck]: any = await pool.query(
      'SELECT slug FROM sub_categories WHERE LOWER(slug) = ? AND status = "Active" LIMIT 1',
      [lowerSubCategory]
    );
    if (subCheck.length > 0) {
      permanentRedirect(`/${subCheck[0].slug}`);
    }

    // Check if subCategorySlug is an active sub_sub_category
    const [ssCheck]: any = await pool.query(
      'SELECT slug FROM sub_sub_categories WHERE (LOWER(slug) = ? OR LOWER(name) = ?) AND status = "Active" LIMIT 1',
      [lowerSubCategory, nameSubCategory]
    );
    if (ssCheck.length > 0) {
      permanentRedirect(`/${ssCheck[0].slug}`);
    }
  }

  // 3. Fallback: check any active sub_sub_category matching subCategorySlug
  const [anySubSub]: any = await pool.query(
    'SELECT slug FROM sub_sub_categories WHERE (LOWER(slug) = ? OR LOWER(name) = ?) AND status = "Active" LIMIT 1',
    [lowerSubCategory, nameSubCategory]
  );
  if (anySubSub.length > 0) {
    permanentRedirect(`/${anySubSub[0].slug}`);
  }

  // 4. Fallback: check any active subcategory matching subCategorySlug
  const [anySub]: any = await pool.query(
    'SELECT slug FROM sub_categories WHERE LOWER(slug) = ? AND status = "Active" LIMIT 1',
    [lowerSubCategory]
  );
  if (anySub.length > 0) {
    permanentRedirect(`/${anySub[0].slug}`);
  }

  notFound();
}
