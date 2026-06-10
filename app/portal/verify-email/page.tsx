import { redirect } from "next/navigation";
import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { verifyEmailAction } from "@/app/actions/client";
import { verifyClinicEmailAction } from "@/app/actions/clinic";

type Props = { searchParams: Promise<{ token?: string; type?: string }> };

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token, type } = await searchParams;
  const isClinic = type === "clinic";
  if (!token?.trim()) {
    return (
      <>
        <HeaderPortal />
        <main className="min-h-screen bg-white py-16">
          <div className="mx-auto max-w-md px-4 text-center">
            <h1 className="font-[var(--font-serif)] text-2xl text-[#1F1A1C]">Brak linku</h1>
            <p className="mt-2 text-[15px] text-[#6F5E64]">
              Użyj linku z e-maila, który wysłaliśmy po rejestracji.
            </p>
            <Link href="/portal/login" className="mt-6 inline-block font-medium text-pink-600 hover:underline">
              Przejdź do logowania
            </Link>
          </div>
        </main>
        <FooterPortal />
      </>
    );
  }

  const result = isClinic ? await verifyClinicEmailAction(token) : await verifyEmailAction(token);
  if (result.ok) redirect("/portal/login?verified=1");

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-16">
        <div className="mx-auto max-w-md px-4">
          <h1 className="font-[var(--font-serif)] text-2xl text-[#1F1A1C]">Potwierdzenie e-mail</h1>
          <p className="mt-2 rounded-lg bg-red-50 px-4 py-3 text-[15px] text-red-700" role="alert">
            {result.error}
          </p>
          <Link
            href={isClinic ? "/portal/register" : "/portal/register-klient"}
            className="mt-6 inline-block font-medium text-pink-600 hover:underline"
          >
            Zarejestruj się ponownie
          </Link>
          {" · "}
          <Link href="/portal/login" className="font-medium text-pink-600 hover:underline">
            Zaloguj się
          </Link>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
