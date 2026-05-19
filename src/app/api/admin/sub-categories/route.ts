import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

function mapSubCategory(sub: any) {
  if (!sub) return null;
  return {
    ...sub,
    _id: sub.id.toString(),
    category: sub.categoryId ? sub.categoryId.toString() : null,
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
    
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    const [result]: any = await pool.query(
      `INSERT INTO sub_categories (name, slug, categoryId, status, orderIndex, brochureUrl)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.slug,
        data.categoryId || data.category,
        data.status || 'Active',
        data.order !== undefined ? data.order : (data.orderIndex !== undefined ? data.orderIndex : 0),
        data.brochureUrl || null
      ]
    );
    
    // Increment subCategoryCount on Parent Category
    const parentCategoryId = data.categoryId || data.category;
    await pool.query(
      'UPDATE categories SET subCategoryCount = subCategoryCount + 1 WHERE id = ?',
      [parentCategoryId]
    );

    const [rows]: any = await pool.query('SELECT * FROM sub_categories WHERE id = ?', [result.insertId]);
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
    
    const [rows]: any = await pool.query('SELECT * FROM sub_categories WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Sub-category not found' }, { status: 404 });
    }
    
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
    
    return NextResponse.json({ message: 'Sub-category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete sub-category' }, { status: 500 });
  }
}
