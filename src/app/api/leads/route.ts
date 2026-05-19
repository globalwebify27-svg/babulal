import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

/**
 * POST /api/leads
 * Handles:
 * 1. "Become a Dealer" form submissions
 * 2. WhatsApp click tracking (Source: WHATSAPP)
 * 3. Inquiry form submissions per vertical
 */
export async function POST(req: Request) {
  try {
    await initDb();
    const data = await req.json();

    // Verification: Minimum required fields
    if (!data.name || !data.mobile || !data.businessVertical) {
      return NextResponse.json(
        { error: 'Missing required fields: name, mobile, or businessVertical' },
        { status: 400 }
      );
    }

    // Create the lead in MySQL
    const [result]: any = await pool.query(
      `INSERT INTO leads (name, email, mobile, city, state, interest, businessVertical, source, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.email || null,
        data.mobile,
        data.city || null,
        data.state || null,
        data.interest || 'General Inquiry',
        data.businessVertical.toLowerCase(),
        data.source || 'FORM',
        'NEW',
        data.notes || null
      ]
    );

    return NextResponse.json(
      { message: 'Lead captured successfully', id: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Lead Capture Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
