import React from 'react';
import pool, { initDb } from '@/lib/db';
import FeedbackClient from './FeedbackClient';

export const revalidate = 60; // Cache for 60 seconds

async function fetchWelcomePageData() {
  await initDb();
  const [rows]: any = await pool.query(
    'SELECT * FROM welcome_page_settings ORDER BY id ASC LIMIT 1'
  );
  
  if (rows.length === 0) {
    return {
      welcomeTitle: 'Welcome to Babulal Premkumar',
      welcomeMessage: 'Thank you for visiting us. We are delighted to have you as our valued customer.',
      introTitle: 'Our Legacy',
      introContent: 'With a legacy of over 100 years, Babulal Premsons Group is a household name in Ranchi, Jharkhand, trusted by generations for premium quality textiles, automobiles, and more.',
      videoUrl: 'https://youtube.com/shorts/pw3yuTPf31c?si=9Gtn467sTS5lUlBP',
      videoTitle: 'Experience Babulal Premkumar: Your Shopping Guide',
      feedbackUrl: 'https://search.google.com/local/writereview?placeid=ChIJKeSLvTvh9DkRDa7qU5BsWoc',
      contactPhone: '+91 651 220 7555',
      contactEmail: 'Group@babulalpremsons.com',
      address: 'Main Road, Ranchi, Jharkhand - 834001',
      googleMapsUrl: 'https://maps.app.goo.gl/Fu9u9U9UQVj8zYZVA',
      whatsappNumber: '+91 651 220 7555'
    };
  }
  
  return rows[0];
}

export default async function FeedbackPage() {
  const data = await fetchWelcomePageData();

  return <FeedbackClient data={data} />;
}
