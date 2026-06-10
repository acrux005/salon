import Link from "next/link";
import { headers } from "next/headers";
import { ClinicHeader } from "@/components/clinic/ClinicHeader";
import { ClinicFooter } from "@/components/clinic/ClinicFooter";
import { FooterWet } from "@/components/wet/FooterWet";
import { HeaderWet } from "@/components/wet/HeaderWet";
import { isWetPortalHost } from "@/lib/wetHost";

export default async function NotFound() {
  const host = (await headers()).get("host") ?? "";
  if (isWetPortalHost(host)) {
    return (
      <>
        <HeaderWet />
        <main className="flex min-h-[60vh] flex-col items-center justify-center bg-wet-mint px-4 py-16">
          <div className="w-full max-w-md text-center">
            <p className="mb-2 text-6xl font-bold text-wet-teal">404</p>
            <h1 className="mb-4 text-2xl font-bold text-wet-navy">Strona nie została znaleziona</h1>
            <p className="mb-8 text-wet-navy/70">
              Adres może być nieaktualny lub strona została przeniesiona.
            </p>
            <nav className="flex flex-wrap justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-wet-teal px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-700"
              >
                Strona główna
              </Link>
              <Link
                href="/panel"
                className="inline-flex items-center justify-center rounded-xl border border-wet-teal px-6 py-3 font-semibold text-wet-teal transition-colors hover:bg-teal-50"
              >
                Panel przychodni
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-6 py-3 font-semibold text-wet-navy transition-colors hover:bg-white"
              >
                Kontakt
              </Link>
            </nav>
          </div>
        </main>
        <FooterWet />
      </>
    );
  }

  return (
    <>
      <ClinicHeader />
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 bg-beauty-cream">
        <div className="max-w-md w-full text-center">
          <p className="text-6xl font-serif font-semibold text-beauty-rose mb-2">404</p>
          <h1 className="text-2xl font-bold text-beauty-charcoal mb-4">
            Strona nie została znaleziona
          </h1>
          <p className="text-beauty-charcoal/80 mb-8">
            Adres może być nieaktualny lub strona została przeniesiona.
          </p>
          <nav className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-beauty-rose px-6 py-3 font-semibold text-white hover:bg-beauty-pink-500 transition-colors"
            >
              Strona główna
            </Link>
            <Link
              href="/portal"
              className="inline-flex items-center justify-center rounded-full border border-beauty-rose px-6 py-3 font-semibold text-beauty-rose hover:bg-beauty-pink-100 transition-colors"
            >
              Portal
            </Link>
            <Link
              href="/zabiegi"
              className="inline-flex items-center justify-center rounded-full border border-beauty-rose px-6 py-3 font-semibold text-beauty-rose hover:bg-beauty-pink-100 transition-colors"
            >
              Zabiegi
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center rounded-full border border-beauty-rose px-6 py-3 font-semibold text-beauty-rose hover:bg-beauty-pink-100 transition-colors"
            >
              Kontakt
            </Link>
          </nav>
        </div>
      </main>
      <ClinicFooter />
    </>
  );
}
