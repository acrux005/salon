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
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-[13px] font-semibold uppercase tracking-wider text-gab-sky">{v.heroBadge}</p>
      <h1 className="mt-3 text-3xl font-bold text-gab-navy sm:text-4xl">{v.heroTitle}</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-600">{v.heroSubtitle}</p>

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

      <div className="mt-12 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 px-8 py-10 text-white">
        <h2 className="text-2xl font-bold">Zacznij za darmo</h2>
        <p className="mt-2 max-w-xl text-sky-100">
          Rejestracja gabinetu, kalendarz i pierwsze rezerwacje — bez magazynu, bez ERP, bez P1 na start.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <GabLink href="/register" className="rounded-lg bg-white px-6 py-3 text-[15px] font-semibold text-sky-800 shadow hover:bg-sky-50">
            Załóż konto gabinetu
          </GabLink>
          <GabLink href="/login" className="rounded-lg border border-white/40 px-6 py-3 text-[15px] font-semibold text-white hover:bg-white/10">
            Zaloguj się
          </GabLink>
        </div>
      </div>
    </main>
  );
}
