import { expect, test } from "@playwright/test"
import { controlSizes, css, modes, openApp } from "./helpers"

for (const mode of modes) {
  test.describe(`controls (${mode})`, () => {
    test.beforeEach(async ({ page }) => openApp(page, mode))

    // Control heights do not depend on the colour mode.
    if (mode === "light")
    for (const [size, px] of Object.entries(controlSizes)) {
      test(`Button and Input ${size} are ${px}px tall`, async ({ page }) => {
        const button = (await page.getByTestId(`btn-size-${size}`).boundingBox())!
        const input = (await page.getByTestId(`input-size-${size}`).boundingBox())!
        expect(button.height, `button ${size}`).toBeCloseTo(px, 0)
        expect(input.height, `input ${size}`).toBeCloseTo(px, 0)
        expect(button.height).toBeCloseTo(input.height, 0)
      })
    }

    test("Button md radius equals --radius-control (14px by default)", async ({ page }) => {
      const btn = page.getByTestId("btn-solid-md")
      const radius = parseFloat(await css(btn, "border-top-left-radius"))
      const token = await page.evaluate(() => window.__arc.resolveLength("var(--radius-control)"))
      expect(token, "--radius-control resolves").toBeGreaterThan(0)
      expect(radius).toBeCloseTo(token, 1)
      expect(token).toBeCloseTo(14, 1)
    })

    test("Card radius is 24px with no resting shadow", async ({ page }) => {
      const card = page.getByTestId("card-default")
      expect(parseFloat(await css(card, "border-top-left-radius"))).toBeCloseTo(24, 1)
      expect(await css(card, "box-shadow")).toBe("none")
    })
  })
}
