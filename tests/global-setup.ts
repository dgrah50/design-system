import { chromium, type FullConfig } from "@playwright/test"

/**
 * Warm the dev server before any test runs: load the app until it settles (Vite finishes dependency optimisation and any
 * resulting reload) so no test navigates into a page that is about to be force-reloaded.
 */
export default async function globalSetup(config: FullConfig) {
  const { baseURL, channel } = config.projects[0].use
  const browser = await chromium.launch({ channel })
  const page = await browser.newPage()
  let reloads = 0
  page.on("framenavigated", (f) => {
    if (f === page.mainFrame()) reloads++
  })
  await page.goto(baseURL!)
  // Wait until the page has rendered and then stayed put (no navigation) for a quiet second.
  for (let i = 0; i < 40; i++) {
    await page.locator("[data-testid=sec-scale]").waitFor({ timeout: 30_000 }).catch(() => undefined)
    const before = reloads
    await page.waitForTimeout(1000)
    if (reloads === before && (await page.locator("[data-testid=sec-scale]").count())) break
  }
  await browser.close()
}
