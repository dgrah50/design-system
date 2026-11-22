import { expect, test, type Locator, type Page } from "@playwright/test"
import { css, modes, openApp } from "./helpers"

/** Press Tab until `target` (the focusable element) is the active element. Real key events, bounded. */
async function tabTo(page: Page, target: Locator) {
  const handle = await target.elementHandle()
  for (let i = 0; i < 150; i++) {
    await page.keyboard.press("Tab")
    if (await page.evaluate((el) => document.activeElement === el, handle)) return
  }
  throw new Error("Tab never reached the target")
}

const outline = async (loc: Locator) => ({
  width: parseFloat(await css(loc, "outline-width")),
  style: await css(loc, "outline-style"),
  color: await css(loc, "outline-color"),
})

for (const mode of modes) {
  test.describe(`focus (${mode})`, () => {
    test.beforeEach(async ({ page }) => openApp(page, mode))

    test("keyboard Tab onto a Button shows an outline of at least 2px", async ({ page }) => {
      const btn = page.getByTestId("btn-solid-md")
      await tabTo(page, btn)
      const o = await outline(btn)
      expect(o.style, JSON.stringify(o)).not.toBe("none")
      expect(o.width, JSON.stringify(o)).toBeGreaterThanOrEqual(2)
    })

    test("keyboard Tab onto a Checkbox shows an outline of at least 2px on the control", async ({ page }) => {
      await tabTo(page, page.getByTestId("checkbox-unchecked-input"))
      const o = await outline(page.getByTestId("checkbox-unchecked-control"))
      expect(o.style, JSON.stringify(o)).not.toBe("none")
      expect(o.width, JSON.stringify(o)).toBeGreaterThanOrEqual(2)
    })

    test("a mouse click on a Button leaves no outline", async ({ page }) => {
      const btn = page.getByTestId("btn-solid-md")
      await btn.click()
      await expect(btn).toBeFocused()
      await page.mouse.move(0, 0)
      const o = await outline(btn)
      expect(o.style === "none" || o.width === 0, JSON.stringify(o)).toBe(true)
    })

    test("a focused text Input changes border colour and has no outline or box-shadow ring", async ({ page }) => {
      const input = page.getByTestId("input-md")
      await input.scrollIntoViewIfNeeded()
      await page.mouse.move(0, 0)
      const before = await css(input, "border-top-color")
      await input.focus()
      await expect(input).toBeFocused()
      const after = await css(input, "border-top-color")
      const o = await outline(input)
      const shadow = await css(input, "box-shadow")
      expect(after, `border ${before} -> ${after}`).not.toBe(before)
      expect(o.style === "none" || o.width === 0, `outline ${JSON.stringify(o)}`).toBe(true)
      expect(shadow, "box-shadow").toBe("none")
    })
  })
}
