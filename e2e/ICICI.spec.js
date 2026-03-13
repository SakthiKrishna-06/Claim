import { test, request } from '@playwright/test';
import db from './db.js';
import { APIFlow } from './apiFlow.js';
test.setTimeout(240000); 
let Health_Card_Number = 'IL22945213905';  //Health Card Number / UHID:
let Policy_Number = '4016/Y/l 85245933/06/000';
let Policy_Name = 'sdfghjk';
let Member_Id = '1234567890'; //Member ID / Employee ID:
let Member_Name = 'dfghjkl'; //Employee Name:
test('test', async ({ page, request}) => {
  // console.log('finalOTP in test:', await finalOTP());
  await page.goto('https://ilhc.icicilombard.com/');
  
  await page.getByRole('textbox', { name: 'User Name:' }).click({modifiers: ['ControlOrMeta']});
  await page.getByRole('textbox', { name: 'User Name:' }).fill('ILHC1295506');
  await page.getByRole('textbox', { name: 'Password:' }).fill('icicilombard@123');
  await page.getByRole('button', { name: 'Login' }).click();
  

  // Fetch OTP from database
    await page.waitForTimeout(6000);
   await APIFlow(request);
   await page.waitForTimeout(70000);
   console.log('Waited for 90 seconds before fetching OTP from database');  
    const res = await db.pool2.query(
      "select body from email_received where body like '%web portal is%' and to_email = 'insurance@promedhospital.com' order by id desc limit 1;"
    );
    let finalOTP = null;  
      const otpMatch = await res.rows[0].body.match(/(?<!\d)\d{6}(?!\d)/);
      finalOTP = otpMatch ? otpMatch[0] : null;
    
      console.log('finalOTP:', finalOTP);

      // Fetch OTP from email
      // const { fetchOtp } = require('./emailUtils');

      // otp = await fetchOtp(
      //   "imap.gmail.com",                     // mail server
      //   "insurance@promedhospital.com",            // email
      //   "         ",                // app password
      //   "Your One-Time Password (OTP) for ILHC Login" // subject keyword
      // );
      // console.log('OTP from email:', otp);
  await page.waitForTimeout(5000);
  await page.locator('#txtOTP').fill(await finalOTP);
  await page.waitForTimeout(3000);
  await page.locator('#btnVerify').click();
  await page.getByRole('link', { name: 'Add / View IPD PreAuth /' }).click();

  // Input patient details

  if((Health_Card_Number) != null){
  await page.getByRole('textbox', { name: 'Health Card Number / UHID:' }).fill(Health_Card_Number);
  await page.getByRole('button', { name: 'Search' }).click();
  }
  else if((Policy_Number) != null){
     await page.getByRole('textbox', { name: 'Policy Number:' }).fill(Policy_Number);
     await page.getByRole('textbox', { name: 'Policy Name:' }).fill(Policy_Name);
  }
  else{
     await page.getByRole('textbox', { name: 'Member ID / Employee ID:' }).fill(Member_Id);
     await page.locator('#employeeName').fill(Member_Name);

  }
 //
  await page.getByRole('cell', { name: Health_Card_Number }).click();
  await page.getByRole('textbox', { name: 'Mobile Number*:', exact: true }).fill('9876543210');
  await page.locator('#txtagepatient').fill('23');
  await page.locator('#txtPatient_IP_no').fill('23456');
  await page.getByRole('textbox', { name: 'Age of Patient*: Treating Dr\'' }).fill('doctor');
  await page.getByRole('textbox', { name: 'Qualifications*: Procedure*:' }).fill('MBBS');
  await page.getByRole('textbox', { name: 'Mobile Number*: Is this a' }).fill('6543212345');
  await page.locator('#Radio_Treatment_Medical').check();
  await page.locator('#ddlDiagnosis_Type').fill('Cardiac arrest, cause unspecified (9292)');
  // await page.waitForTimeout(9000);
  // await page.locator('text =Cardiac arrest, cause unspecified (9292)').click();
  await page.locator('#Radio_PED_NO').check();
  await page.locator('#divExpectedDOA > p > .ui-datepicker-trigger').click();
  await page.getByRole('link', { name: '3', exact: true }).click();
  await page.locator('#divExpectedDOA > p > .ui-datepicker-trigger').click();
  await page.getByRole('link', { name: '19' }).click();
  await page.getByLabel('Class of Accommodation*:').selectOption('701860');
  await page.locator('#bill_Room_rent_perday').fill('1000');
  await page.getByRole('textbox', { name: 'Expected Length Of Stay*:' }).fill('55');
  await page.locator('#txtTotal_consultation').fill('1231');
  await page.locator('#txt_consumables').fill('1231');
  await page.locator('#txt_Pharmacy').fill('12134');
  await page.locator('#txt_Investigations').fill('2343');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.locator('#Radio_PREAUTH_YES').check();
  await page.locator('#Radio_IDPROOF_YES').check();
  await page.locator('#Radio_REPORTS_YES').click();
  await page.locator('#ddlDocumentType2').selectOption('500410-1');
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('textbox', { name: 'Comments*:' }).fill('TEST');
});