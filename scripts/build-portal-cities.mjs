/**
 * Generuje content/portalCitiesAll.json z pakietu polish-cities + ręcznych odmian.
 * Uruchom: node scripts/build-portal-cities.mjs
 */
import { writeFileSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const polishCities = require("polish-cities/data/city.json").city;

/** Ręczne wpisy [nazwa, slug, miejscownik] — priorytet przy kolizjach. */
const manualRaw = readFileSync(join(root, "content/portalCitiesData.ts"), "utf8");
const manualTuples = [...manualRaw.matchAll(/\[\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"\s*\]/g)].map(
  (m) => ({ name: m[1], slug: m[2], locative: m[3] })
);
const manualByName = new Map(manualTuples.map((c) => [c.name, c]));
const manualBySlug = new Map(manualTuples.map((c) => [c.slug, c]));

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const nameCount = new Map();
for (const c of polishCities) {
  nameCount.set(c.name, (nameCount.get(c.name) ?? 0) + 1);
}

const built = [];
const usedSlugs = new Set();

for (const c of polishCities) {
  const manual = manualByName.get(c.name);
  let slug = manual?.slug ?? slugify(c.name);
  if ((nameCount.get(c.name) ?? 0) > 1 && !manual) {
    slug = `${slug}-${(c.county_code ?? "").replace(/-/g, "").toLowerCase()}`;
  }
  if (usedSlugs.has(slug)) {
    slug = `${slug}-${(c.county_code ?? "x").replace(/-/g, "").toLowerCase()}`;
  }
  usedSlugs.add(slug);

  built.push({
    name: c.name,
    slug,
    locative: manual?.locative ?? c.name,
    locativeManual: Boolean(manual),
    radius: c.radius ?? 0,
    countyCode: c.county_code ?? null,
  });
}

// Upewnij się, że ręczne miasta są w zbiorze (gdyby brakowało w polish-cities)
for (const m of manualTuples) {
  if (!built.some((b) => b.slug === m.slug)) {
    built.unshift({
      name: m.name,
      slug: m.slug,
      locative: m.locative,
      locativeManual: true,
      radius: 999,
      countyCode: null,
    });
  }
}

built.sort((a, b) => a.name.localeCompare(b.name, "pl"));

const manualSlugs = new Set(manualTuples.map((m) => m.slug));
const extraForTop = built
  .filter((c) => !manualSlugs.has(c.slug))
  .sort((a, b) => b.radius - a.radius)
  .slice(0, Math.max(0, 200 - manualSlugs.size))
  .map((c) => c.slug);

const topMarketingSlugs = [...manualSlugs, ...extraForTop].slice(0, 200);

const out = {
  generatedAt: new Date().toISOString(),
  total: built.length,
  topMarketingCount: topMarketingSlugs.length,
  cities: built,
  topMarketingSlugs,
};

writeFileSync(join(root, "content/portalCitiesAll.json"), JSON.stringify(out, null, 0));
console.log(`Zapisano ${built.length} miast, top marketing: ${topMarketingSlugs.length}`);
