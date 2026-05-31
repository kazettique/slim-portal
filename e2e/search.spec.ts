import { expect, test } from '@playwright/test';

import searchFixture from './fixtures/search.json';

test.describe('Search page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/search*', (route) =>
      route.fulfill({ contentType: 'application/json', json: searchFixture }),
    );
    await page.goto('/search');
  });

  test('renders search form', async ({ page }) => {
    await expect(page.locator('#query-input')).toBeVisible();
    await expect(page.locator('#search-form button[type="submit"]')).toBeVisible();
  });

  test('submitting form shows results', async ({ page }) => {
    await page.locator('#query-input').fill('Tokyo');
    await page.locator('#search-form').dispatchEvent('submit');
    await expect(page.locator('.search-item')).toHaveCount(2);
    await expect(page.locator('.search-item').first()).toContainText('Tokyo travel guide');
  });

  test('URL updates with query param on submit', async ({ page }) => {
    await page.locator('#query-input').fill('ramen');
    await page.locator('#search-form').dispatchEvent('submit');
    await expect(page).toHaveURL(/\?q=ramen/);
  });

  test('Save button appears after results load', async ({ page }) => {
    await page.locator('#query-input').fill('Tokyo');
    await page.locator('#search-form').dispatchEvent('submit');
    await expect(page.locator('#bookmark-btn')).toBeVisible();
  });
});
