const express = require('express');
const scraperController = require('./controllers/scraperController.js');
const aiController = require('./controllers/aiController.js')

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/scrape', scraperController.scrape);
app.get('/generate-summary', async (req, res) => {
    const result = await aiController.getResponseFromFile();
    res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
