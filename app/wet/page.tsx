import Link from "next/link";
import { getPublishedVetClinicsAsync } from "@/lib/vet/clinics";
import {
  filterShowcaseClinics,
  getVetMarketingStatsAsync,
  formatVetMarketingProof,
} from "@/lib/vet/marketingStats";
import {
  WetHomeHeroDecor,
  WetHomeHeroMockup,
  WetHomePreviewCards,
} from "@/components/wet/WetHomeProductMockup";
import { WetHomeUspSection } from "@/components/wet/WetHomeUspSection";

export const dynamic = "force-dynamic";

export default async function WetHomePage() {
  const [clinics, stats] = await Promise.all([getPublishedVetClinicsAsync(), getVetMarketingStatsAsync()]);
  const showcaseClinics = filterShowcaseClinics(clinics);
  const proofLines = formatVetMarketingProof(stats);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-wet-teal-200 bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/50 px-4 py-14 sm:py-18 lg:py-22">
        <WetHomeHeroDecor />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-wet-teal/20 bg-white/80 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-wet-teal shadow-sm backdrop-blur-sm">
              🐾 SaaS dla przychodni weterynaryjnych
            </p>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-wet-navy sm:text-5xl lg:text-[2.85rem] lg:leading-[1.06]">
              Żaden szczep nie wypadnie z głowy
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-wet-navy-muted lg:mx-0">
              Kalendarz, pacjenci i przypomnienia SMS o szczepieniach — bez magazynu, bez ERP, bez prowizji od
              wizyty.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link href="/wet/register" className="wet-btn-primary px-6 py-3 shadow-lg shadow-wet-teal/25">
                Rozpocznij za darmo
              </Link>
              <Link href="#demo" className="wet-btn-outline px-6 py-3">
                Zobacz panel
              </Link>
            </div>
            <ul className="mx-auto mt-7 flex max-w-lg flex-col gap-2 text-left lg:mx-0">
              {proofLines.map((line) => (
                <li key={line} className="flex items-start gap-2 text-[14px] text-wet-navy-muted">
                  <span className="mt-0.5 text-wet-teal" aria-hidden>
                    ✓
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <WetHomeHeroMockup />
        </div>
      </section>

      <section id="demo" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-wet-navy sm:text-3xl">Zobacz, jak to wygląda</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-wet-navy-muted">
            Panel zaprojektowany pod recepcję weterynaryjną — szczepienia, pacjenci i SMS w jednym miejscu.
          </p>
        </div>
        <div className="mt-10">
          <WetHomePreviewCards />
        </div>
        <p className="mt-8 text-center">
          <Link href="/wet/register" className="font-semibold text-wet-teal hover:underline">
            Załóż przychodnię i przetestuj panel →
          </Link>
        </p>
      </section>

      <WetHomeUspSection />

      {showcaseClinics.length >= 2 && (
        <section className="border-t border-wet-teal-100 bg-white px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-xl font-bold text-wet-navy">Przychodnie korzystające z rezerwacji online</h2>
            <p className="mt-2 text-[14px] text-wet-navy-muted">
              Szukasz weterynarza? Zobacz profile i umów wizytę — to osobna ścieżka dla właścicieli zwierząt.
            </p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {showcaseClinics.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/wet/przychodnia/${c.slug}`}
                    className="block rounded-xl border border-wet-teal-100 p-4 transition hover:-translate-y-0.5 hover:border-wet-teal hover:bg-wet-teal-50 hover:shadow-md"
                  >
                    <p className="font-semibold text-wet-navy">{c.name}</p>
                    <p className="text-[14px] text-wet-navy-muted">{c.city}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/wet/przychodnie" className="mt-6 inline-block font-medium text-wet-teal hover:underline">
              Wszystkie przychodnie →
            </Link>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-wet-navy px-4 py-16 text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-wet-navy/40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M20 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-teal-200">
            Nie kolejny ciężki system
          </p>
          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">Calendly + szczepienia dla wetów</h2>
          <p className="mt-5 text-[16px] leading-relaxed text-teal-50">
            VetHarmonogram skupia się na tym, co najważniejsze:{" "}
            <strong className="font-semibold text-white">kalendarzu wizyt</strong>,{" "}
            <strong className="font-semibold text-white">przypomnieniach o szczepieniach</strong> i{" "}
            <strong className="font-semibold text-white">prostym panelu dla recepcji</strong>. Bez magazynu. Bez
            księgowości. Bez wdrożenia za 20 tys.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/wet/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-[15px] font-semibold text-teal-900 shadow-lg transition hover:bg-teal-50"
            >
              Rozpocznij za darmo
            </Link>
            <Link
              href="/wet/dla-przychodni"
              className="inline-flex items-center justify-center rounded-xl border-2 border-white/50 bg-white/10 px-6 py-3 text-[15px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Cennik i funkcje
            </Link>
          </div>
          <p className="mt-6 text-[14px] text-teal-100">
            Właściciel zwierzęcia?{" "}
            <Link
              href="/wet/klient/rejestracja"
              className="font-semibold text-white underline decoration-white/50 underline-offset-2 hover:decoration-white"
            >
              Załóż konto i prowadź historię zwierząt
            </Link>
            {" · "}
            <Link
              href="/wet/przychodnie"
              className="font-semibold text-white underline decoration-white/50 underline-offset-2 hover:decoration-white"
            >
              Umów wizytę online
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
