/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion', 'motion/react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/collections/all',
        permanent: true,
      },
      {
        source: '/jeans',
        destination: '/collections/all',
        permanent: true,
      },
      {
        source: '/jeans/:category',
        destination: '/collections/:category',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
