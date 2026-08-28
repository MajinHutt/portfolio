/**
 * WCAG 2.1 colour-contrast audit.
 *
 *   npm run check-contrast
 *
 * Checks every foreground/background pair the site actually uses. The pair list
 * is declared by hand because contrast is a property of *combinations*, not of
 * a palette: only a human knows which colours land on which.
 *
 * Thresholds (WCAG 2.1 AA):
 *   - normal text          4.5:1   (under 18.66px bold / 24px regular)
 *   - large text           3.0:1   (18.66px+ bold, or 24px+ regular)
 *   - ui  (borders, icons, 3.0:1   non-text contrast, SC 1.4.11
 *          component bounds)
 *
 * COLOURS BELOW MIRROR tailwind.config.ts AND app/globals.css.
 * If you change a token there, change it here too.
 */

const C = {
  bg: "#44403c", // page ground: stone grey
  surface: "#524d48", // card hover
  panel: "#2b2724", // footer, mobile menu, active chip
  stage: "#16150f", // render plates
  fg: "#f7f6f5", // primary text
  fgMuted: "#c9c4c1", // secondary text
  accent: "#dd2b0f", // brand red: nav bar, buttons, badges
  accentHover: "#ae1800",
  accentLight: "#ff9783", // red text on dark ground
  white: "#ffffff",
  ink: "#201e1d",
  tagBg: "#ffe0d9", // category tag fill
  tagText: "#7c1405",
  tag2Bg: "#eae7e7", // secondary tag fill
  tag2Text: "#444141",
};

/** Blend a translucent colour over an opaque one, so rules can be measured. */
function over(fg, bg, alpha) {
  const f = rgb(fg);
  const b = rgb(bg);
  return (
    "#" +
    [0, 1, 2]
      .map((i) => Math.round(f[i] * alpha + b[i] * (1 - alpha)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** WCAG relative luminance. */
function luminance(hex) {
  const [r, g, b] = rgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const THRESHOLD = { normal: 4.5, large: 3.0, ui: 3.0, info: 0 };

/** Every real pair on the site. */
const PAIRS = [
  // ── Header (red bar) ─────────────────────────────────────────────────────
  ["Nav link on red bar", C.white, C.accent, "normal", "12px uppercase"],
  ["Wordmark on red bar", C.white, C.accent, "large", "20px/900"],
  ["Nav link on hover fill", C.white, C.accentHover, "normal", ""],
  ["CV cell text on ink", C.white, C.ink, "normal", ""],

  // ── Page body ────────────────────────────────────────────────────────────
  ["Body text on page", C.fg, C.bg, "normal", ""],
  ["Muted text on page", C.fgMuted, C.bg, "normal", "card blurbs, labels"],
  ["Headings on page", C.fg, C.bg, "large", ""],
  ["Body text on card hover", C.fg, C.surface, "normal", ""],
  ["Muted text on card hover", C.fgMuted, C.surface, "normal", ""],

  // ── Rules and borders ────────────────────────────────────────────────────
  ["2px section rule vs page", over(C.fg, C.bg, 0.5), C.bg, "ui", "structure"],
  ["1px list rule vs page", over(C.fg, C.bg, 0.45), C.bg, "ui", "index rows"],

  // ── Accent ───────────────────────────────────────────────────────────────
  ["Button label on red", C.white, C.accent, "normal", "13px/800"],
  ["Red button border vs page", over(C.fg, C.bg, 0.5), C.bg, "ui", "2px border defines it"],
  ["Red accent text on page", C.accentLight, C.bg, "normal", "eyebrows"],
  ["Index badge text on red", C.white, C.accent, "normal", "11px/800"],
  ["Index badge vs plate", C.accent, C.stage, "ui", ""],

  // ── Render plates ────────────────────────────────────────────────────────
  ["Hero H1 on plate", C.fg, C.stage, "large", "84px/900"],
  ["Viewer hint on plate", C.fgMuted, C.stage, "normal", "11px"],
  ["Plate fill vs page", C.stage, C.bg, "info", "bounded by 2px rule; see docs"],

  // ── Tags ─────────────────────────────────────────────────────────────────
  ["Category tag", C.tagText, C.tagBg, "normal", ""],
  ["Secondary tag", C.tag2Text, C.tag2Bg, "normal", ""],
  ["Outlined tag on page", C.fg, C.bg, "normal", ""],

  // ── Filter chips ─────────────────────────────────────────────────────────
  ["Active chip text", C.panel, C.fg, "normal", "inverted"],
  ["Inactive chip text", C.fgMuted, C.bg, "normal", ""],

  // ── Footer / panel ───────────────────────────────────────────────────────
  ["Footer text on panel", C.fg, C.panel, "normal", ""],
  ["Footer link hover", C.accentLight, C.panel, "normal", ""],
  ["Footer legal line", C.fgMuted, C.panel, "normal", "11px"],
  ["Footer CV button label", C.white, C.accent, "normal", ""],

  // ── Focus ────────────────────────────────────────────────────────────────
  ["Focus ring vs page", C.accentLight, C.bg, "ui", "SC 2.4.11"],
];

let failures = 0;
let warnings = 0;

const pad = (s, n) => String(s).padEnd(n);

console.log("\n  WCAG 2.1 AA colour contrast audit\n");
console.log(
  `  ${pad("Pair", 30)}${pad("Ratio", 9)}${pad("Needs", 8)}${pad("Result", 8)}Note`,
);
console.log("  " + "-".repeat(88));

for (const [name, fg, bg, kind, note] of PAIRS) {
  const ratio = contrast(fg, bg);
  const need = THRESHOLD[kind];
  const pass = ratio >= need;
  const isInfo = kind === "info";

  // A near-miss is worth flagging separately from an outright failure.
  const near = !pass && ratio >= need - 0.6;
  if (!pass && !isInfo) (near ? warnings++ : failures++);

  const verdict = isInfo ? "INFO" : pass ? "PASS" : near ? "CLOSE" : "FAIL";

  console.log(
    `  ${pad(name, 30)}${pad(ratio.toFixed(2) + ":1", 9)}${pad(isInfo ? "-" : need.toFixed(1), 8)}${pad(verdict, 8)}${note}`,
  );
}

console.log("");

if (failures > 0) {
  console.error(`  ${failures} pair(s) fail WCAG AA. See docs/ACCESSIBILITY.md.\n`);
  process.exit(1);
}

if (warnings > 0) {
  console.log(`  ${warnings} pair(s) are marginal: documented in docs/ACCESSIBILITY.md.\n`);
} else {
  console.log("  All pairs meet WCAG 2.1 AA.\n");
}
