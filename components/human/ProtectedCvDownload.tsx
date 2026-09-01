"use client";

import { HumanGate } from "./HumanGate";
import { buildMailto, decodeEmail } from "@/lib/human";

/**
 * The CV, behind the check, in both of its states.
 *
 * A caveat worth being straight about: the PDF sits at a fixed, guessable URL
 * in /public, so anything that already knows the path can fetch it directly.
 * The check keeps the file out of casual crawls and stops the address being
 * harvested from this page; it is not access control. Making it real would
 * need a server to hold the file behind, which this site deliberately does not
 * have. See docs/COST-CONTROLS.md.
 */
export function ProtectedCvDownload({
  available,
  href,
  size,
}: {
  available: boolean;
  href: string;
  size: string | null;
}) {
  return (
    <HumanGate
      prompt={available ? "Verify to download" : "Verify to show email"}
      className="border-2 border-divider bg-accent text-white hover:bg-accent-700"
    >
      {() =>
        available ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider bg-accent px-[18px] py-3 text-white no-underline transition-colors duration-[140ms] ease-out hover:bg-accent-700"
          >
            Download CV {size ? `(PDF, ${size})` : "(PDF)"} &darr;
          </a>
        ) : (
          <a
            href={buildMailto(
              "CV request",
              "Hello James,\n\nI came across your portfolio and would like a copy of your CV.\n\n",
            )}
            className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider bg-accent px-[18px] py-3 text-white no-underline transition-colors duration-[140ms] ease-out hover:bg-accent-700"
          >
            Email {decodeEmail()} &rarr;
          </a>
        )
      }
    </HumanGate>
  );
}
