import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { customerName, mobileNumber, rating, comment } = data;

    if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    if (!mobileNumber || typeof mobileNumber !== 'string' || mobileNumber.trim() === '') {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
    }

    const parsedRating = parseInt(rating, 10);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    await initDb();

    await pool.query(
      `INSERT INTO welcome_page_reviews (customerName, mobileNumber, rating, comment) VALUES (?, ?, ?, ?)`,
      [customerName.trim(), mobileNumber.trim(), parsedRating, comment?.trim() || '']
    );

    return NextResponse.json({ success: true, message: 'Review submitted successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Welcome Page Review Submission Error:', error);
    return NextResponse.json({ error: 'Failed to submit review', details: error.message }, { status: 500 });
  }
}
