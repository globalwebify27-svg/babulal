import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

/**
 * GET /api/admin/leads
 * Retrieves all captured leads. Supports filtering by businessVertical and status.
 */
export async function GET(req: Request) {
  try {
    await initDb();
    
    // Simple query parsing for vertical and status
    const { searchParams } = new URL(req.url);
    const vertical = searchParams.get('vertical');
    const status = searchParams.get('status');
    
    let query = 'SELECT * FROM leads';
    const params: any[] = [];
    
    const conditions: string[] = [];
    if (vertical) {
      conditions.push('businessVertical = ?');
      params.push(vertical);
    }
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY createdAt DESC';
    
    const [leads]: any = await pool.query(query, params);

    return NextResponse.json(leads, { status: 200 });
  } catch (error: any) {
    console.error('Lead Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/leads
 * Update lead status (e.g. CLOSED, IN_PROGRESS)
 */
export async function PATCH(req: Request) {
  try {
    await initDb();
    const data = await req.json();
    
    if (!data.id || !data.status) {
      return NextResponse.json(
        { error: 'Missing lead ID or status' },
        { status: 400 }
      );
    }

    await pool.query(
      'UPDATE leads SET status = ?, notes = ? WHERE id = ?',
      [data.status, data.notes || null, data.id]
    );

    const [rows]: any = await pool.query('SELECT * FROM leads WHERE id = ?', [data.id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error: any) {
    console.error('Lead Update Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
