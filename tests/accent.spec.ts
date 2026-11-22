import { expect, test } from "@playwright/test"
import { css, modes, openApp } from "./helpers"

for (const mode of modes) {
  test.describe(`accent scoping (${mode})`, () => {
    test.beforeEach(async ({ page }) => openApp(page, mode))

    test("var(--accent) inside colorPalette=brand is the brand colour and differs from outside", async ({ page }) => {
      const inside = await css(page.getByTestId("accent-button-brand"), "background-color")
      const outside = await css(page.getByTestId("accent-button-gray"), "background-color")
      const brandSolid = await css(page.getByTestId("btn-solid-brand"), "background-color")
      expect(inside, "inside brand scope").toBe(brandSolid)
      expect(inside, "brand vs root palette").not.toBe(outside)
    })

    test("a descendant of a container that sets --accent in plain CSS inherits the override", async ({ page }) => {
      expect(await css(page.getByTestId("accent-override-child"), "color")).toBe("rgb(255, 0, 255)")
    })
  })
}
