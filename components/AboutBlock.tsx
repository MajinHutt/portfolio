import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Desktop: a `380px 1fr` split where the left cell holds nothing but the H2:
 * the whitespace is deliberate and structural, not an oversight.
 *
 * The block ends in a full-bleed band linking to the About page. That band is
 * deliberately the loudest non-project element on the homepage, because for a
 * university application the writing carries as much weight as the renders,
 * and a reader who only ever sees three thumbnails has judged half the work.
 * A nav item alone is too easy to miss.
 */
export function AboutBlock() {
  return (
    <section id="about" className="border-b-2 border-divider scroll-mt-4">
      <div className="mx-auto grid max-w-page grid-cols-1 min-[900px]:grid-cols-[380px_1fr]">
        <div className="px-4 pb-2 pt-7 min-[900px]:border-r-2 min-[900px]:border-divider min-[900px]:py-9 min-[900px]:pl-10 min-[900px]:pr-8">
          <h2 className="t-h2 text-fg">About</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 px-4 pb-7 pt-2 min-[900px]:grid-cols-[1fr_300px] min-[900px]:gap-12 min-[900px]:px-10 min-[900px]:py-9">
          <p className="text-[16px] leading-[1.5] text-fg min-[900px]:text-[19px]">
            {site.aboutBody}
          </p>

          <div>
            <p className="t-eyebrow mb-3 text-fg-muted">Toolset</p>
            <ul className="mb-6 flex flex-wrap gap-2">
              {site.toolset.map((tool) => (
                <li
                  key={tool}
                  className="t-tag border border-divider px-[10px] py-[7px] text-fg min-[900px]:py-[6px]"
                >
                  {tool}
                </li>
              ))}
            </ul>

            {/* Kept separate from the art tools: a modeller reading this should
                not have to sort Blender from Vercel. */}
            <p className="t-eyebrow mb-3 text-fg-muted">Site built with</p>
            <ul className="flex flex-wrap gap-2">
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

      <Link
        href="/about"
        className="group block border-t-2 border-divider bg-panel no-underline transition-colors duration-[140ms] ease-out hover:bg-accent"
      >
        <div className="mx-auto flex max-w-page items-center justify-between gap-6 px-4 py-7 min-[900px]:px-10 min-[900px]:py-8">
          <div>
            <p className="t-eyebrow mb-2 text-[rgba(247,246,245,0.65)] transition-colors duration-[140ms] ease-out group-hover:text-[rgba(255,255,255,0.8)]">
              The thinking behind the work
            </p>
            <p className="t-h3 text-white min-[900px]:text-[32px]">
              Learn more about me as an artist
            </p>
          </div>
          <span
            aria-hidden="true"
            className="shrink-0 text-[26px] text-white transition-transform duration-300 ease-out group-hover:translate-x-2 motion-reduce:transition-none min-[900px]:text-[32px]"
          >
            &rarr;
          </span>
        </div>
      </Link>
    </section>
  );
}
