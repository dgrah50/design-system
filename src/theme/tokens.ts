/**
 * Arc primitives as Chakra tokens: palettes, radii, sizes, type, easings and durations.
 * Semantic (light/dark aware) values live in semantic-tokens.ts.
 */

/* -------------------------------------------------------------------------- */
/* Radii                                                                       */
/* -------------------------------------------------------------------------- */

export const radiusPresets = {
  /** Default for this theme. */
  compact: { control: 14, panel: 20, surface: 24 },
  /** Arc registry defaults (registry/foundation.css). */
  registry: { control: 18, panel: 26, surface: 34 },
} as const

/** Switch the whole system between presets by changing this one line. */
export const radiusPreset: keyof typeof radiusPresets = "compact"

const r = radiusPresets[radiusPreset]

/* -------------------------------------------------------------------------- */
/* Contrast preset                                                             */
/* -------------------------------------------------------------------------- */

/**
 * `aa` (default) lifts the three values where Arc's own tokens fall under WCAG minimums:
 *  - fg.subtle (Arc 4.1:1 on white): text, placeholders and helper text, >= 4.5:1 on bg, bg.panel and bg.subtle.
 *  - border.control (Arc uses `border-strong`, 1.7:1): resting border of text fields, checkbox, radio and
 *    select triggers, >= 3:1 on bg and bg.panel (WCAG 1.4.11 non-text contrast).
 *  - control.track / trackHover: the unchecked switch track, >= 3:1 on the surface.
 * `arc` reproduces Arc's registry values exactly. Values are OKLCH lightness (%), neutral.
 * Dark `fg.subtle` is Arc's own 64%, which already passes (4.6:1 on bg.subtle). bg.muted (used by `subtle`
 * variants) only reaches 4.2-4.3:1, so those variants' placeholders use fg.muted instead (recipes/shared.ts).
 * The AA values are the lightest neutral greys that clear the ratio (see the report for measurements).
 */
export const contrastPresets = {
  aa: {
    fgSubtle: { light: 55, dark: 64 },
    controlBorder: { light: 66, dark: 51 },
    track: { light: 66, dark: 51 },
    trackHover: { light: 62, dark: 55 },
  },
  arc: {
    fgSubtle: { light: 59, dark: 64 },
    /** `null` = alias `border.emphasized` (Arc's `--border-strong`). */
    controlBorder: null,
    track: { light: 89.5, dark: 33 },
    trackHover: { light: 86, dark: 37 },
  },
} as const

/** Switch between "aa" (default) and "arc" (Arc's exact values) by changing this one line. */
export const contrastPreset: keyof typeof contrastPresets = "aa"

/* -------------------------------------------------------------------------- */
/* Colour scales                                                               */
/* -------------------------------------------------------------------------- */

const num = (n: number) => String(+n.toFixed(4)).replace(/^0\./, ".")
const oklch = (l: number, c: number, h: number) => `oklch(${+l.toFixed(2)}% ${num(c)} ${+h.toFixed(1)})`

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const

interface Anchors {
  /** Lightness (%), chroma and hue of the Arc light value, pinned to step 600. */
  l600: number
  c600: number
  h600: number
  /** Same for the Arc dark value, pinned to step 300. */
  l300: number
  c300: number
  h300: number
}

/**
 * Builds a 50-950 scale where 600 is exactly the Arc light tone and 300 exactly the
 * Arc dark tone. Only those two anchors are Arc values; every other step is DERIVED. Chroma tapers towards both ends; lightness is interpolated between
 * the anchors and extrapolated outwards.
 */
export function toneScale(a: Anchors) {
  const lerp = (x: number, y: number, t: number) => x + (y - x) * t
  const hueLerp = (from: number, to: number, t: number) => {
    const delta = ((to - from + 540) % 360) - 180
    return ((from + delta * t) % 360 + 360) % 360
  }
  const l: Record<string, number> = {
    "50": 97.5,
    "100": 94.5,
    "300": a.l300,
    "600": a.l600,
    "700": a.l600 * 0.86,
    "800": a.l600 * 0.72,
    "900": a.l600 * 0.58,
    "950": a.l600 * 0.45,
  }
  l["200"] = lerp(l["100"], l["300"], 0.5)
  l["400"] = lerp(a.l300, a.l600, 1 / 3)
  l["500"] = lerp(a.l300, a.l600, 2 / 3)
  const c: Record<string, number> = {
    "50": a.c600 * 0.1,
    "100": a.c600 * 0.22,
    "200": a.c300 * 0.55,
    "300": a.c300,
    "400": lerp(a.c300, a.c600, 1 / 3),
    "500": lerp(a.c300, a.c600, 2 / 3),
    "600": a.c600,
    "700": a.c600 * 0.92,
    "800": a.c600 * 0.78,
    "900": a.c600 * 0.6,
    "950": a.c600 * 0.42,
  }
  const hueAt = (s: string) => {
    if (s === "50" || s === "100" || s === "200" || s === "300") return a.h300
    if (s === "400") return hueLerp(a.h300, a.h600, 1 / 3)
    if (s === "500") return hueLerp(a.h300, a.h600, 2 / 3)
    return a.h600
  }
  return Object.fromEntries(STEPS.map((s) => [s, { value: oklch(l[s], c[s], hueAt(s)) }]))
}

/** Arc tone anchors (registry/foundation.css --tone-*), light = 600, dark = 300. */
export const toneAnchors = {
  teal: { l600: 50, c600: 0.095, h600: 182, l300: 79, c300: 0.13, h300: 182 },
  blue: { l600: 51, c600: 0.11, h600: 240, l300: 79, c300: 0.095, h300: 236 }, // Arc "sky"
  pink: { l600: 52, c600: 0.17, h600: 322, l300: 76, c300: 0.15, h300: 322 }, // Arc "orchid"
  purple: { l600: 51, c600: 0.16, h600: 290, l300: 74, c300: 0.125, h300: 290 }, // Arc "violet" tone
  red: { l600: 53, c600: 0.18, h600: 10, l300: 71, c300: 0.155, h300: 8 }, // Arc "rose"
  orange: { l600: 55, c600: 0.12, h600: 68, l300: 83, c300: 0.12, h300: 78 }, // Arc "amber"
  yellow: { l600: 55, c600: 0.12, h600: 68, l300: 83, c300: 0.12, h300: 78 }, // Arc "amber"
  green: { l600: 50, c600: 0.12, h600: 162, l300: 79, c300: 0.14, h300: 162 },
  // Derived, not an Arc tone: Chakra's `cyan` placed between teal (182) and sky (240) at the family's levels.
  cyan: { l600: 50, c600: 0.1, h600: 210, l300: 79, c300: 0.11, h300: 210 },
} as const

export type ToneName = keyof typeof toneAnchors

const gray = {
  "50": "oklch(97.8% 0 0)",
  "100": "oklch(95.8% 0 0)",
  "200": "oklch(91.5% 0 0)",
  "300": "oklch(84% 0 0)",
  "400": "oklch(72% 0 0)",
  "500": "oklch(59% 0 0)",
  "600": "oklch(46% 0 0)",
  "700": "oklch(34% 0 0)",
  "800": "oklch(23% 0 0)",
  "900": "oklch(15% 0 0)",
  "950": "oklch(10% 0 0)",
}

/**
 * Arc's violet accent (data-accent="violet"). 300 (#a78bff), 400 (#8a66ff), 500 (#7747ff), 600 (#5528ce) and
 * 200 (#c7b7ff) are Arc values; 50, 100 and 700-950 are derived to complete the scale.
 */
const brand = {
  "50": "#f5f1ff",
  "100": "#ece5ff",
  "200": "#c7b7ff",
  "300": "#a78bff",
  "400": "#8a66ff",
  "500": "#7747ff",
  "600": "#5528ce",
  "700": "#4320a3",
  "800": "#321878",
  "900": "#22104f",
  "950": "#150a33",
}

const wrap = (scale: Record<string, string>) => Object.fromEntries(Object.entries(scale).map(([k, v]) => [k, { value: v }]))

/* -------------------------------------------------------------------------- */
/* Motion                                                                      */
/* -------------------------------------------------------------------------- */

const spring =
  "linear(0, 0.0213, 0.0739, 0.1443, 0.2235, 0.305, 0.3849, 0.4606, 0.5305, 0.594, 0.6508, 0.7011, 0.7452, 0.7836, 0.8168, 0.8454, 0.8699, 0.8907, 0.9084, 0.9234, 0.9361, 0.9467, 0.9557, 0.9632, 0.9694, 0.9747, 0.979, 0.9826, 0.9857, 0.9882, 0.9902, 0.992, 0.9934, 0.9946, 0.9955, 0.9963, 1)"

const enter = "cubic-bezier(.16,1,.3,1)"
const standard = "cubic-bezier(.22,1,.36,1)"
const exit = "cubic-bezier(.7,0,.84,0)"
const inOut = "cubic-bezier(.65,0,.35,1)"

/* -------------------------------------------------------------------------- */
/* Tokens                                                                      */
/* -------------------------------------------------------------------------- */

export const tokens = {
  colors: {
    gray: wrap(gray),
    brand: wrap(brand),
    ...Object.fromEntries(Object.entries(toneAnchors).map(([name, a]) => [name, toneScale(a)])),
  },
  radii: {
    control: { value: `${r.control}px` },
    panel: { value: `${r.panel}px` },
    surface: { value: `${r.surface}px` },
    item: { value: `${r.control - 4}px` },
  },
  sizes: {
    // Control heights (button, input, textarea, select, native select, combobox, number input, pin input).
    // Every size is shared across them so controls of one size line up: sm 36, md 44, lg 50, xl 56, 2xl 64.
    // xl and 2xl are derived (Arc stops at lg); xs stays Chakra's 32.
    control: {
      sm: { value: "2.25rem" },
      md: { value: "2.75rem" },
      lg: { value: "3.125rem" },
      xl: { value: "3.5rem" },
      "2xl": { value: "4rem" },
    },
  },
  fonts: {
    heading: { value: '"Geist Variable", sans-serif' },
    body: { value: '"Inter Variable", sans-serif' },
    mono: { value: '"Geist Mono Variable", ui-monospace, monospace' },
  },
  fontSizes: {
    xs: { value: ".75rem" },
    sm: { value: ".875rem" },
    md: { value: "1rem" },
    lg: { value: "1.125rem" },
    xl: { value: "1.375rem" },
    "2xl": { value: "1.75rem" },
    "3xl": { value: "2.25rem" },
    "4xl": { value: "3.25rem" },
    "5xl": { value: "4.5rem" },
    // 6xl-9xl are derived (Arc stops at 5xl). Chakra's own 6xl-8xl (60/72/96px) would fall below 5xl or
    // out of order, so the whole display scale steps by 16px: 72, 88, 104, 120, 136.
    "6xl": { value: "5.5rem" },
    "7xl": { value: "6.5rem" },
    "8xl": { value: "7.5rem" },
    "9xl": { value: "8.5rem" },
  },
  letterSpacings: {
    body: { value: "-0.01em" },
    display: { value: "-0.03em" },
  },
  lineHeights: {
    body: { value: "1.4" },
    display: { value: "1.1" },
  },
  easings: {
    enter: { value: enter },
    standard: { value: standard },
    exit: { value: exit },
    "in-out": { value: inOut },
    spring: { value: spring },
    // Chakra's own names point at Arc's curves.
    "ease-out": { value: enter },
    "ease-in": { value: exit },
    "ease-in-out": { value: inOut },
    "ease-in-smooth": { value: standard },
  },
  durations: {
    instant: { value: "120ms" },
    standard: { value: "240ms" },
    considered: { value: "480ms" },
    spring: { value: "580ms" },
    // Chakra names remapped.
    faster: { value: "120ms" },
    fast: { value: "160ms" },
    moderate: { value: "240ms" },
    slow: { value: "480ms" },
    slower: { value: "580ms" },
  },
}
