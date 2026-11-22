import { defineRecipe } from "@chakra-ui/react"
import { controlHeight } from "./shared"

/**
 * Arc button. Press = scale(.97) in 120ms standard, release on the spring easing.
 * Everything else transitions at 160ms standard.
 */
export const buttonRecipe = defineRecipe({
  base: {
    borderRadius: "l2",
    fontWeight: "medium",
    lineHeight: "body",
    transition: [
      "color {durations.fast} {easings.standard}",
      "background-color {durations.fast} {easings.standard}",
      "border-color {durations.fast} {easings.standard}",
      "opacity {durations.fast} {easings.standard}",
      "box-shadow {durations.fast} {easings.standard}",
      "transform {durations.spring} {easings.spring}",
    ].join(", "),
    WebkitTapHighlightColor: "transparent",
    _active: {
      transform: "scale(.97)",
      transition: [
        "color {durations.fast} {easings.standard}",
        "background-color {durations.fast} {easings.standard}",
        "border-color {durations.fast} {easings.standard}",
        "opacity {durations.fast} {easings.standard}",
        "box-shadow {durations.fast} {easings.standard}",
        "transform {durations.instant} {easings.standard}",
      ].join(", "),
    },
    _disabled: {
      opacity: 0.52,
      cursor: "not-allowed",
      transform: "none",
      shadow: "none",
    },
  },
  variants: {
    size: {
      xs: { h: controlHeight.xs, minW: controlHeight.xs, textStyle: "xs", px: "2.5", gap: "1" },
      sm: { h: controlHeight.sm, minW: controlHeight.sm, textStyle: "sm", px: "3", gap: "2" },
      md: { h: controlHeight.md, minW: controlHeight.md, textStyle: "sm", px: "4", gap: "2" },
      lg: { h: controlHeight.lg, minW: controlHeight.lg, textStyle: "sm", px: "5", gap: "2" },
      xl: { h: controlHeight.xl, minW: controlHeight.xl, textStyle: "sm", px: "6", gap: "2.5" },
      "2xl": { h: controlHeight["2xl"], minW: controlHeight["2xl"], textStyle: "md", px: "7", gap: "3" },
    },
    variant: {
      solid: {
        bg: "colorPalette.solid",
        color: "colorPalette.contrast",
        borderColor: "transparent",
        _hover: { bg: "colorPalette.solid", opacity: 0.91, shadow: "xs" },
        _active: { opacity: 0.84 },
        _expanded: { bg: "colorPalette.solid", opacity: 0.91 },
      },
      subtle: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        borderColor: "transparent",
        _hover: { bg: "colorPalette.muted", shadow: "xs" },
        _active: { bg: "colorPalette.emphasized" },
        _expanded: { bg: "colorPalette.muted" },
      },
      surface: {
        bg: "colorPalette.subtle",
        color: "colorPalette.fg",
        borderColor: "colorPalette.border",
        shadow: "none",
        shadowColor: "transparent",
        _hover: { bg: "colorPalette.muted", shadow: "xs" },
        _active: { bg: "colorPalette.emphasized" },
        _expanded: { bg: "colorPalette.muted" },
      },
      outline: {
        bg: "bg.panel",
        color: "colorPalette.fg",
        borderColor: "border",
        "--outline-color": "colors.border",
        _hover: { bg: "bg.subtle", shadow: "xs" },
        _active: { bg: "bg.muted" },
        _expanded: { bg: "bg.subtle" },
      },
      ghost: {
        bg: "transparent",
        color: "fg.muted",
        _hover: { bg: "bg.subtle", color: "fg" },
        _active: { bg: "bg.muted", color: "fg" },
        _expanded: { bg: "bg.subtle", color: "fg" },
      },
      plain: { color: "colorPalette.fg" },
    },
  },
  defaultVariants: { size: "md", variant: "solid" },
})
