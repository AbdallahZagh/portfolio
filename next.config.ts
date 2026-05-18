import type { NextConfig } from "next";

// Repository name - CHANGE THIS to match your GitHub repository name
// If your repo is "username.github.io", use "" (empty string)
const repoName = "portfolio"; // Change this to your repo name

const isProduction = process.env.NODE_ENV === "production";

const publicBasePath = isProduction && repoName ? `/${repoName}` : "";

const nextConfig: NextConfig = {
  // Enable static export for production builds (GitHub Pages)
  ...(isProduction ? { output: "export" as const } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: publicBasePath,
  },
  images: {
    unoptimized: true, // Required for static export
  },
  // Base path for GitHub Pages (only in production)
  // Leave empty if deploying to username.github.io (root domain)
  basePath: publicBasePath,
  // Asset prefix for GitHub Pages (only in production)
  assetPrefix: publicBasePath,
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: true,
};

export default nextConfig;
