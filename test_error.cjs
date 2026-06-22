const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  await page.goto('http://localhost:5173');
  
  // Wait for the Enthusiast button to appear
  await page.waitForSelector('text=Enthusiast');
  console.log('Found Enthusiast button, clicking...');
  
  await page.click('text=Enthusiast');
  console.log('Clicked Enthusiast button.');
  
  // Wait a bit to see if any errors are thrown
  await page.waitForTimeout(2000);
  
  console.log('Done.');
  await browser.close();
})();
