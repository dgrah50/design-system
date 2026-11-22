import { defineSlotRecipe } from "@chakra-ui/react"
import { checkboxCardAnatomy, radioCardAnatomy } from "@chakra-ui/react/anatomy"
import { checkBase, checkSizes, checkVariants, radioBase, radioSizes, radioVariants } from "./selection"
import { colorTransition } from "./shared"

/**
 * Checkbox card and radio card (Arc radio-cards). One 1px `border`, control radius, 12px padding,
 * `bg.subtle` on hover. Checked: border and a 5% tint of `colorPalette.solid` (Arc's `control-on` at 5%).
 * Label 14px / 500, description 12px `fg.subtle`. The four variants stay distinct:
 *   outline (default, Arc) tint + solid border, surface = palette.subtle fill + palette border,
 *   subtle = filled card, no border, solid = filled with the palette solid.
 * Indicators are `unstyled` by Chakra, so the card carries the same marks as the Checkbox and Radio recipes.
 */

const tint = "color-mix(in oklab, {colors.colorPalette.solid} 5%, {colors.bg.panel})"

const cardSurface = {
  borderWidth: "1px",
  borderColor: "border",
  borderRadius: "l2",
  bg: "bg.panel",
  color: "fg",
  ...colorTransition,
  _hover: { bg: "bg.subtle" },
  _disabled: { bg: "bg.subtle", opacity: 0.5, cursor: "not-allowed" },
} as const

// Padding 12px (Arc 14/16 in the registry radius preset; the task asks for 12). sm 10, lg 16 are DERIVED.
const sizeBody = {
  sm: { control: { p: "2.5", gap: "1.5" }, textStyle: "sm" },
  md: { control: { p: "3", gap: "2.5" }, textStyle: "sm" },
  lg: { control: { p: "4", gap: "3.5" }, textStyle: "sm" },
} as const

// Checked cards sit on a tint, where fg.subtle falls to 4.1-4.3:1, so the description steps up to fg.muted.
const checkedOutline = { borderColor: "colorPalette.solid", bg: tint, "--card-desc": "colors.fg.muted" }

/**
 * Description colour is fg.subtle, read through `--card-desc` because Chakra gives RadioCard's description no
 * data-part to select: the subtle card sets it to fg.muted (it sits on bg.muted) and the checked solid card to
 * the contrast colour, the only safe text colour on a solid fill.
 */
const desc = { opacity: 1, textStyle: "xs", color: "var(--card-desc, {colors.fg.subtle})" } as const

export const checkboxCardSlotRecipe = defineSlotRecipe({
  slots: checkboxCardAnatomy.keys(),
  base: {
    root: {
      borderRadius: "l2",
      transitionProperty: "background-color, border-color, color",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
      _invalid: { outline: "none", borderColor: "border.error" },
    },
    label: { textStyle: "sm", fontWeight: "medium" },
    description: desc,
    indicator: checkBase,
  },
  variants: {
    size: {
      sm: { control: sizeBody.sm.control, indicator: checkSizes.sm },
      md: { control: sizeBody.md.control, indicator: checkSizes.md },
      lg: { control: sizeBody.lg.control, indicator: checkSizes.lg, root: { textStyle: "sm" } },
    },
    variant: {
      outline: {
        root: {
          ...cardSurface,
          boxShadow: "none",
          _checked: { ...checkedOutline, color: "fg", boxShadow: "none", _hover: { bg: tint } },
        },
        indicator: checkVariants.solid,
      },
      surface: {
        root: {
          ...cardSurface,
          _checked: {
            bg: "colorPalette.subtle",
            color: "fg",
            borderColor: "colorPalette.border",
            "--card-desc": "colors.fg.muted",
            _hover: { bg: "colorPalette.subtle" },
          },
        },
        indicator: checkVariants.solid,
      },
      subtle: {
        root: {
          ...cardSurface,
          bg: "bg.muted",
          borderColor: "transparent",
          // The subtle fill sits on bg.muted, where fg.subtle only reaches 4.3:1, so the description steps up to fg.muted.
          "--card-desc": "colors.fg.muted",
          _hover: { bg: "bg.emphasized" },
          _checked: { bg: "colorPalette.emphasized", color: "fg", borderColor: "transparent", _hover: { bg: "colorPalette.emphasized" } },
        },
        indicator: checkVariants.solid,
      },
      solid: {
        root: {
          ...cardSurface,
          _checked: {
            bg: "colorPalette.solid",
            color: "colorPalette.contrast",
            borderColor: "colorPalette.solid",
            _hover: { bg: "colorPalette.solid" },
            "--card-desc": "colors.colorPalette.contrast",
          },
        },
        // Inverted mark: contrast colour on the solid card.
        indicator: {
          borderColor: "border.control",
          "&:is([data-state=checked], [data-state=indeterminate])": {
            bg: "colorPalette.contrast",
            color: "colorPalette.solid",
            borderColor: "colorPalette.contrast",
          },
        },
      },
    },
  },
})

const radioIndicatorBase = { ...radioBase }

export const radioCardSlotRecipe = defineSlotRecipe({
  slots: radioCardAnatomy.keys(),
  base: {
    root: { gap: "2" },
    item: {
      borderRadius: "l2",
      transitionProperty: "background-color, border-color, color",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
      // Chakra tints the item on focus; Arc only draws the keyboard outline, and Chakra's item has no ring of its own
      // (the focused element is the hidden input), so the item draws one when its input is keyboard-focused.
      _focus: { bg: "inherit" },
      focusVisibleRing: "outside",
    },
    label: { textStyle: "sm", fontWeight: "medium" },
    itemText: { textStyle: "sm", fontWeight: "medium" },
    itemDescription: desc,
    itemIndicator: radioIndicatorBase,
  },
  variants: {
    size: {
      sm: { itemControl: sizeBody.sm.control, itemIndicator: radioSizes.sm },
      md: { itemControl: sizeBody.md.control, itemIndicator: radioSizes.md },
      lg: { itemControl: sizeBody.lg.control, itemIndicator: radioSizes.lg, item: { textStyle: "sm" } },
    },
    variant: {
      outline: {
        item: {
          ...cardSurface,
          boxShadow: "none",
          _checked: { ...checkedOutline, color: "fg", boxShadow: "none", _hover: { bg: tint } },
        },
        itemControl: { _disabled: { bg: "transparent" } },
        itemIndicator: radioVariants.solid,
      },
      surface: {
        item: {
          ...cardSurface,
          _checked: {
            bg: "colorPalette.subtle",
            color: "fg",
            borderColor: "colorPalette.border",
            "--card-desc": "colors.fg.muted",
            _hover: { bg: "colorPalette.subtle" },
          },
        },
        itemControl: { _disabled: { bg: "transparent" } },
        itemIndicator: radioVariants.solid,
      },
      subtle: {
        item: {
          ...cardSurface,
          bg: "bg.muted",
          borderColor: "transparent",
          "--card-desc": "colors.fg.muted",
          _hover: { bg: "bg.emphasized" },
          _checked: { bg: "colorPalette.emphasized", color: "fg", borderColor: "transparent", _hover: { bg: "colorPalette.emphasized" } },
        },
        itemControl: { _checked: { bg: "transparent", color: "fg" }, _disabled: { bg: "transparent" } },
        itemIndicator: radioVariants.solid,
      },
      solid: {
        item: {
          ...cardSurface,
          _checked: {
            bg: "colorPalette.solid",
            color: "colorPalette.contrast",
            borderColor: "colorPalette.solid",
            _hover: { bg: "colorPalette.solid" },
            "--card-desc": "colors.colorPalette.contrast",
          },
        },
        itemControl: { _disabled: { bg: "transparent" } },
        itemIndicator: {
          borderColor: "border.control",
          _checked: { bg: "colorPalette.contrast", color: "colorPalette.solid", borderColor: "colorPalette.contrast" },
        },
      },
    },
  },
})
