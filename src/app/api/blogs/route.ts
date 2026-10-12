import { NextResponse } from 'next/server';
import { getPublishedBlogs, getBlogBySlug, getBlogCategories } from '@/lib/blogs';

/**
 * GET /api/blogs
 * Public API for published blog posts only
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const categoriesOnly = searchParams.get('categoriesOnly') === 'true';

    // If requested only categories
    if (categoriesOnly) {
      const categories = await getBlogCategories();
      return NextResponse.json({ categories }, { status: 200 });
    }

    // If specific slug is requested
    if (slug) {
      const blog = await getBlogBySlug(slug);
      if (!blog) {
        return NextResponse.json({ error: 'Article not found or not published' }, { status: 404 });
      }
      return NextResponse.json({ blog }, { status: 200 });
    }

    // List published blogs
    const result = await getPublishedBlogs({
      category: category || undefined,
      search: search || undefined,
      page,
      limit
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Public Blog API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching blogs' },
      { status: 500 }
    );
  }
}
