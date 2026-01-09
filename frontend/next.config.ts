import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Bypass image optimization for localhost development
  },
};

export default nextConfig;
