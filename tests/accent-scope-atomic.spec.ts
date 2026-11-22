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

test("rejects a setter without calling it or patching any palette", () => {
  const gray: Record<string, unknown> = {}
  const brand: Record<string, unknown> = {}
  let calls = 0
  Object.defineProperty(brand, "--accent", {
    set() { calls++ },
    configurable: true,
  })

  expectRejectedWithoutChanges(gray, brand)
  expect(calls).toBe(0)
  expect(gray).toEqual({})
  expect(Object.getOwnPropertyDescriptor(brand, "--accent")?.set).toBeDefined()
  expect(Object.keys(brand)).toEqual([])
})

test("preserves an earlier writable alias when a later palette is invalid", () => {
  const gray: Record<string, unknown> = { "--accent": "orig" }
  const brand: Record<string, unknown> = {}
  Object.defineProperty(brand, "--accent", { value: "x", writable: false, enumerable: true })

  expectRejectedWithoutChanges(gray, brand)
  expect(gray).toEqual({ "--accent": "orig" })
  expect(brand).toEqual({ "--accent": "x" })
})
