import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  async redirects() {
    return [
      // Redirect all requests for PHP files (common hacker/vulnerability scans)
      // Redirecting to "/" instead of "/404" returns a 301 (Success) instead of 404 (Warning) in Firebase logs
      {
        source: "/:path*(.php)",
        destination: "/",
        permanent: true,
      },
      // Redirect common CMS/admin probe paths
      {
        source: "/wp-admin/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/enhancecp",
        destination: "/",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        // Apply caching headers to reduce repeated bot requests hitting the serverless backend
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
      {
        // Add strong caching for the traffic-advice endpoint so Chrome doesn't continuously ping the backend
        source: "/.well-known/traffic-advice",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;