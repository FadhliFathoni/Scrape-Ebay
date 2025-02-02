const { chromium } = require('playwright');

async function scrapeProducts(baseUrl) {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"});
  const page = await context.newPage();

  try {
    await page.goto(baseUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });

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

          let frame;
          try {
            frame = await productPage.frameLocator('iframe[title="Seller\'s description of item"]');
          } catch (error) {
            console.warn("No iframe found for description.");
          }

          if (frame) {
            const elements = await frame.locator('[data-testid="x-item-description-child"]').all();
            if (elements.length > 0) {
              description = (await elements[0].innerText()).replace(/\n/g, ' ').trim();
            }
          }
        } catch (error) {
          console.error(`Failed to load product page: ${product.link}`, error);
        } finally {
          await productPage.close();
        }
      }
      products.push({ ...product, description });
    }

    return products;
  } catch (error) {
    console.error(`Error scraping page ${baseUrl}:`, error);
    return [];
  } finally {
    await context.close();
    await browser.close();
  }
}

module.exports = scrapeProducts;
