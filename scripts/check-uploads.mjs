/**
 * Checks a folder of assets before you push it to the assets repo.
 *
 *   npm run check-uploads -- ../portfolio-assets
 *
 * jsDelivr refuses to serve GitHub files over ~20 MB, and the failure shows up
 * as a broken image on the live site rather than an error at upload time: so
 * it's worth catching here instead.
 */
import { readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, sep, extname } from "node:path";

const target = process.argv[2];

if (!target) {
  console.error("\n  Usage: npm run check-uploads -- <path-to-assets-folder>\n");
  process.exit(1);
}

if (!existsSync(target)) {
  console.error(`\n  No such folder: ${target}\n`);
  process.exit(1);
}

const HARD_LIMIT = 20 * 1024 * 1024; // jsDelivr refuses above roughly this
const WARN_LIMIT = 10 * 1024 * 1024; // large enough to be worth a second look

const SKIP_DIRS = new Set([".git", "node_modules"]);

const files = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(entry)) walk(full);
      continue;
    }
    files.push({
      rel: relative(target, full).split(sep).join("/"),
      bytes: statSync(full).size,
      ext: extname(entry).toLowerCase(),
    });
  }
}

walk(target);

const mb = (b) => (b / 1024 / 1024).toFixed(2);

const tooBig = files.filter((f) => f.bytes > HARD_LIMIT);
const large = files.filter((f) => f.bytes > WARN_LIMIT && f.bytes <= HARD_LIMIT);
const total = files.reduce((sum, f) => sum + f.bytes, 0);

console.log(`\n  ${files.length} files, ${mb(total)} MB total\n`);

if (large.length > 0) {
  console.log("  Large, but jsDelivr will serve them:");
  for (const f of large) console.log(`   - ${f.rel} (${mb(f.bytes)} MB)`);
  console.log("");
}

if (tooBig.length > 0) {
  console.error("  TOO BIG: jsDelivr will not serve these:\n");
  for (const f of tooBig) console.error(`   - ${f.rel} (${mb(f.bytes)} MB)`);
  console.error(
    "\n  Options:\n" +
      "   - .glb  : increase Draco compression, see docs/BLENDER-EXPORT.md\n" +
      "   - images: export at 2048px max and re-encode as WebP or AVIF\n" +
      "   - video : trim it, or drop to 1080p at a lower bitrate\n",
  );
  process.exit(1);
}

console.log("  All files are within jsDelivr's limits.\n");
