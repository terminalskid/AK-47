const store = global.store || (global.store = {});

export async function POST(req) {
  const { url, slug } = await req.json();

  if (!url || !slug) {
    return Response.json({ error: "missing fields" }, { status: 400 });
  }

  if (store[slug]) {
    return Response.json({ error: "slug taken" }, { status: 409 });
  }

  store[slug] = { url, clicks: 0 };

  return Response.json({
    short: `https://akshort.vercel.app/r/${slug}`
  });
}
