import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/en/jobs',
        destination: '/en/category/jobs',
        permanent: true,
      },
      {
        source: '/kn/jobs',
        destination: '/kn/category/jobs',
        permanent: true,
      },
      {
        source: '/jobs',
        destination: '/kn/category/jobs',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;