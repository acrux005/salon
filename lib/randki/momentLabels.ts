export type DailyMomentKind = "photo" | "audio" | "voice";

export function momentKindLabel(kind: DailyMomentKind): string {
  switch (kind) {
    case "voice":
      return "fragment głosu";
    case "audio":
      return "dźwięk chwili";
    default:
      return "fragment dnia";
  }
}

export function resolveMomentKindFromCard(input: {
  dailyMomentType?: string | null;
  dailyMomentAudioUrl?: string | null;
}): DailyMomentKind {
  if (input.dailyMomentType === "voice") return "voice";
  if (input.dailyMomentType === "audio" || input.dailyMomentAudioUrl) return "audio";
  return "photo";
}
