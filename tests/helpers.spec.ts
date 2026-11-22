import { expect, test } from "@playwright/test"
import { openApp } from "./helpers"

// Unit checks for the in-page colour helper itself; if these fail, every contrast result is suspect.
test.describe("contrast helper", () => {
  test.beforeEach(async ({ page }) => openApp(page, "light"))

  const ratioOf = (page: import("@playwright/test").Page, fg: string, bg: string) =>
    page.evaluate(([f, b]) => window.__arc.ratioBetween(f, b), [fg, bg])

  test("black on white is 21", async ({ page }) => {
    expect(await ratioOf(page, "#000", "#fff")).toBeCloseTo(21, 1)
  })
  test("#767676 on white is about 4.54", async ({ page }) => {
    expect(await ratioOf(page, "#767676", "#ffffff")).toBeCloseTo(4.54, 1)
  })
  test("identical colours are 1", async ({ page }) => {
    expect(await ratioOf(page, "rgb(10 20 30)", "rgb(10 20 30)")).toBeCloseTo(1, 2)
  })
  test("oklch is resolved (white and black)", async ({ page }) => {
    expect(await ratioOf(page, "oklch(0 0 0)", "oklch(1 0 0)")).toBeCloseTo(21, 1)
  })
  test("translucent foreground is composited over the background", async ({ page }) => {
    // 50% black over white is mid grey (127.5 per channel; canvas rounds to #7f7f7f or #808080): 3.95 to 4.00:1.
    const r = await ratioOf(page, "rgb(0 0 0 / 50%)", "#fff")
    expect(r).toBeGreaterThan(3.94)
    expect(r).toBeLessThan(4.01)
  })
  test("color-mix and relative oklch are resolved", async ({ page }) => {
    expect(await ratioOf(page, "color-mix(in oklab, #000 100%, #fff)", "#fff")).toBeCloseTo(21, 1)
    expect(await ratioOf(page, "oklch(from white 0 0 0)", "#fff")).toBeCloseTo(21, 1)
  })
  test("an unparsable colour throws instead of silently passing", async ({ page }) => {
    await expect(page.evaluate(() => window.__arc.ratioBetween("not-a-colour", "#fff"))).rejects.toThrow(/could not parse/)
  })
})
