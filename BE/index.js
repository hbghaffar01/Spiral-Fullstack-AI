const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const data = require("./data.json");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
  }),
);

const PORT = process.env.PORT || 4000;

function normalize(text) {
  return String(text || "").toLowerCase();
}

function scoreItem(item, tokens) {
  const haystack = normalize([item.title, item.description, item.content, item.category].join(" "));
  let score = 0;
  tokens.forEach((token) => {
    if (!token) return;
    const parts = haystack.split(token);
    if (parts.length > 1) {
      score += parts.length - 1;
    }
  });
  return score;
}

app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").toString().trim();
  const category = (req.query.category || "").toString().trim().toLowerCase();

  if (!q && !category) {
    return res.json({ results: [] });
  }

  const tokens = normalize(q).split(/\s+/).filter(Boolean);

  let items = data;
  if (category) {
    items = items.filter((item) => normalize(item.category) === category);
  }

  if (tokens.length === 0) {
    return res.json({ results: items });
  }

  const scored = items
    .map((item) => ({
      item,
      score: scoreItem(item, tokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  res.json({ results: scored });
});

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

app.post("/api/scrape", async (req, res) => {
  const url = typeof req.body.url === "string" ? req.body.url.trim() : "";

  if (!url) {
    return res.status(400).json({ error: "Field 'url' is required" });
  }

  if (!isHttpUrl(url)) {
    return res.status(400).json({ error: "Only http and https URLs are supported" });
  }

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      maxRedirects: 5,
      headers: {
        "User-Agent": "Spiralyze-Micro-Scraper/1.0 (+technical-assessment)",
      },
      validateStatus: () => true,
    });

    if (response.status < 200 || response.status >= 300) {
      return res.status(502).json({ error: `Upstream responded with status ${response.status}` });
    }

    const contentType = String(response.headers["content-type"] || "").toLowerCase();
    if (!contentType.includes("text/html")) {
      return res.status(415).json({ error: "URL did not return HTML content" });
    }

    const html = response.data;
    const $ = cheerio.load(html);

    const title = $("title").first().text().trim() || null;
    const description =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[name="Description"]').attr("content")?.trim() ||
      null;
    const h1 = $("h1").first().text().trim() || null;

    res.json({ title, description, h1 });
  } catch (err) {
    if (err.code === "ECONNABORTED") {
      return res.status(504).json({ error: "Request to target URL timed out" });
    }
    res.status(500).json({ error: err.message || "Unknown error while scraping" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
