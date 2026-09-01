/**
 * End-to-end checks against a running site.
 *
 *   npm run smoke                        # against the live site
 *   npm run smoke -- http://localhost:3000
 *
 * Everything here is checkable without a browser: routes, links, metadata,
 * assets, copy conventions and accessibility basics. It deliberately does not
 * try to test WebGL, which needs a real GPU and a visible window.
 */

const BASE = (process.argv[2] || "https://portfolio-flax-pi-n17wrr08c7.vercel.app").replace(/\/$/, "");

let passed = 0;
let failed = 0;
const failures = [];

function check(name, ok, detail = "") {
  if (ok) {
    passed++;
  } else {
    failed++;
    failures.push(`${name}${detail ? `: ${detail}` : ""}`);
  }
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${detail && !ok ? ` (${detail})` : ""}`);
}

async function get(path) {
  const res = await fetch(BASE + path, { headers: { "cache-control": "no-cache" } });
  return { status: res.status, body: await res.text(), headers: res.headers };
}

const ROUTES = [
  "/", "/about", "/contact", "/cv",
  "/work/red-velvet-chair", "/work/low-poly-island", "/work/lego-batman",
  "/sitemap.xml", "/robots.txt", "/james-hutt-cv.pdf", "/favicon.ico",
];

const pages = {};

console.log(`\n  Testing ${BASE}\n`);

// ── Routes respond ──────────────────────────────────────────────────────────
console.log("  Routes");
for (const route of ROUTES) {
  const r = await get(route);
  check(`${route} responds 200`, r.status === 200, `got ${r.status}`);
  if (route.startsWith("/work") || !route.includes(".")) pages[route] = r.body;
}

const r404 = await get("/this-page-does-not-exist");
check("unknown route returns 404", r404.status === 404, `got ${r404.status}`);
check("404 page is branded", /Nothing modelled here/i.test(r404.body));

// ── Metadata and SEO ────────────────────────────────────────────────────────
console.log("\n  Metadata");
const home = pages["/"];
check("homepage has a title", /<title>[^<]+<\/title>/.test(home));
check("homepage has a description", /name="description"/.test(home));
check("og:url points at this site", home.includes(`content="${BASE}"`));
check("og:image or twitter card present", /twitter:card/.test(home));
check("canonical host in sitemap", (await get("/sitemap.xml")).body.includes(BASE));
check("robots references the sitemap", (await get("/robots.txt")).body.includes("sitemap"));

for (const slug of ["red-velvet-chair", "low-poly-island", "lego-batman"]) {
  const body = pages[`/work/${slug}`];
  check(`${slug} has its own title`, /<title>[^<]+<\/title>/.test(body));
  check(`${slug} has a single h1`, (body.match(/<h1/g) || []).length === 1);
}

// ── Privacy: the address must never be in the markup ────────────────────────
console.log("\n  Contact protection");
for (const [route, body] of Object.entries(pages)) {
  check(`${route} has no plain email`, !/jpfhutt@gmail\.com/.test(body));
  check(`${route} has no mailto link`, !/mailto:/.test(body));
}

// ── Assets ──────────────────────────────────────────────────────────────────
console.log("\n  Assets");
// The backslash exclusion matters: these URLs also appear inside the escaped
// RSC payload, where a trailing \" would otherwise be captured as part of them
// and count as a fourth, non-existent poster.
const posterUrls = [
  ...new Set(
    [...home.matchAll(/https:\/\/cdn\.jsdelivr\.net[^"'\\]*poster\.jpg[^"'\\]*/g)].map(
      (m) => m[0],
    ),
  ),
];
check("three posters referenced", posterUrls.length === 3, `found ${posterUrls.length}`);
check("posters are version-busted", posterUrls.every((u) => /\?v=\d+/.test(u)));
check("no ArtStation hotlinks", !/cdn[ab]\.artstation\.com/.test(home));

for (const url of posterUrls) {
  const res = await fetch(url);
  check(`poster loads: ${url.split("/").slice(-2).join("/").split("?")[0]}`, res.ok, `${res.status}`);
}

for (const m of ["red-velvet-chair/chair.glb", "low-poly-island/island.glb", "lego-batman/batman.glb"]) {
  const res = await fetch(`https://cdn.jsdelivr.net/gh/MajinHutt/portfolio-assets@main/${m}?v=2`);
  const buf = Buffer.from(await res.arrayBuffer());
  check(`${m} is a valid glb`, res.ok && buf.subarray(0, 4).toString() === "glTF",
    res.ok ? `magic ${buf.subarray(0, 4).toString("hex")}` : `${res.status}`);
}

for (const f of ["draco_decoder.js", "draco_decoder.wasm", "draco_wasm_wrapper.js"]) {
  const r = await get(`/draco/${f}`);
  check(`draco decoder served: ${f}`, r.status === 200, `${r.status}`);
}

// ── CV ──────────────────────────────────────────────────────────────────────
console.log("\n  CV");
const cvRes = await fetch(`${BASE}/james-hutt-cv.pdf`);
const cvBuf = Buffer.from(await cvRes.arrayBuffer());
check("CV is a valid PDF", cvBuf.subarray(0, 4).toString() === "%PDF");
const cvText = cvBuf.toString("latin1");
for (const secret of ["St. Michael", "Brinkworth", "SN15", "07748", "5QG"]) {
  check(`CV omits "${secret}"`, !cvText.includes(secret));
}
check("CV page offers the download", /Verify to download/.test(pages["/cv"]));

// ── Internal links all resolve ──────────────────────────────────────────────
console.log("\n  Internal links");
const internal = new Set();
for (const body of Object.values(pages)) {
  for (const m of body.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (!m[1].startsWith("/_next/")) internal.add(m[1]);
  }
}
for (const href of [...internal].sort()) {
  const r = await get(href);
  check(`link ${href}`, r.status === 200, `${r.status}`);
}

// ── External links ──────────────────────────────────────────────────────────
console.log("\n  External links");
const external = new Set();
for (const body of Object.values(pages)) {
  for (const m of body.matchAll(/href="(https:\/\/(?:www\.)?(?:artstation|linkedin)\.com[^"]*)"/g)) external.add(m[1]);
}
for (const url of [...external].sort()) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    // LinkedIn and ArtStation block automated HEADs; anything but a 404 is fine.
    check(`external ${url.replace(/^https:\/\//, "")}`, res.status !== 404, `${res.status}`);
  } catch (e) {
    check(`external ${url.replace(/^https:\/\//, "")}`, false, e.message);
  }
}

// ── Accessibility basics ────────────────────────────────────────────────────
console.log("\n  Accessibility");
for (const [route, body] of Object.entries(pages)) {
  const imgs = [...body.matchAll(/<img[^>]*>/g)].map((m) => m[0]);
  check(`${route}: every img has alt`, imgs.every((i) => /alt="/.test(i)), `${imgs.filter((i) => !/alt="/.test(i)).length} missing`);
}
check("skip link present", /Skip to content/.test(home));
check("html has a lang", /<html[^>]+lang="en-GB"/.test(home));

// ── House style ─────────────────────────────────────────────────────────────
console.log("\n  House style");
for (const [route, body] of Object.entries(pages)) {
  const text = body.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ");
  check(`${route}: no em dashes`, !text.includes("—"));
  const american = text.match(/\b(color|behavior|modeling|favorite|organiz|recogniz)\w*/gi) || [];
  check(`${route}: British spelling`, american.length === 0, american.slice(0, 3).join(", "));
}

// ── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n  ${passed} passed, ${failed} failed\n`);
if (failed) {
  console.log("  Failures:");
  for (const f of failures) console.log(`   - ${f}`);
  console.log("");
  process.exit(1);
}
