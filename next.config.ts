import type { NextConfig } from "next";

// Repository name - CHANGE THIS to match your GitHub repository name
// If your repo is "username.github.io", use "" (empty string)
const repoName = "portfolio"; // Change this to your repo name

const nextConfig: NextConfig = {
  output: "export", // Enable static export for GitHub Pages
  images: {
    unoptimized: true, // Required for static export
  },
  // Base path for GitHub Pages
  // Leave empty if deploying to username.github.io (root domain)
  basePath: repoName ? `/${repoName}` : "",
  // Asset prefix for GitHub Pages
  assetPrefix: repoName ? `/${repoName}` : "",
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: true,
};

export default nextConfig;
