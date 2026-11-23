import { expect, test, type Locator } from "@playwright/test"
import { css, expectInViewport, openApp, settled, verticalGap } from "./helpers"

interface Overlay {
  name: string
  open: (page: import("@playwright/test").Page) => Promise<void>
  trigger: string
  content: string
  adjacent?: boolean
}

const overlays: Overlay[] = [
  { name: "Menu", trigger: "open-menu", content: "menu-content", adjacent: true, open: (p) => p.getByTestId("open-menu").click() },
  { name: "Popover", trigger: "open-popover", content: "popover-content", adjacent: true, open: (p) => p.getByTestId("open-popover").click() },
  { name: "Select", trigger: "select-trigger-md", content: "select-content-md", adjacent: true, open: (p) => p.getByTestId("select-trigger-md").click() },
  { name: "Combobox", trigger: "combobox-input", content: "combobox-content", open: (p) => p.getByTestId("combobox-input").click() },
  { name: "Tooltip", trigger: "open-tooltip", content: "tooltip-content", open: async (p) => {
      // Zag's tooltip opens on pointermove and ignores a single teleporting move, so approach the trigger like a real mouse.
      const trigger = p.getByTestId("open-tooltip")
      await trigger.scrollIntoViewIfNeeded()
      const box = (await trigger.boundingBox())!
      await p.mouse.move(box.x - 20, box.y + box.height / 2)
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 })
    },
  },
  { name: "DatePicker", trigger: "date-md", content: "date-content-md", adjacent: true, open: async (p) => { await p.getByTestId("date-trigger-md").scrollIntoViewIfNeeded(); await p.getByTestId("date-trigger-md").click() } },
  { name: "HoverCard", trigger: "hc-trigger", content: "hovercard", adjacent: true, open: async (p) => { await p.getByTestId("hc-trigger").scrollIntoViewIfNeeded(); await p.getByTestId("hc-trigger").hover() } },
  { name: "ColorPicker", trigger: "cp-trigger", content: "cp-content", adjacent: true, open: async (p) => { await p.getByTestId("cp-trigger").scrollIntoViewIfNeeded(); await p.getByTestId("cp-trigger").click() } },
  { name: "Dialog", trigger: "open-dialog", content: "dialog-content", open: (p) => p.getByTestId("open-dialog").click() },
  { name: "Drawer", trigger: "open-drawer", content: "drawer-content", open: (p) => p.getByTestId("open-drawer").click() },
]

// Placement and dismissal do not depend on the colour mode.
test.describe("overlays", () => {
  test.beforeEach(async ({ page }) => openApp(page, "light"))

  for (const o of overlays) {
    test(`${o.name} opens inside the viewport${o.adjacent ? ", next to its trigger," : ""} and closes on Escape`, async ({ page }) => {
      await o.open(page)
      const content: Locator = page.getByTestId(o.content)
      await expect(content).toBeVisible()
      await settled(content)
      await expectInViewport(page, content)
      if (o.adjacent) {
        const trigger = page.getByTestId(o.trigger)
        await expect.poll(() => verticalGap(trigger, content), { message: "vertical gap to trigger (px)" }).toBeLessThanOrEqual(16)
      }
      await page.keyboard.press("Escape")
      await expect(content).toBeHidden()
    })
  }

  test("every Toast type appears inside the viewport and can be dismissed", async ({ page }) => {
    for (const type of ["success", "error", "warning", "info", "loading"]) {
      await page.getByTestId(`toast-open-${type}`).click()
      const toast = page.getByTestId(`toast-${type}`)
      await expect(toast).toBeVisible()
      // Not helpers.settled: a loading toast holds an infinite spinner animation that never finishes.
      await toast.evaluate((el) => Promise.all(el.getAnimations().filter((a) => a.effect?.getTiming().iterations !== Infinity).map((a) => a.finished.catch(() => undefined))))
      await expectInViewport(page, toast)
      await toast.getByTestId("toast-close").click()
      await expect(toast).toHaveCount(0)
    }
  })

  test("reduced motion: opening the Dialog leaves no running animation longer than 150ms", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await openApp(page, "light")
    await page.getByTestId("open-dialog").click()
    await page.getByTestId("dialog-content").waitFor({ state: "attached" })
    // Checked straight after the content exists, while an enter animation would still be running. Scoped to the dialog
    // layer (backdrop, positioner, content); the page's Skeletons animate by design and are not part of the dialog.
    const long = await page.evaluate(() => {
      const layer = (el: Element) => el.closest('[data-scope="dialog"]') !== null
      return document
        .getAnimations()
        .filter((a) => a.playState === "running")
        .map((a) => ({ target: (a.effect as KeyframeEffect | null)?.target as Element | null, timing: a.effect?.getComputedTiming() }))
        .filter((x) => x.target && layer(x.target) && Number(x.timing?.duration) > 150)
        .map((x) => `${x.target!.getAttribute("data-part")}: ${x.timing!.duration}ms`)
    })
    expect(long, "long running dialog animations").toEqual([])
  })

  test("CheckboxCard and RadioCard show their checked state", async ({ page }) => {
    const sig = async (id: string) => `${await css(page.getByTestId(id), "border-top-color")} | ${await css(page.getByTestId(id), "background-color")}`
    expect(await sig("cc-checked")).not.toBe(await sig("cc-unchecked"))
    for (const variant of ["outline", "surface", "subtle", "solid"])
      expect(await sig(`rc-${variant}-a`), `RadioCard ${variant}`).not.toBe(await sig(`rc-${variant}-b`))
  })
})
