import React from 'react';
import Link from 'next/link';
import pool, { initDb } from '@/lib/db';
import { Globe, ArrowRight, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export const revalidate = 0;

export default async function CategoryContentIndexPage() {
  await initDb();

  // Fetch all categories with their parent vertical
  const [categories]: any = await pool.query(
    "SELECT id, name, slug, parentVertical, status FROM categories WHERE status = 'Active' ORDER BY parentVertical ASC, orderIndex ASC"
  );

  // Fetch all published/draft category seo contents
  const [seoRows]: any = await pool.query(
    "SELECT categoryId, h1, metaTitle, status FROM category_seo_content WHERE categoryId IS NOT NULL"
  );

  const seoMap = new Map<number, any>();
  seoRows.forEach((row: any) => {
    seoMap.set(row.categoryId, row);
  });

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-3xl shadow-sm border border-[#d1d9e6]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-purple-100 text-purple-700 flex items-center gap-1">
              <Globe className="w-3 h-3" /> SEO &amp; Content Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#1a2b4b] uppercase tracking-tight italic italic-accent">
            Category Page Headings &amp; SEO
          </h1>
          <p className="text-xs text-[#1a2b4b]/60 font-medium mt-1">
            Manage public page headings (H1), meta titles, descriptions, and rich content across all business verticals.
          </p>
        </div>
        <Link
          href="/admin/categories"
          className="self-start md:self-auto px-5 py-3 rounded-2xl bg-[#f8fafc] border border-[#d1d9e6] text-[#095181] hover:bg-[#095181] hover:text-white transition-all text-xs font-black uppercase tracking-wider flex items-center gap-2"
        >
          <Layers className="w-4 h-4" /> Manage All Categories
        </Link>
      </div>

      {/* CATEGORIES TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-[#d1d9e6] overflow-hidden">
        <div className="p-6 border-b border-[#f0f3f8] flex items-center justify-between">
          <h2 className="text-sm font-black text-[#1a2b4b] uppercase tracking-wider">
            Active Categories ({categories.length})
          </h2>
          <span className="text-[10px] font-bold text-[#1a2b4b]/40 uppercase tracking-widest">
            Select a category to customize its Category Page Heading (H1)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8fafc] text-[9px] font-black uppercase tracking-[0.2em] text-[#1a2b4b]/40 border-b border-[#f0f3f8]">
              <tr>
                <th className="py-4 px-6">Category Name</th>
                <th className="py-4 px-6">Business Vertical</th>
                <th className="py-4 px-6">Category Page Heading (H1)</th>
                <th className="py-4 px-6">SEO Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3f8] text-xs font-bold text-[#1a2b4b]">
              {categories.map((cat: any) => {
                const seo = seoMap.get(cat.id);
                const currentH1 = seo?.h1?.trim() || `TOP ${cat.name.toUpperCase()} IN RANCHI (Default)`;
                const isCustom = Boolean(seo?.h1?.trim());

                return (
                  <tr key={cat.id} className="hover:bg-[#f8fafc]/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-black text-sm text-[#095181]">{cat.name}</div>
                      <div className="text-[10px] font-medium text-gray-400">/{cat.slug}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-700">
                        {cat.parentVertical || 'textiles'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={isCustom ? "font-black text-[#1a2b4b]" : "font-medium text-gray-400 italic"}>
                          {currentH1}
                        </span>
                        {isCustom && (
                          <span className="text-[8px] font-black uppercase tracking-wider bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                            Custom H1
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {seo ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <CheckCircle2 className="w-3 h-3 text-green-600" /> {seo.status || 'Published'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          <AlertCircle className="w-3 h-3 text-gray-400" /> Default SEO
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/admin/category-content/cat-${cat.id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-[#095181] hover:bg-[#DA222A] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm"
                      >
                        Edit Heading &amp; SEO <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
