import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/_next', '/.well-known'],
      },
    ],
    sitemap: 'https://clock-tani.com/sitemap.xml',
  };
}
