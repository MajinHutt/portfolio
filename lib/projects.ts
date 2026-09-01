/**
 * THE ONLY FILE YOU EDIT TO ADD A PROJECT.
 * Full walkthrough in docs/HOW-TO-ADD-PROJECT.md.
 *
 * Asset fields are paths *relative to your CDN base* (see lib/assets.ts).
 * Leave any of them as "" and the site renders a clean empty plate rather than
 * a broken image, so a project can be published before every still is finished.
 *
 * Order in this array is the order on the page. Red Velvet Chair leads because
 * it is the strongest piece, not because it is the newest, though here it
 * happens to be both.
 *
 * Copy is adapted from James's own ArtStation write-ups:
 *   https://www.artstation.com/james_hutt
 *
 * Posters are the same renders published on ArtStation, so each piece keeps the
 * composition and camera angle James chose for it, but they are served from our
 * own CDN rather than hotlinked from ArtStation. If he ever has the original
 * full-resolution renders, they drop straight in over these files: same
 * filenames, no code change.
 *
 * There is no separate wireframe or blockout still to supply: the viewer's own
 * Shaded / Wireframe / Clay modes show the topology live, on the real mesh,
 * which is better proof than a screenshot of it.
 */

export type Discipline = "Materials" | "Environment" | "Character";
export type FilterTag = "character" | "environment" | "hard-surface";

export type Project = {
  slug: string;
  index: string;
  title: string;
  /** Two lines for the detail-page H1. */
  titleLines: [string, string];
  discipline: Discipline;
  /** Drives the homepage filter chips. */
  filters: FilterTag[];
  /** Visible pills on the card, in order. First one is the accent-coloured tag. */
  tags: string[];
  year: string;
  blurb: string;
  /** Paragraph 1 = what it is. Paragraph 2 = what the work went into. */
  body: [string, string];
  tools: string[];
  specs: { label: string; value: string }[];
  /** Landscape still shown on the card and as the viewer's pre-load poster. */
  poster: string;
  posterAlt: string;
  /** Draco-compressed .glb on your CDN. "" = poster only, no viewer. */
  model: string;
  /** Optional turntable or animation clip. */
  video: string;
  /** Link back to the original ArtStation post, if there is one. */
  artstation: string;
};

export const projects: Project[] = [
  {
    slug: "red-velvet-chair",
    index: "01",
    title: "Red Velvet Dining Chair",
    titleLines: ["Red Velvet", "Chair"],
    discipline: "Materials",
    filters: ["hard-surface"],
    tags: ["Materials", "Hard surface"],
    year: "2026",
    blurb:
      "A dining chair modelled from life, built to push materials and lighting.",
    body: [
      "My third original piece, and the first where I went after realism rather than a style. The reference was a chair from my own dining room, which meant I could put the render next to the real thing and be honest about how close I had actually got.",
      "Most of the work went into materials and lighting rather than silhouette. Those are the parts that decide whether a familiar object reads as real or as a model of itself, and a chair everyone has seen a hundred times gives you nowhere to hide.",
    ],
    tools: ["Blender", "Cycles"],
    // Read straight out of the published .glb: run `npm run model-stats`.
    specs: [
      { label: "Triangles", value: "20,576" },
      { label: "Materials", value: "2" },
      { label: "Textures", value: "1 × 2K" },
      { label: "Model size", value: "3.2 MB" },
      { label: "Published", value: "August 2026" },
    ],
    poster: "red-velvet-chair/poster.jpg",
    posterAlt:
      "Render of a red velvet dining chair, modelled and lit in Blender",
    model: "red-velvet-chair/chair.glb",
    video: "",
    artstation: "https://www.artstation.com/artwork/dL8Pm1",
  },
  {
    slug: "low-poly-island",
    index: "02",
    title: "Low Poly Island",
    titleLines: ["Low Poly", "Island"],
    discipline: "Environment",
    filters: ["environment"],
    tags: ["Environment", "Stylised"],
    year: "2026",
    blurb:
      "A small island out at sea, with a rowboat and a question left unanswered.",
    body: [
      "My second original piece. I love the low poly art style, so I built a small island out at sea with a rowboat pulled up on it, and left a bit of mystery in the scene: why is the rowboat there, and where is the person who sailed it?",
      "Working stylised does not mean working loosely. With this few polygons every edge is load-bearing, because there is no texture detail to fall back on and the silhouette has to carry the whole read.",
    ],
    tools: ["Blender", "Cycles"],
    // Read straight out of the published .glb: run `npm run model-stats`.
    //
    // This is the whole file, ocean included. It was not always: the first
    // export carried a 131,072-triangle subdivided ocean plane that made a
    // genuinely low poly island look like anything but. Rebuilt at 1,352, the
    // scene is now honestly described by its own total, which is the better
    // thing to publish.
    specs: [
      { label: "Triangles", value: "7,421" },
      { label: "Meshes", value: "5" },
      { label: "Materials", value: "5" },
      { label: "Model size", value: "164 KB" },
      { label: "Published", value: "July 2026" },
    ],
    poster: "low-poly-island/poster.jpg",
    posterAlt:
      "Low poly render of a small island at sea with a rowboat on the shore",
    model: "low-poly-island/island.glb",
    video: "",
    artstation: "https://www.artstation.com/artwork/5e8JBJ",
  },
  {
    slug: "lego-batman",
    index: "03",
    title: "Lego Batman",
    titleLines: ["Lego", "Batman"],
    discipline: "Character",
    filters: ["character", "hard-surface"],
    tags: ["Character", "Hard surface"],
    year: "2026",
    blurb: "The first original piece: a LEGO Batman minifigure, built from scratch.",
    body: [
      "My first original 3D model. I am a big fan of the LEGO games, so LEGO Batman was what I wanted to make the moment I had enough Blender under my belt to attempt something of my own.",
      "A minifigure looks simple and is not. Every form is hard-surface with exact proportions that people know by eye, so anything slightly off reads immediately as wrong even to someone who could not tell you why.",
    ],
    tools: ["Blender", "Cycles"],
    // Read straight out of the published .glb: run `npm run model-stats`.
    specs: [
      { label: "Triangles", value: "145,386" },
      { label: "Materials", value: "8" },
      { label: "Textures", value: "4, up to 1K" },
      { label: "Model size", value: "4.9 MB" },
      { label: "Published", value: "July 2026" },
    ],
    poster: "lego-batman/poster.jpg",
    posterAlt: "Render of a LEGO Batman minifigure modelled in Blender",
    model: "lego-batman/batman.glb",
    video: "",
    artstation: "https://www.artstation.com/artwork/kw4GXK",
  },
];

export const filters: { label: string; value: "all" | FilterTag }[] = [
  { label: "All", value: "all" },
  { label: "Character", value: "character" },
  { label: "Environment", value: "environment" },
  { label: "Hard surface", value: "hard-surface" },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string): Project {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}

/**
 * The still shown behind the homepage headline.
 *
 * Captured from the site's own viewer rather than taken from ArtStation, so it
 * carries the same lighting, tone mapping and near-black stage as the live
 * canvases below it. James's published renders have their own backdrops, which
 * looked wrong sitting above three dark plates.
 *
 * A still rather than a fourth live viewer: it keeps the largest paint on the
 * page off the GPU entirely.
 */
export const heroStill = {
  image: "lego-batman/hero.jpg",
  alt: "Render of a LEGO Batman minifigure, lit against a near-black background",
};
