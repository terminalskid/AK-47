global.store ||= {};

export default function handler(req, res) {
  const { slug } = req.query;

  if (!slug || !global.store[slug]) {
    res.status(404).send("not found");
    return;
  }

  global.store[slug].clicks++;
  res.redirect(302, global.store[slug].url);
}
