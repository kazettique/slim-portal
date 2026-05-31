import { expect, test } from '@playwright/test';

import placeFixture from './fixtures/place-search.json';

test.describe('Place search page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/place/search*', (route) =>
      route.fulfill({ contentType: 'application/json', json: placeFixture }),
    );
    await page.route('/api/place/autocomplete*', (route) =>
      route.fulfill({ contentType: 'application/json', json: [] }),
    );
    await page.goto('/place');
  });

  test('renders search form', async ({ page }) => {
    await expect(page.locator('#query-input')).toBeVisible();
    await expect(page.locator('#search-btn')).toBeVisible();
  });

  test('submitting form renders place results', async ({ page }) => {
    await page.locator('#query-input').fill('coffee');
    await page.locator('#places-form').dispatchEvent('submit');
    await expect(page.locator('.place-item')).toHaveCount(2);
    await expect(page.locator('.place-item').first()).toContainText('Sakura Coffee');
  });

  test('place result shows address', async ({ page }) => {
    await page.locator('#query-input').fill('coffee');
    await page.locator('#places-form').dispatchEvent('submit');
    await expect(page.locator('.place-item').first()).toContainText('1-2-3 Shinjuku');
  });
});
