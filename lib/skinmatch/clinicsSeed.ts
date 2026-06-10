/**
 * Seed data and sync getters only — safe to import from client (no Prisma/DB).
 */
import type { ClinicRecord } from "./schema";

export const CLINICS_SEED: ClinicRecord[] = [
  {
    id: "czar-centrum-mocy",
    slug: "czar-centrum-mocy",
    name: "CZAR- Centrum Mocy dla Ciała i Ducha",
    city: "Kołobrzeg",
    description:
      "Jestem przekonana, że każdy człowiek jest istotą energetyczną wciąż płynącą i że dotyk jest kluczem do stymulowania procesów usuwania toksyn oraz wspierania naturalnych procesów samouzdrawiania. Choroby, depresje oraz zaburzenia w ciele postrzegam jako blokady energetyczne. Moją misją jest nie tylko łagodzenia fizycznych dolegliwości, ale także otwieranie dróg dla wewnętrznego uzdrawiania poprzez wyzwalanie energii życiowej. Moje podejście opiera się na holistycznym zrozumieniu ciała, umysłu i ducha, co pozwala mi pomagać moim klientom w osiągnięciu równowagi i harmonii na każdym poziomie.",
    treatmentIds: ["access_facelift", "access_bars", "sesja_dzwiekowa_milosc_do_siebie", "joga_na_dobranoc_dzwiek"],
    specializations: ["terapia_manualna", "dzwiekoterapia"],
    matchingTags: [],
    rating: 0,
    reviewCount: 0,
  },
  {
    id: "c1",
    slug: "odkryj-blask",
    name: "Odkryj swój blask",
    city: "Kołobrzeg",
    description:
      "Kosmetologia estetyczna dopasowana do skóry. Konsultacja, kwalifikacja i plan terapii.",
    treatmentIds: [
      "infuzja_tlenowa",
      "kwas_hialuronowy_zabieg",
      "zabiegi_lagodzace_bariera",
      "maska_algowa_chlodzaca",
      "mezoterapia_beziglowa",
    ],
    specializations: ["sucha_skora", "naczynka", "anti_aging"],
    matchingTags: ["dryness", "dehydration", "sensitivity", "redness", "antiaging"],
    rating: 4.9,
    reviewCount: 124,
    kontakt: {
      phone: "+48 123 456 789",
      bookingUrl: "/kontakt",
    },
  },
  {
    id: "c2",
    slug: "gabinet-a",
    name: "Gabinet A",
    city: "Kołobrzeg",
    description: "Kosmetyka twarzy i ciała. Terapie ukierunkowane na trądzik i przebarwienia.",
    treatmentIds: ["peeling_kawitacyjny", "peeling_chemiczny_aha_bha", "mikrodermabrazja"],
    specializations: ["tradzik", "przebarwienia"],
    matchingTags: ["acne", "pores", "blackheads", "pigmentation"],
    rating: 4.8,
    reviewCount: 88,
    kontakt: { phone: "+48 600 100 200" },
  },
  {
    id: "c3",
    slug: "gabinet-b",
    name: "Gabinet B",
    city: "Koszalin",
    description: "Anti-aging, biorewitalizacja i pielęgnacja cery dojrzałej.",
    treatmentIds: ["mezoterapia_iglowa_ha", "infuzja_tlenowa", "kwas_hialuronowy_zabieg"],
    specializations: ["anti_aging", "zmarszczki"],
    matchingTags: ["antiaging", "wrinkles", "dehydration"],
    rating: 4.7,
    reviewCount: 210,
  },
  {
    id: "c4",
    slug: "gabinet-c",
    name: "Gabinet C",
    city: "Kołobrzeg",
    description: "Skóra reaktywna i naczynkowa. Łagodne procedury, odbudowa bariery.",
    treatmentIds: ["zabiegi_lagodzace_bariera", "maska_algowa_chlodzaca", "infuzja_tlenowa"],
    specializations: ["naczynka", "sucha_skora"],
    matchingTags: ["redness", "couperose", "sensitivity", "dryness"],
    rating: 4.9,
    reviewCount: 56,
  },
  {
    id: "c5",
    slug: "gabinet-d",
    name: "Gabinet D",
    city: "Szczecin",
    description: "Oczyszczanie, pory, trądzik, regulacja sebum — podejście etapowe.",
    treatmentIds: ["peeling_kawitacyjny", "peeling_chemiczny_aha_bha"],
    specializations: ["tradzik"],
    matchingTags: ["acne", "pores", "blackheads"],
    rating: 4.6,
    reviewCount: 140,
  },
  {
    id: "c6",
    slug: "gabinet-f",
    name: "Gabinet F",
    city: "Mielno",
    description: "Nawilżenie i odbudowa bariery. Skóra sucha i wrażliwa.",
    treatmentIds: ["kwas_hialuronowy_zabieg", "infuzja_tlenowa", "mezoterapia_beziglowa"],
    specializations: ["sucha_skora"],
    matchingTags: ["dryness", "dehydration", "sensitivity"],
    rating: 4.8,
    reviewCount: 33,
  },
  {
    id: "c7",
    slug: "gabinet-g",
    name: "Gabinet G",
    city: "Koszalin",
    description: "Kompleksowe terapie: trądzik, zmarszczki, naczynka. Także sucha + reaktywna + pory.",
    treatmentIds: [
      "peeling_chemiczny_aha_bha",
      "peeling_kawitacyjny",
      "infuzja_tlenowa",
      "maska_algowa_chlodzaca",
      "mezoterapia_iglowa_ha",
      "zabiegi_lagodzace_bariera",
    ],
    specializations: ["tradzik", "zmarszczki", "naczynka", "sucha_skora"],
    matchingTags: ["acne", "pores", "blackheads", "wrinkles", "redness", "antiaging", "dryness", "sensitivity"],
    rating: 4.7,
    reviewCount: 97,
  },
];

export function getAllClinicRecords(city?: string): ClinicRecord[] {
  if (!city) return CLINICS_SEED;
  const cityLc = city.toLowerCase();
  return CLINICS_SEED.filter((c) => c.city.toLowerCase() === cityLc);
}

export function getClinicBySlug(slug: string): ClinicRecord | undefined {
  return CLINICS_SEED.find((c) => c.slug === slug);
}
