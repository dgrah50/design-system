import { defineRecipe, defineSlotRecipe } from "@chakra-ui/react"
import {
  comboboxAnatomy,
  fieldAnatomy,
  nativeSelectAnatomy,
  numberInputAnatomy,
  pinInputAnatomy,
  selectAnatomy,
} from "@chakra-ui/react/anatomy"
import {
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

type SizeKey = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
/** Sizes Chakra's select, combobox, number input and textarea recipes define. */
const SIZES: SizeKey[] = ["xs", "sm", "md", "lg", "xl"]
/** Chakra's input (and pin input, which reuses it) also has 2xl. Heights match button: xl 56, 2xl 64. */
const INPUT_SIZES: SizeKey[] = [...SIZES, "2xl"]
const textStyleFor = (s: SizeKey) => (s === "xs" ? "xs" : "sm") // 14px at every control size

/* Input ------------------------------------------------------------------- */

const inputSize = (s: SizeKey) => ({
  textStyle: textStyleFor(s),
  px: s === "xs" ? "2.5" : "3",
  "--input-height": controlHeightVar[s],
})

// Base and `outline` both spell out textField on purpose: Chakra's own `outline` variant is merged in and
// would otherwise win over the base, and `flushed` relies on the base for placeholder, disabled and transitions.
export const inputRecipe = defineRecipe({
  base: { ...textField },
  variants: {
    size: Object.fromEntries(INPUT_SIZES.map((s) => [s, inputSize(s)])),
    variant: {
      outline: { ...textField },
      subtle: { ...textField, ...subtleFill },
      flushed: {
        bg: "transparent",
        borderWidth: "0",
        borderBottomWidth: "1px",
        borderBottomColor: "border.control",
        borderRadius: "0",
        px: "0",
        boxShadow: "none",
        focusVisibleRing: "none",
        _hover: { borderBottomColor: "fg" },
        _focus: { borderBottomColor: "fg", boxShadow: "none" },
        _focusVisible: { borderBottomColor: "fg", boxShadow: "none" },
      },
    },
  },
  defaultVariants: { size: "md", variant: "outline" },
})

/* Textarea ---------------------------------------------------------------- */

export const textareaRecipe = defineRecipe({
  base: { ...textField },
  variants: {
    size: Object.fromEntries(
      SIZES.map((s) => [
        s,
        {
          textStyle: textStyleFor(s),
          px: s === "xs" ? "2.5" : "3",
          py: s === "xs" ? "1.5" : "2.5",
          minH: controlHeight[s],
          scrollPaddingBottom: "2.5",
        },
      ]),
    ),
    variant: {
      outline: { ...textField },
      subtle: { ...textField, ...subtleFill },
      flushed: {
        bg: "transparent",
        borderWidth: "0",
        borderBottomWidth: "1px",
        borderBottomColor: "border.control",
        borderRadius: "0",
        px: "0",
        focusVisibleRing: "none",
        _hover: { borderBottomColor: "fg" },
        _focus: { borderBottomColor: "fg", boxShadow: "none" },
        _focusVisible: { borderBottomColor: "fg", boxShadow: "none" },
      },
    },
  },
  defaultVariants: { size: "md", variant: "outline" },
})

/* Field / label ----------------------------------------------------------- */

export const fieldSlotRecipe = defineSlotRecipe({
  slots: fieldAnatomy.keys(),
  base: {
    root: { gap: "2" },
    label: { textStyle: "sm", fontWeight: "medium", color: "fg" },
    helperText: { textStyle: "xs", color: "fg.subtle" },
    errorText: { textStyle: "xs", fontWeight: "normal", color: "fg.error" },
  },
})

/* Select ------------------------------------------------------------------ */

const selectContent = {
  ...floatingPanel,
  p: "5px",
  gap: "0",
  maxH: "min(320px, var(--available-height))",
  _open: floatingOpen,
  _closed: floatingClosed,
}

const selectSizes = Object.fromEntries(
  SIZES.map((s) => [
    s,
    {
      root: {
        "--select-trigger-height": controlHeightVar[s],
        "--select-trigger-padding-x": "spacing.3",
      },
      trigger: { textStyle: textStyleFor(s), gap: "2" },
      content: { p: "5px", textStyle: "sm" },
      item: { ...listItem },
      itemGroupLabel: { px: "11px", py: "1.5", textStyle: "xs", color: "fg.muted", fontWeight: "medium" },
    },
  ]),
)

// Every variant (outline, subtle, ghost: all three Chakra has) restates triggerField, so the base only adds
// the height and the per-variant objects are the single source for the trigger look.
export const selectSlotRecipe = defineSlotRecipe({
  slots: selectAnatomy.keys(),
  base: {
    root: { gap: "2" },
    trigger: { minH: "var(--select-trigger-height)" },
    content: selectContent,
    item: { ...listItem, gap: "2" },
    itemGroupLabel: { fontWeight: "medium", color: "fg.muted" },
    label: { fontWeight: "medium" },
  },
  variants: {
    variant: {
      outline: { trigger: { ...triggerField, _expanded: { borderColor: "fg" } } },
      subtle: { trigger: { ...triggerField, ...subtleFill } },
      ghost: { trigger: { ...triggerField, bg: "transparent", borderColor: "transparent" } },
    },
    size: selectSizes,
  },
})

/* Native select ----------------------------------------------------------- */

export const nativeSelectSlotRecipe = defineSlotRecipe({
  slots: nativeSelectAnatomy.keys(),
  base: {
    // Base also covers Chakra's `plain` and `ghost` variants, which this theme does not restate.
    field: { ...triggerField, "& > option, & > optgroup": { bg: "bg.raised", color: "fg" } },
    indicator: { color: "fg.muted" },
  },
  variants: {
    variant: {
      outline: { field: { ...triggerField, _expanded: { borderColor: "fg" } } },
      subtle: { field: { ...triggerField, ...subtleFill } },
    },
    size: Object.fromEntries(
      SIZES.map((s) => [
        s,
        {
          root: { "--select-field-height": controlHeightVar[s] },
          field: { textStyle: textStyleFor(s), ps: "3", pe: "8" },
        },
      ]),
    ),
  },
})

/* Combobox ---------------------------------------------------------------- */

export const comboboxSlotRecipe = defineSlotRecipe({
  slots: comboboxAnatomy.keys(),
  base: {
    root: { gap: "2" },
    input: { ...textField, minH: "var(--combobox-input-height)" },
    content: { ...floatingPanel, p: "5px", maxH: "min(320px, var(--available-height))", _open: floatingOpen, _closed: floatingClosed },
    item: { ...listItem, gap: "2" },
    itemGroupLabel: { fontWeight: "medium", color: "fg.muted" },
  },
  variants: {
    variant: {
      outline: { input: { ...textField } },
      subtle: { input: { ...textField, ...subtleFill } },
    },
    size: Object.fromEntries(
      SIZES.map((s) => [
        s,
        {
          root: { "--combobox-input-height": controlHeightVar[s], "--combobox-input-padding-x": "spacing.3" },
          input: { textStyle: textStyleFor(s) },
          content: {
            p: "5px",
            textStyle: "sm",
            "--combobox-item-padding-x": "11px",
            "--combobox-item-padding-y": "0px",
          },
          trigger: { textStyle: textStyleFor(s) },
        },
      ]),
    ),
  },
})

/* Number input ------------------------------------------------------------ */

export const numberInputSlotRecipe = defineSlotRecipe({
  slots: numberInputAnatomy.keys(),
  base: {
    input: { ...textField, "--stepper-width": "sizes.8" },
    control: { borderStartColor: "border", divideColor: "border" },
    incrementTrigger: { "--stepper-base-radius": "radii.item", color: "fg.muted", _hover: { bg: "bg.subtle", color: "fg" } },
    decrementTrigger: { "--stepper-base-radius": "radii.item", color: "fg.muted", _hover: { bg: "bg.subtle", color: "fg" } },
  },
  variants: {
    size: Object.fromEntries(
      SIZES.map((s) => [
        s,
        {
          root: { "--input-height": controlHeightVar[s] },
          input: inputSize(s),
          control: { fontSize: "xs", "--stepper-width": s === "xs" ? "sizes.5" : "sizes.7" },
        },
      ]),
    ),
    variant: {
      outline: { input: { ...textField } },
      subtle: { input: { ...textField, ...subtleFill } },
    },
  },
})

/* Pin input --------------------------------------------------------------- */

export const pinInputSlotRecipe = defineSlotRecipe({
  slots: pinInputAnatomy.keys(),
  base: { input: { ...textField, textAlign: "center", width: "var(--input-height)" } },
  variants: {
    size: Object.fromEntries(INPUT_SIZES.map((s) => [s, { input: { ...inputSize(s), px: "1" } }])),
    variant: {
      outline: { input: { ...textField } },
      subtle: { input: { ...textField, ...subtleFill } },
    },
  },
})
