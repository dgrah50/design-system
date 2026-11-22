import { expect, test } from "@playwright/test"
import { modes, openApp, type Mode } from "./helpers"

const read = (page: import("@playwright/test").Page) =>
  page.evaluate(() => {
    const root = document.documentElement
    const cs = getComputedStyle(root)
    const bodyBg = window.__arc.effectiveBg(document.body, false)
    return {
      foreground: cs.getPropertyValue("--foreground").trim(),
      background: cs.getPropertyValue("--background").trim(),
      radiusControl: cs.getPropertyValue("--radius-control").trim(),
      theme: root.getAttribute("data-theme"),
      dark: root.classList.contains("dark"),
      bodyBg,
      bodyLum: window.__arc.ratio(bodyBg, [0, 0, 0]),
    }
  })

test.describe("tokens", () => {
  test("--foreground, --background and the page background flip between modes", async ({ browser }) => {
    const results = {} as Record<Mode, Awaited<ReturnType<typeof read>>>
    for (const mode of modes) {
      const page = await (await browser.newContext()).newPage()
      await openApp(page, mode)
      results[mode] = await read(page)
      await page.context().close()
    }
    expect(results.light.foreground).not.toBe(results.dark.foreground)
    expect(results.light.background).not.toBe(results.dark.background)
    // Light page is brighter than dark page (contrast against black is a luminance proxy).
    expect(results.light.bodyLum).toBeGreaterThan(results.dark.bodyLum)
  })
})
