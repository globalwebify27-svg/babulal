import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

function mapLandingContent(row: any) {
  if (!row) return null;
  return {
    ...row,
    aboutSection: {
      title: row.aboutTitle || 'Our Legacy',
      content: row.aboutContent || ''
    },
    features: row.features ? JSON.parse(row.features) : [],
    facebookPixel: {
      id: row.facebookPixelId || '',
      enabled: !!row.facebookPixelEnabled
    },
    marqueeTexts: row.marqueeTexts ? JSON.parse(row.marqueeTexts) : []
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const vertical = searchParams.get('vertical');
    
    await initDb();
    
    if (vertical) {
      const [rows]: any = await pool.query(
        'SELECT * FROM landing_content WHERE UPPER(vertical) = ? LIMIT 1',
        [vertical.toUpperCase()]
      );
      if (rows.length === 0) {
        return NextResponse.json({});
      }
      return NextResponse.json(mapLandingContent(rows[0]));
    }
    
    const [allRows]: any = await pool.query('SELECT * FROM landing_content');
    return NextResponse.json(allRows.map(mapLandingContent));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await initDb();

    const vertical = data.vertical.toUpperCase();
    const heroTitle = data.heroTitle || '';
    const heroSubtitle = data.heroSubtitle || null;
    const aboutTitle = data.aboutSection?.title || 'Our Legacy';
    const aboutContent = data.aboutSection?.content || '';
    const features = data.features ? JSON.stringify(data.features) : JSON.stringify([]);
    const contactEmail = data.contactEmail || null;
    const contactPhone = data.contactPhone || null;
    const address = data.address || null;
    const facebookPixelId = data.facebookPixel?.id || null;
    const facebookPixelEnabled = data.facebookPixel?.enabled !== undefined ? !!data.facebookPixel.enabled : false;
    const marqueeTexts = data.marqueeTexts ? JSON.stringify(data.marqueeTexts) : JSON.stringify([]);

    await pool.query(
      `INSERT INTO landing_content (
        vertical, heroTitle, heroSubtitle, aboutTitle, aboutContent, features, contactEmail, contactPhone, address, facebookPixelId, facebookPixelEnabled, marqueeTexts
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        heroTitle = VALUES(heroTitle),
        heroSubtitle = VALUES(heroSubtitle),
        aboutTitle = VALUES(aboutTitle),
        aboutContent = VALUES(aboutContent),
        features = VALUES(features),
        contactEmail = VALUES(contactEmail),
        contactPhone = VALUES(contactPhone),
        address = VALUES(address),
        facebookPixelId = VALUES(facebookPixelId),
        facebookPixelEnabled = VALUES(facebookPixelEnabled),
        marqueeTexts = VALUES(marqueeTexts)`,
      [
        vertical, heroTitle, heroSubtitle, aboutTitle, aboutContent, features, contactEmail, contactPhone, address, facebookPixelId, facebookPixelEnabled, marqueeTexts
      ]
    );

    const [updatedRows]: any = await pool.query(
      'SELECT * FROM landing_content WHERE vertical = ? LIMIT 1',
      [vertical]
    );

    return NextResponse.json(mapLandingContent(updatedRows[0]));
  } catch (error: any) {
    console.error('Landing Content Save Error:', error);
    return NextResponse.json({ error: 'Failed to save content', details: error.message }, { status: 500 });
  }
}
