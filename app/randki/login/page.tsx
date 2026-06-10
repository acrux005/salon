import { redirect } from "next/navigation";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** NextAuth signIn → /login; na subdomenie randki przekierowanie na /logowanie. */
export default async function RandkiLoginRedirectPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") q.set(k, v);
    else if (Array.isArray(v)) v.forEach((x) => q.append(k, x));
  }
  redirect(q.toString() ? `/logowanie?${q}` : "/logowanie");
}
