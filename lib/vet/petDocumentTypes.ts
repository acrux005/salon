export const PET_DOCUMENT_TYPES = [
  { value: "vaccination_card", label: "Książeczka zdrowia" },
  { value: "xray", label: "RTG" },
  { value: "lab_results", label: "Wyniki badań" },
  { value: "prescription", label: "Recepta" },
  { value: "other", label: "Inne" },
] as const;

export type PetDocumentType = (typeof PET_DOCUMENT_TYPES)[number]["value"];

const VALID_TYPES = new Set<string>(PET_DOCUMENT_TYPES.map((t) => t.value));

export function petDocumentTypeLabel(value: string): string {
  return PET_DOCUMENT_TYPES.find((t) => t.value === value)?.label ?? value;
}

export function normalizePetDocumentType(value: string | null | undefined): PetDocumentType {
  if (value && VALID_TYPES.has(value)) return value as PetDocumentType;
  return "other";
}

export type PetDocumentMeta = {
  fileUrl?: string;
  mimeType?: string;
  sizeBytes?: number;
};

export function parsePetDocumentMeta(extractedJson: string | null | undefined): PetDocumentMeta {
  if (!extractedJson) return {};
  try {
    const parsed = JSON.parse(extractedJson) as PetDocumentMeta;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function buildPetDocumentMeta(meta: PetDocumentMeta): string {
  return JSON.stringify(meta);
}
