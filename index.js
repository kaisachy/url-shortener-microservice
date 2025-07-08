require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDatabase = [];
const dns = require("dns");
const urlParser = require("url");

app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;
  const hostname = urlParser.parse(originalUrl).hostname;

  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    const shortUrl = urlDatabase.length + 1;
    urlDatabase.push({ original_url: originalUrl, short_url: shortUrl });

    res.json({ original_url: originalUrl, short_url: shortUrl });
  });
});

app.get("/api/shorturl/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const record = urlDatabase.find((entry) => entry.short_url === id);

  if (record) {
    res.redirect(record.original_url);
  } else {
    res.status(404).json({ error: "No short URL found for the given input" });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
