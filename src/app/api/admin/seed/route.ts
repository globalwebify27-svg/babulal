import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

const DUMMY_PRODUCTS = [
  {
    name: 'Royal Banarasi Silk Saree',
    slug: 'royal-banarasi-silk-saree',
    businessVertical: 'textiles',
    category: 'Saree',
    description: 'Exquisite hand-woven Banarasi silk saree with gold zari work.',
    images: JSON.stringify(['/silk_saree_royal.png']),
    attributes: JSON.stringify({
      fabric: 'Pure Silk',
      work: 'Zari',
      color: 'Crimson Red'
    }),
    h1: 'Royal Banarasi Silk Saree - Babulal Premkumar',
    metaTitle: 'Royal Banarasi Silk Saree - Babulal Premkumar',
    metaDescription: 'Buy luxury Banarasi silk sarees at wholesale prices.'
  },
  {
    name: 'Bridal Heavily Embroidered Lehenga',
    slug: 'bridal-embroidered-lehenga',
    businessVertical: 'textiles',
    category: 'Lehenga',
    description: 'Heavy designer lehenga for bridal wear with heritage motifs.',
    images: JSON.stringify(['/bridal_luxury.png']),
    attributes: JSON.stringify({
      fabric: 'Velvet',
      work: 'Hand Embroidery',
      color: 'Maroon'
    })
  },
  {
    name: 'Honda Activa 6G',
    slug: 'honda-activa-6g',
    businessVertical: 'honda',
    category: 'Scooters',
    description: 'The reliable legend, now with more features.',
    images: JSON.stringify(['/vertical_honda.png']),
    attributes: JSON.stringify({
      engine: '110cc',
      mileage: '50 kmpl',
      fuel: 'Petrol'
    })
  }
];

export async function GET(req: Request) {
  try {
    // 1. Initialize Tables if they don't exist
    await initDb();
    
    // 2. Seed Default Admin User
    const adminEmail = 'admin@premsons.com';
    const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [adminEmail]);
    
    let adminCreated = false;
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await pool.query(
        'INSERT INTO users (name, email, password, role, verticals) VALUES (?, ?, ?, ?, ?)',
        ['System Admin', adminEmail, hashedPassword, 'ADMIN', JSON.stringify(['textiles', 'honda'])]
      );
      adminCreated = true;
    }

    // 3. Seed Products (Clear existing to avoid duplicates)
    await pool.query('DELETE FROM products');
    
    for (const prod of DUMMY_PRODUCTS) {
      await pool.query(
        `INSERT INTO products (name, slug, businessVertical, category, description, images, attributes, h1, metaTitle, metaDescription, isFeatured, isActive)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          prod.name,
          prod.slug,
          prod.businessVertical,
          prod.category,
          prod.description || null,
          prod.images,
          prod.attributes || null,
          prod.h1 || null,
          prod.metaTitle || null,
          prod.metaDescription || null,
          true,
          true
        ]
      );
    }
    
    return NextResponse.json({ 
      message: 'MySQL Database seeded successfully!',
      productsCount: DUMMY_PRODUCTS.length,
      adminCreated,
      verticals: ['textiles', 'honda']
    });
  } catch (error: any) {
    console.error('Seed Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
