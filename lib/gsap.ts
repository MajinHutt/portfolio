"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * One place to register GSAP plugins. Importing this module more than once is
 * safe: registerPlugin is idempotent, and the guard keeps it off the server
 * where `document` does not exist.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // The site's motion vocabulary: short, eased out, never bouncy. A Modernist
  // system should not wobble.
  gsap.defaults({ ease: "power2.out", duration: 0.6 });
}

export { gsap, ScrollTrigger };

/** True when the visitor has asked for less motion. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
