import { defineSlotRecipe } from "@chakra-ui/react"
import { cardAnatomy } from "@chakra-ui/react/anatomy"

/** Surfaces at rest have a border and no shadow; `elevated` opts into shadow.md. */
export const cardSlotRecipe = defineSlotRecipe({
  slots: cardAnatomy.keys(),
  base: {
    root: { borderRadius: "surface" },
    title: { fontFamily: "body", textStyle: "lg", fontWeight: "medium", letterSpacing: "body" },
    description: { color: "fg.muted", textStyle: "sm" },
    header: { gap: "1" },
  },
  variants: {
    size: {
      sm: { root: { "--card-padding": "spacing.5" }, title: { textStyle: "lg" } },
      md: { root: { "--card-padding": "spacing.6" }, title: { textStyle: "lg" } },
      lg: { root: { "--card-padding": "spacing.8" }, title: { textStyle: "lg" } },
    },
    variant: {
      outline: { root: { bg: "bg.panel", borderWidth: "1px", borderColor: "border", boxShadow: "none" } },
      elevated: { root: { bg: "bg.panel", borderWidth: "1px", borderColor: "border.muted", boxShadow: "md" } },
      subtle: { root: { bg: "bg.subtle", borderWidth: "1px", borderColor: "border.muted", boxShadow: "none" } },
    },
  },
  defaultVariants: { variant: "outline", size: "md" },
})
