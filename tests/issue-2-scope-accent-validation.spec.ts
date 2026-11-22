import { test, expect } from "./fixtures"
import { resetAccentScopeWarning, scopeAccentToPalettes } from "../src/theme/arc-bridge"

const makeSystem = (transform: (name: string) => unknown) => ({
  utility: { transform: (_prop: string, name: string) => transform(name) },
  tokens: {
    colorPaletteMap: new Map([["first", {}], ["later", {}]]),
    getVar: (path: string) => path,
  },
})

test.describe("issue #2: palette blocks validate before mutation", () => {
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

  test("rejects an array palette without changing earlier blocks", () => {
    const first: Record<string, unknown> = {}
    const result = scopeAccentToPalettes(makeSystem((name) => name === "first" ? first : []))

    expect(result).toBe(false)
    expect(first).toEqual({})
    expect(warnings).toHaveLength(1)
  })

  test("rejects a frozen later palette without changing earlier blocks", () => {
    const first: Record<string, unknown> = {}
    const frozen = Object.freeze({})
    const result = scopeAccentToPalettes(makeSystem((name) => name === "first" ? first : frozen))

    expect(result).toBe(false)
    expect(first).toEqual({})
    expect(warnings).toHaveLength(1)
  })
})
