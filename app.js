const express = require('express');
const scraperController = require('./controllers/scraperController.js');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/scrape', scraperController.scrape);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
