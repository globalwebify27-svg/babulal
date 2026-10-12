import pool, { initDb } from './db';

export interface BlogPost {
  id: number;
  _id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  imageAlt?: string | null;
  author: string;
  authorRole?: string | null;
  category: string;
  tags: string[];
  status: 'Published' | 'Draft' | 'Archived';
  isFeatured: boolean;
  readTime: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapBlogRow(row: any): BlogPost {
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
    subtitle: row.subtitle || null,
    excerpt: row.excerpt || null,
    content: row.content,
    featuredImage: row.featuredImage || null,
    imageAlt: row.imageAlt || row.title,
    author: row.author || 'Babulal Premsons Editorial',
    authorRole: row.authorRole || 'Fashion & Textile Specialist',
    category: row.category || 'Fashion & Trends',
    tags: parsedTags,
    status: row.status,
    isFeatured: !!row.isFeatured,
    readTime: row.readTime || '5 min read',
    metaTitle: row.metaTitle || null,
    metaDescription: row.metaDescription || null,
    canonicalUrl: row.canonicalUrl || null,
    publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : null,
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : new Date().toISOString()
  };
}

/**
 * Fetch published blogs for the public frontend
 */
export async function getPublishedBlogs(options?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ blogs: BlogPost[]; total: number; totalPages: number }> {
  await initDb();

  const page = Math.max(1, options?.page || 1);
  const limit = Math.max(1, options?.limit || 12);
  const offset = (page - 1) * limit;

  let whereClauses = ["status = 'Published'"];
  const params: any[] = [];

  if (options?.category && options.category.toLowerCase() !== 'all') {
    whereClauses.push("LOWER(category) = ?");
    params.push(options.category.toLowerCase());
  }

  if (options?.search) {
    whereClauses.push("(LOWER(title) LIKE ? OR LOWER(excerpt) LIKE ? OR LOWER(tags) LIKE ?)");
    const searchTerm = `%${options.search.toLowerCase()}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  const whereSql = whereClauses.join(" AND ");

  const [countRows]: any = await pool.query(
    `SELECT COUNT(*) as count FROM blogs WHERE ${whereSql}`,
    params
  );
  const total = countRows[0]?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const [rows]: any = await pool.query(
    `SELECT * FROM blogs WHERE ${whereSql} ORDER BY isFeatured DESC, COALESCE(publishedAt, createdAt) DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  return {
    blogs: rows.map(mapBlogRow),
    total,
    totalPages
  };
}

/**
 * Fetch a single published blog by slug
 */
export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  await initDb();
  const [rows]: any = await pool.query(
    "SELECT * FROM blogs WHERE LOWER(slug) = ? AND status = 'Published' LIMIT 1",
    [slug.toLowerCase()]
  );

  if (rows.length === 0) return null;
  return mapBlogRow(rows[0]);
}

/**
 * Fetch related published blogs
 */
export async function getRelatedBlogs(currentSlug: string, category: string, limit = 3): Promise<BlogPost[]> {
  await initDb();
  const [rows]: any = await pool.query(
    `SELECT * FROM blogs 
     WHERE status = 'Published' AND LOWER(slug) != ? 
     ORDER BY (LOWER(category) = ?) DESC, COALESCE(publishedAt, createdAt) DESC 
     LIMIT ?`,
    [currentSlug.toLowerCase(), category.toLowerCase(), limit]
  );

  return rows.map(mapBlogRow);
}

/**
 * Fetch all categories used across published blogs
 */
export async function getBlogCategories(): Promise<string[]> {
  await initDb();
  const [rows]: any = await pool.query(
    "SELECT DISTINCT category FROM blogs WHERE status = 'Published' AND category IS NOT NULL AND category != ''"
  );
  return rows.map((r: any) => r.category);
}
