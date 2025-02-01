const { chromium } = require('playwright');

async function scrapeProducts(pageNumber, baseUrl) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const url = baseUrl.replace(/_pgn=\d+/, `_pgn=${pageNumber}`).includes('_pgn=') 
    ? baseUrl.replace(/_pgn=\d+/, `_pgn=${pageNumber}`) 
    : `${baseUrl}&_pgn=${pageNumber}`;

    await page.goto(url, { timeout: 60000, waitUntil: 'domcontentloaded' });

    const products = [];
    const productLinks = await page.locator('.s-item').evaluateAll((items) => {
      return items.map(item => {
        const productName = item.querySelector('.s-item__title')?.innerText ?? '-';
        const price = item.querySelector('.s-item__price')?.innerText ?? '-';
        const link = item.querySelector('a.s-item__link')?.href;
        return { productName, price, link };
      });
    });

    for (let product of productLinks) {
      if (product.productName === "Shop on eBay") continue;

      let description = "-";
      if (product.link) {
        const productPage = await context.newPage();
        try {
          const response = await productPage.goto(product.link, { timeout: 60000, waitUntil: 'domcontentloaded' });
          if (!response) throw new Error("Timeout: Page did not load");

          const frame = await productPage.frameLocator('iframe[title="Seller\'s description of item"]');
          if (await frame.locator('[data-testid="x-item-description-child"]').count() > 0) {
            const allContent = await frame.locator('[data-testid="x-item-description-child"]').innerText();
            description = allContent.replace(/\n/g, ' ').trim();
          }
        } catch (error) {
          console.error(`Failed to load product page: ${product.link}`, error);
        }
        await productPage.close();
      }
      products.push({ ...product, description });
    }

    return products;
  } catch (error) {
    console.error(`Error scraping page ${pageNumber}:`, error);
    return [];
  } finally {
    await context.close();
    await browser.close();
  }
}

module.exports = scrapeProducts;
