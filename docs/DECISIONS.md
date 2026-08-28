# Decisions

Why the build is the way it is. Written down so that a future change is made on
purpose rather than by accident.

---

## react-three-fiber everywhere, not `<model-viewer>`

Google's `<model-viewer>` is the quicker way to put a GLB on a page, and for a
plain "spin this object" embed it would have been the right call.

It cannot do the thing this design requires. The project page has **Shaded /
Wireframe / Clay** buttons that swap materials on the loaded mesh.
`<model-viewer>` exposes no material-override API for that: you would end up
reaching into its internal three.js scene graph, which is both unsupported and
more fragile than using three.js directly.

Since react-three-fiber is needed for the project pages regardless, the hero
uses it too. Shipping two 3D runtimes to save a few lines on one page would be
a poor trade.

## Explicit lights plus a procedural environment, not an HDRI

drei's `<Environment preset="studio" />` is one line and looks excellent. It
also fetches several megabytes of HDRI from a third-party CDN on every page
view, which costs bandwidth and adds an external dependency the site otherwise
does not have.

Instead the scene uses three-point lighting plus an `<Environment>` built from
`<Lightformer>` shapes: light emitters defined in the scene itself. Same benefit
for reflections and roughness response, no network request, and `frames={1}`
bakes it once rather than every frame.

## GSAP, and framer-motion removed

Both were briefly installed. Shipping both would have cost roughly 68 KB
gzipped for overlapping capability.

GSAP won because ScrollTrigger has no real equivalent in framer-motion, and the
scroll-triggered reveals were an explicit requirement. framer-motion's layout
animation is genuinely nicer for the filter transition, and that is the one
thing lost: filtering now re-reveals the remaining cards rather than sliding
them into their new positions.

## The site is static, and a guard enforces it

Every route prerenders to a file. No API routes, no middleware, no Server
Actions, no ISR.

This is a cost decision as much as a performance one: those four things are
what Vercel meters per request, and this site belongs to a student who must not
be able to run up a bill. `scripts/check-static.mjs` fails the build if any of
them appear. See `docs/COST-CONTROLS.md`.

## Contact is a mailto, not a form

A form needs somewhere to post to. That means a serverless function, which
breaks the static guarantee above, and it means spam handling. A mailto link
reaches the same inbox, cannot break, and costs nothing.

The contact page softens the usual bluntness of a mailto by offering four
pre-filled subject lines, so the visitor is not staring at an empty message.

## Vercel Image Optimisation is switched off

`images.unoptimized: true` (the Next.js property keeps its American spelling). Renders are exported pre-optimised as WebP or AVIF
straight out of Blender and Krita, so the optimiser has nothing to improve, and
it is a metered resource on the Hobby tier. `next/image` is still used for its
reserved aspect box, which prevents layout shift, and for lazy loading.

## GitHub and jsDelivr for assets, not Cloudflare R2

R2 is the better long-term option: 10 GB free and, unusually, no egress fees at
all. It was the original choice.

It was changed because **R2 requires a payment method on file even to use the
free tier, and bills automatically past it**. Given a hard requirement that
nothing can generate a surprise charge, a host with no payment surface at all
wins. jsDelivr has no card, no billing account, and no paid tier to cross into.

The cost is a ceiling of roughly 20 MB per file, which is generous for
compressed models and tight for video. Moving to R2 later is a one-line change
to an environment variable. See `docs/ASSET-HOSTING.md`.

## The palette departs from the design handoff

The handoff specified a light page with near-black render plates inset into it,
and says explicitly: do not make the site dark overall.

The site is now dark stone grey with a red header, at the client's request.
This was implemented with the trade-off stated rather than silently: the
plate-against-page contrast falls from strong to 1.78:1, so the plates read as
slightly darker rectangles rather than inset windows. The full reasoning, and
the five colour changes the accessibility audit forced, are in
`docs/ACCESSIBILITY.md`.

## The brand red is `#dd2b0f`, not `#ec3013`

The original red fails WCAG AA against white at body size (4.19:1). `#dd2b0f`
is a step on the design system's own ramp, is visually near-identical, and
passes at 4.74:1. Text on red is pure white rather than the site's off-white,
because the off-white fails at 4.27:1. This is enforced:
`npm run check-contrast` fails the build on a regression.

## The intro plays once per session

A loading animation is charming the first time and an obstacle the fifth. It is
recorded in `sessionStorage`, skipped entirely under `prefers-reduced-motion`,
dismissable with a click or a key press, and removed from the DOM afterwards
rather than left hidden.

It is guarded with a ref rather than the session flag alone, because React
StrictMode double-invokes effects in development: the first pass would write
the flag and the second would read it back and skip, so the animation never
played locally while working fine in production.

## The cursor is the native one

A custom square cursor was built and then removed at the client's request. The
hover micro-interactions it was paired with were kept: the card image scale, the
"View project" chip that slides up from the plate edge, and the arrow nudges on
list rows. Those work for touch and keyboard users too, which a bespoke cursor
never does.

## The cinematic grade is two effects, not eight

The viewer runs ACES filmic tone mapping, soft shadows, a procedural studio
environment, and a postprocessing pass of exactly two effects: bloom with a
high luminance threshold (0.9, so only genuine highlights lift and nothing
mid-tone does) and a shallow vignette.

Everything else was considered and rejected. Chromatic aberration, depth of
field, film grain and scanlines all obscure the thing being shown. On a
portfolio aimed at other modellers, heavy postprocessing reads as an attempt to
hide the model rather than present it, and the audience notices. The grade is
also skipped entirely in wireframe mode, where it would sit between the viewer
and the topology they are trying to read.

`CINEMATIC` at the top of `components/viewer/ModelStage.tsx` turns the whole
pass off.

## The email is never in the markup, and the check is a speed bump

The address is stored ROT13-encoded and assembled in the browser only after a
simple question is answered, with the result held for the session so nobody is
asked twice.

This defeats the traffic that actually harvests addresses: crawlers that fetch
HTML and run a regular expression over it. It does not defeat a person who
reads the source, and it cannot: a challenge answered entirely in the browser
must carry its own answer. A real wall needs server-side verification, which
means a serverless function, which `docs/COST-CONTROLS.md` rules out.

The same applies to the CV: the PDF sits at a fixed path in `/public`, so the
check keeps it out of casual crawls rather than controlling access to it.

The questions are plain text with plain text answers, no distorted letters and
no images, because an inaccessible CAPTCHA loses more real visitors than the
bots it stops.

## A procedural island stands in for missing models

Rather than an empty black rectangle, a project with no `.glb` yet renders a
low-poly island built from three.js primitives. It let the viewer be verified as
working before any assets existed, and it remains the fallback for any future
project whose model is not ready.

Missing images get a quiet "render pending" plate for the same reason: a
portfolio that is half-finished should look deliberate, not broken.
