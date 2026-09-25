import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import pool, { initDb } from '@/lib/db';
import { renderTextileCategoryPage } from '../textiles/category/[slug]/page';
import TextilesPage from '../textiles/page';
import HondaPage from '../honda/page';
import BajajPage from '../bajaj/page';
import TruckingPage from '../trucking/page';
import MuvaPage from '../muva-industries/page';

interface VerticalPageProps {
  params: Promise<{
    vertical: string;
  }>;
}

// Static routes that should not be handled dynamically by [vertical]
const STATIC_BYPASS_ROUTES = new Set([
  'about',
  'contact',
  'admin',
  'auth',
  'welcome',
  'welcome-chas',
  'api',
  'sitemap.xml',
  'robots.txt'
]);

export async function generateMetadata({ params }: VerticalPageProps): Promise<Metadata> {
  const { vertical: slug } = await params;
  const lowerSlug = slug.toLowerCase();

  if (STATIC_BYPASS_ROUTES.has(lowerSlug)) {
    return { title: 'Babulal Premsons Group' };
  }

  await initDb();
  const [rows]: any = await pool.query(
    'SELECT * FROM categories WHERE LOWER(slug) = ? LIMIT 1',
    [lowerSlug]
  );

  if (rows.length > 0) {
    const cat = rows[0];
    const canonicalUrl = `https://www.babulalpremsons.com/${cat.slug}`;
    return {
      title: `${cat.name} Collection | Babulal Premkumar`,
      description: `Explore our premium wholesale ${cat.name} collection at Babulal Premkumar (100+ Years Legacy in Ranchi, Jharkhand).`,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: `${cat.name} Collection | Babulal Premkumar`,
        description: `Explore our premium wholesale ${cat.name} collection at Babulal Premkumar.`,
        url: canonicalUrl,
      },
    };
  }

  return { title: 'Babulal Premsons Group' };
}

export default async function SingleSegmentRoute({ params }: VerticalPageProps) {
  const { vertical: slug } = await params;
  const lowerSlug = slug.toLowerCase();

  if (STATIC_BYPASS_ROUTES.has(lowerSlug)) {
    notFound();
  }

  // Handle known vertical landing pages
  if (lowerSlug === 'textiles') {
    return <TextilesPage />;
  }
  if (lowerSlug === 'honda') {
    return <HondaPage />;
  }
  if (lowerSlug === 'bajaj') {
    return <BajajPage />;
  }
  if (lowerSlug === 'trucking') {
    return <TruckingPage />;
  }
  if (lowerSlug === 'muva-industries') {
    return <MuvaPage />;
  }

  // Look up Category by slug in MySQL
  await initDb();
  const [rows]: any = await pool.query(
    'SELECT * FROM categories WHERE LOWER(slug) = ? LIMIT 1',
    [lowerSlug]
  );

  if (rows.length === 0) {
    notFound();
  }

  const categoryObj = rows[0];

  // Delegate rendering directly to renderTextileCategoryPage for rich Textiles UI
  return renderTextileCategoryPage(categoryObj.slug);
}
