import { expect, test } from "@playwright/test";

test.describe("Settings page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/settings");
  });

  test("renders theme radio buttons", async ({ page }) => {
    await expect(page.locator("#theme-system")).toBeVisible();
    await expect(page.locator("#theme-light")).toBeVisible();
    await expect(page.locator("#theme-dark")).toBeVisible();
  });

  test("selecting dark theme updates data-theme attribute", async ({ page }) => {
    await page.locator("#theme-dark").check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("selecting light theme clears data-theme attribute", async ({ page }) => {
    await page.locator("#theme-dark").check();
    await page.locator("#theme-light").check();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "");
  });

  test("theme persists after reload", async ({ page }) => {
    await page.locator("#theme-dark").check();
    await page.reload();
    await expect(page.locator("#theme-dark")).toBeChecked();
  });
});
