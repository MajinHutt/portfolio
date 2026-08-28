"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plate } from "@/components/Plate";
import { asset } from "@/lib/assets";
import type { Breakdown } from "@/lib/projects";

/**
 * The three breakdown stills, with a lightbox.
 *
 * These are the images a modeller actually wants to see: wireframe, UVs and
 * blockout. They are the proof behind the pretty render, so they get a proper
 * full-size view rather than a 190px thumbnail.
 *
 * The lightbox is a native <dialog>, which gives focus trapping, Escape to
 * close, and inertness of the page behind it without any of that being
 * hand-rolled.
 */

/** Labels shorten on narrow cells so they still fit at 390px. */
const SHORT: Record<string, string> = {
  Wireframe: "Wire",
  "UV layout": "UVs",
  Blockout: "Block",
};

export function BreakdownStrip({ breakdowns }: { breakdowns: Breakdown[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setOpen(null);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open !== null && !dialog.open) {
      dialog.showModal();
    } else if (open === null && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Arrow keys move between stills while the lightbox is up.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setOpen((i) => ((i ?? 0) + 1) % breakdowns.length);
      if (e.key === "ArrowLeft")
        setOpen((i) => ((i ?? 0) - 1 + breakdowns.length) % breakdowns.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, breakdowns.length]);

  const current = open !== null ? breakdowns[open] : null;
  const currentUrl = current ? asset(current.image) : null;

  return (
    <>
      <div className="grid grid-cols-3 border-t-2 border-divider">
        {breakdowns.map((item, i) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`View ${item.label} at full size`}
            className={`group relative block h-[120px] min-[900px]:h-[190px] ${
              i > 0 ? "border-l-2 border-divider" : ""
            }`}
          >
            <Plate
              src={item.image}
              alt={item.alt}
              sizes="(max-width: 899px) 33vw, 20vw"
              className="h-full w-full"
              imageClassName="transition-transform duration-500 ease-out group-hover:scale-[1.05] motion-reduce:transform-none"
            />
            <span className="absolute bottom-0 left-0 z-10 bg-panel px-[9px] py-[5px] text-[10px] font-extrabold uppercase tracking-nav text-fg">
              <span className="min-[900px]:hidden">
                {SHORT[item.label] ?? item.label}
              </span>
              <span className="hidden min-[900px]:inline">{item.label}</span>
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(null)}
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes it.
          if (e.target === dialogRef.current) close();
        }}
        className="m-0 h-full max-h-none w-full max-w-none bg-[rgba(22,21,15,0.94)] p-0 backdrop:bg-transparent"
      >
        {current && (
          <div className="flex h-full w-full flex-col">
            <div className="flex items-center justify-between border-b-2 border-on-dark-rule px-4 py-3 min-[900px]:px-10">
              <p className="t-eyebrow text-fg">{current.label}</p>
              <button
                type="button"
                onClick={close}
                className="t-nav px-2 py-2 text-fg transition-colors duration-[140ms] ease-out hover:text-accent-400"
              >
                Close
              </button>
            </div>

            <div className="flex min-h-0 flex-1 items-center justify-center p-4 min-[900px]:p-10">
              {currentUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUrl}
                  alt={current.alt}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="t-eyebrow text-fg-muted">
                  {current.label}: render pending
                </p>
              )}
            </div>

            <div className="flex items-center justify-between border-t-2 border-on-dark-rule px-4 py-3 min-[900px]:px-10">
              <p className="text-[11px] uppercase tracking-nav text-fg-muted">
                {(open ?? 0) + 1} of {breakdowns.length}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setOpen((i) => ((i ?? 0) - 1 + breakdowns.length) % breakdowns.length)
                  }
                  className="t-nav border border-on-dark-rule px-3 py-2 text-fg transition-colors duration-[140ms] ease-out hover:bg-[rgba(247,246,245,0.12)]"
                >
                  &larr; Prev
                </button>
                <button
                  type="button"
                  onClick={() => setOpen((i) => ((i ?? 0) + 1) % breakdowns.length)}
                  className="t-nav border border-on-dark-rule px-3 py-2 text-fg transition-colors duration-[140ms] ease-out hover:bg-[rgba(247,246,245,0.12)]"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
