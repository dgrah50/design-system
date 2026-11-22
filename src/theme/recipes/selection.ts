import { defineRecipe, defineSlotRecipe } from "@chakra-ui/react"
import { checkboxAnatomy, radioGroupAnatomy, sliderAnatomy, switchAnatomy } from "@chakra-ui/react/anatomy"

/* Checkbox / radio -------------------------------------------------------- */

const checkedSolid = {
  bg: "colorPalette.solid",
  color: "colorPalette.contrast",
  borderColor: "colorPalette.solid",
}

export const checkBase = {
  borderWidth: "1px",
  borderColor: "border.control",
  borderRadius: "5px",
  bg: "transparent",
  color: "colorPalette.contrast",
  transitionProperty: "background-color, border-color, color, box-shadow",
  transitionDuration: "fast",
  transitionTimingFunction: "standard",
  focusVisibleRing: "outside",
  _invalid: { borderColor: "border.error" },
  _disabled: { opacity: 0.5, cursor: "not-allowed" },
} as const

// md 18px is Arc's checkbox; xs 14 / sm 16 / lg 20 are DERIVED in 2px steps.
export const checkSizes = {
  xs: { boxSize: "14px", p: "1px" },
  sm: { boxSize: "16px", p: "1px" },
  md: { boxSize: "18px", p: "2px" },
  lg: { boxSize: "20px", p: "2px" },
}

export const checkVariants = {
  solid: {
    borderColor: "border.control",
    "&:is([data-state=checked], [data-state=indeterminate])": checkedSolid,
  },
  outline: {
    borderColor: "border.control",
    "&:is([data-state=checked], [data-state=indeterminate])": { color: "colorPalette.fg", borderColor: "colorPalette.solid" },
  },
  subtle: {
    bg: "colorPalette.muted",
    borderColor: "colorPalette.muted",
    "&:is([data-state=checked], [data-state=indeterminate])": { color: "colorPalette.fg" },
  },
}

export const checkmarkRecipe = defineRecipe({
  base: checkBase,
  variants: {
    size: checkSizes,
    variant: { ...checkVariants, plain: {}, inverted: {} },
  },
})

export const checkboxSlotRecipe = defineSlotRecipe({
  slots: checkboxAnatomy.keys(),
  base: {
    control: checkBase,
    label: { textStyle: "sm", fontWeight: "medium" },
  },
  variants: {
    size: {
      xs: { control: checkSizes.xs, label: { textStyle: "xs" } },
      sm: { control: checkSizes.sm, label: { textStyle: "sm" } },
      md: { control: checkSizes.md, label: { textStyle: "sm" } },
      lg: { control: checkSizes.lg, label: { textStyle: "sm" } },
    },
    variant: {
      solid: { control: checkVariants.solid },
      outline: { control: checkVariants.outline },
      subtle: { control: checkVariants.subtle },
    },
  },
})

export const radioBase = {
  ...checkBase,
  borderRadius: "full",
  "& .dot": { scale: "0.4" },
} as const
// md 17px is Arc's radio; xs 13 / sm 15 / lg 19 are DERIVED in 2px steps.
export const radioSizes = {
  xs: { boxSize: "13px" },
  sm: { boxSize: "15px" },
  md: { boxSize: "17px" },
  lg: { boxSize: "19px" },
}
export const radioVariants = {
  solid: { borderColor: "border.control", _checked: checkedSolid },
  outline: { borderColor: "border.control", _checked: { color: "colorPalette.fg", borderColor: "colorPalette.solid" } },
  subtle: { bg: "colorPalette.muted", borderColor: "colorPalette.muted", color: "transparent", _checked: { color: "colorPalette.fg" } },
}

export const radiomarkRecipe = defineRecipe({
  base: radioBase,
  variants: { size: radioSizes, variant: { ...radioVariants, inverted: {} } },
})

export const radioGroupSlotRecipe = defineSlotRecipe({
  slots: radioGroupAnatomy.keys(),
  base: {
    itemControl: radioBase,
    label: { textStyle: "sm", fontWeight: "medium" },
  },
  variants: {
    size: {
      xs: { itemControl: radioSizes.xs },
      sm: { itemControl: radioSizes.sm },
      md: { itemControl: radioSizes.md },
      lg: { itemControl: radioSizes.lg },
    },
    variant: {
      solid: { itemControl: radioVariants.solid },
      outline: { itemControl: radioVariants.outline },
      subtle: { itemControl: radioVariants.subtle },
    },
  },
})

/* Switch ------------------------------------------------------------------- */

// md (42 x 24) is Arc's switch; xs 30x18, sm 34x20 and lg 50x28 are DERIVED. Slider sizes below are DERIVED too.
export const switchSlotRecipe = defineSlotRecipe({
  slots: switchAnatomy.keys(),
  base: {
    root: { gap: "3" },
    label: { fontWeight: "medium", textStyle: "sm", lineHeight: "body" },
    control: {
      p: "3px",
      bg: "control.track",
      transitionProperty: "background-color, opacity",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
      _hover: { bg: "control.trackHover" },
      _checked: { bg: "colorPalette.solid", _hover: { bg: "colorPalette.solid" } },
    },
    thumb: {
      width: "calc(var(--switch-height) - 6px)",
      height: "calc(var(--switch-height) - 6px)",
      scale: "1",
      bg: "control.thumb",
      boxShadow: "thumb",
      transition: "translate {durations.spring} {easings.spring}, background-color {durations.standard} {easings.standard}",
      _checked: { bg: "colorPalette.thumb" },
    },
  },
  variants: {
    variant: {
      solid: {
        control: { bg: "control.track", _checked: { bg: "colorPalette.solid" } },
        thumb: {
          width: "calc(var(--switch-height) - 6px)",
          height: "calc(var(--switch-height) - 6px)",
          bg: "control.thumb",
          scale: "1",
          boxShadow: "thumb",
          _checked: { bg: "colorPalette.thumb" },
        },
      },
      raised: {},
    },
    size: {
      xs: { root: { "--switch-width": "30px", "--switch-height": "18px" } },
      sm: { root: { "--switch-width": "34px", "--switch-height": "20px" } },
      md: { root: { "--switch-width": "42px", "--switch-height": "24px" } },
      lg: { root: { "--switch-width": "50px", "--switch-height": "28px" } },
    },
  },
})

/* Slider ------------------------------------------------------------------- */

const sliderLook = {
  track: { bg: "control.rail", shadow: "none", _disabled: { bg: "bg.muted" } },
  range: { bg: "colorPalette.fill" },
  thumb: {
    bg: "control.thumb",
    borderWidth: "0",
    boxShadow: "thumb",
    focusVisibleRing: "outside",
    _focusVisible: { ring: "0" },
    _disabled: { bg: "border.emphasized" },
  },
}

export const sliderSlotRecipe = defineSlotRecipe({
  slots: sliderAnatomy.keys(),
  base: {
    thumb: {
      transitionProperty: "box-shadow, transform",
      transitionDuration: "fast",
      transitionTimingFunction: "standard",
    },
  },
  variants: {
    size: {
      sm: { root: { "--slider-thumb-size": "18px", "--slider-track-size": "4px" } },
      md: { root: { "--slider-thumb-size": "22px", "--slider-track-size": "6px" } },
      lg: { root: { "--slider-thumb-size": "26px", "--slider-track-size": "8px" } },
    },
    variant: {
      outline: sliderLook,
      solid: sliderLook,
    },
  },
})
