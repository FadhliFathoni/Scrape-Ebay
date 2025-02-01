Initialize project
- npm init -y
- npm install express playwright fs

Run project
- node app.js
- Test endpoint with Postman
    curl --location 'http://localhost:3000/scrape' \
    --header 'Content-Type: application/json' \
    --data '{
    "url": "https://www.ebay.com/sch/i.html?_from=R40&_nkw=nike&_sacat=0&_ipg=240&rt=nc",
    "startPage": 1
    }
    '
- Test summarize description using AI  
    curl -X GET "http://localhost:3000/generate-summary"