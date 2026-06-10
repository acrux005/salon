import { redirect } from "next/navigation";
import { verifyGabClinicEmail } from "@/app/actions/gabinetSettings";
import { getGabinetRedirectPath } from "@/lib/gabinetRedirect";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function GabVerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token?.trim()) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-gab-navy">Brak linku</h1>
        <p className="mt-2 text-[15px] text-slate-600">Użyj linku z wiadomości po rejestracji.</p>
        <GabLink href="/login" className="mt-6 inline-block text-gab-sky hover:underline">
          Logowanie
        </GabLink>
      </main>
    );
  }
  const result = await verifyGabClinicEmail(token);
  if (result.ok) redirect(await getGabinetRedirectPath("/login?verified=1"));
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-gab-navy">Potwierdzenie e-mail</h1>
      <p className="mt-2 rounded-lg bg-red-50 px-4 py-3 text-[15px] text-red-700">{result.error}</p>
      <GabLink href="/register" className="mt-6 inline-block text-gab-sky hover:underline">
        Rejestracja
      </GabLink>
    </main>
  );
}
