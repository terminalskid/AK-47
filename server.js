import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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

function validURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

app.post("/api/shorten", async (req, res) => {
  try {
    const { url, slug } = req.body;

    if (!url || !slug) {
      return res.status(400).json({ error: "missing url or slug" });
    }

    if (!validURL(url)) {
      return res.status(400).json({ error: "invalid url" });
    }

    if (!/^[a-zA-Z0-9_-]{2,30}$/.test(slug)) {
      return res.status(400).json({ error: "bad slug format" });
    }

    await db.run(
      "INSERT INTO links (slug, url) VALUES (?, ?)",
      [slug, url]
    );

    res.json({ short: `https://short.tips.io/${slug}` });
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(409).json({ error: "slug already taken" });
    }
    res.status(500).json({ error: "server error" });
  }
});

app.get("/:slug", async (req, res) => {
  const link = await db.get(
    "SELECT * FROM links WHERE slug = ?",
    req.params.slug
  );

  if (!link) return res.status(404).send("not found");

  await db.run(
    "UPDATE links SET clicks = clicks + 1 WHERE slug = ?",
    req.params.slug
  );

  res.redirect(link.url);
});

app.listen(3000, () => {
  console.log("tips.io running on http://localhost:3000");
});
