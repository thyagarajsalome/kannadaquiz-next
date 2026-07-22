import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      // Redirect all requests for PHP files (common hacker/vulnerability scans) to save serverless resources
      {
        source: "/:path*(.php)",
        destination: "/404",
        permanent: true,
      },
      // Redirect common CMS/admin probe paths
      {
        source: "/wp-admin/:path*",
        destination: "/404",
        permanent: true,
      },
      {
        source: "/enhancecp",
        destination: "/404",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
