import { test, request } from '@playwright/test';
import db from './db.js';
import { APIFlow } from './apiFlow.js';
import { text } from 'node:stream/consumers';
test.setTimeout(240000);
let Health_Card_Number = 'IL19560897105';  //Health Card Number / UHID:
let Policy_Number; //Policy Number:
let Member_Id;  //Member ID / Employee ID:
let Member_Name; //Employee Name:
let Mobile_Number = '9876543212'; //Mobile Number
let Age = '20'; //Age
let Doctor_Name = 'Anisha';
let Qualifications = 'MBBS';
let Abha_ID = 'ABHA1234567890'; //Abha ID
let Mobile_Number_Dr = '8978675645'; //Mobile Number
let Telephone_Number; //Telephone Number
let IsDeathClaim = 'no'; //Is Death Claim
let Medical = 'no'; //Medical / Surgical
let Procedure = 'Single'; //Single/Multiple procedure
let Diagnosis_Procedure_Name = 'Closure of intestinal cutaneous fistula(10535)'; //Diagnosis/Procedure Name
let PED = 'NO'; //PED / Non-PED
let DOA = '2026-02-04'

let PED_details = ['Accident', 'Maternity']; //PED details if PED is yes
let Dateinput = '2025-03-27'; //PED Date
let FIR_MLC = 'no'; //FIR/MLC in case of Accident
let Location_of_FIR = 'test'; //Location of FIR
let FIR_MLC_Number = '123456'; //FIR/MLC Number

let Accommodation = 'AC Single Room [Single Room Ac]';
let Room_rent_perday = '1000';
let Expected_Length_Of_Stay = '2';
let Requested_Amount = '3000';
let Total_consultation = '1231';
let Consumables = '1231';
let Pharmacy = '12134';
let Investigations = '2343';


let ID_Proof = 'no'; //ID Proof
let PreAuth = 'yes'; //PreAuth
let Reports = 'yes'; //Reports

let Relevant_Clinical_Findings = 'test'; //Relevant Clinical Findings
let Presenting_complaints = 'test'; //Presenting complaints with duration


test('test', async ({ page, request }) => {
  // console.log('finalOTP in test:', await finalOTP());
  await page.goto('https://ilhc.icicilombard.com/');

  await page.getByRole('textbox', { name: 'User Name:' }).click({ modifiers: ['ControlOrMeta'] });
  await page.getByRole('textbox', { name: 'User Name:' }).fill('ILHC1295506');
  await page.getByRole('textbox', { name: 'Password:' }).fill('icicilombard@123');
  await page.getByRole('button', { name: 'Login' }).click();


  // Fetch OTP from database
  await page.waitForTimeout(9000);
  await APIFlow(request);
  await page.waitForTimeout(60000);
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

  if ((Health_Card_Number) != null) {
    await page.getByRole('textbox', { name: 'Health Card Number / UHID:' }).fill(Health_Card_Number);
    await page.getByRole('button', { name: 'Search' }).click();
    await page.getByRole('cell', { name: Health_Card_Number }).click();
  }
  else if ((Policy_Number && (Member_Id || Member_Name)) != null) {
    await page.getByRole('textbox', { name: 'Policy Number:' }).fill(Policy_Number);
    if (Member_Id != null) {
      await page.getByRole('textbox', { name: 'Member ID / Employee ID:' }).fill(Member_Id);
    }
    else if (Member_Name != null) {
      await page.locator('#employeeName').fill(Member_Name);
    }
    else {
      console.log('Please provide either Member ID or Member Name');
    }
    await page.locator('#btnSearch').click();
    await page.waitForTimeout(3000);
    await page.getByText(Policy_Number).click();
  }

  await page.getByRole('textbox', { name: 'Mobile Number*:', exact: true }).fill(Mobile_Number);
  await page.locator('#txtagepatient').fill(Age);
  await page.getByRole(Abha_ID != null ? 'textbox' : 'paragraph', { name: 'Abha ID:' }).fill(Abha_ID);
  Telephone_Number != null && await page.getByRole('textbox', { name: 'Telephone Number:' }).fill(Telephone_Number);
  // await page.getByRole(Telephone_Number != null ? 'textbox' : 'paragraph', { name: 'Telephone Number:' }).fill(Telephone_Number);
  await page.locator('#txtPatient_IP_no').fill('23456');
  await page.getByRole('textbox', { name: 'Age of Patient*: Treating Dr\'' }).fill(Doctor_Name);
  await page.getByRole('textbox', { name: 'Qualifications*: Procedure*:' }).fill(Qualifications);
  await page.getByRole('textbox', { name: 'Mobile Number*: Is this a' }).fill(Mobile_Number_Dr);

  IsDeathClaim === 'yes' && await page.locator('#Radio_DeathClaim_YES').check();
  // await page.locator(Medical === 'yes' ? '#Radio_Treatment_Medical' : '#Radio_Treatment_Surgical').check();
  if (Medical === 'no') {
    await page.locator('#Radio_Treatment_Surgical').check();
    await page.locator(Procedure === 'Multiple' ? '#Radio_Procedure_Multiple' : '#Radio_Procedure_Single').check();
    await page.waitForTimeout(3000);
    await page.locator('#ddlDisease_Type').selectOption('Other Procedures');
    await page.locator('#ddlother_procedure_Type').fill(Diagnosis_Procedure_Name);
  }
  else {
    await page.locator('#Radio_Treatment_Medical').check();
    await page.locator('#ddlDiagnosis_Type').fill('Cardiac arrest, cause unspecified(9292)');
  }
  // await page.locator('Cardiac arrest, cause unspecified(9292)').click();
  await page.getByRole(Presenting_complaints != null ? 'textbox' : 'paragraph', { name: 'Presenting complaints with duration' }).fill(Presenting_complaints);
  await page.getByRole(Relevant_Clinical_Findings != null ? 'textbox' : 'paragraph', { name: 'Relevant Clinical Findings' }).fill(Relevant_Clinical_Findings);

  let dateParts = Dateinput.split('-');
  let year = dateParts[0];
  let month = String(Number(dateParts[1]));
  let day = String(Number(dateParts[2]));

  // console.log("year:", year, typeof (year), "month:", month, typeof (month), "day:", day, typeof (day));

  if (PED == 'yes') {
    await page.locator('#Radio_PED_YES').check();

    const simplePeds = [`Hypertension`, `Diabetes`, `Osteology Arthritis`, `Cancer`, `COPD`, `Coronary Heart Disease`, `Asthma`, `STD / HIV`];
    const pedIds = { 'Osteology Arthritis': 'Arthritis', 'Coronary Heart Disease': 'Heart', 'STD / HIV': 'STD' };

    for (const detail of PED_details) {
      if (simplePeds.includes(detail)) {
        const idPart = pedIds[detail] || detail;
        await page.locator(`#ph${idPart}`).check();
        await page.getByRole(`paragraph`).filter({ hasText: `${detail}:` }).getByRole(`img`).click();
        await page.locator(`.ui-datepicker-year`).selectOption(year);
        await page.locator(`.ui-datepicker-month`).selectOption(month);
        await page.getByRole(`link`, { name: day, exact: true }).click();
      }
      else if (detail == 'Maternity') {
        await page.locator('#phMaternity').check();

        //LMP
        await page.getByRole('paragraph').filter({ hasText: 'LMP' }).getByRole('img').click();
        await page.locator('.ui-datepicker-year').selectOption(year);
        await page.locator('.ui-datepicker-month').selectOption(month);
        await page.getByRole('link', { name: day, exact: true }).click();

        //EDD
        await page.getByRole('paragraph').filter({ hasText: 'EDD' }).getByRole('img').click();
        await page.locator('.ui-datepicker-year').selectOption(year);
        await page.locator('.ui-datepicker-month').selectOption(month);
        await page.getByRole('link', { name: day, exact: true }).click();

        // Type of Delivery
        if (PED_details.includes('Normal')) {
          await page.getByRole('combobox').nth(3).selectOption('1');
        }
        else if (PED_details.includes('LSCS')) {
          await page.getByRole('combobox').nth(3).selectOption('2');
        }
        else {
          await page.getByLabel('Type of Delivery').selectOption('3');
        }

        // Indication for LSCS
        await page.getByRole('textbox', { name: 'Indication for LSCS' }).fill('345678');

        //Obstetric History
        await page.getByRole('textbox', { name: 'Obstetric History:' }).fill('2');    //g
        await page.locator('#oh-p').fill('3'); //p
        await page.locator('#oh-a').fill('5'); //a 
        await page.locator('#oh-l').fill('6'); //l

        //Menstrual History
        await page.getByRole('textbox', { name: 'Menstrual History' }).fill('tert');
      }

      else if (detail == 'Accident') {
        await page.locator('#phAccident').check();
        await page.getByRole('paragraph').filter({ hasText: 'Accident Date' }).click();
        await page.locator('.showhide-box-right-col > p > .ui-datepicker-trigger').click();
        await page.locator('.ui-datepicker-year').selectOption(year);
        await page.locator('.ui-datepicker-month').selectOption(month);
        await page.getByRole('link', { name: day, exact: true }).click();

        // Alcohol/Drug abuse/Intoxication
        await page.getByText('Alcohol/Drug abuse/Intoxication').click();
        await page.locator('#Radio_AlPED_YES').check();
        await page.locator('#Radio_AlPED_NO').check();

        // FIR/MLC
        if (FIR_MLC == 'yes') {
          await page.locator('#firmlc').check();
          await page.locator('#locationFir').fill(Location_of_FIR);
          await page.locator('#firmlcNumber').fill(FIR_MLC_Number);


        }
      }
    }
  }
  else {
    await page.locator('#Radio_PED_NO').check();
  }
  let dateparts_2 = DOA.split('-');
  let year_2 = dateparts_2[0];
  let month_2 = String(Number(dateparts_2[1]));
  let days = String(Number(dateparts_2[2]));

  await page.locator('#divExpectedDOA > p > .ui-datepicker-year').click();
  await page.getByRole('link', { name: year_2, exact: true }).click();

  await page.locator('#divExpectedDOA > p > .ui-datepicker-trigger').click();
  await page.getByRole('link', { name: month_2, exact: true }).click();

  await page.locator('#divExpectedDOA > p > .ui-datepicker-trigger').click();
  await page.getByRole(`link`, { name: days, exact: true }).click();

  await page.getByLabel('Class of Accommodation*:').selectText(Accommodation);
  await page.locator('#bill_Room_rent_perday').fill(Room_rent_perday);
  await page.getByRole('textbox', { name: 'Expected Length Of Stay*:' }).fill(Expected_Length_Of_Stay);
  await page.locator('#requestedAmount').fill(Requested_Amount);
  if (Medical === 'yes') {
    await page.locator('#txtTotal_consultation').fill(Total_consultation);
    await page.locator('#txt_consumables').fill(Consumables);
    await page.locator('#txt_Pharmacy').fill(Pharmacy);
    await page.locator('#txt_Investigations').fill(Investigations);
  }
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.locator(ID_Proof === 'yes' ? '#Radio_IDPROOF_YES' : '#Radio_IDPROOF_NO').check();
  await page.locator(PreAuth === 'yes' ? '#Radio_PREAUTH_YES' : '#Radio_PREAUTH_NO').check();
  await page.locator(Reports === 'yes' ? '#Radio_REPORTS_YES' : '#Radio_REPORTS_NO').check();
  await page.locator('#ddlDocumentType2').selectOption('Prescription Papers');
  await page.getByRole('button', { name: 'Choose File' }).click();
  await page.getByRole('textbox', { name: 'Comments*:' }).fill('Pre Auth Request');
});