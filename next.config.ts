import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
    return [
      {
        source: "/api/proxy/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
