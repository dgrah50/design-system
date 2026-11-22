import { arcBridge } from "./arc-bridge"

/**
 * Default colour palette for the whole app. `gray` is Arc's neutral ink accent.
 * Change to "brand" (Arc violet) or any tone palette to re-accent every Chakra and Arc component.
 */
export const defaultAccent = "gray"

export const globalCss = {
  html: {
    colorPalette: defaultAccent,
    // Root stays 16px so rem values hold; UI text is set to 14px on body.
    fontSize: "16px",
    lineHeight: "body",
    color: "fg",
    bg: "bg",
  },
  body: {
    fontFamily: "body",
    fontSize: "sm",
    lineHeight: "body",
    letterSpacing: "body",
    fontWeight: "normal",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
  },
  "code, kbd, samp, pre": { fontFamily: "mono" },
  "*::placeholder, *[data-placeholder]": { color: "fg.subtle" },
  "*::selection": { bg: "colorPalette.emphasized/80" },
  "table, .chakra-badge, .chakra-stat__valueText": { fontVariantNumeric: "tabular-nums" },

  ...arcBridge,

  // Motion: honour prefers-reduced-motion. Floating layers keep a plain fade; nothing scales or slides.
  "@media (prefers-reduced-motion: reduce)": {
    "*, *::before, *::after": {
      scrollBehavior: "auto !important",
      transitionDuration: "{durations.instant} !important",
      transitionDelay: "0ms !important",
    },
    "[data-state=open], [data-state=checked]": { animationDuration: "{durations.instant} !important" },
    "[data-state=open][data-part=content], [data-state=open][data-part=backdrop]": {
      animationName: "fade-in !important",
      translate: "none !important",
      scale: "none !important",
    },
    "[data-state=closed][data-part=content], [data-state=closed][data-part=backdrop]": {
      animationName: "fade-out !important",
      animationDuration: "{durations.instant} !important",
      translate: "none !important",
      scale: "none !important",
    },
    "button:active, [role=button]:active": { transform: "none !important" },
  },
}
