import { test, expect } from "./fixtures"
import { resetAccentScopeWarning, scopeAccentToPalettes } from "../src/theme/arc-bridge"

const fake = (transform: (name: string) => unknown) => ({
  utility: { transform: (_prop: string, name: string) => transform(name) },
  tokens: {
    colorPaletteMap: new Map([["gray", {}], ["brand", {}]]),
    getVar: (path: string) => path,
  },
})

test.describe("scopeAccentToPalettes validates every palette before mutation", () => {
  let warnings: string[]
  const realWarn = console.warn

  test.beforeEach(() => {
    warnings = []
    console.warn = (...args: unknown[]) => void warnings.push(args.join(" "))
    resetAccentScopeWarning()
  })

  test.afterEach(() => {
    console.warn = realWarn
  })

  test("rejects an array palette without patching earlier blocks", () => {
    const first: Record<string, unknown> = {}
    const ok = scopeAccentToPalettes(fake((name) => name === "gray" ? first : []))

    expect(ok).toBe(false)
    expect(first).toEqual({})
    expect(warnings).toHaveLength(1)
  })

  test("rejects a frozen palette without patching earlier blocks", () => {
    const first: Record<string, unknown> = {}
    const frozen = Object.freeze({})
    const ok = scopeAccentToPalettes(fake((name) => name === "gray" ? first : frozen))

    expect(ok).toBe(false)
    expect(first).toEqual({})
    expect(warnings).toHaveLength(1)
  })
})
