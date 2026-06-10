import type { VibeMaterialKind } from "@/lib/randki/vibeMaterialTypes";

export type VibeInspirationField = "fragment" | "caption" | "quote";

export type VibeInspirationPack = {
  question: string;
  reassurance: string;
  aiSeedPlaceholders: string[];
};

const PACKS: Record<VibeMaterialKind, VibeInspirationPack> = {
  music: {
    question: "W jakiej scenie brzmi ta piosenka?",
    reassurance: "Nie recenzja — jeden obraz: gdzie, kiedy, co czujesz.",
    aiSeedPlaceholders: ["bas w aucie nocą", "deszcz i kawa", "vinyl o północy", "tramwaj w deszczu", "powrót do domu"],
  },
  film: {
    question: "Jaki obraz zostaje po tej scenie?",
    reassurance: "Jedna sytuacja albo jedno uczucie — nie streszczenie fabuły.",
    aiSeedPlaceholders: ["deszcz i film w tle", "scena bez słów", "comfort movie w niedzielę", "stare kino", "maraton w deszczu"],
  },
  youtube: {
    question: "Kiedy ostatnio włączyłeś/aś coś takiego?",
    reassurance: "Konkretna chwila — nie opis kanału.",
    aiSeedPlaceholders: ["live session o 1 w nocy", "podcast w tle", "ambient przed snem", "koncert online", "scena bez słów"],
  },
  quote: {
    question: "W jakiej sytuacji wracasz do tych słów?",
    reassurance: "Jedno zdanie + jeden moment — nie maksyma na całe życie.",
    aiSeedPlaceholders: ["przed snem", "po ciężkim dniu", "w pociągu", "gdy nie chcę rozmawiać", "mówię to sobie cicho"],
  },
  book: {
    question: "Gdzie czytasz to najchętniej?",
    reassurance: "Scena, nie recenzja — np. pociąg, łóżko, deszczowy wieczór.",
    aiSeedPlaceholders: ["w pociągu", "przed snem", "deszczowy dzień", "powrót co rok", "comfort read w niedzielę"],
  },
  mood: {
    question: "Jaki obraz zostaje po tym dniu?",
    reassurance: "To nie bio — ułamek wspomnienia. Scena, nie lista cech.",
    aiSeedPlaceholders: ["nocny spacer", "powrót autem", "cisza po pracy", "deszcz na szybie", "kto nie boi się ciszy"],
  },
};

export function getVibeInspiration(kind: VibeMaterialKind, field: VibeInspirationField = "caption"): VibeInspirationPack {
  void field;
  return PACKS[kind];
}
