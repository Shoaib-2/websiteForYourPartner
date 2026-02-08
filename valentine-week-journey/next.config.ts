import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for static export
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Set base path for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/valentine-week-journey' : '',
  // Ensure trailing slash for GitHub Pages
  trailingSlash: true,
  // Configure asset prefix for GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '/valentine-week-journey' : '',
};

export default nextConfig;
