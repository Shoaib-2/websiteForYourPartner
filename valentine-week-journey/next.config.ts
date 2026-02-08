import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: 'export' to allow client components with dynamic routes
  // For deployment, we'll use a different approach
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
