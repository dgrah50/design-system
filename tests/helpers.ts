import { expect, type Locator, type Page } from "@playwright/test"
import path from "node:path"

export type Mode = "light" | "dark"
export const modes: Mode[] = ["light", "dark"]

export const palettes = ["gray", "brand", "teal", "blue", "cyan", "purple", "pink", "red", "orange", "yellow", "green"] as const
export const headingSizes = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl"] as const
export const controlSizes = { sm: 36, md: 44, lg: 50, xl: 56 } as const

export type Rgb = [number, number, number]
export interface TextContrast {
  ratio: number
  color: string
  fg: Rgb
  bg: Rgb
}
export interface BorderContrast {
  ratio: number
  color: string
  width: number
  style: string
  surface: Rgb
  visible: boolean
}

declare global {
  interface Window {
    __arc: {
      paint(color: string, backdrop: Rgb): Rgb
      ratio(a: Rgb, b: Rgb): number
      effectiveBg(el: Element, excludeSelf: boolean): Rgb
      ratioBetween(fg: string, bg: string): number
      textContrast(el: Element): TextContrast
      borderContrast(el: Element): BorderContrast
      resolveLength(expr: string): number
    }
  }
}

/** Load the kitchen sink in `mode` (seeded through next-themes' localStorage key) with the colour helpers installed. */
export async function openApp(page: Page, mode: Mode = "light") {
  await page.addInitScript({ path: path.join(import.meta.dirname, "in-page", "arc-helpers.js") })
  await page.addInitScript((m) => {
    try {
      localStorage.setItem("theme", m)
    } catch {}
  }, mode)
  await page.goto("/")
  await expect(page.locator("html")).toHaveAttribute("data-theme", mode)
  await page.locator("[data-testid=sec-scale]").waitFor()
  await page.evaluate(() => document.fonts.ready)
}

export const textContrast = (loc: Locator) => loc.evaluate((el) => window.__arc.textContrast(el))
export const borderContrast = (loc: Locator) => loc.evaluate((el) => window.__arc.borderContrast(el))
export const css = (loc: Locator, prop: string) => loc.evaluate((el, p) => getComputedStyle(el).getPropertyValue(p), prop)

export const fmt = (n: number) => n.toFixed(2)

/** Wait until every animation under `loc` (and the element itself) has finished. */
export async function settled(loc: Locator) {
  await loc.evaluate((el) => Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished.catch(() => undefined))))
}

export async function expectInViewport(page: Page, loc: Locator) {
  await expect
    .poll(
      async () => {
        const box = await loc.boundingBox()
        const vp = page.viewportSize()!
        if (!box) return "no box"
        const ok = box.x >= -0.5 && box.y >= -0.5 && box.x + box.width <= vp.width + 0.5 && box.y + box.height <= vp.height + 0.5
        return ok ? "inside" : `outside: ${JSON.stringify(box)} in ${vp.width}x${vp.height}`
      },
      { message: "content bounding box lies inside the viewport" },
    )
    .toBe("inside")
}

/** Smallest vertical distance between the edges facing each other (content below or above the trigger). */
export async function verticalGap(trigger: Locator, content: Locator) {
  const t = (await trigger.boundingBox())!
  const c = (await content.boundingBox())!
  return Math.min(Math.abs(c.y - (t.y + t.height)), Math.abs(t.y - (c.y + c.height)))
}
