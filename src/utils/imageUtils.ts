/**
 * Image resolution and error-handling utilities for production and preview builds.
 */

// Elegant inline SVG fallback for food items
export const FOOD_FALLBACK_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="none">
  <rect width="400" height="300" fill="#292524" />
  <circle cx="200" cy="130" r="70" fill="#44403c" stroke="#d97706" stroke-width="2" stroke-dasharray="4 4" />
  <circle cx="200" cy="130" r="50" fill="#78350f" opacity="0.4" />
  <path d="M180 120 C180 100, 220 100, 220 120 C220 140, 180 140, 180 120" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M185 135 C190 145, 210 145, 215 135" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M190 105 Q200 95 200 85 Q200 95 210 105" stroke="#10b981" stroke-width="2" fill="none"/>
  <text x="200" y="235" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#fef3c7" text-anchor="middle" letter-spacing="1">AMOK &amp; BASIL</text>
  <text x="200" y="255" font-family="system-ui, sans-serif" font-size="11" font-weight="500" fill="#a8a29e" text-anchor="middle">Gourmet Culinary Selection</text>
</svg>
`)}`;

/**
 * Resolves any image URL to ensure compatibility across:
 * - Local AI Studio Vite development preview
 * - Production builds published to custom domains (e.g. restaurantapp.ai.studio)
 * - Base URL subpaths if any
 */
export function resolveImageUrl(url?: string | null): string {
  if (!url) {
    return FOOD_FALLBACK_SVG;
  }

  // Already a remote CDN or data URL
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }

  // Clean up legacy preview-only /src/assets/images paths
  let cleanPath = url;
  if (cleanPath.startsWith('/src/assets/images/')) {
    cleanPath = cleanPath.replace('/src/assets/images/', '/assets/images/');
  } else if (cleanPath.startsWith('src/assets/images/')) {
    cleanPath = cleanPath.replace('src/assets/images/', '/assets/images/');
  }

  // Remove leading slash for safe concatenation with BASE_URL
  const base = import.meta.env.BASE_URL || '/';
  if (cleanPath.startsWith('/')) {
    const withoutSlash = cleanPath.slice(1);
    return `${base}${withoutSlash}`.replace(/\/{2,}/g, '/');
  }

  return cleanPath;
}

/**
 * Image error handler that first attempts to fall back from /src/ to /assets/,
 * and then falls back to an elegant restaurant food SVG illustration.
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  customFallback?: string
) {
  const target = event.currentTarget;
  const currentSrc = target.src;

  // Prevent recursive error loops
  target.onerror = null;

  // If failed on a /src/ path, attempt to load from /assets/
  if (currentSrc.includes('/src/assets/images/')) {
    const updated = currentSrc.replace('/src/assets/images/', '/assets/images/');
    target.src = updated;
    return;
  }

  // Otherwise, use fallback SVG
  target.src = customFallback || FOOD_FALLBACK_SVG;
}
