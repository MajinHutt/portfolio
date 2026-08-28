/**
 * Asset resolution.
 *
 * Heavy binaries (.glb, .mp4, big renders) must NOT live in this repo: see
 * docs/ASSET-HOSTING.md. Every asset path in lib/projects.ts is relative; this
 * helper prefixes it with whatever CDN you've configured.
 *
 * Set NEXT_PUBLIC_ASSET_BASE_URL in .env.local and in Vercel's project settings.
 * Default host is GitHub + jsDelivr, which has no billing surface at all:
 *   https://cdn.jsdelivr.net/gh/<user>/<assets-repo>@main
 *
 * If a path is empty (asset not produced yet), asset() returns null and the UI
 * renders the empty near-black plate instead of a broken image.
 */
const BASE = (process.env.NEXT_PUBLIC_ASSET_BASE_URL ?? "").replace(/\/+$/, "");

export function asset(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path; // already absolute: use as-is
  if (path.startsWith("/")) return path; // local file in /public (small assets only)
  return BASE ? `${BASE}/${path}` : null;
}

export const assetsConfigured = BASE.length > 0;
