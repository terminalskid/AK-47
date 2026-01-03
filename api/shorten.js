export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const { url, slug } = req.body;

  if (!url || !slug) {
    return res.status(400).json({ error: "missing fields" });
  }

  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "invalid url" });
  }

  // TEMP STORAGE (MVP)
  // Replace with DB later
  global.links ||= {};

  if (global.links[slug]) {
    return res.status(409).json({ error: "slug taken" });
  }

  global.links[slug] = url;

  res.json({
    short: `https://akshort.vercel.app/${slug}`
  });
}
