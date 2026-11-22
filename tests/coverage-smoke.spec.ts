import { test, expect } from "./fixtures"
import { modes, openApp } from "./helpers"

const sections = [
  "sec-toast", "sec-cards-select", "sec-navigation", "sec-timeline", "sec-inputs-a", "sec-inputs-b",
  "sec-dates", "sec-layers", "sec-toggles", "sec-text-primitives", "sec-blocks", "sec-extras",
]

for (const mode of modes) {
  test(`${mode}: the whole kitchen sink renders with no console errors or React warnings`, async ({ page }) => {
    await openApp(page, mode)
    for (const id of sections) {
      const box = await page.getByTestId(id).boundingBox()
      expect(box?.height ?? 0, `${id} has height`).toBeGreaterThan(40)
    }
    // Scroll through the page so lazily laid-out parts mount, then give async warnings a moment to surface.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 30))
      }
    })
    await page.waitForTimeout(300)
  })
}
