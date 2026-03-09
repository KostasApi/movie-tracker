import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true, // Next.js 16 explicit caching model
  reactCompiler: true, // Stable in Next.js 16 — auto memoization

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
};

export default nextConfig;
