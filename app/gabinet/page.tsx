import Link from "next/link";
import { headers } from "next/headers";
import { getGabinetVerticalConfigForHost } from "@/lib/gabinetPlatform/verticals";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

export const dynamic = "force-dynamic";

export default async function GabinetHomePage() {
  const host = (await headers()).get("host") ?? "";
  const v = getGabinetVerticalConfigForHost(host);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-50 px-4 py-14 sm:py-18 lg:py-22">
        <div className="relative mx-auto max-w-6xl text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-sky-700 shadow-sm">
            {v.heroBadge}
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-gab-navy sm:text-5xl lg:text-[2.85rem] lg:leading-[1.06]">
            {v.heroTitle}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 lg:mx-0">
            {v.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <GabLink href="/register" className="gab-btn-primary px-6 py-3 shadow-lg shadow-sky-500/25">
              Rozpocznij za darmo
            </GabLink>
            <GabLink href="/panel" className="inline-flex items-center justify-center rounded-lg border-2 border-sky-200 bg-white px-6 py-3 text-[15px] font-semibold text-sky-800 hover:bg-sky-50">
              Zaloguj się do panelu
            </GabLink>
          </div>
          <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-2 text-left lg:mx-0">
            {[
              "Kalendarz wizyt i rezerwacja online",
              "Kartoteka pacjenta i dokumenty (RTG, wyniki)",
              "Plany leczenia i recall (SMS/e-mail)",
              "CRM klientów, rozliczenia, raporty — bez ERP",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2 text-[14px] text-slate-600">
                <span className="mt-0.5 text-sky-600" aria-hidden>
                  ✓
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-gab-navy">Jedna platforma — wiele branż</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[15px] text-slate-600">
          Ten sam silnik pod stomatologię, fizjoterapię, psychologię i inne gabinety. Bez magazynu i bez ERP.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Stomatologia", desc: "Recall higieny, plany leczenia, cennik zabiegów" },
            { title: "Fizjoterapia", desc: "Serie wizyt, przypomnienia o kontrolach" },
            { title: "Psychologia", desc: "Terminy, kartoteka, portal pacjenta" },
            { title: "Inne gabinety", desc: "Uniwersalny CRM + kalendarz + SMS" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gab-navy">{item.title}</h3>
              <p className="mt-2 text-[14px] text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-sky-100 bg-sky-50/50 px-4 py-12 text-center">
        <p className="text-[15px] text-slate-600">
          Masz już konto?{" "}
          <GabLink href="/login" className="font-semibold text-sky-700 hover:underline">
            Zaloguj się
          </GabLink>
        </p>
      </section>
    </main>
  );
}
