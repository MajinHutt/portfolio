import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

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

/** From James's CV. Years are the award year. */
const EDUCATION = [
  {
    title: "Level 3 Diploma Practitioner in Personal Training (RQF)",
    where: "",
    year: "2026",
  },
  {
    title: "Level 3 Award in Emergency First Aid at Work (RQF)",
    where: "",
    year: "2026",
  },
  {
    title: "A Levels: Geography, Biology, Economics",
    where: "Malmesbury Sixth Form",
    year: "2025",
  },
  {
    title:
      "GCSEs: English Language, English Literature, Maths, Science, Sports Science, Creative iMedia, Geography",
    where: "Malmesbury Comprehensive School",
    year: "2023",
  },
];

const EXPERIENCE = [
  {
    title: "Fitness coach and personal trainer",
    where: "PureGym Chippenham",
    year: "May to Aug 2026",
  },
  { title: "Team member", where: "Co-op Lyneham", year: "Jul to Dec 2025" },
  {
    title: "Work experience",
    where: "PD Fitness Malmesbury",
    year: "Jul 2024",
  },
  {
    title: "Team member",
    where: "Co-op Malmesbury",
    year: "Jun to Sep 2024",
  },
  {
    title: "Assistant coach",
    where: "Ignition Tennis",
    year: "2021 to 2023",
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
            <ul>
              {EDUCATION.map((row, i) => (
                <li
                  key={row.title}
                  className={`flex flex-col gap-1 py-4 min-[600px]:flex-row min-[600px]:items-baseline min-[600px]:justify-between min-[600px]:gap-8 ${
                    i > 0 ? "border-t border-divider-light" : ""
                  }`}
                >
                  <div>
                    <p className="text-[15px] font-semibold leading-[1.4] text-fg">
                      {row.title}
                    </p>
                    {row.where && (
                      <p className="mt-1 text-[13px] text-fg-muted">{row.where}</p>
                    )}
                  </div>
                  <span className="t-eyebrow shrink-0 text-accent-400">
                    {row.year}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Experience: not 3D work, and presented as such. It is here because an
          admissions tutor reads a part-time job history as evidence of somebody
          who turns up, and the coaching roles are where the biomechanics
          knowledge in the About text actually came from. */}
      <section className="border-b-2 border-divider">
        <div className="mx-auto grid max-w-page grid-cols-1 min-[900px]:grid-cols-[380px_1fr]">
          <div className="px-4 pb-2 pt-7 min-[900px]:border-r-2 min-[900px]:border-divider min-[900px]:py-9 min-[900px]:pl-10 min-[900px]:pr-8">
            <h2 className="t-h2 text-fg">Experience</h2>
          </div>

          <div className="px-4 pb-8 pt-2 min-[900px]:px-10 min-[900px]:py-9">
            <ul className="mb-7">
              {EXPERIENCE.map((row, i) => (
                <li
                  key={`${row.title}-${row.where}`}
                  className={`flex flex-col gap-1 py-4 min-[600px]:flex-row min-[600px]:items-baseline min-[600px]:justify-between min-[600px]:gap-8 ${
                    i > 0 ? "border-t border-divider-light" : ""
                  }`}
                >
                  <div>
                    <p className="text-[15px] font-semibold leading-[1.4] text-fg">
                      {row.title}
                    </p>
                    <p className="mt-1 text-[13px] text-fg-muted">{row.where}</p>
                  </div>
                  <span className="t-eyebrow shrink-0 text-fg-muted">
                    {row.year}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2">
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
