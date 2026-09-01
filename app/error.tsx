"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Client-side error boundary.
 *
 * THE CASE THIS MOSTLY EXISTS FOR
 * JavaScript chunk filenames are content-hashed, and Vercel removes the old
 * ones when a new build goes live. A visitor who had the site open across a
 * deploy is holding HTML that points at chunks which no longer exist, so the
 * next link they click fetches a 404 and React unmounts the whole tree. Next's
 * default for that is a bare "Application error: a client-side exception has
 * occurred", which tells a visitor nothing and offers them no way out.
 *
 * A stale page can only be fixed by fetching a fresh one, so that case reloads
 * itself, once. The sessionStorage guard matters: without it, an error that
 * survives the reload would loop forever, which is worse than the original
 * problem.
 *
 * Anything else gets a branded page with a way back, because on a site being
 * read by an admissions tutor an unstyled browser error is its own small
 * failure.
 */

const RELOAD_GUARD = "jh-chunk-reload";

/** Signatures of a stale-deploy failure, across browsers. */
const STALE_BUILD = [
  "chunkloaderror",
  "loading chunk",
  "loading css chunk",
  "failed to fetch dynamically imported module",
  "error loading dynamically imported module",
  "importing a module script failed",
];

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const text = `${error?.name ?? ""} ${error?.message ?? ""}`.toLowerCase();
    const isStale = STALE_BUILD.some((sig) => text.includes(sig));
    if (!isStale) return;

    try {
      if (sessionStorage.getItem(RELOAD_GUARD)) return; // already tried once
      sessionStorage.setItem(RELOAD_GUARD, "1");
    } catch {
      return; // no storage means no loop protection, so do not reload
    }

    window.location.reload();
  }, [error]);

  return (
    <section className="border-b-2 border-divider">
      <div className="mx-auto max-w-page px-4 py-16 min-[900px]:px-10 min-[900px]:py-24">
        <p className="t-eyebrow mb-3 text-accent-400">Something went wrong</p>
        <h1 className="t-h2 mb-4 text-fg">That did not load</h1>
        <p className="mb-7 max-w-[54ch] text-[16px] leading-[1.55] text-fg-muted">
          This usually means the page had been open for a while and the site was
          updated underneath it. Refreshing almost always fixes it.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              try {
                sessionStorage.removeItem(RELOAD_GUARD);
              } catch {
                /* nothing to clear */
              }
              reset();
            }}
            className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider bg-accent px-[18px] py-3 text-white transition-colors duration-[140ms] ease-out hover:bg-accent-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="t-button inline-flex items-center whitespace-nowrap border-2 border-divider px-[18px] py-[10px] text-fg no-underline transition-colors duration-[140ms] ease-out hover:bg-[rgba(247,246,245,0.1)]"
          >
            Back to the portfolio &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
