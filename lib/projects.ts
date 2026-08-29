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
 * INTERIM POSTERS: the `poster` fields currently point at James's own images on
 * ArtStation's CDN, so the grid shows real work rather than empty plates. They
 * are his images, but they are served from someone else's bandwidth and the
 * URLs can change without warning. Replace each one with a path on our own CDN
 * (for example "red-velvet-chair/poster.jpg") as soon as the files are
 * uploaded. See docs/ASSET-HOSTING.md.
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
    specs: [
      { label: "Software", value: "Blender" },
      { label: "Focus", value: "Materials and lighting" },
      { label: "Reference", value: "Modelled from life" },
      { label: "Published", value: "August 2026" },
    ],
    poster: "https://cdna.artstation.com/p/assets/images/images/101/292/820/large/james-hutt-chair-3.jpg?1785749895",
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
    specs: [
      { label: "Software", value: "Blender" },
      { label: "Style", value: "Low poly" },
      { label: "Subject", value: "Island and rowboat" },
      { label: "Published", value: "July 2026" },
    ],
    poster: "https://cdna.artstation.com/p/assets/images/images/100/998/966/large/james-hutt-ocean-island.jpg?1784743820",
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
    specs: [
      { label: "Software", value: "Blender" },
      { label: "Subject", value: "LEGO Batman minifigure" },
      { label: "Note", value: "First original piece" },
      { label: "Published", value: "July 2026" },
    ],
    poster: "https://cdnb.artstation.com/p/assets/images/images/100/653/549/large/james-hutt-lego-batman.jpg?1783602265",
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

/** The piece rendered live in the homepage hero. */
export const heroProject = projects[0];
