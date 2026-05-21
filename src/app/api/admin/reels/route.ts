import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

function mapReel(reel: any) {
  if (!reel) return null;
  return {
    ...reel,
    _id: reel.id.toString(),
    id: reel.instagramId, // Maintain interface with frontend
    instagramId: reel.instagramId,
    order: reel.orderIndex
  };
}

function extractInstagramId(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  // Check if URL
  if (trimmed.includes('instagram.com')) {
    const match = trimmed.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }
  return trimmed;
}

export async function GET(req: Request) {
  try {
    await initDb();
    const [reels]: any = await pool.query('SELECT * FROM reels ORDER BY orderIndex ASC, id DESC');
    return NextResponse.json(reels.map(mapReel));
  } catch (error) {
    console.error('Failed to fetch reels:', error);
    return NextResponse.json({ error: 'Failed to fetch reels' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await initDb();

    const rawId = data.instagramId || data.id || '';
    const instagramId = extractInstagramId(rawId);

    if (!instagramId) {
      return NextResponse.json({ error: 'Instagram Reel URL or ID is required' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      `INSERT INTO reels (instagramId, title, category, orderIndex, status)
       VALUES (?, ?, ?, ?, ?)`,
      [
        instagramId,
        data.title || 'Cinematic Piece',
        data.category || 'Collection Video',
        data.order !== undefined ? data.order : 0,
        data.status || 'Active'
      ]
    );

    const [rows]: any = await pool.query('SELECT * FROM reels WHERE id = ?', [result.insertId]);
    return NextResponse.json(mapReel(rows[0]), { status: 201 });
  } catch (error: any) {
    console.error('Reel Creation Error:', error);
    return NextResponse.json({ error: 'Failed to add Instagram Reel' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await initDb();

    if (updates.instagramId || updates.id) {
      updates.instagramId = extractInstagramId(updates.instagramId || updates.id);
      delete updates.id;
    }

    const keys = Object.keys(updates);
    if (keys.length > 0) {
      const setClause = keys.map(key => {
        if (key === 'order') return 'orderIndex = ?';
        return `${key} = ?`;
      }).join(', ');

      const values = keys.map(key => updates[key]);
      values.push(id);

      await pool.query(`UPDATE reels SET ${setClause} WHERE id = ?`, values);
    }

    const [rows]: any = await pool.query('SELECT * FROM reels WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Reel not found' }, { status: 404 });
    }

    return NextResponse.json(mapReel(rows[0]));
  } catch (error: any) {
    console.error('Reel Patch Error:', error);
    return NextResponse.json({ error: 'Failed to update reel' }, { status: 500 });
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
    await pool.query('DELETE FROM reels WHERE id = ?', [id]);

    return NextResponse.json({ message: 'Instagram Reel deleted successfully' });
  } catch (error) {
    console.error('Failed to delete Instagram Reel:', error);
    return NextResponse.json({ error: 'Failed to delete Instagram Reel' }, { status: 500 });
  }
}
