async function scrapeNextPage(page, baseUrl) {
    const nextButton = await page.locator("a.pagination__next.icon-link");
    return await nextButton.isVisible();
  }
  
  module.exports = scrapeNextPage;
  