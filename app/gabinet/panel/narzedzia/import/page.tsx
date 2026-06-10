"use client";

import { useRef, useState } from "react";
import {
  importGabAppointmentsFromCsvAction,
  importGabCatalogFromCsvAction,
  importGabClientsFromCsvAction,
  importGabPatientsFromCsvAction,
} from "@/app/actions/gabinetTools";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { buildCatalogImportTemplate, parseCatalogImportCsv } from "@/lib/gabinet/catalogImport";
import { buildClientImportTemplateCsv, parseClientImportCsv } from "@/lib/gabinet/clientImport";
import { buildPatientImportTemplateCsv, parsePatientImportCsv } from "@/lib/gabinet/patientImport";
import { buildAppointmentImportTemplate, parseAppointmentImportCsv } from "@/lib/gabinet/appointmentImport";

type ImportResult = { imported: number; skipped: number; errors: string[] };
type Tab = "patients" | "clients" | "appointments" | "catalog";

export default function GabImportPage() {
  const [tab, setTab] = useState<Tab>("patients");
  const fileRef = useRef<HTMLInputElement>(null);
  const [csv, setCsv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ImportResult | null>(null);

  const preview =
    tab === "patients" && csv.trim()
      ? parsePatientImportCsv(csv)
      : tab === "clients" && csv.trim()
        ? parseClientImportCsv(csv)
        : tab === "appointments" && csv.trim()
          ? parseAppointmentImportCsv(csv)
          : tab === "catalog" && csv.trim()
            ? parseCatalogImportCsv(csv)
            : null;

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
    const content =
      tab === "patients"
        ? buildPatientImportTemplateCsv()
        : tab === "clients"
          ? buildClientImportTemplateCsv()
          : tab === "appointments"
            ? buildAppointmentImportTemplate()
            : buildCatalogImportTemplate();
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      tab === "patients"
        ? "szablon-pacjenci.csv"
        : tab === "clients"
          ? "szablon-klienci.csv"
          : tab === "appointments"
            ? "szablon-wizyty.csv"
            : "szablon-katalog.csv";
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
      tab === "patients"
        ? await importGabPatientsFromCsvAction(fd)
        : tab === "clients"
          ? await importGabClientsFromCsvAction(fd)
          : tab === "appointments"
            ? await importGabAppointmentsFromCsvAction(fd)
            : await importGabCatalogFromCsvAction(fd);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setResult({ imported: res.imported, skipped: res.skipped, errors: res.errors });
  }

  const skipLabel =
    tab === "appointments"
      ? "pominięto (duplikat terminu)"
      : tab === "catalog"
        ? "pominięto (duplikat nazwy)"
        : "zaktualizowano / pominięto (duplikat telefonu)";

  return (
    <>
      <GabPanelPageHeader title="Import CSV" description="Pacjenci, klienci, wizyty i katalog — migracja z innego systemu." />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <GabLink href="/panel/narzedzia" className="text-[14px] font-medium text-gab-sky hover:underline">
            ← Narzędzia
          </GabLink>

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["patients", "Pacjenci"],
                ["clients", "Klienci CRM"],
                ["appointments", "Wizyty"],
                ["catalog", "Katalog zabiegów"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTab(key);
                  setCsv("");
                  setResult(null);
                }}
                className={`rounded-lg px-4 py-2 text-[14px] font-medium ${tab === key ? "bg-gab-sky text-white" : "border border-slate-200"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={downloadTemplate} className="rounded-lg border border-gab-sky/30 px-4 py-2 text-[13px]">
              Pobierz szablon CSV
            </button>
            <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleFileChange} className="text-[14px]" />
          </div>

          {preview && (
            <p className="text-[14px] text-slate-600">
              Podgląd: {preview.rows.length} wierszy
              {preview.errors.length > 0 && ` · ${preview.errors.length} ostrzeżeń`}
            </p>
          )}

          <form onSubmit={handleImport} className="space-y-3">
            <textarea
              className="gab-input font-mono text-[12px]"
              rows={8}
              placeholder="Wklej CSV lub wybierz plik…"
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
            />
            {error && <p className="text-[14px] text-red-700">{error}</p>}
            {result && (
              <p className="rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">
                Zaimportowano: {result.imported}, {skipLabel}: {result.skipped}
                {result.errors.length > 0 && (
                  <span className="mt-1 block text-[12px]">{result.errors.slice(0, 5).join(" · ")}</span>
                )}
              </p>
            )}
            <button type="submit" disabled={loading || !csv.trim()} className="gab-btn-primary disabled:opacity-60">
              {loading ? "Importuję…" : "Importuj"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
