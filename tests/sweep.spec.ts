import type { Page } from "@playwright/test"
import { test, expect } from "./fixtures"
import { modes, openApp } from "./helpers"

interface Offender {
  where: string
  text: string
  ratio: number
  needs: number
  fg: string
  bg: string
  size: number
}

/**
 * Walks every element on the kitchen sink that owns visible text and measures text against the real background behind it.
 * Threshold 4.5:1, or 3:1 for large text (>= 24px, or >= 18.66px and bold, WCAG 1.4.3).
 * Exclusions (each is a WCAG exemption or not text a user reads):
 *  - disabled controls and their labels (WCAG 1.4.3 exempts inactive components);
 *  - `accent-override-child`: a probe that sets an arbitrary magenta `--accent` on purpose to prove inheritance (accent.spec.ts);
 *    its colour is the test's input, not a theme value;
 *  - elements that are not rendered visibly: display none, visibility hidden, opacity 0, clipped to a pixel (screen-reader-only);
 *  - text whose own colour is fully transparent (skeletons hide their content with `color: transparent`).
 * Limits: gradients and images are ignored by the background resolver; ancestor `opacity` is applied to the text colour.
 */
async function sweep(page: Page) {
  return page.evaluate(() => {
    const arc = window.__arc
    const out: Offender[] = []
    let checked = 0
    const opacityOf = (el: Element) => {
      let o = 1
      for (let n: Element | null = el; n; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity)
      return o
    }
    const label = (el: Element) => {
      const id = el.closest("[data-testid]")?.getAttribute("data-testid")
      const sec = el.closest("[id^=sec-]")?.id
      const tag = el.tagName.toLowerCase() + (el.getAttribute("data-part") ? `[${el.getAttribute("data-part")}]` : "")
      return `${id ?? "(no testid)"} in ${sec ?? "page"} <${tag}>`
    }
    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(el.tagName)) continue
      const own = Array.from(el.childNodes)
        .filter((n) => n.nodeType === 3)
        .map((n) => n.textContent ?? "")
        .join("")
        .trim()
      if (!own) continue
      if (!el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue
      const rect = el.getBoundingClientRect()
      if (rect.width < 3 || rect.height < 3) continue
      if (el.closest(":disabled, [disabled], [data-disabled], [aria-disabled=true]")) continue
      if (el.closest("[data-testid=accent-override]")) continue
      const cs = getComputedStyle(el)
      if (cs.color === "rgba(0, 0, 0, 0)" || /\/ 0\)$/.test(cs.color)) continue
      const bg = arc.effectiveBg(el, false)
      let fg = arc.paint(cs.color, bg)
      const op = opacityOf(el)
      if (op < 1) fg = fg.map((c, i) => c * op + bg[i] * (1 - op)) as typeof fg
      const ratio = arc.ratio(fg, bg)
      const size = parseFloat(cs.fontSize)
      const bold = parseInt(cs.fontWeight, 10) >= 700
      const large = size >= 24 || (size >= 18.66 && bold)
      const needs = large ? 3 : 4.5
      checked++
      if (ratio < needs) out.push({ where: label(el), text: own.slice(0, 40), ratio: +ratio.toFixed(2), needs, fg: `rgb(${fg.map(Math.round)})`, bg: `rgb(${bg})`, size })
    }
    return { checked, offenders: out }
  })
}

for (const mode of modes) {
  test(`${mode}: every visible text on the kitchen sink meets its contrast threshold`, async ({ page }) => {
    await openApp(page, mode)
    // Open the transient layers too: one toast of each type and the action bar.
    for (const type of ["success", "error", "warning", "info", "loading"]) await page.getByTestId(`toast-open-${type}`).click()
    await page.getByTestId("actionbar-toggle").check({ force: true })
    await expect(page.getByTestId("actionbar")).toBeVisible()
    // Wait for every finite animation/transition (toast fade-in, action bar slide) to finish rather than a fixed delay:
    // on a loaded CI runner the toast opacity transition can still be running after 800ms, and the sweep would sample mid-fade colours.
    // Infinite animations (the loading toast spinner) never finish and are skipped. Loop until a frame passes with nothing pending,
    // since a transition may only start on the frame after the DOM change.
    await page.evaluate(async () => {
      const pending = () => document.getAnimations().filter((a) => a.effect?.getTiming().iterations !== Infinity && a.playState !== "finished")
      const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      await frame()
      while (pending().length) {
        await Promise.all(pending().map((a) => a.finished.catch(() => undefined)))
        await frame()
      }
    })
    const { checked, offenders } = await sweep(page)
    expect(checked, "text elements examined").toBeGreaterThan(150)
    const report = offenders.map((o) => `${o.ratio}:1 (<${o.needs}) "${o.text}" ${o.where} fg ${o.fg} on ${o.bg} @${o.size}px`)
    expect(report, `${offenders.length} text elements below threshold out of ${checked}`).toEqual([])
  })
}

// Guards the guard: a sweep that cannot fail proves nothing.
test("the sweep reports low-contrast text, honours the large-text threshold and skips disabled controls", async ({ page }) => {
  await openApp(page, "light")
  await page.evaluate(() => {
    const host = document.createElement("div")
    host.style.cssText = "background:#fff"
    host.innerHTML = `<p data-testid="bad-small" style="color:#999;font-size:14px">small grey</p>
      <p data-testid="large-ok" style="color:#808080;font-size:28px">large grey</p>
      <button disabled data-testid="disabled-bad" style="color:#ccc;background:#fff">disabled</button>`
    document.body.appendChild(host)
  })
  const { offenders } = await sweep(page)
  const hit = offenders.map((o) => o.where)
  expect(hit.some((w) => w.includes("bad-small")), "low-contrast small text is flagged").toBe(true)
  expect(hit.some((w) => w.includes("large-ok")), "#808080 at 28px (3.95:1) passes the 3:1 large-text rule").toBe(false)
  expect(hit.some((w) => w.includes("disabled-bad")), "disabled control is skipped").toBe(false)
})
