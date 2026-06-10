export type GabinetVerticalId = "dent" | "physio" | "psychology" | "aesthetic" | "general";

export type GabinetVisitType = { value: string; label: string };

export type GabinetVerticalConfig = {
  id: GabinetVerticalId;
  hosts: string[];
  brandName: string;
  brandShort: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  clinicLabel: string;
  patientLabel: string;
  patientsLabel: string;
  visitTypes: GabinetVisitType[];
  recallPresets: { name: string; visitType: string; intervalDays: number }[];
};

export const GABINET_VERTICALS: Record<GabinetVerticalId, GabinetVerticalConfig> = {
  dent: {
    id: "dent",
    hosts: ["dentysta.odart.pl", "www.dentysta.odart.pl"],
    brandName: "DentHarmonogram",
    brandShort: "DH",
    heroBadge: "SaaS dla gabinetów stomatologicznych",
    heroTitle: "Wizyty, pacjenci i recall — bez ERP",
    heroSubtitle:
      "Kalendarz, kartoteka pacjenta, plany leczenia, przypomnienia SMS i portal pacjenta — lekki system dla stomatologii.",
    clinicLabel: "Gabinet stomatologiczny",
    patientLabel: "Pacjent",
    patientsLabel: "Pacjenci",
    visitTypes: [
      { value: "konsultacja", label: "Konsultacja" },
      { value: "higienizacja", label: "Higienizacja" },
      { value: "leczenie", label: "Leczenie" },
      { value: "implant", label: "Implant" },
      { value: "ortodoncja", label: "Ortodoncja" },
      { value: "pilna", label: "Pilna" },
    ],
    recallPresets: [
      { name: "Recall higienizacji", visitType: "higienizacja", intervalDays: 180 },
      { name: "Kontrola roczna", visitType: "konsultacja", intervalDays: 365 },
    ],
  },
  physio: {
    id: "physio",
    hosts: ["fizjo.odart.pl", "www.fizjo.odart.pl"],
    brandName: "FizjoHarmonogram",
    brandShort: "FH",
    heroBadge: "SaaS dla gabinetów fizjoterapii",
    heroTitle: "Harmonogram wizyt i serie zabiegów",
    heroSubtitle: "Kalendarz, pacjenci, przypomnienia i dokumentacja — bez magazynu i ERP.",
    clinicLabel: "Gabinet fizjoterapii",
    patientLabel: "Pacjent",
    patientsLabel: "Pacjenci",
    visitTypes: [
      { value: "konsultacja", label: "Konsultacja" },
      { value: "zabieg", label: "Zabieg" },
      { value: "kontrola", label: "Kontrola" },
    ],
    recallPresets: [{ name: "Seria zabiegów — kontrola", visitType: "kontrola", intervalDays: 14 }],
  },
  psychology: {
    id: "psychology",
    hosts: ["psycho.odart.pl", "www.psycho.odart.pl"],
    brandName: "PsychoHarmonogram",
    brandShort: "PH",
    heroBadge: "SaaS dla gabinetów psychologicznych",
    heroTitle: "Wizyty i pacjenci w jednym miejscu",
    heroSubtitle: "Kalendarz, kartoteka, przypomnienia SMS i portal pacjenta.",
    clinicLabel: "Gabinet psychologiczny",
    patientLabel: "Pacjent",
    patientsLabel: "Pacjenci",
    visitTypes: [
      { value: "konsultacja", label: "Konsultacja" },
      { value: "terapia", label: "Terapia" },
      { value: "online", label: "Online" },
    ],
    recallPresets: [],
  },
  aesthetic: {
    id: "aesthetic",
    hosts: ["estetyka.odart.pl", "www.estetyka.odart.pl"],
    brandName: "MedEstHarmonogram",
    brandShort: "ME",
    heroBadge: "SaaS dla gabinetów medycyny estetycznej",
    heroTitle: "Umówienia i pielęgnacja relacji z pacjentem",
    heroSubtitle: "Kalendarz, CRM, plany zabiegowe i przypomnienia.",
    clinicLabel: "Gabinet medycyny estetycznej",
    patientLabel: "Pacjent",
    patientsLabel: "Pacjenci",
    visitTypes: [
      { value: "konsultacja", label: "Konsultacja" },
      { value: "zabieg", label: "Zabieg" },
      { value: "kontrola", label: "Kontrola" },
    ],
    recallPresets: [{ name: "Kontrola po zabiegu", visitType: "kontrola", intervalDays: 30 }],
  },
  general: {
    id: "general",
    hosts: [],
    brandName: "GabinetHarmonogram",
    brandShort: "GH",
    heroBadge: "SaaS dla gabinetów i praktyk",
    heroTitle: "Portal gabinetu — wizyty, pacjenci, SMS",
    heroSubtitle: "Uniwersalny system bez ERP — kalendarz, CRM i przypomnienia.",
    clinicLabel: "Gabinet",
    patientLabel: "Pacjent",
    patientsLabel: "Pacjenci",
    visitTypes: [
      { value: "wizyta", label: "Wizyta" },
      { value: "konsultacja", label: "Konsultacja" },
      { value: "kontrola", label: "Kontrola" },
    ],
    recallPresets: [],
  },
};

const HOST_TO_VERTICAL = new Map<string, GabinetVerticalId>();
for (const v of Object.values(GABINET_VERTICALS)) {
  for (const h of v.hosts) {
    HOST_TO_VERTICAL.set(h.toLowerCase(), v.id);
  }
}

export function getGabinetVerticalFromHost(host: string): GabinetVerticalId {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return HOST_TO_VERTICAL.get(h) ?? "dent";
}

export function getGabinetVerticalConfig(vertical: GabinetVerticalId): GabinetVerticalConfig {
  return GABINET_VERTICALS[vertical];
}

export function getGabinetVerticalConfigForHost(host: string): GabinetVerticalConfig {
  return getGabinetVerticalConfig(getGabinetVerticalFromHost(host));
}
