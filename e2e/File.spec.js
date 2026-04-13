const { test } = require('@playwright/test');

test('test', async ({ page, request }) => {

  const pdfUrl = 'https://claim.blr1.digitaloceanspaces.com/live/cashless_claim/20260306140942_1772786382_DHANDAPANI-CLAIM.pdf';

  const response = await request.get(pdfUrl);
  const buffer = await response.body();

  await page.goto('https://davidwalsh.name/demo/multiple-file-upload.php');

  await page.setInputFiles('input[type="file"]', {
    name: 'temp_claim.pdf',
    mimeType: 'application/pdf',
    buffer: buffer
  });

});