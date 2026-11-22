/**
 * Arc bridge: defines every custom property from Arc's registry/foundation.css as an alias of a
 * Chakra token, so Arc components work without foundation.css and cannot drift from the theme.
 *
 * Aliases to semantic tokens resolve through Chakra's light/dark variables, so they flip with the
 * colour mode automatically.
 *
 * Accent scoping. `--accent`, `--accent-strong`, `--accent-subtle`, `--accent-foreground`, the `--control-*`
 * accent variables and the chart `--series-1..4` are aliases of `colorPalette.*` (or of `--accent`). A custom
 * property inherits its *computed* value, so an alias declared once on `:root` would freeze at the root palette.
 * They are therefore declared in every scope that sets a palette, and nowhere else:
 *   1. `:root`, and `:where([data-arc-accent])` for plain-CSS containers (zero specificity, so any class or
 *      inline style on that element still wins and overrides `--accent` as expected);
 *   2. every element that sets `colorPalette` (Box prop, recipe, globalCss), via `scopeAccentToPalettes`.
 *      Chakra emits no class, attribute or selector for `colorPalette`, only the generated emotion class with
 *      `--colors-color-palette-*` declarations, so no selector can find those elements. Instead
 *      `scopeAccentToPalettes` adds the aliases to the declaration block Chakra emits for each palette.
 * Elements that set neither inherit, so a container's own `--accent: ...` override reaches its descendants.
 *
 * Not ported (replaced by colorPalette): the `:root[data-accent="..."]` rule sets.
 */

const space = ["1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "20", "24"]
const neutralFromGray = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]

/** Accent + selection-control aliases: re-declared in every palette scope (see above). */
export const arcAccentAliases = {
  "--accent": "colors.colorPalette.solid",
  "--accent-strong": "colors.colorPalette.fg",
  "--accent-subtle": "colors.colorPalette.subtle",
  "--accent-foreground": "colors.colorPalette.contrast",
  "--control-on": "colors.colorPalette.solid",
  "--control-glyph": "colors.colorPalette.contrast",
  "--control-thumb-on": "colors.colorPalette.thumb",
  "--control-fill": "colors.colorPalette.fill",
  "--control-on-subtle": "color-mix(in oklab, var(--control-on) 10%, transparent)",
}

/**
 * Relative-colour chart series, the formulas of foundation.css with its light/dark constants lifted into
 * `--arc-series-*` parameters (declared on `:root` / `.dark`). That keeps one colour-mode-free declaration
 * that can be repeated in every accent scope. Parameter values are copied verbatim from foundation.css.
 */
const sign = "sign(max(c - .02, 0))"
const base = `l * ${sign} + var(--arc-series-base) * (1 - ${sign})`
const hue = (offset: string) => `calc(h * ${sign} + 250 * (1 - ${sign})${offset})`
const clampL = (delta: string) => `clamp(var(--arc-series-min), ${base} + var(--arc-series-${delta}), var(--arc-series-max))`
export const arcSeries = {
  "--series-1": `oklch(from var(--accent) calc(${base}) calc(c * ${sign} + .15 * (1 - ${sign})) ${hue("")})`,
  "--series-2": `oklch(from var(--accent) ${clampL("l2")} var(--arc-series-c2) ${hue(" + var(--arc-series-h2)")})`,
  "--series-3": `oklch(from var(--accent) ${clampL("l3")} var(--arc-series-c3) ${hue(" + var(--arc-series-h3)")})`,
  "--series-4": `oklch(from var(--accent) ${clampL("l4")} var(--arc-series-c4) ${hue(" + var(--arc-series-h4)")})`,
}
const seriesParamsLight = {
  "--arc-series-base": ".58",
  "--arc-series-min": ".45",
  "--arc-series-max": ".76",
  "--arc-series-l2": "-0.25",
  "--arc-series-c2": ".19",
  "--arc-series-h2": "57",
  "--arc-series-l3": "0.14",
  "--arc-series-c3": ".18",
  "--arc-series-h3": "184",
  "--arc-series-l4": "0",
  "--arc-series-c4": ".21",
  "--arc-series-h4": "292",
}
const seriesParamsDark = {
  "--arc-series-base": ".73",
  "--arc-series-min": ".485",
  "--arc-series-max": ".665",
  "--arc-series-l2": "-0.19",
  "--arc-series-c2": ".21",
  "--arc-series-h2": "66",
  "--arc-series-l3": "0.02",
  "--arc-series-c3": ".21",
  "--arc-series-h3": "175",
  "--arc-series-l4": "-0.1",
  "--arc-series-c4": ".18",
  "--arc-series-h4": "270",
}

const light = {
  "--arc-gradient-from": "oklch(90% .045 300)",
  "--arc-gradient-to": "oklch(92% .045 65)",
  "--arc-gradient": "linear-gradient(100deg, var(--arc-gradient-from), var(--arc-gradient-to))",
  "--arc-gradient-foreground": "oklch(22% .01 300)",
  "--arc-gradient-soft": "linear-gradient(135deg, oklch(97.5% .016 300), oklch(98% .016 65))",
  "--arc-gradient-line": "linear-gradient(100deg, oklch(83% .06 300), oklch(86% .06 65))",
  "--arc-gradient-ink": "linear-gradient(100deg, oklch(47% .1 300), oklch(50% .09 55))",
  // Chart series fallbacks for browsers without relative colour syntax.
  "--series-1": "#1f7dcf",
  "--series-2": "#7128a5",
  "--series-3": "#e58f00",
  "--series-4": "#009e84",
  ...seriesParamsLight,
}
const dark = {
  "--arc-gradient-from": "oklch(38% .05 300)",
  "--arc-gradient-to": "oklch(40% .045 60)",
  "--arc-gradient-foreground": "oklch(96% .005 300)",
  "--arc-gradient-soft": "linear-gradient(135deg, oklch(23.5% .016 300), oklch(24% .014 65))",
  "--arc-gradient-line": "linear-gradient(100deg, oklch(48% .06 300), oklch(52% .055 65))",
  "--arc-gradient-ink": "linear-gradient(100deg, oklch(82% .07 300), oklch(86% .065 70))",
  "--series-1": "#55adff",
  "--series-2": "#9c37be",
  "--series-3": "#e66e00",
  "--series-4": "#00a861",
  ...seriesParamsDark,
}

/** Properties declared once on `:root`. */
const rootAliases: Record<string, string> = {
  // Neutral ramp (static in Arc, same in both modes).
  "--neutral-0": "colors.white",
  "--neutral-1": "oklch(99% 0 0)", // between white and gray.50; no Chakra step, copied verbatim
  ...Object.fromEntries(neutralFromGray.map((step, i) => [`--neutral-${i + 2}`, `colors.gray.${step}`])),

  // Surfaces, text, borders
  "--background": "colors.bg",
  "--surface": "colors.bg.panel",
  "--surface-raised": "colors.bg.raised",
  "--surface-muted": "colors.bg.subtle",
  "--foreground": "colors.fg",
  "--text-secondary": "colors.fg.muted",
  "--text-muted": "colors.fg.subtle",
  "--border": "colors.border",
  "--border-subtle": "colors.border.muted",
  "--border-strong": "colors.border.emphasized",

  // Selection controls (accent-dependent ones are in arcAccentAliases)
  "--control-track": "colors.control.track",
  "--control-track-hover": "colors.control.trackHover",
  "--control-thumb": "colors.control.thumb",
  "--control-thumb-shadow": "shadows.thumb",
  "--focus-ring": "transparent",

  // Categorical tones and status
  "--tone-teal": "colors.tone.teal",
  "--tone-sky": "colors.tone.sky",
  "--tone-orchid": "colors.tone.orchid",
  "--tone-violet": "colors.tone.violet",
  "--tone-rose": "colors.tone.rose",
  "--tone-amber": "colors.tone.amber",
  "--tone-green": "colors.tone.green",
  "--success": "var(--tone-green)",
  "--warning": "var(--tone-amber)",
  "--danger": "var(--tone-rose)",
  "--info": "var(--tone-sky)",

  // Shadows
  "--shadow-resting": "shadows.xs",
  "--shadow-raised": "shadows.md",
  "--shadow-floating": "shadows.lg",

  // Spacing, radii, control heights
  ...Object.fromEntries(space.map((n) => [`--space-${n}`, `spacing.${n}`])),
  "--radius-control": "radii.control",
  "--radius-panel": "radii.panel",
  "--radius-surface": "radii.surface",
  "--radius-pill": "9999px",
  "--control-height-sm": "sizes.control.sm",
  "--control-height-md": "sizes.control.md",
  "--control-height-lg": "sizes.control.lg",

  // Type
  "--font-display": "fonts.heading",
  "--font-body": "fonts.body",
  "--text-xs": "fontSizes.xs",
  "--text-sm": "fontSizes.sm",
  "--text-base": "fontSizes.md",
  "--text-lg": "fontSizes.lg",
  "--text-xl": "fontSizes.xl",
  "--text-2xl": "fontSizes.2xl",
  "--text-3xl": "fontSizes.3xl",
  "--text-4xl": "fontSizes.4xl",
  "--text-5xl": "fontSizes.5xl",
  "--tracking-display": "letterSpacings.display",
  "--tracking-body": "letterSpacings.body",
  "--leading-display": "lineHeights.display",
  "--leading-body": "lineHeights.body",

  // Motion
  "--ease-enter": "easings.enter",
  "--ease-standard": "easings.standard",
  "--ease-exit": "easings.exit",
  "--ease-in-out": "easings.in-out",
  "--ease-spring": "easings.spring",
  "--duration-instant": "durations.instant",
  "--duration-fast": "durations.fast",
  "--duration-standard": "durations.standard",
  "--duration-considered": "durations.considered",
  "--duration-spring": "durations.spring",

  ...light,
}

const supportsRelativeColor = "@supports (color: oklch(from red clamp(.4, l * sign(max(c - .02, 0)) + .5, .8) c h))"

/**
 * Arc's focus rule, ported. Pointer focus never draws a ring; keyboard focus (:focus-visible) draws
 * a 2px outline in the palette's focusRing colour. Text fields, menu items, listbox options and
 * tabindex="-1" targets are excluded (they mark focus with border, fill or nothing).
 */
const excluded =
  'input:not([type="button"], [type="checkbox"], [type="color"], [type="file"], [type="image"], [type="radio"], [type="range"], [type="reset"], [type="submit"]), textarea, [contenteditable]:not([contenteditable="false"]), [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="option"], [tabindex="-1"]'

export const arcFocus: Record<string, any> = {
  [`:focus:not(:focus-visible), :is(${excluded}):focus`]: { outline: "none !important" },
  [`:focus-visible:not(${excluded})`]: {
    outline: "var(--focus-outline-width, 2px) solid var(--focus-outline, {colors.colorPalette.focusRing}) !important",
    outlineOffset: "var(--focus-outline-offset, 2px) !important",
  },
}

export const arcBridge: Record<string, any> = {
  ":root": { colorScheme: "light", ...rootAliases },
  // Accent aliases for the root palette and for plain-CSS accent scopes (`data-arc-accent`).
  ":root, :where([data-arc-accent])": { ...arcAccentAliases },
  ".dark": { colorScheme: "dark", ...dark },
  [supportsRelativeColor]: {
    ":root, :where([data-arc-accent])": arcSeries,
  },
  ...arcFocus,
}

/** Minimal shape of the Chakra system used by scopeAccentToPalettes. */
interface PaletteSystem {
  utility: { transform: (prop: string, value: string) => unknown }
  tokens: { colorPaletteMap: Map<string, unknown>; getVar: (path: string, fallback?: string) => string | undefined }
}

let warned = false
/** Test hook: lets a unit test observe the one-time warning more than once per process. */
export function resetAccentScopeWarning() {
  warned = false
}

/**
 * Adds the accent aliases to the style block Chakra emits wherever `colorPalette` is set, so Arc components
 * beneath any `colorPalette` element resolve `--accent` (and series, control fills) from that palette.
 * Chakra builds one memoised style object per palette name; this extends those objects in place, once, at
 * system creation.
 *
 * It relies on Chakra internals (`utility.transform("colorPalette", name)` returning that memoised object, and
 * `tokens.colorPaletteMap`), so it can break on a Chakra upgrade. Failure is soft: instead of crashing the app at
 * startup it logs ONE console warning and returns `false`. The accent aliases still exist on `:root` (declared in
 * `arcBridge`), so the app keeps working with a root-only accent: every Arc component follows the default palette
 * and ignores nested `colorPalette` scopes until the patch is repaired. Returns `true` when every palette was patched.
 */
export function scopeAccentToPalettes(system: PaletteSystem): boolean {
  try {
    const resolve = (v: string) => system.tokens.getVar(v, v) ?? v
    const aliases = Object.fromEntries(Object.entries(arcAccentAliases).map(([k, v]) => [k, resolve(v)]))
    const names = Array.from(system.tokens.colorPaletteMap.keys())
    if (!names.length) throw new Error("no colour palettes found")
    // Validate every block before touching any, so a failure never leaves the palettes half patched.
    const blocks = names.map((name) => {
      const block = system.utility.transform("colorPalette", name)
      if (!block || typeof block !== "object" || Array.isArray(block) || !Object.isExtensible(block)) {
        throw new Error(`unexpected colorPalette output for "${name}"`)
      }
      return block as Record<string, unknown>
    })
    for (const block of blocks) Object.assign(block, aliases, { [supportsRelativeColor]: arcSeries })
    return true
  } catch (error) {
    if (!warned) {
      warned = true
      console.warn(
        `[arc-bridge] Accent scoping is disabled (${error instanceof Error ? error.message : String(error)}). ` +
          "Chakra's colorPalette internals changed; Arc components will follow the root palette only. See scopeAccentToPalettes in src/theme/arc-bridge.ts.",
      )
    }
    return false
  }
}
