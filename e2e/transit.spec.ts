import { expect, test } from "@playwright/test";

import transitFixture from "./fixtures/transit.json";

test.describe("Transit page", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("/api/transit*", (route) =>
      route.fulfill({ contentType: "application/json", json: transitFixture }),
    );
    await page.route("/api/transit/autocomplete*", (route) =>
      route.fulfill({ contentType: "application/json", json: [] }),
    );
    await page.goto("/transit");
  });

  test("renders from/to inputs and submit button", async ({ page }) => {
    await expect(page.locator("#from-input")).toBeVisible();
    await expect(page.locator("#to-input")).toBeVisible();
    await expect(page.locator("#search-btn")).toBeVisible();
  });

  test("search requires coord selection — shows error without coords", async ({ page }) => {
    await page.locator("#from-input").fill("Shibuya");
    await page.locator("#to-input").fill("Shinjuku");
    await page.locator("#transit-form").dispatchEvent("submit");
    await expect(page.locator("#transit-status")).toContainText("Please select");
  });
});
