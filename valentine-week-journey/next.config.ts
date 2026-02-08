import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = '/websiteForYourPartner';
const basePath = isProd ? repoName : '';

const nextConfig: NextConfig = {
  // Configure for static export only in production
  output: isProd ? 'export' : undefined,
  // Disable image optimization for static export (always safer for GitHub Pages)
  images: {
    unoptimized: true,
  },
  // Set base path conditional
  basePath: basePath,
  // Ensure trailing slash for GitHub Pages
  trailingSlash: true,
  // Configure asset prefix conditional
  assetPrefix: basePath,
  // Expose base path to client
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
