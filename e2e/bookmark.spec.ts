import { expect, test } from "@playwright/test";

import searchFixture from "./fixtures/search.json";

test.describe("Bookmark flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/search*", (route) =>
      route.fulfill({ contentType: "application/json", json: searchFixture }),
    );
  });

  test("bookmark page shows empty state initially", async ({ page }) => {
    await page.goto("/bookmark");
    await expect(page.locator("#bookmarks-status")).toBeVisible();
  });

  test("saved search appears on bookmark page", async ({ page }) => {
    // Save a bookmark via search page
    await page.goto("/search");
    await page.locator("#query-input").fill("Tokyo");
    await page.locator("#search-form").dispatchEvent("submit");
    await expect(page.locator("#bookmark-btn")).toBeVisible();
    await page.locator("#bookmark-btn").click();

    // Navigate to bookmark page and verify
    await page.goto("/bookmark");
    await expect(page.locator(".bookmark-item")).toHaveCount(1);
    await expect(page.locator(".bookmark-item")).toContainText("Tokyo");
  });

  test("deleting all bookmarks shows empty state", async ({ page }) => {
    // Seed a bookmark
    await page.goto("/search");
    await page.locator("#query-input").fill("Tokyo");
    await page.locator("#search-form").dispatchEvent("submit");
    await expect(page.locator("#bookmark-btn")).toBeVisible();
    await page.locator("#bookmark-btn").click();

    await page.goto("/bookmark");
    await expect(page.locator(".bookmark-item")).toHaveCount(1);

    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("#delete-all-btn").click();
    await expect(page.locator(".bookmark-item")).toHaveCount(0);
    await expect(page.locator("#bookmarks-status")).toBeVisible();
  });
});
