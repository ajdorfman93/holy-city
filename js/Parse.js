const puppeteer = require('puppeteer');

async function fetchDynamicContent() {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the target page
    await page.goto('https://lakewoodluach.getgrist.com/mfG1uWuVC9zw/theLakewoodLuach/p/12', {
      waitUntil: 'domcontentloaded', // Ensure the initial HTML is loaded
    });

    // Wait for the #readout element to be rendered
    await page.waitForSelector('#readout', { timeout: 300 });

    // Extract the content of the #readout element
    const dynamicContent = await page.$eval('#readout', el => el.textContent);
    console.log('Dynamic Content:', dynamicContent);

    await browser.close();
  } catch (error) {
    console.error('Error fetching dynamic content:', error);
  }
}

fetchDynamicContent();
