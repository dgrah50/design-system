import { test, expect } from "./fixtures"
import { borderContrast, fmt, modes, openApp, textContrast } from "./helpers"

// Non-text contrast (WCAG 1.4.11). Text is covered by sweep.spec.ts.
for (const mode of modes) {
  test.describe(`non-text contrast (${mode})`, () => {
    test.beforeEach(async ({ page }) => openApp(page, mode))

    test("text-field, select trigger and unchecked checkbox borders are at least 3:1 on their surface", async ({ page }) => {
      const targets: Array<[string, string]> = [
        ["text field", "input-md"],
        ["select trigger", "select-trigger-md"],
        ["unchecked checkbox", "checkbox-unchecked-control"],
      ]
      for (const [name, id] of targets) {
        const r = await borderContrast(page.getByTestId(id))
        expect(r.visible, `${name} has a visible border`).toBe(true)
        expect(r.ratio, `${name}: ${fmt(r.ratio)}:1, ${r.color} on rgb(${r.surface})`).toBeGreaterThanOrEqual(3)
      }
    })

    test("the unchecked Steps marker ring is at least 3:1", async ({ page }) => {
      for (const size of ["sm", "md", "lg"]) {
        const ring = await borderContrast(page.getByTestId(`steps-${size}`).locator("[data-part=indicator]").nth(2))
        expect(ring.visible, "incomplete marker has a ring").toBe(true)
        expect(ring.ratio, `${size} incomplete ring ${fmt(ring.ratio)}:1`).toBeGreaterThanOrEqual(3)
      }
    })

    test("Rating stars: filled and empty glyphs are at least 3:1 against the surface", async ({ page }) => {
      for (const size of ["sm", "md", "lg"]) {
        const root = page.getByTestId(`rating-${size}`)
        const empty = root.locator("[data-bg]")
        const filled = root.locator("[data-highlighted] [data-fg]").first()
        for (const [name, l] of [["empty", empty.last()], ["filled", filled]] as const) {
          const r = await textContrast(l)
          expect(r.ratio, `${size} ${name} star ${fmt(r.ratio)}:1 ${r.color} on rgb(${r.bg})`).toBeGreaterThanOrEqual(3)
        }
      }
    })
  })
}
