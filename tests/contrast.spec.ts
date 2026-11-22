import { expect, test } from "@playwright/test"
import { borderContrast, fmt, modes, openApp, palettes, textContrast } from "./helpers"

for (const mode of modes) {
  test.describe(`contrast (${mode})`, () => {
    test.beforeEach(async ({ page }) => openApp(page, mode))

    for (const p of palettes) {
      test(`solid Button text, ${p}, is at least 4.5:1`, async ({ page }) => {
        const r = await textContrast(page.getByTestId(`btn-solid-${p}`))
        expect(r.ratio, `${fmt(r.ratio)}:1 text ${r.color} on ${r.bg}`).toBeGreaterThanOrEqual(4.5)
      })
      test(`subtle Badge text, ${p}, is at least 4.5:1`, async ({ page }) => {
        const r = await textContrast(page.getByTestId(`badge-subtle-${p}`))
        expect(r.ratio, `${fmt(r.ratio)}:1 text ${r.color} on ${r.bg}`).toBeGreaterThanOrEqual(4.5)
      })
    }

    for (const surface of ["page", "card"]) {
      for (const tone of ["fg", "fg-muted", "fg-subtle"]) {
        test(`${tone} text on the ${surface} is at least 4.5:1`, async ({ page }) => {
          const r = await textContrast(page.getByTestId(`${surface}-${tone}`))
          expect(r.ratio, `${fmt(r.ratio)}:1 text ${r.color} on ${r.bg}`).toBeGreaterThanOrEqual(4.5)
        })
      }
    }

    test("text-field resting border is at least 3:1 against its surface", async ({ page }) => {
      const r = await borderContrast(page.getByTestId("input-md"))
      expect(r.visible, `border ${r.width}px ${r.style} ${r.color}`).toBe(true)
      expect(r.ratio, `${fmt(r.ratio)}:1 border ${r.color} on ${r.surface}`).toBeGreaterThanOrEqual(3)
    })

    test("unchecked Checkbox border is at least 3:1 against its surface", async ({ page }) => {
      const r = await borderContrast(page.getByTestId("checkbox-unchecked-control"))
      expect(r.visible, `border ${r.width}px ${r.style} ${r.color}`).toBe(true)
      expect(r.ratio, `${fmt(r.ratio)}:1 border ${r.color} on ${r.surface}`).toBeGreaterThanOrEqual(3)
    })
  })
}
