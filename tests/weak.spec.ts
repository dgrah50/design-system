import { test, expect } from "./fixtures"
import { borderContrast, css, fmt, modes, openApp, type Mode } from "./helpers"
import { contrastPreset } from "../src/theme/tokens"

const alertVariants = ["outline", "subtle", "surface", "solid"] as const

for (const mode of modes) {
  test.describe(`previously weak spots (${mode})`, () => {
    test.beforeEach(async ({ page }) => openApp(page, mode))

    test("Alert variants are pairwise distinct (fill, border, shadow or text colour)", async ({ page }) => {
      const sig: Record<string, string> = {}
      for (const v of alertVariants) {
        const el = page.getByTestId(`alert-${v}`)
        const parts = await Promise.all(["background-color", "border-top-color", "border-top-width", "box-shadow", "color"].map((p) => css(el, p)))
        sig[v] = parts.join(" | ")
      }
      for (let i = 0; i < alertVariants.length; i++)
        for (let j = i + 1; j < alertVariants.length; j++)
          expect(sig[alertVariants[i]], `${alertVariants[i]} vs ${alertVariants[j]}`).not.toBe(sig[alertVariants[j]])
    })

    test("Progress track heights are exactly 4 / 6 / 8 / 10 / 12px for xs / sm / md / lg / xl", async ({ page }) => {
      const expected = { xs: 4, sm: 6, md: 8, lg: 10, xl: 12 }
      for (const [size, px] of Object.entries(expected)) {
        const box = await page.getByTestId(`progress-track-${size}`).boundingBox()
        expect(box!.height, `progress ${size}`).toBe(px)
      }
    })
  })
}

test.describe("contrastPreset aa: control borders in dark mode", () => {
  test("the test suite runs against the aa preset", () => {
    expect(contrastPreset, "tests below assert the aa guarantees; switch tokens.ts back to aa").toBe("aa")
  })

  for (const mode of ["dark", "light"] as Mode[]) {
    test(`${mode}: text-field, select trigger and unchecked checkbox borders are at least 3:1 on their surface`, async ({ page }) => {
      await openApp(page, mode)
      const targets: Array<[string, string]> = [
        ["text field", "input-md"],
        ["select trigger", "select-trigger-md"],
        ["unchecked checkbox", "checkbox-unchecked-control"],
      ]
      for (const [name, id] of targets) {
        const r = await borderContrast(page.getByTestId(id))
        expect(r.visible, `${name} has a visible border`).toBe(true)
        expect(r.ratio, `${name}: ${fmt(r.ratio)}:1, ${r.color} on rgb(${r.surface})`).toBeGreaterThanOrEqual(3)
      }
    })
  }

  test("dark: border.control is not the 1.92:1 border.emphasized value (Arc's --border-strong) that preset arc would give", async ({ page }) => {
    await openApp(page, "dark")
    const { control, emphasized, panel } = await page.evaluate(() => {
      const probe = (n: string) => {
        const d = document.createElement("div")
        d.style.color = `var(--chakra-colors-${n})`
        document.body.appendChild(d)
        const c = getComputedStyle(d).color
        d.remove()
        return c
      }
      return { control: probe("border-control"), emphasized: probe("border-emphasized"), panel: probe("bg-panel") }
    })
    const ratio = (c: string) => page.evaluate(([a, b]) => window.__arc.ratioBetween(a, b), [c, panel])
    expect(control, "token resolved").not.toBe(emphasized)
    expect(await ratio(emphasized), "border.emphasized on bg.panel is the known 1.92:1").toBeCloseTo(1.92, 1)
    expect(await ratio(control)).toBeGreaterThanOrEqual(3)
  })
})
