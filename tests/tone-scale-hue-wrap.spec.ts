import { expect, test } from "@playwright/test"
import { toneScale } from "../src/theme/tokens"

const hue = (value: string) => Number(value.match(/oklch\([^)]*\s([\d.]+)\)$/)?.[1])

test("toneScale interpolates hues across zero along the shortest arc", () => {
  const base = { l600: 53, c600: 0.18, l300: 71, c300: 0.155 }
  const ascending = toneScale({ ...base, h300: 355, h600: 10 })
  const descending = toneScale({ ...base, h300: 10, h600: 355 })

  expect(hue(ascending["400"].value)).toBe(0)
  expect(hue(ascending["500"].value)).toBe(5)
  expect(hue(descending["400"].value)).toBe(5)
  expect(hue(descending["500"].value)).toBe(0)
})
