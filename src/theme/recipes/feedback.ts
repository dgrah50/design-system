import { defineRecipe, defineSlotRecipe } from "@chakra-ui/react"
import { alertAnatomy, progressAnatomy } from "@chakra-ui/react/anatomy"

/**
 * Alert. Four distinct variants; `outline` (the default) is Arc's alert: a quiet panel with a hairline and a
 * resting shadow where only the icon carries the status colour. Every variant restates bg, colour, border and
 * shadow because Chakra's own variants are merged in underneath. Border width is 1px everywhere so switching
 * variant never shifts layout. Title and description stay on fg / fg.muted (or the contrast colour on solid).
 */
const alertBox = { borderWidth: "1px", borderRadius: "l2" } as const

export const alertSlotRecipe = defineSlotRecipe({
  slots: alertAnatomy.keys(),
  base: {
    root: { ...alertBox, alignItems: "flex-start" },
    title: { textStyle: "sm", fontWeight: "medium", color: "fg" },
    description: { textStyle: "xs", color: "fg.muted" },
    indicator: { color: "colorPalette.fg", mt: "0.5" },
  },
  variants: {
    variant: {
      outline: {
        root: { bg: "bg.panel", color: "fg", borderColor: "border", shadow: "xs" },
        indicator: { color: "colorPalette.fg" },
      },
      subtle: {
        root: { bg: "colorPalette.subtle", color: "fg", borderColor: "transparent", shadow: "none" },
        indicator: { color: "colorPalette.fg" },
      },
      surface: {
        root: { bg: "colorPalette.subtle", color: "fg", borderColor: "colorPalette.border", shadow: "none" },
        indicator: { color: "colorPalette.fg" },
      },
      solid: {
        root: { bg: "colorPalette.solid", color: "colorPalette.contrast", borderColor: "transparent", shadow: "none" },
        title: { color: "colorPalette.contrast" },
        description: { color: "colorPalette.contrast" },
        indicator: { color: "colorPalette.contrast" },
      },
    },
    size: {
      sm: { root: { p: "3", gap: "2.5", textStyle: "xs" }, indicator: { textStyle: "md" } },
      md: { root: { p: "4", gap: "3", textStyle: "sm" }, indicator: { textStyle: "lg" } },
      lg: { root: { p: "5", gap: "3.5", textStyle: "sm" }, indicator: { textStyle: "xl" } },
    },
  },
  defaultVariants: { variant: "outline", size: "md" },
})

/**
 * Progress. Track heights are DERIVED (Arc's single bar is 7px): xs 4, sm 6, md 8, lg 10, xl 12.
 * `shape`: full = pill, rounded = the item radius (radii.l1), square = none. The radius lives on the shape
 * variants only (never the base) so each value does something.
 */
export const progressSlotRecipe = defineSlotRecipe({
  slots: progressAnatomy.keys(),
  base: {
    range: {
      transitionProperty: "width, height",
      transitionDuration: "considered",
      transitionTimingFunction: "enter",
    },
    label: { textStyle: "sm", fontWeight: "medium" },
    valueText: { textStyle: "xs", fontVariantNumeric: "tabular-nums" },
  },
  variants: {
    variant: {
      outline: { track: { bg: "bg.muted", shadow: "none" }, range: { bg: "colorPalette.solid" } },
      subtle: { track: { bg: "bg.muted" }, range: { bg: "colorPalette.solid" } },
    },
    shape: {
      square: { track: { borderRadius: "0" } },
      rounded: { track: { borderRadius: "l1" } },
      full: { track: { borderRadius: "full" } },
    },
    size: {
      xs: { track: { h: "4px" } },
      sm: { track: { h: "6px" } },
      md: { track: { h: "8px" } },
      lg: { track: { h: "10px" } },
      xl: { track: { h: "12px" } },
    },
  },
  defaultVariants: { variant: "outline", size: "md", shape: "full" },
})

export const skeletonRecipe = defineRecipe({
  variants: {
    variant: {
      pulse: { background: "bg.muted" },
      shine: { "--start-color": "colors.bg.subtle", "--end-color": "colors.bg.muted" },
    },
  },
})
