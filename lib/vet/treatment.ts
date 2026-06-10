const TREATMENT_KEYWORDS = [
  "leczenie",
  "terapia",
  "rozpoznan",
  "diagnoz",
  "antybiotyk",
  "amoksycylin",
  "metronidazol",
  "enrofloksacyn",
  "doxiciklin",
  "meloksykam",
  "karprofen",
  "prednizolon",
  "kortykosteroid",
  "infuzj",
  "punkcj",
  "znieczul",
  "operacj",
  "zabieg",
  "chirurg",
  "stomatolog",
  "skaling",
  "usunięcie",
  "rana",
  "zapalenie",
];

export function isTreatmentEntry(text: string): boolean {
  const hay = text.toLowerCase();
  return TREATMENT_KEYWORDS.some((kw) => hay.includes(kw));
}

export const TREATMENT_QUICK_LABELS = [
  "Antybiotyk",
  "Przeciwzapalne",
  "Punkcja / infuzja",
  "Kontrola choroby",
  "Zabieg",
] as const;

export function buildTreatmentNotes(input: {
  summary: string;
  diagnosis?: string | null;
  medications?: string | null;
}): string {
  const parts = [input.summary.trim()];
  if (input.diagnosis?.trim()) parts.push(`Rozpoznanie: ${input.diagnosis.trim()}`);
  if (input.medications?.trim()) parts.push(`Leki / zabieg: ${input.medications.trim()}`);
  return parts.join("\n");
}
