#!/usr/bin/env node
/**
 * Pobiera oficjalny XML URPL i zapisuje snapshot produktów weterynaryjnych.
 * Uruchom: node scripts/sync-urpl-vet-products.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../lib/vet/data/urpl-vet-products.json");
const META = path.join(__dirname, "../lib/vet/data/urpl-vet-products-meta.json");
const URPL_XML_URL =
  "https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/public-pl-report/6.0.0/overall.xml";

function attr(tag, name) {
  const re = new RegExp(`${name}="([^"]*)"`, "i");
  const m = tag.match(re);
  return m?.[1]?.trim() || null;
}

function parseVetProducts(xml) {
  const tagRe = /<produktLeczniczy[^>]*rodzajPreparatu="weterynaryjny"[^>]*>/gi;
  const out = [];
  let m;
  while ((m = tagRe.exec(xml)) !== null) {
    const tag = m[0];
    const name = attr(tag, "nazwaProduktu");
    const urplId = attr(tag, "id");
    if (!name || !urplId) continue;
    const commonName = attr(tag, "nazwaPowszechnieStosowana");
    const isVaccine =
      /szczepionk/i.test(commonName ?? "") ||
      /szczepionk/i.test(name) ||
      /vaccin/i.test(name);
    out.push({
      urplId,
      name,
      commonName,
      manufacturer: attr(tag, "podmiotOdpowiedzialny"),
      permitNumber: attr(tag, "numerPozwolenia"),
      pharmaceuticalForm: attr(tag, "nazwaPostaciFarmaceutycznej"),
      isVaccine,
    });
  }
  return out;
}

async function main() {
  console.log("Pobieram", URPL_XML_URL);
  const res = await fetch(URPL_XML_URL, {
    headers: { Accept: "application/xml", "User-Agent": "VetHarmonogram/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  const products = parseVetProducts(xml);
  const vaccines = products.filter((p) => p.isVaccine).length;
  const fetchedAt = new Date().toISOString();
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(products, null, 0));
  fs.writeFileSync(
    META,
    JSON.stringify({ fetchedAt, total: products.length, vaccines, source: URPL_XML_URL }, null, 2)
  );
  console.log(`Zapisano ${products.length} produktów wet. (${vaccines} szczepionek) → ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
