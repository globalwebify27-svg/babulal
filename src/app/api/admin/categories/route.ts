import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import pool, { initDb } from '@/lib/db';
import { optimizeBase64Image } from '@/lib/image-utils';
import { generateUniqueSlug } from '@/lib/slug';

function mapCategory(cat: any) {
  if (!cat) return null;
  return {
    ...cat,
    _id: cat.id.toString(),
    cardImage: cat.cardImage || null,
    robotsIndex: cat.robotsIndex !== undefined && cat.robotsIndex !== null ? !!cat.robotsIndex : false,
    robotsFollow: cat.robotsFollow !== undefined && cat.robotsFollow !== null ? !!cat.robotsFollow : true,
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
    
    // Generate unique slug safely
    data.slug = await generateUniqueSlug('categories', data.name, undefined, data.slug);

    // Automatically optimize images if present
    if (data.image) {
      data.image = await optimizeBase64Image(data.image);
    }
    if (data.cardImage) {
      data.cardImage = await optimizeBase64Image(data.cardImage);
    }

    const robotsIdx = data.robotsIndex !== undefined ? !!data.robotsIndex : false;
    const robotsFlw = data.robotsFollow !== undefined ? !!data.robotsFollow : true;

    const [result]: any = await pool.query(
      `INSERT INTO categories (name, slug, image, cardImage, showInHeader, topBusiness, isCurated, orderIndex, status, parentVertical, robotsIndex, robotsFollow)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.slug,
        data.image || null,
        data.cardImage || null,
        data.showInHeader !== undefined ? !!data.showInHeader : true,
        data.topBusiness !== undefined ? !!data.topBusiness : false,
        data.isCurated !== undefined ? !!data.isCurated : false,
        data.order !== undefined ? Number(data.order) : 0,
        data.status || 'Active',
        data.parentVertical || 'textiles',
        robotsIdx,
        robotsFlw
      ]
    );

    const [rows]: any = await pool.query('SELECT * FROM categories WHERE id = ?', [result.insertId]);
    console.log('CREATED CATEGORY:', rows[0]);
    revalidatePath('/', 'layout');
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
    if (updates.slug) {
      cleanUpdates.slug = await generateUniqueSlug('categories', updates.name || '', id, updates.slug);
    }
    if (updates.image !== undefined) {
      cleanUpdates.image = await optimizeBase64Image(updates.image);
    }
    if (updates.cardImage !== undefined) {
      cleanUpdates.cardImage = await optimizeBase64Image(updates.cardImage);
    }
    if (updates.showInHeader !== undefined) cleanUpdates.showInHeader = !!updates.showInHeader;
    if (updates.isCurated !== undefined) cleanUpdates.isCurated = !!updates.isCurated;
    if (updates.status) cleanUpdates.status = updates.status;
    if (updates.order !== undefined) cleanUpdates.orderIndex = Number(updates.order);
    if (updates.parentVertical) cleanUpdates.parentVertical = updates.parentVertical.toLowerCase();
    if (updates.robotsIndex !== undefined) cleanUpdates.robotsIndex = !!updates.robotsIndex;
    if (updates.robotsFollow !== undefined) cleanUpdates.robotsFollow = !!updates.robotsFollow;

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
    
    revalidatePath('/', 'layout');
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
    
    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
