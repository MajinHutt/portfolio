"use client";

import { HumanGate } from "./HumanGate";
import { buildMailto, decodeEmail } from "@/lib/human";

/**
 * A mailto link that does not exist until a human asks for it.
 * The visible address and the href are both built after the check.
 */
export function ProtectedEmail({
  subject = "Hello",
  body = "Hello James,\n\n",
  /** Show the address itself, rather than a label. */
  showAddress = false,
  label = "Email James",
  className = "",
  prompt = "Show email",
}: {
  subject?: string;
  body?: string;
  showAddress?: boolean;
  label?: string;
  className?: string;
  prompt?: string;
}) {
  return (
    <HumanGate prompt={prompt}>
      {() => (
        <a href={buildMailto(subject, body)} className={className}>
          {showAddress ? decodeEmail() : label}
        </a>
      )}
    </HumanGate>
  );
}
