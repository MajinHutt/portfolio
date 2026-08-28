import Link from "next/link";

/**
 * Every CV link on the site routes to /cv rather than straight to the PDF.
 *
 * That page holds the download behind the human check, and handles the case
 * where the PDF does not exist yet by offering email instead. Putting the
 * challenge on one page keeps it out of the header bar, where a puzzle would
 * be baffling, and means a visitor meets it at the moment it makes sense.
 */
export function CvLink({
  label = "CV",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Link href="/cv" className={className}>
      {label}
    </Link>
  );
}
