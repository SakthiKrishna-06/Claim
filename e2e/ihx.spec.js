export async function runIHXFlow(page, res) {
  console.log("IHX flow running...");
  await page.getByTestId('username').fill(res.rows[0].user_name);
  await page.getByTestId('password').fill(res.rows[0].user_password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('#WA_NEW_ADMISSION').click();
  await page.getByTestId('payer').click();
  await page.getByText('Galaxy').click();
  await page.getByTestId('iHave').click();
  await page.waitForTimeout(5000);
}
