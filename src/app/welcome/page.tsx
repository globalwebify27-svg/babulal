import React from 'react';
import pool, { initDb } from '@/lib/db';
import WelcomeClient from './WelcomeClient';

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
      feedbackUrl: 'https://bit.ly/4ivIcvv',
      contactPhone: '+91 76679 85545',
      contactEmail: 'Group@babulalpremsons.com',
      address: 'Main Road, Ranchi, Jharkhand - 834001',
      googleMapsUrl: 'https://maps.app.goo.gl/Fu9u9U9UQVj8zYZVA',
      whatsappNumber: '+91 76679 85545'
    };
  }
  
  const data = rows[0];
  // Force update the review link as requested
  data.feedbackUrl = 'https://search.google.com/local/writereview?placeid=ChIJMx1ddL_h9DkRhhfXuckSoHM';
  // Force update video to use local MP4
  data.videoUrl = '/BLPK Roadmap.mp4';
  // Force update legacy text to use generic 100 years and correct brand name
  data.introContent = 'With a legacy of over 100 years, Babulal Premkumar is a household name in Ranchi, Jharkhand, trusted by generations for premium quality textiles, automobiles, and more.';
  // Force update contact numbers
  data.contactPhone = '+91 76679 85545';
  data.whatsappNumber = '+91 76679 85545';
  return data;
}

export default async function CustomerWelcomePage() {
  const data = await fetchWelcomePageData();

  return <WelcomeClient data={data} />;
}
