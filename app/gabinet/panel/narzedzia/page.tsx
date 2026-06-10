import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { BarChart3, Download, Upload } from "lucide-react";

const TOOLS = [
  {
    href: "/panel/narzedzia/import",
    label: "Import danych",
    description: "Pacjenci, klienci CRM, wizyty i katalog zabiegów z pliku CSV.",
    icon: Upload,
  },
  {
    href: "/panel/narzedzia/eksport",
    label: "Eksport danych",
    description: "Backup kartoteki, CRM, wizyt, planów i katalogu.",
    icon: Download,
  },
  {
    href: "/panel/narzedzia/raporty",
    label: "Raporty",
    description: "Historia wizyt w okresie, statystyki i wydruk do kontroli.",
    icon: BarChart3,
  },
];

export default function GabNarzedziaPage() {
  return (
    <>
      <GabPanelPageHeader title="Narzędzia" description="Import, eksport, raporty — bez ERP." />
      <div className="px-4 py-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t) => (
            <GabLink
              key={t.href}
              href={t.href}
              className="rounded-xl border border-gab-sky/20 bg-white p-5 transition hover:border-gab-sky/40"
            >
              <t.icon className="h-6 w-6 text-gab-sky" aria-hidden />
              <h2 className="mt-3 font-semibold text-gab-navy">{t.label}</h2>
              <p className="mt-1 text-[14px] text-slate-600">{t.description}</p>
            </GabLink>
          ))}
        </div>
      </div>
    </>
  );
}
