/**
 * Confirms that site.url actually serves THIS site.
 *
 *   npm run check-url
 *
 * Why this exists: vercel.app domains are generated from the project name, so
 * short, plausible-looking variants of your own URL frequently belong to other
 * people. During setup, site.url was briefly pointed at
 * portfolio-flax-pi.vercel.app on the strength of it returning HTTP 200. It
 * returns 200 because it is somebody else's portfolio. That URL went into the
 * Open Graph tags and the sitemap before it was caught.
 *
 * A 200 proves a server answered. It proves nothing about whose server.
 *
 * Not part of `npm run guard`, because it needs network access and builds must
 * work offline and inside Vercel's build sandbox. Run it by hand whenever
 * site.url changes, and after any domain change.
 */
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../lib/site.ts", import.meta.url), "utf8");
const match = source.match(/url:\s*"([^"]+)"/);

if (!match) {
  console.error("\n  Could not find `url:` in lib/site.ts\n");
  process.exit(1);
}

const url = match[1];
console.log(`\n  Checking ${url}\n`);

/** A phrase that must appear, and would not appear on an unrelated site. */
const FINGERPRINT = "James Hutt";

try {
  const response = await fetch(url, {
    headers: { "cache-control": "no-cache" },
    redirect: "follow",
  });

  if (!response.ok) {
    console.error(`  FAIL: responded HTTP ${response.status}\n`);
    process.exit(1);
  }

  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/)?.[1] ?? "(no title)";

  console.log(`  HTTP  ${response.status}`);
  console.log(`  Title ${title}`);

  if (!html.includes(FINGERPRINT)) {
    console.error(
      `\n  FAIL: this URL does not serve James's site.\n` +
        `  Expected to find "${FINGERPRINT}" in the page and did not.\n` +
        `  The domain is answering, but it belongs to somebody else.\n` +
        `  Get the real one from Vercel: Project, then Settings, then Domains.\n`,
    );
    process.exit(1);
  }

  // A stale build serving the wrong canonical URL is its own bug.
  if (!html.includes(`content="${url}"`)) {
    console.log(
      `\n  Note: og:url on the live page does not yet match site.url.\n` +
        `  Usually this just means the newest deploy has not finished.\n`,
    );
  }

  console.log(`\n  OK: ${url} serves this site.\n`);
} catch (error) {
  console.error(`\n  FAIL: could not reach ${url}\n  ${error.message}\n`);
  process.exit(1);
}
