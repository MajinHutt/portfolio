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
  /**
   * ROT13 of the real address. It is never written out in the markup, so a
   * crawler scraping HTML for an email pattern finds nothing. It is assembled
   * in the browser only after the human check passes. See lib/human.ts.
   */
  emailEncoded: "wcsuhgg@tznvy.pbz",
  links: [
    { label: "ArtStation", href: "https://www.artstation.com/james_hutt" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/james-hutt-3b518b385/",
    },
  ],
  cvPath: "/james-hutt-cv.pdf",
  /**
   * The three words that carry the hero, one per line, set large.
   */
  heroWords: ["Model.", "Learn.", "Repeat."],
  /**
   * The smaller line underneath them. James's own words, with two punctuation
   * fixes: a comma splice became a semicolon, and a stray comma before "how"
   * was removed.
   */
  heroSub:
    "Learning to model the intricate details that really create an experience, including the parts you don't see in the render. I learned how bodies move; now I want to learn from others how to create amazing animations.",

  /** Art and look-development tools: what the work is made in. */
  toolset: [
    "Blender",
    "Hard surface modelling",
    "Geometry Nodes",
    "Cycles rendering",
  ],
  /** How the portfolio itself is built and shipped. */
  workflowTools: ["GitHub", "Vercel", "Claude"],
  stats: [
    { value: "3", label: "Projects" },
    { value: "Blender", label: "Primary toolset" },
  ],
  aboutBody:
    "I taught myself Blender throughout 2026, but have been exposed to 3D animation most of my life with my Dad's work, including time with Autodesk and Unity, and he's often shared and taught me things along the way. I care about the parts nobody sees in a render: edge flow that survives a subdivision and UVs that don't stretch. With a diploma in Personal Training, I'm able to take expert understanding of biomechanics and planes of movement, to create the most compelling and realistic characters and scenes. I'm applying to study 3D Animation at degree level to take my creative ability to the next level and pursue a career in 3D modelling and design.",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
