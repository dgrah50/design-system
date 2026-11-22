import { defineSlotRecipe } from "@chakra-ui/react"
import { segmentGroupAnatomy, tabsAnatomy } from "@chakra-ui/react/anatomy"

/** Arc segmented shell: bg.subtle, hairline border, 4px padding; selected item is a raised bg.panel chip. */
const shell = {
  bg: "bg.subtle",
  borderWidth: "1px",
  borderColor: "border",
  borderRadius: "l2",
  p: "4px",
  gap: "4px",
}

const chipRadius = "calc({radii.l2} - 3px)"

export const tabsSlotRecipe = defineSlotRecipe({
  slots: tabsAnatomy.keys(),
  base: {
    root: {
      "--tabs-trigger-radius": chipRadius,
      "--tabs-indicator-bg": "colors.bg.panel",
      "--tabs-indicator-shadow": "shadows.xs",
    },
    trigger: {
      fontWeight: "medium",
      transitionProperty: "color, background-color, border-color, box-shadow",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
    },
    indicator: { borderWidth: "1px", borderColor: "border" },
  },
  variants: {
    variant: {
      line: {
        list: { borderColor: "border" },
        trigger: {
          color: "fg.subtle",
          _hover: { color: "fg" },
          _selected: { color: "fg", "--indicator-color": "colors.colorPalette.solid" },
        },
      },
      enclosed: {
        list: { ...shell, minH: "auto", display: "inline-flex" },
        trigger: {
          minH: "36px",
          h: "auto",
          px: "3",
          py: "0",
          color: "fg.subtle",
          borderWidth: "1px",
          borderColor: "transparent",
          borderRadius: chipRadius,
          _hover: { color: "fg" },
          _selected: {
            bg: "bg.panel",
            color: "fg",
            borderColor: "border",
            shadow: "xs",
          },
        },
      },
      subtle: {
        trigger: {
          color: "fg.subtle",
          _selected: { bg: "colorPalette.subtle", color: "colorPalette.fg" },
        },
      },
    },
  },
})

export const segmentGroupSlotRecipe = defineSlotRecipe({
  slots: segmentGroupAnatomy.keys(),
  base: {
    root: {
      ...shell,
      "--segment-radius": chipRadius,
      "--segment-indicator-bg": "colors.bg.panel",
      "--segment-indicator-shadow": "shadows.xs",
      boxShadow: "none",
    },
    item: {
      fontWeight: "medium",
      color: "fg.subtle",
      transitionProperty: "color",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
      _hover: { color: "fg" },
      _checked: { color: "fg" },
      _before: { display: "none" },
      "&[data-state=checked][data-ssr]": { bg: "bg.panel", shadow: "xs", borderWidth: "1px", borderColor: "border" },
    },
    indicator: { borderWidth: "1px", borderColor: "border" },
  },
  variants: {
    size: {
      xs: { item: { textStyle: "xs", px: "3", minH: "28px", height: "auto" } },
      sm: { item: { textStyle: "sm", px: "3", minH: "32px", height: "auto" } },
      md: { item: { textStyle: "sm", px: "3", minH: "36px", height: "auto" } },
      lg: { item: { textStyle: "sm", px: "4", minH: "40px", height: "auto" } },
    },
  },
})
