import Link from "next/link";
import { Plate } from "@/components/Plate";
import { heroStill, projects } from "@/lib/projects";
import { site } from "@/lib/site";

/**
 * Desktop: a `1fr 420px` split: live 3D on the left plate, support column right.
 * Mobile: the plate stacks on top at 420px, the red flag moves to the plate's
 * top-left so it can't fight the model, and the H1 drops onto the light ground.
 */
export function Hero() {
  return (
    <section className="border-b-2 border-divider">
      <div className="mx-auto grid max-w-page grid-cols-1 min-[900px]:min-h-[620px] min-[900px]:grid-cols-[1fr_360px] min-[1200px]:grid-cols-[1fr_420px]">
        {/* ── Plate ─────────────────────────────────────────────────────── */}
        <div className="relative">
          {/* A still, not a viewer: see heroStill in lib/projects.ts. */}
          <Plate
            src={heroStill.image}
            alt={heroStill.alt}
            priority
            sizes="(max-width: 899px) 100vw, 70vw"
            className="h-[420px] w-full min-[900px]:h-full min-[900px]:min-h-[620px]"
          />

          {/* Mobile flag: flush top-left of the plate. */}
          <span className="pointer-events-none absolute left-0 top-0 z-10 bg-accent px-3 py-[6px] text-[11px] font-extrabold uppercase tracking-flag text-white min-[900px]:hidden">
            Selected work
          </span>

          {/* Desktop overlay: flag + H1, bottom-left, over the render. */}
          <div className="pointer-events-none absolute inset-0 hidden flex-col justify-end p-10 min-[900px]:flex">
            <span className="mb-4 w-fit bg-accent px-3 py-[6px] text-[11px] font-extrabold uppercase tracking-flag text-white">
              Selected work
            </span>
            <h1 className="t-hero text-fg [text-shadow:0_2px_40px_rgba(0,0,0,0.55)]">
              {site.heroWords.map((word) => (
                <span key={word} className="block">
                  {word}
                </span>
              ))}
            </h1>

            {/* Deliberately much smaller than the three words above it: the
                headline is the statement, this is the footnote that explains
                it. Width is capped so it never runs the full plate. */}
            <p className="mt-5 max-w-[54ch] text-[15px] leading-[1.55] text-fg [text-shadow:0_2px_24px_rgba(0,0,0,0.75)] min-[1200px]:text-[16px]">
              {site.heroSub}
            </p>
          </div>
        </div>

        {/* ── Support column ────────────────────────────────────────────── */}
        <div className="flex flex-col min-[900px]:border-l-2 min-[900px]:border-divider">
          <div className="border-b-2 border-divider px-4 pb-7 pt-6 min-[900px]:px-8 min-[900px]:pb-7 min-[900px]:pt-8">
            {/* Mobile: the words and their footnote sit on the solid ground
                rather than over the render, where the smaller line would be
                hard to read. Hidden on desktop, where the overlay carries it. */}
            <div className="min-[900px]:hidden">
              <h1 className="t-hero mb-4 text-fg">
                {site.heroWords.map((word) => (
                  <span key={word} className="block">
                    {word}
                  </span>
                ))}
              </h1>

              <p className="mb-6 text-[15px] leading-[1.55] text-fg">
                {site.heroSub}
              </p>
            </div>

            {/* Stacked, not side by side: the support column is 420px at most,
                and the two labels together overflow it. */}
            <div className="flex flex-col items-start gap-2">
              <Link
                href="/#portfolio"
                className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider bg-accent px-[18px] py-3 text-white no-underline transition-colors duration-[140ms] ease-out hover:bg-accent-700"
              >
                Browse portfolio &rarr;
              </Link>
              {/* A second route to the writing, above the fold, for a reader who
                  never scrolls as far as the band at the foot of the About
                  block. */}
              <Link
                href="/about"
                className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider px-[18px] py-[10px] text-fg no-underline transition-colors duration-[140ms] ease-out hover:bg-[rgba(247,246,245,0.1)]"
              >
                About the artist
              </Link>
            </div>
          </div>

          {/* Stat pair */}
          <div className="grid grid-cols-2 border-b-2 border-divider">
            {site.stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-4 py-4 min-[900px]:px-8 min-[900px]:py-5 ${
                  i > 0 ? "border-l-2 border-divider" : ""
                }`}
              >
                <div className="text-[30px] font-black leading-[1.1] tracking-h2 text-fg min-[900px]:text-[34px]">
                  {stat.value}
                </div>
                <div className="t-eyebrow mt-1 text-fg-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Index: desktop only; on mobile the cards below do this job.
              The column is taller than the index needs, so the space above it
              carries a third route through to the writing rather than sitting
              empty. */}
          <div className="hidden flex-1 flex-col justify-between px-8 py-7 min-[900px]:flex">
            <Link href="/about" className="group block no-underline">
              <p className="t-eyebrow mb-2 text-fg-muted transition-colors duration-[140ms] ease-out group-hover:text-accent-400">
                Behind the work
              </p>
              <p className="text-[15px] leading-[1.5] text-fg">
                Why I model, what I have learned so far, and where I want to
                take it next.{" "}
                <span className="whitespace-nowrap font-semibold text-accent-400">
                  Read more &rarr;
                </span>
              </p>
            </Link>

            <div>
              <p className="t-eyebrow mb-3 text-fg-muted">Index</p>
              <ul>
                {projects.map((project, i) => (
                  <li
                    key={project.slug}
                    className={`border-t border-divider-light ${
                      i === projects.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <Link
                      href={`/work/${project.slug}`}
                      className="group flex items-baseline justify-between gap-4 py-[9px] no-underline transition-colors duration-[140ms] ease-out hover:text-accent-400"
                    >
                      <span className="text-[15px] font-semibold text-fg transition-colors duration-[140ms] ease-out group-hover:text-accent-400">
                        {project.index}: {project.title}
                      </span>
                      <span className="shrink-0 text-[11px] uppercase tracking-nav text-fg-muted transition-colors duration-[140ms] ease-out group-hover:text-accent-400">
                        {project.discipline}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
