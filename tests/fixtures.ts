import { test as base, expect } from "@playwright/test"

/**
 * `test` with an automatic guard: any `console.error` or uncaught page error during the test fails it, so React warnings
 * (keys, hydration, invalid DOM nesting, script tags) cannot hide in a green run. `console.warn` is not treated as failure.
 */
export const test = base.extend<{ consoleGuard: void }>({
  consoleGuard: [
    async ({ page }, use) => {
      const problems: string[] = []
      page.on("console", (m) => {
        if (m.type() === "error") problems.push(`console.error: ${m.text().slice(0, 400)}`)
      })
      page.on("pageerror", (e) => problems.push(`pageerror: ${e.message.slice(0, 400)}`))
      await use()
      expect(problems, "console errors and page errors").toEqual([])
    },
    { auto: true },
  ],
})

export { expect }
