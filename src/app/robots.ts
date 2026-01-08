import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/settings/', '/analytics/'],
    },
    sitemap: 'https://poplift.vercel.app/sitemap.xml',
  };
}




