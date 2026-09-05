import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://varietyvista.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/admin/', '/checkout/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
