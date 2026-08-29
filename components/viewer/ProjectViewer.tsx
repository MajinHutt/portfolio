"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/assets";
import { EmptyPlate } from "@/components/Plate";
import { VIEWER_MODES, type ViewerMode } from "./types";

/**
 * three.js + drei are ~600KB gzipped. Keeping them behind next/dynamic with
 * `ssr: false` means they are never in the initial bundle, and the code is only
 * fetched once the stage actually scrolls near the viewport (see `nearViewport`).
 */
const ModelStage = dynamic(() => import("./ModelStage"), {
  ssr: false,
  loading: () => null,
});

export function ProjectViewer({
  modelPath,
  poster,
  posterAlt,
  /** Show the Shaded/Wireframe/Clay controls and the orbit hint. */
  controls = true,
  /** Off for the hero, so the wheel scrolls the page instead of zooming. */
  allowZoom = true,
  className = "",
  /** Applied to the outer wrapper, so a caller can make the stage fill a column. */
  wrapperClassName = "",
}: {
  modelPath: string;
  poster: string;
  posterAlt: string;
  controls?: boolean;
  allowZoom?: boolean;
  className?: string;
  wrapperClassName?: string;
}) {
  const [mode, setMode] = useState<ViewerMode>("shaded");
  const [nearViewport, setNearViewport] = useState(false);
  // Separate from `nearViewport`: that one latches on to mount the canvas,
  // this one keeps tracking so the render loop can be paused when scrolled away.
  const [onScreen, setOnScreen] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const modelUrl = asset(modelPath);
  const posterUrl = asset(poster);

  // Mount the heavy canvas only when the stage is close to being seen.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setNearViewport(true);
      return;
    }

    // Mount the canvas once the stage is within 400px of the viewport.
    const mountObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNearViewport(true);
          mountObserver.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    mountObserver.observe(el);

    // Then keep watching, so scrolling past it stops the render loop rather
    // than leaving a GPU spinning on an off-screen canvas.
    const activeObserver = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { rootMargin: "120px" },
    );
    activeObserver.observe(el);

    return () => {
      mountObserver.disconnect();
      activeObserver.disconnect();
    };
  }, []);

  const handleProgress = useCallback((p: number) => setProgress(p), []);
  const handleLoaded = useCallback(() => setLoaded(true), []);
  // A dropped WebGL context (tab backgrounded on mobile, driver reset) should
  // fall back to the poster rather than leaving an empty plate.
  const handleContextLost = useCallback(() => setLoaded(false), []);

  // The progress overlay is only meaningful when a .glb is actually streaming.
  const showLoading = Boolean(modelUrl) && !loaded && nearViewport;

  const activeLabel =
    VIEWER_MODES.find((m) => m.value === mode)?.label ?? "Shaded";

  return (
    <div className={wrapperClassName}>
      <div ref={containerRef} className={`relative bg-stage ${className}`}>
        {/* Poster sits underneath as the pre-load state. Plain <img> because it
            is a decorative under-layer that must paint immediately. */}
        {posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={posterUrl}
            alt={posterAlt}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              loaded ? "opacity-0" : "opacity-100"
            }`}
          />
        ) : (
          !loaded && <EmptyPlate />
        )}

        {nearViewport && (
          <div className="absolute inset-0">
            <ModelStage
              url={modelUrl}
              mode={mode}
              allowZoom={allowZoom}
              active={onScreen}
              onProgress={handleProgress}
              onLoaded={handleLoaded}
              onContextLost={handleContextLost}
            />
          </div>
        )}

        {/* Determinate loading state over the poster. */}
        {showLoading && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
            <div className="mb-2 text-[11px] font-extrabold uppercase tracking-nav text-[rgba(243,242,242,0.7)]">
              Loading model {Math.round(progress)}%
            </div>
            <div
              className="h-[2px] w-full bg-[rgba(243,242,242,0.2)]"
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Loading 3D model"
            >
              <div
                className="h-full bg-accent transition-[width] duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {controls && (
          <>
            {/* Desktop cluster: inset into the stage, top-left. */}
            <div
              role="group"
              aria-label="Display mode"
              className="absolute left-4 top-4 hidden border border-[rgba(243,242,242,0.35)] bg-[rgba(22,21,15,0.72)] min-[600px]:flex"
            >
              {VIEWER_MODES.map((m, i) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMode(m.value)}
                  aria-pressed={mode === m.value}
                  className={`flex items-center gap-[7px] px-[14px] py-2 text-[11px] font-extrabold uppercase tracking-nav text-fg transition-colors duration-[140ms] ease-out hover:bg-[rgba(247,246,245,0.14)] ${
                    i > 0 ? "border-l border-[rgba(243,242,242,0.35)]" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-[7px] w-[7px] ${
                      mode === m.value ? "bg-accent" : "bg-transparent"
                    }`}
                  />
                  {m.label}
                </button>
              ))}
            </div>

            {/* Hint + current mode chip, bottom-right. */}
            <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-3 min-[600px]:bottom-4 min-[600px]:right-4">
              <span className="text-[11px] uppercase tracking-nav text-[rgba(243,242,242,0.7)]">
                <span className="hidden min-[600px]:inline">
                  Drag to orbit &middot; scroll to zoom
                </span>
                <span className="min-[600px]:hidden">Drag to orbit</span>
              </span>
              <span className="bg-accent px-2 py-1 text-[11px] font-extrabold uppercase tracking-nav text-white">
                {activeLabel}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Mobile: the segments move out of the stage into their own bar, so the
          controls clear a 44px touch target and stop covering the model. */}
      {controls && (
        <div
          role="group"
          aria-label="Display mode"
          className="flex bg-panel min-[600px]:hidden"
        >
          {VIEWER_MODES.map((m, i) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              aria-pressed={mode === m.value}
              className={`flex flex-1 items-center justify-center gap-[7px] px-2 py-[15px] text-[11px] font-extrabold uppercase tracking-nav text-fg ${
                i > 0 ? "border-l border-on-dark-rule" : ""
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-[7px] w-[7px] ${
                  mode === m.value ? "bg-accent" : "bg-transparent"
                }`}
              />
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
