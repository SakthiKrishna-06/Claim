import { test, expect } from '@playwright/test';
import db from './db.js';

test('test', async ({ page }) => {
  // console.log('finalOTP in test:', await finalOTP());
  await page.goto('https://ilhc.icicilombard.com/');
  await page.getByRole('textbox', { name: 'User Name:' }).click({modifiers: ['ControlOrMeta']});
  await page.getByRole('textbox', { name: 'User Name:' }).fill('ILHC1295506');
  await page.getByRole('textbox', { name: 'Password:' }).fill('icicilombard@123');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForTimeout(9000);
    const res = await db.pool2.query(
      "select body from email_received where body like '%web portal is%' and to_email = 'insurance@promedhospital.com' order by id desc limit 1;"
    );
    let finalOTP = null;  
      const otpMatch = await res.rows[0].body.match(/(?<!\d)\d{6}(?!\d)/);
      finalOTP = otpMatch ? otpMatch[0] : null;
    
      console.log('finalOTP:', finalOTP);
  await page.locator('#txtOTP').fill(await finalOTP);
  await page.waitForTimeout(3000);
  await page.locator('#btnVerify').click();
  await page.getByRole('link', { name: 'Add / View IPD PreAuth /' }).click();
  await page.getByRole('textbox', { name: 'Health Card Number / UHID:' }).fill('IL22945213905');
  await page.getByRole('button', { name: 'Search' }).click();
  // await page.getByRole('cell', { name: 'IL22945213905' }).click();
  // await page.getByRole('textbox', { name: 'Mobile Number*:', exact: true }).fill('9876543210');
  // await page.locator('#txtagepatient').fill('23');
  // await page.locator('#txtPatient_IP_no').fill('23456');
  // await page.getByRole('textbox', { name: 'Age of Patient*: Treating Dr\'' }).fill('doctor');
  // await page.getByRole('textbox', { name: 'Qualifications*: Procedure*:' }).fill('MBBS');
  // await page.getByRole('textbox', { name: 'Mobile Number*: Is this a' }).fill('6543212345');
  // await page.locator('#Radio_Treatment_Medical').check();
  // await page.locator('#ddlDiagnosis_Type').fill('CARDI');
  // await page.locator('text =Cardiac arrest, cause unspecified (9292)').click();
  // await page.locator('#Radio_PED_NO').check();
  // await page.locator('#divExpectedDOA > p > .ui-datepicker-trigger').click();
  // await page.getByRole('link', { name: '3', exact: true }).click();
  // await page.locator('#divExpectedDOA > p > .ui-datepicker-trigger').click();
  // await page.getByRole('link', { name: '19' }).click();
  // await page.getByLabel('Class of Accommodation*:').selectOption('701860');
  // await page.locator('#bill_Room_rent_perday').fill('1000');
  // await page.getByRole('textbox', { name: 'Expected Length Of Stay*:' }).fill('55');
  // await page.locator('#txtTotal_consultation').fill('1231');
  // await page.locator('#txt_consumables').fill('1231');
  // await page.locator('#txt_Pharmacy').fill('12134');
  // await page.locator('#txt_Investigations').fill('2343');
  // await page.getByRole('button', { name: 'Add', exact: true }).click();
  // await page.locator('#Radio_PREAUTH_YES').check();
  // await page.locator('#Radio_IDPROOF_YES').check();
  // await page.locator('#Radio_REPORTS_YES').click();
  // await page.locator('#ddlDocumentType2').selectOption('500410-1');
  // await page.getByRole('button', { name: 'Choose File' }).click();
  // await page.getByRole('textbox', { name: 'Comments*:' }).fill('TEST');
});