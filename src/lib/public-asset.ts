/**
 * Prefixes public/ URLs with NEXT_PUBLIC_BASE_PATH so assets work when the app is
 * served from a subpath (e.g. GitHub Pages with basePath /portfolio).
 */
export function publicAsset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
