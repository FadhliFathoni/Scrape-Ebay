const scraperService = require('../services/scraperService');
const fs = require('fs');

async function scrape(req, res) {
  const { url, startPage } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is required!" });
  }

  try {
    const start = parseInt(startPage) || 1;
    const allProducts = await scraperService.scrapeInBatches(start, url);

    fs.writeFileSync('products.json', JSON.stringify(allProducts, null, 2));
    console.log("Data has been saved to 'products.json'!");

    res.json({ message: "Scraping completed!", data: allProducts });
  } catch (error) {
    console.error("Error in scraping route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { scrape };
