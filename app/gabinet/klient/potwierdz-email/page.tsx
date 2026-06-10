import { redirect } from "next/navigation";
import { verifyGabPatientEmail } from "@/app/actions/gabinetSettings";
import { getGabinetRedirectPath } from "@/lib/gabinetRedirect";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function GabPatientVerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams;
  if (!token?.trim()) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <p>Brak tokenu.</p>
        <GabLink href="/klient/logowanie" className="text-gab-sky hover:underline">
          Logowanie
        </GabLink>
      </main>
    );
  }
  const result = await verifyGabPatientEmail(token);
  if (result.ok) redirect(await getGabinetRedirectPath("/klient/logowanie?verified=1"));
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <p className="text-red-700">{result.error}</p>
      <GabLink href="/klient/rejestracja" className="text-gab-sky hover:underline">
        Rejestracja
      </GabLink>
    </main>
  );
}
