"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";
import { CvLink } from "@/components/CvLink";

/**
 * Full-width bar. Not sticky (the spec says sticky isn't required, and the hero
 * reads better without it). Nav items stretch the full bar height and are
 * divided by 2px rules: structure is drawn, not implied.
 *
 * Below 600px the nav collapses to a text "MENU" toggle that expands a panel
 * *inline beneath the header* (not an overlay), per the mobile mock. No
 * hamburger icon: this system uses words.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="border-b-2 border-divider bg-accent">
      <div className="mx-auto flex max-w-page items-stretch">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-2 border-r-2 border-divider px-4 py-[14px] no-underline min-[600px]:gap-3 min-[600px]:px-10 min-[600px]:py-5"
        >
          <span className="text-[17px] font-black uppercase leading-none tracking-h3 text-white min-[600px]:text-[20px]">
            {site.name}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-eyebrow text-[rgba(255,255,255,0.85)] min-[600px]:text-[11px]">
            <span className="min-[600px]:hidden">3D</span>
            <span className="hidden min-[600px]:inline">{site.shortRole}</span>
          </span>
        </Link>

        {/* Desktop / tablet nav */}
        <nav aria-label="Main" className="ml-auto hidden items-stretch min-[600px]:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="t-nav flex items-center border-l-2 border-divider px-6 text-white no-underline transition-colors duration-[140ms] ease-out hover:bg-accent-700"
            >
              {item.label}
            </Link>
          ))}
          <CvLink className="t-nav flex items-center border-l-2 border-divider bg-ink px-7 font-extrabold text-white no-underline transition-colors duration-[140ms] ease-out hover:bg-panel" />
        </nav>

        {/* Mobile toggle: a word, not an icon. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="t-nav ml-auto border-l-2 border-divider px-[18px] text-white transition-colors duration-[140ms] ease-out hover:bg-accent-700 min-[600px]:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Inline panel, not an overlay. */}
      {open && (
        <div
          id="mobile-nav"
          className="border-t-2 border-divider bg-panel pb-4 min-[600px]:hidden"
        >
          <nav aria-label="Mobile">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-[14px] text-[24px] font-extrabold uppercase tracking-h3 text-fg no-underline transition-colors duration-[140ms] ease-out hover:text-accent-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <CvLink className="mx-4 mt-2 block border-2 border-divider bg-accent px-4 py-3 text-center text-[20px] font-extrabold uppercase tracking-h3 text-white no-underline" />
        </div>
      )}
    </header>
  );
}
