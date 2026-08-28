/**
 * Cost guard: keeps heavy binaries out of the Git repo.
 *
 * Two reasons this matters:
 *   1. Vercel bills bandwidth for anything it serves. Models and video belong
 *      on the asset CDN, which is why lib/assets.ts exists.
 *   2. GitHub starts charging for Git LFS, and a bloated repo makes every
 *      deploy slower.
 *
 * Run as part of `npm run build`, and from the pre-commit hook in .githooks/.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep, extname } from "node:path";

const ROOT = process.cwd();

/** Extensions that must live on the CDN, never in Git. */
const CDN_ONLY = new Set([
  ".glb", ".gltf", ".fbx", ".obj", ".blend", ".blend1", ".abc", ".usdz",
  ".mp4", ".mov", ".webm", ".avi", ".mkv",
  ".exr", ".hdr", ".psd", ".tif", ".tiff", ".tga",
]);

/** Anything above this in the repo is almost certainly a mistake. */
const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB

/**
 * Deliberate exceptions. The Draco decoder is a required runtime dependency
 * that must be same-origin, and it is small.
 */
const ALLOWLIST = [/^public\/draco\//];

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "out"]);

const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(entry)) walk(full);
      continue;
    }

    const rel = relative(ROOT, full).split(sep).join("/");
    if (ALLOWLIST.some((re) => re.test(rel))) continue;

    const ext = extname(entry).toLowerCase();
    const bytes = statSync(full).size;

    if (CDN_ONLY.has(ext)) {
      violations.push({
        rel,
        bytes,
        why: `${ext} files belong on the asset CDN, not in Git`,
      });
    } else if (bytes > MAX_FILE_BYTES) {
      violations.push({
        rel,
        bytes,
        why: `larger than the ${(MAX_FILE_BYTES / 1024 / 1024).toFixed(0)} MB repo limit`,
      });
    }
  }
}

walk(ROOT);

if (violations.length > 0) {
  console.error("\n  ASSET GUARD: these files should not be in the Git repo.\n");
  for (const v of violations) {
    console.error(`   - ${v.rel} (${(v.bytes / 1024 / 1024).toFixed(2)} MB): ${v.why}`);
  }
  console.error(
    "\n  Upload them to your asset host instead, then reference the path from\n" +
      "  lib/projects.ts. See docs/ASSET-HOSTING.md and docs/COST-CONTROLS.md.\n",
  );
  process.exit(1);
}

console.log("Asset guard: no heavy binaries in the repo.");
