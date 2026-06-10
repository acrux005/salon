export const VET_PET_IMPORT_HEADERS = [
  "imie",
  "gatunek",
  "rasa",
  "data_urodzenia",
  "chip",
  "telefon_wlasciciela",
  "stado",
  "status",
  "uwagi",
  "plec",
  "umaszczenie",
  "data_chipowania",
  "producent_chipu",
] as const;

export function buildPetImportTemplateCsv(): string {
  const header = VET_PET_IMPORT_HEADERS.join(";");
  const example =
    "Burek;pies;labrador;2020-05-12;985112345678901;500600700;;active;Przyjazny pies;samiec;czarny;2020-06-01;BackHome";
  return `${header}\n${example}\n`;
}

export type ParsedPetImportRow = {
  line: number;
  name: string;
  species: string;
  breed: string | null;
  birthDate: string | null;
  chipNumber: string | null;
  ownerPhone: string;
  herdName: string | null;
  status: string;
  notes: string | null;
  sex: string | null;
  coatColor: string | null;
  chipDate: string | null;
  chipManufacturer: string | null;
};

function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").replace(/^\+48/, "");
}

function detectDelimiter(line: string): ";" | "," {
  const semicolons = (line.match(/;/g) ?? []).length;
  const commas = (line.match(/,/g) ?? []).length;
  return semicolons >= commas ? ";" : ",";
}

function parseLine(line: string, delimiter: ";" | ","): string[] {
  return line.split(delimiter).map((c) => c.trim());
}

export function parsePetImportCsv(raw: string): { rows: ParsedPetImportRow[]; errors: string[] } {
  const errors: string[] = [];
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { rows: [], errors: ["Plik jest pusty."] };
  }

  const delimiter = detectDelimiter(lines[0]);
  let startIdx = 0;
  const firstCells = parseLine(lines[0], delimiter).map((c) => c.toLowerCase());
  if (firstCells[0] === "imie" || firstCells[0] === "name") {
    startIdx = 1;
  }

  const rows: ParsedPetImportRow[] = [];

  for (let i = startIdx; i < lines.length; i++) {
    const cells = parseLine(lines[i], delimiter);
    const lineNum = i + 1;
    const name = cells[0]?.trim();
    const ownerPhone = cells[5]?.trim();

    if (!name) {
      errors.push(`Wiersz ${lineNum}: brak imienia zwierzęcia.`);
      continue;
    }
    if (!ownerPhone) {
      errors.push(`Wiersz ${lineNum} (${name}): brak telefonu właściciela.`);
      continue;
    }

    rows.push({
      line: lineNum,
      name,
      species: cells[1]?.trim() || "pies",
      breed: cells[2]?.trim() || null,
      birthDate: cells[3]?.trim() || null,
      chipNumber: cells[4]?.trim() || null,
      ownerPhone: normalizePhone(ownerPhone),
      herdName: cells[6]?.trim() || null,
      status: cells[7]?.trim() || "active",
      notes: cells[8]?.trim() || null,
      sex: cells[9]?.trim() || null,
      coatColor: cells[10]?.trim() || null,
      chipDate: cells[11]?.trim() || null,
      chipManufacturer: cells[12]?.trim() || null,
    });
  }

  return { rows, errors };
}
