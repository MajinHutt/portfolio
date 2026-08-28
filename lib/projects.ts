/**
 * THE ONLY FILE YOU EDIT TO ADD A PROJECT.
 * Full walkthrough in docs/HOW-TO-ADD-PROJECT.md.
 *
 * Asset fields are paths *relative to your CDN base* (see lib/assets.ts).
 * Leave any of them as "" and the site renders a clean empty plate rather than
 * a broken image: so you can publish a project before every still is finished.
 */

export type Discipline = "Environment" | "Hard surface" | "Materials" | "Rigging";
export type FilterTag = "character" | "environment" | "animation";

export type Breakdown = {
  label: string;
  image: string;
  alt: string;
};

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
  /** Paragraph 1 = what it is. Paragraph 2 = the hardest problem, always. */
  body: [string, string];
  tools: string[];
  specs: { label: string; value: string }[];
  /** Landscape still shown on the card and as the viewer's pre-load poster. */
  poster: string;
  posterAlt: string;
  /** Draco/Meshopt-compressed .glb on your CDN. "" = poster only, no viewer. */
  model: string;
  /** Optional turntable/animation clip for the detail page. */
  video: string;
  breakdowns: Breakdown[];
};

export const projects: Project[] = [
  {
    slug: "low-poly-island",
    index: "01",
    title: "Low Poly Island",
    titleLines: ["Low Poly", "Island"],
    discipline: "Environment",
    filters: ["environment"],
    tags: ["Environment"],
    year: "2026",
    blurb:
      "Stylised terrain study: modular rocks, hand-placed foliage, one shader family.",
    body: [
      "A stylised island built as a topology exercise first and a render second. Every rock is a modular asset instanced with geometry nodes, so the silhouette can be recomposed without re-modelling anything.",
      "The hardest problem was keeping the shoreline reading as low-poly while the water sim needed density: solved with a separate mid-poly collision mesh hidden from camera.",
    ],
    tools: ["Blender 4.2", "Geometry Nodes", "Cycles", "Krita"],
    specs: [
      { label: "Tris", value: "184,320" },
      { label: "Texture sets", value: "3 × 2K" },
      { label: "Render time", value: "4m 12s / frame" },
      { label: "Duration", value: "3 weeks" },
    ],
    poster: "low-poly-island/poster.jpg",
    posterAlt:
      "Stylised low-poly island render with modular rock formations and hand-placed foliage",
    model: "low-poly-island/island.glb",
    video: "",
    breakdowns: [
      {
        label: "Wireframe",
        image: "low-poly-island/wireframe.jpg",
        alt: "Wireframe view showing the island's quad topology",
      },
      {
        label: "UV layout",
        image: "low-poly-island/uv.jpg",
        alt: "UV layout for the island's three texture sets",
      },
      {
        label: "Blockout",
        image: "low-poly-island/blockout.jpg",
        alt: "Early grey blockout of the island silhouette",
      },
    ],
  },
  {
    slug: "mug",
    index: "02",
    title: "Mug",
    titleLines: ["Ceramic", "Mug"],
    discipline: "Hard surface",
    filters: ["environment"],
    tags: ["Hard surface"],
    year: "2026",
    blurb: "Subdivision-ready ceramic: clean quad flow through the handle join.",
    // TODO James: replace both paragraphs with your own write-up.
    body: [
      "A deliberately small subject used to practise subdivision-ready hard-surface flow. The whole form is quads, with support loops placed by hand rather than bevelled after the fact.",
      "The hardest problem was the handle-to-body join: the first attempt pinched under subdivision. Rebuilding it as a clean transition into surrounding quads, then relaxing the neighbouring loops, fixed the shading without adding density.",
    ],
    tools: ["Blender 4.2", "Cycles", "Substance"],
    specs: [
      { label: "Tris", value: "TBC" },
      { label: "Texture sets", value: "TBC" },
      { label: "Render time", value: "TBC" },
      { label: "Duration", value: "TBC" },
    ],
    poster: "mug/poster.jpg",
    posterAlt: "Ceramic mug render with clean subdivision topology",
    model: "mug/mug.glb",
    video: "",
    breakdowns: [
      {
        label: "Wireframe",
        image: "mug/wireframe.jpg",
        alt: "Wireframe view of the mug's quad topology",
      },
      { label: "UV layout", image: "mug/uv.jpg", alt: "UV layout for the mug" },
      { label: "Blockout", image: "mug/blockout.jpg", alt: "Grey blockout of the mug form" },
    ],
  },
  {
    slug: "red-velvet-chair",
    index: "03",
    title: "Red Velvet Chair",
    titleLines: ["Red Velvet", "Chair"],
    discipline: "Materials",
    filters: ["environment"],
    tags: ["Materials", "Hard surface"],
    year: "2026",
    blurb: "Sculpted upholstery with a procedural velvet shader and simulated seams.",
    // TODO James: replace both paragraphs with your own write-up.
    body: [
      "A materials-led study: the geometry exists to serve the shader. The upholstery was sculpted for large forms, then cloth-simulated for the settle, with seams driven by a separate low-res guide mesh.",
      "The hardest problem was velvet's sheen falling apart at grazing angles. A layered shader, diffuse base plus a Fresnel-weighted sheen driven by the same procedural fibre noise: it held up under both studio and single-key lighting.",
    ],
    tools: ["Blender 4.2", "Cycles", "Substance"],
    specs: [
      { label: "Tris", value: "TBC" },
      { label: "Texture sets", value: "TBC" },
      { label: "Render time", value: "TBC" },
      { label: "Duration", value: "TBC" },
    ],
    poster: "red-velvet-chair/poster.jpg",
    posterAlt: "Red velvet armchair render with procedural velvet shader",
    model: "red-velvet-chair/chair.glb",
    video: "",
    breakdowns: [
      {
        label: "Wireframe",
        image: "red-velvet-chair/wireframe.jpg",
        alt: "Wireframe view of the chair",
      },
      { label: "UV layout", image: "red-velvet-chair/uv.jpg", alt: "UV layout for the chair" },
      {
        label: "Blockout",
        image: "red-velvet-chair/blockout.jpg",
        alt: "Grey blockout of the chair",
      },
    ],
  },
  {
    slug: "biped-rig-test",
    index: "04",
    title: "Biped Rig Test",
    titleLines: ["Biped", "Rig Test"],
    discipline: "Rigging",
    filters: ["character", "animation"],
    tags: ["Rigging", "Animation"],
    year: "2026",
    blurb: "IK/FK switching, corrective shape keys, and a 40-frame walk to prove it.",
    // TODO James: replace both paragraphs with your own write-up.
    body: [
      "A full biped control rig built to be handed to someone else. IK/FK switching on both limb chains, a space-switchable head and hands, and corrective shape keys firing off joint rotation rather than frame numbers.",
      "The hardest problem was shoulder deformation through the full range of raise. Driven correctives on the deltoid, plus a helper bone rotating at half the clavicle's value, kept the volume without candy-wrapping.",
    ],
    tools: ["Blender 4.2", "Rigify", "Cycles"],
    specs: [
      { label: "Bones", value: "TBC" },
      { label: "Controls", value: "TBC" },
      { label: "Cycle length", value: "40 frames" },
      { label: "Duration", value: "TBC" },
    ],
    poster: "biped-rig-test/poster.jpg",
    posterAlt: "Biped character rig test render showing control shapes",
    model: "biped-rig-test/rig.glb",
    video: "biped-rig-test/walk-cycle.mp4",
    breakdowns: [
      {
        label: "Wireframe",
        image: "biped-rig-test/wireframe.jpg",
        alt: "Wireframe of the biped mesh",
      },
      {
        label: "UV layout",
        image: "biped-rig-test/uv.jpg",
        alt: "UV layout for the character",
      },
      {
        label: "Blockout",
        image: "biped-rig-test/blockout.jpg",
        alt: "Rig control blockout",
      },
    ],
  },
];

export const filters: { label: string; value: "all" | FilterTag }[] = [
  { label: "All", value: "all" },
  { label: "Character", value: "character" },
  { label: "Environment", value: "environment" },
  { label: "Animation", value: "animation" },
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
