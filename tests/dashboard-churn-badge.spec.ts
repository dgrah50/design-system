import { expect, test } from "@playwright/test"

test("churn decrease and revenue increase use the good-news badge colors", async ({ page }) => {
  await page.goto("/demos")

  const churn = page.getByText("↓ 0.6%", { exact: true })
  const revenue = page.getByText("↑ 12.4%", { exact: true })
  await expect(churn).toBeVisible()
  await expect(revenue).toBeVisible()

  const colors = await Promise.all([churn, revenue].map((badge) => badge.evaluate((el) => {
    const style = getComputedStyle(el)
    return [style.color, style.backgroundColor]
  })))
  expect(colors[0]).toEqual(colors[1])
})
