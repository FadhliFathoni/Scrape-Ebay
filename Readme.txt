# Web Scraping and AI Summarization Project

This project allows you to scrape eBay listings and generate AI-based summaries of the scraped descriptions.

## Initialize Project
1. Run the following command to initialize the project:
    
    npm init -y

2. Install necessary dependencies:
    
    npm install express playwright fs

## Run Project
1. Start the project with:
    
    node app.js

2. Test the scraping endpoint using Postman or `curl`:

    **Request**:
    curl --location 'http://localhost:3000/scrape' \
    --header 'Content-Type: application/json' \
    --data '{
    "url": "https://www.ebay.com/sch/i.html?_from=R40&_nkw=nike&_sacat=0&_ipg=240&rt=nc",
    "startPage": 1
    }'

    This will scrape eBay listings based on the given URL and start page.

## Summarize Description with AI

To use the AI summarization feature, you must first install **Ollama** on your device.

1. Visit [Ollama's download page](https://ollama.com/download) to install Ollama.

2. After installation, run the following command in your terminal to install the AI model:
    
    ollama run deepseek-coder-v2

3. Once the model is set up, you can test the AI summarization endpoint with the following `curl` command:
    
    curl -X GET "http://localhost:3000/generate-summary"
    

## Dependencies

- **express**: Web framework for Node.js
- **playwright**: Browser automation library for scraping
- **fs**: File system module for handling files
