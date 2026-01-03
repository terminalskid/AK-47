import { redirect, notFound } from "next/navigation";

export default function Redirect({ params }) {
  const link = global.store?.[params.slug];

  if (!link) notFound();

  link.clicks++;
  redirect(link.url);
}
