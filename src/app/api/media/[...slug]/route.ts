import { NextRequest, NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

// 1x1 transparent GIF fallback (43 bytes)
const TRANSPARENT_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
);

interface RouteProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function GET(req: NextRequest, { params }: RouteProps) {
  try {
    const { slug } = await params;
    if (!slug || slug.length < 2) {
      return new NextResponse(TRANSPARENT_GIF, {
        status: 400,
        headers: { 'Content-Type': 'image/gif' }
      });
    }

    const table = slug[0];
    const rawId = slug[1].replace(/\.[^.]+$/, ''); // remove .jpg if present
    const numId = parseInt(rawId, 10);

    if (isNaN(numId)) {
      return new NextResponse(TRANSPARENT_GIF, {
        status: 400,
        headers: { 'Content-Type': 'image/gif' }
      });
    }

    await initDb();
    let rawData: string | null = null;

    if (table === 'banners') {
      const isImgField = slug.length > 2 && slug[2].startsWith('img');
      const col = isImgField ? 'img' : 'image';
      const [rows]: any = await pool.query(
        `SELECT ${col} as img FROM banners WHERE id = ? LIMIT 1`,
        [numId]
      );
      if (rows.length > 0) rawData = rows[0].img;
    } else if (table === 'categories') {
      const isCard = slug.length > 2 && slug[2].startsWith('card');
      const col = isCard ? 'cardImage' : 'image';
      const [rows]: any = await pool.query(
        `SELECT ${col} as img FROM categories WHERE id = ? LIMIT 1`,
        [numId]
      );
      if (rows.length > 0) rawData = rows[0].img;
    } else if (table === 'sub_categories') {
      const [rows]: any = await pool.query(
        'SELECT image as img FROM sub_categories WHERE id = ? LIMIT 1',
        [numId]
      );
      if (rows.length > 0) rawData = rows[0].img;
    } else if (table === 'products') {
      const indexStr = slug.length > 2 ? slug[2].replace(/\.[^.]+$/, '') : '0';
      const idx = parseInt(indexStr, 10) || 0;
      const [rows]: any = await pool.query(
        'SELECT images FROM products WHERE id = ? LIMIT 1',
        [numId]
      );
      if (rows.length > 0 && rows[0].images) {
        try {
          const arr = typeof rows[0].images === 'string' ? JSON.parse(rows[0].images) : rows[0].images;
          rawData = Array.isArray(arr) && arr[idx] ? arr[idx] : (Array.isArray(arr) ? arr[0] : null);
        } catch {
          rawData = null;
        }
      }
    } else if (table === 'category_seo_content') {
      const isHtml = slug.length > 2 && slug[2] === 'html';
      if (isHtml) {
        const imgIdxStr = slug.length > 3 ? slug[3].replace(/\.[^.]+$/, '') : '0';
        const targetIdx = parseInt(imgIdxStr, 10) || 0;
        const [rows]: any = await pool.query(
          'SELECT htmlContent FROM category_seo_content WHERE id = ? LIMIT 1',
          [numId]
        );
        if (rows.length > 0 && rows[0].htmlContent) {
          const matches = [...rows[0].htmlContent.matchAll(/src=["'](data:image\/[^"']+)["']/gi)];
          if (matches.length > targetIdx && matches[targetIdx][1]) {
            rawData = matches[targetIdx][1];
          }
        }
      } else {
        const [rows]: any = await pool.query(
          'SELECT bannerImage as img FROM category_seo_content WHERE id = ? LIMIT 1',
          [numId]
        );
        if (rows.length > 0) rawData = rows[0].img;
      }
    }

    if (!rawData) {
      return new NextResponse(TRANSPARENT_GIF, {
        status: 404,
        headers: { 'Content-Type': 'image/gif' }
      });
    }

    // If it's already an external or local URL, redirect
    if (!rawData.startsWith('data:image')) {
      const redirectUrl = rawData.startsWith('http')
        ? rawData
        : new URL(rawData, req.url).toString();
      return NextResponse.redirect(redirectUrl);
    }

    // Decode base64
    const [header, base64Data] = rawData.split(',');
    if (!base64Data) {
      return new NextResponse(TRANSPARENT_GIF, {
        status: 400,
        headers: { 'Content-Type': 'image/gif' }
      });
    }

    const mimeMatch = header.match(/data:(image\/[^;]+);base64/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      }
    });
  } catch (error) {
    console.error('Media [...slug] route error:', error);
    return new NextResponse(TRANSPARENT_GIF, {
      status: 500,
      headers: { 'Content-Type': 'image/gif' }
    });
  }
}
