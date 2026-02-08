import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure for static export
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Set base path for GitHub Pages
  basePath: '/websiteForYourPartner',
  // Ensure trailing slash for GitHub Pages
  trailingSlash: true,
  // Configure asset prefix for GitHub Pages
  assetPrefix: '/websiteForYourPartner',
};

export default nextConfig;
