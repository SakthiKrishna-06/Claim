export async function RefreshFlow(page) {

  // create new tab
  const newTab = await page.context().newPage();

  await newTab.goto('https://checspro.vizzafintech.com/login');

  await newTab.locator('input[name="email"]').fill('it@vizzainsurance.com');
  await newTab.locator('#login_password').fill('it@2024');
  await newTab.getByRole('button', { name: 'Sign In' }).click();

  await newTab.goto('https://checspro.vizzafintech.com/admin/claim/new-version/new-version-list');

  await newTab.getByRole('link', { name: 'Email', exact: true }).click();
  await newTab.getByRole('option', { name: 'Select an Option' }).click();
  await newTab.getByRole('option', { name: 'PROMED HOSPITAL KOTTIVAKKAM' }).click();
  await newTab.getByRole('button', { name: 'Submit' }).click();
  await newTab.waitForTimeout(5000);
  const frame = newTab.frameLocator('iframe');
  await frame.getByRole('button', { name: 'Refresh' }).click();

  await newTab.close();

  // switch back to original tab
  await page.bringToFront();
  await page.waitForTimeout(5000);
}