export default function Stats({ params }) {
  const link = global.store?.[params.slug];
  if (!link) return <h1>Not found</h1>;

  return (
    <pre>
      {JSON.stringify(
        { slug: params.slug, ...link },
        null,
        2
      )}
    </pre>
  );
}
