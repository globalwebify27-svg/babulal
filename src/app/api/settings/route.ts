import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';
import { DEFAULT_WHATSAPP_NUMBER, SITE_URL } from '@/lib/constants';

export async function GET() {
  try {
    await initDb();
    const [rows]: any = await pool.query(
      "SELECT whatsappNumber, contactPhone, contactEmail FROM welcome_page_settings WHERE storeLocation = 'Ranchi' ORDER BY id ASC LIMIT 1"
    );

    let whatsappNumber = DEFAULT_WHATSAPP_NUMBER;
    let contactPhone = '';
    let contactEmail = '';

    if (rows.length > 0) {
      if (rows[0].whatsappNumber && rows[0].whatsappNumber.trim()) {
        whatsappNumber = rows[0].whatsappNumber;
      }
      contactPhone = rows[0].contactPhone || '';
      contactEmail = rows[0].contactEmail || '';
    }

    return NextResponse.json({
      whatsappNumber,
      contactPhone,
      contactEmail,
      siteUrl: SITE_URL
    });
  } catch (error: any) {
    console.error('Fetch public settings error:', error);
    return NextResponse.json({
      whatsappNumber: DEFAULT_WHATSAPP_NUMBER,
      siteUrl: SITE_URL
    });
  }
}
