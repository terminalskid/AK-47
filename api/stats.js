global.store ||= {};

export default function handler(req, res) {
  const { slug } = req.query;

  if (!slug || !global.store[slug]) {
    return res.status(404).json({ error: "not found" });
  }

  res.json({
    slug,
    url: global.store[slug].url,
    clicks: global.store[slug].clicks
  });
}
