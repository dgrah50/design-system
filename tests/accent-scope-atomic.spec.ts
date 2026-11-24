import { expect, test } from "@playwright/test"
import { resetAccentScopeWarning, scopeAccentToPalettes } from "../src/theme/arc-bridge"

function makeSystem(gray: Record<string, unknown>, brand: Record<string, unknown>) {
  return {
    utility: { transform: (_prop: string, name: string) => (name === "gray" ? gray : brand) },
    tokens: { colorPaletteMap: new Map([["gray", {}], ["brand", {}]]), getVar: (path: string) => path },
  }
}

function expectRejectedWithoutChanges(
  gray: Record<string, unknown>,
  brand: Record<string, unknown>,
  check?: () => void,
) {
  resetAccentScopeWarning()
  const realWarn = console.warn
  const warnings: unknown[][] = []
  console.warn = (...args: unknown[]) => void warnings.push(args)
  try {
    expect(scopeAccentToPalettes(makeSystem(gray, brand))).toBe(false)
    expect(warnings).toHaveLength(1)
    check?.()
  } finally {
    console.warn = realWarn
  }
}

test("rejects a later own read-only alias without patching any palette", () => {
  const gray: Record<string, unknown> = {}
  const brand: Record<string, unknown> = {}
  Object.defineProperty(brand, "--accent", { value: "x", writable: false, enumerable: true })

  expectRejectedWithoutChanges(gray, brand)
  expect(gray).toEqual({})
  expect(brand).toEqual({ "--accent": "x" })
})

test("rejects an inherited read-only alias without patching any palette", () => {
  const gray: Record<string, unknown> = {}
  const proto = Object.defineProperty({}, "--accent", { value: "inherited", writable: false })
  const brand = Object.create(proto) as Record<string, unknown>

  expectRejectedWithoutChanges(gray, brand)
  expect(gray).toEqual({})
  expect(Object.getPrototypeOf(brand)).toBe(proto)
  expect(Object.keys(brand)).toEqual([])
})

test("accepts an own setter and an inherited writable alias", () => {
  const gray: Record<string, unknown> = {}
  const brand: Record<string, unknown> = {}
  let calls = 0
  Object.defineProperty(brand, "--accent", {
    set() { calls++ },
    configurable: true,
  })

  const proto = { "--accent": "fallback" }
  const inherited = Object.create(proto) as Record<string, unknown>
  const system = {
    utility: { transform: (_prop: string, name: string) => (name === "gray" ? inherited : brand) },
    tokens: { colorPaletteMap: new Map([["gray", {}], ["brand", {}]]), getVar: (path: string) => path },
  }

  resetAccentScopeWarning()
  expect(scopeAccentToPalettes(system)).toBe(true)
  expect(calls).toBe(1)
  expect(inherited["--accent"]).toBe("--accent")
  expect(Object.getOwnPropertyDescriptor(inherited, "--accent")?.writable).toBe(true)
  expect(proto["--accent"]).toBe("fallback")
  expect(Object.getOwnPropertyDescriptor(brand, "--accent")?.set).toBeDefined()
})

test("rejects a later getter-only alias without patching earlier palettes", () => {
  const gray: Record<string, unknown> = {}
  const brand: Record<string, unknown> = {}
  Object.defineProperty(brand, "--accent", { get: () => "x", enumerable: true })

  expectRejectedWithoutChanges(gray, brand)
  expect(gray).toEqual({})
  expect(Object.getOwnPropertyDescriptor(brand, "--accent")?.get).toBeDefined()
  expect(Object.keys(brand)).toEqual(["--accent"])
})

test("preserves an earlier writable alias when a later palette is invalid", () => {
  const gray: Record<string, unknown> = { "--accent": "orig" }
  const brand: Record<string, unknown> = {}
  Object.defineProperty(brand, "--accent", { value: "x", writable: false, enumerable: true })

  expectRejectedWithoutChanges(gray, brand)
  expect(gray).toEqual({ "--accent": "orig" })
  expect(brand).toEqual({ "--accent": "x" })
})
