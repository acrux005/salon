"use client";

import Link from "next/link";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

const EXPORTS = [
  { type: "owners", label: "Właściciele", desc: "Imię, telefon, e-mail, zgody SMS/e-mail" },
  { type: "pets", label: "Zwierzęta", desc: "Gatunek, chip, status, właściciel, stado" },
  { type: "vaccinations", label: "Szczepienia", desc: "Pełna historia z seriami i terminami" },
  { type: "appointments", label: "Wizyty", desc: "Kalendarz wizyt ze statusami" },
] as const;

export default function WetNarzedziaEksportPage() {
  function download(type: string) {
    window.open(`/api/wet/panel/export?type=${type}`, "_blank");
  }

  async function downloadAll() {
    const res = await fetch("/api/wet/panel/export?type=all");
    if (!res.ok) return;
    const data = (await res.json()) as {
      files: Record<string, string>;
      exportedAt: string;
    };
    const date = data.exportedAt.slice(0, 10);
    for (const [key, content] of Object.entries(data.files)) {
      const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vetharmonogram-${key}-${date}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  return (
    <>
      <WetPanelPageHeader title="Eksport danych" description="Backup CSV — bez księgowości, do archiwum lub migracji." />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Link href="/wet/panel/narzedzia" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Narzędzia
          </Link>

          <div className="rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 px-4 py-4 text-[14px] text-wet-navy-muted">
            Pobierz dane przychodni w formacie CSV (średnik). Pliki można otworzyć w Excelu lub zaimportować
            gdzie indziej. To backup informacyjny — nie faktury ani magazyn.
          </div>

          <ul className="space-y-3">
            {EXPORTS.map((item) => (
              <li
                key={item.type}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-wet-teal-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium text-wet-navy">{item.label}</p>
                  <p className="text-[13px] text-wet-navy-muted">{item.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => download(item.type)}
                  className="rounded-lg border border-wet-teal-200 px-4 py-2 text-[13px] font-medium text-wet-teal-800 hover:bg-wet-teal-50"
                >
                  Pobierz CSV
                </button>
              </li>
            ))}
          </ul>

          <button type="button" onClick={downloadAll} className="wet-btn-primary">
            Pobierz pełny backup (4 pliki)
          </button>
        </div>
      </div>
    </>
  );
}
