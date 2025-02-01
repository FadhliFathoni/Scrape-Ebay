const { chromium } = require('playwright');
const scrapeProducts = require('./scrapeProducts.js');
const scrapeNextPage = require('./scrapeNextPage.js');

async function scrapeInBatches(start, baseUrl) {
  const allProducts = [];
  let pageNumber = start;

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    while (true) {
      const results = await Promise.all([
        scrapeProducts(pageNumber + 0, baseUrl),
        scrapeProducts(pageNumber + 1, baseUrl),
        scrapeProducts(pageNumber + 2, baseUrl),
        scrapeProducts(pageNumber + 3, baseUrl),
      ]);
      const products = results.flat();
      allProducts.push(...products);

      const hasNext = await scrapeNextPage(page, baseUrl);
      if (!hasNext) break;

      pageNumber++;
    }
  } catch (error) {
    console.error("Error during batch scraping:", error);
  } finally {
    await context.close();
    await browser.close();
  }

  return allProducts;
}

module.exports = { scrapeInBatches };
