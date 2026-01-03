import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static("public"));

const db = await open({
  filename: "links.db",
  driver: sqlite3.Database
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

app.post("/api/shorten", async (req, res) => {
  const { url, slug } = req.body;

  if (!url || !slug) {
    return res.status(400).json({ error: "missing fields" });
  }

  if (!isValidURL(url)) {
    return res.status(400).json({ error: "invalid url" });
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
    return res.status(400).json({ error: "invalid slug" });
  }

  try {
    await db.run(
      "INSERT INTO links (slug, url) VALUES (?, ?)",
      [slug, url]
    );

    res.json({
      short: `https://short.tips.io/${slug}`
    });
  } catch {
    res.status(409).json({ error: "slug already taken" });
  }
});

app.get("/:slug", async (req, res) => {
  const { slug } = req.params;

  const link = await db.get(
    "SELECT * FROM links WHERE slug = ?",
    slug
  );

  if (!link) {
    return res.status(404).send("Link not found");
  }

  await db.run(
    "UPDATE links SET clicks = clicks + 1 WHERE slug = ?",
    slug
  );

  res.redirect(302, link.url);
});

app.listen(3000, () => {
  console.log("tips.io running on port 3000");
});
