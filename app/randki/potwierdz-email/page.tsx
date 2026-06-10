import { redirect } from "next/navigation";
import Link from "next/link";
import { verifyDatingEmailAction } from "@/app/actions/randkiAuth";
import { randkiPublicHref } from "@/lib/randkiPaths";
import { isRandkiPortalHost } from "@/lib/randkiHost";
import { headers } from "next/headers";

type PageProps = { searchParams: Promise<{ token?: string }> };

export default async function RandkiVerifyEmailPage({ searchParams }: PageProps) {
  const host = (await headers()).get("host") ?? "";
  const isPortal = isRandkiPortalHost(host);
  const { token } = await searchParams;

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-4 py-12">
        <p className="text-red-600">Brak tokenu weryfikacji.</p>
      </main>
    );
  }

  const res = await verifyDatingEmailAction(token);
  if (res.ok) {
    redirect(randkiPublicHref("/logowanie?verified=1", isPortal));
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-xl font-bold text-randki-navy">Weryfikacja e-mail</h1>
      <p className="mt-4 text-[14px] text-red-600">{res.error}</p>
      <Link href={randkiPublicHref("/logowanie", isPortal)} className="mt-4 inline-block text-rose-600 hover:underline">
        Przejdź do logowania
      </Link>
    </main>
  );
}
