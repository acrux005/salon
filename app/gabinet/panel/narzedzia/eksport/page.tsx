"use client";

import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

const EXPORTS = [
  { type: "patients", label: "Pacjenci", desc: "Imię, telefon, e-mail, PESEL, zgody" },
  { type: "clients", label: "Klienci CRM", desc: "Kontakty i zgody marketingowe" },
  { type: "appointments", label: "Wizyty", desc: "Kalendarz wizyt ze statusami" },
  { type: "plans", label: "Plany leczenia", desc: "Tytuły, statusy, sumy kosztorysów" },
  { type: "catalog", label: "Katalog zabiegów", desc: "Nazwy, ceny, czasy trwania, aktywność" },
] as const;

export default function GabExportPage() {
  function download(type: string) {
    window.open(`/api/gabinet/panel/export?type=${type}`, "_blank");
  }

  async function downloadAll() {
    const res = await fetch("/api/gabinet/panel/export?type=all");
    if (!res.ok) return;
    const data = (await res.json()) as { files: Record<string, string>; exportedAt: string };
    const date = data.exportedAt.slice(0, 10);
    for (const [key, content] of Object.entries(data.files)) {
      const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gabinet-${key}-${date}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <>
      <GabPanelPageHeader title="Eksport danych" description="Backup CSV — archiwum i migracja." />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <GabLink href="/panel/narzedzia" className="text-[14px] font-medium text-gab-sky hover:underline">
            ← Narzędzia
          </GabLink>

          <ul className="space-y-3">
            {EXPORTS.map((item) => (
              <li
                key={item.type}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gab-sky/20 bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gab-navy">{item.label}</p>
                  <p className="text-[13px] text-slate-500">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => download(item.type)}
                  className="rounded-lg border border-gab-sky/30 px-4 py-2 text-[13px] font-medium hover:bg-sky-50"
                >
                  Pobierz CSV
                </button>
              </li>
            ))}
          </ul>

          <button type="button" onClick={downloadAll} className="gab-btn-primary">
            Pobierz pełny backup (5 plików)
          </button>
        </div>
      </div>
    </>
  );
}
