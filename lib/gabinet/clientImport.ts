export const GAB_CLIENT_IMPORT_HEADERS = ["imie", "telefon", "email", "sms", "email_marketing", "uwagi"] as const;

export function buildClientImportTemplateCsv(): string {
  return `${GAB_CLIENT_IMPORT_HEADERS.join(";")}\nAnna Nowak;600700800;anna@example.com;tak;tak;\n`;
}

export type ParsedClientImportRow = {
  line: number;
  name: string;
  phone: string;
  email: string | null;
  smsConsent: boolean;
  emailConsent: boolean;
  notes: string | null;
};

function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").replace(/^\+48/, "");
}

function parseBool(value: string | undefined, defaultValue: boolean): boolean {
  if (!value?.trim()) return defaultValue;
  const v = value.trim().toLowerCase();
  if (["tak", "yes", "1", "true", "t"].includes(v)) return true;
  if (["nie", "no", "0", "false", "n"].includes(v)) return false;
  return defaultValue;
}

function detectDelimiter(line: string): ";" | "," {
  return (line.match(/;/g) ?? []).length >= (line.match(/,/g) ?? []).length ? ";" : ",";
}

function parseLine(line: string, delimiter: ";" | ","): string[] {
  return line.split(delimiter).map((c) => c.trim());
}

export function parseClientImportCsv(raw: string): { rows: ParsedClientImportRow[]; errors: string[] } {
  const errors: string[] = [];
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { rows: [], errors: ["Plik jest pusty."] };

  const delimiter = detectDelimiter(lines[0]);
  let startIdx = 0;
  const first = parseLine(lines[0], delimiter).map((c) => c.toLowerCase());
  if (first[0] === "imie" || first[0] === "name") startIdx = 1;

  const rows: ParsedClientImportRow[] = [];
  for (let i = startIdx; i < lines.length; i++) {
    const cells = parseLine(lines[i], delimiter);
    const lineNum = i + 1;
    const name = cells[0]?.trim();
    const phone = cells[1]?.trim();
    if (!name || !phone) {
      errors.push(`Wiersz ${lineNum}: wymagane imię i telefon.`);
      continue;
    }
    const phoneNorm = normalizePhone(phone);
    if (phoneNorm.length < 9) {
      errors.push(`Wiersz ${lineNum} (${name}): nieprawidłowy telefon.`);
      continue;
    }
    rows.push({
      line: lineNum,
      name,
      phone: phoneNorm,
      email: cells[2]?.trim() || null,
      smsConsent: parseBool(cells[3], true),
      emailConsent: parseBool(cells[4], true),
      notes: cells[5]?.trim() || null,
    });
  }
  return { rows, errors };
}
