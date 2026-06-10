"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateGabPatientAction, archiveGabPatientAction } from "@/app/actions/gabinet";
import {
  deleteGabPatientDocumentAction,
  linkGabPatientAccountAction,
  uploadGabPatientDocumentAction,
} from "@/app/actions/gabinetSettings";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { GAB_DOCUMENT_TYPES, parseGabDocumentMeta } from "@/lib/gabinet/patientDocumentTypes";
import type { GabPatientRow } from "@/lib/gabinet/prismaGab";

type DocRow = {
  id: string;
  documentType: string;
  fileName: string | null;
  extractedJson: string | null;
  createdAt: Date;
};

export function GabPacjentDetailClient({
  patient,
  documents,
  linkedAccountEmail,
}: {
  patient: GabPatientRow;
  documents: DocRow[];
  linkedAccountEmail: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [linkEmail, setLinkEmail] = useState(patient.email ?? "");
  const [docType, setDocType] = useState("xray");
  const [form, setForm] = useState({
    name: patient.name,
    phone: patient.phone,
    email: patient.email ?? "",
    pesel: patient.pesel ?? "",
    notes: patient.notes ?? "",
    smsConsent: patient.smsConsent ?? true,
    emailConsent: patient.emailConsent ?? true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMsg("");
    setLoading(true);
    const fd = new FormData();
    fd.set("id", patient.id);
    Object.entries(form).forEach(([k, v]) => fd.set(k, typeof v === "boolean" ? (v ? "true" : "false") : String(v)));
    const result = await updateGabPatientAction(fd);
    setLoading(false);
    if (result.ok) {
      setMsg("Zapisano.");
      router.refresh();
      return;
    }
    setError(result.error);
  }

  async function linkAccount(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setError("");
    const res = await linkGabPatientAccountAction(patient.id, linkEmail);
    if (!res.ok) setError(res.error);
    else {
      setMsg("Powiązano konto portalu.");
      router.refresh();
    }
  }

  async function uploadDoc(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.set("patientId", patient.id);
    fd.set("documentType", docType);
    const res = await uploadGabPatientDocumentAction(fd);
    if (!res.ok) setError(res.error);
    else router.refresh();
  }

  async function removeDoc(id: string) {
    if (!confirm("Usunąć dokument?")) return;
    await deleteGabPatientDocumentAction(id);
    router.refresh();
  }

  return (
    <>
      <GabPanelPageHeader title={patient.name} description="Karta pacjenta, dokumenty i portal." />
      <div className="px-4 py-6 lg:px-8">
        <GabLink href="/panel/pacjenci/lista" className="text-[14px] font-medium text-gab-sky hover:underline">
          ← Lista pacjentów
        </GabLink>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gab-sky/15 bg-white p-4">
            <h2 className="font-semibold text-gab-navy">Dane pacjenta</h2>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
            {msg && <p className="rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">{msg}</p>}
            <input className="gab-input" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="gab-input" required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
              <input type="email" className="gab-input" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <input className="gab-input" value={form.pesel} onChange={(e) => setForm((p) => ({ ...p, pesel: e.target.value }))} placeholder="PESEL" />
            <textarea className="gab-input" rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            <div className="flex flex-wrap gap-4 text-[14px]">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.smsConsent} onChange={(e) => setForm((p) => ({ ...p, smsConsent: e.target.checked }))} />
                Zgoda SMS
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.emailConsent} onChange={(e) => setForm((p) => ({ ...p, emailConsent: e.target.checked }))} />
                Zgoda e-mail
              </label>
            </div>
            <button type="submit" disabled={loading} className="gab-btn-primary disabled:opacity-60">
              Zapisz zmiany
            </button>
            {patient.status !== "archived" && (
              <button
                type="button"
                onClick={async () => {
                  if (!confirm("Zarchiwizować pacjenta?")) return;
                  await archiveGabPatientAction(patient.id);
                  router.push("/gabinet/panel/pacjenci/lista");
                }}
                className="text-[14px] text-red-600 hover:underline"
              >
                Archiwizuj pacjenta
              </button>
            )}
          </form>

          <div className="space-y-4">
            <form onSubmit={linkAccount} className="rounded-xl border border-gab-sky/15 bg-white p-4">
              <h2 className="font-semibold text-gab-navy">Portal pacjenta</h2>
              <p className="mt-1 text-[13px] text-slate-500">
                {linkedAccountEmail
                  ? `Powiązane konto: ${linkedAccountEmail}`
                  : "Powiąż konto pacjenta po e-mailu rejestracji w portalu."}
              </p>
              <input type="email" className="gab-input mt-3" placeholder="E-mail konta pacjenta" value={linkEmail} onChange={(e) => setLinkEmail(e.target.value)} />
              <button type="submit" className="mt-3 text-[14px] font-medium text-gab-sky hover:underline">
                Powiąż konto
              </button>
            </form>

            <section className="rounded-xl border border-gab-sky/15 bg-white p-4">
              <h2 className="font-semibold text-gab-navy">Dokumenty (RTG, wyniki)</h2>
              <ul className="mt-3 space-y-2">
                {documents.map((d) => {
                  const meta = parseGabDocumentMeta(d.extractedJson);
                  const label = GAB_DOCUMENT_TYPES.find((t) => t.value === d.documentType)?.label ?? d.documentType;
                  return (
                    <li key={d.id} className="flex justify-between gap-2 text-[14px]">
                      <span>
                        {label} — {d.fileName ?? "plik"}
                        {meta?.fileUrl && (
                          <>
                            {" · "}
                            <a href={meta.fileUrl} target="_blank" rel="noreferrer" className="text-gab-sky hover:underline">
                              Pobierz
                            </a>
                          </>
                        )}
                      </span>
                      <button type="button" onClick={() => removeDoc(d.id)} className="text-red-600 hover:underline">
                        Usuń
                      </button>
                    </li>
                  );
                })}
                {documents.length === 0 && <li className="text-slate-500">Brak dokumentów.</li>}
              </ul>
              <form onSubmit={uploadDoc} className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <select className="gab-input" value={docType} onChange={(e) => setDocType(e.target.value)}>
                  {GAB_DOCUMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" required className="text-[14px]" />
                <button type="submit" className="gab-btn-primary w-full">
                  Dodaj dokument
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
