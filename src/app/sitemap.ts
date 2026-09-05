import { MetadataRoute } from 'next';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function fetchProducts() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?is_active=eq.true&select=slug,updated_at`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );
    
    if (!response.ok) {
      console.error('Failed to fetch products for sitemap:', response.statusText);
      return [];
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://varietyvista.com';
  
  // Static routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/faq',
    '/size-guide',
    '/policies',
    '/collections',
    '/collections/women',
    '/collections/men',
    '/collections/new-arrivals',
    '/collections/sale'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    const products = await fetchProducts();
    
    const productRoutes = (products || []).map((product: { slug: string; updated_at: string }) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}