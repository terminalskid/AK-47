export default function handler(req, res) {
  const store = global.store || {};
  const slug = req.query.slug;

  if (!store[slug]) {
    return res.status(404).json({ error: "not found" });
  }

  res.json({
    slug,
    url: store[slug].url,
    clicks: store[slug].clicks
  });
}
