import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"
import { scopeAccentToPalettes } from "./arc-bridge"
import { globalCss } from "./global-css"
import { animationStyles, keyframes, textStyles } from "./motion"
import { recipes, slotRecipes } from "./recipes"
import { semanticTokens } from "./semantic-tokens"
import { tokens } from "./tokens"

const config = defineConfig({
  globalCss,
  theme: {
    tokens,
    semanticTokens,
    keyframes,
    animationStyles,
    textStyles,
    recipes,
    slotRecipes,
  },
})

/** Chakra system that looks and feels like Arc (uiarc.dev). */
export const system = createSystem(defaultConfig, config)
scopeAccentToPalettes(system as any)

export { arcBridge } from "./arc-bridge"
export { defaultAccent } from "./global-css"
export { contrastPreset, contrastPresets, radiusPreset, radiusPresets } from "./tokens"
