import { expect, test } from "@playwright/test"
import { modes, openApp } from "./helpers"

for (const mode of modes) {
  test(`reduced motion (${mode}): opening the Dialog leaves no running animation longer than 150ms`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await openApp(page, mode)
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
}
