import { test, expect } from "./fixtures"
import { modes, openApp } from "./helpers"
import { resetAccentScopeWarning, scopeAccentToPalettes, arcAccentAliases } from "../src/theme/arc-bridge"

const vars = ["--accent", "--accent-strong", "--accent-subtle", "--accent-foreground", "--control-on", "--series-1"] as const
/** Chakra colour token each Arc alias stands for (see arcAccentAliases). */
const token: Record<string, string> = {
  "--accent": "solid",
  "--accent-strong": "fg",
  "--accent-subtle": "subtle",
  "--accent-foreground": "contrast",
  "--control-on": "solid",
}

for (const mode of modes) {
  test.describe(`accent scoping patch (${mode})`, () => {
    test.beforeEach(async ({ page }) => openApp(page, mode))

    /** For each probe, the colour `var(<name>)` resolves to when read by a child of the probe, plus the expected token colour. */
    const resolve = (page: import("@playwright/test").Page, testid: string, palette: string) =>
      page.evaluate(
        ({ testid, palette, vars, token }) => {
          const host = document.querySelector(`[data-testid=${testid}]`)!
          const read = (parent: Element, value: string) => {
            const probe = document.createElement("span")
            probe.style.color = value
            parent.appendChild(probe)
            const c = getComputedStyle(probe).color
            probe.remove()
            return c
          }
          const out: Record<string, { actual: string; expected: string | null }> = {}
          for (const v of vars) {
            const t = token[v]
            out[v] = { actual: read(host, `var(${v})`), expected: t ? read(document.documentElement, `var(--chakra-colors-${palette}-${t})`) : null }
          }
          return out
        },
        { testid, palette, vars: [...vars], token },
      )

    const cases: Array<[string, string, string]> = [
      ["scope-root", "gray", "root keeps the default (gray)"],
      ["arc-scope-brand", "brand", "colorPalette=brand"],
      ["arc-scope-teal", "teal", "colorPalette=teal"],
      ["scope-nested-outer", "brand", "outer brand scope"],
      ["scope-nested-inner", "teal", "nested teal scope re-resolves"],
      ["scope-nested-leaf", "teal", "plain descendant of the nested scope inherits teal"],
      ["scope-nested-after", "brand", "after the nested scope, brand again"],
    ]
    for (const [testid, palette, label] of cases) {
      test(`${label}: --accent, --accent-strong, --accent-subtle, --accent-foreground and --control-on follow ${palette}`, async ({ page }) => {
        const r = await resolve(page, testid, palette)
        for (const [v, { actual, expected }] of Object.entries(r)) {
          if (expected) expect(actual, `${v} in ${testid}`).toBe(expected)
          else expect(actual, `${v} in ${testid} is defined`).not.toBe("")
        }
      })
    }

    test("--series-1 differs between the brand, teal and root scopes", async ({ page }) => {
      const seen = new Map<string, string>()
      for (const id of ["scope-root", "arc-scope-brand", "arc-scope-teal", "scope-nested-inner"]) {
        const r = await resolve(page, id, "gray")
        seen.set(id, r["--series-1"].actual)
      }
      expect(seen.get("arc-scope-brand")).not.toBe(seen.get("scope-root"))
      expect(seen.get("arc-scope-teal")).not.toBe(seen.get("arc-scope-brand"))
      expect(seen.get("scope-nested-inner"), "nested teal equals the teal scope").toBe(seen.get("arc-scope-teal"))
    })
  })
}

test.describe("scopeAccentToPalettes failure mode (no browser)", () => {
  const fake = (transform: (p: string, n: string) => unknown, names = ["gray", "brand"]) => ({
    utility: { transform },
    tokens: { colorPaletteMap: new Map(names.map((n) => [n, {}])), getVar: (p: string) => `var(--${p.replace(/\./g, "-")})` },
  })
  let warnings: string[]
  const realWarn = console.warn
  test.beforeEach(() => {
    warnings = []
    console.warn = (...a: unknown[]) => void warnings.push(a.join(" "))
    resetAccentScopeWarning()
  })
  test.afterEach(() => {
    console.warn = realWarn
  })

  test("patches every palette block with all aliases and returns true", () => {
    const blocks: Record<string, Record<string, unknown>> = { gray: {}, brand: {} }
    const ok = scopeAccentToPalettes(fake((_p, n) => blocks[n]))
    expect(ok).toBe(true)
    for (const n of ["gray", "brand"]) for (const k of Object.keys(arcAccentAliases)) expect(blocks[n], `${n} has ${k}`).toHaveProperty([k])
    expect(Object.keys(blocks.brand).some((k) => k.startsWith("@supports")), "series block added").toBe(true)
    expect(warnings).toEqual([])
  })

  test("a Chakra that returns no style object falls back: no throw, one warning, nothing patched", () => {
    const blocks: Record<string, Record<string, unknown>> = { gray: {} }
    const ok = scopeAccentToPalettes(fake((_p, n) => (n === "gray" ? blocks.gray : undefined)))
    expect(ok).toBe(false)
    expect(warnings).toHaveLength(1)
    expect(warnings[0]).toMatch(/Accent scoping is disabled.*brand/s)
    expect(blocks.gray, "no palette is left half patched").toEqual({})
  })

  test("a missing palette map falls back the same way, and the warning is logged once per process", () => {
    const broken = { utility: { transform: () => ({}) }, tokens: { colorPaletteMap: undefined as never, getVar: () => "" } }
    expect(scopeAccentToPalettes(broken)).toBe(false)
    expect(scopeAccentToPalettes(broken)).toBe(false)
    expect(scopeAccentToPalettes(fake(() => null))).toBe(false)
    expect(warnings).toHaveLength(1)
  })

  test("the real system was patched at startup: palette blocks carry the aliases", async () => {
    const { system } = await import("../src/theme")
    const block = (system as any).utility.transform("colorPalette", "brand") as Record<string, unknown>
    for (const k of Object.keys(arcAccentAliases)) expect(block, `brand block has ${k}`).toHaveProperty([k])
  })
})
