import React from 'react';
import { Metadata } from 'next';
import { 
  renderTextileCategoryPage, 
  fetchCategoryHeaderData, 
  fetchSeoContentData 
} from './render';

// CRITICAL: Enable Incremental Static Regeneration (ISR)
export const revalidate = 60; 

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const slug = params?.slug || '';
  const category = await fetchCategoryHeaderData(slug);
  const { seoContent } = await fetchSeoContentData(category._id ? category._id.toString() : "0");

  const title = seoContent?.metaTitle || `${category.name || slug.toUpperCase()} Collection | Babulal Premkumar`;
  const description = seoContent?.metaDescription || `Explore wholesale ${category.name || slug} at Babulal Premkumar. Regional distribution in Ranchi, Jharkhand.`;
  const canonical = seoContent?.canonicalUrl || `https://www.babulalpremsons.com/${slug}`;
  const isNoIndex = seoContent?.robotsIndex === 'noindex';
  const isNoFollow = seoContent?.robotsFollow === 'nofollow';

  return {
    title,
    description,
    alternates: {
      canonical
    },
    robots: {
      index: !isNoIndex,
      follow: !isNoFollow
    },
    openGraph: {
      title,
      description,
      url: canonical
    }
  };
}

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params?.slug;

  if (!slug) return <div className="pt-40 text-center">Invalid Segment</div>;

  return renderTextileCategoryPage(slug);
}
