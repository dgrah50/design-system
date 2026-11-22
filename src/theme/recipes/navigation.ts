import { defineSlotRecipe } from "@chakra-ui/react"
import { breadcrumbAnatomy, stepsAnatomy, timelineAnatomy, treeViewAnatomy } from "@chakra-ui/react/anatomy"
import { colorTransition, controlHeight } from "./shared"

/* Breadcrumb (Arc breadcrumb) ---------------------------------------------- */

/**
 * Crumbs are `fg.muted` and gain an ink colour and a 45% underline on hover; the current page is `fg` at 500.
 * 6px between crumbs (gap 1.5) and a quiet chevron in `border.emphasized` (Arc: `border-strong`).
 */
const crumbLink = {
  px: "0.5",
  py: "1",
  borderRadius: "l1",
  textDecoration: "underline",
  textDecorationColor: "transparent",
  textUnderlineOffset: "4px",
  transitionProperty: "color, text-decoration-color",
  transitionDuration: "fast",
  transitionTimingFunction: "standard",
} as const

export const breadcrumbSlotRecipe = defineSlotRecipe({
  slots: breadcrumbAnatomy.keys(),
  base: {
    list: { color: "fg.muted" },
    separator: { color: "border.emphasized", opacity: 1, _icon: { boxSize: "4" } },
    ellipsis: { color: "fg.muted" },
  },
  variants: {
    variant: {
      plain: {
        link: { ...crumbLink, color: "fg.muted", _hover: { color: "fg", textDecorationColor: "currentColor/45" } },
        currentLink: { color: "fg", fontWeight: "medium" },
      },
      underline: {
        link: {
          ...crumbLink,
          color: "colorPalette.fg",
          textDecorationColor: "colorPalette.border",
          _hover: { textDecorationColor: "currentColor/45" },
        },
        currentLink: { color: "colorPalette.fg", fontWeight: "medium" },
      },
    },
  },
})

/* Pagination (Arc pagination) ------------------------------------------------ */

/**
 * Chakra ships no Pagination recipe: the page buttons are ordinary Buttons / IconButtons. This recipe
 * restyles whatever button is passed to `Pagination.Item`, `PrevTrigger`, `NextTrigger` and the ellipsis so
 * they match Arc: a transparent square at control height, `fg.muted` text, `bg.subtle` on hover, and the
 * current page as a raised `bg.panel` chip with a `border.control` edge (>= 3:1) and the resting shadow. `size` sets the item
 * box to the control scale (sm 36, md 44, lg 50), overriding the button's own height.
 */
const pageItem = {
  borderWidth: "1px",
  borderColor: "transparent",
  borderRadius: "l2",
  bg: "transparent",
  color: "fg.muted",
  boxShadow: "none",
  fontWeight: "medium",
  fontVariantNumeric: "tabular-nums",
  textStyle: "sm",
  px: "0",
  cursor: "pointer",
  ...colorTransition,
  _hover: { bg: "bg.subtle", color: "fg", boxShadow: "none" },
  _active: { bg: "bg.muted", scale: ".97", transitionDuration: "instant" },
  _disabled: { opacity: 0.4, cursor: "not-allowed", pointerEvents: "none" },
  "&[aria-current=page], &[data-selected]": {
    bg: "bg.panel",
    color: "fg",
    borderColor: "border.control",
    boxShadow: "xs",
    _hover: { bg: "bg.panel" },
  },
} as const

const pageSize = (h: string) => ({
  item: { h, minW: h },
  prevTrigger: { h, minW: h },
  nextTrigger: { h, minW: h },
  ellipsis: { h, minW: h },
})

export const paginationSlotRecipe = defineSlotRecipe({
  slots: ["root", "item", "ellipsis", "prevTrigger", "nextTrigger"],
  className: "chakra-pagination",
  base: {
    root: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1" },
    item: pageItem,
    prevTrigger: pageItem,
    nextTrigger: pageItem,
    ellipsis: { ...pageItem, cursor: "default", _hover: { bg: "transparent", color: "fg.muted" } },
  },
  variants: {
    size: {
      sm: pageSize(controlHeight.sm),
      md: pageSize(controlHeight.md),
      lg: pageSize(controlHeight.lg),
    },
  },
  defaultVariants: { size: "sm" },
})

/* Steps (Arc stepper) -------------------------------------------------------- */

/**
 * Marker 28px at md (Arc), a 2px connector, and a 4px halo around the current step. xs 20 / sm 24 / lg 36 are
 * DERIVED around it. Incomplete markers draw a 1px `border.control` ring on `bg.panel`; complete markers are
 * `colorPalette.solid` with the contrast colour; the current marker is ringed in the palette with the halo.
 */
const halo = "0 0 0 4px color-mix(in oklab, {colors.colorPalette.solid} 10%, transparent)"

const stepSize = (marker: string, icon: string, indicatorText: string, gap: string) => ({
  root: { gap },
  list: { "--steps-size": marker, "--steps-icon-size": icon },
  indicator: { textStyle: indicatorText },
})

export const stepsSlotRecipe = defineSlotRecipe({
  slots: stepsAnatomy.keys(),
  base: {
    list: { "--steps-thickness": "2px" },
    separator: { bg: "border", borderRadius: "full" },
    title: { textStyle: "sm", fontWeight: "medium" },
    description: { color: "fg.subtle", textStyle: "xs", fontWeight: "normal" },
    indicator: {
      transitionProperty: "background-color, border-color, color, box-shadow",
      transitionDuration: "standard",
      transitionTimingFunction: "standard",
    },
  },
  variants: {
    variant: {
      solid: {
        indicator: {
          bg: "bg.panel",
          color: "fg.subtle",
          _incomplete: { borderWidth: "1px", borderColor: "border.control", color: "fg.subtle" },
          _current: { bg: "bg.panel", borderWidth: "1.5px", borderColor: "colorPalette.solid", color: "fg", boxShadow: halo },
          _complete: { bg: "colorPalette.solid", borderWidth: "1px", borderColor: "colorPalette.solid", color: "colorPalette.contrast" },
        },
        separator: { _complete: { bg: "colorPalette.solid" } },
      },
      subtle: {
        indicator: {
          _incomplete: { bg: "bg.subtle", borderWidth: "1px", borderColor: "border", color: "fg.muted" },
          _current: { bg: "colorPalette.muted", color: "colorPalette.fg", boxShadow: halo },
          _complete: { bg: "colorPalette.emphasized", color: "colorPalette.fg" },
        },
        separator: { _complete: { bg: "colorPalette.emphasized" } },
      },
    },
    size: {
      xs: stepSize("1.25rem", "0.75rem", "xs", "2.5"),
      sm: stepSize("1.5rem", "0.875rem", "xs", "3"),
      md: stepSize("1.75rem", "0.875rem", "xs", "4"),
      lg: stepSize("2.25rem", "1.125rem", "sm", "6"),
    },
  },
})

/* Timeline (Arc timeline) ----------------------------------------------------- */

/**
 * Markers are 28px at md (Arc), a 1px `border.emphasized` line runs under them, and the title's first line is
 * centred on the marker. The default variant is `outline` (a quiet `bg.panel` node with a hairline), which is
 * Arc's system-event marker; solid / subtle / plain stay available. sm 20 / lg 32 / xl 40 are DERIVED.
 */
const timelineSize = (marker: string, font: string, titleMt: string, titleStyle: "xs" | "sm") => ({
  root: { "--timeline-indicator-size": marker, "--timeline-font-size": font },
  title: { textStyle: titleStyle, mt: titleMt },
})

export const timelineSlotRecipe = defineSlotRecipe({
  slots: timelineAnatomy.keys(),
  base: {
    separator: { borderColor: "border.emphasized" },
    indicator: { outline: "3px solid {colors.bg}", fontWeight: "medium" },
    title: { fontWeight: "medium", color: "fg" },
    description: { color: "fg.muted", textStyle: "xs" },
  },
  variants: {
    variant: {
      outline: { indicator: { bg: "bg.panel", color: "fg.muted", borderWidth: "1px", borderColor: "border" } },
      subtle: { indicator: { bg: "colorPalette.muted", color: "colorPalette.fg", borderWidth: "0" } },
      solid: { indicator: { bg: "colorPalette.solid", color: "colorPalette.contrast", borderWidth: "0" } },
      plain: { indicator: { bg: "transparent", color: "fg.muted", borderWidth: "0" } },
    },
    size: {
      // Title line height is 1.4 x 14px = 19.6px (16.8px at xs), so mt = (marker - line) / 2.
      sm: timelineSize("1.25rem", "{fontSizes.2xs}", "1.6px", "xs"),
      md: timelineSize("1.75rem", "{fontSizes.xs}", "4px", "sm"),
      lg: timelineSize("2rem", "{fontSizes.xs}", "6px", "sm"),
      xl: timelineSize("2.5rem", "{fontSizes.sm}", "10px", "sm"),
    },
  },
  defaultVariants: { variant: "outline", size: "md" },
})

/* TreeView (Arc tree-view) ------------------------------------------------------ */

/**
 * A hairline-bordered tree on `bg.panel` with 36px rows (md; sm 32, xs 28), item radius, `bg.subtle` hover and a
 * `colorPalette.muted` selection (neutral `bg.muted` under the ink palette). Chevrons are `fg.subtle` and
 * turn on the spring; indent guides are the quiet `border`.
 */
const row = {
  rounded: "l1",
  color: "fg.muted",
  py: "0",
  transitionProperty: "background-color, color",
  transitionDuration: "fast",
  transitionTimingFunction: "standard",
  "&:hover, &:focus-visible": { bg: "bg.subtle", color: "fg" },
} as const

const treeSize = (h: string, text: "xs" | "sm", icon: string, padX: string) => ({
  tree: {
    textStyle: text,
    "--tree-icon-size": icon,
    "--tree-padding-inline": padX,
    "--tree-padding-block": "0px",
    "--tree-row-height": h,
  },
})

export const treeViewSlotRecipe = defineSlotRecipe({
  slots: treeViewAnatomy.keys(),
  base: {
    tree: {
      borderWidth: "1px",
      borderColor: "border",
      borderRadius: "l3",
      bg: "bg.panel",
      px: "2",
      py: "1.5",
      "--tree-item-gap": "spacing.2",
    },
    label: { textStyle: "sm", fontWeight: "medium" },
    branchControl: { ...row, minH: "var(--tree-row-height)" },
    item: { ...row, minH: "var(--tree-row-height)" },
    branchIndicator: {
      color: "fg.subtle",
      transitionProperty: "transform",
      transitionDuration: "spring",
      transitionTimingFunction: "spring",
    },
    branchIndentGuide: { bg: "border" },
  },
  variants: {
    size: {
      xs: treeSize("28px", "xs", "spacing.3", "spacing.2"),
      sm: treeSize("32px", "sm", "spacing.3.5", "spacing.2.5"),
      md: treeSize("36px", "sm", "spacing.4", "spacing.3"),
    },
    variant: {
      subtle: {
        branchControl: { _selected: { bg: "colorPalette.muted", color: "colorPalette.fg", "&:hover": { bg: "colorPalette.muted" } } },
        item: { _selected: { bg: "colorPalette.muted", color: "colorPalette.fg", "&:hover": { bg: "colorPalette.muted" } } },
      },
      solid: {
        branchControl: { _selected: { bg: "colorPalette.solid", color: "colorPalette.contrast", "&:hover": { bg: "colorPalette.solid" } } },
        item: { _selected: { bg: "colorPalette.solid", color: "colorPalette.contrast", "&:hover": { bg: "colorPalette.solid" } } },
      },
    },
  },
})
