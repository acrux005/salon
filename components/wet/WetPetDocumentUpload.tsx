"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Trash2, Upload } from "lucide-react";
import { uploadPetDocumentAction, deletePetDocumentAction } from "@/app/actions/vetPetDocument";
import { PET_DOCUMENT_TYPES, petDocumentTypeLabel } from "@/lib/vet/petDocumentTypes";

export type PetDocumentItem = {
  id: string;
  fileName: string | null;
  documentType: string;
  fileUrl: string | null;
  mimeType: string | null;
  createdAt: string;
};

export function WetPetDocumentUpload({
  petId,
  documents,
}: {
  petId: string;
  documents: PetDocumentItem[];
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [documentType, setDocumentType] = useState<string>("vaccination_card");
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setSuccess("");
    setLoading(true);
    const fd = new FormData();
    fd.set("petId", petId);
    fd.set("documentType", documentType);
    fd.set("file", file);
    const res = await uploadPetDocumentAction(fd);
    setLoading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSuccess("Dokument zapisany przy zwierzęciu.");
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Usunąć ten dokument?")) return;
    setDeletingId(id);
    setError("");
    const res = await deletePetDocumentAction(id);
    setDeletingId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-[13px] text-green-800">{success}</p>}

      <div className="rounded-xl border border-dashed border-wet-teal-200 bg-wet-teal-50/20 p-4">
        <p className="text-[14px] font-medium text-wet-navy">Dodaj dokument</p>
        <p className="mt-0.5 text-[12px] text-wet-navy-muted">PDF, JPG lub PNG · maks. 10 MB</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            className="wet-input max-w-[200px] text-[13px]"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          >
            {PET_DOCUMENT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={loading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg bg-wet-teal px-4 py-2 text-[13px] font-medium text-white hover:bg-teal-700 disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {loading ? "Zapisuję…" : "Wybierz plik"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,application/pdf,image/jpeg,image/png"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      {documents.length === 0 ? (
        <p className="text-center text-[13px] text-wet-navy-muted py-4">
          Brak plików — książeczki, RTG i wyniki badań możesz trzymać tutaj zamiast na pulpicie.
        </p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-wet-teal-100 bg-white px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-wet-teal-50 text-wet-teal">
                  <FileText className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  {doc.fileUrl ? (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate font-medium text-wet-teal hover:underline"
                    >
                      {doc.fileName ?? "Dokument"}
                    </a>
                  ) : (
                    <p className="truncate font-medium text-wet-navy">{doc.fileName ?? "Dokument"}</p>
                  )}
                  <p className="text-[12px] text-wet-navy-muted">
                    {petDocumentTypeLabel(doc.documentType)} ·{" "}
                    {new Date(doc.createdAt).toLocaleDateString("pl-PL")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={deletingId === doc.id}
                onClick={() => handleDelete(doc.id)}
                className="inline-flex items-center gap-1 text-[12px] text-red-600 hover:underline disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Usuń
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
