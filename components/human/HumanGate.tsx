"use client";

import { useEffect, useState } from "react";
import {
  markVerified,
  pickChallenge,
  useHumanVerified,
  type Challenge,
} from "@/lib/human";

/**
 * Wraps anything that should not be visible to an automated crawler.
 *
 * Children are a function rather than plain nodes, so the protected value (an
 * email address, a download link) is not merely hidden: it is never
 * constructed at all until the check passes.
 *
 * Once passed, it stays passed for the session, so a visitor answers at most
 * one question no matter how many protected links they use.
 */
export function HumanGate({
  prompt,
  children,
  className = "",
  onUnlock,
}: {
  /** Label on the button that opens the check. */
  prompt: string;
  children: () => React.ReactNode;
  className?: string;
  /** Fired once, when the check is passed. */
  onUnlock?: () => void;
}) {
  const verified = useHumanVerified();
  const [open, setOpen] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [wrong, setWrong] = useState(false);

  // Chosen on the client so the server-rendered markup is always identical.
  useEffect(() => {
    if (open && !challenge) setChallenge(pickChallenge());
  }, [open, challenge]);

  if (verified) return <>{children()}</>;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`t-button inline-flex items-center whitespace-nowrap border-2 border-divider px-[18px] py-[10px] text-fg transition-colors duration-[140ms] ease-out hover:bg-[rgba(247,246,245,0.1)] ${className}`}
      >
        {prompt}
      </button>
    );
  }

  return (
    <div className="border-2 border-divider p-4">
      <p className="t-eyebrow mb-1 text-fg-muted">Quick check</p>
      <p className="mb-3 text-[15px] text-fg" id="human-question">
        {challenge?.question ?? "Loading the question"}
      </p>

      <div
        role="group"
        aria-labelledby="human-question"
        className="flex flex-wrap gap-2"
      >
        {challenge?.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              if (option === challenge.answer) {
                markVerified();
                onUnlock?.();
              } else {
                setWrong(true);
                setChallenge(pickChallenge());
              }
            }}
            className="t-button border-2 border-divider px-4 py-2 text-fg transition-colors duration-[140ms] ease-out hover:bg-[rgba(247,246,245,0.1)]"
          >
            {option}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-3 text-[13px] text-fg-muted">
        {wrong
          ? "Not quite. Here is another one."
          : "This keeps the address away from spam bots."}
      </p>
    </div>
  );
}
