import { expect, test } from "@playwright/test"
import { modes, openApp } from "./helpers"

for (const mode of modes) {
  test.describe(`variants (${mode})`, () => {
    test.beforeEach(async ({ page }) => openApp(page, mode))

    test("Progress track heights differ across sizes", async ({ page }) => {
      const sizes = ["xs", "sm", "md", "lg", "xl"]
      const heights = await Promise.all(sizes.map(async (s) => (await page.getByTestId(`progress-track-${s}`).boundingBox())!.height))
      expect(new Set(heights).size, `heights ${heights.join(", ")}`).toBeGreaterThan(1)
    })

    test("Alert variants outline, subtle, surface and solid do not all look the same", async ({ page }) => {
      const looks: Record<string, string> = {}
      for (const v of ["outline", "subtle", "surface", "solid"]) {
        looks[v] = await page.getByTestId(`alert-${v}`).evaluate((el) => {
          const cs = getComputedStyle(el)
          return `${cs.backgroundColor} | ${cs.borderTopWidth} ${cs.borderTopStyle} ${cs.borderTopColor}`
        })
      }
      expect(new Set(Object.values(looks)).size, JSON.stringify(looks, null, 1)).toBeGreaterThan(1)
    })
  })
}
