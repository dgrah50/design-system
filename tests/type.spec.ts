import { expect, test } from "@playwright/test"
import { headingSizes, modes, openApp } from "./helpers"

for (const mode of modes) {
  test.describe(`type (${mode})`, () => {
    test.beforeEach(async ({ page }) => openApp(page, mode))

    test("Heading font sizes strictly increase from xs to 7xl", async ({ page }) => {
      const sizes = await Promise.all(
        headingSizes.map((s) => page.getByTestId(`heading-${s}`).evaluate((el) => parseFloat(getComputedStyle(el).fontSize))),
      )
      for (let i = 1; i < sizes.length; i++) {
        expect(sizes[i], `${headingSizes[i]} (${sizes[i]}px) > ${headingSizes[i - 1]} (${sizes[i - 1]}px)`).toBeGreaterThan(sizes[i - 1])
      }
    })

    for (const size of headingSizes) {
      const display = ["3xl", "4xl", "5xl", "6xl", "7xl"].includes(size)
      test(`Heading ${size} uses ${display ? "Geist with -0.03em tracking" : "Inter"}`, async ({ page }) => {
        const m = await page.getByTestId(`heading-${size}`).evaluate((el) => {
          const cs = getComputedStyle(el)
          return { family: cs.fontFamily, fontSize: parseFloat(cs.fontSize), tracking: cs.letterSpacing }
        })
        const first = m.family.split(",")[0].replace(/["']/g, "").trim()
        if (display) {
          expect(first, "first family").toMatch(/^Geist(?! Mono)/)
          expect(parseFloat(m.tracking), `letter-spacing ${m.tracking}`).toBeCloseTo(-0.03 * m.fontSize, 1)
        } else {
          expect(first, "first family").toMatch(/^Inter/)
        }
      })
    }
  })
}
