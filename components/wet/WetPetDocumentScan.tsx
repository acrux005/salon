"use client";

import { useRef, useState } from "react";
import { Camera, Sparkles } from "lucide-react";
import type { ExtractedPetDocument } from "@/lib/vet/petDocumentExtract";

type Props = {
  onDecoded: (data: ExtractedPetDocument) => void;
  hint?: string;
  variant?: "default" | "feature";
};

export function WetPetDocumentScan({ onDecoded, hint, variant = "default" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | null) {
    if (!file) return;
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("image", file);
      if (hint) fd.set("hint", hint);
      const res = await fetch("/api/wet/pets/extract-document", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Nie udało się odczytać dokumentu.");
        return;
      }
      onDecoded(data.fields as ExtractedPetDocument);
    } catch {
      setError("Błąd połączenia z serwerem.");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (variant === "feature") {
    return (
      <div className="overflow-hidden rounded-2xl border border-wet-teal-200 bg-gradient-to-br from-wet-teal-50 via-white to-slate-50 shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-wet-teal text-2xl text-white shadow-md shadow-wet-teal/25">
              📷
            </span>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-wet-navy">Skanuj książeczkę zdrowia lub paszport</p>
                <Sparkles className="h-4 w-4 text-wet-teal" aria-hidden />
              </div>
              <ul className="mt-2 space-y-0.5 text-[13px] text-wet-navy-muted">
                <li>Wykrywa chip, daty i szczepienia ze zdjęcia</li>
                <li>Ty akceptujesz — nic nie zapisuje się samo</li>
              </ul>
            </div>
          </div>
          <button
            type="button"
            disabled={loading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-wet-teal px-5 py-3 text-[14px] font-semibold text-white shadow-md shadow-wet-teal/25 hover:bg-teal-700 disabled:opacity-60"
          >
            <Camera className="h-4 w-4" />
            {loading ? "Czytam dokument…" : "Skanuj dokument"}
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {error && (
          <p className="border-t border-wet-teal-100 bg-red-50 px-5 py-3 text-[13px] text-red-700" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-wet-teal-300 bg-wet-teal-50/40 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold text-wet-navy">Skan dokumentu (AI)</p>
          <p className="mt-1 text-[12px] text-wet-navy-muted">
            Zrób zdjęcie paszportu, karty szczepień, rodowodu lub notatki z wizyty — system odczyta dane.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-wet-teal-200 bg-white px-3 py-2 text-[13px] font-medium text-wet-teal-800 hover:bg-wet-teal-50 disabled:opacity-60"
        >
          <Camera className="h-4 w-4" />
          {loading ? "Czytam…" : "Skanuj dokument"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {error && (
        <p className="mt-3 text-[13px] text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function applyExtractedPetToForm(
  data: ExtractedPetDocument,
  setForm: (updater: (prev: Record<string, string>) => Record<string, string>) => void
) {
  setForm((p) => ({
    ...p,
    ...(data.petName ? { name: data.petName } : {}),
    ...(data.species ? { species: data.species } : {}),
    ...(data.breed ? { breed: data.breed } : {}),
    ...(data.sex ? { sex: data.sex } : {}),
    ...(data.coatColor ? { coatColor: data.coatColor } : {}),
    ...(data.birthDate ? { birthDate: data.birthDate } : {}),
    ...(data.chipNumber ? { chipNumber: data.chipNumber } : {}),
    ...(data.chipDate ? { chipDate: data.chipDate } : {}),
    ...(data.chipManufacturer ? { chipManufacturer: data.chipManufacturer } : {}),
    ...(data.pedigreeNotes || data.pedigreeLines.length
      ? {
          pedigreeNotes: [data.pedigreeNotes, ...data.pedigreeLines].filter(Boolean).join("\n"),
          pedigreeLines: data.pedigreeLines.join("\n"),
        }
      : {}),
    ...(data.medicalNotes
      ? { notes: p.notes ? `${p.notes}\n${data.medicalNotes}` : data.medicalNotes }
      : {}),
  }));
}
