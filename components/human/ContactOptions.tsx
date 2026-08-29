"use client";

import { HumanGate } from "./HumanGate";
import { buildMailto, decodeEmail } from "@/lib/human";
import { notify } from "@/lib/notify";

export type ContactSubject = {
  label: string;
  subject: string;
  body: string;
};

/**
 * The whole contact block behind a single check, rather than one per link.
 * A visitor answers at most one question and then has everything.
 *
 * The subject list arrives as plain data from the server component: only the
 * mailto hrefs are built here, and only after the check.
 */
export function ContactOptions({ subjects }: { subjects: ContactSubject[] }) {
  return (
    <HumanGate
      prompt="Show contact details"
      onUnlock={() => notify("Contact details revealed")}
    >
      {() => (
        <>
          <a
            href={buildMailto("Hello", "Hello James,\n\n")}
            onClick={() => notify("Email link clicked", "main address")}
            className="mb-8 block text-[22px] font-extrabold tracking-h3 text-fg no-underline transition-colors duration-[140ms] ease-out hover:text-accent-400 min-[900px]:text-[28px]"
          >
            {decodeEmail()}
          </a>

          <ul className="border-t-2 border-divider">
            {subjects.map((item) => (
              <li key={item.label} className="border-b-2 border-divider">
                <a
                  href={buildMailto(item.subject, item.body)}
                  onClick={() => notify("Email link clicked", item.label)}
                  className="group flex items-center justify-between gap-4 py-4 no-underline"
                >
                  <span className="text-[15px] font-semibold text-fg transition-colors duration-[140ms] ease-out group-hover:text-accent-400">
                    {item.label}
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
        </>
      )}
    </HumanGate>
  );
}
