import { defineSlotRecipe } from "@chakra-ui/react"
import { dialogAnatomy, drawerAnatomy, menuAnatomy, popoverAnatomy, tooltipAnatomy } from "@chakra-ui/react/anatomy"
import { floatingClosed, floatingOpen, floatingPanel, listItem } from "./shared"

const backdrop = {
  bg: "oklch(10% 0 0 / .46)",
  backdropFilter: "blur(7px)",
  _open: { animationName: "fade-in", animationDuration: "standard", animationTimingFunction: "enter" },
  _closed: { animationName: "fade-out", animationDuration: "fast", animationTimingFunction: "standard" },
}

const modalContent = {
  bg: "bg.raised",
  color: "fg",
  borderWidth: "1px",
  borderColor: "border",
  borderRadius: "surface",
  boxShadow: "lg",
}

const modalSlots = {
  header: { p: "6", borderBottomWidth: "1px", borderBottomColor: "border", alignItems: "center" },
  body: { px: "6", pt: "6", pb: "6" },
  footer: { px: "6", pt: "0", pb: "6" },
  title: { fontFamily: "body", textStyle: "lg", fontWeight: "medium", letterSpacing: "body" },
  description: { color: "fg.muted", textStyle: "sm" },
}

export const dialogSlotRecipe = defineSlotRecipe({
  slots: dialogAnatomy.keys(),
  base: {
    backdrop,
    content: {
      ...modalContent,
      _open: { animationDuration: "standard", animationTimingFunction: "enter" },
      _closed: { animationDuration: "fast", animationTimingFunction: "standard" },
    },
    ...modalSlots,
    closeTrigger: { top: "4", insetEnd: "4" },
  },
  variants: {
    motionPreset: {
      scale: {
        content: {
          "--slide-from-bottom-distance": "5px",
          "--slide-to-bottom-distance": "3px",
          _open: { animationName: "slide-from-bottom, scale-in, fade-in" },
          _closed: { animationName: "slide-to-bottom, scale-out, fade-out" },
        },
      },
    },
  },
})

export const drawerSlotRecipe = defineSlotRecipe({
  slots: drawerAnatomy.keys(),
  base: {
    backdrop,
    content: {
      ...modalContent,
      borderRadius: "0",
      _open: { animationDuration: "considered", animationTimingFunction: "enter" },
      _closed: { animationDuration: "standard", animationTimingFunction: "standard" },
    },
    ...modalSlots,
    closeTrigger: { top: "4", insetEnd: "4" },
  },
  variants: {
    placement: {
      start: { content: { borderEndRadius: "surface" } },
      end: { content: { borderStartRadius: "surface" } },
      top: { content: { borderBottomRadius: "surface" } },
      bottom: { content: { borderTopRadius: "surface" } },
    },
  },
})

export const menuSlotRecipe = defineSlotRecipe({
  slots: menuAnatomy.keys(),
  base: {
    content: {
      ...floatingPanel,
      "--menu-bg": "colors.bg.raised",
      bg: "var(--menu-bg)",
      _open: floatingOpen,
      _closed: floatingClosed,
    },
    item: { ...listItem, gap: "2.5" },
    itemGroupLabel: { px: "11px", py: "1.5", textStyle: "xs", fontWeight: "medium", color: "fg.muted" },
    itemCommand: { color: "fg.subtle", letterSpacing: "normal" },
    separator: { bg: "border", my: "5px", mx: "0" },
  },
  variants: {
    variant: {
      subtle: { item: { _highlighted: { bg: "bg.subtle" } } },
    },
    size: {
      sm: { content: { p: "5px", scrollPadding: "5px" }, item: { textStyle: "xs", minH: "32px", px: "10px", py: "0" } },
      md: { content: { p: "5px", scrollPadding: "5px" }, item: { textStyle: "sm", minH: "36px", px: "11px", py: "0" } },
    },
  },
})

export const popoverSlotRecipe = defineSlotRecipe({
  slots: popoverAnatomy.keys(),
  base: {
    content: {
      ...floatingPanel,
      "--popover-bg": "colors.bg.raised",
      bg: "var(--popover-bg)",
      _open: floatingOpen,
      _closed: floatingClosed,
    },
  },
  variants: {
    // Arc popovers pad their content 1rem; the Chakra parts carry the padding.
    size: {
      xs: { content: { "--popover-padding": "spacing.3" } },
      sm: { content: { "--popover-padding": "spacing.4" } },
      md: { content: { "--popover-padding": "spacing.4" } },
      lg: { content: { "--popover-padding": "spacing.6" } },
    },
  },
})

export const tooltipSlotRecipe = defineSlotRecipe({
  slots: tooltipAnatomy.keys(),
  base: {
    content: {
      "--tooltip-bg": "colors.bg.inverted",
      bg: "var(--tooltip-bg)",
      color: "fg.inverted",
      px: "4",
      py: "3",
      borderRadius: "l2",
      textStyle: "sm",
      fontWeight: "normal",
      boxShadow: "md",
      maxW: "15rem",
      _open: { ...floatingOpen, animationDuration: "fast" },
      _closed: { ...floatingClosed },
    },
  },
})
