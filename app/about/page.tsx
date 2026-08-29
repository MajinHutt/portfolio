import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "About",
  description: site.tagline,
};

/**
 * The long-form version of the homepage About block. Written for two readers
 * who want different things: an admissions tutor looking for evidence of
 * self-direction, and a studio lead looking for someone whose files they can
 * open without wincing.
 */

const SKILLS: { group: string; items: string[] }[] = [
  {
    group: "Modelling",
    items: [
      "Hard surface modelling",
      "Subdivision surface modelling",
      "Topology and edge flow",
      "Low poly and stylised forms",
    ],
  },
  {
    group: "Look development",
    items: [
      "Materials and shading in Cycles",
      "Lighting for realism",
      "Geometry Nodes",
      "UV layout without stretching",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Intro ───────────────────────────────────────────────────────── */}
      <section className="border-b-2 border-divider">
        <div className="mx-auto grid max-w-page grid-cols-1 min-[900px]:grid-cols-[380px_1fr]">
          <div className="px-4 pb-2 pt-7 min-[900px]:border-r-2 min-[900px]:border-divider min-[900px]:py-9 min-[900px]:pl-10 min-[900px]:pr-8">
            <h1 className="t-h2 text-fg">About</h1>
          </div>

          <div className="grid grid-cols-1 gap-8 px-4 pb-8 pt-2 min-[900px]:grid-cols-[1fr_300px] min-[900px]:gap-12 min-[900px]:px-10 min-[900px]:py-9">
            <div>
              <p className="mb-5 text-[17px] leading-[1.5] text-fg min-[900px]:text-[19px]">
                {site.aboutBody}
              </p>
              <p className="mb-5 text-[15px] leading-[1.6] text-fg-muted">
                Most of what I know came from rebuilding the same things until
                they stopped breaking. A LEGO minifigure taught me that simple
                forms are the least forgiving, because everyone already knows
                what they should look like. A dining chair from my own house
                taught me how far materials and lighting carry a render once the
                shape is right.
              </p>
              <p className="text-[15px] leading-[1.6] text-fg-muted">
                The personal training background is not a detour. Knowing how a
                body actually moves, which planes it moves through and what
                drives each motion, is the difference between a character that
                reads as alive and one that reads as posed.
              </p>
            </div>

            <div>
              <p className="t-eyebrow mb-3 text-fg-muted">Toolset</p>
              <ul className="mb-7 flex flex-wrap gap-2">
                {site.toolset.map((tool) => (
                  <li
                    key={tool}
                    className="t-tag border border-divider px-[10px] py-[7px] text-fg min-[900px]:py-[6px]"
                  >
                    {tool}
                  </li>
                ))}
              </ul>

              <p className="t-eyebrow mb-3 text-fg-muted">Site built with</p>
              <ul className="mb-7 flex flex-wrap gap-2">
                {site.workflowTools.map((tool) => (
                  <li
                    key={tool}
                    className="t-tag border border-divider px-[10px] py-[7px] text-fg-muted min-[900px]:py-[6px]"
                  >
                    {tool}
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </div>
      </section>

      {/* ── Skills ──────────────────────────────────────────────────────── */}
      <section className="border-b-2 border-divider">
        <div className="mx-auto grid max-w-page grid-cols-1 min-[900px]:grid-cols-[380px_1fr]">
          <div className="px-4 pb-2 pt-7 min-[900px]:border-r-2 min-[900px]:border-divider min-[900px]:py-9 min-[900px]:pl-10 min-[900px]:pr-8">
            <h2 className="t-h2 text-fg">Skills</h2>
          </div>

          <div className="grid grid-cols-1 min-[600px]:grid-cols-2">
            {SKILLS.map((column, i) => (
              <div
                key={column.group}
                className={`px-4 py-6 min-[600px]:px-6 min-[900px]:py-9 ${
                  i > 0
                    ? "border-t-2 border-divider min-[600px]:border-l-2 min-[600px]:border-t-0"
                    : ""
                }`}
              >
                <p className="t-eyebrow mb-4 text-accent-400">{column.group}</p>
                <ul>
                  {column.items.map((item, j) => (
                    <li
                      key={item}
                      className={`py-[9px] text-[14px] leading-[1.45] text-fg ${
                        j > 0 ? "border-t border-divider-light" : ""
                      }`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Education and goal ──────────────────────────────────────────── */}
      <section className="border-b-2 border-divider">
        <div className="mx-auto grid max-w-page grid-cols-1 min-[900px]:grid-cols-[380px_1fr]">
          <div className="px-4 pb-2 pt-7 min-[900px]:border-r-2 min-[900px]:border-divider min-[900px]:py-9 min-[900px]:pl-10 min-[900px]:pr-8">
            <h2 className="t-h2 text-fg">Education</h2>
          </div>

          <div className="px-4 pb-8 pt-2 min-[900px]:px-10 min-[900px]:py-9">
            {/*
              TODO James: your CV has not been supplied yet, so this section
              lists only what can be stated accurately. Add your A-level
              subjects and grades, the school or college names, and the dates
              for each, taken straight from the CV. Admissions tutors look for
              exactly these.
            */}
            <dl>
              {[
                { label: "Currently applying", value: "BA (Hons) 3D Animation" },
                { label: "Diploma", value: "Personal Training" },
                { label: "Software", value: "Blender, self-taught" },
                {
                  label: "Portfolio",
                  value: `${projects.length} pieces published`,
                },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className={`flex flex-col gap-1 py-3 min-[600px]:flex-row min-[600px]:items-baseline min-[600px]:justify-between min-[600px]:gap-6 ${
                    i > 0 ? "border-t border-divider-light" : ""
                  }`}
                >
                  <dt className="t-eyebrow shrink-0 text-fg-muted">{row.label}</dt>
                  <dd className="text-[15px] font-semibold text-fg min-[600px]:text-right">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                href="/#portfolio"
                className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider bg-accent px-[18px] py-3 text-white no-underline transition-colors duration-[140ms] ease-out hover:bg-accent-700"
              >
                See the work &rarr;
              </Link>
              <Link
                href="/contact"
                className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider px-[18px] py-[10px] text-fg no-underline transition-colors duration-[140ms] ease-out hover:bg-[rgba(247,246,245,0.1)]"
              >
                Get in touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
