import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://checspro.vizzafintech.com/login');
  await page.locator('input[name="email"]').fill('it@vizzainsurance.com');
  await page.locator('#login_password').fill('it@2024');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page).toHaveTitle('Checspro.ai');
  await page.getByRole('link', { name: 'Email', exact: true }).click();
  await page.getByRole('option', { name: 'Select an Option' }).click();
  await page.getByRole('option', { name: 'PROMED HOSPITAL KOTTIVAKKAM' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await page.locator('iframe').contentFrame().getByRole('button', { name: 'Refresh' }).click();
  await page.waitForTimeout(5000);
});