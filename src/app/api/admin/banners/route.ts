import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';
import { optimizeBase64Image } from '@/lib/image-utils';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vertical = searchParams.get('vertical');
    
    await initDb();
    
    let query = 'SELECT * FROM banners';
    const params: any[] = [];
    
    if (vertical) {
      query += ' WHERE UPPER(vertical) = ?';
      params.push(vertical.toUpperCase());
    }
    
    query += ' ORDER BY orderIndex ASC';
    const [banners]: any = await pool.query(query, params);
    
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Automatically optimize images if present
    if (data.image) {
      data.image = await optimizeBase64Image(data.image);
    }
    if (data.img) {
      data.img = await optimizeBase64Image(data.img);
    }
    
    await initDb();
    
    const [result]: any = await pool.query(
      `INSERT INTO banners (title, subtitle, image, vertical, link, orderIndex, isActive, position, alignment)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title,
        data.subtitle || null,
        data.image || data.img,
        data.vertical || 'HOME',
        data.link || null,
        data.order !== undefined ? data.order : (data.orderIndex !== undefined ? data.orderIndex : 0),
        data.isActive !== undefined ? data.isActive : true,
        data.position || 'HOME_HERO',
        data.alignment || 'center'
      ]
    );
    
    const [newBannerRows]: any = await pool.query('SELECT * FROM banners WHERE id = ?', [result.insertId]);
    
    return NextResponse.json(newBannerRows[0], { status: 201 });
  } catch (error: any) {
    console.error('Banner Creation Error:', error);
    return NextResponse.json({ 
      error: 'Failed to create banner', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (updates.image) {
      updates.image = await optimizeBase64Image(updates.image);
    }
    if (updates.img) {
      updates.img = await optimizeBase64Image(updates.img);
    }

    await initDb();
    
    const keys = Object.keys(updates);
    if (keys.length > 0) {
      const setClause = keys.map(key => {
        if (key === 'order') return 'orderIndex = ?';
        return `${key} = ?`;
      }).join(', ');
      
      const values = keys.map(key => updates[key]);
      values.push(id);
      
      await pool.query(`UPDATE banners SET ${setClause} WHERE id = ?`, values);
    }
    
    const [updatedBannerRows]: any = await pool.query('SELECT * FROM banners WHERE id = ?', [id]);
    return NextResponse.json(updatedBannerRows[0]);
  } catch (error) {
    console.error('Banner Update Error:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
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
    await pool.query('DELETE FROM banners WHERE id = ?', [id]);
    
    return NextResponse.json({ message: 'Banner deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
