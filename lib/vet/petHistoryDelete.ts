import type { PetTimelineEventType } from "@/lib/vet/petTimeline";

export type PetHistoryEntityKind = "vaccination" | "visit" | "prevention" | "reminder";

export function parsePetTimelineEventId(
  eventId: string
): { kind: PetHistoryEntityKind; entityId: string } | null {
  const prefixes: { prefix: string; kind: PetHistoryEntityKind }[] = [
    { prefix: "vac-", kind: "vaccination" },
    { prefix: "appt-", kind: "visit" },
    { prefix: "prev-", kind: "prevention" },
    { prefix: "rem-", kind: "reminder" },
  ];
  for (const { prefix, kind } of prefixes) {
    if (eventId.startsWith(prefix)) {
      const entityId = eventId.slice(prefix.length);
      if (entityId) return { kind, entityId };
    }
  }
  return null;
}

export function petHistoryDeleteConfirmMessage(type: PetTimelineEventType): string {
  switch (type) {
    case "vaccination":
      return "Usunąć to szczepienie z historii zwierzęcia?";
    case "visit":
      return "Usunąć tę wizytę z historii?";
    case "prevention":
      return "Usunąć ten wpis profilaktyki z historii?";
    case "reminder_sms":
    case "reminder_email":
      return "Usunąć wpis o wysłanym przypomnieniu z historii?";
    default:
      return "Usunąć ten wpis z historii?";
  }
}
