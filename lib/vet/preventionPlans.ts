/**
 * Plany profilaktyki — wytyczne WSAVA / PIWet / obowiązki prawne PL.
 * Gabinet może dostosować plan indywidualnie; to punkt wyjścia, nie zastępuje decyzji lekarza.
 */

import { PREVENTION_PLANS_EXTRA, SPECIES_PREVENTION_PLAN_ID } from "@/lib/vet/preventionPlansSpecies";
import { normalizeSpeciesValue } from "@/lib/vet/speciesCatalog";

export type PreventionPriority = "obowiazkowe" | "zalecane" | "opcjonalne";
export type PreventionKind = "szczepienie" | "odrobaczanie" | "badanie" | "kontrola" | "profilaktyka";
export type PreventionLifeStage = "szczenię" | "kocię" | "młody" | "dorosły" | "senior";

export type PreventionPlanItem = {
  key: string;
  kind: PreventionKind;
  title: string;
  description: string;
  priority: PreventionPriority;
  source: string;
  lifeStage: PreventionLifeStage[];
  /** Tygodnie od urodzenia — pierwsza dawka serii lub jednorazowy termin */
  doseWeeks?: number[];
  /** Po serii / pierwszej dawce — powtarzaj co N dni */
  repeatIntervalDays?: number;
  /** Pokaż dopiero od wieku (tygodnie) */
  minAgeWeeks?: number;
  /** Ukryj po przekroczeniu wieku (tygodnie) — np. tylko szczenię */
  maxAgeWeeks?: number;
  /** Tylko u kotów wychodzących (np. pchły, FeLV, wścieklizna) */
  outdoorOnly?: boolean;
  /** Dopasowanie nazwy szczepionki / pozycji katalogu */
  matchKeywords: string[];
};

export type PreventionPlanTemplate = {
  id: string;
  species: string;
  label: string;
  summary: string;
  sources: string[];
  items: PreventionPlanItem[];
};

const WSAVA = "WSAVA Guidelines for the Vaccination of Dogs and Cats (2022)";
const PIWET = "PIWet — wytyczne profilaktyki małych zwierząt";
const PRAWO_WSCIEKLIZNA = "Rozporządzenie Min. Rolnictwa — zwalczanie wścieklizny (szczepienie obowiązkowe psów)";

export const PREVENTION_PLANS: PreventionPlanTemplate[] = [
  {
    id: "pies_standard",
    species: "pies",
    label: "Pies — plan standardowy",
    summary:
      "Profilaktyka psa towarzyszącego: odrobaczanie, szczepienia podstawowe (DHPPi/DHP), leptospiroza, wścieklizna, kontrole i badania okresowe.",
    sources: [WSAVA, PIWET, PRAWO_WSCIEKLIZNA],
    items: [
      {
        key: "pies_deworm_puppy",
        kind: "odrobaczanie",
        title: "Odrobaczanie szczenięcia",
        description: "Co 2 tygodnie od 2. do 12. tygodnia życia, potem co 3 miesiące (lub według ryzyka).",
        priority: "zalecane",
        source: WSAVA,
        lifeStage: ["szczenię"],
        doseWeeks: [2, 4, 6, 8, 10, 12],
        maxAgeWeeks: 16,
        matchKeywords: ["odrobacz", "endoparazyt", "helmint", "pyrantel", "fenbendazol", "milbemycin"],
      },
      {
        key: "pies_deworm_adult",
        kind: "odrobaczanie",
        title: "Odrobaczanie dorosłego psa",
        description: "Co 3 miesiące (aktywny/outdoor) lub co 6–12 miesięcy (domowy).",
        priority: "zalecane",
        source: PIWET,
        lifeStage: ["dorosły", "senior"],
        minAgeWeeks: 26,
        repeatIntervalDays: 90,
        matchKeywords: ["odrobacz", "endoparazyt", "helmint"],
      },
      {
        key: "pies_combo_series",
        kind: "szczepienie",
        title: "Szczepienie podstawowe (DHPPi / DHP+PI)",
        description: "Nosówka, parwowiroza, hepatitis, parainfluenza — seria 3 dawek w 8., 12. i 16. tygodniu.",
        priority: "zalecane",
        source: WSAVA,
        lifeStage: ["szczenię", "młody"],
        doseWeeks: [8, 12, 16],
        repeatIntervalDays: 1095,
        matchKeywords: [
          "dhppi",
          "dhpp",
          "dhp",
          "dhp+pi",
          "nobivac dh",
          "eurican dh",
          "nobivac puppy",
          "nosówk",
          "parvo",
          "hepatitis",
          "distemper",
          "combi",
        ],
      },
      {
        key: "pies_lepto",
        kind: "szczepienie",
        title: "Leptospiroza (L4)",
        description: "Seria 2 dawek w odstępie 2–4 tygodni (12. i 16. tydzień), potem co rok.",
        priority: "zalecane",
        source: WSAVA,
        lifeStage: ["szczenię", "młody", "dorosły"],
        doseWeeks: [12, 16],
        repeatIntervalDays: 365,
        matchKeywords: ["lepto", "leptospir", "l4", "nobivac lepto", "canigen lepto"],
      },
      {
        key: "pies_rabies",
        kind: "szczepienie",
        title: "Wścieklizna (obowiązkowa u psów)",
        description: "Pierwsze szczepienie po ukończeniu 12. tygodnia (3. miesiąc), następnie co rok.",
        priority: "obowiazkowe",
        source: PRAWO_WSCIEKLIZNA,
        lifeStage: ["szczenię", "młody", "dorosły", "senior"],
        doseWeeks: [12],
        repeatIntervalDays: 365,
        matchKeywords: ["wścieklizn", "wscieklizn", "rabies", "rage", "rabigen", "nobivac rabies"],
      },
      {
        key: "pies_kennel",
        kind: "szczepienie",
        title: "Kaszoch (Bordetella) / choroby oddechowe",
        description: "Zalecane przed hotelami, wystawami, parkami — co 6–12 miesięcy.",
        priority: "opcjonalne",
        source: WSAVA,
        lifeStage: ["młody", "dorosły"],
        minAgeWeeks: 16,
        repeatIntervalDays: 365,
        matchKeywords: ["kaszoch", "bordetella", "pi3", "kennel", "nobivac kc"],
      },
      {
        key: "pies_borrelia",
        kind: "szczepienie",
        title: "Borelioza (kleszcze)",
        description: "W obszarach endemicznych — seria 2 dawek, potem co rok (rozważ z badaniem).",
        priority: "opcjonalne",
        source: PIWET,
        lifeStage: ["dorosły"],
        minAgeWeeks: 52,
        repeatIntervalDays: 365,
        matchKeywords: ["boreli", "lyme", "canigen bor"],
      },
      {
        key: "pies_flea_tick",
        kind: "profilaktyka",
        title: "Profilaktyka pchły i kleszczy",
        description: "Preparat owado-bójczy przez cały sezon (co 4–12 tygodni).",
        priority: "zalecane",
        source: PIWET,
        lifeStage: ["szczenię", "młody", "dorosły", "senior"],
        minAgeWeeks: 8,
        repeatIntervalDays: 90,
        matchKeywords: ["pchł", "kleszcz", "frontline", "bravecto", "simparica", "nexgard", "spot-on"],
      },
      {
        key: "pies_exam_puppy",
        kind: "kontrola",
        title: "Kontrola szczenięcia przy szczepieniu",
        description: "Badanie kliniczne, waga, pasożyty, rozwój — przy każdej wizycie szczepieniowej.",
        priority: "zalecane",
        source: PIWET,
        lifeStage: ["szczenię"],
        doseWeeks: [8, 12, 16],
        maxAgeWeeks: 20,
        matchKeywords: ["kontrola szczeni", "badanie szczeni"],
      },
      {
        key: "pies_exam_annual",
        kind: "badanie",
        title: "Coroczne badanie profilaktyczne",
        description: "Badanie ogólne, ocena wagi, zębów, stawów, dyskusja o diecie i szczepieniach.",
        priority: "zalecane",
        source: WSAVA,
        lifeStage: ["dorosły", "senior"],
        minAgeWeeks: 52,
        repeatIntervalDays: 365,
        matchKeywords: ["badanie profilaktyczne", "badanie ogólne", "kontrola roczna", "wellness"],
      },
      {
        key: "pies_blood_senior",
        kind: "badanie",
        title: "Morfologia / biochemia (senior)",
        description: "Od 7. roku życia — profil krwi co 6–12 miesięcy.",
        priority: "zalecane",
        source: WSAVA,
        lifeStage: ["senior"],
        minAgeWeeks: 364,
        repeatIntervalDays: 365,
        matchKeywords: ["morfolog", "biochem", "badanie krwi", "profil geriatryczny"],
      },
      {
        key: "pies_heartworm",
        kind: "badanie",
        title: "Diagnostyka dirofilarii (robaczy serca)",
        description: "Test antygenowy co rok, zwłaszcza u psów podróżujących lub z południa PL.",
        priority: "opcjonalne",
        source: WSAVA,
        lifeStage: ["dorosły", "senior"],
        minAgeWeeks: 26,
        repeatIntervalDays: 365,
        matchKeywords: ["dirofilari", "robacz serca", "heartworm", "dhp test"],
      },
      {
        key: "pies_dental",
        kind: "profilaktyka",
        title: "Profilaktyka stomatologiczna",
        description: "Kontrola uzębienia co 6–12 miesięcy; skaling według potrzeb.",
        priority: "zalecane",
        source: PIWET,
        lifeStage: ["dorosły", "senior"],
        minAgeWeeks: 52,
        repeatIntervalDays: 365,
        matchKeywords: ["stomatolog", "skaling", "uzębien", "dent", "zęb"],
      },
    ],
  },
  {
    id: "kot_standard",
    species: "kot",
    label: "Kot — plan standardowy",
    summary:
      "Profilaktyka kota: odrobaczanie, szczepienia FVRCP, wścieklizna (gdy wychodzi / wymogi prawne), badania FIV/FeLV, kontrole okresowe.",
    sources: [WSAVA, PIWET],
    items: [
      {
        key: "kot_deworm_puppy",
        kind: "odrobaczanie",
        title: "Odrobaczanie kocięcia",
        description: "Co 2 tygodnie od 3. do 12. tygodnia życia.",
        priority: "zalecane",
        source: WSAVA,
        lifeStage: ["kocię"],
        doseWeeks: [3, 5, 7, 9, 11],
        maxAgeWeeks: 16,
        matchKeywords: ["odrobacz", "endoparazyt", "helmint", "pyrantel", "fenbendazol", "milbemycin"],
      },
      {
        key: "kot_deworm_adult",
        kind: "odrobaczanie",
        title: "Odrobaczanie dorosłego kota",
        description: "Koty wychodzące co 3 miesiące; domowe co 6–12 miesięcy.",
        priority: "zalecane",
        source: PIWET,
        lifeStage: ["dorosły", "senior"],
        minAgeWeeks: 26,
        repeatIntervalDays: 90,
        matchKeywords: ["odrobacz", "endoparazyt", "helmint"],
      },
      {
        key: "kot_fvrcp_series",
        kind: "szczepienie",
        title: "Szczepienie FVRCP ( herpes, calici, panleukopenia )",
        description: "Seria 3 dawek w 8., 12. i 16. tygodniu; booster co 1–3 lata.",
        priority: "zalecane",
        source: WSAVA,
        lifeStage: ["kocię", "młody"],
        doseWeeks: [8, 12, 16],
        repeatIntervalDays: 1095,
        matchKeywords: [
          "fvrcp",
          "purevax rcp",
          "felocell",
          "nobivac feline",
          "tricat",
          "panleukopen",
          "calici",
          "herpes",
          "rcp",
        ],
      },
      {
        key: "kot_rabies",
        kind: "szczepienie",
        title: "Wścieklizna",
        description: "Obowiązkowa przy podróżach / rejestracji; zalecana u kotów wychodzących — co rok.",
        priority: "zalecane",
        source: PRAWO_WSCIEKLIZNA,
        lifeStage: ["kocię", "młody", "dorosły", "senior"],
        doseWeeks: [12],
        repeatIntervalDays: 365,
        outdoorOnly: true,
        matchKeywords: ["wścieklizn", "wscieklizn", "rabies", "rage", "purevax rabies", "rabigen"],
      },
      {
        key: "kot_fiv_felv",
        kind: "badanie",
        title: "Test FIV / FeLV",
        description: "Przed pierwszym szczepieniem lub przy adopcji — wykrycie wirusa immunodeficjencji i białaczki.",
        priority: "zalecane",
        source: WSAVA,
        lifeStage: ["kocię", "młody"],
        doseWeeks: [8],
        maxAgeWeeks: 52,
        matchKeywords: ["fiv", "felv", "snap felv", "combo test", "wirus immunodeficjencji", "białaczka"],
      },
      {
        key: "kot_flea_tick",
        kind: "profilaktyka",
        title: "Profilaktyka pchły i kleszczy",
        description: "Szczególnie u kotów wychodzących — przez cały sezon.",
        priority: "zalecane",
        source: PIWET,
        lifeStage: ["kocię", "młody", "dorosły", "senior"],
        minAgeWeeks: 8,
        repeatIntervalDays: 90,
        outdoorOnly: true,
        matchKeywords: ["pchł", "kleszcz", "frontline", "bravecto", "spot-on", "pipeta"],
      },
      {
        key: "kot_exam_kitten",
        kind: "kontrola",
        title: "Kontrola kocięcia przy szczepieniu",
        description: "Badanie kliniczne, waga, ocena odrobaczenia.",
        priority: "zalecane",
        source: PIWET,
        lifeStage: ["kocię"],
        doseWeeks: [8, 12, 16],
        maxAgeWeeks: 20,
        matchKeywords: ["kontrola koci", "badanie koci"],
      },
      {
        key: "kot_exam_annual",
        kind: "badanie",
        title: "Coroczne badanie profilaktyczne",
        description: "Badanie ogólne, ocena masy, zębów, dyskusja o szczepieniach i diecie.",
        priority: "zalecane",
        source: WSAVA,
        lifeStage: ["dorosły", "senior"],
        minAgeWeeks: 52,
        repeatIntervalDays: 365,
        matchKeywords: ["badanie profilaktyczne", "badanie ogólne", "kontrola roczna", "wellness"],
      },
      {
        key: "kot_blood_senior",
        kind: "badanie",
        title: "Morfologia / biochemia (senior)",
        description: "Od 7. roku życia — profil krwi co 6–12 miesięcy (wcześniej u ras predysponowanych).",
        priority: "zalecane",
        source: WSAVA,
        lifeStage: ["senior"],
        minAgeWeeks: 364,
        repeatIntervalDays: 365,
        matchKeywords: ["morfolog", "biochem", "badanie krwi", "profil geriatryczny"],
      },
      {
        key: "kot_dental",
        kind: "profilaktyka",
        title: "Profilaktyka stomatologiczna",
        description: "Kontrola uzębienia co 6–12 miesięcy; choroba przyzębia u kotów bardzo częsta.",
        priority: "zalecane",
        source: PIWET,
        lifeStage: ["dorosły", "senior"],
        minAgeWeeks: 52,
        repeatIntervalDays: 365,
        matchKeywords: ["stomatolog", "skaling", "uzębien", "dent", "zęb"],
      },
      {
        key: "kot_feLV_vaccine",
        kind: "szczepienie",
        title: "Szczepienie przeciw FeLV",
        description: "Koty wychodzące i młode — seria 2 dawek, potem co rok (po negatywnym teście).",
        priority: "opcjonalne",
        source: WSAVA,
        lifeStage: ["kocię", "młody", "dorosły"],
        minAgeWeeks: 8,
        doseWeeks: [8, 12],
        repeatIntervalDays: 365,
        outdoorOnly: true,
        matchKeywords: ["felv", "leukemia", "leukem", "purevax felv", "nobivac felv"],
      },
    ],
  },
  ...PREVENTION_PLANS_EXTRA,
];

export const PREVENTION_KIND_LABELS: Record<PreventionKind, string> = {
  szczepienie: "Szczepienie",
  odrobaczanie: "Odrobaczanie",
  badanie: "Badanie",
  kontrola: "Kontrola",
  profilaktyka: "Profilaktyka",
};

export const PREVENTION_PRIORITY_LABELS: Record<PreventionPriority, string> = {
  obowiazkowe: "Obowiązkowe",
  zalecane: "Zalecane",
  opcjonalne: "Opcjonalne",
};

export function getPreventionPlanForSpecies(species: string): PreventionPlanTemplate | null {
  const planId = SPECIES_PREVENTION_PLAN_ID[normalizeSpeciesValue(species)];
  if (!planId) return null;
  return PREVENTION_PLANS.find((p) => p.id === planId) ?? null;
}

export function hasPreventionPlan(species: string): boolean {
  return getPreventionPlanForSpecies(species) != null;
}

export function getPreventionPlanById(id: string): PreventionPlanTemplate | null {
  return PREVENTION_PLANS.find((p) => p.id === id) ?? null;
}

/** Pozycje katalogu sugerowane dla planu profilaktyki */
export const PREVENTION_CATALOG_TEMPLATES: {
  category: "szczepienie" | "zabieg" | "konsultacja" | "inne";
  name: string;
  manufacturer?: string;
  defaultIntervalDays?: number;
  defaultVisitType?: string;
}[] = [
  { category: "szczepienie", name: "Nobivac DHPPi", manufacturer: "MSD", defaultIntervalDays: 1095, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Nobivac Rabies", manufacturer: "MSD", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Nobivac Lepto", manufacturer: "MSD", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Nobivac KC (kaszoch)", manufacturer: "MSD", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Purevax RCP (kot)", manufacturer: "Boehringer", defaultIntervalDays: 1095, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Purevax Rabies (kot)", manufacturer: "Boehringer", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Wścieklizna", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Nosówka / Parwo / DHPPi", defaultIntervalDays: 1095, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Leptospiroza", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Kaszoch (Bordetella)", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Borelioza (pies)", manufacturer: "MSD", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Purevax FeLV (kot)", manufacturer: "Boehringer", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Myxomatoza / VHD (królik)", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Wścieklizna (królik / fretka)", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Nosówka fretek (Distemper)", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Tężec + enterotoksemia CDT (owca/koza)", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Klasyczny pomór świń CSF", defaultIntervalDays: 180, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Newcastle ND (drób)", defaultIntervalDays: 180, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Gumboro IBD (drób)", defaultIntervalDays: 180, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Tężec (koń)", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Grypa koni (influenza/EHV)", defaultIntervalDays: 180, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "BVD (bydło)", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "IBR / ZZN (bydło)", defaultIntervalDays: 180, defaultVisitType: "szczepienie" },
  { category: "konsultacja", name: "Badanie brucelozy (bydło)", defaultVisitType: "konsultacja" },
  { category: "konsultacja", name: "Badanie ornitozy (ptak)", defaultVisitType: "konsultacja" },
  { category: "szczepienie", name: "CDT clostridial (alpaka/lama)", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "konsultacja", name: "Badanie kału — pasożyty (gad)", defaultVisitType: "konsultacja" },
  { category: "konsultacja", name: "Kontrola terrarium / UVB (żółw)", defaultVisitType: "konsultacja" },
  { category: "zabieg", name: "Odrobaczanie — preparat doustny", defaultVisitType: "odrobaczenie" },
  { category: "zabieg", name: "Odrobaczanie — iniekcja", defaultVisitType: "odrobaczenie" },
  { category: "zabieg", name: "Profilaktyka pchły i kleszczy", defaultVisitType: "zabieg" },
  { category: "konsultacja", name: "Kontrola szczenięcia / kocięcia", defaultVisitType: "konsultacja" },
  { category: "konsultacja", name: "Badanie profilaktyczne roczne", defaultVisitType: "konsultacja" },
  { category: "konsultacja", name: "Morfologia + biochemia", defaultVisitType: "konsultacja" },
  { category: "konsultacja", name: "Test FIV/FeLV (kot)", defaultVisitType: "konsultacja" },
  { category: "konsultacja", name: "Test dirofilarii (pies)", defaultVisitType: "konsultacja" },
  { category: "zabieg", name: "Skaling / profilaktyka stomatologiczna", defaultVisitType: "zabieg" },
];
