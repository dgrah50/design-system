import { defineSlotRecipe } from "@chakra-ui/react"
import { toastAnatomy } from "@chakra-ui/react/anatomy"

/**
 * Toast (Arc toast + toast-stack). A neutral floating panel: `bg.panel` mixed 6% toward `bg` (Arc's
 * 94% surface), 1px hairline, panel radius, floating shadow. Only the 30px status chip carries a tone:
 * `data-type` switches `colorPalette` on the root, and the body reads neutral tokens only, so the
 * palette reaches the indicator and nothing else. Chakra's per-type solid fills are replaced.
 */

const neutralBody = {
  bg: "color-mix(in oklab, {colors.bg.panel} 94%, {colors.bg})",
  color: "fg",
  "--toast-border-color": "colors.border",
  "--toast-trigger-bg": "colors.bg.subtle",
} as const

export const toastSlotRecipe = defineSlotRecipe({
  slots: toastAnatomy.keys(),
  base: {
    root: {
      ...neutralBody,
      maxW: "26rem",
      gap: "3",
      // Arc: 14px 14px 14px 16px. The end padding clears the 32px close button that sits in the corner.
      py: "3.5",
      ps: "4",
      pe: "calc(2rem + 1.25rem)",
      borderWidth: "1px",
      borderColor: "border",
      borderRadius: "l3",
      boxShadow: "lg",
      letterSpacing: "body",
      // Stacking motion keeps Chakra's properties but drops its overshooting bezier for Arc's standard ease.
      transition:
        "translate {durations.considered} {easings.standard}, scale {durations.considered} {easings.standard}, opacity {durations.standard} {easings.standard}, height {durations.considered} {easings.standard}, box-shadow {durations.standard} {easings.standard}",
      transitionTimingFunction: "standard",
      _closed: {
        transition:
          "translate {durations.considered} {easings.standard}, scale {durations.considered} {easings.standard}, opacity {durations.fast} {easings.standard}",
        transitionTimingFunction: "standard",
      },
      // Status tone for the indicator (it reads colorPalette.fg); every other part stays neutral.
      "&[data-type=success]": { ...neutralBody, colorPalette: "green" },
      "&[data-type=error]": { ...neutralBody, colorPalette: "red" },
      "&[data-type=warning]": { ...neutralBody, colorPalette: "orange" },
      "&[data-type=info]": { ...neutralBody, colorPalette: "blue" },
    },
    title: {
      textStyle: "sm",
      fontWeight: "medium",
      marginEnd: "0",
      // Centres the first line (14px x 1.4) on the 30px chip: (30 - 19.6) / 2.
      mt: "5px",
    },
    description: { display: "block", textStyle: "xs", color: "fg.muted", opacity: 1 },
    indicator: {
      boxSize: "1.875rem",
      p: "7px",
      borderWidth: "1px",
      borderRadius: "full",
      // Tint maths follow Arc: 10% of the tone over the surface, border 24% of the tone over the hairline.
      bg: "color-mix(in oklab, {colors.colorPalette.fg} 10%, {colors.bg.panel})",
      borderColor: "color-mix(in oklab, {colors.colorPalette.fg} 24%, {colors.border})",
      color: "colorPalette.fg",
    },
    actionTrigger: {
      h: "8",
      px: "3",
      alignSelf: "center",
      textStyle: "sm",
      fontWeight: "medium",
      bg: "bg.panel",
      color: "fg",
      borderWidth: "1px",
      // The action is a control: its boundary is border.control (>= 3:1), not the quiet hairline.
      borderColor: "border.control",
      borderRadius: "l2",
      cursor: "pointer",
      transitionProperty: "background-color, border-color, color, transform",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
      _hover: { bg: "bg.subtle" },
      _active: { scale: ".97", bg: "bg.muted", transitionDuration: "instant" },
    },
    closeTrigger: {
      // Arc: 32px round, offset -1px / -2px from the padding box.
      top: "13px",
      insetEnd: "12px",
      boxSize: "2rem",
      p: "0",
      borderRadius: "full",
      color: "fg.subtle",
      textStyle: "md",
      cursor: "pointer",
      transitionProperty: "background-color, color, scale",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
      _hover: { bg: "bg.subtle", color: "fg" },
      _active: { scale: ".96", transitionDuration: "instant" },
      _icon: { boxSize: "4" },
    },
  },
})
