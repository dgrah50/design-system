import { contrastPreset, contrastPresets, toneAnchors, type ToneName } from "./tokens"

const ink = "oklch(15% 0 0)"
const darkPanel = "oklch(21.5% 0 0)"

const ld = (light: string, dark: string) => ({ value: { _light: light, _dark: dark } })

const cp = contrastPresets[contrastPreset]
const grey = (l: number) => `oklch(${l}% 0 0)`
const greyPair = (p: { light: number; dark: number }) => ld(grey(p.light), grey(p.dark))

/* -------------------------------------------------------------------------- */
/* Tone palettes (teal, blue, pink, purple, red, orange, yellow, green, cyan)  */
/* -------------------------------------------------------------------------- */

function tonePalette(name: ToneName) {
  const a = toneAnchors[name]
  const c6 = `{colors.${name}.600}`
  const c3 = `{colors.${name}.300}`
  // Dark solid: a mid tone at L 62% (DERIVED: Arc's dark control fills sit at L 59-77% and this is the lowest
  // that keeps the hue lively). White on it measures only 3.4-4.0:1, so dark ink is used on top (4.9-5.7:1),
  // as Arc itself does for amber. Light solid is the Arc 600 tone with white (5.0-6.1:1).
  const darkSolid = `oklch(62% ${a.c600} ${a.h600})`
  // subtle / muted / emphasized / border / fg are DERIVED tints and shades of the 600 and 300 anchors (Arc only
  // defines the tone itself and a 10-14% tint of it).
  const mix = (c: string, pct: number, base: string) => `color-mix(in oklab, ${c} ${pct}%, ${base})`
  return {
    contrast: ld("white", ink),
    // Switch thumb when on: Arc keeps thumbs white on every accent (only neutral dark inverts).
    thumb: ld("white", "white"),
    fg: ld(mix(c6, 84, ink), c3),
    subtle: ld(mix(c6, 10, "white"), mix(c3, 12, darkPanel)),
    muted: ld(mix(c6, 16, "white"), mix(c3, 18, darkPanel)),
    emphasized: ld(mix(c6, 24, "white"), mix(c3, 26, darkPanel)),
    solid: ld(c6, darkSolid),
    // Slider/progress fills follow solid on every tone (same dark value).
    fill: ld(c6, darkSolid),
    focusRing: ld(c6, c3),
    border: ld(mix(c6, 30, "white"), mix(c3, 34, darkPanel)),
  }
}

const tones = Object.fromEntries((Object.keys(toneAnchors) as ToneName[]).map((n) => [n, tonePalette(n)]))

/* -------------------------------------------------------------------------- */
/* Colours                                                                     */
/* -------------------------------------------------------------------------- */

const colors = {
  bg: {
    DEFAULT: ld("white", "oklch(19% 0 0)"),
    panel: ld("white", darkPanel),
    raised: ld("white", "oklch(24% 0 0)"),
    subtle: ld("oklch(97.8% 0 0)", "oklch(26% 0 0)"),
    // muted, emphasized, inverted: DERIVED (Arc has no such surfaces); light values are Arc's neutral ramp.
    muted: ld("oklch(95.8% 0 0)", "oklch(29% 0 0)"),
    emphasized: ld("oklch(91.5% 0 0)", "oklch(33% 0 0)"),
    inverted: ld("oklch(15% 0 0)", "oklch(96% 0 0)"),
    error: ld("{colors.red.subtle}", "{colors.red.subtle}"),
    warning: ld("{colors.orange.subtle}", "{colors.orange.subtle}"),
    success: ld("{colors.green.subtle}", "{colors.green.subtle}"),
    info: ld("{colors.blue.subtle}", "{colors.blue.subtle}"),
  },
  fg: {
    DEFAULT: ld("oklch(15% 0 0)", "oklch(96% 0 0)"),
    muted: ld("oklch(46% 0 0)", "oklch(77% 0 0)"),
    // --text-muted. Preset-dependent (see contrastPresets): "aa" 55% light, "arc" 59%.
    subtle: greyPair(cp.fgSubtle),
    inverted: ld("white", "oklch(19% 0 0)"),
    // Status roles: rose / green / amber / sky tones.
    error: ld("{colors.red.fg}", "{colors.red.fg}"),
    success: ld("{colors.green.fg}", "{colors.green.fg}"),
    warning: ld("{colors.orange.fg}", "{colors.orange.fg}"),
    info: ld("{colors.blue.fg}", "{colors.blue.fg}"),
  },
  border: {
    DEFAULT: ld("oklch(93.5% 0 0)", "oklch(29% 0 0)"),
    muted: ld("oklch(96.5% 0 0)", "oklch(25% 0 0)"),
    subtle: ld("oklch(96.5% 0 0)", "oklch(25% 0 0)"),
    emphasized: ld("oklch(82% 0 0)", "oklch(40% 0 0)"),
    // Resting border of controls (text fields, checkbox, radio, select triggers, unchecked switch).
    // "aa": >= 3:1 on bg and bg.panel. "arc": identical to border.emphasized (--border-strong).
    control: cp.controlBorder ? greyPair(cp.controlBorder) : ld("{colors.border.emphasized}", "{colors.border.emphasized}"),
    // Select / native select trigger: control border in "aa", Arc's quiet `border` in "arc".
    trigger: cp.controlBorder ? greyPair(cp.controlBorder) : ld("{colors.border}", "{colors.border}"),
    inverted: ld("{colors.fg}", "{colors.fg}"),
    error: ld("{colors.red.600}", "{colors.red.300}"),
    success: ld("{colors.green.600}", "{colors.green.300}"),
    warning: ld("{colors.orange.600}", "{colors.orange.300}"),
    info: ld("{colors.blue.600}", "{colors.blue.300}"),
  },
  gray: {
    solid: ld("{colors.fg}", "{colors.fg}"),
    contrast: ld("{colors.bg}", "{colors.bg}"),
    thumb: ld("{colors.bg}", "{colors.bg}"),
    fg: ld("{colors.fg}", "{colors.fg}"),
    muted: ld("{colors.bg.muted}", "{colors.bg.muted}"),
    subtle: ld("{colors.bg.subtle}", "{colors.bg.subtle}"),
    emphasized: ld("{colors.bg.emphasized}", "{colors.bg.emphasized}"),
    border: ld("{colors.border}", "{colors.border}"),
    // Arc: slider fills in neutral dark are a mid grey so the white thumb stays distinct.
    fill: ld("{colors.fg}", "oklch(62% 0 0)"),
    focusRing: ld("oklch(24% 0 0 / .72)", "oklch(91% 0 0 / .72)"),
  },
  ...tones,
  // Arc's violet accent.
  brand: {
    // Dark solid is Arc's #8a66ff control fill; white on it is only 3.9:1, so dark ink sits on top (5.1:1).
    solid: ld("#7747ff", "#8a66ff"),
    fill: ld("#7747ff", "#8a66ff"),
    fg: ld("#5528ce", "#a78bff"),
    // fg is Arc's accent-strong; subtle is Arc's accent-subtle; muted / emphasized / border are DERIVED alphas.
    subtle: ld("rgb(119 71 255 / .13)", "rgb(119 71 255 / .22)"),
    muted: ld("rgb(119 71 255 / .2)", "rgb(119 71 255 / .3)"),
    emphasized: ld("rgb(119 71 255 / .3)", "rgb(119 71 255 / .4)"),
    contrast: ld("white", ink),
    thumb: ld("white", "white"),
    focusRing: ld("#7747ff", "#a78bff"),
    border: ld("rgb(119 71 255 / .35)", "rgb(167 139 255 / .4)"),
  },
  // Arc categorical tones (--tone-*): the Arc light value in light mode and the dark pastel in dark mode.
  tone: Object.fromEntries(
    (
      [
        ["teal", "teal"],
        ["sky", "blue"],
        ["orchid", "pink"],
        ["violet", "purple"],
        ["rose", "red"],
        ["amber", "orange"],
        ["green", "green"],
      ] as const
    ).map(([arc, chakra]) => [arc, ld(`{colors.${chakra}.600}`, `{colors.${chakra}.300}`)]),
  ),
  // Selection-control surfaces (switch track, thumb), used by recipes and the Arc bridge.
  control: {
    // Unchecked switch track. Preset-dependent: "aa" is >= 3:1 on the surface, "arc" is Arc's --control-track.
    track: greyPair(cp.track),
    trackHover: greyPair(cp.trackHover),
    // Slider rail: always Arc's value (the range fill and thumb carry the control, not the rail).
    rail: ld("oklch(89.5% 0 0)", "oklch(33% 0 0)"),
    thumb: ld("oklch(100% 0 0)", "oklch(97% 0 0)"),
  },
}

/* -------------------------------------------------------------------------- */
/* Shadows                                                                     */
/* -------------------------------------------------------------------------- */

const resting = ld("0 1px 2px oklch(0% 0 0 / .035)", "0 1px 2px oklch(0% 0 0 / .18)")
const raised = ld("0 6px 18px oklch(0% 0 0 / .065), 0 1px 3px oklch(0% 0 0 / .035)", "0 8px 22px oklch(0% 0 0 / .22)")
const floating = ld(
  "0 20px 48px oklch(0% 0 0 / .105), 0 3px 10px oklch(0% 0 0 / .045)",
  "0 22px 55px oklch(0% 0 0 / .34)",
)

export const semanticTokens = {
  colors,
  radii: {
    l1: { value: "{radii.item}" },
    l2: { value: "{radii.control}" },
    l3: { value: "{radii.panel}" },
  },
  shadows: {
    xs: resting,
    sm: resting,
    md: raised,
    lg: floating,
    xl: floating,
    "2xl": floating,
    // Switch / slider thumb (Arc --control-thumb-shadow).
    thumb: ld(
      "0 0 0 .5px oklch(0% 0 0 / .07), 0 1px 2px oklch(0% 0 0 / .14), 0 2px 6px oklch(0% 0 0 / .06)",
      "0 0 0 .5px oklch(0% 0 0 / .3), 0 1px 2px oklch(0% 0 0 / .35), 0 2px 6px oklch(0% 0 0 / .2)",
    ),
  },
}
