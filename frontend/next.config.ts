import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/pdf/:path*',
        destination: 'http://localhost:5000/api/pdf/:path*',
      },
    ];
  },
};

export default nextConfig;
