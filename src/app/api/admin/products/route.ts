import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';
import { optimizeBase64Image } from '@/lib/image-utils';

function mapProduct(prod: any) {
  if (!prod) return null;
  return {
    _id: prod.id.toString(), // Keep Mongoose frontend compatibility
    id: prod.id,
    name: prod.name,
    slug: prod.slug,
    businessVertical: prod.businessVertical,
    category: prod.category,
    subCategory: prod.subCategory,
    description: prod.description,
    images: prod.images ? JSON.parse(prod.images) : [],
    videoUrl: prod.videoUrl,
    brochureUrl: prod.brochureUrl,
    attributes: prod.attributes ? JSON.parse(prod.attributes) : {},
    seo: {
      h1: prod.h1,
      metaTitle: prod.metaTitle,
      metaDescription: prod.metaDescription,
      altText: prod.altText
    },
    isFeatured: !!prod.isFeatured,
    isActive: !!prod.isActive,
    createdAt: prod.createdAt
  };
}

/**
 * GET /api/admin/products
 */
export async function GET(req: Request) {
  try {
    await initDb();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const vertical = searchParams.get('vertical');
    const category = searchParams.get('category');
    const isActive = searchParams.get('active');
    
    // Fetch single product if ID is provided
    if (id) {
      const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json(mapProduct(rows[0]), { status: 200 });
    }

    // Construct dynamic query
    let query = 'SELECT * FROM products';
    const conditions: string[] = [];
    const params: any[] = [];

    if (vertical) {
      conditions.push('businessVertical = ?');
      params.push(vertical.toLowerCase());
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (isActive !== null) {
      conditions.push('isActive = ?');
      params.push(isActive === 'true');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY createdAt DESC';

    const [rows]: any = await pool.query(query, params);
    return NextResponse.json(rows.map(mapProduct), { status: 200 });
  } catch (error: any) {
    console.error('Product Fetch Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 */
export async function POST(req: Request) {
  try {
    await initDb();
    const data = await req.json();

    // Verification of core fields
    if (!data.name || !data.slug || !data.businessVertical || !data.category) {
      return NextResponse.json(
        { error: 'Missing core fields: name, slug, businessVertical, or category' },
        { status: 400 }
      );
    }

    // Automatically optimize images
    if (data.image) {
      data.image = await optimizeBase64Image(data.image);
    }
    if (data.images && Array.isArray(data.images)) {
      data.images = await Promise.all(data.images.map((img: string) => optimizeBase64Image(img)));
    }

    // Handle nested structures
    const imagesVal = data.images ? JSON.stringify(data.images) : JSON.stringify([]);
    const attributesVal = data.attributes ? JSON.stringify(data.attributes) : JSON.stringify({});
    const h1Val = data.seo?.h1 || data.h1 || null;
    const metaTitleVal = data.seo?.metaTitle || data.metaTitle || null;
    const metaDescriptionVal = data.seo?.metaDescription || data.metaDescription || null;
    const altTextVal = data.seo?.altText || data.altText || null;

    const [result]: any = await pool.query(
      `INSERT INTO products (
        name, slug, businessVertical, category, subCategory, description, images, videoUrl, brochureUrl, attributes,
        h1, metaTitle, metaDescription, altText, isFeatured, isActive
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.slug.toLowerCase().replace(/\s+/g, '-'),
        data.businessVertical.toLowerCase(),
        data.category,
        data.subCategory || null,
        data.description || null,
        imagesVal,
        data.videoUrl || null,
        data.brochureUrl || null,
        attributesVal,
        h1Val,
        metaTitleVal,
        metaDescriptionVal,
        altTextVal,
        data.isFeatured !== undefined ? !!data.isFeatured : false,
        data.isActive !== undefined ? !!data.isActive : true
      ]
    );

    return NextResponse.json(
      { message: 'Product created successfully', id: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Product Creation Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Slug must be unique.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/products
 */
export async function PATCH(req: Request) {
  try {
    await initDb();
    const data = await req.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Auto-formatting slug if it's being updated
    if (updates.slug) {
      updates.slug = updates.slug.toLowerCase().replace(/\s+/g, '-');
    }
    if (updates.businessVertical) {
      updates.businessVertical = updates.businessVertical.toLowerCase();
    }

    // Automatically optimize images in updates
    if (updates.image) {
      updates.image = await optimizeBase64Image(updates.image);
    }
    if (updates.images && Array.isArray(updates.images)) {
      updates.images = await Promise.all(updates.images.map((img: string) => optimizeBase64Image(img)));
    }

    // Build standard MySQL update columns
    const cleanUpdates: any = {};
    const keys = Object.keys(updates);
    
    for (const key of keys) {
      if (key === 'images') {
        cleanUpdates.images = JSON.stringify(updates.images);
      } else if (key === 'attributes') {
        cleanUpdates.attributes = JSON.stringify(updates.attributes);
      } else if (key === 'seo') {
        if (updates.seo.h1 !== undefined) cleanUpdates.h1 = updates.seo.h1;
        if (updates.seo.metaTitle !== undefined) cleanUpdates.metaTitle = updates.seo.metaTitle;
        if (updates.seo.metaDescription !== undefined) cleanUpdates.metaDescription = updates.seo.metaDescription;
        if (updates.seo.altText !== undefined) cleanUpdates.altText = updates.seo.altText;
      } else {
        cleanUpdates[key] = updates[key];
      }
    }

    const cleanKeys = Object.keys(cleanUpdates);
    if (cleanKeys.length > 0) {
      const setClause = cleanKeys.map(k => `${k} = ?`).join(', ');
      const values = cleanKeys.map(k => cleanUpdates[k]);
      values.push(id);
      
      await pool.query(`UPDATE products SET ${setClause} WHERE id = ?`, values);
    }

    const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Product updated successfully', product: mapProduct(rows[0]) },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Product Update Error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Slug must be unique.' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products
 */
export async function DELETE(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await pool.query('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Product Deletion Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
