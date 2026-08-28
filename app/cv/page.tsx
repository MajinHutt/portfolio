import type { Metadata } from "next";
import Link from "next/link";
import { getCvStatus } from "@/lib/cv";
import { site } from "@/lib/site";
import { ProtectedCvDownload } from "@/components/human/ProtectedCvDownload";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "CV",
  description: `Curriculum vitae for ${site.name}, ${site.role}.`,
};

/**
 * Two states, one page.
 *
 * When the PDF exists this is a clean download page. When it does not, it is a
 * deliberate fallback rather than a dead link: it says so plainly, gives the
 * direct email, and still hands a visitor the facts a CV would have carried.
 * Studio leads and admissions tutors do not forgive a broken CV link, and they
 * do not enjoy an empty page either.
 */
export default function CvPage() {
  const cv = getCvStatus();

  return (
    <>
      <section className="border-b-2 border-divider">
        <div className="mx-auto grid max-w-page grid-cols-1 min-[900px]:grid-cols-[380px_1fr]">
          <div className="px-4 pb-2 pt-7 min-[900px]:border-r-2 min-[900px]:border-divider min-[900px]:py-9 min-[900px]:pl-10 min-[900px]:pr-8">
            <p className="t-eyebrow mb-3 text-accent-400">Curriculum vitae</p>
            <h1 className="t-h2 text-fg">
              {cv.available ? "Download" : "Off the shelf"}
            </h1>
          </div>

          <div className="px-4 pb-8 pt-2 min-[900px]:px-10 min-[900px]:py-9">
            {cv.available ? (
              <p className="mb-6 max-w-[60ch] text-[17px] leading-[1.5] text-fg">
                The current CV, as a PDF. It covers education, software
                proficiency, and the projects shown in this portfolio.
              </p>
            ) : (
              <>
                <p className="mb-4 max-w-[60ch] text-[19px] leading-[1.45] text-fg">
                  The CV is being rebuilt at the moment. Rather than hand you a
                  stale document, here is the direct line.
                </p>
                <p className="mb-7 max-w-[60ch] text-[15px] leading-[1.6] text-fg-muted">
                  Email James and ask for it: he will send the current version,
                  along with anything specific you need, such as a breakdown
                  reel, source files, or references.
                </p>
              </>
            )}

            <ProtectedCvDownload
              available={cv.available}
              href={cv.href}
              size={cv.size}
            />
          </div>
        </div>
      </section>

      {/* Shown in both states: a visitor who clicked "CV" wants these facts,
          and should not have to go hunting for them. */}
      <section className="border-b-2 border-divider">
        <div className="mx-auto grid max-w-page grid-cols-1 min-[900px]:grid-cols-[380px_1fr]">
          <div className="px-4 pb-2 pt-7 min-[900px]:border-r-2 min-[900px]:border-divider min-[900px]:py-9 min-[900px]:pl-10 min-[900px]:pr-8">
            <h2 className="t-h2 text-fg">At a glance</h2>
          </div>

          <div className="px-4 pb-8 pt-2 min-[900px]:px-10 min-[900px]:py-9">
            <dl>
              {[
                { label: "Discipline", value: site.role },
                { label: "Primary toolset", value: site.toolset.join(", ") },
                {
                  label: "Portfolio pieces",
                  value: `${projects.length} published`,
                },
                { label: "Available for", value: "Studio placements, freelance modelling" },
                { label: "Contact", value: "See the contact page" },
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
                className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider px-[18px] py-[10px] text-fg no-underline transition-colors duration-[140ms] ease-out hover:bg-[rgba(247,246,245,0.1)]"
              >
                See the work &rarr;
              </Link>
              <Link
                href="/contact"
                className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider px-[18px] py-[10px] text-fg no-underline transition-colors duration-[140ms] ease-out hover:bg-[rgba(247,246,245,0.1)]"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
