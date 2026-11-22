import { expect, test, type Locator } from "@playwright/test"
import { expectInViewport, modes, openApp, settled, verticalGap } from "./helpers"

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
  { name: "Dialog", trigger: "open-dialog", content: "dialog-content", open: (p) => p.getByTestId("open-dialog").click() },
  { name: "Drawer", trigger: "open-drawer", content: "drawer-content", open: (p) => p.getByTestId("open-drawer").click() },
]

for (const mode of modes) {
  test.describe(`overlays (${mode})`, () => {
    test.beforeEach(async ({ page }) => openApp(page, mode))

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

    if (mode === "light") test("Menu items are 36px tall", async ({ page }) => {
      await page.getByTestId("open-menu").click()
      const items = page.getByTestId("menu-content").getByRole("menuitem")
      await expect(items).toHaveCount(3)
      for (const item of await items.all()) {
        expect((await item.boundingBox())!.height).toBeCloseTo(36, 0)
      }
    })
  })
}
