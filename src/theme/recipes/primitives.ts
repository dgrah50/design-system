import { defineRecipe, defineSlotRecipe } from "@chakra-ui/react"
import {
  blockquoteAnatomy,
  codeBlockAnatomy,
  dataListAnatomy,
  emptyStateAnatomy,
  fieldsetAnatomy,
  listAnatomy,
  qrCodeAnatomy,
  statusAnatomy,
} from "@chakra-ui/react/anatomy"
import { controlHeightVar } from "./shared"

/* Kbd ------------------------------------------------------------------------------------ */

/** A key cap: mono 12px / 500, 6px radius (as Badge md), a hairline with a thicker foot. Heights 18 / 20 / 24. */
export const kbdRecipe = defineRecipe({
  base: { borderRadius: "6px", fontWeight: "medium", px: "1.5", textStyle: "xs" },
  variants: {
    variant: {
      raised: { bg: "bg.subtle", color: "fg", borderWidth: "1px", borderBottomWidth: "2px", borderColor: "border.emphasized" },
      outline: { bg: "transparent", color: "fg", borderWidth: "1px", borderColor: "border.emphasized" },
      subtle: { bg: "bg.muted", color: "fg" },
      plain: { color: "fg.muted" },
    },
    size: {
      sm: { textStyle: "xs", fontSize: "11px", height: "4.5", minW: "4.5" },
      md: { textStyle: "xs", height: "5", minW: "5" },
      lg: { textStyle: "sm", height: "6", minW: "6", px: "2" },
    },
  },
  defaultVariants: { variant: "raised", size: "md" },
})

/* Code (inline) ----------------------------------------------------------------------------- */

/** Mono on a quiet fill. `subtle` uses `colorPalette.muted` (a neutral grey under the ink palette), `surface` adds a hairline. */
export const codeRecipe = defineRecipe({
  base: { borderRadius: "6px", px: "1.5" },
  variants: {
    variant: {
      subtle: { bg: "colorPalette.muted", color: "colorPalette.fg" },
      surface: { bg: "colorPalette.subtle", color: "colorPalette.fg", shadow: "inset 0 0 0 1px var(--shadow-color)", shadowColor: "colorPalette.border" },
      outline: { bg: "transparent", color: "colorPalette.fg", shadow: "inset 0 0 0 1px var(--shadow-color)", shadowColor: "colorPalette.border" },
      solid: { bg: "colorPalette.solid", color: "colorPalette.contrast" },
      plain: { color: "colorPalette.fg", px: "0" },
    },
    size: {
      xs: { textStyle: "2xs", minH: "4", px: "1" },
      sm: { textStyle: "xs", minH: "5" },
      md: { textStyle: "sm", minH: "6", px: "2" },
      lg: { textStyle: "sm", minH: "7", px: "2.5" },
    },
  },
})

/* CodeBlock (Arc code-block) ------------------------------------------------------------------ */

/**
 * A hairline panel on `bg.panel` in both modes (Chakra's block is dark-scheme), header and footer divided by a
 * quiet rule, 14px / 500 title. Radius steps sm = control, md = panel (Arc), lg = surface. The overlay that
 * hides collapsed code fades to the panel, not to black.
 */
const blockSize = (radius: string, header: string, pad: string, code: "xs" | "sm", title: "xs" | "sm") => ({
  root: { "--code-block-padding": pad, "--code-block-radius": radius, "--code-block-header-height": header },
  title: { textStyle: title },
  code: { fontSize: code },
})

export const codeBlockSlotRecipe = defineSlotRecipe({
  slots: codeBlockAnatomy.keys(),
  base: {
    root: {
      bg: "bg.panel",
      color: "fg",
      borderColor: "border",
      "--code-block-bg": "colors.bg.panel",
      "--code-block-fg": "colors.fg",
    },
    header: { borderBottomWidth: "1px", borderColor: "border.muted", mb: "0", py: "2" },
    footer: { borderTopWidth: "1px", borderColor: "border.muted" },
    title: { color: "fg.muted", fontWeight: "medium" },
    content: { colorScheme: "inherit" },
    code: { lineHeight: "1.7", color: "fg" },
    overlay: { "--bg": "colors.bg.panel", color: "fg" },
  },
  variants: {
    size: {
      sm: blockSize("radii.l2", "sizes.control.sm", "spacing.3", "xs", "xs"),
      md: blockSize("radii.l3", "3.25rem", "spacing.4", "sm", "sm"),
      lg: blockSize("radii.surface", "3.5rem", "spacing.5", "sm", "sm"),
    },
  },
})

/* Link ------------------------------------------------------------------------------------------ */

/** 500 weight like every interactive text. `plain` underlines on hover (45%), `underline` always. */
export const linkRecipe = defineRecipe({
  base: { fontWeight: "medium", transitionProperty: "color, text-decoration-color", transitionDuration: "fast", transitionTimingFunction: "standard" },
  variants: {
    variant: {
      plain: {
        color: "colorPalette.fg",
        textDecoration: "underline",
        textDecorationColor: "transparent",
        textUnderlineOffset: "3px",
        _hover: { textDecorationColor: "currentColor/45" },
      },
      underline: {
        color: "colorPalette.fg",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        textDecorationColor: "currentColor/45",
        _hover: { textDecorationColor: "currentColor" },
      },
    },
  },
})

/* Spinner ------------------------------------------------------------------------------------------ */

/** A 20% ring of the current colour under a 2px (3px from lg) arc; works on any fill. */
const spin = (size: string, thickness: string) => ({ "--spinner-size": size, "--spinner-thickness": thickness })

export const spinnerRecipe = defineRecipe({
  base: {
    borderWidth: "var(--spinner-thickness)",
    "--spinner-track-color": "color-mix(in oklab, currentColor 20%, transparent)",
    borderBottomColor: "var(--spinner-track-color)",
    borderInlineStartColor: "var(--spinner-track-color)",
  },
  variants: {
    size: {
      inherit: spin("1em", "2px"),
      xs: spin("spacing.3", "1.5px"),
      sm: spin("spacing.4", "2px"),
      md: spin("spacing.5", "2px"),
      lg: spin("spacing.8", "3px"),
      xl: spin("spacing.10", "3px"),
    },
  },
})

/* Status -------------------------------------------------------------------------------------------- */

/** A dot in `colorPalette.solid` with a 16% halo, a 500-weight label. Palette: green / red / orange / blue for states. */
export const statusSlotRecipe = defineSlotRecipe({
  slots: statusAnatomy.keys(),
  base: {
    root: { gap: "2.5", fontWeight: "medium", color: "fg" },
    indicator: { boxShadow: "0 0 0 3px color-mix(in oklab, {colors.colorPalette.solid} 16%, transparent)" },
  },
})

/* DataList -------------------------------------------------------------------------------------------- */

export const dataListSlotRecipe = defineSlotRecipe({
  slots: dataListAnatomy.keys(),
  base: {
    itemLabel: { textStyle: "sm" },
    itemValue: { textStyle: "sm" },
  },
  variants: {
    variant: {
      subtle: { itemLabel: { color: "fg.muted" }, itemValue: { color: "fg" } },
      bold: { itemLabel: { color: "fg", fontWeight: "medium" }, itemValue: { color: "fg.muted" } },
    },
  },
})

/* Blockquote ----------------------------------------------------------------------------------------------- */

/** A 2px rule (a 4px bar is heavier than any other Arc surface edge) and body-size text; `solid` rules in the palette. */
export const blockquoteSlotRecipe = defineSlotRecipe({
  slots: blockquoteAnatomy.keys(),
  base: {
    root: { color: "fg", gap: "2" },
    caption: { textStyle: "xs", color: "fg.subtle" },
  },
  variants: {
    variant: {
      subtle: { root: { px: "4", borderStartWidth: "2px", borderStartColor: "border.emphasized" }, icon: { color: "fg.subtle" } },
      solid: { root: { px: "4", borderStartWidth: "2px", borderStartColor: "colorPalette.solid" }, icon: { color: "colorPalette.solid" } },
      plain: { root: { px: "4" }, icon: { color: "fg.subtle" } },
    },
  },
})

/* List ------------------------------------------------------------------------------------------------------- */

export const listSlotRecipe = defineSlotRecipe({
  slots: listAnatomy.keys(),
  base: {
    root: { "--list-gap": "spacing.2", textStyle: "sm" },
    indicator: { color: "fg.muted" },
  },
})

/* Mark -------------------------------------------------------------------------------------------------------- */

export const markRecipe = defineRecipe({
  base: { borderRadius: "4px" },
  variants: {
    variant: {
      subtle: { bg: "colorPalette.muted", color: "inherit", px: "1" },
      solid: { bg: "colorPalette.solid", color: "colorPalette.contrast", px: "1" },
      text: { fontWeight: "medium", color: "colorPalette.fg" },
      plain: {},
    },
  },
})

/* EmptyState (Arc empty-state) ---------------------------------------------------------------------------------- */

/** A 48px hairline chip on `bg.subtle` with panel radius, a 16px / 500 title, 14px secondary copy at 18rem. */
const emptySize = (chip: string, glyph: string, px: string, py: string, gap: string, title: "md" | "lg") => ({
  root: { px, py },
  content: { gap },
  indicator: { boxSize: chip, fontSize: glyph },
  title: { textStyle: title },
})

export const emptyStateSlotRecipe = defineSlotRecipe({
  slots: emptyStateAnatomy.keys(),
  base: {
    indicator: { borderWidth: "1px", borderColor: "border", borderRadius: "l3", bg: "bg.subtle", color: "fg.muted" },
    title: { fontWeight: "medium", color: "fg" },
    description: { textStyle: "sm", color: "fg.muted", maxW: "18rem", textAlign: "center", textWrap: "balance" },
  },
  variants: {
    size: {
      sm: emptySize("2.5rem", "1.125rem", "4", "6", "3", "md"),
      md: emptySize("3rem", "1.25rem", "5", "10", "4", "md"),
      lg: emptySize("4rem", "1.75rem", "6", "14", "5", "lg"),
    },
  },
})

/* Fieldset ---------------------------------------------------------------------------------------------------------- */

/** Matches Field: 14px / 500 legend, 12px `fg.subtle` helper, 12px `fg.error` message at normal weight. */
export const fieldsetSlotRecipe = defineSlotRecipe({
  slots: fieldsetAnatomy.keys(),
  base: {
    legend: { textStyle: "sm", fontWeight: "medium" },
    helperText: { textStyle: "xs", color: "fg.subtle" },
    errorText: { textStyle: "xs", fontWeight: "normal", color: "fg.error" },
  },
})

/* Icon ------------------------------------------------------------------------------------------------------------------ */

/** Arc draws its glyphs with a 1.75 stroke. */
export const iconRecipe = defineRecipe({ base: { strokeWidth: "1.75" } })

/* InputAddon -------------------------------------------------------------------------------------------------------------- */

const addonSize = (key: keyof typeof controlHeightVar | "2xs", text: "xs" | "sm" | "md" | "lg", px: string) => ({
  textStyle: text,
  px,
  "--input-height": key === "2xs" ? "spacing.7" : controlHeightVar[key],
})

/** An addon is an input's neighbour: same border (`border.control`), same radius, `bg.subtle` fill, `fg.muted` text. It stretches to the input's height inside a group; `--input-height` follows the control scale for standalone use. */
export const inputAddonRecipe = defineRecipe({
  base: { color: "fg.muted", fontWeight: "medium", borderRadius: "l2" },
  variants: {
    size: {
      "2xs": addonSize("2xs", "xs", "2"),
      xs: addonSize("xs", "xs", "2.5"),
      sm: addonSize("sm", "sm", "3"),
      md: addonSize("md", "sm", "3"),
      lg: addonSize("lg", "sm", "3"),
      xl: addonSize("xl", "md", "4"),
      "2xl": addonSize("2xl", "md", "4"),
    },
    variant: {
      outline: { bg: "bg.subtle", borderWidth: "1px", borderColor: "border.control" },
      subtle: { bg: "bg.muted", borderWidth: "1px", borderColor: "transparent" },
      flushed: { bg: "transparent", borderBottomWidth: "1px", borderBottomColor: "border.control", borderRadius: "0", px: "0" },
    },
  },
})

/* QrCode ---------------------------------------------------------------------------------------------------------------------- */

/**
 * Modules always read dark on light, in both modes (an inverted code is unreliable to scan): the tile is `bg.panel`
 * with `fg` in light mode and `bg.inverted` with `fg.inverted` in dark mode. Hairline, control radius.
 */
export const qrCodeSlotRecipe = defineSlotRecipe({
  slots: qrCodeAnatomy.keys(),
  base: {
    root: {
      p: "3",
      bg: "bg.panel",
      color: "fg",
      borderWidth: "1px",
      borderColor: "border",
      borderRadius: "l2",
      _dark: { bg: "bg.inverted", color: "fg.inverted", borderColor: "transparent" },
    },
    overlay: { bg: "bg.panel", _dark: { bg: "bg.inverted" } },
  },
})
