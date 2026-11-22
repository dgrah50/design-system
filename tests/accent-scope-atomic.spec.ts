import { expect, test } from "@playwright/test"
import { resetAccentScopeWarning, scopeAccentToPalettes } from "../src/theme/arc-bridge"

test("does not patch earlier palettes when a later block has a read-only alias key", () => {
  resetAccentScopeWarning()
  const realWarn = console.warn
  const warnings: unknown[][] = []
  console.warn = (...args: unknown[]) => void warnings.push(args)
  try {
    const gray: Record<string, unknown> = {}
    const brand: Record<string, unknown> = {}
    Object.defineProperty(brand, "--accent", { value: "x", writable: false, enumerable: true })
    const system = {
      utility: { transform: (_prop: string, name: string) => (name === "gray" ? gray : brand) },
      tokens: { colorPaletteMap: new Map([["gray", {}], ["brand", {}]]), getVar: (path: string) => path },
    }

    expect(scopeAccentToPalettes(system)).toBe(false)
    expect(gray).toEqual({})
    expect(warnings).toHaveLength(1)
  } finally {
    console.warn = realWarn
  }
})
