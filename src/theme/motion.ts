/**
 * Arc motion: floating layers enter with opacity + 5px translate + scale from .97 and never overshoot.
 * Chakra's `scale-in`/`scale-out` keyframes are overridden, and the shared animation styles used by
 * menu, select, combobox, popover and tooltip are rebuilt on top of them.
 */

export const keyframes = {
  "scale-in": { from: { scale: ".97" }, to: { scale: "1" } },
  "scale-out": { from: { scale: "1" }, to: { scale: ".98" } },
}

const enterDistances = {
  "--slide-from-top-distance": "5px",
  "--slide-from-bottom-distance": "5px",
  "--slide-from-left-distance": "5px",
  "--slide-from-right-distance": "5px",
}
const exitDistances = {
  "--slide-to-top-distance": "3px",
  "--slide-to-bottom-distance": "3px",
  "--slide-to-left-distance": "3px",
  "--slide-to-right-distance": "3px",
}

const placed = (names: Record<"top" | "bottom" | "left" | "right", string>) => ({
  "&[data-placement^=top]": { animationName: names.top },
  "&[data-placement^=bottom]": { animationName: names.bottom },
  "&[data-placement^=left]": { animationName: names.left },
  "&[data-placement^=right]": { animationName: names.right },
})

const inNames = {
  top: "slide-from-bottom, scale-in, fade-in",
  bottom: "slide-from-top, scale-in, fade-in",
  left: "slide-from-right, scale-in, fade-in",
  right: "slide-from-left, scale-in, fade-in",
}
const outNames = {
  top: "slide-to-bottom, scale-out, fade-out",
  bottom: "slide-to-top, scale-out, fade-out",
  left: "slide-to-right, scale-out, fade-out",
  right: "slide-to-left, scale-out, fade-out",
}

const slideFadeIn = {
  transformOrigin: "var(--transform-origin)",
  ...enterDistances,
  animationName: "scale-in, fade-in",
  ...placed(inNames),
}
const slideFadeOut = {
  transformOrigin: "var(--transform-origin)",
  ...exitDistances,
  animationName: "scale-out, fade-out",
  ...placed(outNames),
}

export const animationStyles = {
  "slide-fade-in": { value: slideFadeIn },
  "slide-fade-out": { value: slideFadeOut },
  "scale-fade-in": { value: slideFadeIn },
  "scale-fade-out": { value: slideFadeOut },
}

export const textStyles = {
  xs: { value: { fontSize: "xs", lineHeight: "body" } },
  sm: { value: { fontSize: "sm", lineHeight: "body" } },
  md: { value: { fontSize: "md", lineHeight: "body" } },
  lg: { value: { fontSize: "lg", lineHeight: "body" } },
  xl: { value: { fontSize: "xl", lineHeight: "body" } },
  "2xl": { value: { fontSize: "2xl", lineHeight: "body" } },
  "3xl": { value: { fontSize: "3xl", lineHeight: "display", letterSpacing: "display" } },
  "4xl": { value: { fontSize: "4xl", lineHeight: "display", letterSpacing: "display" } },
  "5xl": { value: { fontSize: "5xl", lineHeight: "display", letterSpacing: "display" } },
  // 6xl-9xl: derived display steps (see tokens.ts fontSizes).
  "6xl": { value: { fontSize: "6xl", lineHeight: "display", letterSpacing: "display" } },
  "7xl": { value: { fontSize: "7xl", lineHeight: "display", letterSpacing: "display" } },
  "8xl": { value: { fontSize: "8xl", lineHeight: "display", letterSpacing: "display" } },
  "9xl": { value: { fontSize: "9xl", lineHeight: "display", letterSpacing: "display" } },
}
