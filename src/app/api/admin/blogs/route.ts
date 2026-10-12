import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import pool, { initDb } from '@/lib/db';
import { optimizeBase64Image } from '@/lib/image-utils';
import { generateUniqueSlug } from '@/lib/slug';

function mapAdminBlog(row: any) {
  let parsedTags: string[] = [];
  try {
    if (row.tags) {
      parsedTags = typeof row.tags === 'string' && row.tags.startsWith('[')
        ? JSON.parse(row.tags)
        : String(row.tags).split(',').map((t: string) => t.trim()).filter(Boolean);
    }
  } catch {
    parsedTags = [];
  }

  return {
    id: row.id,
    _id: row.id.toString(),
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle || '',
    excerpt: row.excerpt || '',
    content: row.content || '',
    featuredImage: row.featuredImage || null,
    imageAlt: row.imageAlt || '',
    author: row.author || 'Babulal Premsons Editorial',
    authorRole: row.authorRole || 'Fashion & Textile Specialist',
    category: row.category || 'Fashion & Trends',
    tags: parsedTags,
    status: row.status || 'Draft',
    isFeatured: !!row.isFeatured,
    readTime: row.readTime || '5 min read',
    metaTitle: row.metaTitle || '',
    metaDescription: row.metaDescription || '',
    canonicalUrl: row.canonicalUrl || '',
    publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

/**
 * Check if the request is from an authenticated admin session
 */
async function checkAuth(req: Request) {
  const token = await getToken({ 
    req: req as any, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // In development, if no token is present, allow or check header
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  return !!token;
}

/**
 * GET /api/admin/blogs
 * Fetch blogs list with search/filter or single blog by ?id=...
 */
export async function GET(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    // Fetch single blog by ID
    if (id) {
      const [rows]: any = await pool.query('SELECT * FROM blogs WHERE id = ? LIMIT 1', [Number(id)]);
      if (rows.length === 0) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      return NextResponse.json(mapAdminBlog(rows[0]), { status: 200 });
    }

    // Dynamic query building
    let whereClauses: string[] = [];
    const params: any[] = [];

    if (status && status !== 'ALL') {
      whereClauses.push('status = ?');
      params.push(status);
    }

    if (category && category !== 'ALL') {
      whereClauses.push('LOWER(category) = ?');
      params.push(category.toLowerCase());
    }

    if (search) {
      whereClauses.push('(LOWER(title) LIKE ? OR LOWER(author) LIKE ? OR LOWER(slug) LIKE ?)');
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term);
    }

    let sql = 'SELECT * FROM blogs';
    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }
    sql += ' ORDER BY isFeatured DESC, COALESCE(publishedAt, createdAt) DESC';

    const [rows]: any = await pool.query(sql, params);
    return NextResponse.json(rows.map(mapAdminBlog), { status: 200 });
  } catch (error: any) {
    console.error('Admin Blogs GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs', details: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/blogs
 * Create a new blog article
 */
export async function POST(req: Request) {
  try {
    const isAuthorized = await checkAuth(req);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await initDb();
    const data = await req.json();

    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Auto-generate unique slug
    const finalSlug = await generateUniqueSlug('blogs', data.title, undefined, data.slug);

    // Optimize featured image if base64
    let optimizedImage = data.featuredImage || null;
    if (optimizedImage && optimizedImage.startsWith('data:image')) {
      optimizedImage = await optimizeBase64Image(optimizedImage, 1200, 800);
    }

    // Process tags
    let tagsJson = null;
    if (Array.isArray(data.tags)) {
      tagsJson = JSON.stringify(data.tags);
    } else if (typeof data.tags === 'string' && data.tags.trim()) {
      tagsJson = JSON.stringify(data.tags.split(',').map((t: string) => t.trim()).filter(Boolean));
    }

    const status = data.status || 'Draft';
    const publishedAt = status === 'Published' 
      ? (data.publishedAt ? new Date(data.publishedAt) : new Date()) 
      : null;

    const [result]: any = await pool.query(
      `INSERT INTO blogs (
        title, slug, subtitle, excerpt, content, featuredImage, imageAlt,
        author, authorRole, category, tags, status, isFeatured, readTime,
        metaTitle, metaDescription, canonicalUrl, publishedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.title.trim(),
        finalSlug,
        data.subtitle || null,
        data.excerpt || null,
        data.content,
        optimizedImage,
        data.imageAlt || data.title.trim(),
        data.author || 'Babulal Premsons Editorial',
        data.authorRole || 'Fashion & Textile Specialist',
        data.category || 'Fashion & Trends',
        tagsJson,
        status,
        !!data.isFeatured,
        data.readTime || '5 min read',
        data.metaTitle || data.title.trim(),
        data.metaDescription || data.excerpt || null,
        data.canonicalUrl || `https://babulalpremsons.com/blog/${finalSlug}`,
        publishedAt
      ]
    );

    const [created]: any = await pool.query('SELECT * FROM blogs WHERE id = ? LIMIT 1', [result.insertId]);
    return NextResponse.json(mapAdminBlog(created[0]), { status: 201 });
  } catch (error: any) {
    console.error('Admin Blogs POST Error:', error);
    return NextResponse.json({ error: 'Failed to create blog post', details: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/blogs
 * Update an existing blog article
 */
export async function PUT(req: Request) {
  try {
    const isAuthorized = await checkAuth(req);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await initDb();
    const data = await req.json();

    const id = data.id || data._id;
    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required for update' }, { status: 400 });
    }

    const [existing]: any = await pool.query('SELECT * FROM blogs WHERE id = ? LIMIT 1', [Number(id)]);
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Blog article not found' }, { status: 404 });
    }

    // Ensure unique slug if slug or title changed
    let finalSlug = existing[0].slug;
    if (data.slug || data.title) {
      finalSlug = await generateUniqueSlug('blogs', data.title || existing[0].title, Number(id), data.slug);
    }

    // Optimize image if new base64 image provided
    let optimizedImage = data.featuredImage !== undefined ? data.featuredImage : existing[0].featuredImage;
    if (optimizedImage && optimizedImage.startsWith('data:image')) {
      optimizedImage = await optimizeBase64Image(optimizedImage, 1200, 800);
    }

    // Process tags
    let tagsJson = existing[0].tags;
    if (data.tags !== undefined) {
      if (Array.isArray(data.tags)) {
        tagsJson = JSON.stringify(data.tags);
      } else if (typeof data.tags === 'string') {
        tagsJson = JSON.stringify(data.tags.split(',').map((t: string) => t.trim()).filter(Boolean));
      } else {
        tagsJson = null;
      }
    }

    const status = data.status || existing[0].status;
    let publishedAt = existing[0].publishedAt;
    if (status === 'Published' && !publishedAt) {
      publishedAt = new Date();
    } else if (data.publishedAt !== undefined) {
      publishedAt = data.publishedAt ? new Date(data.publishedAt) : null;
    }

    await pool.query(
      `UPDATE blogs SET
        title = ?,
        slug = ?,
        subtitle = ?,
        excerpt = ?,
        content = ?,
        featuredImage = ?,
        imageAlt = ?,
        author = ?,
        authorRole = ?,
        category = ?,
        tags = ?,
        status = ?,
        isFeatured = ?,
        readTime = ?,
        metaTitle = ?,
        metaDescription = ?,
        canonicalUrl = ?,
        publishedAt = ?
      WHERE id = ?`,
      [
        data.title !== undefined ? data.title.trim() : existing[0].title,
        finalSlug,
        data.subtitle !== undefined ? data.subtitle : existing[0].subtitle,
        data.excerpt !== undefined ? data.excerpt : existing[0].excerpt,
        data.content !== undefined ? data.content : existing[0].content,
        optimizedImage,
        data.imageAlt !== undefined ? data.imageAlt : existing[0].imageAlt,
        data.author !== undefined ? data.author : existing[0].author,
        data.authorRole !== undefined ? data.authorRole : existing[0].authorRole,
        data.category !== undefined ? data.category : existing[0].category,
        tagsJson,
        status,
        data.isFeatured !== undefined ? !!data.isFeatured : !!existing[0].isFeatured,
        data.readTime !== undefined ? data.readTime : existing[0].readTime,
        data.metaTitle !== undefined ? data.metaTitle : existing[0].metaTitle,
        data.metaDescription !== undefined ? data.metaDescription : existing[0].metaDescription,
        data.canonicalUrl !== undefined ? data.canonicalUrl : existing[0].canonicalUrl,
        publishedAt,
        Number(id)
      ]
    );

    const [updated]: any = await pool.query('SELECT * FROM blogs WHERE id = ? LIMIT 1', [Number(id)]);
    return NextResponse.json(mapAdminBlog(updated[0]), { status: 200 });
  } catch (error: any) {
    console.error('Admin Blogs PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update blog post', details: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/blogs
 * Delete a blog article
 */
export async function DELETE(req: Request) {
  try {
    const isAuthorized = await checkAuth(req);
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    await initDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog ID is required for deletion' }, { status: 400 });
    }

    const [result]: any = await pool.query('DELETE FROM blogs WHERE id = ?', [Number(id)]);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Blog article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Article deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Admin Blogs DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post', details: error.message }, { status: 500 });
  }
}
