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
  let isIndex = false;
  let isFollow = true;

  if (seoContent) {
    if (seoContent.robotsIndex === 'noindex' || seoContent.robotsIndex === false || seoContent.robotsIndex === 0) {
      isIndex = false;
    } else if (seoContent.robotsIndex === 'index' || seoContent.robotsIndex === true || seoContent.robotsIndex === 1) {
      isIndex = true;
    }
    if (seoContent.robotsFollow === 'nofollow' || seoContent.robotsFollow === false || seoContent.robotsFollow === 0) {
      isFollow = false;
    } else if (seoContent.robotsFollow === 'follow' || seoContent.robotsFollow === true || seoContent.robotsFollow === 1) {
      isFollow = true;
    }
  } else if (category) {
    isIndex = category.robotsIndex !== undefined && category.robotsIndex !== null ? !!category.robotsIndex : false;
    isFollow = category.robotsFollow !== undefined && category.robotsFollow !== null ? !!category.robotsFollow : true;
  }

  return {
    title,
    description,
    alternates: {
      canonical
    },
    robots: {
      index: isIndex,
      follow: isFollow
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
