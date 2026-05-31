import { expect, test } from '@playwright/test';

import newsFixture from './fixtures/news.json';

test.describe('News page', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('/api/news', (route) =>
      route.fulfill({ contentType: 'application/json', json: newsFixture }),
    );
    await page.goto('/news');
  });

  test('renders news items from API', async ({ page }) => {
    await expect(page.locator('.news-item')).toHaveCount(2);
    await expect(page.locator('.news-item').first()).toContainText('Test news headline one');
  });

  test('shows source badge', async ({ page }) => {
    await expect(page.locator('.badge').first()).toHaveText('NHK');
  });

  test('Refresh button re-renders items', async ({ page }) => {
    await expect(page.locator('.news-item')).toHaveCount(2);
    await page.locator('#refresh-btn').click();
    await expect(page.locator('.news-item')).toHaveCount(2);
  });
});
