import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import pool, { initDb } from '@/lib/db';
import { getBlogBySlug, getRelatedBlogs } from '@/lib/blogs';
import TextileHeader from '@/components/TextileHeader';
import Footer from '@/components/Footer';
import MobileBottomMenu from '@/components/MobileBottomMenu';
import CoverBreadcrumbs from '@/components/CoverBreadcrumbs';
import ShareButtons from './ShareButtons';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Tag, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const revalidate = 60;

const SITE_URL = 'https://babulalpremkumar.com';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: BlogPageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Article Not Found | Babulal Premsons',
      description: 'The requested blog article could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const title = blog.metaTitle || `${blog.title} | Babulal Premsons Journal`;
  const description = blog.metaDescription || blog.excerpt || 'Read this in-depth guide from Babulal Premsons.';
  let canonical = blog.canonicalUrl || `${SITE_URL}/blog/${blog.slug}`;
  if (canonical.includes('babulalpremsons.com')) {
    canonical = canonical.replace('babulalpremsons.com', 'babulalpremkumar.com');
  }
  const imageUrl = blog.featuredImage?.startsWith('http')
    ? blog.featuredImage
    : `${SITE_URL}${blog.featuredImage || '/silk_saree_royal.png'}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Babulal Premkumar',
      type: 'article',
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author],
      tags: blog.tags,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.imageAlt || blog.title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Fetch categories for the TextileHeader navigation
 */
async function fetchHeaderCategories() {
  await initDb();
  const [
    [categoriesRows],
    [subCategoriesRows],
    [subSubCategoriesRows]
  ]: any[] = await Promise.all([
    pool.query(
      "SELECT id, name, slug, image, cardImage, showInHeader, orderIndex FROM categories WHERE LOWER(parentVertical) = 'textiles' AND status = 'Active' ORDER BY orderIndex ASC"
    ),
    pool.query(
      "SELECT id, name, slug, categoryId, orderIndex FROM sub_categories WHERE status = 'Active' ORDER BY orderIndex ASC"
    ),
    pool.query(
      "SELECT id, name, slug, subCategoryId, orderIndex FROM sub_sub_categories WHERE status = 'Active' ORDER BY orderIndex ASC"
    )
  ]);

  const subSubCategories = subSubCategoriesRows.map((ss: any) => ({
    ...ss,
    _id: ss.id.toString(),
    subCategoryId: ss.subCategoryId.toString()
  }));

  const subCategories = subCategoriesRows.map((sub: any) => {
    const subIdStr = sub.id.toString();
    return {
      ...sub,
      _id: subIdStr,
      categoryId: sub.categoryId.toString(),
      subSubCategories: subSubCategories.filter((ss: any) => ss.subCategoryId === subIdStr)
    };
  });

  return categoriesRows.map((cat: any) => {
    const catIdStr = cat.id.toString();
    return {
      ...cat,
      _id: catIdStr,
      showInHeader: !!cat.showInHeader,
      subcategories: subCategories.filter((sub: any) => sub.categoryId === catIdStr)
    };
  });
}

export default async function BlogPostPage(props: BlogPageProps) {
  const { slug } = await props.params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const [headerCategories, relatedBlogs] = await Promise.all([
    fetchHeaderCategories(),
    getRelatedBlogs(blog.slug, blog.category, 3)
  ]);

  let canonicalUrl = blog.canonicalUrl || `${SITE_URL}/blog/${blog.slug}`;
  if (canonicalUrl.includes('babulalpremsons.com')) {
    canonicalUrl = canonicalUrl.replace('babulalpremsons.com', 'babulalpremkumar.com');
  }
  const imageUrl = blog.featuredImage?.startsWith('http')
    ? blog.featuredImage
    : `${SITE_URL}${blog.featuredImage || '/silk_saree_royal.png'}`;

  // Structured Data (JSON-LD) for BlogPosting
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: [imageUrl],
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Person',
      name: blog.author,
      jobTitle: blog.authorRole || 'Fashion & Textile Specialist'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Babulal Premsons Group',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/BabulalPremkumar.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    keywords: blog.tags.join(', ')
  };

  return (
    <div className="bg-white min-h-screen pt-24 lg:pt-[130px] pb-20 md:pb-0">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Website Header with BLOG active */}
      <TextileHeader categories={headerCategories.filter((c: any) => c.showInHeader)} />

      {/* ═══ ARTICLE HERO HEADER ═══ */}
      <article>
        <header className="relative bg-[#0A5181] text-white py-12 lg:py-16 overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(218,34,42,0.25),_transparent_50%)] pointer-events-none" />

          <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
            {/* Breadcrumb Navigation */}
            <CoverBreadcrumbs
              items={[
                { label: 'Home', url: '/' },
                { label: 'Blog', url: '/blog' },
                { label: blog.title }
              ]}
              className="mb-8"
            />

            {/* Back to Blog button */}
            <div className="mb-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/80 hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to All Articles
              </Link>
            </div>

            {/* Category & Read Time */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="bg-[#DA222A] text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-lg">
                {blog.category}
              </span>
              <span className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FFD700]" /> {blog.readTime}
              </span>
              <span className="text-white/40">•</span>
              <span className="text-white/60 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white/70" />
                {blog.publishedAt 
                  ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                  : new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.08] mb-6 drop-shadow-sm">
              {blog.title}
            </h1>

            {blog.subtitle && (
              <p className="text-lg sm:text-xl font-medium text-white/90 italic leading-relaxed max-w-3xl mb-8">
                {blog.subtitle}
              </p>
            )}

            {/* Author Byline */}
            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center font-black text-sm">
                {blog.author ? blog.author[0] : 'B'}
              </div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-wider">{blog.author}</h4>
                <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest">{blog.authorRole || 'Editorial Specialist'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ═══ ARTICLE BODY CONTENT ═══ */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content Column */}
            <div className="lg:col-span-8">
              
              {/* Featured Image */}
              {blog.featuredImage && (
                <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-gray-100 mb-10 shadow-xl border border-gray-100">
                  <Image
                    src={blog.featuredImage}
                    alt={blog.imageAlt || blog.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Excerpt Lead Box */}
              {blog.excerpt && (
                <div className="bg-gray-50 border-l-4 border-[#DA222A] p-6 sm:p-8 rounded-r-2xl mb-10 shadow-sm">
                  <p className="text-gray-700 text-base sm:text-lg font-medium italic leading-relaxed">
                    &ldquo;{blog.excerpt}&rdquo;
                  </p>
                </div>
              )}

              {/* Article Rich Content */}
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-black [&>h2]:text-[#0A5181] [&>h2]:tracking-tight [&>h2]:mt-10 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-black [&>h3]:text-[#DA222A] [&>h3]:tracking-tight [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:text-base [&>p]:leading-relaxed [&>p]:text-gray-700 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>blockquote]:border-l-4 [&>blockquote]:border-[#0A5181] [&>blockquote]:pl-6 [&>blockquote]:italic [&>blockquote]:text-gray-600">
                {blog.content.includes('<') ? (
                  <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                ) : (
                  blog.content.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                )}
              </div>

              {/* Tags Section */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap items-center gap-2">
                  <span className="text-gray-400 text-xs font-black uppercase tracking-wider mr-2 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#DA222A]" /> Topics:
                  </span>
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <ShareButtons title={blog.title} url={canonicalUrl} />
              </div>

              {/* Author Bio Box */}
              <div className="mt-12 p-8 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-[#0A5181] text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                  {blog.author ? blog.author[0] : 'B'}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-[#DA222A] tracking-widest mb-1">About The Author</div>
                  <h4 className="text-lg font-black text-[#0A5181] uppercase tracking-tight mb-2">{blog.author}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed font-normal">
                    Contributing fashion and textile curator at Babulal Premsons Group. Dedicated to documenting over a century of Eastern India&apos;s weaving traditions, ethnic fashion evolution, and garment craftsmanship.
                  </p>
                </div>
              </div>

            </div>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4 space-y-10">
              
              {/* Quick Inquiry Card */}
              <div className="bg-[#0A5181] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DA222A]/20 rounded-full blur-xl pointer-events-none" />
                <span className="text-[#FFD700] text-[9px] font-black uppercase tracking-[0.25em] block mb-2">Visit Ranchi Showroom</span>
                <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                  Experience The Collection In Person
                </h3>
                <p className="text-white/80 text-xs leading-relaxed mb-6">
                  Visit our flagship destination on Main Road, Ranchi for over 10,000+ curated Sarees, Lehengas, and Suiting fabrics with lowest fixed pricing 365 days a year.
                </p>
                <Link
                  href="/contact"
                  className="w-full py-3.5 bg-[#DA222A] text-white text-[11px] font-black uppercase tracking-widest rounded-md hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  Book Store Consultation <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Editorial Highlights Card */}
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                <h4 className="text-xs font-black uppercase text-[#0A5181] tracking-widest border-b border-gray-200 pb-3 mb-6 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#DA222A]" /> Key Takeaways
                </h4>
                <ul className="space-y-4">
                  {[
                    "Authentic handloom craftsmanship with certified direct sourcing",
                    "365 Days lowest transparent pricing without seasonal sales",
                    "Over 100+ Years & 5 generations of customer goodwill in Jharkhand"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-gray-700 font-medium leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#DA222A] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </aside>

          </div>
        </div>
      </article>

      {/* ═══ RELATED ARTICLES SECTION ═══ */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <section className="bg-gray-50/50 py-16 lg:py-24 border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <span className="text-[#DA222A] text-[10px] font-black uppercase tracking-[0.3em] block mb-2">Editorial Series</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0A5181] uppercase tracking-tight">
                  Related Stories & Guides
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-[#DA222A] text-xs font-black uppercase tracking-wider hover:underline flex items-center gap-1"
              >
                View All Stories <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    <Image
                      src={rel.featuredImage || '/silk_saree_royal.png'}
                      alt={rel.imageAlt || rel.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#0A5181] text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
                        {rel.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-gray-400 text-[9px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#DA222A]" /> {rel.readTime}
                      </div>
                      <h3 className="text-base font-black text-[#0A5181] tracking-tight group-hover:text-[#DA222A] transition-colors line-clamp-2 mb-3">
                        {rel.title}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                        {rel.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-[#DA222A] mt-6">
                      Read Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer & Mobile Menu */}
      <Footer />
      <MobileBottomMenu categories={headerCategories} />
    </div>
  );
}
