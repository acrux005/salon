/**
 * Normalizacja slugów i nazw do unikalnego identyfikatora (bez duplikatów).
 * lowercase, polskie znaki → ascii, spacje/znaki → podkreślnik, usuń podwójne.
 */

const POLISH_MAP: Record<string, string> = {
  ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z",
  Ą: "a", Ć: "c", Ę: "e", Ł: "l", Ń: "n", Ó: "o", Ś: "s", Ź: "z", Ż: "z",
};

export function normalizeSlug(raw: string): string {
  if (!raw || typeof raw !== "string") return "";
  let s = raw.trim().toLowerCase();
  s = s.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (c) => POLISH_MAP[c] ?? c);
  s = s.replace(/[^a-z0-9]+/g, "_");
  s = s.replace(/^_+|_+$/g, "");
  s = s.replace(/_+/g, "_");
  return s;
}

/**
 * Dla dopasowania zabiegu po nazwie: nazwa → slug (jak id).
 */
export function normalizeNameToSlug(name: string): string {
  return normalizeSlug(name);
}
