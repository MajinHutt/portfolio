"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { Plate } from "@/components/Plate";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { filters, projects, type FilterTag } from "@/lib/projects";

/**
 * Client-side filtering with GSAP scroll reveals.
 *
 * Cards wipe up from the bottom edge as they enter the viewport, staggered.
 * A wipe rather than a fade, because this design draws structure with hard
 * rules and a soft dissolve would fight it.
 *
 * All motion lives inside a gsap.matchMedia block keyed to
 * `(prefers-reduced-motion: no-preference)`, so a visitor who asks for less
 * motion gets the finished layout immediately with nothing animating.
 */
export function PortfolioGrid() {
  const [active, setActive] = useState<"all" | FilterTag>("all");
  const rootRef = useRef<HTMLDivElement>(null);

  const visible =
    active === "all"
      ? projects
      : projects.filter((p) => p.filters.includes(active));

  // ── Scroll-triggered reveal ───────────────────────────────────────────────
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", root);

      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          { clipPath: "inset(0% 0% 100% 0%)", y: 28, opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            // Pairs within a row read as one movement, not two separate ones.
            delay: (i % 2) * 0.08,
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          },
        );
      });

      // The section heading leads the cards in.
      gsap.from("[data-grid-head]", {
        y: 18,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: { trigger: root, start: "top 92%", once: true },
      });
    });

    return () => mm.revert();
  }, []);

  // ── Filter change ─────────────────────────────────────────────────────────
  // Re-reveal the cards that remain, then refresh ScrollTrigger so its measured
  // positions survive the reflow.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>("[data-card]", root),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: "power2.out" },
      );
    });

    ScrollTrigger.refresh();
    return () => mm.revert();
  }, [active]);

  return (
    <section
      id="portfolio"
      ref={rootRef}
      className="scroll-mt-4 border-b-2 border-divider"
    >
      <div className="mx-auto max-w-page">
        {/* Header row */}
        <div
          data-grid-head
          className="px-4 pb-4 pt-7 min-[900px]:flex min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-6 min-[900px]:px-10 min-[900px]:pb-5 min-[900px]:pt-9"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="t-h2 text-fg">Portfolio</h2>
            <span className="t-eyebrow text-fg-muted min-[900px]:hidden">
              {projects.length.toString().padStart(2, "0")} works
            </span>
          </div>

          {/* Chips: horizontally scrollable on mobile, no visible scrollbar. */}
          <div
            role="group"
            aria-label="Filter projects by discipline"
            className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden min-[900px]:mx-0 min-[900px]:mt-0 min-[900px]:overflow-visible min-[900px]:px-0"
          >
            {filters.map((filter) => {
              const isActive = active === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActive(filter.value)}
                  aria-pressed={isActive}
                  className={`t-nav whitespace-nowrap px-[14px] py-[10px] transition-colors duration-[140ms] ease-out min-[900px]:px-3 min-[900px]:py-[6px] ${
                    isActive
                      ? "bg-fg font-extrabold text-panel"
                      : "border border-divider text-fg-muted hover:bg-[rgba(247,246,245,0.1)]"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 border-t-2 border-divider min-[900px]:grid-cols-2">
          {visible.map((project, i) => (
            <article
              key={project.slug}
              data-card
              className={`group border-b-2 border-divider transition-colors duration-[140ms] ease-out hover:bg-surface ${
                i % 2 === 0 ? "min-[900px]:border-r-2" : ""
              }`}
            >
              <Link
                href={`/work/${project.slug}`}
                className="block no-underline"
              >
                <div className="relative overflow-hidden">
                  <Plate
                    src={project.poster}
                    alt={project.posterAlt}
                    sizes="(max-width: 899px) 100vw, 50vw"
                    className="h-[260px] min-[900px]:h-[300px] min-[1200px]:h-[380px]"
                    imageClassName="transition-transform duration-[600ms] ease-out group-hover:scale-[1.04] motion-reduce:transform-none motion-reduce:transition-none"
                  />

                  {/* Index badge, flush into the plate's corner, no offset. */}
                  <span className="absolute left-0 top-0 z-10 bg-accent px-3 py-[6px] text-[11px] font-extrabold uppercase tracking-eyebrow text-white">
                    {project.index}
                  </span>

                  {/* Hover affordance: slides up from the plate's bottom edge. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 right-0 z-10 translate-y-full bg-panel px-3 py-[6px] text-[11px] font-extrabold uppercase tracking-eyebrow text-fg transition-transform duration-300 ease-out group-hover:translate-y-0 motion-reduce:transition-none"
                  >
                    View project &rarr;
                  </span>
                </div>

                <div className="flex flex-col gap-3 p-4 min-[900px]:flex-row min-[900px]:justify-between min-[900px]:gap-6 min-[900px]:px-6 min-[900px]:pb-[22px] min-[900px]:pt-5">
                  <div>
                    <h3 className="t-h3 mb-1 text-fg">{project.title}</h3>
                    <p className="text-[14px] leading-[1.55] text-fg-muted">
                      {project.blurb}
                    </p>
                  </div>
                  {/* Tags sit right on desktop, on their own row on mobile. */}
                  <div className="flex shrink-0 flex-row flex-wrap gap-[6px] min-[900px]:flex-col">
                    {project.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        className={`t-tag w-fit px-2 py-1 ${
                          ti === 0
                            ? "bg-accent-200 text-accent-800"
                            : "bg-neutral-200 text-neutral-800"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="px-4 py-10 text-[15px] text-fg-muted min-[900px]:px-10">
            Nothing under that discipline yet.
          </p>
        )}
      </div>
    </section>
  );
}
