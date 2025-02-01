const axios = require('axios');
const fs = require("fs");
const express = require('express');
const app = express();
const port = 3000;

async function getResponseFromFile(parameter) {
    const strictCodeOnly = "Return only JSON output, no explanations, descriptions, or comments.";
    try {
        const prompt = fs.readFileSync("products.json", 'utf-8');
        const response = await axios.post('http://localhost:11434/api/generate', 
        {
            model: "deepseek-coder-v2:latest",
            // prompt: `Create a triangle of * using for loop in python without explanation and comments`,
            prompt: `summarize the description from this JSON and return it as JSON format. ${strictCodeOnly}\n${prompt}`,
            stream: false
        });

        if (response.data && response.data.response) {
            console.log(response.data.response);
            return response.data.response;
        } else {
            console.error("Invalid response format:", response.data);
            return { error: "Invalid response format" };
        }
    } catch (error) {
        console.error("Error:", error.response ? error.response.data : error.message);
        return { error: error.message };
    }
}

app.get('/generate-summary', async (req, res) => {
    const result = await getResponseFromFile();
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
