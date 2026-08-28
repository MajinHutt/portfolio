# How to add a project

Adding a piece is one text edit and two pushes. You do not need to touch any
component, styling, or layout code.

Roughly twenty minutes, most of it exporting from Blender.

---

## Step 1: export the files

Follow `docs/BLENDER-EXPORT.md`. You want five files:

```
poster.jpg       the main render (landscape, roughly 3:2)
model.glb        Draco-compressed
wireframe.jpg    topology
uv.jpg           UV layout
blockout.jpg     early grey stage
```

Plus optionally `walk-cycle.mp4` or similar if the piece is an animation.

## Step 2: upload them

In your `portfolio-assets` repo, make a folder named exactly as the project's
slug will be, in lower case with hyphens:

```
portfolio-assets/
  red-velvet-chair/
    poster.jpg
    chair.glb
    wireframe.jpg
    uv.jpg
    blockout.jpg
```

Check the sizes, then push:

```bash
npm run check-uploads -- ../portfolio-assets
```

```bash
git add -A && git commit -m "Add Red Velvet Chair assets" && git push
```

## Step 3: add the entry

Open `lib/projects.ts`. Copy an existing block, paste it at the end of the
`projects` array, and change the values. Every field is explained by the type
above the array.

```ts
{
  slug: "red-velvet-chair",        // must match the CDN folder name
  index: "03",                     // shown in the red corner badge
  title: "Red Velvet Chair",
  titleLines: ["Red Velvet", "Chair"],   // two lines for the detail page
  discipline: "Materials",
  filters: ["environment"],        // which filter chips this appears under
  tags: ["Materials", "Hard surface"],   // first tag gets the accent colour
  year: "2026",
  blurb: "One sentence. This is the line on the card.",
  body: [
    "What it is, and how you approached it.",
    "The hardest problem was X. You solved it by Y.",
  ],
  tools: ["Blender 4.2", "Cycles", "Substance"],
  specs: [
    { label: "Tris", value: "96,400" },
    { label: "Texture sets", value: "2 × 2K" },
    { label: "Render time", value: "2m 30s / frame" },
    { label: "Duration", value: "2 weeks" },
  ],
  poster: "red-velvet-chair/poster.jpg",
  posterAlt: "Describe the image for someone who cannot see it",
  model: "red-velvet-chair/chair.glb",
  video: "",
  breakdowns: [
    { label: "Wireframe", image: "red-velvet-chair/wireframe.jpg", alt: "..." },
    { label: "UV layout", image: "red-velvet-chair/uv.jpg", alt: "..." },
    { label: "Blockout", image: "red-velvet-chair/blockout.jpg", alt: "..." },
  ],
},
```

Everything updates on its own from that one entry: the homepage grid, the index
list, the filter chips, the project page, the "Next" button, the sitemap, and
the Open Graph preview when someone shares the link.

## Step 4: check and push

```bash
npm run dev
```

Look at it on `http://localhost:3000`, then:

```bash
git add -A && git commit -m "Add project: Red Velvet Chair" && git push
```

Vercel rebuilds automatically. Live in about two minutes.

---

## The two paragraphs matter more than the render

Keep the structure of `body`: **what it is**, then **the hardest problem and
how you solved it**.

Anyone can post a nice render. The second paragraph is what separates a
portfolio from a gallery, and it is the part an admissions tutor or a studio
lead is actually reading for. Be specific. "The handle pinched under
subdivision until I rebuilt the join as clean quads" says far more than "I
learned a lot about topology."

## Writing style

The site is written in British English throughout: `-ise` endings (stylised,
optimised, recognised), and British forms everywhere else (colour, modeller,
behaviour, analyse, practise as a verb).

Code is the exception. Property names and commands keep whatever spelling their
library uses, so `images.unoptimized` and `gltf-transform optimize` stay as they
are. Prose is British; identifiers are whatever they are.

**Do not use em dashes.** Use a colon where you would reach for one. This is
consistent across every page, so a new project entry should match.

---

## Things that will trip you up

**The image does not appear.** The path in `lib/projects.ts` must match the CDN
folder and filename exactly, including case. `Poster.jpg` and `poster.jpg` are
different files on a Linux CDN.

**The old image keeps appearing.** jsDelivr caches for about 12 hours. Purge it:

```
https://purge.jsdelivr.net/gh/majinhutt/portfolio-assets@main/red-velvet-chair/poster.jpg
```

**The model does not load but the poster does.** Almost always a Draco problem.
Test the file at https://gltf-viewer.donmccurdy.com first.

**The build fails with ASSET GUARD.** You have put a `.glb`, video, or a file
over 2 MB in the *site* repo instead of the *assets* repo. See
`docs/ASSET-HOSTING.md`.

**You have no render yet.** Leave the field as `""`. The site shows a tidy
"render pending" plate rather than a broken image, so you can publish the
write-up before the artwork is finished.

## Removing or reordering

Delete the block, or move it within the array. Order in the file is the order on
the page. Remember to renumber the `index` fields so the badges stay sequential.
