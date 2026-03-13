import { test } from '@playwright/test';

test('slow process test', async ({ page }) => {
  test.setTimeout(120000); // Set timeout to 2 minutes
  await page.waitForTimeout(60000);
  console.log('Waited for 1 minute');
});