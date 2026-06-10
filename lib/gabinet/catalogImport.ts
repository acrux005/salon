/** CSV import katalogu: nazwa;kategoria;cena;minuty;aktywny */
export type GabCatalogImportRow = {
  line: number;
  name: string;
  category: string;
  pricePln: number;
  durationMinutes: number;
  active: boolean;
};

export function parseCatalogImportCsv(raw: string): { rows: GabCatalogImportRow[]; errors: string[] } {
  const errors: string[] = [];
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { rows: [], errors: ["Pusty plik."] };

  const header = lines[0].toLowerCase();
  const startIdx = header.includes("nazwa") || header.includes("name") ? 1 : 0;
  const sep = lines[startIdx]?.includes(";") ? ";" : ",";
  const rows: GabCatalogImportRow[] = [];

  for (let i = startIdx; i < lines.length; i++) {
    const parts = lines[i].split(sep).map((p) => p.trim());
    if (parts.length < 1 || !parts[0]) {
      errors.push(`Wiersz ${i + 1}: brak nazwy.`);
      continue;
    }
    const [name, category = "general", priceStr = "0", durStr = "30", activeStr = "tak"] = parts;
    const pricePln = parseFloat(priceStr.replace(",", "."));
    const durationMinutes = parseInt(durStr, 10);
    const active = !/^nie|false|0$/i.test(activeStr);
    rows.push({
      line: i + 1,
      name,
      category,
      pricePln: Number.isNaN(pricePln) ? 0 : pricePln,
      durationMinutes: Number.isNaN(durationMinutes) ? 30 : durationMinutes,
      active,
    });
  }
  return { rows, errors };
}

export function buildCatalogImportTemplate(): string {
  return "nazwa;kategoria;cena;minuty;aktywny\nKonsultacja;general;150;30;tak\n";
}
