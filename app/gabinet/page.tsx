import { headers } from "next/headers";
import { getGabinetVerticalConfigForHost } from "@/lib/gabinetPlatform/verticals";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

export const dynamic = "force-dynamic";

export default async function GabinetHomePage() {
  const host = (await headers()).get("host") ?? "";
  const v = getGabinetVerticalConfigForHost(host);

  return (
    <main className="min-w-0">
      <section className="relative overflow-hidden border-b border-sky-200 bg-gradient-to-br from-sky-50 via-white to-blue-50 px-4 py-10 sm:py-16 lg:py-22">
        <div className="relative mx-auto min-w-0 max-w-6xl text-center lg:text-left">
          <p className="mx-auto max-w-full text-pretty rounded-2xl border border-sky-200 bg-white/80 px-3 py-1.5 text-center text-[11px] font-semibold uppercase leading-snug tracking-wide text-sky-700 shadow-sm sm:inline-block sm:rounded-full sm:text-[12px] lg:mx-0">
            {v.heroBadge}
          </p>
          <h1 className="mt-4 text-pretty break-words text-[1.55rem] font-bold leading-[1.15] tracking-tight text-gab-navy sm:mt-5 sm:text-4xl lg:text-[2.85rem] lg:leading-[1.06]">
            {v.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-slate-600 sm:mt-5 sm:text-lg lg:mx-0">
            {v.heroSubtitle}
          </p>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
            <GabLink href="/register" className="gab-btn-primary box-border w-full max-w-full px-6 py-3 shadow-lg shadow-sky-500/25 sm:w-auto">
              Rozpocznij za darmo
            </GabLink>
            <GabLink href="/panel" className="inline-flex min-h-11 w-full max-w-full items-center justify-center rounded-lg border-2 border-sky-200 bg-white px-6 py-3 text-[15px] font-semibold text-sky-800 hover:bg-sky-50 sm:w-auto">
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

      {v.id === "dent" ? (
        <section className="border-b border-sky-100 bg-white px-4 py-10 sm:py-12">
          <div className="mx-auto flex min-w-0 max-w-6xl flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="min-w-0">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-sky-700">Gabinet w Kołobrzegu</p>
              <h2 className="mt-1 text-pretty text-xl font-bold leading-snug text-gab-navy">
                A-DENT · lek. dent. Agnieszka Czerwińska-Załoga
              </h2>
              <p className="mt-1 text-[15px] text-slate-600">ul. Orłowskiego 48 · 391 opinii · RTG i mikroskop</p>
            </div>
            <GabLink href="/gabinet/a-dent-kolobrzeg" className="gab-btn-primary w-full shrink-0 px-6 sm:w-auto">
              Zobacz profil gabinetu
            </GabLink>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="text-center text-xl font-bold text-gab-navy sm:text-2xl">Jedna platforma — wiele branż</h2>
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
