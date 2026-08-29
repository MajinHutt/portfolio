# Accessibility

## Colour contrast

Run the audit any time:

```bash
npm run check-contrast
```

It's also part of `npm run guard`, so it runs on every build and every commit.
**A failing pair fails the build.**

The script checks 29 real foreground/background combinations against WCAG 2.1
AA: 4.5:1 for normal text, 3:1 for large text and non-text UI. Contrast is a
property of *combinations*, not of a palette, so the pair list in
`scripts/check-contrast.mjs` is maintained by hand. Add a row when you introduce
a new colour combination.

**Current status: all pairs meet WCAG 2.1 AA.**

### Decisions the audit forced

These aren't arbitrary: each one came from a measured failure.

**Pure white on the red bar, not the off-white.** The site's off-white
(`#f7f6f5`) on the brand red gives 4.27:1: a fail for 12px nav links. Pure
`#ffffff` gives 4.74:1 and passes. So text sitting on red is `text-white`
specifically, everywhere: nav links, button labels, index badges, the hero flag.

**The red is `#dd2b0f`, not `#ec3013`.** The original brand red gives only
4.19:1 against white: it fails for anything at body size. `#dd2b0f` (already a
step on the design system's own ramp) is visually near-identical and passes.
If the brighter red is ever wanted back, it can only be used for 24px+ text or
as a non-text fill.

**Primary buttons have a 2px border.** A filled `#dd2b0f` button sits at only
2.17:1 against the stone ground: below the 3:1 needed for a component boundary
(WCAG 1.4.11). The border is the same rule colour used everywhere else and
carries 3.72:1, so the button's edge is identifiable. It also happens to suit a
design system whose whole premise is that structure is drawn, not implied.

**Focus rings use the light red `#ff9783`, not the brand red.** `#dd2b0f`
against stone is 2.17:1: too weak to reliably indicate focus. The lighter step
gives 4.89:1.

**Rules were made heavier.** The original light theme used 40%/25% black rules.
Inverted onto a dark ground those became nearly invisible, so they're now 50%
and 45% white, measuring 3.72:1 and 3.32:1.

**Muted text lightened to `#c9c4c1`.** The original `#605d5d` would have been
unreadable on stone. The new value gives 5.94:1 on the page and 4.83:1 on the
card hover fill: the tightest passing pair on the site, so be careful changing
the hover colour.

**Tags kept their light fills.** The pink and grey tag pills stay light with
dark text (8.63:1 and 8.22:1). They read as inset labels against the dark page,
and inverting them would have cost contrast for no gain.

### The one thing that does not pass, and why

```
Plate fill vs page    1.78:1    INFO
```

The near-black render plates (`#16150f`) against the stone ground (`#44403c`)
are only 1.78:1 apart. This is marked INFO rather than FAIL because WCAG does
not require contrast between two adjacent decorative regions. SC 1.4.11 covers
the boundaries of *controls and meaningful graphics*, and every plate here is
bounded by a 2px rule measuring 3.72:1. The edges are identifiable; it's the
fills that are close.

**But it is a real design cost, and worth stating plainly.** The original
design put near-black plates on a light page specifically so renders would be
the darkest, loudest thing on screen. On a dark ground that separation is
mostly gone: the plates now read as slightly darker rectangles rather than as
inset windows. Once James's actual renders are in, and they are bright, saturated images
rather than flat black, the plates will separate on image content instead. It's the empty "render pending" state where the flatness shows most.

If that ever looks wrong, the fix is to lighten the page ground rather than to
darken the plates.

---

## Beyond colour

Already implemented:

- **Keyboard**: every interactive element is reachable, with a visible
  `:focus-visible` ring (never the browser default). A "Skip to content" link
  is the first tab stop.
- **Reduced motion**: `prefers-reduced-motion` disables the viewer's
  auto-rotate, the card image scale, and grid entrance animation.
- **Touch targets**: nav links, filter chips and viewer mode buttons all get
  raised vertical padding below 600px to clear 44px.
- **The 3D viewer** is supplementary, never the only source of information:
  every project's substance is in its write-up and specs, which are plain text.
- **Alt text** is a required field on every image in `lib/projects.ts`, so a new
  project can't be added without it.
- **Semantic structure**: one `<h1>` per page, `<nav>`/`<main>`/`<footer>`
  landmarks, `aria-pressed` on the filter and mode toggles, and a live
  `role="progressbar"` on model loading.

Not yet done:

- No screen-reader testing on real hardware (NVDA/VoiceOver). Worth doing once
  the site is live.
- The viewer has no keyboard-driven orbit. Users who cannot drag get the poster
  render, which is an acceptable fallback, but a keyboard control would be
  better. This matters slightly more now the breakdown stills have gone.
