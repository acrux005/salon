#!/usr/bin/env node
/**
 * Buduje `data/dpd-food-postal-zone.json` na podstawie przedziałów zbliżonych do listy DPD Food
 * (Warszawa, aglomeracja 05, Kraków i okolice, Śląsk, Dolny Śląsk, Wielkopolska, Trójmiasto, Kujawy, Łódzkie).
 *
 * Opcjonalnie dopina kody z pliku: jedna linia = jeden kod (XX-XXX lub 5 cyfr).
 *   node scripts/build-dpd-food-zone.mjs ścieżka/do/kodów.txt
 *
 * Dokładna zgodność 1:1 z PDF od DPD: wklej pełną listę do pliku .txt i uruchom z argumentem.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outPath = path.join(root, "data", "dpd-food-postal-zone.json");

function norm5(s) {
  const d = String(s).replace(/\D/g, "");
  return d.length === 5 ? d : null;
}

/** Przedziały [min,max] liczbowo jak parseInt(5cyfr) */
const BASE_RANGES = [
  [1, 4999], // 00-001 … 04-999
  [5000, 5999], // 05-000 … 05-999 (aglomeracja / Mazowsze z listy)
  [30000, 32999], // 30-000 … 32-999 (Kraków + część okolic z listy)
  [40000, 44999], // 40-000 … 44-999 (Katowice, GOP, Gliwice, …)
  [50000, 59999], // 50-000 … 59-999 (Wrocław i okolice z listy)
  [60000, 64999], // 60-000 … 64-999 (Poznań i okolice)
  [80000, 84999], // 80-000 … 84-999 (Gdańsk, Gdynia, Sopot, okolice)
  [85000, 89999], // 85-000 … 89-999 (Bydgoszcz, Toruń, … z listy)
  [90000, 99425], // 90-000 … 99-425 (Łódź i region — górny limit wg tabeli z 99-425)
];

function mergeRanges(ranges) {
  const sorted = [...ranges].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [a, b] of sorted) {
    if (out.length === 0) {
      out.push([a, b]);
      continue;
    }
    const last = out[out.length - 1];
    if (a <= last[1] + 1) {
      last[1] = Math.max(last[1], b);
    } else {
      out.push([a, b]);
    }
  }
  return out.map(([a, b]) => [String(a).padStart(5, "0"), String(b).padStart(5, "0")]);
}

const extra = new Set();
const src = process.argv[2];
if (src && fs.existsSync(src)) {
  const text = fs.readFileSync(src, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const parts = t.split(/\s+/);
    const n = norm5(parts[0]);
    if (n) extra.add(parseInt(n, 10));
  }
}

const exactArr = [...extra].sort((a, b) => a - b).map((n) => String(n).padStart(5, "0"));

const payload = {
  ranges: mergeRanges(BASE_RANGES),
  exact: exactArr.length ? exactArr : undefined,
  exclude: [],
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 0), "utf8");
console.log("Wrote", outPath, "ranges:", payload.ranges.length, "exact:", exactArr.length);
