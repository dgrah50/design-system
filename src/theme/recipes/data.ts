import { defineRecipe, defineSlotRecipe } from "@chakra-ui/react"
import { accordionAnatomy, avatarAnatomy, statAnatomy, tableAnatomy } from "@chakra-ui/react/anatomy"

/* Heading: Geist only at 3xl and up (>= 30px in Arc); body font below. ------ */

const display = (fontSize: string) => ({
  textStyle: "none",
  fontFamily: "heading",
  fontSize,
  fontWeight: "medium",
  letterSpacing: "display",
  lineHeight: "display",
})
const text = (fontSize: string) => ({
  textStyle: "none",
  fontFamily: "body",
  fontSize,
  fontWeight: "medium",
  letterSpacing: "body",
  lineHeight: "1.3",
})

export const headingRecipe = defineRecipe({
  base: { fontWeight: "medium" },
  variants: {
    size: {
      xs: text("xs"),
      sm: text("sm"),
      md: text("md"),
      lg: text("lg"),
      xl: text("xl"),
      "2xl": text("2xl"),
      "3xl": display("3xl"),
      "4xl": display("4xl"),
      "5xl": display("5xl"),
      "6xl": display("6xl"),
      "7xl": display("7xl"),
    },
  },
  defaultVariants: { size: "xl" },
})

/* Table ---------------------------------------------------------------------- */

export const tableSlotRecipe = defineSlotRecipe({
  slots: tableAnatomy.keys(),
  base: {
    root: { fontVariantNumeric: "lining-nums tabular-nums" },
    columnHeader: { textStyle: "xs", fontWeight: "medium", color: "fg.muted" },
    body: { "& tr": { transitionProperty: "background-color", transitionDuration: "fast", _hover: { bg: "bg.subtle" } } },
  },
  variants: {
    variant: {
      line: {
        row: { bg: "transparent" },
        columnHeader: { borderBottomWidth: "1px", borderColor: "border" },
        cell: { borderBottomWidth: "1px", borderColor: "border.muted" },
      },
      outline: {
        row: { bg: "transparent" },
        columnHeader: { borderBottomWidth: "1px", borderColor: "border" },
        cell: { borderBottomWidth: "1px", borderColor: "border.muted" },
      },
    },
    size: {
      sm: { root: { textStyle: "sm" }, columnHeader: { px: "4", py: "2" }, cell: { px: "4", py: "2" } },
      md: { root: { textStyle: "sm" }, columnHeader: { px: "4", py: "3" }, cell: { px: "4", py: "3" } },
      lg: { root: { textStyle: "sm" }, columnHeader: { px: "4", py: "4" }, cell: { px: "4", py: "4" } },
    },
  },
})

/* Avatar ----------------------------------------------------------------------- */

const avatarLook = { borderWidth: "1px", borderColor: "border", bg: "bg.subtle", color: "fg.muted" }

export const avatarSlotRecipe = defineSlotRecipe({
  slots: avatarAnatomy.keys(),
  base: { root: { ...avatarLook, "--avatar-radius": "radii.full", overflow: "hidden" } },
  variants: {
    variant: {
      subtle: { root: avatarLook },
      solid: { root: { ...avatarLook, bg: "colorPalette.solid", color: "colorPalette.contrast", borderColor: "transparent" } },
      outline: { root: { ...avatarLook, bg: "transparent" } },
    },
  },
})

/* Accordion -------------------------------------------------------------------- */

const accordionSize = (px: string) => ({
  root: { "--accordion-padding-x": px, "--accordion-padding-y": "spacing.3" },
  itemTrigger: { textStyle: "sm", fontWeight: "medium", minH: "50px", py: "var(--accordion-padding-y)" },
})

export const accordionSlotRecipe = defineSlotRecipe({
  slots: accordionAnatomy.keys(),
  base: {
    item: { borderColor: "border" },
    itemTrigger: { fontWeight: "medium", color: "fg" },
    itemBody: { textStyle: "sm", color: "fg.muted" },
    itemContent: {
      _open: { animationDuration: "standard", animationTimingFunction: "enter" },
      _closed: { animationDuration: "fast", animationTimingFunction: "standard" },
    },
    itemIndicator: {
      transitionProperty: "rotate",
      transitionDuration: "spring",
      transitionTimingFunction: "spring",
      color: "fg.subtle",
    },
  },
  variants: {
    variant: { outline: { item: { borderBottomWidth: "1px", borderColor: "border" } } },
    size: { sm: accordionSize("spacing.3"), md: accordionSize("spacing.4"), lg: accordionSize("spacing.4.5") },
  },
})

/* Stat ------------------------------------------------------------------------- */

export const statSlotRecipe = defineSlotRecipe({
  slots: statAnatomy.keys(),
  base: {
    valueText: { fontVariantNumeric: "tabular-nums", letterSpacing: "display", fontWeight: "medium" },
    label: { color: "fg.muted" },
    helpText: { color: "fg.subtle" },
    valueUnit: { color: "fg.subtle" },
    // Trend arrows use Arc's green and rose tones (fg.success / fg.error). Inside a Badge they take the badge's own colour.
    indicator: {
      "&[data-type=up]": { color: "fg.success" },
      "&[data-type=down]": { color: "fg.error" },
      "[data-scope=badge] &, .chakra-badge &": { color: "inherit" },
    },
  },
})
