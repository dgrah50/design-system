import { defineSlotRecipe } from "@chakra-ui/react"
import { actionBarAnatomy, collapsibleAnatomy, hoverCardAnatomy, scrollAreaAnatomy } from "@chakra-ui/react/anatomy"
import { colorTransition, controlHeight, floatingClosed, floatingOpen, floatingPanel } from "./shared"

/* HoverCard (Arc hover-card) -------------------------------------------------------- */

/** A floating panel like Popover: raised surface, hairline, panel radius, floating shadow; 16px padding at md (Arc). */
export const hoverCardSlotRecipe = defineSlotRecipe({
  slots: hoverCardAnatomy.keys(),
  base: {
    content: {
      ...floatingPanel,
      "--hovercard-bg": "colors.bg.raised",
      bg: "var(--hovercard-bg)",
      maxW: "18.5rem",
      textStyle: "sm",
      letterSpacing: "body",
      _open: floatingOpen,
      _closed: floatingClosed,
    },
    arrow: { "--arrow-background": "var(--hovercard-bg)" },
    arrowTip: { borderColor: "border", borderTopWidth: "1px", borderLeftWidth: "1px" },
  },
  variants: {
    size: {
      xs: { content: { p: "2.5" } },
      sm: { content: { p: "3" } },
      md: { content: { p: "4" } },
      lg: { content: { p: "6" } },
    },
  },
})

/* Collapsible --------------------------------------------------------------------------- */

/** Same motion as Accordion: 240ms enter ease to open, 160ms standard to close; the indicator turns on the spring. */
export const collapsibleSlotRecipe = defineSlotRecipe({
  slots: collapsibleAnatomy.keys(),
  base: {
    trigger: { cursor: "pointer", ...colorTransition },
    content: {
      _open: { animationDuration: "standard", animationTimingFunction: "enter" },
      _closed: { animationDuration: "fast", animationTimingFunction: "standard" },
    },
    indicator: {
      display: "inline-flex",
      transitionProperty: "rotate, transform",
      transitionDuration: "spring",
      transitionTimingFunction: "spring",
      color: "fg.subtle",
    },
  },
})

/* ScrollArea (Arc scroll-area) ------------------------------------------------------------ */

/** Overlay scrollbars: no track, a pill thumb at 30% ink that firms to 50% under the pointer. */
export const scrollAreaSlotRecipe = defineSlotRecipe({
  slots: scrollAreaAnatomy.keys(),
  base: {
    scrollbar: {
      bg: "transparent",
      "--thumb-bg": "{colors.fg/30}",
      "&:is(:hover, :active)": { "--thumb-bg": "{colors.fg/50}" },
    },
    thumb: { transitionProperty: "background-color", transitionDuration: "fast", transitionTimingFunction: "standard" },
    corner: { bg: "transparent" },
  },
})

/* ActionBar (Arc floating-button-group, floating) -------------------------------------------- */

/**
 * A raised tray: `bg.raised`, hairline, floating shadow, 4px padding around 36px controls, entering with the same
 * fade + 5px slide + scale as other floating layers.
 */
export const actionBarSlotRecipe = defineSlotRecipe({
  slots: actionBarAnatomy.keys(),
  base: {
    content: {
      bg: "bg.raised",
      color: "fg",
      borderWidth: "1px",
      borderColor: "border",
      borderRadius: "l3",
      boxShadow: "lg",
      p: "1",
      gap: "1",
      "--slide-from-bottom-distance": "5px",
      "--slide-to-bottom-distance": "3px",
      _open: { animationName: "slide-from-bottom, scale-in, fade-in", animationDuration: "fast", animationTimingFunction: "enter" },
      _closed: { animationName: "slide-to-bottom, scale-out, fade-out", animationDuration: "instant", animationTimingFunction: "standard" },
    },
    separator: { bg: "border", h: "5", mx: "1" },
    selectionTrigger: {
      h: controlHeight.sm,
      px: "3",
      textStyle: "sm",
      fontWeight: "medium",
      borderColor: "border.control",
      borderRadius: "l1",
      color: "fg",
    },
  },
})
