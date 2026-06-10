/** Katalog gatunków dla przychodni weterynaryjnych w Polsce. */
export type VetSpeciesRecordType = "pet" | "herd" | "both";

export type VetSpeciesCatalogEntry = {
  value: string;
  label: string;
  category: string;
  recordType: VetSpeciesRecordType;
  exampleBreed?: string;
};

/**
 * Profil: standardowa przychodnia (małe zwierzęta + typowe stada wiejskie).
 * Bez futerkowych, dzikich, egzotów specjalistycznych i rzadkich gatunków hodowlanych.
 */
export const VET_SPECIES_CATALOG: VetSpeciesCatalogEntry[] = [
  // Towarzyszące — ~95% pacjentów typowej przychodni
  { value: "pies", label: "Pies", category: "Towarzyszące", recordType: "pet", exampleBreed: "labrador" },
  { value: "kot", label: "Kot", category: "Towarzyszące", recordType: "pet", exampleBreed: "dachowiec" },
  { value: "krolik", label: "Królik", category: "Towarzyszące", recordType: "both", exampleBreed: "miniaturka" },
  { value: "fretka", label: "Fretka", category: "Towarzyszące", recordType: "pet" },
  { value: "swinka_morska", label: "Świnka morska", category: "Towarzyszące", recordType: "pet" },
  { value: "chomik", label: "Chomik", category: "Towarzyszące", recordType: "pet" },
  { value: "szczur", label: "Szczur", category: "Towarzyszące", recordType: "pet" },

  // Ptaki domowe — spotykane w gabinetach egzotycznych / ogólnych
  { value: "papuga", label: "Papuga", category: "Ptaki", recordType: "pet", exampleBreed: "nimfa" },
  { value: "kanarek", label: "Kanarek", category: "Ptaki", recordType: "pet" },
  { value: "ptak", label: "Ptak (inny)", category: "Ptaki", recordType: "pet" },

  // Hodowlane — typowe stada i wizyty terenowe
  { value: "owca", label: "Owca", category: "Hodowlane", recordType: "herd", exampleBreed: "polska merino" },
  { value: "koza", label: "Koza", category: "Hodowlane", recordType: "herd" },
  { value: "bydlo", label: "Bydło", category: "Hodowlane", recordType: "herd" },
  { value: "krowa", label: "Krowa", category: "Hodowlane", recordType: "both", exampleBreed: "polska czarno-biała" },
  { value: "swinia", label: "Świnia", category: "Hodowlane", recordType: "both" },
  { value: "kon", label: "Koń", category: "Hodowlane", recordType: "both", exampleBreed: "huculski" },
  { value: "drob", label: "Drób", category: "Hodowlane", recordType: "herd" },
  { value: "alpaka", label: "Alpaka", category: "Hodowlane", recordType: "both", exampleBreed: "huacaya" },
  { value: "lama", label: "Lama", category: "Hodowlane", recordType: "both" },
  { value: "zolw", label: "Żółw", category: "Towarzyszące", recordType: "pet" },

  { value: "inne", label: "Inne", category: "Inne", recordType: "both" },
];

/** Etykiety dla starych kodów gatunków usuniętych z katalogu (dane w bazie). */
const LEGACY_SPECIES_LABELS: Record<string, string> = {
  mysz: "Mysz",
  szynszyla: "Szynszyla",
  golebi: "Gołąb",
  kura: "Kura",
  kaczka: "Kaczka",
  ges: "Gęś",
  indyk: "Indyk",
  przepiorka: "Przepiórka",
  zolw: "Żółw",
  waz: "Wąż",
  jaszczurka: "Jaszczurka",
  gekon: "Gekon",
  zaba: "Żaba",
  ryba: "Ryba akwariowa",
  wol: "Wół",
  cielak: "Cielę",
  prosiak: "Prosię",
  alpaka: "Alpaka",
  lama: "Lama",
  osiol: "Osioł",
  mula: "Muł",
  norka: "Norka amerykańska",
  lis: "Lis",
  jenot: "Jenot",
  nutria: "Nutria",
  tchorz: "Tchórz",
  jez: "Jeż",
  sroka: "Sroka",
  sarna: "Sarna",
  dzik: "Dzik",
  jelen: "Jeleń",
  gryzoń: "Gryzoń",
  gryzon: "Gryzoń",
};

export function catalogForPetSelect(): VetSpeciesCatalogEntry[] {
  return VET_SPECIES_CATALOG.filter((s) => s.recordType === "pet" || s.recordType === "both");
}

export function catalogForHerdSelect(): VetSpeciesCatalogEntry[] {
  return VET_SPECIES_CATALOG.filter((s) => s.recordType === "herd" || s.recordType === "both");
}

export function speciesCategories(entries: VetSpeciesCatalogEntry[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const e of entries) {
    if (!seen.has(e.category)) {
      seen.add(e.category);
      out.push(e.category);
    }
  }
  return out;
}

export function recordTypeLabel(t: VetSpeciesRecordType): string {
  if (t === "pet") return "pojedyncze";
  if (t === "herd") return "stado";
  return "pojedyncze / stado";
}

export function buildSpeciesReferenceCsv(): string {
  const header = "kategoria;gatunek;kod;typ_kartoteki;przykladowa_rasa";
  const rows = VET_SPECIES_CATALOG.map(
    (s) =>
      `${s.category};${s.label};${s.value};${recordTypeLabel(s.recordType)};${s.exampleBreed ?? ""}`
  );
  return `${header}\n${rows.join("\n")}\n`;
}

export function buildSpeciesReferenceTxt(): string {
  const lines = [
    "Lista gatunków — VetHarmonogram",
    "Profil: standardowa przychodnia (małe zwierzęta + typowe stada)",
    "",
  ];
  let cat = "";
  for (const s of VET_SPECIES_CATALOG) {
    if (s.category !== cat) {
      cat = s.category;
      lines.push(`\n## ${cat}`);
    }
    lines.push(`- ${s.label} (${s.value}) — ${recordTypeLabel(s.recordType)}`);
  }
  return lines.join("\n") + "\n";
}

export function findSpeciesLabel(value: string): string {
  return VET_SPECIES_CATALOG.find((s) => s.value === value)?.label ?? value;
}

/** Alias dla starych wartości w bazie (np. „królik” z polskim znakiem). */
const LEGACY_ALIASES: Record<string, string> = {
  królik: "krolik",
  gryzoń: "chomik",
  gryzon: "chomik",
};

export function normalizeSpeciesValue(value: string): string {
  const v = value.trim().toLowerCase();
  return LEGACY_ALIASES[v] ?? v;
}

export function findSpeciesLabelLoose(value: string): string {
  const normalized = normalizeSpeciesValue(value);
  const fromCatalog = findSpeciesLabel(normalized);
  if (fromCatalog !== normalized) return fromCatalog;
  return LEGACY_SPECIES_LABELS[normalized] ?? value;
}
