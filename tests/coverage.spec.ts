import type { Locator, Page } from "@playwright/test"
import { test, expect } from "./fixtures"
import { borderContrast, css, expectInViewport, fmt, modes, openApp, settled, textContrast, verticalGap } from "./helpers"

const sizes = { sm: 36, md: 44, lg: 50 } as const

/** Press Tab until `target` is the active element (real key events, so :focus-visible applies). */
async function tabTo(page: Page, target: Locator) {
  const handle = await target.elementHandle()
  for (let i = 0; i < 300; i++) {
    await page.keyboard.press("Tab")
    if (await page.evaluate((el) => document.activeElement === el, handle)) return
  }
  throw new Error("Tab never reached the target")
}

const height = async (loc: Locator) => Math.round((await loc.boundingBox())!.height)
const width = async (loc: Locator) => Math.round((await loc.boundingBox())!.width)
const text45 = async (loc: Locator, what: string) => {
  const r = await textContrast(loc)
  expect(r.ratio, `${what}: ${fmt(r.ratio)}:1, ${r.color} on rgb(${r.bg})`).toBeGreaterThanOrEqual(4.5)
}

for (const mode of modes) {
  test.describe(`coverage (${mode})`, () => {
    test.beforeEach(async ({ page }) => openApp(page, mode))

    /* Toast ------------------------------------------------------------------------------------------- */
    for (const type of ["success", "error", "warning", "info", "loading"]) {
      test(`Toast ${type}: in the viewport, 20px radius, 1px border, floating shadow, readable, dismissible`, async ({ page }) => {
        await page.getByTestId(`toast-open-${type}`).click()
        const toast = page.getByTestId(`toast-${type}`)
        await expect(toast).toBeVisible()
        // Not helpers.settled: a loading toast holds an infinite spinner animation that never finishes.
        await toast.evaluate((el) => Promise.all(el.getAnimations().filter((a) => a.effect?.getTiming().iterations !== Infinity).map((a) => a.finished.catch(() => undefined))))
        await expectInViewport(page, toast)
        expect(await css(toast, "border-top-left-radius")).toBe("20px")
        expect(await css(toast, "border-top-width")).toBe("1px")
        const floating = await page.evaluate(() => {
          const probe = document.createElement("div")
          probe.style.boxShadow = "var(--shadow-floating)"
          document.body.appendChild(probe)
          const v = getComputedStyle(probe).boxShadow
          probe.remove()
          return v
        })
        expect(floating, "--shadow-floating resolves").not.toBe("none")
        expect(await css(toast, "box-shadow"), "toast carries shadow.lg (--shadow-floating)").toBe(floating)
        await text45(toast.locator("[data-part=title]"), "title on toast background")
        await text45(toast.locator("[data-part=description]"), "description on toast background")
        await toast.getByTestId("toast-close").click()
        await expect(toast).toHaveCount(0)
      })
    }

    /* Cards ------------------------------------------------------------------------------------------- */
    test("CheckboxCard: checked and unchecked borders differ; label and description pass 4.5:1; Tab shows a focus ring", async ({ page }) => {
      const on = page.getByTestId("cc-checked")
      const off = page.getByTestId("cc-unchecked")
      expect(await css(on, "border-top-color")).not.toBe(await css(off, "border-top-color"))
      for (const [name, card] of [["checked", on], ["unchecked", off]] as const) {
        await text45(card.locator("[data-part=label]"), `${name} label`)
        await text45(card.locator("[data-part=description]"), `${name} description`)
      }
      await tabTo(page, page.getByTestId("cc-unchecked-input"))
      const style = await css(off, "outline-style")
      const w = parseFloat(await css(off, "outline-width"))
      expect(style, "outline style on the card").not.toBe("none")
      expect(w, "outline width").toBeGreaterThanOrEqual(2)
    })

    for (const variant of ["outline", "surface", "subtle", "solid"]) {
      test(`RadioCard ${variant}: checked and unchecked differ; text passes 4.5:1`, async ({ page }) => {
        const a = page.getByTestId(`rc-${variant}-a`) // defaultValue "a" is checked
        const b = page.getByTestId(`rc-${variant}-b`)
        const sig = async (l: Locator) => `${await css(l, "border-top-color")} | ${await css(l, "background-color")}`
        expect(await sig(a), "checked vs unchecked border+fill").not.toBe(await sig(b))
        for (const [name, v] of [["checked", "a"], ["unchecked", "b"]] as const) {
          await text45(page.getByTestId(`rc-${variant}-${v}-label`), `${name} label`)
          await text45(page.getByTestId(`rc-${variant}-${v}-desc`), `${name} description`)
        }
      })
    }

    test("RadioCard: keyboard Tab shows a visible focus indicator on the card", async ({ page }) => {
      await tabTo(page, page.getByTestId("rc-outline-a-input"))
      const item = page.getByTestId("rc-outline-a")
      expect(await css(item, "outline-style")).not.toBe("none")
      expect(parseFloat(await css(item, "outline-width"))).toBeGreaterThanOrEqual(2)
    })

    /* Control heights ----------------------------------------------------------------------------------- */
    for (const [size, px] of Object.entries(sizes)) {
      test(`${size}: Pagination, Toggle, IconButton, CloseButton, Clipboard, TagsInput and DatePicker input are ${px}px tall`, async ({ page }) => {
        const pages = page.getByTestId(`pagination-${size}`).locator("button")
        const n = await pages.count()
        expect(n, "pagination buttons").toBeGreaterThan(4)
        for (let i = 0; i < n; i++) {
          const b = pages.nth(i)
          expect(await height(b), `pagination item ${i} height`).toBe(px)
          expect(await width(b), `pagination item ${i} width`).toBe(px)
        }
        expect(await height(page.getByTestId(`toggle-${size}`)), "Toggle").toBe(px)
        expect(await height(page.getByTestId(`clip-${size}`)), "Clipboard trigger").toBe(px)
        expect(await height(page.getByTestId(`tags-${size}`)), "TagsInput control").toBe(px)
        expect(await height(page.getByTestId(`date-${size}`)), "DatePicker input").toBe(px)
        expect(await height(page.getByTestId(`editable-${size}`).locator("[data-part=preview]")), "Editable preview").toBe(px)
        for (const id of ["iconbtn", "close"]) {
          const l = page.getByTestId(`${id}-${size}`)
          expect(await height(l), `${id} height`).toBe(px)
          expect(await width(l), `${id} is square`).toBe(px)
        }
        const input = await height(page.getByTestId(`addon-input-${size}`))
        const group = page.getByTestId(`addon-input-${size}`).locator("xpath=..").locator("> *")
        for (let i = 0; i < (await group.count()); i++) expect(await height(group.nth(i)), `addon group child ${i}`).toBe(input)
      })
    }

    /* Links and small text ----------------------------------------------------------------------------- */
    test("Breadcrumb current and non-current colours differ and both pass 4.5:1", async ({ page }) => {
      const link = page.getByTestId("breadcrumb-link")
      const cur = page.getByTestId("breadcrumb-current")
      expect(await css(link, "color")).not.toBe(await css(cur, "color"))
      await text45(link, "breadcrumb link")
      await text45(cur, "breadcrumb current page")
    })

    for (const id of ["link-plain", "link-underline", "kbd", "code", "stat-down"]) {
      test(`${id} text passes 4.5:1`, async ({ page }) => text45(page.getByTestId(id), id))
    }

    test("Stat trend badge text passes 4.5:1", async ({ page }) => text45(page.getByTestId("stat-up"), "stat-up"))

    /* Popups ---------------------------------------------------------------------------------------------- */
    test("DatePicker opens next to its input inside the viewport and Escape closes it", async ({ page }) => {
      await page.getByTestId("date-trigger-md").scrollIntoViewIfNeeded()
      await page.getByTestId("date-trigger-md").click()
      const content = page.getByTestId("date-content-md")
      await expect(content).toBeVisible()
      await settled(content)
      await expectInViewport(page, content)
      expect(await verticalGap(page.getByTestId("date-md"), content), "gap to the input").toBeLessThan(24)
      await page.keyboard.press("Escape")
      await expect(content).toBeHidden()
    })

    test("HoverCard opens next to its trigger inside the viewport and Escape closes it", async ({ page }) => {
      const trigger = page.getByTestId("hc-trigger")
      await trigger.scrollIntoViewIfNeeded()
      await trigger.hover()
      const content = page.getByTestId("hovercard")
      await expect(content).toBeVisible()
      await settled(content)
      await expectInViewport(page, content)
      expect(await verticalGap(trigger, content), "gap to the trigger").toBeLessThan(24)
      await page.keyboard.press("Escape")
      await expect(content).toBeHidden()
    })

    test("ColorPicker opens next to its trigger inside the viewport and Escape closes it", async ({ page }) => {
      const trigger = page.getByTestId("cp-trigger")
      await trigger.scrollIntoViewIfNeeded()
      await trigger.click()
      const content = page.getByTestId("cp-content")
      await expect(content).toBeVisible()
      await settled(content)
      await expectInViewport(page, content)
      expect(await verticalGap(trigger, content), "gap to the trigger").toBeLessThan(24)
      await page.keyboard.press("Escape")
      await expect(content).toBeHidden()
    })

    /* Markers and glyphs ------------------------------------------------------------------------------------- */
    test("Steps markers: glyphs pass 4.5:1 and the unchecked marker ring is at least 3:1", async ({ page }) => {
      for (const size of ["sm", "md", "lg"]) {
        const markers = page.getByTestId(`steps-${size}`).locator("[data-part=indicator]")
        expect(await markers.count()).toBe(3)
        for (let i = 0; i < 3; i++) await text45(markers.nth(i), `steps ${size} marker ${i}`)
        const ring = await borderContrast(markers.nth(2)) // incomplete
        expect(ring.visible, "incomplete marker has a ring").toBe(true)
        expect(ring.ratio, `incomplete ring ${fmt(ring.ratio)}:1`).toBeGreaterThanOrEqual(3)
      }
    })

    test("Timeline markers: glyphs pass 4.5:1", async ({ page }) => {
      for (const id of ["timeline", "timeline-solid"]) {
        const markers = page.getByTestId(id).locator(".chakra-timeline__indicator")
        const n = await markers.count()
        expect(n, `${id} markers`).toBeGreaterThan(1)
        for (let i = 0; i < n; i++) await text45(markers.nth(i), `${id} marker ${i}`)
      }
    })

    test("Rating stars: filled and empty glyphs are at least 3:1 against the surface", async ({ page }) => {
      for (const size of ["sm", "md", "lg"]) {
        const root = page.getByTestId(`rating-${size}`)
        const empty = root.locator("[data-bg]")
        const filled = root.locator("[data-highlighted] [data-fg]").first()
        expect(await empty.count(), "empty star layers").toBe(5)
        for (const [name, l] of [["empty", empty.last()], ["filled", filled]] as const) {
          const r = await textContrast(l)
          expect(r.ratio, `${size} ${name} star ${fmt(r.ratio)}:1 ${r.color} on rgb(${r.bg})`).toBeGreaterThanOrEqual(3)
        }
      }
    })
  })
}
