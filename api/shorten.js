const store = global.store || (global.store = {});
const hits = global.hits || (global.hits = {});

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"] || "local";
  hits[ip] = (hits[ip] || 0) + 1;

  if (hits[ip] > 20) {
    return res.status(429).json({ error: "rate limited" });
  }

  const { url, slug } = req.body;

  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: "invalid url" });
  }

  if (store[slug]) {
    return res.status(409).json({ error: "slug taken" });
  }

  store[slug] = { url, clicks: 0 };

  res.json({
    short: `https://akshort.vercel.app/r/${slug}`
  });
}
