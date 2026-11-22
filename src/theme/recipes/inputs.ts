import { defineSlotRecipe } from "@chakra-ui/react"
import {
  clipboardAnatomy,
  colorPickerAnatomy,
  dateInputAnatomy,
  datePickerAnatomy,
  editableAnatomy,
  fileUploadAnatomy,
  listboxAnatomy,
  ratingGroupAnatomy,
  tagsInputAnatomy,
} from "@chakra-ui/react/anatomy"
import {
  colorTransition,
  controlHeight,
  controlHeightVar,
  floatingClosed,
  floatingOpen,
  floatingPanel,
  listItem,
  subtleFill,
  textField,
  triggerField,
} from "./shared"

/** Text-field look for a part that holds its own height, with focus drawn as an ink border only. */
const fieldPart = { ...textField } as const

/* RatingGroup (Arc rating) ------------------------------------------------------ */

/**
 * Empty stars draw in `border.control` (>= 3:1), filled stars in `colorPalette.solid`. Glyph sizes follow Arc
 * (sm 18, md 24, lg 30); xs 16 is DERIVED. Arc fills with amber: set `colorPalette="orange"` for that.
 */
const star = (px: string) => ({ item: { textStyle: "none", fontSize: px, lineHeight: "1" } })

export const ratingGroupSlotRecipe = defineSlotRecipe({
  slots: ratingGroupAnatomy.keys(),
  base: {
    label: { textStyle: "sm", fontWeight: "medium" },
    control: { gap: "0.5" },
    item: { borderRadius: "l1", p: "0.5", cursor: "pointer", transitionProperty: "transform", transitionDuration: "spring", transitionTimingFunction: "spring", _active: { scale: ".94" } },
    itemIndicator: {
      "& [data-bg]": { color: "border.control" },
      "& [data-fg]": { transitionProperty: "color", transitionDuration: "fast", transitionTimingFunction: "standard" },
    },
  },
  variants: {
    size: { xs: star("1rem"), sm: star("1.125rem"), md: star("1.5rem"), lg: star("1.875rem") },
  },
})

/* FileUpload (Arc file-dropzone + file-upload) ------------------------------------ */

/**
 * Dropzone: a 1px dashed `border.control` edge on `bg.panel` with the surface radius and 34px padding; hover moves
 * to `bg.subtle`, and a drag closes the dashes into a solid line tinted with the palette. File rows are
 * `bg.subtle` cards with a hairline, 14px / 500 names and 12px `fg.subtle` sizes.
 */
export const fileUploadSlotRecipe = defineSlotRecipe({
  slots: fileUploadAnatomy.keys(),
  base: {
    label: { textStyle: "sm", fontWeight: "medium" },
    dropzone: {
      bg: "bg.panel",
      color: "fg",
      borderWidth: "1px",
      borderColor: "border.control",
      borderRadius: "surface",
      minH: "auto",
      width: "100%",
      px: "20px",
      py: "34px",
      gap: "2",
      cursor: "pointer",
      ...colorTransition,
      _hover: { bg: "bg.subtle", borderColor: "fg.subtle" },
      _dragging: {
        bg: "color-mix(in oklab, {colors.colorPalette.solid} 4%, {colors.bg.panel})",
        borderStyle: "solid",
        borderColor: "color-mix(in oklab, {colors.colorPalette.solid} 40%, {colors.border})",
      },
      _disabled: { opacity: 0.5, cursor: "not-allowed" },
    },
    dropzoneContent: { gap: "0.5", textStyle: "sm", fontWeight: "medium" },
    item: {
      bg: "bg.subtle",
      borderColor: "border",
      borderRadius: "l2",
      py: "2.5",
      pe: "2.5",
      ps: "3",
      gap: "3",
    },
    itemName: { textStyle: "sm", fontWeight: "medium" },
    itemSizeText: { color: "fg.subtle", textStyle: "xs" },
    itemPreview: { color: "fg.muted" },
    itemDeleteTrigger: {
      boxSize: "26px",
      p: "0",
      alignSelf: "center",
      borderRadius: "full",
      color: "fg.subtle",
      ...colorTransition,
      transitionProperty: "color, background-color, scale",
      _hover: { bg: "bg.panel", color: "fg" },
      _active: { scale: ".96", transitionDuration: "instant" },
      _icon: { boxSize: "4" },
    },
  },
})

/* Editable (Arc inline-edit) --------------------------------------------------------- */

/**
 * Reads as plain text until hovered (`bg.subtle`, control radius, 8px padding); editing draws a 1px ink border on
 * `bg.panel` and nothing else. Heights follow the control scale: sm 36, md 44, lg 50.
 */
const editableSize = (h: string, text: "sm" | "md") => ({
  root: { textStyle: text },
  preview: { minH: h },
  input: { minH: h },
  textarea: { minH: h },
})

export const editableSlotRecipe = defineSlotRecipe({
  slots: editableAnatomy.keys(),
  base: {
    preview: {
      px: "2",
      py: "0.5",
      borderWidth: "1px",
      borderColor: "transparent",
      borderRadius: "l2",
      transitionProperty: "background-color, color",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
      _hover: { bg: "bg.subtle" },
    },
    input: {
      px: "2",
      py: "0.5",
      bg: "bg.panel",
      borderWidth: "1px",
      borderColor: "fg",
      borderRadius: "l2",
      boxShadow: "none",
      outline: "none",
      focusVisibleRing: "none",
      transitionProperty: "border-color",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
      _placeholder: { color: "fg.subtle", opacity: 1 },
    },
    textarea: {
      px: "2",
      py: "2",
      bg: "bg.panel",
      borderWidth: "1px",
      borderColor: "fg",
      borderRadius: "l2",
      outline: "none",
      focusVisibleRing: "none",
    },
  },
  variants: {
    size: {
      sm: editableSize(controlHeight.sm, "sm"),
      md: editableSize(controlHeight.md, "sm"),
      lg: editableSize(controlHeight.lg, "md"),
    },
  },
})

/* ColorPicker (Arc color-picker) ------------------------------------------------------ */

/**
 * The trigger and channel inputs become Arc text fields at control heights (xs 32, sm 36, md 44, lg 50, xl 56,
 * 2xl 64; 2xs stays Chakra's 28). The popup is a floating panel. Swatches use the item radius.
 */
const pickerSize = (key: keyof typeof controlHeightVar | "2xs", text: "xs" | "sm" | "md", px: string, swatch: string) => {
  const h = key === "2xs" ? "spacing.7" : controlHeightVar[key]
  return {
    channelInput: { textStyle: text, px, "--input-height": h },
    trigger: { "--input-height": h },
    swatch: { "--swatch-size": swatch },
  }
}

export const colorPickerSlotRecipe = defineSlotRecipe({
  slots: colorPickerAnatomy.keys(),
  base: {
    label: { textStyle: "sm", fontWeight: "medium" },
    trigger: {
      bg: "bg.panel",
      color: "fg",
      borderColor: "border.trigger",
      borderRadius: "l2",
      ...colorTransition,
      _hover: { borderColor: "fg" },
      "&:focus-visible": { borderColor: "fg", outline: "none" },
      "&[data-fit-content]": { bg: "transparent" },
    },
    content: {
      ...floatingPanel,
      p: "4",
      width: "18.5rem",
      zIndex: "calc(var(--color-picker-z-index) + var(--layer-index, 0))",
      _open: floatingOpen,
      _closed: floatingClosed,
    },
    area: { borderRadius: "l2" },
    areaThumb: { boxShadow: "thumb" },
    channelSliderThumb: { boxShadow: "thumb" },
    channelText: { color: "fg.muted" },
    formatSelect: { bg: "bg.panel", borderColor: "border.control", borderRadius: "l1", color: "fg", ...colorTransition },
    swatch: { borderRadius: "l1" },
    swatchGroup: { gap: "2" },
    transparencyGrid: { borderRadius: "l2" },
  },
  variants: {
    size: {
      "2xs": pickerSize("2xs", "xs", "2", "spacing.4.5"),
      xs: pickerSize("xs", "xs", "2", "spacing.5"),
      sm: pickerSize("sm", "sm", "2.5", "spacing.6"),
      md: pickerSize("md", "sm", "3", "spacing.7"),
      lg: pickerSize("lg", "sm", "4", "spacing.7"),
      xl: pickerSize("xl", "sm", "4.5", "spacing.8"),
      "2xl": pickerSize("2xl", "md", "5", "spacing.10"),
    },
    variant: {
      outline: {
        channelInput: { ...fieldPart, bg: "bg.panel" },
        trigger: { borderWidth: "1px" },
      },
      subtle: {
        channelInput: { ...fieldPart, ...subtleFill },
        trigger: { borderWidth: "1px", bg: "bg.muted", borderColor: "transparent" },
      },
    },
  },
})

/* TagsInput (Arc tag-input) ---------------------------------------------------------- */

/**
 * The control is an Arc text field (focus = ink border) at control heights; tags are pill chips on `bg.subtle` with a
 * hairline. xs 22px / sm 24 / md 28 (Arc) / lg 32 tag heights are DERIVED around Arc's 28.
 */
const tagsSize = (h: string, item: string, px: string, py: string, text: "xs" | "sm") => ({
  root: {
    "--tags-input-height": h,
    "--tags-input-px": px,
    "--tags-input-py": py,
    "--tags-input-gap": "6px",
    "--tags-input-item-height": item,
    "--tags-input-item-px": "spacing.2.5",
    textStyle: text,
  },
})

// Chakra's variants draw their own `_focus` outline in the focus-ring colour; every variant restates it as an ink border.
const tagFocus = {
  borderColor: "fg",
  outline: "none",
  boxShadow: "none",
  _invalid: { borderColor: "border.error", outline: "none" },
} as const

export const tagsInputSlotRecipe = defineSlotRecipe({
  slots: tagsInputAnatomy.keys(),
  base: {
    label: { textStyle: "sm", fontWeight: "medium" },
    control: {
      color: "fg",
      borderColor: "border.control",
      borderRadius: "l2",
      transitionProperty: "border-color, background-color",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
      "&:hover": { borderColor: "fg" },
      "&:focus-within": tagFocus,
      _disabled: { bg: "bg.subtle", opacity: 0.5 },
      _invalid: { borderColor: "border.error" },
    },
    input: { _placeholder: { color: "fg.subtle" } },
    itemPreview: { borderRadius: "full", fontWeight: "medium" },
    itemDeleteTrigger: { color: "fg.subtle", opacity: 1, borderRadius: "full", _hover: { color: "fg", bg: "bg.panel" } },
    clearTrigger: { color: "fg.subtle", _hover: { color: "fg" } },
  },
  variants: {
    size: {
      xs: tagsSize(controlHeightVar.xs, "22px", "spacing.1.5", "4px", "xs"),
      sm: tagsSize(controlHeightVar.sm, "24px", "spacing.1.5", "5px", "sm"),
      md: tagsSize(controlHeightVar.md, "28px", "7px", "7px", "sm"),
      lg: tagsSize(controlHeightVar.lg, "32px", "8px", "8px", "sm"),
    },
    variant: {
      outline: {
        control: { bg: "bg.panel", borderWidth: "1px", _focus: tagFocus, "&:focus-within": tagFocus },
        itemPreview: { bg: "bg.subtle", borderWidth: "1px", borderColor: "border", color: "fg", _highlighted: { bg: "colorPalette.muted", borderColor: "colorPalette.border" } },
      },
      subtle: {
        control: { bg: "bg.muted", borderWidth: "1px", borderColor: "transparent", "&:hover": { borderColor: "fg" }, _focus: tagFocus, "&:focus-within": tagFocus },
        itemPreview: { bg: "bg.panel", borderWidth: "1px", borderColor: "border", color: "fg", _highlighted: { bg: "colorPalette.subtle", borderColor: "colorPalette.border" } },
      },
      flushed: {
        control: {
          bg: "transparent",
          borderWidth: "0",
          borderBottomWidth: "1px",
          borderBottomColor: "border.control",
          borderRadius: "0",
          "&:hover": { borderBottomColor: "fg" },
          _focus: { borderColor: "fg", boxShadow: "none", outline: "none" },
          "&:focus-within": { borderBottomColor: "fg", boxShadow: "none", outline: "none" },
        },
        itemPreview: { bg: "bg.subtle", borderWidth: "1px", borderColor: "border", color: "fg", _highlighted: { bg: "colorPalette.muted" } },
      },
    },
  },
})

/* Listbox ------------------------------------------------------------------------------ */

/**
 * An inline list in a hairline panel (control radius, no shadow: it is not floating) whose rows are the shared
 * menu rows: 36px, item radius, `bg.subtle` on highlight. Selection is `bg.muted` (subtle) or the palette solid.
 */
export const listboxSlotRecipe = defineSlotRecipe({
  slots: listboxAnatomy.keys(),
  base: {
    label: { textStyle: "sm", fontWeight: "medium" },
    content: { p: "5px", gap: "0", scrollPadding: "5px", "--listbox-item-padding-x": "11px", "--listbox-item-padding-y": "0px" },
    item: { ...listItem, gap: "2.5", px: "var(--listbox-item-padding-x)", outline: "none", cursor: "pointer", _highlighted: { bg: "bg.subtle", outline: "none" } },
    itemGroupLabel: { px: "11px", py: "1.5", textStyle: "xs", fontWeight: "medium", color: "fg.muted" },
    empty: { px: "11px", py: "2", color: "fg.subtle" },
  },
  variants: {
    variant: {
      subtle: {
        content: { bg: "bg.panel", borderWidth: "1px", borderColor: "border", borderRadius: "l2" },
        item: { _hover: { bg: "bg.subtle" }, _selected: { bg: "bg.muted", fontWeight: "medium", _highlighted: { bg: "bg.muted" } } },
      },
      solid: {
        content: { bg: "bg.panel", borderWidth: "1px", borderColor: "border", borderRadius: "l2" },
        item: {
          _selected: { bg: "colorPalette.solid", color: "colorPalette.contrast", fontWeight: "medium", _highlighted: { bg: "colorPalette.solid" } },
        },
      },
      plain: { item: { _hover: { bg: "bg.subtle" }, _selected: { fontWeight: "medium" } } },
    },
  },
})

/* DatePicker and DateInput (Arc date-picker + calendar) -------------------------------------- */

const pickerHeight = (key: "xs" | "sm" | "md" | "lg" | "xl", cell: string, nav: string, select: string) => ({
  root: { "--datepicker-input-height": controlHeightVar[key] },
  view: { "--table-cell-size": cell, "--datepicker-nav-trigger-size": nav, "--datepicker-select-height": select },
})

/**
 * Input: Arc text field at the control height (xs 32 ... xl 56). Calendar popup: a floating panel; nav buttons are 32px
 * round; days are circles that fill with `colorPalette.solid` when selected (Arc calendar); a range tints the run
 * with `colorPalette.muted`. Month and year selects keep the compact header heights (they are not form fields).
 */
export const datePickerSlotRecipe = defineSlotRecipe({
  slots: datePickerAnatomy.keys(),
  base: {
    label: { textStyle: "sm", fontWeight: "medium" },
    input: { color: "fg" },
    trigger: { borderRadius: "full", color: "fg.subtle", transitionProperty: "color, background-color", transitionDuration: "fast", _hover: { color: "fg", bg: "bg.subtle" } },
    clearTrigger: { borderRadius: "full", color: "fg.subtle" },
    content: {
      ...floatingPanel,
      borderRadius: "l3",
      p: "4",
      minW: "20rem",
      zIndex: "calc(var(--date-picker-z-index) + var(--layer-index, 0))",
      _open: floatingOpen,
      _closed: floatingClosed,
    },
    viewTrigger: { fontWeight: "medium", borderRadius: "full", _hover: { bg: "bg.subtle" } },
    rangeText: { fontWeight: "medium" },
    prevTrigger: { borderRadius: "full", color: "fg.muted", ...colorTransition, _hover: { bg: "bg.subtle", color: "fg" }, _active: { scale: ".96" } },
    nextTrigger: { borderRadius: "full", color: "fg.muted", ...colorTransition, _hover: { bg: "bg.subtle", color: "fg" }, _active: { scale: ".96" } },
    monthSelect: { ...triggerField, borderRadius: "l2", focusVisibleRing: "outside" },
    yearSelect: { ...triggerField, borderRadius: "l2", focusVisibleRing: "outside" },
    tableHeader: { fontWeight: "medium", textTransform: "none", color: "fg.muted" },
    tableCellTrigger: {
      borderRadius: "full",
      transitionProperty: "background-color, color, scale",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
      _hover: { bg: "bg.subtle" },
      _today: { color: "fg", fontWeight: "medium", textDecoration: "none", boxShadow: "inset 0 0 0 1px {colors.border.control}" },
      "&[data-selected]": { bg: "colorPalette.solid", color: "colorPalette.contrast", boxShadow: "none", _hover: { bg: "colorPalette.solid" } },
      "&[data-in-range]": { bg: "colorPalette.muted", color: "fg", boxShadow: "none", _hover: { bg: "colorPalette.muted" } },
      "&[data-in-range][data-selected]": { bg: "colorPalette.solid", color: "colorPalette.contrast", _hover: { bg: "colorPalette.solid" } },
    },
  },
  variants: {
    size: {
      xs: pickerHeight("xs", "spacing.8", "spacing.7", "spacing.8"),
      sm: pickerHeight("sm", "spacing.9", "spacing.8", "spacing.9"),
      md: pickerHeight("md", "spacing.10", "spacing.8", "spacing.9"),
      lg: pickerHeight("lg", "spacing.10", "spacing.9", "spacing.10"),
      xl: pickerHeight("xl", "spacing.11", "spacing.10", "spacing.10"),
    },
    variant: {
      outline: { input: { ...fieldPart } },
      subtle: { input: { ...fieldPart, ...subtleFill } },
      flushed: {
        input: {
          bg: "transparent",
          borderWidth: "0",
          borderBottomWidth: "1px",
          borderBottomColor: "border.control",
          borderRadius: "0",
          px: "0",
          boxShadow: "none",
          outline: "none",
          focusVisibleRing: "none",
          _hover: { borderBottomColor: "fg" },
          _focusVisible: { borderBottomColor: "fg", boxShadow: "none", _invalid: { borderBottomColor: "border.error", boxShadow: "none" } },
        },
      },
    },
  },
})

const dateSegmentSize = (key: keyof typeof controlHeightVar, text: "xs" | "sm" | "md", px: string) => ({
  segmentGroup: { textStyle: text, px, "--input-height": controlHeightVar[key] },
})

export const dateInputSlotRecipe = defineSlotRecipe({
  slots: dateInputAnatomy.keys(),
  base: {
    label: { textStyle: "sm", fontWeight: "medium" },
    segment: { _focus: { bg: "bg.muted", color: "fg" }, _placeholderShown: { color: "fg.subtle" } },
  },
  variants: {
    size: {
      xs: dateSegmentSize("xs", "xs", "2"),
      sm: dateSegmentSize("sm", "sm", "2.5"),
      md: dateSegmentSize("md", "sm", "3"),
      lg: dateSegmentSize("lg", "sm", "3.5"),
      xl: dateSegmentSize("xl", "md", "4"),
      "2xl": dateSegmentSize("2xl", "md", "4.5"),
      "2xs": { segmentGroup: { textStyle: "xs", px: "1.5", "--input-height": "spacing.7" } },
    },
    variant: {
      outline: {
        segmentGroup: { ...fieldPart, focusRing: "none", _focus: { borderColor: "fg", boxShadow: "none", outline: "none" }, "&:focus-within": { borderColor: "fg", boxShadow: "none", outline: "none" } },
        segment: { _focus: { bg: "bg.muted", color: "fg" } },
      },
      subtle: {
        segmentGroup: { ...fieldPart, ...subtleFill, focusRing: "none", _focus: { borderColor: "fg", boxShadow: "none", outline: "none" }, "&:focus-within": { borderColor: "fg", boxShadow: "none", outline: "none" } },
        segment: { _focus: { bg: "bg.emphasized", color: "fg" } },
      },
      flushed: {
        segmentGroup: {
          bg: "transparent",
          borderBottomColor: "border.control",
          focusRing: "none",
          "&:hover": { borderBottomColor: "fg" },
          _focus: { borderColor: "fg", boxShadow: "none" },
          "&:focus-within": { borderBottomColor: "fg", boxShadow: "none" },
        },
        segment: { _focus: { bg: "bg.muted", color: "fg" } },
      },
    },
  },
})

/* Clipboard (Arc copy-button) ------------------------------------------------------------- */

/**
 * Chakra ships no Clipboard recipe. `Clipboard.Trigger` becomes Arc's copy button: a hairline control at
 * control height (sm 36, md 44, lg 50) with `bg.subtle` on hover, pressing to .97. The copied indicator turns
 * `fg.success`. `Clipboard.Input` is an Arc text field at the same height.
 */
const clipSize = (h: string, text: "sm" | "md") => ({
  trigger: { h, minW: h, textStyle: text },
  input: { h, textStyle: text },
  valueText: { textStyle: text },
})

export const clipboardSlotRecipe = defineSlotRecipe({
  slots: clipboardAnatomy.keys(),
  className: "chakra-clipboard",
  base: {
    root: { display: "inline-flex", flexDirection: "column", gap: "1.5" },
    control: { display: "inline-flex", alignItems: "center", gap: "2" },
    label: { textStyle: "sm", fontWeight: "medium" },
    valueText: { color: "fg.muted" },
    input: { ...fieldPart, px: "3", minW: "0", flex: "1" },
    trigger: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "2",
      px: "3",
      bg: "bg.panel",
      color: "fg",
      borderWidth: "1px",
      borderColor: "border",
      borderRadius: "l2",
      fontWeight: "medium",
      cursor: "pointer",
      transition:
        "color {durations.fast} {easings.standard}, background-color {durations.fast} {easings.standard}, border-color {durations.fast} {easings.standard}, scale {durations.spring} {easings.spring}",
      _hover: { bg: "bg.subtle", borderColor: "border.emphasized" },
      _active: { scale: ".97", transitionDuration: "instant" },
      _disabled: { opacity: 0.5, cursor: "not-allowed" },
    },
    indicator: { display: "inline-flex", alignItems: "center", gap: "2", "&[data-copied]": { color: "fg.success" } },
  },
  variants: {
    size: { sm: clipSize(controlHeight.sm, "sm"), md: clipSize(controlHeight.md, "sm"), lg: clipSize(controlHeight.lg, "sm") },
  },
  defaultVariants: { size: "md" },
})

/* Toggle (Arc toggle-group item) ------------------------------------------------------------------ */

/**
 * Chakra ships no Toggle recipe and no ToggleGroup. A Toggle is Arc's toggle-group item: a control-height button
 * (sm 36, md 44, lg 50) that is quiet when off and fills when on. Variants: `subtle` (default, a 11% ink tint on
 * `bg.panel` like Arc's `--tg-fill`), `outline` (hairline; on = palette border), `solid` (on = palette solid).
 * Put several in a `bg.subtle` hairline tray to get the grouped look.
 */
const toggleSize = (h: string, px: string) => ({ root: { h, minW: h, px, textStyle: "sm", "& svg": { boxSize: "4" } } })

export const toggleSlotRecipe = defineSlotRecipe({
  slots: ["root", "indicator"],
  className: "chakra-toggle",
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "1.5",
      borderWidth: "1px",
      borderColor: "transparent",
      borderRadius: "l2",
      bg: "transparent",
      color: "fg.muted",
      fontWeight: "medium",
      cursor: "pointer",
      userSelect: "none",
      transition:
        "color {durations.fast} {easings.standard}, background-color {durations.fast} {easings.standard}, border-color {durations.fast} {easings.standard}, scale {durations.spring} {easings.spring}",
      _hover: { color: "fg", bg: "bg.subtle" },
      _active: { scale: ".97", transitionDuration: "instant" },
      _disabled: { opacity: 0.5, cursor: "not-allowed", pointerEvents: "none" },
    },
    indicator: { display: "inline-flex", alignItems: "center" },
  },
  variants: {
    size: { sm: toggleSize(controlHeight.sm, "3"), md: toggleSize(controlHeight.md, "4"), lg: toggleSize(controlHeight.lg, "5") },
    variant: {
      subtle: {
        root: {
          "&[data-state=on], &[aria-pressed=true]": {
            color: "fg",
            bg: "color-mix(in oklab, {colors.colorPalette.solid} 11%, {colors.bg.panel})",
            _hover: { bg: "color-mix(in oklab, {colors.colorPalette.solid} 14%, {colors.bg.panel})" },
          },
        },
      },
      outline: {
        root: {
          borderColor: "border.control",
          "&[data-state=on], &[aria-pressed=true]": {
            color: "colorPalette.fg",
            bg: "colorPalette.subtle",
            borderColor: "colorPalette.solid",
          },
        },
      },
      solid: {
        root: {
          "&[data-state=on], &[aria-pressed=true]": {
            color: "colorPalette.contrast",
            bg: "colorPalette.solid",
            _hover: { bg: "colorPalette.solid", opacity: 0.91 },
          },
        },
      },
    },
  },
  defaultVariants: { size: "md", variant: "subtle" },
})
