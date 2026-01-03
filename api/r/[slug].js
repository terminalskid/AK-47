export default function handler(req, res) {
  const store = global.store || {};
  const slug = req.query.slug;

  const link = store[slug];
  if (!link) {
    res.status(404).send("not found");
    return;
  }

  link.clicks++;
  res.redirect(link.url);
}
