import { expect, test } from "@playwright/test"
import { resetAccentScopeWarning, scopeAccentToPalettes } from "../src/theme/arc-bridge"

function makeSystem(blocks: Record<string, unknown>[]) {
  return {
    utility: { transform: (_prop: string, name: string) => blocks[name === "gray" ? 0 : 1] },
    tokens: { colorPaletteMap: new Map([["gray", {}], ["brand", {}]]), getVar: (path: string) => path },
  }
}

test("rolls back earlier palettes when a later key is inherited read-only", () => {
  resetAccentScopeWarning()
  const warnings: unknown[][] = []
  const realWarn = console.warn
  console.warn = (...args: unknown[]) => void warnings.push(args)
  try {
    const gray: Record<string, unknown> = {}
    const proto = Object.defineProperty({}, "--accent", { value: "inherited", writable: false })
    const brand = Object.create(proto) as Record<string, unknown>

    expect(scopeAccentToPalettes(makeSystem([gray, brand]))).toBe(false)
    expect(gray).toEqual({})
    expect(warnings).toHaveLength(1)
  } finally {
    console.warn = realWarn
  }
})

test("rolls back earlier palettes when a later setter throws", () => {
  resetAccentScopeWarning()
  const warnings: unknown[][] = []
  const realWarn = console.warn
  console.warn = (...args: unknown[]) => void warnings.push(args)
  try {
    const gray: Record<string, unknown> = {}
    const brand: Record<string, unknown> = {}
    Object.defineProperty(brand, "--accent", { set() { throw new Error("setter failed") }, configurable: true })

    expect(scopeAccentToPalettes(makeSystem([gray, brand]))).toBe(false)
    expect(gray).toEqual({})
    expect(Object.getOwnPropertyDescriptor(brand, "--accent")?.set).toBeDefined()
    expect(warnings).toHaveLength(1)
  } finally {
    console.warn = realWarn
  }
})
