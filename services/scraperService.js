const { chromium } = require('playwright');
const scrapeProducts = require('./scrapeProducts.js');
const scrapeNextPage = require('./scrapeNextPage.js');

async function scrapeInBatches(start, baseUrl) {
  const allProducts = [];
  let pageNumber = start;

  const browser = await chromium.launch({ headless: false ,});
  const context = await browser.newContext({userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"});
  const page = await context.newPage();

  try {
    while (true) {
      const url = baseUrl.includes('_pgn=')
        ? baseUrl.replace(/_pgn=\d+/, `_pgn=${pageNumber}`)
        : `${baseUrl}&_pgn=${pageNumber}`;
    
      const url1 = url;
      const url2 = url.replace(/_pgn=\d+/, `_pgn=${pageNumber + 1}`);
      const url3 = url.replace(/_pgn=\d+/, `_pgn=${pageNumber + 2}`);
      const url4 = url.replace(/_pgn=\d+/, `_pgn=${pageNumber + 3}`);
    
      const results = await Promise.all([
        scrapeProducts(url1),
        scrapeProducts(url2),
        scrapeProducts(url3),
        scrapeProducts(url4),
      ]);
      
      const products = results.flat();
      allProducts.push(...products);
    
      const hasNext = await scrapeNextPage(url4);
      if (!hasNext) break;
    
      pageNumber += 4;
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
