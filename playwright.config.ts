import { defineConfig, devices } from "@playwright/test"

const PORT = 5199

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./tests/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [["list"]],
  timeout: 30_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1280, height: 900 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      // Uses the installed Google Chrome so no browser download is needed. Set PW_BUNDLED=1 to use Playwright's own Chromium
      // (after `npx playwright install chromium`).
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 }, ...(process.env.PW_BUNDLED ? {} : { channel: "chrome" }) },
    },
  ],
})
