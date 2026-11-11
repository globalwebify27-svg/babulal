import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import pool, { initDb } from '@/lib/db';
import { generateUniqueSlug, recordSlugRedirect } from '@/lib/slug';
import { optimizeBase64Image } from '@/lib/image-utils';

function mapSubCategory(sub: any) {
  if (!sub) return null;
  return {
    ...sub,
    _id: sub.id.toString(),
    category: sub.categoryId ? sub.categoryId.toString() : null,
    image: sub.image || null,
    cardImage: sub.cardImage || null,
    robotsIndex: sub.robotsIndex !== undefined && sub.robotsIndex !== null ? !!sub.robotsIndex : true,
    robotsFollow: sub.robotsFollow !== undefined && sub.robotsFollow !== null ? !!sub.robotsFollow : true,
    order: sub.orderIndex
  };
}

export async function GET(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    
    let query = 'SELECT * FROM sub_categories';
    const params: any[] = [];
    
    if (categoryId) {
      query += ' WHERE categoryId = ?';
      params.push(categoryId);
    }
    
    query += ' ORDER BY orderIndex ASC';
    const [subCategories]: any = await pool.query(query, params);
    
    return NextResponse.json(subCategories.map(mapSubCategory));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sub-categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await initDb();
    
    data.slug = await generateUniqueSlug('sub_categories', data.name, undefined, data.slug);

    if (data.image) {
      data.image = await optimizeBase64Image(data.image);
    }
    if (data.cardImage) {
      data.cardImage = await optimizeBase64Image(data.cardImage);
    }

    const robotsIdx = data.robotsIndex !== undefined ? !!data.robotsIndex : true;
    const robotsFlw = data.robotsFollow !== undefined ? !!data.robotsFollow : true;

    const [result]: any = await pool.query(
      `INSERT INTO sub_categories (name, slug, categoryId, image, cardImage, status, orderIndex, brochureUrl, robotsIndex, robotsFollow)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name.trim(),
        data.slug,
        data.categoryId || data.category,
        data.image || null,
        data.cardImage || null,
        data.status || 'Active',
        data.order !== undefined ? data.order : (data.orderIndex !== undefined ? data.orderIndex : 0),
        data.brochureUrl || null,
        robotsIdx,
        robotsFlw
      ]
    );
    
    // Increment subCategoryCount on Parent Category
    const parentCategoryId = data.categoryId || data.category;
    await pool.query(
      'UPDATE categories SET subCategoryCount = subCategoryCount + 1 WHERE id = ?',
      [parentCategoryId]
    );

    const [rows]: any = await pool.query('SELECT * FROM sub_categories WHERE id = ?', [result.insertId]);
    revalidatePath('/', 'layout');
    revalidatePath(`/${data.slug}`);
    return NextResponse.json(mapSubCategory(rows[0]), { status: 201 });
  } catch (error: any) {
    console.error('Subcategory Creation Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A sub-category with this name already exists in this category' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create sub-category' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await initDb();

    const [existingRows]: any = await pool.query('SELECT * FROM sub_categories WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return NextResponse.json({ error: 'Sub-category not found' }, { status: 404 });
    }
    const currentSub = existingRows[0];
    const oldSlug = currentSub.slug;
    const oldName = currentSub.name;

    let newSlug = oldSlug;

    if (updates.name !== undefined && updates.name !== null) {
      const trimmedName = updates.name.trim();
      updates.name = trimmedName;
      const targetSlug = updates.slug ? updates.slug.trim() : trimmedName;
      newSlug = await generateUniqueSlug('sub_categories', trimmedName, id, targetSlug);
      updates.slug = newSlug;
    } else if (updates.slug) {
      newSlug = await generateUniqueSlug('sub_categories', currentSub.name, id, updates.slug.trim());
      updates.slug = newSlug;
    } else if (updates.syncSlug) {
      newSlug = await generateUniqueSlug('sub_categories', currentSub.name, id);
      updates.slug = newSlug;
    }
    
    if (updates.image) {
      updates.image = await optimizeBase64Image(updates.image);
    }
    if (updates.cardImage) {
      updates.cardImage = await optimizeBase64Image(updates.cardImage);
    }

    const keys = Object.keys(updates);
    if (keys.length > 0) {
      const setClause = keys.map(key => {
        if (key === 'category') return 'categoryId = ?';
        if (key === 'order') return 'orderIndex = ?';
        return `${key} = ?`;
      }).join(', ');
      
      const values = keys.map(key => updates[key]);
      values.push(id);
      
      await pool.query(`UPDATE sub_categories SET ${setClause} WHERE id = ?`, values);
    }
    if (updates.robotsIndex !== undefined || updates.robotsFollow !== undefined) {
      const targetIdx = updates.robotsIndex !== undefined ? !!updates.robotsIndex : !!currentSub.robotsIndex;
      const targetFlw = updates.robotsFollow !== undefined ? !!updates.robotsFollow : (currentSub.robotsFollow !== false);
      const robotsIndexStr = targetIdx ? 'index' : 'noindex';
      const robotsFollowStr = targetFlw ? 'follow' : 'nofollow';
      await pool.query(
        `UPDATE category_seo_content SET robotsIndex = ?, robotsFollow = ?, updatedAt = NOW() WHERE subCategoryId = ? AND subSubCategoryId IS NULL`,
        [robotsIndexStr, robotsFollowStr, id]
      );
    }

    // Handle slug synchronization & 301 redirection
    if (newSlug && oldSlug && newSlug.toLowerCase() !== oldSlug.toLowerCase()) {
      await recordSlugRedirect(oldSlug, newSlug);

      await pool.query(
        'UPDATE category_seo_content SET canonicalUrl = REPLACE(canonicalUrl, ?, ?) WHERE subCategoryId = ?',
        [`/${oldSlug}`, `/${newSlug}`, id]
      );

      if (updates.name && updates.name !== oldName) {
        await pool.query(
          'UPDATE products SET subCategory = ? WHERE subCategory = ? OR subCategory = ?',
          [updates.name, oldName, oldSlug]
        );
      }

      revalidatePath(`/${oldSlug}`);
      revalidatePath(`/${newSlug}`);
    } else if (updates.name && updates.name !== oldName) {
      await pool.query(
        'UPDATE products SET subCategory = ? WHERE subCategory = ?',
        [updates.name, oldName]
      );
    }
    
    const [rows]: any = await pool.query('SELECT * FROM sub_categories WHERE id = ?', [id]);
    revalidatePath('/', 'layout');
    return NextResponse.json(mapSubCategory(rows[0]));
  } catch (error: any) {
    console.error('Subcategory Patch Error:', error);
    return NextResponse.json({ error: 'Failed to update sub-category' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await initDb();

    const [subCatRows]: any = await pool.query('SELECT * FROM sub_categories WHERE id = ?', [id]);
    if (subCatRows.length > 0) {
      const subCat = subCatRows[0];
      await pool.query(
        'UPDATE categories SET subCategoryCount = subCategoryCount - 1 WHERE id = ?',
        [subCat.categoryId]
      );
      await pool.query('DELETE FROM sub_categories WHERE id = ?', [id]);
    }
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Sub-category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sub-category' }, { status: 500 });
  }
}
