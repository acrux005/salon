import type { RoomClimateId } from "@/lib/randki/roomClimate";

/** Kolory do blendu aur — spotkanie dwóch klimatów, nie „match screen”. */
export const CLIMATE_BLEND_TONES: Record<RoomClimateId, { glow: string; deep: string }> = {
  rainy: { glow: "rgba(120, 160, 210, 0.42)", deep: "rgba(45, 65, 95, 0.55)" },
  "warm-cafe": { glow: "rgba(245, 180, 120, 0.38)", deep: "rgba(120, 70, 40, 0.5)" },
  "city-lights": { glow: "rgba(180, 120, 255, 0.35)", deep: "rgba(40, 25, 80, 0.55)" },
  "lo-fi": { glow: "rgba(160, 130, 220, 0.36)", deep: "rgba(55, 40, 90, 0.52)" },
  "quiet-reading": { glow: "rgba(200, 170, 130, 0.32)", deep: "rgba(70, 55, 45, 0.48)" },
  "night-walk": { glow: "rgba(130, 180, 220, 0.34)", deep: "rgba(30, 50, 75, 0.54)" },
  "cozy-orange": { glow: "rgba(255, 160, 90, 0.4)", deep: "rgba(110, 50, 25, 0.5)" },
  "moonlight-blue": { glow: "rgba(140, 170, 255, 0.38)", deep: "rgba(25, 35, 85, 0.56)" },
};

export function matchBlendBackground(left: RoomClimateId, right: RoomClimateId): string {
  const L = CLIMATE_BLEND_TONES[left];
  const R = CLIMATE_BLEND_TONES[right];
  return [
    `radial-gradient(ellipse 70% 90% at 18% 55%, ${L.glow}, transparent 58%)`,
    `radial-gradient(ellipse 70% 90% at 82% 55%, ${R.glow}, transparent 58%)`,
    `radial-gradient(ellipse 55% 65% at 50% 42%, rgba(251, 191, 36, 0.12), transparent 62%)`,
    `linear-gradient(180deg, ${L.deep} 0%, rgba(8, 6, 18, 0.92) 45%, ${R.deep} 100%)`,
  ].join(", ");
}

export function matchBlendCssVars(left: RoomClimateId, right: RoomClimateId): Record<string, string> {
  const L = CLIMATE_BLEND_TONES[left];
  const R = CLIMATE_BLEND_TONES[right];
  return {
    "--match-blend-left": L.glow,
    "--match-blend-right": R.glow,
    "--match-blend-center": "rgba(251, 191, 36, 0.14)",
  };
}
