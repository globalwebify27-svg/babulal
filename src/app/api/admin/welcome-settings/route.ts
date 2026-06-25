import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    
    const [rows]: any = await pool.query(
      'SELECT * FROM welcome_page_settings ORDER BY id ASC LIMIT 1'
    );
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'No settings found' }, { status: 404 });
    }
    
    return NextResponse.json(rows[0]);
  } catch (error: any) {
    console.error('Failed to fetch welcome settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await initDb();

    // Check if a record exists
    const [rows]: any = await pool.query('SELECT id FROM welcome_page_settings LIMIT 1');
    
    const welcomeTitle = data.welcomeTitle || 'Welcome to Babulal Premkumar';
    const welcomeMessage = data.welcomeMessage || '';
    const introTitle = data.introTitle || 'About Us';
    const introContent = data.introContent || '';
    const videoUrl = data.videoUrl || '';
    const videoTitle = data.videoTitle || 'Shopping Guide';
    const feedbackUrl = data.feedbackUrl || '';
    const contactPhone = data.contactPhone || '';
    const contactEmail = data.contactEmail || '';
    const address = data.address || '';
    const googleMapsUrl = data.googleMapsUrl || '';
    const whatsappNumber = data.whatsappNumber || '';

    if (rows.length === 0) {
      // Insert if not exists
      await pool.query(
        `INSERT INTO welcome_page_settings (
          welcomeTitle, welcomeMessage, introTitle, introContent, videoUrl, videoTitle, feedbackUrl, contactPhone, contactEmail, address, googleMapsUrl, whatsappNumber
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          welcomeTitle, welcomeMessage, introTitle, introContent, videoUrl, videoTitle, feedbackUrl, contactPhone, contactEmail, address, googleMapsUrl, whatsappNumber
        ]
      );
    } else {
      // Update the existing record (typically id = 1)
      const recordId = rows[0].id;
      await pool.query(
        `UPDATE welcome_page_settings SET
          welcomeTitle = ?,
          welcomeMessage = ?,
          introTitle = ?,
          introContent = ?,
          videoUrl = ?,
          videoTitle = ?,
          feedbackUrl = ?,
          contactPhone = ?,
          contactEmail = ?,
          address = ?,
          googleMapsUrl = ?,
          whatsappNumber = ?
        WHERE id = ?`,
        [
          welcomeTitle, welcomeMessage, introTitle, introContent, videoUrl, videoTitle, feedbackUrl, contactPhone, contactEmail, address, googleMapsUrl, whatsappNumber,
          recordId
        ]
      );
    }

    const [updatedRows]: any = await pool.query('SELECT * FROM welcome_page_settings ORDER BY id ASC LIMIT 1');
    return NextResponse.json(updatedRows[0]);
  } catch (error: any) {
    console.error('Welcome Page Settings Save Error:', error);
    return NextResponse.json({ error: 'Failed to save settings', details: error.message }, { status: 500 });
  }
}
