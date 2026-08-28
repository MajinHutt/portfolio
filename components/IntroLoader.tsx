"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/lib/site";

/**
 * Wireframe to solid intro.
 *
 * An icosahedron is drawn edge by edge, its faces then fill in, and the whole
 * panel wipes away to reveal the site. It states the site's subject in about a
 * second and a half without a single word of explanation.
 *
 * Rules it obeys:
 *   - once per session only (sessionStorage), so it never becomes an obstacle
 *   - skipped outright under prefers-reduced-motion
 *   - dismissable with Escape, or by clicking, for anyone impatient
 *   - removed from the DOM afterwards, not just hidden
 *   - aria-hidden throughout: it carries no information a reader needs
 *
 * The geometry is computed here rather than hand-drawn so the projection is
 * exact, and it costs nothing: twenty triangles, resolved once at module load.
 */

const SESSION_KEY = "jh-intro-played";

// ── Icosahedron, projected once at module load ──────────────────────────────
const PHI = (1 + Math.sqrt(5)) / 2;

const VERTICES: [number, number, number][] = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
];

const FACES: [number, number, number][] = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];

/** Rotate for a three-quarter view, then project orthographically. */
function project() {
  const rx = 0.42;
  const ry = 0.62;
  const scale = 46;

  const points = VERTICES.map(([x, y, z]) => {
    // Y rotation
    const x1 = x * Math.cos(ry) + z * Math.sin(ry);
    const z1 = -x * Math.sin(ry) + z * Math.cos(ry);
    // X rotation
    const y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
    const z2 = y * Math.sin(rx) + z1 * Math.cos(rx);
    return { x: x1 * scale, y: -y2 * scale, z: z2 };
  });

  return FACES.map((face) => {
    const [a, b, c] = face.map((i) => points[i]);
    return {
      d: `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} L ${b.x.toFixed(2)} ${b.y.toFixed(2)} L ${c.x.toFixed(2)} ${c.y.toFixed(2)} Z`,
      // Painter's algorithm: draw the far faces first.
      depth: (a.z + b.z + c.z) / 3,
    };
  }).sort((p, q) => p.depth - q.depth);
}

const POLYGONS = project();

export function IntroLoader() {
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  // React StrictMode runs effects twice in development. A ref survives that
  // double invocation, so the intro is set up exactly once either way. Without
  // this the first pass would write the session flag and the second would read
  // it back and skip, meaning the animation never played in development.
  const started = useRef(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || started.current) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const alreadyPlayed = (() => {
      try {
        return sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        // Private mode or blocked storage: treat as not played, but the intro
        // is short enough that replaying it is no hardship.
        return false;
      }
    })();

    // Running in a layout effect means this happens before paint, so a skipped
    // intro never flashes.
    if (reduced || alreadyPlayed) {
      setMounted(false);
      return;
    }

    started.current = true;

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* not important enough to handle */
    }

    // Hold the page still while the panel is up.
    document.body.style.overflow = "hidden";

    // Scoped so the selector strings only ever match inside this panel.
    gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          setMounted(false);
        },
      });
      timeline.current = tl;

      tl.set("[data-face]", { strokeDashoffset: 400, fillOpacity: 0 })
        // 1. Draw the wireframe.
        .to("[data-face]", {
          strokeDashoffset: 0,
          duration: 0.55,
          stagger: 0.018,
          ease: "power2.inOut",
        })
        // 2. Fill to solid.
        .to(
          "[data-face]",
          { fillOpacity: 1, duration: 0.35, stagger: 0.012, ease: "power1.out" },
          "-=0.1",
        )
        // 3. The wordmark arrives on the solid form.
        .from("[data-intro-word]", { yPercent: 120, duration: 0.4 }, "-=0.35")
        // 4. Wipe the panel away upward.
        .to(
          rootRef.current,
          { yPercent: -100, duration: 0.6, ease: "power3.inOut" },
          "+=0.18",
        );
    }, root);

    // Deliberately no revert here: the StrictMode cleanup would otherwise tear
    // down a timeline that is still playing. The panel removes itself on
    // completion, so there is nothing left to leak.
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Let anyone skip it.
  useLayoutEffect(() => {
    if (!mounted) return;
    const skip = () => timeline.current?.progress(1);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      onClick={() => timeline.current?.progress(1)}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-panel"
    >
      <svg
        viewBox="-90 -90 180 180"
        width="180"
        height="180"
        className="overflow-visible"
        role="presentation"
      >
        {POLYGONS.map((poly, i) => (
          <path
            key={i}
            data-face
            d={poly.d}
            fill="#dd2b0f"
            fillOpacity={0}
            stroke="#f7f6f5"
            strokeWidth={1.25}
            strokeLinejoin="round"
            strokeDasharray={400}
            strokeDashoffset={400}
            // Alternating face tint keeps the solid form readable as a solid.
            style={{ fill: i % 3 === 0 ? "#dd2b0f" : "#44403c" }}
          />
        ))}
      </svg>

      <div className="mt-8 overflow-hidden">
        <p
          data-intro-word
          className="text-[13px] font-extrabold uppercase tracking-eyebrow text-fg"
        >
          {site.name}
        </p>
      </div>
    </div>
  );
}
