export const GAB_DOCUMENT_TYPES = [
  { value: "xray", label: "RTG / zdjęcie" },
  { value: "result", label: "Wynik badania" },
  { value: "referral", label: "Skierowanie" },
  { value: "other", label: "Inne" },
] as const;

export type GabDocumentType = (typeof GAB_DOCUMENT_TYPES)[number]["value"];

export function normalizeGabDocumentType(raw: string | null | undefined): GabDocumentType {
  const v = raw?.trim().toLowerCase();
  if (v === "xray" || v === "result" || v === "referral") return v;
  return "other";
}

export type GabDocumentMeta = {
  fileUrl: string;
  mimeType: string;
  sizeBytes: number;
  note?: string;
};

export function buildGabDocumentMeta(meta: GabDocumentMeta): string {
  return JSON.stringify(meta);
}

export function parseGabDocumentMeta(raw: string | null | undefined): GabDocumentMeta | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as GabDocumentMeta;
    if (parsed?.fileUrl) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}
