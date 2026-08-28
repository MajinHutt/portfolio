import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { site } from "./site";

/**
 * SERVER ONLY. Do not import this from a "use client" component: it touches the
 * filesystem. Client components receive `cvAvailable` as a prop instead.
 *
 * The CV is a real file at public/james-hutt-cv.pdf. Rather than shipping a
 * "CV" link that leads to a 404, the site checks at build time whether the file
 * is actually there and routes the link accordingly:
 *
 *   present : the link downloads the PDF directly
 *   missing : the link goes to /cv, which explains and offers email instead
 *
 * Drop the PDF in, push, and every CV link on the site switches over on its own.
 */

export type CvStatus = {
  available: boolean;
  /** Human-readable size, for the download button. */
  size: string | null;
  /** Where a CV link should point right now. */
  href: string;
  /** Whether the arrow suffix makes sense (it only does for a real download). */
  isDownload: boolean;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function getCvStatus(): CvStatus {
  const path = join(process.cwd(), "public", site.cvPath.replace(/^\//, ""));

  if (!existsSync(path)) {
    return { available: false, size: null, href: "/cv", isDownload: false };
  }

  let size: string | null = null;
  try {
    size = formatBytes(statSync(path).size);
  } catch {
    // A stat failure is not worth failing the build over: the file exists,
    // which is the part that matters.
  }

  return { available: true, size, href: site.cvPath, isDownload: true };
}
