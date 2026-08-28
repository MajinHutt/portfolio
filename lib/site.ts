/**
 * Single place for everything that isn't a project.
 * James: edit the values here, nothing else needs to change.
 */
export const site = {
  name: "James Hutt",
  role: "3D Artist & Modeller",
  shortRole: "3D Artist",
  /**
   * The live production URL, verified to serve this site.
   *
   * Do not shorten or "tidy" this by hand. A shorter vercel.app domain that
   * merely returns HTTP 200 may belong to somebody else entirely: an earlier
   * edit set this to portfolio-flax-pi.vercel.app, which is another person's
   * portfolio. Run `npm run check-url` after any change here.
   *
   * Replace with a custom domain if one is ever bought, then push.
   */
  url: "https://portfolio-flax-pi-n17wrr08c7.vercel.app",
  tagline:
    "Self-taught 3D artist and modeller working in Blender. Clean topology, honest materials, and models built to be rigged and animated: not just to look good in one frame.",
  availableFor: ["Studio placements,", "freelance modelling"],
  /**
   * ROT13 of the real address. It is never written out in the markup, so a
   * crawler scraping HTML for an email pattern finds nothing. It is assembled
   * in the browser only after the human check passes. See lib/human.ts.
   */
  emailEncoded: "wcsuhgg@tznvy.pbz",
  links: [
    { label: "ArtStation", href: "https://www.artstation.com/" }, // TODO: your profile URL
    { label: "Instagram", href: "https://www.instagram.com/" }, // TODO: your profile URL
    { label: "LinkedIn", href: "https://www.linkedin.com/" }, // TODO: your profile URL
  ],
  cvPath: "/james-hutt-cv.pdf",
  /** Art and look-development tools: what the work is made in. */
  toolset: ["Blender", "Cycles", "Geometry Nodes", "Substance", "Krita"],
  /** How the portfolio itself is built and shipped. */
  workflowTools: ["GitHub", "Vercel", "Claude"],
  stats: [
    { value: "4", label: "Projects" },
    { value: "Blender", label: "Primary toolset" },
  ],
  aboutBody:
    "I taught myself Blender in 2023 and have been modelling most days since. I care about the parts nobody sees in a render: edge flow that survives a subdivision, UVs that don't stretch when a shape key fires, rigs another animator could pick up. I'm applying to study 3D Animation at degree level to put that under proper direction.",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
