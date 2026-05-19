import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

/**
 * GET /api/products/[slug]
 * Public API to fetch a single product by its slug.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await initDb();
    
    // params are now a promise in newer Next.js versions as per agents.md rule
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const [rows]: any = await pool.query(
      'SELECT * FROM products WHERE slug = ? AND isActive = TRUE LIMIT 1',
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const prod = rows[0];
    const product = {
      ...prod,
      images: prod.images ? JSON.parse(prod.images) : [],
      attributes: prod.attributes ? JSON.parse(prod.attributes) : {},
      seo: {
        h1: prod.h1,
        metaTitle: prod.metaTitle,
        metaDescription: prod.metaDescription,
        altText: prod.altText
      }
    };

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error('Product Detail Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
