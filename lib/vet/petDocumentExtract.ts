import OpenAI from "openai";
import { isDewormingEntry, normalizeBookletSection } from "@/lib/vet/deworming";
import { isEctoparasiteEntry } from "@/lib/vet/ectoparasites";
import { isTreatmentEntry } from "@/lib/vet/treatment";

export type ExtractedPetVaccination = {
  vaccineName: string;
  administeredAt: string | null;
  nextDueAt: string | null;
  batchNumber: string | null;
  vetName: string | null;
};

export type ExtractedPetDeworming = {
  productName: string;
  administeredAt: string | null;
  nextDueAt: string | null;
  vetName: string | null;
};

export type ExtractedPetEctoparasite = {
  productName: string;
  administeredAt: string | null;
  nextDueAt: string | null;
  vetName: string | null;
};

export type ExtractedPetTreatment = {
  summary: string;
  diagnosis: string | null;
  medications: string | null;
  administeredAt: string | null;
  vetName: string | null;
};

export type ExtractedPetDocument = {
  documentType: "passport" | "pedigree" | "medical" | "vaccination_card" | "other";
  bookletSection: "szczepienia" | "odrobaczanie" | "ektopasożyty" | "leczenie" | "inne" | null;
  petName: string | null;
  species: string | null;
  breed: string | null;
  sex: string | null;
  coatColor: string | null;
  birthDate: string | null;
  chipNumber: string | null;
  chipDate: string | null;
  chipManufacturer: string | null;
  ownerName: string | null;
  pedigreeNotes: string | null;
  pedigreeLines: string[];
  medicalNotes: string | null;
  vaccinations: ExtractedPetVaccination[];
  dewormings: ExtractedPetDeworming[];
  ectoparasites: ExtractedPetEctoparasite[];
  treatments: ExtractedPetTreatment[];
};

const PET_DOC_JSON_SCHEMA = `{
  "documentType": "passport | pedigree | medical | vaccination_card | other",
  "bookletSection": "szczepienia | odrobaczanie | ektopasożyty | leczenie | inne — osobne strony książeczki",
  "petName": "string lub null",
  "species": "pies | kot | inne lub null",
  "breed": "string lub null",
  "sex": "samiec | samica | nieznana lub null",
  "coatColor": "string lub null",
  "birthDate": "YYYY-MM-DD lub null",
  "chipNumber": "string lub null",
  "chipDate": "YYYY-MM-DD lub null",
  "chipManufacturer": "string lub null",
  "ownerName": "string lub null",
  "pedigreeNotes": "string — opis rodowodu lub null",
  "pedigreeLines": ["string — linie rodowodu, przodkowie"],
  "medicalNotes": "string — uwagi medyczne z dokumentu lub null",
  "vaccinations": [
    {
      "vaccineName": "string",
      "administeredAt": "YYYY-MM-DD lub null",
      "nextDueAt": "YYYY-MM-DD lub null",
      "batchNumber": "string lub null",
      "vetName": "string lub null"
    }
  ],
  "dewormings": [
    {
      "productName": "string — preparat odrobaczający (endopasożyty)",
      "administeredAt": "YYYY-MM-DD lub null",
      "nextDueAt": "YYYY-MM-DD lub null",
      "vetName": "string lub null"
    }
  ],
  "ectoparasites": [
    {
      "productName": "string — preparat przeciw pchłom/kleszczom",
      "administeredAt": "YYYY-MM-DD lub null",
      "nextDueAt": "YYYY-MM-DD lub null",
      "vetName": "string lub null"
    }
  ],
  "treatments": [
    {
      "summary": "string — opis leczenia / rozpoznania",
      "diagnosis": "string lub null",
      "medications": "string — leki, dawki lub null",
      "administeredAt": "YYYY-MM-DD lub null",
      "vetName": "string lub null"
    }
  ]
}`;

function getOpenAI(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key?.trim()) return null;
  return new OpenAI({ apiKey: key });
}

function sanitizeStr(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t || null;
}

function normalizeSpecies(value: string | null): string | null {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v.includes("pies") || v.includes("dog")) return "pies";
  if (v.includes("kot") || v.includes("cat")) return "kot";
  return "inne";
}

function normalizeSex(value: string | null): string | null {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v.includes("samiec") || v.includes("m") || v === "male") return "samiec";
  if (v.includes("samica") || v.includes("f") || v === "female") return "samica";
  return "nieznana";
}

function normalizeDocType(value: string | null): ExtractedPetDocument["documentType"] {
  if (value === "passport" || value === "pedigree" || value === "medical" || value === "vaccination_card") {
    return value;
  }
  return "other";
}

export async function extractPetDocumentFromImage(
  imageBase64: string,
  hint?: string
): Promise<ExtractedPetDocument | null> {
  const openai = getOpenAI();
  if (!openai) return null;

  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1800,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `To zdjęcie dokumentu weterynaryjnego zwierzęcia: paszport, książeczka zdrowia, karta szczepień, rodowód lub notatka z wizyty.
${hint ? `Kontekst: ${hint}.` : ""}
W książeczce są OSOBNE strony: szczepienia, odrobaczanie (endopasożyty), ektopasożyty (pchły/kleszcze), leczenie — rozpoznaj bookletSection.
Wpisy → dewormings / ectoparasites / treatments / vaccinations (tylko szczepionki).
Zwróć TYLKO poprawny JSON:
${PET_DOC_JSON_SCHEMA}
Daty w formacie YYYY-MM-DD. Pola niewidoczne ustaw na null lub pustą tablicę.`,
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ],
        },
      ],
    });

    const text = resp.choices[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(text) as Record<string, unknown>;
    const vaccinationsRaw = Array.isArray(parsed.vaccinations) ? parsed.vaccinations : [];
    const dewormingsRaw = Array.isArray(parsed.dewormings) ? parsed.dewormings : [];
    const ectoparasitesRaw = Array.isArray(parsed.ectoparasites) ? parsed.ectoparasites : [];
    const treatmentsRaw = Array.isArray(parsed.treatments) ? parsed.treatments : [];
    const pedigreeLinesRaw = Array.isArray(parsed.pedigreeLines) ? parsed.pedigreeLines : [];
    const bookletSection = normalizeBookletSection(sanitizeStr(parsed.bookletSection));

    const vaccinations: ExtractedPetVaccination[] = [];
    const dewormings: ExtractedPetDeworming[] = [];
    const ectoparasites: ExtractedPetEctoparasite[] = [];
    const treatments: ExtractedPetTreatment[] = [];

    for (const row of vaccinationsRaw) {
      const r = row as Record<string, unknown>;
      const name = sanitizeStr(r.vaccineName);
      if (!name) continue;
      if (bookletSection === "leczenie" || isTreatmentEntry(name)) {
        treatments.push({
          summary: name,
          diagnosis: sanitizeStr(r.batchNumber),
          medications: null,
          administeredAt: sanitizeStr(r.administeredAt),
          vetName: sanitizeStr(r.vetName),
        });
      } else if (bookletSection === "ektopasożyty" || isEctoparasiteEntry(name)) {
        ectoparasites.push({
          productName: name,
          administeredAt: sanitizeStr(r.administeredAt),
          nextDueAt: sanitizeStr(r.nextDueAt),
          vetName: sanitizeStr(r.vetName),
        });
      } else if (bookletSection === "odrobaczanie" || isDewormingEntry(name)) {
        dewormings.push({
          productName: name,
          administeredAt: sanitizeStr(r.administeredAt),
          nextDueAt: sanitizeStr(r.nextDueAt),
          vetName: sanitizeStr(r.vetName),
        });
      } else {
        vaccinations.push({
          vaccineName: name,
          administeredAt: sanitizeStr(r.administeredAt),
          nextDueAt: sanitizeStr(r.nextDueAt),
          batchNumber: sanitizeStr(r.batchNumber),
          vetName: sanitizeStr(r.vetName),
        });
      }
    }

    for (const row of dewormingsRaw) {
      const r = row as Record<string, unknown>;
      const name = sanitizeStr(r.productName);
      if (!name) continue;
      dewormings.push({
        productName: name,
        administeredAt: sanitizeStr(r.administeredAt),
        nextDueAt: sanitizeStr(r.nextDueAt),
        vetName: sanitizeStr(r.vetName),
      });
    }

    for (const row of ectoparasitesRaw) {
      const r = row as Record<string, unknown>;
      const name = sanitizeStr(r.productName);
      if (!name) continue;
      ectoparasites.push({
        productName: name,
        administeredAt: sanitizeStr(r.administeredAt),
        nextDueAt: sanitizeStr(r.nextDueAt),
        vetName: sanitizeStr(r.vetName),
      });
    }

    for (const row of treatmentsRaw) {
      const r = row as Record<string, unknown>;
      const summary = sanitizeStr(r.summary);
      if (!summary) continue;
      treatments.push({
        summary,
        diagnosis: sanitizeStr(r.diagnosis),
        medications: sanitizeStr(r.medications),
        administeredAt: sanitizeStr(r.administeredAt),
        vetName: sanitizeStr(r.vetName),
      });
    }

    return {
      documentType: normalizeDocType(sanitizeStr(parsed.documentType)),
      bookletSection: bookletSection === "inne" ? null : bookletSection,
      petName: sanitizeStr(parsed.petName),
      species: normalizeSpecies(sanitizeStr(parsed.species)),
      breed: sanitizeStr(parsed.breed),
      sex: normalizeSex(sanitizeStr(parsed.sex)),
      coatColor: sanitizeStr(parsed.coatColor),
      birthDate: sanitizeStr(parsed.birthDate),
      chipNumber: sanitizeStr(parsed.chipNumber),
      chipDate: sanitizeStr(parsed.chipDate),
      chipManufacturer: sanitizeStr(parsed.chipManufacturer),
      ownerName: sanitizeStr(parsed.ownerName),
      pedigreeNotes: sanitizeStr(parsed.pedigreeNotes),
      pedigreeLines: pedigreeLinesRaw
        .map((l) => (typeof l === "string" ? l.trim() : ""))
        .filter(Boolean),
      medicalNotes: sanitizeStr(parsed.medicalNotes),
      vaccinations,
      dewormings,
      ectoparasites,
      treatments,
    };
  } catch (e) {
    console.error("[petDocumentExtract]", e);
    return null;
  }
}

export function buildPedigreeJson(lines: string[], notes: string | null): string | null {
  if (lines.length === 0 && !notes) return null;
  return JSON.stringify({ lines, notes: notes ?? null });
}
