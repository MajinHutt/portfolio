import type { Config } from "tailwindcss";

/**
 * Modernist design system: tokens ported verbatim from the design handoff.
 * Rule of the system: zero radius, no shadows, structure drawn with 2px rules.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark stone-grey ground. Every value here is verified against WCAG AA
        // by scripts/check-contrast.mjs: run `npm run check-contrast` after
        // changing any of them.
        bg: "#44403c", // page ground
        surface: "#524d48", // card hover
        panel: "#2b2724", // footer, mobile menu, active chip
        ink: "#201e1d", // darkest surface (CV cell)
        stage: "#16150f", // render plates
        fg: {
          DEFAULT: "#f7f6f5", // primary text
          muted: "#c9c4c1", // secondary text
        },
        accent: {
          DEFAULT: "#dd2b0f", // brand red: nav bar, buttons, badges
          200: "#ffe0d9",
          400: "#ff9783", // red text on dark ground
          500: "#ff563c",
          700: "#ae1800", // hover on red
          800: "#7c1405",
        },
        neutral: {
          200: "#eae7e7",
          800: "#444141",
        },
      },
      borderColor: {
        // Rules are light on a dark ground, and heavier than the original
        // light-theme values so they clear the 3:1 non-text threshold.
        divider: "rgba(247,246,245,0.5)",
        "divider-light": "rgba(247,246,245,0.45)",
        "on-dark-rule": "rgba(247,246,245,0.25)",
      },
      fontFamily: {
        sans: ["var(--font-archivo)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        display: "-0.035em",
        h2: "-0.03em",
        h3: "-0.02em",
        eyebrow: "0.14em",
        nav: "0.12em",
        flag: "0.16em",
        tag: "0.08em",
      },
      maxWidth: {
        page: "1440px",
      },
      transitionDuration: {
        DEFAULT: "140ms",
      },
    },
  },
  plugins: [],
};
export default config;
