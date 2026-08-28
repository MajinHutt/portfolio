import Link from "next/link";
import { ProjectViewer } from "@/components/viewer/ProjectViewer";
import { heroProject, projects } from "@/lib/projects";
import { site } from "@/lib/site";
import { CvLink } from "@/components/CvLink";

const HERO_LINES = ["Modelling", "things that", "hold up", "in motion."];

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
          <ProjectViewer
            modelPath={heroProject.model}
            poster={heroProject.poster}
            posterAlt={heroProject.posterAlt}
            controls={false}
            allowZoom={false}
            className="h-[420px] w-full min-[900px]:h-full min-[900px]:min-h-[620px]"
          />

          {/* Mobile flag: flush top-left of the plate. */}
          <span className="pointer-events-none absolute left-0 top-0 z-10 bg-accent px-3 py-[6px] text-[11px] font-extrabold uppercase tracking-flag text-white min-[900px]:hidden">
            Selected work &middot; 2024&ndash;2026
          </span>

          {/* Desktop overlay: flag + H1, bottom-left, over the render. */}
          <div className="pointer-events-none absolute inset-0 hidden flex-col justify-end p-10 min-[900px]:flex">
            <span className="mb-4 w-fit bg-accent px-3 py-[6px] text-[11px] font-extrabold uppercase tracking-flag text-white">
              Selected work &middot; 2024&ndash;2026
            </span>
            <h1 className="t-hero text-fg [text-shadow:0_2px_40px_rgba(0,0,0,0.55)]">
              {HERO_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
          </div>
        </div>

        {/* ── Support column ────────────────────────────────────────────── */}
        <div className="flex flex-col min-[900px]:border-l-2 min-[900px]:border-divider">
          <div className="border-b-2 border-divider px-4 pb-7 pt-6 min-[900px]:px-8 min-[900px]:pb-7 min-[900px]:pt-8">
            {/* Mobile H1 lives on the light ground, not over the render. */}
            <h1 className="t-hero mb-4 text-fg min-[900px]:hidden">
              {HERO_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <p className="mb-6 text-[16px] leading-[1.5] text-fg min-[900px]:text-[17px]">
              {site.tagline}
            </p>

            <div className="flex flex-col gap-2 min-[600px]:flex-row">
              <Link
                href="/#portfolio"
                className="t-button inline-flex items-center justify-center whitespace-nowrap border-2 border-divider bg-accent px-[18px] py-[13px] text-white no-underline transition-colors duration-[140ms] ease-out hover:bg-accent-700 min-[600px]:justify-start min-[600px]:py-3"
              >
                Browse portfolio &rarr;
              </Link>
              <CvLink label="Curriculum vitae" className="t-button inline-flex items-center justify-center whitespace-nowrap border-2 border-divider px-[18px] py-[13px] text-fg no-underline transition-colors duration-[140ms] ease-out hover:bg-[rgba(247,246,245,0.1)] min-[600px]:justify-start min-[600px]:py-[10px]" />
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

          {/* Index: desktop only; on mobile the cards below do this job. */}
          <div className="hidden flex-1 flex-col justify-end px-8 py-7 min-[900px]:flex">
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
    </section>
  );
}
