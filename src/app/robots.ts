import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/auth/', '/welcome/feedback/', '/welcome-chas/feedback/'],
      },
    ],
    sitemap: 'https://babulalpremkumar.com/sitemap.xml',
  };
}
