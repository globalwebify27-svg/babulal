import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

function mapSubSubCategory(sub: any) {
  if (!sub) return null;
  return {
    ...sub,
    _id: sub.id.toString(),
    subCategory: sub.subCategoryId ? sub.subCategoryId.toString() : null,
    order: sub.orderIndex
  };
}

export async function GET(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const subCategoryId = searchParams.get('subCategoryId');
    
    let query = 'SELECT * FROM sub_sub_categories';
    const params: any[] = [];
    
    if (subCategoryId) {
      query += ' WHERE subCategoryId = ?';
      params.push(subCategoryId);
    }
    
    query += ' ORDER BY orderIndex ASC';
    const [subSubCategories]: any = await pool.query(query, params);
    
    return NextResponse.json(subSubCategories.map(mapSubSubCategory));
  } catch (error) {
    console.error('Failed to fetch sub-sub-categories:', error);
    return NextResponse.json({ error: 'Failed to fetch sub-sub-categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await initDb();
    
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    const parentSubCategoryId = data.subCategoryId || data.subCategory;
    if (!parentSubCategoryId) {
      return NextResponse.json({ error: 'subCategoryId is required' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      `INSERT INTO sub_sub_categories (name, slug, subCategoryId, status, orderIndex)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.name,
        data.slug,
        parentSubCategoryId,
        data.status || 'Active',
        data.order !== undefined ? data.order : (data.orderIndex !== undefined ? data.orderIndex : 0)
      ]
    );
    
    const [rows]: any = await pool.query('SELECT * FROM sub_sub_categories WHERE id = ?', [result.insertId]);
    return NextResponse.json(mapSubSubCategory(rows[0]), { status: 201 });
  } catch (error: any) {
    console.error('Sub-Subcategory Creation Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A sub-subcategory with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create sub-subcategory' }, { status: 500 });
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
        if (key === 'subCategory') return 'subCategoryId = ?';
        if (key === 'order') return 'orderIndex = ?';
        return `${key} = ?`;
      }).join(', ');
      
      const values = keys.map(key => updates[key]);
      values.push(id);
      
      await pool.query(`UPDATE sub_sub_categories SET ${setClause} WHERE id = ?`, values);
    }
    
    const [rows]: any = await pool.query('SELECT * FROM sub_sub_categories WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Sub-subcategory not found' }, { status: 404 });
    }
    
    return NextResponse.json(mapSubSubCategory(rows[0]));
  } catch (error: any) {
    console.error('Sub-Subcategory Patch Error:', error);
    return NextResponse.json({ error: 'Failed to update sub-subcategory' }, { status: 500 });
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
    await pool.query('DELETE FROM sub_sub_categories WHERE id = ?', [id]);
    
    return NextResponse.json({ message: 'Sub-subcategory deleted successfully' });
  } catch (error) {
    console.error('Failed to delete sub-subcategory:', error);
    return NextResponse.json({ error: 'Failed to delete sub-subcategory' }, { status: 500 });
  }
}
