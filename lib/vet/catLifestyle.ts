export type CatLifestyle = "indoor" | "outdoor";

export const CAT_LIFESTYLE_OPTIONS: { value: CatLifestyle; label: string }[] = [
  { value: "indoor", label: "Niewychodzący (domowy)" },
  { value: "outdoor", label: "Wychodzący" },
];

export function normalizeCatLifestyle(value: string | null | undefined): CatLifestyle | null {
  const v = value?.trim().toLowerCase();
  if (v === "indoor" || v === "outdoor") return v;
  return null;
}

export function catLifestyleLabel(value: string | null | undefined): string {
  const v = normalizeCatLifestyle(value);
  if (v === "indoor") return "Niewychodzący";
  if (v === "outdoor") return "Wychodzący";
  return "Nie określono";
}
