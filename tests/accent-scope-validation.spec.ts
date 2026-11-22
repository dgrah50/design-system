import { expect, test } from "@playwright/test"
import { resetAccentScopeWarning, scopeAccentToPalettes } from "../src/theme/arc-bridge"

const fake = (transform: (name: string) => unknown) => ({
  utility: { transform: (_prop: string, name: string) => transform(name) },
  tokens: {
    colorPaletteMap: new Map([["gray", {}], ["brand", {}]]),
    getVar: (path: string) => path,
  },
})

test.describe("scopeAccentToPalettes validates all palette blocks before mutation", () => {
  const realWarn = console.warn
  let warnings: string[]

  test.beforeEach(() => {
    warnings = []
    console.warn = (...args: unknown[]) => void warnings.push(args.join(" "))
    resetAccentScopeWarning()
  })

  test.afterEach(() => {
    console.warn = realWarn
  })

  test("rejects an array without patching earlier palette blocks", () => {
    const gray = {}
    expect(scopeAccentToPalettes(fake((name) => name === "gray" ? gray : []))).toBe(false)
    expect(gray).toEqual({})
    expect(warnings).toHaveLength(1)
  })

  test("rejects a frozen later block without patching earlier palette blocks", () => {
    const gray = {}
    const brand = Object.freeze({})
    expect(scopeAccentToPalettes(fake((name) => name === "gray" ? gray : brand))).toBe(false)
    expect(gray).toEqual({})
    expect(warnings).toHaveLength(1)
  })
})
