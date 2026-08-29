# Asset hosting

Renders, `.glb` models and video **never go in this repo**. They're served from
a free CDN, and the site reads them through one environment variable.

`scripts/check-assets.mjs` enforces this: the build and any commit will fail if
a heavy binary sneaks in.

---

## How it works

`lib/assets.ts` joins two things:

```
NEXT_PUBLIC_ASSET_BASE_URL  +  the path in lib/projects.ts
```

So with:

```
NEXT_PUBLIC_ASSET_BASE_URL=https://cdn.jsdelivr.net/gh/majinhutt/portfolio-assets@main
```

a project entry of `poster: "low-poly-island/poster.jpg"` resolves to:

```
https://cdn.jsdelivr.net/gh/majinhutt/portfolio-assets@main/low-poly-island/poster.jpg
```

Move hosts later and you change **one variable**, not fifty paths.

If the variable is unset, `asset()` returns `null` and the UI shows a clean
"render pending" plate rather than a broken image. The site is safe to deploy
before a single asset exists.

---

## The default: GitHub + jsDelivr

Chosen because it has **no payment surface at all**: no card, no billing
account, and no paid tier to accidentally cross into. See
`docs/COST-CONTROLS.md`.

### Setting it up

1. On GitHub (signed in as James), create a **second, public** repository:
   `portfolio-assets`. Keep it separate from the site repo so the site stays
   small and fast to deploy.

2. Clone it somewhere separate from the site:

```bash
git clone https://github.com/majinhutt/portfolio-assets.git
```

3. Inside it, use one folder per project, matching the slugs in
   `lib/projects.ts`:

```
portfolio-assets/
  red-velvet-chair/
    chair.glb
    poster.jpg
  low-poly-island/
    island.glb
    poster.jpg
  lego-batman/
    batman.glb
    poster.jpg
```

Two files per project: the model and one poster render. There are no wireframe,
UV or blockout stills, because the viewer shows those live from the real mesh.

4. Check the files are within jsDelivr's limits before pushing:

```bash
npm run check-uploads -- ../portfolio-assets
```

5. Commit and push:

```bash
git add -A && git commit -m "Add Low Poly Island assets" && git push
```

6. Set the variable: in `.env.local` for local work, and in **Vercel → Project
   → Settings → Environment Variables** for the live site:

```
NEXT_PUBLIC_ASSET_BASE_URL=https://cdn.jsdelivr.net/gh/majinhutt/portfolio-assets@main
```

7. Redeploy on Vercel (or push any commit to the site repo).

### Things to know

- **~20 MB per file.** jsDelivr refuses larger files from GitHub. Compressed
  `.glb` models come in far below this: see `docs/BLENDER-EXPORT.md`. Long
  video does not; if a clip is too big, shorten it, drop the resolution to
  1080p, or host that one file elsewhere.
- **The assets repo must be public.** Fine for portfolio work James wants seen,
  but don't put anything private or unreleased in it.
- **Caching.** `@main` is cached by jsDelivr for about 12 hours. If you replace
  a file and the old one persists, either wait, or purge it:
  `https://purge.jsdelivr.net/gh/majinhutt/portfolio-assets@main/path/to/file.jpg`
- **A tidier alternative to `@main`:** tag releases (`@v1`, `@v2`) and bump the
  env var. Tagged URLs are cached permanently, so nothing goes stale: at the
  cost of updating the variable each time.

---

## Later: Cloudflare R2

Worth moving to once the work outgrows jsDelivr, particularly if James starts
publishing animation reels, where 20 MB per file gets restrictive.

**Deliberately not the default**, because:

> R2 requires a payment method on file before it can be enabled, even to use
> only the free tier, and it bills automatically past that tier.

The free allowance is genuinely good: 10 GB storage, and, unusually, **no
egress fees**, so bandwidth is unlimited at no cost. That's the strongest
long-term option for a portfolio that will run for years. It is a decision to make on purpose, with an adult, not one to drift into.

If switching:

1. Cloudflare account → **R2** → create a bucket, e.g. `portfolio-assets`.
2. Enable **public access** (R2 → bucket → Settings). Cloudflare gives a
   `https://pub-xxxxxxxx.r2.dev` URL.
3. Upload with the same folder-per-project structure as above.
4. Change the one variable:

```
NEXT_PUBLIC_ASSET_BASE_URL=https://pub-xxxxxxxx.r2.dev
```

5. **Same day**, set up billing alerts: Cloudflare → Manage Account → Billing
   → Notifications. Don't skip this.

---

## Not recommended: Vercel Blob

Small free allowance, usage-billed beyond it, and it puts asset storage on the
same account as hosting: so one overspend affects both. Listed only so the
comparison is complete.

---

## Quick comparison

| | GitHub + jsDelivr | Cloudflare R2 | Vercel Blob |
| --- | --- | --- | --- |
| Card required | **No** | **Yes** | Yes |
| Can it bill you by surprise | **No** | Yes, past free tier | Yes, past free tier |
| Storage | Practical repo limits | 10 GB free | ~1 GB free |
| Bandwidth | Free, sponsor-funded | Free, no egress fees | Limited |
| Max file size | ~20 MB | No practical limit | Large |
| Must be public | Yes | Optional | Optional |
| Setup effort | Low (it's just Git) | Medium | Low |
