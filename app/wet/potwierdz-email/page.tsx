import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import Link from "next/link";
import { verifyVetClinicEmail } from "@/app/actions/vet";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function WetVerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token?.trim()) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-wet-navy">Brak linku</h1>
        <p className="mt-2 text-[15px] text-wet-navy-muted">
          Użyj linku z wiadomości e-mail wysłanej po rejestracji przychodni.
        </p>
        <Link href="/wet/login" className="mt-6 inline-block font-medium text-wet-teal hover:underline">
          Przejdź do logowania
        </Link>
      </main>
    );
  }

  const result = await verifyVetClinicEmail(token);
  if (result.ok) redirect(await getWetRedirectPath("/login?verified=1"));

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-wet-navy">Potwierdzenie e-mail</h1>
      <p className="mt-2 rounded-lg bg-red-50 px-4 py-3 text-[15px] text-red-700" role="alert">
        {result.error}
      </p>
      <Link href="/wet/register" className="mt-6 inline-block font-medium text-wet-teal hover:underline">
        Zarejestruj się ponownie
      </Link>
      {" · "}
      <Link href="/wet/login" className="font-medium text-wet-teal hover:underline">
        Zaloguj się
      </Link>
    </main>
  );
}
