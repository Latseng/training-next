import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://training-tracker.zeabur.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
