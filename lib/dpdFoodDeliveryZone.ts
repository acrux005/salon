/**
 * Strefa dostaw DPD Food (PL) — kody pocztowe XX-XXX.
 *
 * Źródło reguł: `data/dpd-food-postal-zone.json` (przedziały liczbowe + opcjonalnie pojedyncze kody).
 * Opcjonalnie dopina kody z env `DPD_FOOD_EXTRA_POSTAL_CODES` (CSV, pięć cyfr lub XX-XXX).
 *
 * Gdy plik nie istnieje lub ma puste `ranges` i brak extras — walidacja jest wyłączona.
 */

import fs from "fs";
import path from "path";

export type DpdFoodZoneFile = {
  /** Przedziały włącznie po wartości liczbowej kodu (np. 00-001 → 1, 05-070 → 5070). */
  ranges: [string, string][];
  /** Dodatkowe kody poza przedziałami (pięć cyfr). */
  exact?: string[];
  /** Wykluczenia (pięć cyfr), nadpisują trafienie w przedziale. */
  exclude?: string[];
};

export function normalizePlPostalTo5Digits(input: string): string | null {
  const d = input.replace(/\D/g, "");
  if (d.length === 5) return d;
  return null;
}

function postalStringToInt(s: string): number | null {
  const d = s.replace(/\D/g, "");
  if (d.length !== 5) return null;
  const n = parseInt(d, 10);
  if (!Number.isFinite(n)) return null;
  return n;
}

function splitCsv(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;\n]+/)
    .map((x) => x.trim())
    .filter(Boolean);
}

type ZoneCache = { ranges: [number, number][]; exclude: Set<number>; exact: Set<number> };

let cached: ZoneCache | null = null;

function loadZoneFile(): DpdFoodZoneFile | null {
  const p = path.join(process.cwd(), "data", "dpd-food-postal-zone.json");
  if (!fs.existsSync(p)) return null;
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw) as DpdFoodZoneFile;
  } catch {
    return null;
  }
}

function buildCache(): ZoneCache {
  const file = loadZoneFile();
  const ranges: [number, number][] = [];
  const exclude = new Set<number>();
  const exact = new Set<number>();

  if (file?.ranges?.length) {
    for (const [a, b] of file.ranges) {
      const na = postalStringToInt(a.padStart(5, "0"));
      const nb = postalStringToInt(b.padStart(5, "0"));
      if (na == null || nb == null || na > nb) continue;
      ranges.push([na, nb]);
    }
    ranges.sort((x, y) => x[0] - y[0]);
  }
  for (const e of file?.exclude ?? []) {
    const n = postalStringToInt(e);
    if (n != null) exclude.add(n);
  }
  for (const e of file?.exact ?? []) {
    const n = postalStringToInt(e);
    if (n != null) exact.add(n);
  }
  for (const chunk of splitCsv(process.env.DPD_FOOD_EXTRA_POSTAL_CODES)) {
    const n = postalStringToInt(normalizePlPostalTo5Digits(chunk) ?? chunk);
    if (n != null) exact.add(n);
  }

  return { ranges, exclude, exact };
}

export function dpdFoodZoneConfigured(): boolean {
  if (cached == null) cached = buildCache();
  return cached.ranges.length > 0 || cached.exact.size > 0;
}

function inRanges(n: number, ranges: [number, number][]): boolean {
  for (const [a, b] of ranges) {
    if (n >= a && n <= b) return true;
  }
  return false;
}

export type DpdFoodDeliveryZoneResult = { ok: true } | { ok: false; error: string };

export function evaluateDpdFoodDeliveryPostal(postalRaw: string): DpdFoodDeliveryZoneResult {
  if (cached == null) cached = buildCache();
  const { ranges, exclude, exact } = cached;
  if (ranges.length === 0 && exact.size === 0) {
    return { ok: true };
  }
  const digits = normalizePlPostalTo5Digits(postalRaw);
  if (!digits) {
    return {
      ok: false,
      error: "Podaj polski kod pocztowy w formacie XX-XXX (np. 00-950).",
    };
  }
  const n = parseInt(digits, 10);
  if (exclude.has(n)) {
    return {
      ok: false,
      error: "Ten kod pocztowy nie jest objęty dostawą DPD Food w tej konfiguracji.",
    };
  }
  if (exact.has(n) || inRanges(n, ranges)) {
    return { ok: true };
  }
  return {
    ok: false,
    error:
      "Ten kod pocztowy nie znajduje się na liście obsługiwanych dostaw DPD Food — wybierz odbiór osobisty lub inny adres.",
  };
}

export function dpdFoodZoneHint(): string {
  return (
    process.env.NEXT_PUBLIC_DPD_FOOD_ZONE_HINT?.trim() ||
    "Dostawa na adres jest możliwa tylko w obszarze DPD Food (lista kodów — sprawdź przed zamówieniem)."
  );
}

/** Reset cache (np. po testach). */
export function resetDpdFoodZoneCache(): void {
  cached = null;
}
