import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';
import { optimizeBase64Image } from '@/lib/image-utils';

function mapCategory(cat: any) {
  if (!cat) return null;
  return {
    ...cat,
    _id: cat.id.toString(),
    order: cat.orderIndex,
    showInHeader: !!cat.showInHeader,
    topBusiness: !!cat.topBusiness,
    isCurated: !!cat.isCurated
  };
}

export async function GET() {
  try {
    await initDb();
    const [rows]: any = await pool.query('SELECT * FROM categories ORDER BY orderIndex ASC');
    console.log(`--- DB FETCH CATEGORIES --- COUNT: ${rows.length}`);
    return NextResponse.json(rows.map(mapCategory));
  } catch (error: any) {
    console.error('FETCH CATEGORIES ERROR:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch categories',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log('POST CATEGORY DATA:', data);
    await initDb();
    
    // Auto-generate slug if not provided
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    // Automatically optimize images if present
    if (data.image) {
      data.image = await optimizeBase64Image(data.image);
    }

    const [result]: any = await pool.query(
      `INSERT INTO categories (name, slug, image, showInHeader, topBusiness, isCurated, orderIndex, status, parentVertical)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.slug,
        data.image || null,
        data.showInHeader !== undefined ? !!data.showInHeader : true,
        data.topBusiness !== undefined ? !!data.topBusiness : false,
        data.isCurated !== undefined ? !!data.isCurated : false,
        data.order !== undefined ? Number(data.order) : 0,
        data.status || 'Active',
        data.parentVertical || 'textiles'
      ]
    );

    const [rows]: any = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    console.log('CREATED CATEGORY:', rows[0]);
    return NextResponse.json(mapCategory(rows[0]), { status: 201 });
  } catch (error: any) {
    console.error('Category Create Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    console.log('PATCH CATEGORY ATTEMPT:', { id, updates });
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    await initDb();
    
    // Normalize properties for database durability
    const cleanUpdates: any = {};
    if (updates.name) cleanUpdates.name = updates.name;
    if (updates.slug) cleanUpdates.slug = updates.slug;
    if (updates.image !== undefined) {
      cleanUpdates.image = await optimizeBase64Image(updates.image);
    }
    if (updates.showInHeader !== undefined) cleanUpdates.showInHeader = !!updates.showInHeader;
    if (updates.isCurated !== undefined) cleanUpdates.isCurated = !!updates.isCurated;
    if (updates.status) cleanUpdates.status = updates.status;
    if (updates.order !== undefined) cleanUpdates.orderIndex = Number(updates.order);
    if (updates.parentVertical) cleanUpdates.parentVertical = updates.parentVertical.toLowerCase();

    const keys = Object.keys(cleanUpdates);
    if (keys.length > 0) {
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const values = keys.map(key => cleanUpdates[key]);
      values.push(id);
      
      await pool.query(`UPDATE categories SET ${setClause} WHERE id = ?`, values);
    }

    const [rows]: any = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    console.log('ATOMIC UPDATE RESULT:', rows[0]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json(mapCategory(rows[0]));
  } catch (error: any) {
    console.error('PATCH ERROR:', error);
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
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
    
    const [rows]: any = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
