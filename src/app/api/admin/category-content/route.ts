import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const subCategoryId = searchParams.get('subCategoryId');
    const subSubCategoryId = searchParams.get('subSubCategoryId');
    const id = searchParams.get('id');

    let targetCatId = categoryId ? Number(categoryId) : null;
    let targetSubCatId = subCategoryId ? Number(subCategoryId) : null;
    let targetSubSubCatId = subSubCategoryId ? Number(subSubCategoryId) : null;

    // Fetch all main categories for related categories selection
    const [allCategories]: any = await pool.query(
      "SELECT id, name, slug, image, cardImage FROM categories WHERE status = 'Active' ORDER BY orderIndex ASC"
    );

    let targetInfo: any = null;

    if (targetSubSubCatId) {
      const [subSubRows]: any = await pool.query(
        `SELECT ss.*, s.slug as subCategorySlug, s.name as subCategoryName, c.slug as parentCategorySlug, c.name as parentCategoryName 
         FROM sub_sub_categories ss 
         JOIN sub_categories s ON ss.subCategoryId = s.id 
         JOIN categories c ON s.categoryId = c.id 
         WHERE ss.id = ? LIMIT 1`,
        [targetSubSubCatId]
      );
      if (subSubRows.length > 0) {
        targetInfo = {
          type: 'subSubCategory',
          id: subSubRows[0].id,
          name: subSubRows[0].name,
          slug: subSubRows[0].slug,
          parentCategorySlug: subSubRows[0].parentCategorySlug,
          subCategorySlug: subSubRows[0].subCategorySlug,
          targetUrl: `/${subSubRows[0].parentCategorySlug}/${subSubRows[0].subCategorySlug}?subsub=${subSubRows[0].slug}`
        };
      }
    } else if (targetSubCatId) {
      const [subRows]: any = await pool.query(
        'SELECT s.*, c.slug as parentCategorySlug, c.name as parentCategoryName FROM sub_categories s JOIN categories c ON s.categoryId = c.id WHERE s.id = ? LIMIT 1',
        [targetSubCatId]
      );
      if (subRows.length > 0) {
        targetInfo = {
          type: 'subCategory',
          id: subRows[0].id,
          name: subRows[0].name,
          slug: subRows[0].slug,
          parentCategorySlug: subRows[0].parentCategorySlug,
          parentCategoryName: subRows[0].parentCategoryName,
          targetUrl: `/${subRows[0].parentCategorySlug}/${subRows[0].slug}`
        };
      }
    } else if (targetCatId) {
      const [catRows]: any = await pool.query(
        'SELECT * FROM categories WHERE id = ? LIMIT 1',
        [targetCatId]
      );
      if (catRows.length > 0) {
        targetInfo = {
          type: 'category',
          id: catRows[0].id,
          name: catRows[0].name,
          slug: catRows[0].slug,
          targetUrl: `/${catRows[0].slug}`
        };
      }
    } else if (id) {
      const [seoRows]: any = await pool.query(
        'SELECT * FROM category_seo_content WHERE id = ? LIMIT 1',
        [Number(id)]
      );
      if (seoRows.length > 0) {
        if (seoRows[0].subSubCategoryId) {
          targetSubSubCatId = seoRows[0].subSubCategoryId;
        } else if (seoRows[0].subCategoryId) {
          targetSubCatId = seoRows[0].subCategoryId;
        } else if (seoRows[0].categoryId) {
          targetCatId = seoRows[0].categoryId;
        }
      }
    }

    if (!targetCatId && !targetSubCatId && !targetSubSubCatId) {
      return NextResponse.json({ error: 'Missing categoryId, subCategoryId, or subSubCategoryId' }, { status: 400 });
    }

    let query = '';
    let params: any[] = [];
    if (targetSubSubCatId) {
      query = 'SELECT * FROM category_seo_content WHERE subSubCategoryId = ? LIMIT 1';
      params = [targetSubSubCatId];
    } else if (targetSubCatId) {
      query = 'SELECT * FROM category_seo_content WHERE subCategoryId = ? AND subSubCategoryId IS NULL LIMIT 1';
      params = [targetSubCatId];
    } else {
      query = 'SELECT * FROM category_seo_content WHERE categoryId = ? AND subCategoryId IS NULL AND subSubCategoryId IS NULL LIMIT 1';
      params = [targetCatId];
    }

    const [seoRows]: any = await pool.query(query, params);
    let seoContent: any = null;
    let sections: any[] = [];

    if (seoRows.length > 0) {
      seoContent = seoRows[0];
      seoContent.relatedCategoryIds = seoContent.relatedCategoryIds ? JSON.parse(seoContent.relatedCategoryIds) : [];
      
      const [secRows]: any = await pool.query(
        'SELECT * FROM category_seo_sections WHERE seoContentId = ? ORDER BY orderIndex ASC',
        [seoContent.id]
      );
      sections = secRows.map((sec: any) => ({
        ...sec,
        bulletPoints: sec.bulletPoints ? JSON.parse(sec.bulletPoints) : [],
        isActive: !!sec.isActive
      }));
    }

    return NextResponse.json({
      targetInfo,
      seoContent,
      sections,
      allCategories: allCategories.map((cat: any) => ({
        ...cat,
        _id: cat.id.toString()
      }))
    });
  } catch (error: any) {
    console.error('Fetch Category SEO Content Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await initDb();
    const body = await request.json();
    const {
      id,
      categoryId,
      subCategoryId,
      subSubCategoryId,
      h1,
      metaTitle,
      metaDescription,
      canonicalUrl,
      robotsIndex = 'noindex',
      robotsFollow = 'follow',
      htmlContent,
      introContent,
      bannerImage,
      bannerAlt,
      youtubeUrl,
      relatedCategoryIds = [],
      showInventoryCatalog = false,
      status = 'Published',
      sections = []
    } = body;

    const numCatId = categoryId ? Number(categoryId) : null;
    const numSubCatId = subCategoryId ? Number(subCategoryId) : null;
    const numSubSubCatId = subSubCategoryId ? Number(subSubCategoryId) : null;

    if (!numCatId && !numSubCatId && !numSubSubCatId) {
      return NextResponse.json({ error: 'categoryId, subCategoryId, or subSubCategoryId is required' }, { status: 400 });
    }

    let seoContentId = id ? Number(id) : null;

    // Check existing
    if (!seoContentId) {
      let checkQuery = '';
      let checkParams: any[] = [];
      if (numSubSubCatId) {
        checkQuery = 'SELECT id FROM category_seo_content WHERE subSubCategoryId = ? LIMIT 1';
        checkParams = [numSubSubCatId];
      } else if (numSubCatId) {
        checkQuery = 'SELECT id FROM category_seo_content WHERE subCategoryId = ? AND subSubCategoryId IS NULL LIMIT 1';
        checkParams = [numSubCatId];
      } else {
        checkQuery = 'SELECT id FROM category_seo_content WHERE categoryId = ? AND subCategoryId IS NULL AND subSubCategoryId IS NULL LIMIT 1';
        checkParams = [numCatId];
      }
      const [existing]: any = await pool.query(checkQuery, checkParams);
      if (existing.length > 0) {
        seoContentId = existing[0].id;
      }
    }

    const relatedJson = JSON.stringify(relatedCategoryIds);
    const isShowCatalog = !!showInventoryCatalog;

    if (seoContentId) {
      await pool.query(
        `UPDATE category_seo_content SET
          h1 = ?, metaTitle = ?, metaDescription = ?, canonicalUrl = ?,
          robotsIndex = ?, robotsFollow = ?, htmlContent = ?, introContent = ?, bannerImage = ?,
          bannerAlt = ?, youtubeUrl = ?, relatedCategoryIds = ?, showInventoryCatalog = ?, status = ?,
          updatedAt = NOW()
         WHERE id = ?`,
        [
          h1 || null, metaTitle || null, metaDescription || null, canonicalUrl || null,
          robotsIndex, robotsFollow, htmlContent || null, introContent || null, bannerImage || null,
          bannerAlt || null, youtubeUrl || null, relatedJson, isShowCatalog, status,
          seoContentId
        ]
      );
    } else {
      const [insertRes]: any = await pool.query(
        `INSERT INTO category_seo_content (
          categoryId, subCategoryId, subSubCategoryId, h1, metaTitle, metaDescription, canonicalUrl,
          robotsIndex, robotsFollow, htmlContent, introContent, bannerImage, bannerAlt, youtubeUrl,
          relatedCategoryIds, showInventoryCatalog, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          numCatId, numSubCatId, numSubSubCatId, h1 || null, metaTitle || null, metaDescription || null, canonicalUrl || null,
          robotsIndex, robotsFollow, htmlContent || null, introContent || null, bannerImage || null, bannerAlt || null, youtubeUrl || null,
          relatedJson, isShowCatalog, status
        ]
      );
      seoContentId = insertRes.insertId;
    }

    // Process sections if provided
    const [existingSecRows]: any = await pool.query(
      'SELECT id FROM category_seo_sections WHERE seoContentId = ?',
      [seoContentId]
    );
    const existingSecIds: number[] = existingSecRows.map((r: any) => r.id);
    const passedSecIds: number[] = sections.filter((s: any) => s.id).map((s: any) => Number(s.id));

    const toDeleteSecIds = existingSecIds.filter(secId => !passedSecIds.includes(secId));
    if (toDeleteSecIds.length > 0) {
      await pool.query(
        `DELETE FROM category_seo_sections WHERE id IN (${toDeleteSecIds.map(() => '?').join(',')})`,
        toDeleteSecIds
      );
    }

    for (let idx = 0; idx < sections.length; idx++) {
      const sec = sections[idx];
      const secHeading = sec.heading || '';
      const secHeadingLevel = sec.headingLevel || 'H2';
      const secContent = sec.content || '';
      const secBulletPointsJson = JSON.stringify(sec.bulletPoints || []);
      const secImage = sec.image || null;
      const secImageAlt = sec.imageAlt || null;
      const secVideoUrl = sec.videoUrl || null;
      const secOrderIndex = sec.orderIndex !== undefined ? Number(sec.orderIndex) : idx;
      const secIsActive = sec.isActive !== undefined ? Boolean(sec.isActive) : true;

      if (sec.id) {
        await pool.query(
          `UPDATE category_seo_sections SET
            heading = ?, headingLevel = ?, content = ?, bulletPoints = ?,
            image = ?, imageAlt = ?, videoUrl = ?, orderIndex = ?, isActive = ?, updatedAt = NOW()
           WHERE id = ? AND seoContentId = ?`,
          [
            secHeading, secHeadingLevel, secContent, secBulletPointsJson,
            secImage, secImageAlt, secVideoUrl, secOrderIndex, secIsActive,
            Number(sec.id), seoContentId
          ]
        );
      } else {
        await pool.query(
          `INSERT INTO category_seo_sections (
            seoContentId, heading, headingLevel, content, bulletPoints,
            image, imageAlt, videoUrl, orderIndex, isActive
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            seoContentId, secHeading, secHeadingLevel, secContent, secBulletPointsJson,
            secImage, secImageAlt, secVideoUrl, secOrderIndex, secIsActive
          ]
        );
      }
    }

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, id: seoContentId });
  } catch (error: any) {
    console.error('Save Category SEO Content Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');
    const id = searchParams.get('id');

    if (sectionId) {
      await pool.query('DELETE FROM category_seo_sections WHERE id = ?', [Number(sectionId)]);
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: true });
    }

    if (id) {
      await pool.query('DELETE FROM category_seo_content WHERE id = ?', [Number(id)]);
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Missing sectionId or id' }, { status: 400 });
  } catch (error: any) {
    console.error('Delete Category SEO Content Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
