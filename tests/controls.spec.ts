import { expect, test, type Locator } from "@playwright/test"
import { controlSizes, openApp } from "./helpers"

const height = async (loc: Locator) => Math.round((await loc.boundingBox())!.height)
const width = async (loc: Locator) => Math.round((await loc.boundingBox())!.width)

// Control heights do not depend on the colour mode. Controls that sit side by side in a form must line up.
test.describe("controls share one height per size", () => {
  test.beforeEach(async ({ page }) => openApp(page, "light"))

  for (const [size, px] of Object.entries(controlSizes)) {
    test(`${size} is ${px}px tall`, async ({ page }) => {
      const t = (id: string) => page.getByTestId(`${id}-${size}`)
      expect(await height(page.getByTestId(`btn-size-${size}`)), "Button").toBe(px)
      expect(await height(page.getByTestId(`input-size-${size}`)), "Input").toBe(px)
      if (size === "xl") return
      const pages = page.getByTestId(`pagination-${size}`).locator("button")
      for (let i = 0; i < (await pages.count()); i++) {
        expect(await height(pages.nth(i)), `pagination item ${i}`).toBe(px)
        expect(await width(pages.nth(i)), `pagination item ${i} width`).toBe(px)
      }
      for (const id of ["toggle", "clip", "tags", "date"]) expect(await height(t(id)), id).toBe(px)
      expect(await height(t("editable").locator("[data-part=preview]")), "Editable preview").toBe(px)
      for (const id of ["iconbtn", "close"]) {
        expect(await height(t(id)), `${id} height`).toBe(px)
        expect(await width(t(id)), `${id} is square`).toBe(px)
      }
      const input = await height(t("addon-input"))
      const group = t("addon-input").locator("xpath=..").locator("> *")
      for (let i = 0; i < (await group.count()); i++) expect(await height(group.nth(i)), `addon group child ${i}`).toBe(input)
    })
  }
})
