import Image from "next/image";
import { asset } from "@/lib/assets";

/**
 * The near-black render plate. Every image on the site sits on one of these:
 * it's the core visual idea of the design, so it is a single component rather
 * than repeated markup.
 *
 * Images are served straight from the CDN with `unoptimized`: renders are
 * pre-exported as AVIF/WebP by James, so Vercel's image-optimisation quota
 * (a Hobby-tier limit) buys us nothing here. We still use next/image for the
 * reserved aspect box (no layout shift) and native lazy-loading.
 */
export function Plate({
  src,
  alt,
  priority = false,
  sizes = "100vw",
  className = "",
  imageClassName = "",
  children,
}: {
  src: string | null | undefined;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
  children?: React.ReactNode;
}) {
  const url = asset(src);

  return (
    <div className={`relative overflow-hidden bg-stage ${className}`}>
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          unoptimized
          className={`object-cover ${imageClassName}`}
        />
      ) : (
        <EmptyPlate />
      )}
      {children}
    </div>
  );
}

/**
 * Shown when an asset hasn't been produced or uploaded yet. Deliberately quiet:
 * it should read as an intentional empty frame, not a broken image.
 */
export function EmptyPlate() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <span className="t-eyebrow text-[10px] text-[rgba(243,242,242,0.32)]">
        Render pending
      </span>
    </div>
  );
}
