"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { importVetPetsFromCsvAction } from "@/app/actions/vetAnimals";
import { importVetOwnersFromCsvAction } from "@/app/actions/vetTools";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import { buildOwnerImportTemplateCsv, parseOwnerImportCsv } from "@/lib/vet/ownerImport";
import { buildPetImportTemplateCsv, parsePetImportCsv } from "@/lib/vet/petImport";

type ImportResult = { imported: number; skipped: number; errors: string[] };

export default function WetNarzedziaImportPage() {
  const [tab, setTab] = useState<"owners" | "pets">("owners");
  const fileRef = useRef<HTMLInputElement>(null);
  const [csv, setCsv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);

  const ownerPreview = tab === "owners" && csv.trim() ? parseOwnerImportCsv(csv) : null;
  const petPreview = tab === "pets" && csv.trim() ? parsePetImportCsv(csv) : null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCsv(String(reader.result ?? ""));
      setResult(null);
      setError("");
    };
    reader.readAsText(file, "UTF-8");
  }

  function downloadTemplate() {
    const content = tab === "owners" ? buildOwnerImportTemplateCsv() : buildPetImportTemplateCsv();
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = tab === "owners" ? "szablon-wlasciciele.csv" : "szablon-zwierzeta.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    const fd = new FormData();
    fd.set("csv", csv);
    const res =
      tab === "owners" ? await importVetOwnersFromCsvAction(fd) : await importVetPetsFromCsvAction(fd);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setResult({ imported: res.imported, skipped: res.skipped, errors: res.errors });
  }

  return (
    <>
      <WetPanelPageHeader
        title="Import CSV"
        description="Najpierw właściciele, potem zwierzęta — najszybszy sposób migracji z innego systemu."
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Link href="/wet/panel/narzedzia" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Narzędzia
          </Link>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setTab("owners");
                setCsv("");
                setResult(null);
                setError("");
              }}
              className={`rounded-lg px-4 py-2 text-[13px] font-medium ${
                tab === "owners" ? "bg-wet-teal text-white" : "border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Właściciele
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("pets");
                setCsv("");
                setResult(null);
                setError("");
              }}
              className={`rounded-lg px-4 py-2 text-[13px] font-medium ${
                tab === "pets" ? "bg-wet-teal text-white" : "border border-slate-200 hover:bg-slate-50"
              }`}
            >
              Zwierzęta
            </button>
          </div>

          <div className="rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 px-4 py-4 text-[14px]">
            {tab === "owners" ? (
              <>
                <p className="font-medium text-wet-teal-900">Kolumny właścicieli</p>
                <p className="mt-2 text-wet-navy-muted">
                  imie; telefon; email; sms (tak/nie); email_marketing (tak/nie); uwagi
                </p>
                <p className="mt-2 text-[13px] text-wet-navy-muted">
                  Duplikaty telefonów są pomijane. Najpierw zaimportuj właścicieli, potem zwierzęta.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium text-wet-teal-900">Kolumny zwierząt</p>
                <p className="mt-2 text-wet-navy-muted">
                  imie; gatunek; rasa; data_urodzenia; chip; telefon_wlasciciela; stado; status; uwagi…
                </p>
                <p className="mt-2 text-[13px] text-wet-navy-muted">
                  Właściciel musi istnieć (dopasowanie po telefonie). Stado — po nazwie.
                </p>
              </>
            )}
            <button type="button" onClick={downloadTemplate} className="mt-3 text-[13px] font-medium text-wet-teal hover:underline">
              Pobierz szablon CSV →
            </button>
          </div>

          <form onSubmit={handleImport} className="space-y-4">
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
            {result && (
              <div className="rounded-lg bg-green-50 px-4 py-3 text-[14px] text-green-900">
                <p className="font-medium">
                  Zaimportowano {result.imported}
                  {result.skipped > 0 ? ` · pominięto ${result.skipped}` : ""}.
                </p>
                {result.errors.length > 0 && (
                  <ul className="mt-2 max-h-32 list-disc space-y-1 overflow-y-auto pl-5 text-[13px]">
                    {result.errors.slice(0, 15).map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFileChange} className="block w-full text-[14px]" />

            <textarea
              className="wet-input font-mono text-[12px]"
              rows={10}
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              placeholder={tab === "owners" ? buildOwnerImportTemplateCsv() : buildPetImportTemplateCsv()}
            />

            {ownerPreview && ownerPreview.rows.length > 0 && (
              <p className="text-[13px] text-wet-navy-muted">Podgląd: {ownerPreview.rows.length} właścicieli</p>
            )}
            {petPreview && petPreview.rows.length > 0 && (
              <p className="text-[13px] text-wet-navy-muted">Podgląd: {petPreview.rows.length} zwierząt</p>
            )}

            <button type="submit" disabled={loading || !csv.trim()} className="wet-btn-primary disabled:opacity-60">
              {loading ? "Importuję…" : tab === "owners" ? "Importuj właścicieli" : "Importuj zwierzęta"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
