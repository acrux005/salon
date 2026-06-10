import { matchesVaccineKeywords, type VaccineOption } from "@/lib/vet/vaccinationQuickAddUtils";

export type VaccinationTemplateSlot = {
  label: string;
  keywords: string[];
};

export type VaccinationTemplate = {
  id: string;
  label: string;
  species: "kot" | "pies" | "any";
  slots: VaccinationTemplateSlot[];
};

export const VACCINATION_TEMPLATES: VaccinationTemplate[] = [
  {
    id: "cat-basic",
    label: "Kot · podstawowe",
    species: "kot",
    slots: [
      { label: "FVRCP", keywords: ["fvr", "fvrcp", "herpes", "calici", "panleuk"] },
      { label: "FeLV", keywords: ["felv", "leuk"] },
    ],
  },
  {
    id: "dog-puppy",
    label: "Pies · szczeniak",
    species: "pies",
    slots: [
      { label: "DHPPi", keywords: ["dhpp", "dhppi", "combo", "distemper", "parvo"] },
      { label: "Leptospiroza", keywords: ["lepto", "leptosp"] },
      { label: "Kennel cough", keywords: ["kennel", "kaszel", "bordet", "intratracheal"] },
    ],
  },
  {
    id: "rabies",
    label: "Wścieklizna",
    species: "any",
    slots: [{ label: "Wścieklizna", keywords: ["wściek", "wsciek", "rabies", "wsciekl"] }],
  },
];

export type ResolvedTemplateSlot = {
  slot: VaccinationTemplateSlot;
  vaccine: VaccineOption | null;
};

export function resolveTemplateSlots(
  template: VaccinationTemplate,
  vaccineTypes: VaccineOption[]
): ResolvedTemplateSlot[] {
  return template.slots.map((slot) => ({
    slot,
    vaccine: vaccineTypes.find((v) => matchesVaccineKeywords(v.name, slot.keywords)) ?? null,
  }));
}

export function getTemplatesForSpecies(species: string | null | undefined): VaccinationTemplate[] {
  if (species === "kot") {
    return VACCINATION_TEMPLATES.filter((t) => t.species === "kot" || t.species === "any");
  }
  if (species === "pies") {
    return VACCINATION_TEMPLATES.filter((t) => t.species === "pies" || t.species === "any");
  }
  return VACCINATION_TEMPLATES;
}

export function getDefaultTemplateId(species: string | null | undefined): string | null {
  if (species === "kot") return "cat-basic";
  if (species === "pies") return "dog-puppy";
  return null;
}

export function filterVaccinesByTemplate(
  template: VaccinationTemplate | null,
  vaccineTypes: VaccineOption[]
): VaccineOption[] {
  if (!template) return vaccineTypes;
  const resolved = resolveTemplateSlots(template, vaccineTypes);
  const matched = resolved.map((r) => r.vaccine).filter(Boolean) as VaccineOption[];
  return matched.length > 0 ? matched : vaccineTypes;
}
