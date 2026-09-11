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
      },
      {
        source: '/kn/category/current-affairs',
        destination: '/kn/exams',
        permanent: true,
      },
      {
        source: '/en/category/current-affairs',
        destination: '/en/exams',
        permanent: true,
      },
      {
        source: '/category/current-affairs',
        destination: '/kn/exams',
        permanent: true,
      },
      {
        source: '/images/karnataka_police_news.png',
        destination: '/images/karnataka_police_news.webp',
        permanent: true,
      },
      {
        source: '/images/iss_space_station.jpg',
        destination: '/images/iss_space_station.webp',
        permanent: true,
      },
      {
        source: '/images/bengaluru_mba_colleges.jpg',
        destination: '/images/bengaluru_mba_colleges.webp',
        permanent: true,
      },
      {
        source: '/images/programming_languages_2026.jpg',
        destination: '/images/programming_languages_2026.webp',
        permanent: true,
      },
      {
        source: '/images/karnataka_police_recruitment.jpg',
        destination: '/images/karnataka_police_recruitment.webp',
        permanent: true,
      }
    ];
  },
};

export default nextConfig;