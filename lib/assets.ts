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

/**
 * BUMP THIS WHENEVER YOU REPLACE A FILE THAT KEEPS ITS NAME.
 *
 * jsDelivr serves assets with `max-age=604800`, so a browser holds a copy for a
 * week. Replacing a file at the same URL therefore does nothing for anyone who
 * already has the old one, and purging jsDelivr does not help: that clears the
 * CDN's copy, not the one already sitting in a visitor's browser.
 *
 * This bit us for real. island.glb was published three times at one URL: once
 * as a broken 1-byte stub, once at 320 KB, and finally at 164 KB. Anyone whose
 * browser cached the broken copy got
 *
 *   Could not load .../island.glb: Unexpected end of JSON input
 *
 * and, before the viewer had an error boundary, the whole page collapsed. It
 * was invisible from our side because a fresh browser always fetched a good
 * copy, and it was going to keep happening for a week per affected visitor.
 *
 * The version below is part of the URL, so bumping it is a new URL to every
 * browser, and a poisoned cache cannot survive it. Cheap insurance: the entire
 * asset set is well under a megabyte.
 */
const ASSET_VERSION = "2";

export function asset(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path; // already absolute: use as-is
  if (path.startsWith("/")) return path; // local file in /public (small assets only)
  if (!BASE) return null;

  const url = `${BASE}/${path}`;
  return `${url}${url.includes("?") ? "&" : "?"}v=${ASSET_VERSION}`;
}

export const assetsConfigured = BASE.length > 0;
