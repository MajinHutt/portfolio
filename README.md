# James Hutt: 3D Artist portfolio

Portfolio site for James Hutt, a self-taught 3D artist and modeller working in
Blender. Built for a university 3D Animation application and for professional
use thereafter.

Next.js 14 (App Router), TypeScript, Tailwind, react-three-fiber, GSAP.
Fully static, deployed free on Vercel.

---

## Start here

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:3000

Then turn on the safety hooks, once:

```bash
npm run install-hooks
```

---

## The documentation, in the order you will want it

| Document | Read it when |
| --- | --- |
| [Deployment](docs/DEPLOYMENT.md) | Getting the site live on James's GitHub and Vercel |
| [Uploading models](docs/UPLOADING-MODELS.md) | **Start here.** Getting the three .glb files live, step by step. |
| [How to add a project](docs/HOW-TO-ADD-PROJECT.md) | Adding a new piece later on. |
| [Blender export](docs/BLENDER-EXPORT.md) | Exporting a `.glb` that is small enough to serve |
| [Asset hosting](docs/ASSET-HOSTING.md) | Setting up or changing where models and renders live |
| [Cost controls](docs/COST-CONTROLS.md) | Understanding why this cannot generate a bill |
| [Email alerts](docs/NOTIFICATIONS.md) | Getting notified when someone downloads the CV |
| [Analytics](docs/ANALYTICS.md) | Seeing how many people visit, and from where |
| [Accessibility](docs/ACCESSIBILITY.md) | Changing any colour |
| [Decisions](docs/DECISIONS.md) | Wondering why something is built the way it is |

---

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build. Runs all guards first. |
| `npm run guard` | Static-only check, asset check, contrast audit |
| `npm run check-contrast` | WCAG AA colour audit on its own |
| `npm run check-uploads -- <dir>` | Checks asset sizes against jsDelivr's limit |
| `npm run check-url` | Confirms `site.url` actually serves this site |
| `npm run install-hooks` | Enables the pre-commit guards |

---

## Where things are

```
app/                    pages: home, about, contact, cv, work/[slug]
components/             UI, all of it
  viewer/               the 3D viewer and its procedural fallback model
  project/              breakdown lightbox, video player
lib/
  projects.ts           EVERY PROJECT. The only file you edit to add work.
  site.ts               name, email, links, bio, toolset
  assets.ts             joins the CDN base URL to each asset path
  cv.ts                 build-time check for whether the CV PDF exists
docs/                   the table above
scripts/                the guards
public/draco/           self-hosted Draco decoder for compressed models
```

To add a project you edit **one file**: `lib/projects.ts`. See
[How to add a project](docs/HOW-TO-ADD-PROJECT.md).

---

## Things worth knowing before you change anything

**Heavy files never go in this repo.** Models, video and large renders live on
a separate CDN, referenced by path from `lib/projects.ts`. The build fails if a
`.glb`, an `.mp4`, or anything over 2 MB is committed here.

**The site must stay static.** No API routes, no middleware, no Server Actions.
The build fails if one appears. This is what keeps hosting free and
un-billable.

**Colours are audited, not chosen by eye.** `npm run check-contrast` checks 29
real foreground and background pairs against WCAG AA and fails the build on a
regression. If you change a colour, add or update its pair in
`scripts/check-contrast.mjs`.

**Never shorten the vercel.app URL by hand.** Generated Vercel domains come
from the project name, so plausible-looking variants of your own URL often
belong to other people. `site.url` was briefly pointed at
`portfolio-flax-pi.vercel.app` during setup because it returned HTTP 200: it is
a stranger's portfolio. Run `npm run check-url` after any change to it.

**Writing style is British English** (`-ise` endings, colour, modeller,
analyse), and **no em dashes**: a colon does that job throughout. Code
identifiers keep their library's spelling, so `images.unoptimized` stays as it
is.

---

## Outstanding

Content James still needs to supply:

- the hero render, and poster plus three breakdown stills per project
- `.glb` files for the viewer (a procedural island stands in until then)
- the CV PDF at `public/james-hutt-cv.pdf` (the site links to a fallback page
  until it exists)
- real ArtStation, Instagram and LinkedIn URLs in `lib/site.ts`
- A-level subjects and grades in `app/about/page.tsx`
- write-ups for projects 02 to 04, which currently hold placeholder text marked
  with `TODO James`
