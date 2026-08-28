import type { Metadata } from "next";
import { CvLink } from "@/components/CvLink";
import { ContactOptions, type ContactSubject } from "@/components/human/ContactOptions";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}, ${site.role}.`,
};

/**
 * Deliberately a mailto rather than a form.
 *
 * A form needs a server endpoint to receive it, which would mean a serverless
 * function, which is the one thing on this site that meters on Vercel and can
 * lead to a bill. It would also need spam handling. A mailto costs nothing,
 * cannot break, and reaches the same inbox. See docs/COST-CONTROLS.md.
 */

const SUBJECTS: ContactSubject[] = [
  {
    label: "Studio or placement enquiry",
    subject: "Placement enquiry",
    body: "Hello James,\n\nI am getting in touch about a placement or studio opportunity.\n\n",
  },
  {
    label: "Freelance modelling",
    subject: "Freelance modelling enquiry",
    body: "Hello James,\n\nI would like to discuss a freelance modelling project.\n\n",
  },
  {
    label: "Request the CV",
    subject: "CV request",
    body: "Hello James,\n\nPlease could you send across your current CV.\n\n",
  },
  {
    label: "Something else",
    subject: "Hello",
    body: "Hello James,\n\n",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b-2 border-divider">
        <div className="mx-auto grid max-w-page grid-cols-1 min-[900px]:grid-cols-[380px_1fr]">
          <div className="px-4 pb-2 pt-7 min-[900px]:border-r-2 min-[900px]:border-divider min-[900px]:py-9 min-[900px]:pl-10 min-[900px]:pr-8">
            <h1 className="t-h2 text-fg">Contact</h1>
          </div>

          <div className="px-4 pb-8 pt-2 min-[900px]:px-10 min-[900px]:py-9">
            <p className="mb-6 max-w-[56ch] text-[17px] leading-[1.5] text-fg min-[900px]:text-[19px]">
              The quickest route is email. Pick whichever line fits and it will
              open a message with the subject already filled in.
            </p>

            <ContactOptions subjects={SUBJECTS} />
          </div>
        </div>
      </section>

      <section className="border-b-2 border-divider">
        <div className="mx-auto grid max-w-page grid-cols-1 min-[900px]:grid-cols-[380px_1fr]">
          <div className="px-4 pb-2 pt-7 min-[900px]:border-r-2 min-[900px]:border-divider min-[900px]:py-9 min-[900px]:pl-10 min-[900px]:pr-8">
            <h2 className="t-h2 text-fg">Elsewhere</h2>
          </div>

          <div className="px-4 pb-8 pt-2 min-[900px]:px-10 min-[900px]:py-9">
            <ul className="mb-7 border-t-2 border-divider">
              {site.links.map((link) => (
                <li key={link.label} className="border-b-2 border-divider">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 py-4 no-underline"
                  >
                    <span className="text-[15px] font-semibold text-fg transition-colors duration-[140ms] ease-out group-hover:text-accent-400">
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-[15px] text-fg-muted transition-transform duration-[200ms] ease-out group-hover:translate-x-1 group-hover:text-accent-400 motion-reduce:transition-none"
                    >
                      &rarr;
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <p className="t-eyebrow mb-3 text-fg-muted">Available for</p>
            <p className="mb-6 text-[24px] font-extrabold leading-[1.2] tracking-h3 text-fg">
              Studio placements, freelance modelling
            </p>

            <CvLink
              label="Curriculum vitae"
              className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider bg-accent px-[18px] py-3 text-white no-underline transition-colors duration-[140ms] ease-out hover:bg-accent-700"
            />
          </div>
        </div>
      </section>
    </>
  );
}
