import {
  VET_SPECIES_CATALOG,
  catalogForHerdSelect,
  catalogForPetSelect,
  findSpeciesLabelLoose,
  speciesCategories,
  type VetSpeciesCatalogEntry,
} from "@/lib/vet/speciesCatalog";

export type VetSpeciesOption = { value: string; label: string };

/** @deprecated użyj catalogForPetSelect — zachowane dla kompatybilności */
export const VET_PET_SPECIES: VetSpeciesOption[] = catalogForPetSelect().map((s) => ({
  value: s.value,
  label: s.label,
}));

export const VET_HERD_SPECIES: VetSpeciesOption[] = catalogForHerdSelect().map((s) => ({
  value: s.value,
  label: s.label,
}));

export { VET_SPECIES_CATALOG, catalogForPetSelect, catalogForHerdSelect, speciesCategories };
export type { VetSpeciesCatalogEntry };

export function speciesLabel(value: string, _kind: "pet" | "herd" = "pet"): string {
  return findSpeciesLabelLoose(value);
}
