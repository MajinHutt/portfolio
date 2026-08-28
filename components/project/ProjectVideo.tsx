"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/assets";

/**
 * Animation playback.
 *
 * A real <video> element with controls and sound available: never autoplay
 * with audio, which is both hostile and blocked by every modern browser.
 *
 * `preload="none"` until the strip scrolls close to the viewport, at which
 * point it becomes `metadata`. That keeps a multi-megabyte clip off the wire
 * for visitors who never scroll to it, which matters on a free CDN.
 */
export function ProjectVideo({
  src,
  poster,
  title,
}: {
  src: string;
  poster: string;
  title: string;
}) {
  const [near, setNear] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const videoUrl = asset(src);
  const posterUrl = asset(poster);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!videoUrl) return null;

  return (
    <div ref={wrapRef} className="border-t-2 border-divider bg-stage">
      <video
        controls
        playsInline
        preload={near ? "metadata" : "none"}
        poster={posterUrl ?? undefined}
        title={title}
        className="h-auto w-full"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser cannot play this video. Download it here:{" "}
        <a href={videoUrl}>{title}</a>
      </video>
    </div>
  );
}
