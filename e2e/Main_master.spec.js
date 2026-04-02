import db from './db.js';
import { test, expect } from '@playwright/test';
import { runIHXFlow } from './ihx.spec.js';
import { runICICIFlow } from './ICICI.spec.js';

test('Login', async ({ page }) => {
  try {
    const now = await db.query('SELECT NOW()');
    console.log('Success:', now.rows);
    let payer_name = 14;
    let hospital_name = 25;
    const res = await db.pool.query('select * from  tpa_portal_master where is_deleted = $1 and payer_name = $2 and hospital_name = $3;', [0,payer_name, hospital_name]);
    // const res = await db.query('select hospital_name,payer_name,portal_url from tpa_portal_master where is_deleted = 0;');
      console.log("response",res.rows);

    if(res && res.rows.length > 0){
      let portal_name = res.rows[0].portal_name;
      console.log('Matching record found for portal name', res.rows[0].portal_name  ? res.rows[0].portal_name : 'N/A');
        await page.goto(res.rows[0].portal_url);
        await page.waitForTimeout(3000);
      
        if(portal_name === 'IHX') {
         await runIHXFlow(page, res);
        }
        else if(portal_name === 'ICICI') {
          await runICICIFlow(page, res);
        }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await db.end();
  }

});
