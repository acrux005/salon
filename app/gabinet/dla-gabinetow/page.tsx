import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { headers } from "next/headers";
import { getGabinetVerticalConfigForHost } from "@/lib/gabinetPlatform/verticals";

export const metadata = {
  title: "Dla gabinetów",
  description: "GabinetHarmonogram — kalendarz, pacjenci, recall i portal pacjenta bez ERP.",
};

export default async function DlaGabinetowPage() {
  const host = (await headers()).get("host") ?? "";
  const v = getGabinetVerticalConfigForHost(host);

  return (
    <main className="mx-auto min-w-0 max-w-6xl px-4 py-8 sm:py-12">
      <p className="max-w-full text-pretty text-[12px] font-semibold uppercase leading-snug tracking-wide text-gab-sky sm:text-[13px]">{v.heroBadge}</p>
      <h1 className="mt-3 text-pretty text-2xl font-bold leading-tight text-gab-navy sm:text-4xl">{v.heroTitle}</h1>
      <p className="mt-4 max-w-2xl text-pretty text-lg text-slate-600">{v.heroSubtitle}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Kalendarz i rezerwacja", desc: "Plan dnia, sloty online, blokady terminów." },
          { title: "Kartoteka pacjenta", desc: "Dane, dokumenty, historia wizyt w jednym miejscu." },
          { title: "Recall SMS", desc: "Automatyczne przypomnienia o higienizacji i kontrolach." },
          { title: "Plany leczenia", desc: "Etapy, kosztorys i status zabiegów." },
          { title: "CRM klientów", desc: "Wiadomości, rozliczenia, zgody marketingowe." },
          { title: "Portal pacjenta", desc: "Wizyty i dokumenty dostępne dla pacjenta online." },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-gab-sky/15 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-gab-navy">{item.title}</h2>
            <p className="mt-2 text-[14px] text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 px-4 py-8 text-white sm:mt-12 sm:px-8 sm:py-10">
        <h2 className="text-xl font-bold sm:text-2xl">Zacznij za darmo</h2>
        <p className="mt-2 max-w-xl text-[15px] text-sky-100">
          Rejestracja gabinetu, kalendarz i pierwsze rezerwacje — bez magazynu, bez ERP, bez P1 na start.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <GabLink href="/register" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-white px-6 py-3 text-[15px] font-semibold text-sky-800 shadow hover:bg-sky-50 sm:w-auto">
            Załóż konto gabinetu
          </GabLink>
          <GabLink href="/login" className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-white/40 px-6 py-3 text-[15px] font-semibold text-white hover:bg-white/10 sm:w-auto">
            Zaloguj się
          </GabLink>
        </div>
      </div>
    </main>
  );
}
