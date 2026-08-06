/**
 * =============================================================================
 * EDYCJA TREŚCI — plan wycieczki Jura 4 dni (ODART)
 * -----------------------------------------------------------------------------
 * Dzień 1 Podzamcze:  parking Krakowska · day1* · seniorka-z-plecakiem.pl
 * Dzień 2 Olsztyn:    parking zamkowy · day2* · jura.travel (Sokole Góry / Biakło)
 * Dzień 3 okolice:    Bobolice + Mirów · Pustynia Błędowska (Róża Wiatrów / Czubatka)
 * Dzień 4 Złoty Potok: Brama · źródła · stawy (Amerykan) · Pałac Raczyńskich · opc. Diabelskie Mosty
 * Historia zamku:     historyEras · history1587 (Ogrodzieniec)
 * =============================================================================
 */

import type { MapPoint } from "@/lib/athensPlanData";

export type { MapPoint };

export type ScheduleItem = {
  time: string;
  label: string;
  icon?: "walk" | "sight" | "food" | "hill" | "car" | "coffee" | "default" | "ticket";
};

export type AttractionCard = {
  title: string;
  bullets: string[];
};

export type PracticalTip = {
  icon: "home" | "footprints" | "droplet" | "ticket" | "sun" | "users" | "map";
  title: string;
  text: string;
};

export type CostRow = {
  day: string;
  items: string;
  estimate: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type HistoryEra = {
  period: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type HistoryDeepDive = {
  id: string;
  title: string;
  lead: string;
  paragraphs: string[];
  bullets?: string[];
  takeaway: string;
};

export type PlaceHistory = {
  id: string;
  place: string;
  dayLabel: string;
  lead: string;
  paragraphs: string[];
  takeaway: string;
};

/** Ruiny Zamku Ogrodzieniec — Unsplash (jurajskie skały / zamek). */
export const heroImageUrl =
  "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?w=1920&q=85";
export const heroImageAlt = "Wapienne skały i ruiny na Jurze Krakowsko-Częstochowskiej";

export const parkingName = "Parking przy ul. Krakowskiej, centrum Podzamcza";
export const parkingArea = "Podzamcze (gmina Ogrodzieniec)";
/** Przybliżone współrzędne parkingu / centrum — doprecyzuj w Google Maps przy potrzebie. */
export const parkingLat = 50.4518;
export const parkingLng = 19.6025;

export const introParagraphs: string[] = [
  "Cztery dni na Jurze Orlich Gniazd z bazą w Podzamczu: dzień 1 — Podzamcze (Ogrodzieniec, Birów), dzień 2 — Olsztyn (Sokole Góry, Biakło), dzień 3 — Bobolice, Mirów i Pustynia Błędowska, dzień 4 — Złoty Potok (Brama Twardowskiego, źródła, stawy Amerykan, Pałac Raczyńskich; opcjonalnie Diabelskie Mosty).",
  `Dzień 1: parking ${parkingName} (~8,7 km). Dzień 2: Olsztyn (~16 km pętla). Dzień 3: auto — zamki + pustynia. Dzień 4: auto do Złotego Potoku (~30–40 min) — spacer Brama → źródła → stawy → pałac.`,
  "Dojazdy z Podzamcza: Olsztyn ~45–55 min; Bobolice ~20–25 min; Róża Wiatrów ~25–35 min; Złoty Potok ~30–40 min. Powrót do bazy każdego wieczoru.",
  "Źródła: seniorka-z-plecakiem.pl (Podzamcze), jura.travel (Olsztyn), rezerwat Parkowe / ścieżki Złoty Potok. Bilety zamków i godziny weryfikuj na miejscu.",
];

export const olsztynParkingName = "Parking zamkowy w Olsztynie (k. Częstochowy)";
export const olsztynParkingLat = 50.7508;
export const olsztynParkingLng = 19.2735;
/** Orientacyjna opłata wg opisu trasy jura.travel — sprawdź na miejscu. */
export const olsztynParkingFeeNote = "ok. 10 zł / dzień (orientacyjnie)";

export const day1Title =
  "Dzień 1 – Zamek Ogrodzieniec, Skała 511, winnica, Góra Birów i Suchy Połeć";

export const day1Lead =
  "Pełny dzień na Jurze z bazą w Podzamczu: zwiedzanie ruin, pętla ~5,6 km wokół zamku i krótsza pętla ~3,1 km wokół Góry Birów. Łącznie ok. 8,7 km i 6–8 h na miejscu.";

export const day1Schedule: ScheduleItem[] = [
  { time: "8:30–9:00", label: "Dojazd + parking przy ul. Krakowskiej (centrum Podzamcza)", icon: "car" },
  { time: "9:00–9:15", label: "Spacer do zamku (~300 m) — spokojny start przed tłumem", icon: "walk" },
  {
    time: "9:15–10:45",
    label: "Zamek Ogrodzieniec — ruiny, baszta, sala tortur (bilet łączony z Birowem)",
    icon: "sight",
  },
  {
    time: "10:45–12:30",
    label: "Pętla 1 (~5,6 km): czerwony szlak → Skała 511 → Poziom 511 → winnica → niebieski powrót przez łąki",
    icon: "walk",
  },
  { time: "12:30–13:15", label: "Obiad / kawa w centrum Podzamcza lub przy zamku", icon: "food" },
  {
    time: "13:15–14:45",
    label: "Pętla 2 (~3,1 km): przez DW790 → Birowska → Góra Birów (gród, schody)",
    icon: "hill",
  },
  {
    time: "14:45–15:15",
    label: "Opcja: punkt widokowy Suchy Połeć — panorama zamku i grodu",
    icon: "sight",
  },
  {
    time: "15:15–16:00",
    label: "Powrót do parkingu, kawa, pamiątki — koniec dnia",
    icon: "coffee",
  },
];

export const day1Attractions: AttractionCard[] = [
  {
    title: "Zamek Ogrodzieniec",
    bullets: [
      "Najbardziej rozpoznawalne „Orle Gniazdo” Jury — warto wejść zaraz po otwarciu kas.",
      "Bilet łączony z Grodem na Górze Birów zwykle wychodzi taniej niż osobno.",
      "Aktualne godziny i ceny: www.zamek-ogrodzieniec.pl (sezonowo się zmieniają).",
    ],
  },
  {
    title: "Skała 511 i Poziom 511",
    bullets: [
      "Tabliczka „najwyższe wzniesienie Jury” — klimatyczny przystanek na czerwonym szlaku.",
      "Wąskie przejście między skałami prowadzi na teren hotelu Poziom 511 (kino plenerowe, bar).",
    ],
  },
  {
    title: "Winnica i powrót łąkami",
    bullets: [
      "Niedaleko hotelu — krótki, fotogeniczny odcinek przed zejściem do lasu.",
      "Niebieski szlak + fragment ścieżki rowerowej: z oddali widać zamek i ostańce nad drzewami.",
    ],
  },
  {
    title: "Góra Birów — gród",
    bullets: [
      "Rekonstrukcja grodu słowiańskiego na ostańcach — naturalna warownia, dużo schodów.",
      "Poza sezonem gród bywa nieczynny — sprawdź przed wyjazdem.",
      "Wejście na szczyt nagradza widokiem i klimatem „dawnej osady”.",
    ],
  },
  {
    title: "Suchy Połeć (opcjonalnie)",
    bullets: [
      "Punkt widokowy z panoramą na zamek i gród — warto, jeśli starczy sił.",
      "Szukaj ścieżki przy skałach (parking / skały po przeciwnych stronach).",
    ],
  },
];

export const day1StepsLabel = "około 12–16 tys. kroków (~8,7 km + zwiedzanie)";
export const day1Costs =
  "Bilet łączony Zamek + Gród: orientacyjnie 38 zł normalny / 27 zł ulgowy (cennik od 2026) + parking + obiad. Bez lunchu: ok. 40–55 zł/os.";

export const day1DistanceLabel = "ok. 8,7 km (2 pętle)";
export const day1TimeOnSiteLabel = "ok. 6–8 h na miejscu";

export const day1MapPoints: MapPoint[] = [
  {
    order: 1,
    title: "Parking — ul. Krakowska",
    lat: parkingLat,
    lng: parkingLng,
    popupDescription: "Start i meta. Duży płatny parking w centrum Podzamcza.",
  },
  {
    order: 2,
    title: "Zamek Ogrodzieniec",
    lat: 50.4536,
    lng: 19.6047,
    popupDescription: "Ruiny zamku — zwiedzanie z biletem. ~300 m od parkingu.",
  },
  {
    order: 3,
    title: "Skała 511 / Poziom 511",
    lat: 50.4564,
    lng: 19.6115,
    popupDescription: "Czerwony szlak: ostańce, hotel Poziom 511, kino plenerowe.",
  },
  {
    order: 4,
    title: "Winnica",
    lat: 50.4552,
    lng: 19.6098,
    popupDescription: "Niewielka winnica przy hotelu — fotogeniczny przystanek.",
  },
  {
    order: 5,
    title: "Centrum Podzamcza (obiad)",
    lat: 50.4515,
    lng: 19.6018,
    popupDescription: "Zamknięcie pętli 1. Obiad / kawa przed Birowem.",
  },
  {
    order: 6,
    title: "Góra Birów — gród",
    lat: 50.4583,
    lng: 19.5958,
    popupDescription: "Rekonstrukcja grodu. Schody na szczyt. Bilet łączony z zamkiem.",
  },
  {
    order: 7,
    title: "Suchy Połeć (opc.)",
    lat: 50.4558,
    lng: 19.5982,
    popupDescription: "Punkt widokowy — panorama zamku i grodu.",
  },
];

export const sourceTrailNote =
  "Dzień 1 — pętle wg: seniorka-z-plecakiem.pl/szlakami-po-jurze-zamek-dawny-grod-i-winnica-mapa (ok. 8,7 km).";

/* =============================================================================
 * DZIEŃ 2 — Olsztyn → Sokole Góry → Biakło → Lipówki → Olsztyn
 * Źródło: jura.travel + wiecznatulaczka.pl (~16 km, ~5 h marszu, ~400 m ↑)
 * ============================================================================= */

export const day2Title =
  "Dzień 2 – Olsztyn, Sokole Góry, Góra Biakło i Wzgórze Lipówki";

export const day2Lead =
  "Pętla ok. 16 km wokół Olsztyna k. Częstochowy: zamek, kamieniołom Kielniki, rezerwat Sokole Góry, „jurajski Giewont” Biakło i Lipówki. Średni marsz ~5 h bez odpoczynków; z zamkiem i widokami — pełny dzień.";

export const day2Schedule: ScheduleItem[] = [
  {
    time: "8:00–9:00",
    label: "Dojazd z Podzamcza / Częstochowy → parking zamkowy w Olsztynie",
    icon: "car",
  },
  {
    time: "9:00–10:15",
    label: "Zamek Olsztyn — ruiny, wieża/baszta widokowa (otwarte od 9:00)",
    icon: "sight",
  },
  {
    time: "10:15–11:15",
    label: "Żółty szlak / ścieżka na wschód → Kamieniołom Kielniki (ścieżka geologiczna, Jaskinia Magazyn)",
    icon: "walk",
  },
  {
    time: "11:15–13:00",
    label: "Rezerwat Sokole Góry — ostańce, taras widokowy, spokojniejsze partie Jury",
    icon: "hill",
  },
  { time: "13:00–13:45", label: "Lunch / przerwa (kanapki w terenie albo powrót do Olsztyna)", icon: "food" },
  {
    time: "13:45–15:00",
    label: "Góra Biakło (340 m) — „jurajski Giewont”, krzyż, panorama",
    icon: "hill",
  },
  {
    time: "15:00–15:45",
    label: "Wzgórze Lipówki (351 m) — najlepszy widok na skalne Biakło",
    icon: "sight",
  },
  {
    time: "15:45–17:00",
    label: "Powrót do Olsztyna — Spichlerz (restauracja) / szopka Jana Wiewióra",
    icon: "coffee",
  },
];

export const day2Attractions: AttractionCard[] = [
  {
    title: "Zamek Olsztyn",
    bullets: [
      "Jedno z najciekawszych Orlich Gniazd — blisko Częstochowy, więc bywa gwarno.",
      "Zachowane fragmenty zamku górnego, cylindryczna wieża i baszta jako punkt obserwacyjny.",
      "Poważne zniszczenia dopiero w potopie szwedzkim. Zwiedzanie od 9:00 — ceny sprawdzaj na miejscu (opis trasy: ok. 8 zł + 4 zł wieża).",
    ],
  },
  {
    title: "Kamieniołom Kielniki",
    bullets: [
      "Nieczynny kamieniołom ze Ścieżką Geologiczną — jak powstała Wyżyna Krakowsko-Częstochowska.",
      "Jaskinia Magazyn, punkt widokowy, skamieniałości w odsłonięciach.",
      "Dojście żółtym szlakiem lub ścieżką bezpośrednio z Góry Zamkowej na wschód.",
    ],
  },
  {
    title: "Rezerwat Sokole Góry",
    bullets: [
      "Jeden z większych rezerwatów na Jurze — lesiste wzniesienia i grupy ostańców.",
      "Taras widokowy, system jaskiń (korytarze podziemne) — tu dochodzi mniej turystów niż na zamek.",
      "Oaza spokoju między popularnymi atrakcjami.",
    ],
  },
  {
    title: "Góra Biakło — „jurajski Giewont”",
    bullets: [
      "340 m n.p.m., skalny grzebień + krzyż — charakterystyczna sylwetka znana z pocztówek.",
      "Wejście nie jest trudne; panorama należy do najładniejszych na Jurze (zamek + Sokole Góry).",
      "Ostańce popularne wśród wspinaczy.",
    ],
  },
  {
    title: "Wzgórze Lipówki + powrót",
    bullets: [
      "351 m — stąd Biakło wygląda rewelacyjnie; nie pomijaj tego punktu.",
      "W Olsztynie: drewniany spichlerz (dziś restauracja) i ruchoma szopka Jana Wiewióra.",
    ],
  },
];

export const day2StepsLabel = "około 18–24 tys. kroków (~16 km + zwiedzanie)";
export const day2Costs =
  "Zamek Olsztyn: orientacyjnie ~8 zł + ~4 zł wieża; parking ~10 zł/dzień; obiad lokalnie. Bez lunchu: ok. 20–30 zł/os. — weryfikuj na miejscu.";
export const day2DistanceLabel = "ok. 16–16,3 km (pętla)";
export const day2TimeOnSiteLabel = "ok. 7–9 h (marsz ~5 h + atrakcje)";
export const day2ElevationLabel = "ok. 400 m ↑ / 400 m ↓";

export const day2OptionalExtension =
  "Opcja +5 km: na rozstaju w Sokolich Górach zielony + niebieski do Zrębic, potem czerwony z powrotem — Skałki św. Idziego, kaplica, kościół św. Idziego (Szlak Architektury Drewnianej).";

export const day2MapPoints: MapPoint[] = [
  {
    order: 1,
    title: "Parking zamkowy — Olsztyn",
    lat: olsztynParkingLat,
    lng: olsztynParkingLng,
    popupDescription: "Start i meta dnia 2. Płatny parking przy zamku.",
  },
  {
    order: 2,
    title: "Zamek Olsztyn",
    lat: 50.7512,
    lng: 19.2748,
    popupDescription: "Ruiny Orlich Gniazd — wieża i baszta widokowa. Od 9:00.",
  },
  {
    order: 3,
    title: "Kamieniołom Kielniki",
    lat: 50.7475,
    lng: 19.292,
    popupDescription: "Ścieżka geologiczna, Jaskinia Magazyn, panorama.",
  },
  {
    order: 4,
    title: "Rezerwat Sokole Góry",
    lat: 50.744,
    lng: 19.308,
    popupDescription: "Ostańce, taras widokowy, jaskinie — mniej tłoczno.",
  },
  {
    order: 5,
    title: "Góra Biakło",
    lat: 50.7395,
    lng: 19.2685,
    popupDescription: "340 m — „jurajski Giewont”, krzyż, panorama.",
  },
  {
    order: 6,
    title: "Wzgórze Lipówki",
    lat: 50.7378,
    lng: 19.2645,
    popupDescription: "351 m — najlepszy widok na skalne Biakło.",
  },
  {
    order: 7,
    title: "Olsztyn — Spichlerz",
    lat: 50.7495,
    lng: 19.2705,
    popupDescription: "Drewniany spichlerz / restauracja + szopka Wiewióra.",
  },
];

export const sourceTrailNoteDay2 =
  "Dzień 2 — wg jura.travel/route/1019758 (tekst/zdjęcia: wiecznatulaczka.pl). Parametry: ~16,3 km, max ~372 m n.p.m., suma podjazdów ~419 m.";

/* =============================================================================
 * DZIEŃ 3 — Bobolice + Mirów → Pustynia Błędowska (Róża Wiatrów / Czubatka)
 * Baza noclegowa: Podzamcze. Rano zamki Orlich Gniazd, po południu pustynia.
 * ============================================================================= */

export const day3Title =
  "Dzień 3 – Bobolice i Mirów, potem Pustynia Błędowska (Róża Wiatrów / Czubatka)";

export const day3Lead =
  "Dzień samochodowy z powrotem do Podzamcza: rano para zamków Bobolice–Mirów (ścieżka ~1,5 km między nimi), po południu Pustynia Błędowska — punkt widokowy Róża Wiatrów (wygodniej) albo Czubatka (ładniejszy zachód). Mało marszu, dużo krajobrazu.";

export const day3Schedule: ScheduleItem[] = [
  {
    time: "8:30–9:00",
    label: "Wyjazd z Podzamcza → parking przy Zamku Bobolice (~20–25 min)",
    icon: "car",
  },
  {
    time: "9:00–10:30",
    label: "Zamek Bobolice — błonia + zwiedzanie wnętrz (wejścia zwykle co 30 min)",
    icon: "sight",
  },
  {
    time: "10:30–11:15",
    label: "Ścieżka między zamkami (~1,5 km) — Skały Mirowskie po drodze",
    icon: "walk",
  },
  {
    time: "11:15–12:15",
    label: "Zamek Mirów — ruiny, błonia, panorama Jurajskich ostańców",
    icon: "sight",
  },
  {
    time: "12:15–13:00",
    label: "Lunch — restauracja przy Bobolicach albo kanapki w terenie",
    icon: "food",
  },
  {
    time: "13:00–13:45",
    label: "Przejazd Bobolice → Pustynia Błędowska / Klucze (~35–45 min)",
    icon: "car",
  },
  {
    time: "13:45–15:30",
    label: "Róża Wiatrów — platformy, kładki, spacer po piasku (wstęp bezpłatny)",
    icon: "sight",
  },
  {
    time: "15:30–16:30",
    label: "Opcja: Czubatka zamiast / po Róży — panorama i zachód (krótki dojazd)",
    icon: "hill",
  },
  {
    time: "16:30–17:00",
    label: "Powrót do Podzamcza (~25–30 min) — koniec dnia 3",
    icon: "car",
  },
];

export const day3Attractions: AttractionCard[] = [
  {
    title: "Zamek Bobolice",
    bullets: [
      "Odbudowane Orle Gniazdo — najbardziej „gotowy” zamek w parze z Mirowem.",
      "Wygodny bezpłatny parking i kasy przy wejściu; w weekendy warto być wcześnie.",
      "Bilet łączony z Mirowem i błoniami zwykle wychodzi najlepiej — sprawdź aktualny cennik na miejscu.",
    ],
  },
  {
    title: "Zamek Mirów + Skały Mirowskie",
    bullets: [
      "Ruiny na grzbiecie wapiennym — klimat klasycznej Jury, mniej „rekonstrukcji” niż Bobolice.",
      "Między zamkami ok. 1,5 km ścieżki; bilet na błonia otwiera przejście.",
      "Skały Mirowskie po drodze — krótki przystanek fotograficzny.",
    ],
  },
  {
    title: "Pustynia Błędowska — Róża Wiatrów",
    bullets: [
      "Najwygodniejszy punkt startowy: drewniane platformy, kładki, parking przy Kluczach / Bolesławiu.",
      "Wstęp na pustynię i punkty widokowe bezpłatny; parking zwykle duży (sezonowo bywa opłata — sprawdź tablice).",
      "Idealne na zdjęcia i krótki spacer po piasku bez długiego marszu.",
    ],
  },
  {
    title: "Czubatka (opcjonalnie)",
    bullets: [
      "Punkt widokowy w Kluczach — mniejszy parking leśny, ładna panorama pustyni.",
      "Lepszy wybór na zachód słońca; zejście na wydmy stromą ścieżką (nie dla wózków).",
      "Możesz zrobić tylko Czubatkę zamiast Róży, jeśli zależy Ci na spokojniejszym widoku.",
    ],
  },
];

export const day3StepsLabel = "około 6–10 tys. kroków (zamki + pustynia; reszta autem)";
export const day3Costs =
  "Bobolice/Mirów: orientacyjnie błonia ~20 zł, wnętrza Bobolic ~30 zł, łączony ~40 zł/os. (sezonowo +10 zł). Pustynia: wstęp 0 zł. Parkingi: Bobolice zwykle free; Mirów bywa płatny (~10 zł). Bez lunchu: ok. 20–45 zł/os.";
export const day3DistanceLabel = "ok. 3–5 km pieszo + ~80–100 km autem";
export const day3TimeOnSiteLabel = "ok. 7–8 h (z dojazdami)";

export const day3MapPoints: MapPoint[] = [
  {
    order: 1,
    title: "Podzamcze — start dnia 3",
    lat: parkingLat,
    lng: parkingLng,
    popupDescription: "Wyjazd z bazy noclegowej. Powrót tu na koniec dnia.",
  },
  {
    order: 2,
    title: "Zamek Bobolice",
    lat: 50.6148,
    lng: 19.4865,
    popupDescription: "Parking + kasy. Odbudowany zamek, błonia, wejścia co ~30 min.",
  },
  {
    order: 3,
    title: "Zamek Mirów",
    lat: 50.6142,
    lng: 19.4738,
    popupDescription: "Ruiny + błonia. ~1,5 km ścieżką od Bobolic.",
  },
  {
    order: 4,
    title: "Róża Wiatrów — Pustynia Błędowska",
    lat: 50.3415,
    lng: 19.4535,
    popupDescription: "Platformy i kładki. Najwygodniejszy punkt widokowy na pustynię.",
  },
  {
    order: 5,
    title: "Czubatka (opc.)",
    lat: 50.3358,
    lng: 19.5585,
    popupDescription: "Punkt widokowy w Kluczach — panorama, dobry zachód.",
  },
];

export const sourceTrailNoteDay3 =
  "Dzień 3 — zamki Bobolice–Mirów (ścieżka ~1,5 km między warowniami) + Pustynia Błędowska: Róża Wiatrów (Klucze/Bolesław) lub Czubatka. Dojazdy z bazy w Podzamczu.";

/* =============================================================================
 * DZIEŃ 4 — Złoty Potok / rezerwat Parkowe
 * Brama Twardowskiego · źródła · stawy (Amerykan) · Pałac Raczyńskich
 * Diabelskie Mosty — opcjonalnie (krótki spacer)
 * ============================================================================= */

export const zlotyPotokParkingName = "Parking przy Bramie Twardowskiego / Parkowe";
export const zlotyPotokParkingLat = 50.685;
export const zlotyPotokParkingLng = 19.4105;

export const day4Title =
  "Dzień 4 – Złoty Potok: Brama Twardowskiego, źródła, stawy i Pałac Raczyńskich";

export const day4Lead =
  "Plan spacerowy w Złotym Potoku: Brama Twardowskiego → źródła Zygmunta i Elżbiety → stawy (m.in. Amerykan) → Pałac Raczyńskich i park. Jeśli lubicie krótkie podejścia skałkowe — dołóżcie Diabelskie Mosty. Dojazd z Podzamcza ~30–40 min; wstęp do rezerwatu i stawów bezpłatny.";

export const day4Schedule: ScheduleItem[] = [
  {
    time: "8:30–9:15",
    label: "Wyjazd z Podzamcza → parking przy Bramie Twardowskiego (~30–40 min)",
    icon: "car",
  },
  {
    time: "9:15–10:00",
    label: "Brama Twardowskiego — ostaniec z prześwitem, legenda o Twardowskim",
    icon: "sight",
  },
  {
    time: "10:00–11:00",
    label: "Źródła Zygmunta i Elżbiety — wywierzyska krasowe, początek Wiercicy",
    icon: "walk",
  },
  {
    time: "11:00–12:15",
    label: "Stawy (m.in. Amerykan) — spokojny spacer wokół wody, deptak, odpoczynek",
    icon: "walk",
  },
  {
    time: "12:15–13:00",
    label: "Lunch przy stawach / pstrągarnia (opcjonalnie)",
    icon: "food",
  },
  {
    time: "13:00–14:15",
    label: "Pałac Raczyńskich i park krajobrazowy — zewnątrz + aleje (wnętrza bywają niedostępne)",
    icon: "sight",
  },
  {
    time: "14:15–15:15",
    label: "Opcja: Diabelskie Mosty — krótki spacer do ostańców (dla chętnych)",
    icon: "hill",
  },
  {
    time: "15:15–16:00",
    label: "Powrót do Podzamcza (~30–40 min) — koniec dnia 4",
    icon: "car",
  },
];

export const day4Attractions: AttractionCard[] = [
  {
    title: "Brama Twardowskiego",
    bullets: [
      "Naturalna brama w wapieniu — start dnia i najbardziej rozpoznawalny ostaniec Parkowego.",
      "Parking w okolicy; można podjechać prawie pod skałę.",
      "Legenda o Panu Twardowskim — tablica na miejscu.",
    ],
  },
  {
    title: "Źródła Zygmunta i Elżbiety",
    bullets: [
      "Krasowe wywierzyska o czystej, chłodnej wodzie — początek potoku Wiercica.",
      "Nazwy od dzieci Zygmunta Krasińskiego; Elżbiety bliżej drogi, Zygmunta głębiej w lesie.",
      "Łatwy, spokojny odcinek ścieżek rezerwatu.",
    ],
  },
  {
    title: "Stawy (m.in. Amerykan)",
    bullets: [
      "Bardzo przyjemny spacer wokół wody — deptak, ławki, klimat doliny Wiercicy.",
      "Dawniej „Staw Gorzkich Łez” (Krasiński); Raczyńscy zmienili nazwę na Amerykan (pstrąg tęczowy).",
      "W sezonie gastronomia i atrakcje przy brzegu; ścieżka zwykle OK także z wózkiem (suche dni).",
    ],
  },
  {
    title: "Pałac Raczyńskich i park",
    bullets: [
      "Neoklasycystyczna rezydencja w parku krajobrazowym — w 1857 gościł tu Zygmunt Krasiński.",
      "Spacer alejami parku i obejrzenie pałacu z zewnątrz; wnętrza bywają niedostępne / w złym stanie.",
      "Obok: Dworek Krasińskiego (muzeum) — warto, jeśli starczy czasu.",
    ],
  },
  {
    title: "Diabelskie Mosty (opcjonalnie)",
    bullets: [
      "Krótki spacer do ostańców — warto, jeśli lubicie skałki bez długiego marszu.",
      "Szczeliny i formacje w północnej części rezerwatu; po deszczu ślisko.",
      "Można pominąć bez żalu, jeśli dzień ma być wyłącznie „park + stawy”.",
    ],
  },
];

export const day4StepsLabel = "około 8–12 tys. kroków (~4–7 km; + opc. Diabelskie Mosty)";
export const day4Costs =
  "Parkowe, źródła, stawy, park pałacowy: wstęp 0 zł. Opcjonalnie Dworek/muzeum + lunch (pstrąg). Bez lunchu: ok. 0–20 zł/os.";
export const day4DistanceLabel = "ok. 4–7 km pieszo + ~60–80 km autem";
export const day4TimeOnSiteLabel = "ok. 6–7 h (z dojazdami)";

export const day4MapPoints: MapPoint[] = [
  {
    order: 1,
    title: "Podzamcze — start dnia 4",
    lat: parkingLat,
    lng: parkingLng,
    popupDescription: "Wyjazd z bazy. Powrót tu wieczorem.",
  },
  {
    order: 2,
    title: "Brama Twardowskiego",
    lat: 50.6825,
    lng: 19.4148,
    popupDescription: "Start spaceru. Ostaniec z prześwitem + parking.",
  },
  {
    order: 3,
    title: "Źródła Zygmunta i Elżbiety",
    lat: 50.6862,
    lng: 19.4075,
    popupDescription: "Wywierzyska krasowe — początek Wiercicy.",
  },
  {
    order: 4,
    title: "Staw Amerykan",
    lat: 50.6955,
    lng: 19.417,
    popupDescription: "Przyjemny spacer wokół stawu — deptak, odpoczynek.",
  },
  {
    order: 5,
    title: "Pałac Raczyńskich i park",
    lat: 50.7085,
    lng: 19.4255,
    popupDescription: "Pałac + park krajobrazowy. Spacer alejami; wnętrza bywają zamknięte.",
  },
  {
    order: 6,
    title: "Diabelskie Mosty (opc.)",
    lat: 50.6915,
    lng: 19.399,
    popupDescription: "Opcjonalny krótki spacer do ostańców.",
  },
];

export const sourceTrailNoteDay4 =
  "Dzień 4 — Złoty Potok: Brama Twardowskiego → źródła Zygmunta i Elżbiety → stawy (Amerykan) → Pałac Raczyńskich i park; opcjonalnie Diabelskie Mosty. Dojazd z Podzamcza ~30–40 min.";

export const overviewMapPoints: MapPoint[] = [
  {
    order: 1,
    title: "Dzień 1 — Podzamcze / Ogrodzieniec",
    lat: parkingLat,
    lng: parkingLng,
    popupDescription: "Baza dnia 1 i noclegi: parking Krakowska, zamek, Birów.",
  },
  {
    order: 2,
    title: "Dzień 2 — Olsztyn k. Częstochowy",
    lat: olsztynParkingLat,
    lng: olsztynParkingLng,
    popupDescription: "Baza dnia 2: zamek, Sokole Góry, Biakło (~45–55 min autem).",
  },
  {
    order: 3,
    title: "Dzień 3 — Bobolice / Mirów",
    lat: 50.6145,
    lng: 19.4805,
    popupDescription: "Para zamków Orlich Gniazd — rano dnia 3 (~20–25 min z Podzamcza).",
  },
  {
    order: 4,
    title: "Dzień 3 — Pustynia Błędowska",
    lat: 50.3415,
    lng: 19.4535,
    popupDescription: "Róża Wiatrów / Czubatka — po południu dnia 3.",
  },
  {
    order: 5,
    title: "Dzień 4 — Złoty Potok",
    lat: zlotyPotokParkingLat,
    lng: zlotyPotokParkingLng,
    popupDescription: "Parkowe: Brama Twardowskiego, źródła, Diabelskie Mosty (~30–40 min).",
  },
];

export const practicalTips: PracticalTip[] = [
  {
    icon: "home",
    title: "Baza: Podzamcze",
    text: `Noclegi w Podzamczu przez cały wyjazd. Dzień 4: ${zlotyPotokParkingName} — zwykle darmowy, blisko Bramy Twardowskiego.`,
  },
  {
    icon: "ticket",
    title: "Bilety",
    text: "Dni 1–3: zamki (Ogrodzieniec, Olsztyn, Bobolice/Mirów). Dzień 4: rezerwat Parkowe bez biletu. Pustynia też bez biletu.",
  },
  {
    icon: "footprints",
    title: "Najcięższy vs najlżejszy",
    text: "Dzień 2 (~16 km) to szczyt marszu. Dzień 4 to spokojne 4–8 km w lesie i przy źródłach — dobry finał albo dzień „na oddech”.",
  },
  {
    icon: "sun",
    title: "Róża Wiatrów czy Czubatka?",
    text: "Róża: platformy, kładki — wygodniej. Czubatka: mniejszy parking, ładniejszy zachód. Obie w dniu 3.",
  },
  {
    icon: "droplet",
    title: "Obuwie w Parkowem",
    text: "Przy źródłach bywa mokro; Diabelskie Mosty — antypoślizgowa podeszwa, zwłaszcza po deszczu. Kijki niekonieczne.",
  },
  {
    icon: "users",
    title: "Kolejność dni",
    text: "Podzamcze (1) → Olsztyn (2) → Bobolice/Mirów + pustynia (3) → Złoty Potok (4). Dni 3 i 4 da się zamienić; oba wracają do Podzamcza.",
  },
];

export const costsTableRows: CostRow[] = [
  {
    day: "Dzień 1 — wejścia",
    items: "Zamek + Gród Birów (łączony)",
    estimate: "ok. 38 zł / 27 zł ulgowy",
  },
  {
    day: "Dzień 1 — parking",
    items: "ul. Krakowska, Podzamcze",
    estimate: "kilka–kilkanaście zł",
  },
  {
    day: "Dzień 2 — wejścia",
    items: "Zamek Olsztyn (+ wieża)",
    estimate: "ok. 8 + 4 zł (orientacyjnie)",
  },
  {
    day: "Dzień 2 — parking",
    items: "Parking zamkowy Olsztyn",
    estimate: olsztynParkingFeeNote,
  },
  {
    day: "Dzień 3 — wejścia",
    items: "Bobolice / Mirów (błonia lub łączony)",
    estimate: "ok. 20–40 zł/os.",
  },
  {
    day: "Dzień 3 — pustynia",
    items: "Róża Wiatrów / Czubatka",
    estimate: "wstęp 0 zł (+ parking sezonowo)",
  },
  {
    day: "Dzień 4 — rezerwat",
    items: "Parkowe / źródła / skały",
    estimate: "wstęp 0 zł",
  },
  {
    day: "Posiłki (4 dni)",
    items: "obiady + kawa",
    estimate: "ok. 160–320 zł/os.",
  },
];

export const costsDisclaimer =
  "Kwoty orientacyjne (cennik Ogrodzieńca od 2026; Olsztyn wg jura.travel; Bobolice/Mirów sezonowo; Parkowe bez biletu). Przed wyjazdem sprawdź oficjalne strony i parkingi.";

export const historyIntro =
  "Zamek Ogrodzieniec w Podzamczu ma dobrze udokumentowaną historię od 1386 roku. Jego wcześniejsze dzieje są częściowo rekonstruowane na podstawie archeologii — nie każda popularna opowieść jest pewnym faktem.";

export const historySummary =
  "Najkrócej: był to kolejno królewski zamek graniczny, rycerska warownia Włodków, renesansowa rezydencja Bonerów, magnacka siedziba Firlejów i Warszyckiego, a po dwóch szwedzkich najazdach — stopniowo opuszczona ruina.";

export const historyEras: HistoryEra[] = [
  {
    period: "XII–XIV w.",
    title: "Początki na pograniczu",
    paragraphs: [
      "Okolica leżała na pograniczu Małopolski i Śląska. Prawdopodobnie już w XII–XIII wieku istniały tu drewniano-ziemne umocnienia. Źródła różnią się co do położenia: część wskazuje Górę Zamkową, inne pobliską Górę Birów.",
      "Według tradycji pierwszy gród zniszczono podczas najazdu tatarskiego w 1241 roku albo w walkach o tron krakowski pod koniec XIII wieku. Nie ma dokumentu jednoznacznie potwierdzającego datę i miejsce.",
      "W połowie XIV wieku, za Kazimierza Wielkiego, na Górze Zamkowej powstał murowany zamek gotycki — część systemu warowni chroniących granicę i drogę ku Krakowowi. Początkowo własność królewska.",
    ],
  },
  {
    period: "od 1386",
    title: "Włodkowie herbu Sulima",
    paragraphs: [
      "Pierwsza pewna wzmianka: 1386. Władysław Jagiełło przekazał zamek Włodkowi z Charbinowic (ród Włodków herbu Sulima).",
      "Włodkowie rozbudowali warownię w XV wieku — stąd najstarsze zachowane murowane fragmenty, zwłaszcza w części północno-wschodniej. Ród władał do ok. 1470 roku; później posiadłość przechodziła między kolejnymi właścicielami.",
    ],
  },
  {
    period: "1523–1561",
    title: "Bonerowie i „mały Wawel”",
    paragraphs: [
      "W 1523 zadłużony zamek przejął Jan Boner — bankier i wielkorządca krakowski. Bratanek Seweryn Boner ok. 1530 rozpoczął wielką przebudowę; w latach 1533–1547 warownię przekształcono w reprezentacyjną rezydencję renesansową.",
      "Po śmierci Seweryna prace kontynuował syn Stanisław (ok. 1550–1560): Kurza Stopa, beluard, mury, dziedziniec gospodarczy. Skarbiec, zbrojownia, biblioteka, kaplica — okres największej świetności Ogrodzieńca.",
    ],
    bullets: [
      "czterokondygnacyjne skrzydło północne",
      "wysoka baszta bramna z kaplicą",
      "Baszta Kredencarska",
      "krużganki wokół dziedzińca",
      "rozbudowane komnaty mieszkalne i reprezentacyjne",
    ],
  },
  {
    period: "od 1561",
    title: "Firlejowie — i pierwsze ciosy",
    paragraphs: [
      "W 1561 Zofia Bonerówna wniosła zamek jako posag Janowi Firlejowi. Firlejowie władali ponad sto lat.",
      "1587: podczas walk o tron po śmierci Batorego zamek zajęły wojska arcyksięcia Maksymiliana Habsburga — pierwszy poważny cios dla renesansowej rezydencji (szczegóły poniżej).",
      "1655: potop szwedzki — wojska Karola X Gustawa zajęły, obrabowały i częściowo spaliły zamek. To już realny początek upadku budowli.",
    ],
  },
  {
    period: "XVII w.",
    title: "Stanisław Warszycki i odbudowa",
    paragraphs: [
      "Po potopie kasztelan krakowski Stanisław Warszycki kupił uszkodzoną posiadłość, odbudował część zamku, wzmocnił fortyfikacje i rozbudował przedzamcze (stajnie, wozownie, kuźnia, browar, gorzelnia).",
      "Warszycki jest postacią historyczną, ale wokół niego narosła legenda o okrutnym „czarnym panu” i duchu w postaci czarnego psa — to nie ma takiego samego potwierdzenia jak wydarzenia polityczne i budowlane.",
    ],
  },
  {
    period: "1702–1810",
    title: "Pożar, upadek, ostatnia mieszkanka",
    paragraphs: [
      "1702 (III wojna północna): wojska Karola XII ograbiają i podpalają zamek. Nigdy nie odzyskał dawnej świetności. Męcińscy odbudowali tylko część mieszkalną.",
      "1784: Tomasz Jakliński — kamień z ruin idzie m.in. na kościół w Ogrodzieńcu; lokalna ludność też bierze materiał budowlany.",
      "Ostatnią mieszkanką była hrabina Zofia Mieroszewska. W 1810, z powodu groźby zawalenia stropów, przeniosła się do folwarku. Od tej pory — niezamieszkana ruina.",
    ],
  },
  {
    period: "XIX–XXI w.",
    title: "Ochrona ruin i turystyka",
    paragraphs: [
      "1885: Aleksander Janowski — widok ruin miał przyczynić się do jego działań na rzecz zabytków i założenia PTK (1906). Stąd nazwa Góra Janowskiego.",
      "I 1945: dodatkowe uszkodzenia podczas ofensywy Armii Czerwonej. Po wojnie badania, zabezpieczenie murów jako trwałej ruiny (bez odbudowy do hipotetycznego wyglądu). Od 1973 udostępniony turystom.",
      "Dziś właścicielem jest gmina Ogrodzieniec; od 1995 obiektem zarządza gminna spółka „Zamek”.",
    ],
  },
];

/** Epizod 1587 — ostrożna wersja (zajęcie pewne; łupienie i skala zniszczeń — rozbieżne). */
export const history1587: HistoryDeepDive = {
  id: "1587",
  title: "1587: Maksymilian Habsburg — co wiemy, a czego nie",
  lead:
    "Pewne jest zajęcie zamku przez wojska Maksymiliana. Splądrowanie i skala zniszczeń nie są równie dobrze udokumentowane — źródła regionalne podają sprzeczne wersje.",
  paragraphs: [
    "Po śmierci Stefana Batorego (1586) doszło do podwójnej elekcji: Zygmunt III Waza vs arcyksiążę Maksymilian III Habsburg. Maksymilian wkroczył, by opanować Kraków przed Zygmuntem. Oblężenie Krakowa: ok. 16 października – 30 listopada 1587 — nieudane.",
    "Po odwrocie spod Krakowa droga wiodła m.in. przez Miechów → Pilicę → Ogrodzieniec → Siewierz → okolice Częstochowy i Wielunia. Ogrodzieniec nie był głównym celem wyprawy — leżał na trasie cofającej się armii potrzebującej kwater, żywności i pieniędzy.",
    "Warownia należała do Firlejów, związanych ze stronnictwem przeciwnym Habsburgowi — zamek raczej nie został oddany dobrowolnie.",
    "Źródła potwierdzają zajęcie pod koniec 1587. Nie zachował się opis walki: liczebność stron, dowódca ataku, długość oporu, artyleria, ofiary. Barwne „regularne oblężenie” byłoby zgadywaniem — prawdopodobnie krótka operacja przeciw niewielkiej załodze.",
    "Część opracowań (w tym oficjalna strona zamku) mówi o złupieniu; inne wskazują brak większych uszkodzeń konstrukcji. Po 1587 zamek nadal funkcjonował jako bogata rezydencja; w XVII w. prowadzono dalsze prace. Ruiny porównywalne z pożarami 1655 i 1702 zaczynają się dopiero od Szwedów.",
    "24 stycznia 1588 pod Byczyną Zamoyski rozbił armię Habsburga; Maksymilian w niewoli. Królem pozostał Zygmunt III.",
  ],
  bullets: [
    "Armia pod Krakowem: szacunki ok. 8–10 tys. żołnierzy",
    "Po oblężeniu / w odwrocie: ok. 5 tys.",
    "Pod Byczyną (I 1588): ok. 5–6,5 tys.",
    "Do samego Ogrodzieńca najpewniej wszedł wydzielony oddział — niekoniecznie cała armia naraz",
  ],
  takeaway:
    "Ogrodzieniec był epizodem odwrotu przegranej armii spod Krakowa — zamkiem zajętym po drodze, nie miejscem wielkiej, dobrze udokumentowanej bitwy. Najostrożniej: wojska zajęły zamek i mogły zabrać zapasy oraz ruchome dobra, ale nie zniszczyły zasadniczej konstrukcji.",
};

export const historyLogisticsNote: HistoryDeepDive = {
  id: "logistyka-1587",
  title: "Dlaczego zajęcie zamku bolało okolicę — nawet bez „masakry”",
  lead:
    "Armia ~5 tys. żołnierzy z końmi i taborem potrzebowała ogromnych ilości żywności. Zapasy na wozach kończyły się szybko — wojsko żyło z okolicy.",
  paragraphs: [
    "Orientacyjnie na dzień dla ~5 tys. ludzi: kilka ton zboża/chleba, mięso jeśli dostępne, dziesiątki tysięcy litrów wody i piwa; dla koni — dziesiątki ton paszy. Praktyka: obowiązki na wsiach, rekwizycje, zajmowanie kwater, rabunek przy odmowie.",
    "Zamek i przedzamcze dawały spiżarnie, piwnice, stajnie, studnię/cysternę. Jeden dzień postoju takiej siły mógł pochłonąć zapasy lokalnej ludności na wiele tygodni — katastrofa gospodarcza bez konieczności udokumentowanej masakry.",
    "To realia XVI-wiecznych armii, nie dowód, że każdy z tych elementów wydarzył się dokładnie w Podzamczu.",
  ],
  takeaway:
    "Nie ma wiarygodnych źródeł o wymordowaniu mieszkańców ani gwałtach w Ogrodzieńcu w 1587. Potwierdzone: zajęcie (i prawdopodobne ograbienie). Masakry nie da się ani potwierdzić, ani całkowicie wykluczyć — brak świadectw pozwalających ją przypisać temu wydarzeniu.",
};

export const placeHistoriesIntro =
  "Poza Ogrodzieńcem warto znać tło miejsc z kolejnych dni: Olsztyn, Bobolice i Mirów, Pustynia Błędowska oraz Złoty Potok (Krasiński, Raczyńscy, rezerwat Parkowe). Poniżej skróty — fakty oddzielone od legend.";

export const placeHistories: PlaceHistory[] = [
  {
    id: "historia-olsztyn",
    place: "Zamek Olsztyn",
    dayLabel: "Dzień 2",
    lead:
      "Jedno z Orlich Gniazd nad Częstochową — warownia królewska i książęca, później ruina po potopie.",
    paragraphs: [
      "Murowany zamek powstał w XIV wieku w systemie fortyfikacji Jury. Przechodził przez ręce władców i możnych; był ważnym punktem na szlaku ku północy.",
      "Najcięższe zniszczenia przyniósł potop szwedzki (XVII w.) — odtąd obiekt nie wrócił do roli rezydencji. Dziś zwiedzamy trwałą ruinę z wieżą/basztą widokową.",
      "Popularność wynika też z bliskości Częstochowy — w weekendy bywa gwarno; Sokole Góry i Biakło dają kontrast spokojniejszego krajobrazu.",
    ],
    takeaway:
      "Olsztyn to klasyczne Orle Gniazdo w ruinie: historia militarna i pejzaż, nie odbudowana „bajka” jak Bobolice.",
  },
  {
    id: "historia-bobolice-mirow",
    place: "Bobolice i Mirów",
    dayLabel: "Dzień 3",
    lead:
      "Para zamków Orlich Gniazd w linii wzroku — Mirów w ruinie, Bobolice odbudowane w XXI wieku.",
    paragraphs: [
      "Obie warownie powstały w XIV–XV w. jako część systemu obrony Jury. Mirów zachował charakter trwałej ruiny na grzbiecie wapiennym.",
      "Bobolice długo były ruiną; prywatna odbudowa przywróciła bryłę i udostępniła wnętrza turystom. Historycy spierają się o zakres rekonstrukcji — dla zwiedzającego to jednak czytelny obraz średniowiecznej warowni.",
      "Ścieżka ~1,5 km między zamkami (błonia) łączy obie atrakcje w jedną wyprawę; Skały Mirowskie dopełniają krajobraz.",
    ],
    takeaway:
      "Mirów = autentyczna ruina; Bobolice = odbudowa z biletem. Razem dają pełny kontrast Orlich Gniazd.",
  },
  {
    id: "historia-pustynia",
    place: "Pustynia Błędowska",
    dayLabel: "Dzień 3",
    lead:
      "Największy w Polsce kompleks lotnych piasków — efekt przyrody i gospodarki człowieka, nie „sahary z Afryki”.",
    paragraphs: [
      "Piaski powstały m.in. przez wylesienie i eksploatację (pasterstwo, hutnictwo, późniejsze działania człowieka). Wiatr formował wydmy na podłożu związanym z Pradoliną.",
      "W XX wieku pustynia służyła też wojsku i ćwiczeniom; dziś to teren chroniony z punktami widokowymi (Róża Wiatrów, Czubatka) i infrastrukturą turystyczną.",
      "Wstęp na punkty widokowe jest bezpłatny — to krajobraz edukacyjny i fotograficzny, nie biletowany park rozrywki.",
    ],
    takeaway:
      "Pustynia to unikat Jury: piasek i panorama, nie zamek. Róża Wiatrów = wygoda; Czubatka = zachód.",
  },
  {
    id: "historia-zloty-potok",
    place: "Złoty Potok — osadnictwo i nazwa",
    dayLabel: "Dzień 4",
    lead:
      "Osada Potok wzmiankowana już w XII w.; „Złoty” w nazwie i poetyckie toponimy zawdzięczamy głównie Krasińskiemu (1857).",
    paragraphs: [
      "Tradycja lokalna sięga m.in. 1153 (ośrodek hutniczy / szkła). W XV w. wzmiankowana wieża obronna właścicieli herbu Śrzeniawa — zalążek późniejszego założenia pałacowego.",
      "W 1851 dobra kupił gen. Wincenty Krasiński. Latem 1857 w dworku mieszkał syn — poeta Zygmunt Krasiński z rodziną. Wędrówki po dolinie Wiercicy zaowocowały nazwami atrakcji, które znamy dziś.",
      "Według przekazów to on spopularyzował też określenie Złoty Potok. Pobyt przerwała śmierć czteroletniej córki Elżbiety — rodzina wyjechała do Paryża.",
    ],
    takeaway:
      "Dzień 4 to spacer śladami Krasińskiego: skały, źródła i stawy mają imiona z 1857, nie z średniowiecza.",
  },
  {
    id: "historia-brama-twardowskiego",
    place: "Brama Twardowskiego",
    dayLabel: "Dzień 4",
    lead:
      "Naturalny ostaniec z prześwitem — nazwa i legenda z czasów romantycznego nazewnictwa Krasińskiego.",
    paragraphs: [
      "Skała powstała przez erozję wapienia jury; prześwit to efekt procesów krasowych i wietrzenia, nie „budowy” człowieka.",
      "Nazwę wiąże się z legendą o Panie Twardowskim uciekającym przed diabłem (kogut, księżyc). To folklor / poetycka etykieta z XIX w., nie dokument historyczny.",
      "Dziś to jeden z najczęściej fotografowanych punktów rezerwatu Parkowe — łatwy dojazd, krótki spacer od parkingu.",
    ],
    takeaway:
      "Geologia + legenda. Warto zobaczyć formę skały; historię „Twardowskiego” traktujcie jako opowieść, nie fakt sądowy.",
  },
  {
    id: "historia-zrodla",
    place: "Źródła Zygmunta i Elżbiety",
    dayLabel: "Dzień 4",
    lead:
      "Krasowe wywierzyska Wiercicy — nazwane od dzieci Zygmunta Krasińskiego.",
    paragraphs: [
      "Woda wypływa z wapiennego podłoża Jury; źródła dają początek potokowi Wiercica w dolinie objętej później rezerwatem Parkowe (od 1957).",
      "Źródło Elżbiety leży bliżej drogi, Zygmunta nieco głębiej w lesie — obie nazwy nadał poeta w 1857.",
      "Czysta, chłodna woda zasilała też lokalną gospodarkę wodną i późniejszą pstrągarnię Raczyńskich.",
    ],
    takeaway:
      "To prawdziwe źródła krasowe z romantycznymi imionami — nie „studnie” turystyczne.",
  },
  {
    id: "historia-amerykan",
    place: "Staw Amerykan",
    dayLabel: "Dzień 4",
    lead:
      "Od „Stawu Gorzkich Łez” Krasińskiego do Amerykana Raczyńskich — i pstrąga tęczowego.",
    paragraphs: [
      "Krasiński nazwał staw „Gorzkich Łez” po śmierci córki Elżbiety (1857). Pod koniec XIX w. Raczyńscy zmienili nazwę na Amerykan.",
      "Powód: transport ikry pstrąga tęczowego z Ameryki (ok. 1881) — eskortowany m.in. przez senatora USA, na którego cześć zmieniono nazwę. Tak powstała słynna pstrągarnia (jedna z najstarszych w Europie kontynentalnej).",
      "Dziś staw to miejsce spacerów, rekreacji i imprez plenerowych; wokół deptak i infrastruktura turystyczna.",
    ],
    takeaway:
      "Staw łączy osobistą tragedię poety z historią hodowli pstrąga — stąd „Amerykan”, nie tylko ładna woda.",
  },
  {
    id: "historia-palac-raczynskich",
    place: "Pałac Raczyńskich i park",
    dayLabel: "Dzień 4",
    lead:
      "Od wieży/dworu obronnego przez Krasińskich do neoklasycystycznej siedziby Raczyńskich.",
    paragraphs: [
      "Na wzniesieniu istniał wcześniej dwór/zameczek. W połowie XIX w. gen. Wincenty Krasiński wzniósł/przebudował rezydencję klasycystyczną; w 1857 gościł tu Zygmunt.",
      "Po ślubie Marii Krasińskiej z Raczyńskimi majątek przeszedł w ich ręce. Herb Nałęcz, portyk z kolumnami, park krajobrazowy (m.in. projekty z przełomu XIX/XX w.) — pałac był siedzibą do 1939.",
      "Wojna i lata powojenne: wywóz/zniszczenie wyposażenia, upaństwowienie, szkoła w murach. Dziś obiekt bywa niedostępny wewnątrz i wymaga opieki; park i bryła zewnętrzna nadal robią wrażenie. Dworek Krasińskiego obok działa jako muzeum (od 2008 w obecnej formule).",
    ],
    takeaway:
      "Pałac oglądajcie z zewnątrz i w parku; żywą pamięć Krasińskiego niesie dworek-muzeum.",
  },
  {
    id: "historia-diabelskie-mosty",
    place: "Diabelskie Mosty",
    dayLabel: "Dzień 4 · opcja",
    lead:
      "Ostańce ze szczelinami — nazwa Krasińskiego; kiedyś drewniane kładki na szczycie.",
    paragraphs: [
      "Skały (m.in. Skała z Mostem, Diabelski Most) to formy wapienne w północnej części Parkowego. Legenda mówi o diable i szczelinach — znowu warstwa folkloru.",
      "Do lat 60. XX w. na skałach bywały drewniane kładki/„mosty” — stąd praktyczna część nazwy. Dziś zostaje sam krajobraz i ścieżka.",
      "Krótki spacer wystarczy; wejście na skałki wymaga ostrożności (ślisko po deszczu).",
    ],
    takeaway:
      "Opcja dla lubiących skałki — nie obowiązek dnia. Historia nazwy = poeta + dawne kładki.",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Ile dni warto zaplanować z bazą w Podzamczu?",
    answer:
      "4 dni dają pełny przekrój: zamki lokalne, długa pętla Olsztyn, Bobolice/Mirów + pustynia, Złoty Potok. W 3 dni pomiń dzień 4 albo zamień dzień 2 na krótszą wersję (zamek + Biakło).",
  },
  {
    question: "Czy dzień 2 da się skrócić?",
    answer:
      "Tak: zamek + Biakło + Lipówki bez pełnego okrążenia Sokolich Gór. Pełna pętla ~16 km według jura.travel.",
  },
  {
    question: "Jak dojechać między dniami?",
    answer:
      "Autem z Podzamcza: Olsztyn ~45–55 min; Bobolice ~20–25 min; Róża Wiatrów ~25–35 min; Złoty Potok ~30–40 min. Każdy dzień wraca do bazy.",
  },
  {
    question: "Czy trzeba iść obie pętle w Podzamczu?",
    answer:
      "Nie. Punkt startowy obu jest centrum Podzamcza — możesz zrobić tylko zamek albo tylko Birów.",
  },
  {
    question: "Bobolice i Mirów — oba, czy wystarczy jeden?",
    answer:
      "Warto oba: leżą ~1,5 km od siebie, bilet łączony z błoniami obejmuje ścieżkę. Samo Bobolice to rekonstrukcja; Mirów daje klimat ruin.",
  },
  {
    question: "Złoty Potok — czy wystarczy pół dnia?",
    answer:
      "Na Bramę, źródła, spacer wokół stawów (Amerykan) i park pałacowy spokojnie wystarczy 4–6 h. Diabelskie Mosty dołóżcie tylko jeśli chcecie krótki odcinek skałkowy.",
  },
  {
    question: "Czy w 1587 Habsburgowie wymordowali ludność Podzamcza?",
    answer:
      "Nie ma wiarygodnych źródeł o wymordowaniu ani gwałtach. Potwierdzone jest zajęcie zamku (i prawdopodobne ograbienie).",
  },
];

export const externalLinks = {
  zamek: "https://www.zamek-ogrodzieniec.pl/",
  seniorka:
    "https://seniorka-z-plecakiem.pl/szlakami-po-jurze-zamek-dawny-grod-i-winnica-mapa/",
  olsztynRoute:
    "https://jura.travel/route/1019758/wycieczka-z-olsztyna-przez-sokole-gory-na-biaklo",
  bobolice: "https://zamekbobolice.pl/",
  zlotyPotok:
    "https://www.turystykazarki.pl/artykuly/24",
  stronyInternetowe: "https://odart.pl/strony-internetowe/",
  opiekaIt: "https://odart.pl/opieka-it-dla-firm-kolobrzeg/",
  athensPlan: "/plan-wycieczki-ateny-2-dni/",
} as const;

export const seoKeywords = [
  "plan wycieczki Jura 4 dni",
  "Podzamcze Ogrodzieniec",
  "Olsztyn Sokole Góry",
  "Góra Biakło",
  "Zamek Olsztyn",
  "Zamek Bobolice Mirów",
  "Pustynia Błędowska Róża Wiatrów",
  "Złoty Potok Brama Twardowskiego",
  "Źródła Zygmunta i Elżbiety",
  "Staw Amerykan Złoty Potok",
  "Pałac Raczyńskich",
  "Diabelskie Mosty Parkowe",
  "szlak Orlich Gniazd",
  "wycieczka Jura Krakowsko-Częstochowska",
  "Zamek Ogrodzieniec historia",
  "historia Złoty Potok Krasiński",
  "historia Bobolice Mirów",
];
