"use client";

/**
 * Last resort: catches an error thrown by the root layout itself, where
 * app/error.tsx cannot help because the layout that would wrap it is the thing
 * that failed.
 *
 * It has to render its own <html> and <body>, and it cannot rely on the site's
 * fonts or Tailwind classes for the same reason, so the styling is inline and
 * deliberately minimal. It should almost never be seen.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "#44403c",
          color: "#f7f6f5",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <main style={{ padding: "40px", maxWidth: "60ch" }}>
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#ff9783",
            }}
          >
            Something went wrong
          </p>
          <h1
            style={{
              margin: "0 0 16px",
              fontSize: "34px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            That did not load
          </h1>
          <p style={{ margin: "0 0 28px", lineHeight: 1.55, color: "#c9c4c1" }}>
            Refreshing usually fixes it. If it keeps happening, James can be
            reached through the contact page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: "2px solid rgba(247,246,245,0.5)",
              background: "#dd2b0f",
              color: "#ffffff",
              padding: "12px 18px",
              fontSize: "13px",
              fontWeight: 800,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
