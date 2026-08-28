/**
 * Cost guard: proves the site still builds to pure static files.
 *
 * A static Next.js site on Vercel Hobby uses no serverless function
 * invocations, no edge middleware, and no ISR revalidations: the three things
 * that actually meter on Vercel. This script fails the build if a change
 * introduces any of them, so nobody can wander into a paid tier by accident.
 *
 * If you ever genuinely need a server route, remove the relevant check here on
 * purpose: don't disable the whole script.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const problems = [];

/** Files whose mere existence creates a serverless function or middleware. */
const FORBIDDEN_FILENAMES = [
  { pattern: /^route\.(ts|tsx|js|mjs)$/, why: "an API route (serverless function)" },
  { pattern: /^middleware\.(ts|js)$/, why: "edge middleware (metered per invocation)" },
  { pattern: /^opengraph-image\.(ts|tsx|js)$/, why: "runtime OG image generation" },
  { pattern: /^icon\.(ts|tsx)$/, why: "runtime icon generation" },
];

/** Source patterns that force a route to render per-request. */
const FORBIDDEN_SOURCE = [
  { pattern: /^\s*["']use server["']/m, why: "a Server Action" },
  { pattern: /export\s+const\s+dynamic\s*=\s*["']force-dynamic["']/, why: "force-dynamic rendering" },
  { pattern: /export\s+const\s+revalidate\s*=\s*(?!false)/, why: "ISR revalidation" },
  { pattern: /export\s+const\s+runtime\s*=\s*["'](edge|nodejs)["']/, why: "an explicit server runtime" },
];

const SKIP_DIRS = new Set(["node_modules", ".next", ".git", "public", "docs", "scripts"]);

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);

    if (statSync(full).isDirectory()) {
      if (!SKIP_DIRS.has(entry)) walk(full);
      continue;
    }

    const rel = relative(ROOT, full).split(sep).join("/");

    for (const { pattern, why } of FORBIDDEN_FILENAMES) {
      if (pattern.test(entry)) problems.push(`${rel}: ${why}`);
    }

    if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) {
      const source = readFileSync(full, "utf8");
      for (const { pattern, why } of FORBIDDEN_SOURCE) {
        if (pattern.test(source)) problems.push(`${rel}: ${why}`);
      }
    }
  }
}

walk(ROOT);

if (problems.length > 0) {
  console.error("\n  COST GUARD: this change would stop the site being fully static.\n");
  for (const p of problems) console.error(`   - ${p}`);
  console.error(
    "\n  Static pages are served free from Vercel's CDN. The items above are\n" +
      "  metered per request. See docs/COST-CONTROLS.md before proceeding.\n",
  );
  process.exit(1);
}

console.log("Cost guard: site is fully static (no functions, middleware, or ISR).");
