import { defineRecipe, defineSlotRecipe } from "@chakra-ui/react"
import { tagAnatomy } from "@chakra-ui/react/anatomy"

const badgeVariants = {
  solid: { bg: "colorPalette.solid", color: "colorPalette.contrast", shadow: "none" },
  subtle: { bg: "colorPalette.subtle", color: "colorPalette.fg", shadow: "none" },
  outline: {
    bg: "transparent",
    color: "colorPalette.fg",
    shadow: "inset 0 0 0 1px var(--shadow-color)",
    shadowColor: "colorPalette.border",
  },
  surface: {
    bg: "colorPalette.subtle",
    color: "colorPalette.fg",
    shadow: "inset 0 0 0 1px var(--shadow-color)",
    shadowColor: "colorPalette.border",
  },
  plain: { color: "colorPalette.fg" },
}

/** Height 24 (sm 20, lg 28), radius 6 (5 / 7), px 10, 12px / 500, tabular numerals. */
const badgeSizes = {
  xs: { textStyle: "xs", px: "2", minH: "18px", h: "18px", borderRadius: "4px" },
  sm: { textStyle: "xs", px: "10px", minH: "20px", h: "20px", borderRadius: "5px" },
  md: { textStyle: "xs", px: "10px", minH: "24px", h: "24px", borderRadius: "6px" },
  lg: { textStyle: "xs", px: "10px", minH: "28px", h: "28px", borderRadius: "7px" },
}

export const badgeRecipe = defineRecipe({
  base: {
    fontWeight: "medium",
    fontVariantNumeric: "tabular-nums",
    lineHeight: "1",
    gap: "1.5",
  },
  variants: { variant: badgeVariants, size: badgeSizes },
  defaultVariants: { variant: "subtle", size: "md" },
})

const tagSize = (h: string, radius: string, gap: string) => ({
  root: { minH: h, h, px: "10px", gap, borderRadius: radius },
  label: { textStyle: "xs" },
})

export const tagSlotRecipe = defineSlotRecipe({
  slots: tagAnatomy.keys(),
  base: {
    root: { fontWeight: "medium", fontVariantNumeric: "tabular-nums" },
    label: { fontWeight: "medium" },
  },
  variants: {
    size: {
      sm: tagSize("20px", "5px", "1"),
      md: tagSize("24px", "6px", "1.5"),
      lg: tagSize("28px", "7px", "1.5"),
      xl: { ...tagSize("32px", "8px", "2"), label: { textStyle: "sm" } },
    },
    variant: {
      subtle: { root: badgeVariants.subtle },
      solid: { root: badgeVariants.solid },
      outline: { root: badgeVariants.outline },
      surface: { root: badgeVariants.surface },
    },
  },
  defaultVariants: { size: "md", variant: "subtle" },
})
