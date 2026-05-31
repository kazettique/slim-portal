import { expect, test } from "@playwright/test";

test.describe("Year converter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/converter/year-converter");
  });

  test("initializes with current year in western input", async ({ page }) => {
    const year = String(new Date().getFullYear());
    await expect(page.locator("#year-western")).toHaveValue(year);
  });

  test("entering a western year updates era fields", async ({ page }) => {
    await page.locator("#year-western").fill("2024");
    await page.locator("#year-western").dispatchEvent("input");
    await expect(page.locator("#year-era")).toHaveValue("令和");
    await expect(page.locator("#year-era-num")).toHaveValue("6");
  });

  test("entering a western year updates ROC field", async ({ page }) => {
    await page.locator("#year-western").fill("2024");
    await page.locator("#year-western").dispatchEvent("input");
    await expect(page.locator("#year-roc")).toHaveValue("113");
  });
});

test.describe("Area converter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/converter/area-converter");
  });

  test("renders tsubo input", async ({ page }) => {
    await expect(page.locator("#area-tsubo")).toBeVisible();
  });

  test("entering tsubo value populates sqm field", async ({ page }) => {
    await page.locator("#area-tsubo").fill("10");
    await page.locator("#area-tsubo").dispatchEvent("input");
    const sqm = page.locator("#area-sqm");
    await expect(sqm).not.toHaveValue("");
  });
});
