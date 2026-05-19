import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

/**
 * GET /api/products
 * Public API to fetch active products with optional filtering by:
 * - vertical (e.g., textiles, honda)
 * - category
 * - isFeatured
 */
export async function GET(req: Request) {
  try {
    await initDb();
    
    const { searchParams } = new URL(req.url);
    const vertical = searchParams.get('vertical');
    const category = searchParams.get('category');
    const isFeatured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let query = 'SELECT * FROM products WHERE isActive = TRUE';
    const params: any[] = [];
    
    if (vertical) {
      query += ' AND LOWER(businessVertical) = ?';
      params.push(vertical.toLowerCase());
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (isFeatured === 'true') {
      query += ' AND isFeatured = TRUE';
    }
    
    query += ' ORDER BY createdAt DESC LIMIT ?';
    params.push(limit);

    const [rows]: any = await pool.query(query, params);
    
    const products = rows.map((prod: any) => ({
      ...prod,
      images: prod.images ? JSON.parse(prod.images) : [],
      attributes: prod.attributes ? JSON.parse(prod.attributes) : {},
      seo: {
        h1: prod.h1,
        metaTitle: prod.metaTitle,
        metaDescription: prod.metaDescription,
        altText: prod.altText
      }
    }));

    return NextResponse.json(products, { status: 200 });
  } catch (error: any) {
    console.error('Public Product Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
