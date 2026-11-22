/** Style fragments shared between several Arc recipes. */

/** 160ms standard ease on colour, background, border, opacity and shadow. */
export const colorTransition = {
  transitionProperty: "color, background-color, border-color, opacity, box-shadow",
  transitionDuration: "fast",
  transitionTimingFunction: "standard",
} as const

/** Control heights as style-prop values: sm 36, md 44, lg 50, xl 56, 2xl 64 (sizes.control.*). xs stays Chakra's 32. */
export const controlHeight = {
  xs: "8",
  sm: "control.sm",
  md: "control.md",
  lg: "control.lg",
  xl: "control.xl",
  "2xl": "control.2xl",
} as const

/** The same heights as values for CSS custom properties (token path form). */
export const controlHeightVar = {
  xs: "sizes.8",
  sm: "sizes.control.sm",
  md: "sizes.control.md",
  lg: "sizes.control.lg",
  xl: "sizes.control.xl",
  "2xl": "sizes.control.2xl",
} as const

/**
 * Surface shared by every text field and trigger: panel background, control border, ink border on hover,
 * error border when invalid, dimmed when disabled. Focus is NOT here: it differs by kind of control.
 */
const fieldSurface = {
  bg: "bg.panel",
  color: "fg",
  borderWidth: "1px",
  borderColor: "border.control",
  borderRadius: "l2",
  boxShadow: "none",
  ...colorTransition,
  _placeholder: { color: "fg.subtle" },
  // Select's trigger shows its placeholder as text, not a ::placeholder; Chakra colours that fg.muted/80, which only
  // reaches 4.35:1 on white, so it is restated with the same token every placeholder uses.
  _placeholderShown: { color: "fg.subtle" },
  _hover: { borderColor: "fg", _invalid: { borderColor: "border.error" } },
  _invalid: { borderColor: "border.error" },
  _disabled: { bg: "bg.subtle", opacity: 0.5, cursor: "not-allowed" },
} as const

/**
 * `subtle` variant fill: sits on bg.muted, where fg.subtle only reaches 4.3:1, so placeholders use fg.muted.
 * The `[data-placeholder]` selector covers Select's value text.
 */
export const subtleFill = {
  bg: "bg.muted",
  borderColor: "transparent",
  _placeholder: { color: "fg.muted" },
  _placeholderShown: { color: "fg.muted" },
  "& [data-placeholder], &[data-placeholder]": { color: "fg.muted" },
} as const

/**
 * Text field (input, textarea, number input, pin input, combobox input). Focus rule: the BORDER turns to ink
 * and nothing else is drawn (no ring, outline or halo), because the caret already marks the field.
 */
export const textField = {
  ...fieldSurface,
  outline: "none",
  focusVisibleRing: "none",
  _focus: { borderColor: "fg", outline: "none", boxShadow: "none", _invalid: { borderColor: "border.error" } },
  _focusVisible: { borderColor: "fg", outline: "none", boxShadow: "none", _invalid: { borderColor: "border.error" } },
} as const

/**
 * Select / native select trigger. Focus rule: these are buttons, so keyboard focus draws Arc's 2px outline
 * (`focusVisibleRing: "outside"`, palette focusRing colour; the global :focus-visible rule enforces it too)
 * and the border also turns to ink. Pointer focus draws no outline. Resting border is `border.trigger`
 * (same as `border.control` in the "aa" preset, the quiet `border` in "arc").
 */
export const triggerField = {
  ...fieldSurface,
  borderColor: "border.trigger",
  focusVisibleRing: "outside",
  _focus: { borderColor: "fg", _invalid: { borderColor: "border.error" } },
  _focusVisible: { borderColor: "fg", _invalid: { borderColor: "border.error" } },
} as const

/** Floating layer surface (menu, popover, select and combobox content). */
export const floatingPanel = {
  bg: "bg.raised",
  color: "fg",
  borderWidth: "1px",
  borderColor: "border",
  borderRadius: "l3",
  boxShadow: "lg",
  outline: "none",
} as const

/** Menu / select / combobox item. */
export const listItem = {
  minH: "36px",
  borderRadius: "l1",
  px: "11px",
  py: "0",
  textStyle: "sm",
  color: "fg",
  transitionProperty: "background-color, color",
  transitionDuration: "instant",
  transitionTimingFunction: "standard",
  _highlighted: { bg: "bg.subtle" },
  _disabled: { opacity: 0.5, pointerEvents: "none" },
} as const

/** Open and close animation for floating layers: opacity + 5px translate + scale from .97, no overshoot. */
export const floatingOpen = {
  animationStyle: "slide-fade-in",
  animationDuration: "fast",
  animationTimingFunction: "enter",
} as const

export const floatingClosed = {
  animationStyle: "slide-fade-out",
  animationDuration: "instant",
  animationTimingFunction: "standard",
} as const
