# Cost controls

**Goal: this site cannot generate a bill without James actively choosing to allow one.**

There are two kinds of protection here. The ones in this repo are automatic. The
ones in the Vercel, Cloudflare and GitHub dashboards have to be set once, by
hand, by James: nobody else can set them on his behalf, and this file tells him
exactly which switches to flip.

---

## 1. What's already enforced in the code

These run automatically on every `npm run build`, and on every commit once
hooks are installed (`npm run install-hooks`).

| Guard | File | What it prevents |
| --- | --- | --- |
| Static-only check | `scripts/check-static.mjs` | API routes, middleware, Server Actions, ISR: the things Vercel meters per request. Build fails if any appear. |
| Asset guard | `scripts/check-assets.mjs` | `.glb`, `.mp4`, `.blend`, `.exr` etc. or any file over 2 MB being committed to Git. Build and commit both fail. |
| Image optimisation off | `next.config.mjs` (`images.unoptimised: true`) | Vercel Image Optimisation, which is metered on Hobby. |
| No metered SDKs | `package.json` | Vercel Analytics, Speed Insights, Blob, KV and Postgres are deliberately **not** installed. |

Right now every route in the build output is marked `○ (Static)`. That means
zero function invocations: the whole site is files on a CDN.

**If a build ever fails with `COST GUARD` or `ASSET GUARD`, that is the system
working.** Read the message before changing anything.

---

## 2. Vercel: the important one

Vercel's Hobby tier is free and, critically, **has no payment method attached by
default. An account with no card on file cannot be charged.** If you exceed
Hobby limits, Vercel throttles or pauses the deployment and emails you; it does
not silently bill you.

### Do this when setting up

1. **Sign up for Hobby. Do not enter card details.** This is the single most
   effective control on this list. Everything below is a second layer.
2. **Never click "Upgrade to Pro"**, including when a banner offers a free
   trial: trials convert to paid.
3. **Settings → Notifications**: turn on usage and deployment emails so James
   hears about approaching limits early.
4. **Project → Settings → Functions**: nothing to configure, because the site
   has none. If this page ever lists a function, the static guard failed, so
   investigate.
5. **Project → Settings → Deployment Protection**: leave off (it's a Pro
   feature anyway).
6. **Do not enable Vercel Analytics or Speed Insights** from the dashboard.
   They have their own free allowances and prompt to upgrade when exceeded.

### Hobby limits, for context

A portfolio site with a handful of visitors will not come close to these. The
limits exist so you know what "a lot" would look like:

- 100 GB bandwidth per month
- 100 GB-hours of function execution (this site uses none)
- Commercial use is not permitted on Hobby. If James starts taking paid
  freelance work *through* the site, that's the point to revisit the plan
  deliberately, not accidentally.

---

## 3. Asset hosting: read before choosing

This is where the real billing risk sits, and it's why the recommendation
changed. See `docs/ASSET-HOSTING.md` for the full comparison.

### GitHub + jsDelivr: no payment surface at all

**No card. No billing account. Nothing that can charge you.** jsDelivr is a
free public CDN funded by sponsors; GitHub public repos are free. There is no
upgrade path to accidentally cross because there is no paid tier to cross into.

Constraint: roughly 20 MB per file (50 MB hard ceiling), and the repo must be
public. For compressed `.glb` models that is generous: see
`docs/BLENDER-EXPORT.md`. For long video it is not.

**This is the configured default.** `.env.example` documents the jsDelivr URL
format, and `npm run check-uploads -- <folder>` checks files against its size
limit before they're pushed.

### Cloudflare R2: better long-term, but requires a card

R2's free tier is genuinely good (10 GB storage, and no egress fees at all,
which is unusual and valuable). But:

> **R2 requires a payment method on file before it can be enabled, even to use
> only the free tier. Exceeding the free allowance bills automatically.**

That is a real payable-tier surface. If James chooses R2 anyway, which is
reasonable once he has more work than jsDelivr can hold, set these up the same
day:

1. **Cloudflare dashboard → Manage Account → Billing → Notifications**: create
   a billing alert so any charge triggers an email.
2. **R2 → your bucket → Settings**: confirm the bucket is public read-only and
   that no Class A (write) operations are exposed publicly.
3. Check **R2 → Metrics** monthly for the first few months.
4. Keep total bucket size well under 10 GB. At ~5 MB per compressed model and
   ~20 MB per video, that's hundreds of pieces, though video adds up fastest.

### Vercel Blob: not recommended here

Small free allowance, billed by usage beyond it, and it ties asset storage to
the same account as hosting. Mentioned only for completeness.

---

## 4. Domain names

The site works permanently and free on a `*.vercel.app` address. A custom
domain is the one genuinely unavoidable cost if James wants one: roughly
£8–15/year from a registrar.

- Buying a domain is a **deliberate, separate purchase**. Vercel will happily
  sell one from the dashboard; buying from any registrar is fine.
- **Turn off auto-renew** if he wants to review it yearly rather than be
  charged automatically.
- Nothing in this repo requires a custom domain. `site.url` in `lib/site.ts` is
  the only thing to update if he ever adds one.

---

## 5. The rule of thumb

> If a tool asks for a card, stop and ask an adult before entering it.

Every service this site depends on can be used, permanently, without one. The
single exception is R2, which is why it is no longer the default recommendation.

---

## 6. Quick audit

Run this any time to re-check the automatic guards:

```bash
npm run guard
```
