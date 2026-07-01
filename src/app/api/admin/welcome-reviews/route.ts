import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    
    const [rows]: any = await pool.query(
      'SELECT * FROM welcome_page_reviews ORDER BY createdAt DESC'
    );
    
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Failed to fetch customer reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
