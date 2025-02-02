const { chromium } = require('playwright');

async function scrapeNextPage(baseUrl) {
const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"});
  const page = await context.newPage();
    await page.goto(baseUrl);
    const nextButton = await page.locator("a.pagination__next.icon-link");
    return await nextButton.isVisible();
  }
  
  module.exports = scrapeNextPage;
  