/**
 * =============================================================================
 * EDYCJA TREŚCI — plan wycieczki Ateny (ODART)
 * -----------------------------------------------------------------------------
 * HOTEL / BAZA:     `hotelStreetLine`, `hotelName`, `hotelArea`, `hotelLat` / `hotelLng` — wszystkie „starty” na mapach
 * GODZINY:          tablice `day1Schedule`, `day2Schedule` (pole `time`, `label`)
 * CENY:             `day1Costs`, `day2Costs`, `costsTableRows`, `day2TicketNote`
 * LINKI:            `ctaLinks`, `contactMailto` w komponencie strony + tu `externalLinks`
 * ZDJĘCIA / HERO:   `heroImageUrl` (Next/Image), `heroImageAlt`
 * MAPY (współrz.):  `day1MapPoints` … `day6MapPoints` — lat/lng oraz popupy
 * DNI 3–5:          `day3TransportSteps`, `day3BringItems`, restauracje, itd.
 * =============================================================================
 */

export type MapPoint = {
  order: number;
  title: string;
  lat: number;
  lng: number;
  popupDescription: string;
};

export type ScheduleItem = {
  time: string;
  label: string;
  icon?:
    | "walk"
    | "sight"
    | "food"
    | "museum"
    | "hill"
    | "default"
    | "car"
    | "waves"
    | "coffee"
    | "ship";
};

export type AttractionCard = {
  title: string;
  bullets: string[];
};

/** Obraz hero — podmień URL na własny plik z /public lub zewnętrzny (dozwolona domena w next.config). */
export const heroImageUrl =
  "https://images.unsplash.com/photo-1555993539-1732b0258235?w=1920&q=85";
export const heroImageAlt = "Panorama Aten z Akropolis o zachodzie słońca";

/** Ulica i numer — jak w adresie zamieszkania. */
export const hotelStreetLine = "Mirmidonon 20";
/** Współrzędne przybliżone (Petralona / Άνω Πετράλωνα, OSM). Doprecyzuj przy pinie w Google Maps, jeśli chcesz dokładniej pod dom. */
export const hotelLat = 37.9746;
export const hotelLng = 23.7133;
export const hotelName = `Nocleg — ul. ${hotelStreetLine}, Petralona`;
export const hotelArea = "Petralona";

export const introParagraphs: string[] = [
  "Sześciodniowy plan łączy Ateny z wypadem do Delf, relaksem nad Vouliagmeni, wyspą Aeginą i finałowym dniem w mieście z Agorą i Likavitos o zachodzie — bez chaosu i z realnymi godzinami.",
  `Baza noclegowa to ul. ${hotelStreetLine} (${hotelArea}, Ateny): wygodny start do centrum, portu w Pireusie, wyjazdu do Delf i wypadów „na relaks”.`,
  "Dzień 1 — lekki start; dzień 2 — Akropol i stare miasto; dzień 3 — Vouliagmeni; dzień 4 — wyjazd do Delf; dzień 5 — Aegina; dzień 6 — Agora, Hefajstos, Stoa, Monastiraki i Likavitos jako zamknięcie.",
  "Dla grupy około 11 osób: transport dzielony (Uber/Bolt, autokar do Delf), marginesy czasu i lunch bez pośpiechu.",
];

export const day1Title =
  "Dzień 1 – Parlament, ogród, stadion, Kolonaki, Łuk Hadriana, Zeus i lekki wieczór";

export const day1Lead =
  "Lekki pierwszy dzień dla grupy: późniejszy start od śniadania, klasyka centrum bez muzeum i bez Likavitos (wzgórze w dniu 6), z praktycznymi zakupami i miejscem na luz.";

export const day1Schedule: ScheduleItem[] = [
  { time: "9:00–10:30", label: "Śniadanie + spokojny start (bez pośpiechu)", icon: "food" },
  { time: "11:00", label: "Parlament (Syntagma) — zmiana warty, zdjęcia, klimat placu", icon: "sight" },
  { time: "11:30", label: "Spacer do Ogrodu Narodowego", icon: "walk" },
  { time: "11:40–12:10", label: "Ogród Narodowy — krótki chill w cieniu", icon: "walk" },
  { time: "12:20–13:10", label: "Stadion Panateński — wejście, zdjęcia, szybkie zwiedzanie", icon: "sight" },
  { time: "13:20–14:30", label: "Lunch w Kolonaki (dłuższa przerwa przy ~11 os.)", icon: "food" },
  { time: "14:45", label: "Łuk Hadriana — krótki przystanek (~5 min)", icon: "sight" },
  { time: "15:00–15:15", label: "Świątynia Zeusa Olimpijskiego (Olimpiejon)", icon: "sight" },
  {
    time: "15:30–17:00",
    label: `Spacer, luz, powrót w stronę bazy (${hotelArea}) — kawa, lody, zdjęcia`,
    icon: "coffee",
  },
  { time: "17:00–18:00", label: "Zakupy: supermarket + piekarnia", icon: "default" },
  {
    time: "18:30+",
    label: "Opcjonalnie: kolacja, drink lub krótki Monastiraki (jeśli starczy sił)",
    icon: "food",
  },
];

export const day1Attractions: AttractionCard[] = [
  {
    title: "Parlament i zmiana warty",
    bullets: [
      "Start ok. 11:00 — zmiana warty bywa nieco później niż „klasyczne” 10:00 i to w porządku.",
      "Evzones i plac Syntagma — zdjęcia i krótki, reprezentacyjny moment historii żywej.",
      "Dla grupy: ustalcie z góry miejsce zbiórki po ceremonii, żeby nie rozproszyć się w tłumie.",
    ],
  },
  {
    title: "Ogród Narodowy",
    bullets: [
      "Krótszy blok (~30 min) — wystarczy na oddech i cień, bez „zjadania” całego dnia.",
      "Spokojny spacer przed stadionem; ławki i toalety pod ręką.",
    ],
  },
  {
    title: "Stadion Panateński",
    bullets: [
      "Wejście do środka, szybsze tempo zwiedzania — forma, nie maraton muzealny.",
      "Marmur i zdjęcia na bieżni — mocny, zrozumiały punkt programu.",
    ],
  },
  {
    title: "Kolonaki — lunch",
    bullets: [
      "Dłuższa przerwa obiadowa — ważna przy jedenastu osobach i różnym tempie jedzenia.",
      "Elegancka dzielnica: dobre restauracje i kawiarnie w zasięgu krótkiego spaceru.",
    ],
  },
  {
    title: "Łuk Hadriana i Olimpiejon",
    bullets: [
      "Łuk Hadriana: krótki postój (~5 min) — łatwy do zrobienia „w passingu”.",
      "Świątynia Zeusa Olimpijskiego: 10–15 min na miejscu — uzupełnienie antycznych Aten bez długiej ekspozycji.",
      "Bilet na Olimpiejon sprawdź przed wyjazdem (orientacyjnie kilka–kilkanaście €).",
    ],
  },
  {
    title: "Luz, zakupy i wieczór",
    bullets: [
      `Popołudnie na kawę, lody i powolny powrót w stronę bazy (${hotelArea}) — bez presji kolejnych wejść biletowych.`,
      "17:00–18:00: supermarket + piekarnia — praktycznie ogarnięte zapasy na kolejne dni.",
      "Po 18:30 opcjonalnie: lekka kolacja, drink albo krótki skok na Monastiraki, jeśli grupa ma jeszcze energię.",
    ],
  },
];

export const day1StepsLabel = "około 9–13 tys. kroków";
/** EDIT: ceny stadionu i Olimpiejonu — weryfikuj przed wyjazdem */
export const day1Costs =
  "Stadion ok. 10 €, Olimpiejon ok. 6–12 € (sezonowo) — łącznie ok. 16–22 € na osobę bez lunchu i zakupów spożywczych.";

/**
 * Dzień 1 — kolejność na mapie (1–9). Bez Benaki i Likavitos.
 * EDIT: lat/lng — np. Google Maps → współrzędne; punkt „Zakupy” podmień na swój sklep.
 */
export const day1MapPoints: MapPoint[] = [
  {
    order: 1,
    title: `Baza — ul. ${hotelStreetLine} (Petralona)`,
    lat: hotelLat,
    lng: hotelLng,
    popupDescription: `Śniadanie i spokojny start — adres: ${hotelStreetLine}.`,
  },
  {
    order: 2,
    title: "Parlament / Syntagma",
    lat: 37.9756,
    lng: 23.7349,
    popupDescription: "Zmiana warty i plac — serce dzisiejszego bloku miejskiego.",
  },
  {
    order: 3,
    title: "Ogród Narodowy",
    lat: 37.9732,
    lng: 23.7368,
    popupDescription: "Krótki spacer w zieleni między placem a stadionem.",
  },
  {
    order: 4,
    title: "Stadion Panateński",
    lat: 37.9683,
    lng: 23.7413,
    popupDescription: "Kallimarmaro — wejście i szybkie zwiedzanie.",
  },
  {
    order: 5,
    title: "Kolonaki",
    lat: 37.9782,
    lng: 23.7395,
    popupDescription: "Lunch — dłuższa przerwa w eleganckiej dzielnicy.",
  },
  {
    order: 6,
    title: "Łuk Hadriana",
    lat: 37.9707,
    lng: 23.7327,
    popupDescription: "Krótki przystanek przy bramie miasta Hadriana.",
  },
  {
    order: 7,
    title: "Świątynia Zeusa Olimpijskiego",
    lat: 37.9693,
    lng: 23.7331,
    popupDescription: "Kolumny Olimpiejonu — krótka wizyta z biletem.",
  },
  {
    order: 8,
    title: `Zakupy — okolica ${hotelArea}`,
    lat: 37.9758,
    lng: 23.7145,
    popupDescription: "Supermarket + piekarnia w okolicy Petralony — podmień na swój adres sklepu.",
  },
  {
    order: 9,
    title: "Monastiraki (opcjonalnie wieczorem)",
    lat: 37.9757,
    lng: 23.7259,
    popupDescription: "Krótki wieczorny klimat targu — tylko jeśli grupa ma siły.",
  },
];

export const day2Title =
  "Dzień 2 – Akropol, Muzeum Akropolu, Anafiotika, Plaka i Monastiraki";

export const day2Lead =
  "Drugi dzień skupia się na najbardziej klasycznych i pocztówkowych Atenach — starożytności, białych uliczkach, klimatycznych zaułkach i wieczornym spacerze.";

export const day2Schedule: ScheduleItem[] = [
  { time: "8:30", label: `Wyjście z hotelu w ${hotelArea}`, icon: "walk" },
  { time: "9:00–11:00", label: "Akropol", icon: "sight" },
  { time: "11:15–12:45", label: "Muzeum Akropolu", icon: "museum" },
  { time: "13:00–14:00", label: "Spacer przez Anafiotika", icon: "walk" },
  { time: "14:00–15:30", label: "Lunch w Plaka", icon: "food" },
  { time: "15:30–17:00", label: "Spacer po Plaka", icon: "walk" },
  { time: "17:00–18:30", label: "Monastiraki i okolice", icon: "sight" },
  {
    time: "18:30–20:00",
    label: "Rooftop / kolacja — widok na Akropol",
    icon: "food",
  },
];

export const day2Attractions: AttractionCard[] = [
  {
    title: "Akropol",
    bullets: [
      "Partenon i Erechtejon — klasyka starożytnych Aten w jednym miejscu.",
      "Obowiązkowy punkt programu; najlepiej wejść rano, by uniknąć największego upału i tłumów.",
      "Spacer po wzgórzu z widokami na miasto nagradza wcześniejsze wstawanie.",
    ],
  },
  {
    title: "Muzeum Akropolu",
    bullets: [
      "Nowoczesne muzeum u podnóża wzgórza — świetne uzupełnienie wizyty na Akropolu.",
      "Czytelna ekspozycja i kontekst dla zabytków z wzgórza.",
      "Warto zaplanować czas bez pośpiechu — szczególnie przy większej grupie.",
    ],
  },
  {
    title: "Anafiotika",
    bullets: [
      "Białe uliczki przypominające greckie wyspy — kameralny klimat.",
      "Idealne miejsce na zdjęcia i spokojniejszy odcinek dnia.",
      "Krótki „oddech” między monumentalnym Akropolem a tętniącą Plaką.",
    ],
  },
  {
    title: "Plaka",
    bullets: [
      "Klasyczne Ateny: tawerny, sklepy i boczne uliczki pełne detali.",
      "Dobry rejon na lunch i dłuższy relaks w środku dnia.",
      "Można dopasować trasę do tempa grupy — wiele krótszych pętli.",
    ],
  },
  {
    title: "Monastiraki",
    bullets: [
      "Bardziej miejski i żywy klimat — targi, sklepy i place.",
      "Widoki na Akropol z perspektywy zatłoczonego centrum.",
      "Dobry moment na lokalne zakupy i wieczorną atmosferę.",
    ],
  },
  {
    title: "Rooftop / kolacja",
    bullets: [
      "Finał dnia z widokiem na oświetlony Akropol.",
      "Warto zarezerwować stolik wcześniej przy większej grupie.",
      "Podsumowanie wyjazdu w jednym z najbardziej fotogenicznych ustawień miasta.",
    ],
  },
];

export const day2StepsLabel = "około 10–13 tys. kroków";

/** EDIT: orientacyjny koszt biletu łączonego / sezonu — sprawdź przed wyjazdem. */
export const day2AcropolisComboEstimate = "20–36 € (orientacyjnie, sezonowo)";

export const day2Costs = `Akropol + Muzeum Akropolu: ok. ${day2AcropolisComboEstimate} na osobę (łączny bilet bywa dostępny — weryfikuj na oficjalnych stronach).`;

export const day2TicketNote =
  "Ceny biletów i dostępność slotów czasowych zmieniają się — sprawdź je tuż przed wyjazdem i rozważ wcześniejszy zakup online.";

export const day2MapPoints: MapPoint[] = [
  {
    order: 1,
    title: `Baza — ul. ${hotelStreetLine} (Petralona)`,
    lat: hotelLat,
    lng: hotelLng,
    popupDescription: "Wyjście na drugi dzień zwiedzania.",
  },
  {
    order: 2,
    title: "Akropol",
    lat: 37.9715,
    lng: 23.7267,
    popupDescription: "Wzgórze z Partenonem i świątyniami — serce starożytnych Aten.",
  },
  {
    order: 3,
    title: "Muzeum Akropolu",
    lat: 37.9689,
    lng: 23.7285,
    popupDescription: "Nowa siedziba muzeum przy Dionizou Areopagitou.",
  },
  {
    order: 4,
    title: "Anafiotika",
    lat: 37.9724,
    lng: 23.7294,
    popupDescription: "Białe domki i wąskie schody u stóp Akropolu.",
  },
  {
    order: 5,
    title: "Plaka",
    lat: 37.972,
    lng: 23.7306,
    popupDescription: "Historyczne centrum z tawernami i zaułkami.",
  },
  {
    order: 6,
    title: "Monastiraki",
    lat: 37.9757,
    lng: 23.7259,
    popupDescription: "Plac, targ i widoki na wzgórze — żywe centrum.",
  },
  {
    order: 7,
    title: "Rooftop / punkt widokowy",
    lat: 37.9764,
    lng: 23.7248,
    popupDescription: "Rejon barów i restauracji z widokiem na oświetlony Akropol (wybierz lokal i zarezerwuj).",
  },
];

// --- DZIEŃ 3 (EDIT: godziny, ceny, współrzędne, restauracje) ---
export const day3Title = "Dzień 3 – Ciepłe jezioro Vouliagmeni i relaks nad morzem";
export const day3Lead =
  "Dzień bez pośpiechu – regeneracja po zwiedzaniu i prawdziwy wakacyjny klimat.";

export const day3Schedule: ScheduleItem[] = [
  { time: "9:00", label: `Wyjście z hotelu (${hotelArea})`, icon: "walk" },
  { time: "9:15", label: "Zamówienie Uberów / Boltów (3 auta)", icon: "car" },
  { time: "9:30", label: "Wyjazd w stronę Vouliagmeni", icon: "car" },
  { time: "10:15", label: "Przyjazd nad jezioro", icon: "sight" },
  { time: "10:30–14:30", label: "Kąpiele w jeziorze i relaks", icon: "waves" },
  { time: "14:30–16:00", label: "Lunch nad morzem", icon: "food" },
  { time: "16:00–17:30", label: "Spacer / kawa", icon: "coffee" },
  { time: "17:30", label: "Powrót transportem do miasta", icon: "car" },
  { time: "18:30", label: "Ateny — wieczór w bazie", icon: "default" },
];

export const day3StepsLabel = "około 5–9 tys. kroków";
/** EDIT: koszt dzień 3 (wstępy, transport dzielony, lunch) */
export const day3Costs =
  "Transport 3× Uber/Bolt (15–20 € za auto, dzielone w aucie) + ewent. wstęp na jezioro / lunch — orientacyjnie ok. 30–50 € na osobę.";

export const day3Attractions: AttractionCard[] = [
  {
    title: "Jezioro Vouliagmeni",
    bullets: [
      "Ciepła woda termalna i klimat „naturalnego basenu” w skale — idealne po dwóch dniach chodzenia.",
      "Możliwość dłuższego pobytu: leżaki, cień i spokojniejsze tempo niż w centrum Aten.",
      "Sprawdź aktualne ceny wstępu i godziny otwarcia przed wyjazdem.",
    ],
  },
  {
    title: "Nad morzem w okolicy",
    bullets: [
      "Po jeziorze zostaje czas na lunch z widokiem na wodę i krótki spacer po nadmorskiej okolicy.",
      "To dzień na regenerację — bez listy „obowiązkowych” zabytków.",
    ],
  },
];

/** EDIT: kroki logistyczne dla 11 osób */
export const day3TransportSteps: string[] = [
  `Ustal jeden punkt zbiórki przy adresie ${hotelStreetLine} (np. 2–3 min spaceru od wejścia).`,
  "Zamów jednocześnie 3 kursy Uber / Bolt (4 + 4 + 3 osoby) na adres Lake Vouliagmeni lub okoliczny parking — unikniesz rozjechania się w czasie.",
  "Potwierdź z kierowcami, że cel to Vouliagmeni (południe od Aten); czas jazdy zwykle 30–40 min w zależności od ruchu.",
  "Po dotarciu: zbiórka przy wejściu / kasie jeziora, krótkie ogłoszenie planu powrotu (np. wspólny slot ok. 17:30).",
  `Powrót tą samą logiką — 3 auta z powrotem pod adres ${hotelStreetLine}.`,
];

export const day3TransportSummary =
  "3 auta Uber/Bolt · ok. 15–20 € za kurs · 30–40 min jazdy — koszt dzielicie wewnątrz aut.";

/** EDIT: lista rzeczy na dzień przy wodzie */
export const day3BringItems: string[] = [
  "Strój kąpielowy",
  "Ręcznik",
  "Klapki",
  "Krem SPF",
  "Woda do picia",
];

export const day3OnSiteBuying: string[] = [
  "Na miejscu działa restauracja i bar — można zjeść i napić się bez wychodzenia z obiektu.",
  "Nie ma typowego bazaru ani sieciówek „tanim sklepem” — raczej klimat premium i ceny z tym zgodne.",
  "Warto mieć gotówkę lub kartę; drobne na tipy bywają przydatne.",
];

export type NamedPlace = { name: string; note: string };

/** EDIT: nazwy i opisy restauracji (współrzędne osobno w day3MapPoints) */
export const day3Restaurants: NamedPlace[] = [
  { name: "Sardelaki me Thea", note: "Ryby i owoce morza — często z widokiem; sprawdź rezerwację w sezonie." },
  { name: "Ithaki", note: "Klimat greckiej tawerny w okolicy nadmorskiej." },
  { name: "Okeanis", note: "Dobry wybór na lunch po kąpieli — dopasuj do gustu grupy." },
];

export const day3MapPoints: MapPoint[] = [
  {
    order: 1,
    title: `Start — ul. ${hotelStreetLine}`,
    lat: hotelLat,
    lng: hotelLng,
    popupDescription: "Wyjście z bazy; stąd zamawiacie transport na Vouliagmeni.",
  },
  {
    order: 2,
    title: "Jezioro Vouliagmeni",
    lat: 37.8159,
    lng: 23.7907,
    popupDescription: "Kąpielisko termalne w zatoce skalnej — główny cel dnia.",
  },
  {
    order: 3,
    title: "Plaża / nadmorski brzeg (okolica)",
    lat: 37.8182,
    lng: 23.785,
    popupDescription: "Rejon plażowy i spacerowy blisko Vouliagmeni — orientacyjny punkt nad morzem.",
  },
  {
    order: 4,
    title: "Sardelaki me Thea",
    lat: 37.8154,
    lng: 23.7914,
    popupDescription: "Restauracja w okolicy — lunch z widokiem (rezerwacja zalecana).",
  },
  {
    order: 5,
    title: "Ithaki",
    lat: 37.8147,
    lng: 23.7892,
    popupDescription: "Tawerna — jedna z propozycji na posiłek.",
  },
  {
    order: 6,
    title: "Okeanis",
    lat: 37.8178,
    lng: 23.7862,
    popupDescription: "Lunch / kolacja w stylu nadmorskim — do wyboru grupy.",
  },
];

// --- DZIEŃ 4 — DELFY (EDIT: godziny zbiórki, operator autokaru, ceny biletów) ---
export const day4Title = "Dzień 4 – Wyjazd do Delf: sanktuarium Apollina i dzień poza Atenami";
export const day4Lead =
  "Całodniowa wycieczka w góry Fokidy — najwygodniej jako wynajęty autokar / bus dla grupy lub zaplanowana wycieczka z przewodnikiem. Poniżej orientacyjny szkielet; godziny dostosuj do kursu i ruchu.";

export const day4Schedule: ScheduleItem[] = [
  { time: "6:45", label: `Zbiórka przy hotelu / ${hotelArea} — wyjście do transportu`, icon: "walk" },
  { time: "7:15", label: "Wyjazd z Aten w stronę Delf (autokar / bus)", icon: "car" },
  { time: "10:30", label: "Przyjazd do Delf — krótka przerwa przed wejściem", icon: "coffee" },
  { time: "11:00–13:30", label: "Stanowisko archeologiczne — sanktuarium Apollina, teatr, ścieżka Świętej", icon: "sight" },
  { time: "13:30–14:30", label: "Lunch w Delfach lub Arachowie", icon: "food" },
  { time: "14:45–15:45", label: "Muzeum Archeologiczne w Delfach", icon: "museum" },
  { time: "16:00", label: "Wyjazd powrotny do Aten", icon: "car" },
  { time: "19:00–19:30", label: `Powrót do Aten / bazy (${hotelArea})`, icon: "default" },
];

export const day4StepsLabel = "dużo stania na stanowisku + transfer — orientacyjnie 7–11 tys. kroków";
export const day4Costs =
  "Autokar / bus dla grupy lub miejsce na wycieczce zorganizowanej: szeroki zakres (orientacyjnie 40–90 € / osoba) + lunch + bilety wstępu na stanowisko i do muzeum — weryfikuj u organizatora i na oficjalnych stronach.";

export const day4Attractions: AttractionCard[] = [
  {
    title: "Sanktuarium Apollina",
    bullets: [
      "Ruiny i naturalna amfiteatralna sceneria wąwozu — serce mitów o wyroczni.",
      "Warto mieć wodę, nakrycie głowy i wygodne buty na kamienne ścieżki.",
    ],
  },
  {
    title: "Teatr i pozostałe zabytki stanowiska",
    bullets: [
      "Teatr, pozostałości skarbca — spokojne tempo zwiedzania z przewodnikiem lub audio.",
      "Unikaj pośpiechu: dzień jest długi przez dojazd.",
    ],
  },
  {
    title: "Muzeum w Delfach",
    bullets: [
      "W tym m.in. Wózneta — świetne domknięcie narracji po ruinach.",
      "Sprawdź godziny otwarcia i ewentualne bilety łączone ze stanowiskiem.",
    ],
  },
];

/** EDIT: logistyka wyjazdu do Delf */
export const day4DelphiTransportTips: string[] = [
  "Dla ~11 osób najpewniejszy jest wynajęty autokar lub bus z kierowcą — jedna zbiórka, jedna trasa powrotna.",
  "Alternatywa: kilka osobowych aut lub organizowana wycieczka dnia z biura (wtedy dostosuj harmonogram do ich rozkładu).",
  "Dojazd z Aten do Delf to zwykle ok. 2,5–3 h w jedną stronę — zaplanuj przerwy na postój.",
];

/** EDIT: na miejscu w Delfach */
export const day4DelphiOnSiteTips: string[] = [
  "Lunch w Delfach lub w pobliskiej Arachowie — rezerwacja przy większej grupie bywa pomocna w sezonie.",
  "Słońce i nachylenia: krem SPF i warstwy na pogodę w górach.",
  "Bilety na stanowisko + muzeum — sprawdź pakiety i ewentualne limity wejść.",
];

export const day4MapPoints: MapPoint[] = [
  {
    order: 1,
    title: `Baza — ul. ${hotelStreetLine}`,
    lat: hotelLat,
    lng: hotelLng,
    popupDescription: "Wyjście z bazy przed transferem do autokaru / punktu zbiórki.",
  },
  {
    order: 2,
    title: "Stanowisko archeologiczne w Delfach",
    lat: 38.4824,
    lng: 22.5014,
    popupDescription: "Sanktuarium i ruiny — główny cel wyjazdu.",
  },
  {
    order: 3,
    title: "Muzeum Archeologiczne w Delfach",
    lat: 38.4812,
    lng: 22.4993,
    popupDescription: "Ekspozycja przy stanowisku — Wózneta i znaleziska z wykopalisk.",
  },
  {
    order: 4,
    title: "Delfy — miasteczko (lunch)",
    lat: 38.4838,
    lng: 22.4975,
    popupDescription: "Orientacyjny punkt na posiłek w zabudowie u podnóża stanowiska.",
  },
];

// --- DZIEŃ 5 ---
export const day5Title = "Dzień 5 – Wyspa Aegina: grecki klimat, morze i pełen relaks";
export const day5Lead =
  "Najlepszy sposób, żeby poczuć prawdziwą Grecję – tylko ok. 40 minut promem od Aten.";

export const day5Schedule: ScheduleItem[] = [
  { time: "8:30", label: `Wyjazd z bazy (${hotelStreetLine}) do portu Pireus (Ubery)`, icon: "car" },
  { time: "9:15", label: "Port Pireus — orientacja, bilety", icon: "walk" },
  { time: "10:00", label: "Odpłynięcie promem", icon: "ship" },
  { time: "10:45", label: "Przybycie do portu Aegina", icon: "sight" },
  { time: "11:00–13:00", label: "Spacer po porcie + kawa", icon: "coffee" },
  { time: "13:00–15:00", label: "Plaża / kąpiel", icon: "waves" },
  { time: "15:00–16:30", label: "Lunch nad wodą", icon: "food" },
  { time: "17:00", label: "Prom powrotny", icon: "ship" },
  { time: "18:00–19:00", label: `Powrót do Aten / bazy (${hotelArea})`, icon: "car" },
];

export const day5StepsLabel = "około 6–11 tys. kroków";
export const day5Costs =
  "Ubery do Pireusu (3 auta, dzielone) + prom ok. 10–20 € w zależności od operatora i klasy + lunch — orientacyjnie 30–50 € na osobę.";

export const day5HowToGet: string[] = [
  `Z bazy przy ul. ${hotelStreetLine} zamów 3 kursy Uber/Bolt do portu w Pireusie (np. terminal promów do Sarońskich — potwierdź numer przy promie).`,
  "Czas dojazdu zależy od ruchu; zarezerwuj bufor przed odpłynięciem.",
  "Bilety na prom kup online lub w kasie — w sezonie wcześniej.",
  "Orientacyjnie rejs 40–60 min w jedną stronę (zależnie od linii i przystanku).",
];

export const day5OnIsland: string[] = [
  "Spacer po nabrzeżu i porcie — klimat wyspy od pierwszych minut.",
  "Czas na plażę i kąpiel w morzu (dopasuj miejsce do pogody i chęci grupy).",
  "Restauracje nad wodą — ryby, owoce morza, widok na gajki i żaglówki.",
  "Lokalna specjalność: pistacje z Aeginy — idealne jako słodki upominek.",
];

export const day5Beaches: string[] = [
  "Blisko portu: szybki dostęp do kąpieli bez długiego dojazdu — wygodne przy ciasnym harmonogramie.",
  "Agia Marina: plaża zwykle lepsza pod kątem kąpieli; dojazd taxi / bus zależnie od chęci grupy.",
];

export const day5Lunch: string[] = [
  "Postaw na świeże ryby i owoce morza w tawernie z widokiem na morze.",
  "Przy grupie ~11 osób warto zadzwonić wcześniej lub wybrać lokal z dużym ogródkiem / salą.",
];

export const day5MapPoints: MapPoint[] = [
  {
    order: 1,
    title: `Wyjście z bazy — ul. ${hotelStreetLine}`,
    lat: hotelLat,
    lng: hotelLng,
    popupDescription: "Start dnia — stąd transport do Pireusu.",
  },
  {
    order: 2,
    title: "Port Pireus (promy)",
    lat: 37.9425,
    lng: 23.643,
    popupDescription: "Główny port promowy Aten — sprawdź terminal dla swojej linii.",
  },
  {
    order: 3,
    title: "Port Aegina (miasto)",
    lat: 37.7468,
    lng: 23.428,
    popupDescription: "Przystań w stolicy wyspy — kawiarnie i spacery w zasięgu kilku minut.",
  },
  {
    order: 4,
    title: "Plaża (blisko portu)",
    lat: 37.7482,
    lng: 23.431,
    popupDescription: "Orientacyjny punkt kąpielowy niedaleko nabrzeża.",
  },
  {
    order: 5,
    title: "Agia Marina (opcjonalnie)",
    lat: 37.7167,
    lng: 23.5385,
    popupDescription: "Lepsza plaża na wschód od miasta — taxi lub komunikacja, jeśli macie czas.",
  },
];

// --- DZIEŃ 6 — miasto, Agora, finał Likavitos (EDIT: godziny, bilety Agory) ---
export const day6Title =
  "Dzień 6 – Psiri, starożytna Agora, Hefajstos, Stoa, Monastiraki i Likavitos o zachodzie";

export const day6Lead =
  "Finałowy dzień w Atenach: klimat Psiri, antyki przy Agorze, targ w Monastiraki, luz bez presji i panorama z Likavitos przy zachodzie — najlepsze zamknięcie pobytu dla grupy.";

export const day6Schedule: ScheduleItem[] = [
  { time: "10:00", label: "Start dnia — wyjście z bazy / dojście pod Psiri", icon: "walk" },
  { time: "10:15–11:00", label: "Psiri — kawa i klimat uliczek", icon: "coffee" },
  { time: "11:15", label: "Starożytna Agora Aten — wejście na teren", icon: "sight" },
  {
    time: "11:45–12:45",
    label: "Świątynia Hefajstosa + Stoa Attalosa (krótko, w ramach zwiedzania agory)",
    icon: "museum",
  },
  {
    time: "13:00–13:30",
    label: "Areopag (opcjonalnie) — dla chętnych lub jeśli ktoś pominął wzgórze w dniu 2",
    icon: "hill",
  },
  { time: "13:45–15:30", label: "Monastiraki — zakupy / lunch", icon: "food" },
  { time: "15:30–17:15", label: "Chill: kawa, lody, zdjęcia, luz", icon: "coffee" },
  { time: "17:30", label: "Likavitos — wejście pieszo lub kolejka przed zachodem", icon: "hill" },
  { time: "19:15–19:45", label: "Zachód słońca na szczycie", icon: "sight" },
  { time: "20:15+", label: "Kolacja lub drink (opcjonalnie)", icon: "food" },
];

export const day6StepsLabel = "około 10–14 tys. kroków";
export const day6Costs =
  "Bilet na starożytną Agorę (sprawdź aktualne pakiety łączone) + opcjonalnie kolejka na Likavitos + lunch — orientacyjnie 20–45 € na osobę.";

export const day6Attractions: AttractionCard[] = [
  {
    title: "Psiri",
    bullets: [
      "Street art, kawiarnie i lokalny klimat — spokojny początek dnia bez gonitwy.",
      "Dobry moment na pierwszą kawę i zebranie grupy przed Agorą.",
    ],
  },
  {
    title: "Starożytna Agora, Hefajstos i Stoa Attalosa",
    bullets: [
      "Agora to serce demokratycznych Aten; Hefajstejon i zrekonstruowana Stoa Attalosa domykają obraz starożytnego życia publicznego.",
      "Stoa — krótki blok (muzeum w portyku); dopasuj czas do tempa grupy.",
    ],
  },
  {
    title: "Areopag (opcjonalnie)",
    bullets: [
      "Skała sądów i widok w stronę Agory — warto, jeśli ktoś nie był lub chce powtórzyć krótki widok z dnia 2.",
      "Można pominąć bez utraty spójności dnia.",
    ],
  },
  {
    title: "Monastiraki",
    bullets: [
      "Zakupy, pamiątki i lunch w tętniącym miejscu — wygodne przy grupie.",
      "Widoki na Akropol z perspektywy placu i ulic.",
    ],
  },
  {
    title: "Likavitos o zachodzie",
    bullets: [
      "Panorama całych Aten w „złotej godzinie” — najlepszy finał całego planu.",
      "Bez presji: kolejka lub pieszo — jak w dniu 6 macie jeszcze siły.",
    ],
  },
];

export const day6LikavitosHow: string[] = [
  "Pieszo: ok. 20–25 minuty podejścia — wygodne buty i woda.",
  "Kolejka funicular: łatwiejsza dla grupy po całym dniu spacerów.",
  "Sprawdź godziny i kolejki; dla 11 osób zostaw margines przed zachodem słońca.",
];

export const day6WhyFinale: string[] = [
  "Najlepszy dzień na zamknięcie wyjazdu — emocje z Akropolu i Delf zostają w pamięci, a dziś łączysz antyki z żywym miastem.",
  "Bez presji muzealnej maratonu: tempo „grupowe”, z przerwami i czasem na targ.",
  "Likavitos o zachodzie daje spektakularną kropkę nad i — pełen klimat Grecji.",
];

export const day6AreopagusNote: string[] = [
  "Areopag to krótka wizyta; odcinek może być śliski przy deszczu — obuwie z przyczepną podeszwą.",
  "Jeśli cała grupa była na Akropolu dnia 2, możecie pominąć ten blok i przedłużyć lunch lub chill.",
];

export const day6MapPoints: MapPoint[] = [
  {
    order: 1,
    title: "Psiri",
    lat: 37.9788,
    lng: 23.7228,
    popupDescription: "Kawa i klimat — start miejskiej części dnia.",
  },
  {
    order: 2,
    title: "Starożytna Agora Aten",
    lat: 37.9753,
    lng: 23.7219,
    popupDescription: "Teren agory — wejście od strony Adrianopu (orientacyjnie).",
  },
  {
    order: 3,
    title: "Świątynia Hefajstosa",
    lat: 37.9749,
    lng: 23.7215,
    popupDescription: "W obrębie agory — jedna z najlepiej zachowanych świątyń klasycznych.",
  },
  {
    order: 4,
    title: "Stoa Attalosa",
    lat: 37.9754,
    lng: 23.7228,
    popupDescription: "Zrekonstruowany portyk — muzeum in situ; krótki blok zwiedzania.",
  },
  {
    order: 5,
    title: "Areopag",
    lat: 37.9714,
    lng: 23.7234,
    popupDescription: "Skała widokowa — opcjonalny przystanek.",
  },
  {
    order: 6,
    title: "Monastiraki",
    lat: 37.9757,
    lng: 23.7259,
    popupDescription: "Lunch, zakupy i klimat targu.",
  },
  {
    order: 7,
    title: "Likavitos (Lycabettus)",
    lat: 37.9819,
    lng: 23.7435,
    popupDescription: "Finał dnia — zachód słońca i panorama Aten.",
  },
];

/** Mapa ogólna (bez linii trasy) — baza + kluczowe kierunki całego planu. */
export const overviewMapPoints: MapPoint[] = [
  {
    order: 1,
    title: `Baza — ul. ${hotelStreetLine}`,
    lat: hotelLat,
    lng: hotelLng,
    popupDescription: "Adres zamieszkania — punkt startu większości dni.",
  },
  {
    order: 2,
    title: "Akropol",
    lat: 37.9715,
    lng: 23.7267,
    popupDescription: "Dzień 2 — klasyczne Ateny.",
  },
  {
    order: 3,
    title: "Jezioro Vouliagmeni",
    lat: 37.8159,
    lng: 23.7907,
    popupDescription: "Dzień 3 — relaks nad wodą.",
  },
  {
    order: 4,
    title: "Port Pireus (promy)",
    lat: 37.9425,
    lng: 23.643,
    popupDescription: "Dzień 5 — prom na Aeginę.",
  },
  {
    order: 5,
    title: "Port Aegina",
    lat: 37.7468,
    lng: 23.428,
    popupDescription: "Dzień 5 — wyspa.",
  },
  {
    order: 6,
    title: "Stanowisko w Delfach",
    lat: 38.4824,
    lng: 22.5014,
    popupDescription: "Dzień 4 — wyjazd poza Ateny.",
  },
];

export type PracticalTip = {
  title: string;
  text: string;
  icon: "home" | "footprints" | "droplet" | "ticket" | "sun" | "users";
};

export const practicalTips: PracticalTip[] = [
  {
    icon: "home",
    title: `Start z ul. ${hotelStreetLine}`,
    text: `Plan liczy na bazę w ${hotelArea} — krótsze dojścia do centrum i powroty wieczorem są prostsze w grupie.`,
  },
  {
    icon: "footprints",
    title: "Wygodne buty",
    text: "Kostka brukowa, schody i nachylenia na Likavitos i Akropol — stabilne obuwie to podstawa.",
  },
  {
    icon: "droplet",
    title: "Woda i nakrycie głowy",
    text: "Butelki z wodą, czapka lub kapelusz oraz krem SPF — szczególnie na drugi dzień przy otwartym wzgórzu.",
  },
  {
    icon: "ticket",
    title: "Bilety online",
    text: "W sezonie warto kupić wejściówki wcześniej i zapisać sloty — mniej stresu przy wejściu.",
  },
  {
    icon: "sun",
    title: "Akropol rano",
    text: "Najlepsze okno na wzgórze to przed południem: mniejszy upał i przyjemniejszy widok na miasto.",
  },
  {
    icon: "users",
    title: "Grupa ~11 osób",
    text: "Zachowaj margines czasu przy wejściach, lunchu i transporcie — luźniejszy harmonogram to premium komfort.",
  },
];

export type CostRow = {
  day: string;
  items: string;
  estimate: string;
};

export const costsTableRows: CostRow[] = [
  {
    day: "Dzień 1",
    items: "Stadion Panateński, Olimpiejon, zakupy (bez muzeum i bez Likavitos)",
    estimate: "ok. 16–22 € / osoba (+ lunch i zakupy wg potrzeb)",
  },
  {
    day: "Dzień 2",
    items: "Akropol + Muzeum Akropolu (orientacyjnie)",
    estimate: `ok. ${day2AcropolisComboEstimate} / osoba (+ lunch, ewent. rooftop)`,
  },
  {
    day: "Dzień 3",
    items: "Vouliagmeni (wstęp), transport 3× Uber/Bolt, lunch nad morzem",
    estimate: "ok. 30–50 € / osoba (zależnie od kursów i lokalu)",
  },
  {
    day: "Dzień 4",
    items: "Transfer do Delf, bilety stanowisko + muzeum, lunch",
    estimate: "ok. 40–90 € / osoba (zależnie od autokaru / wycieczki)",
  },
  {
    day: "Dzień 5",
    items: "Transport do Pireusu, prom Aegina, lunch na wyspie",
    estimate: "ok. 30–50 € / osoba (prom + Ubery dzielone)",
  },
  {
    day: "Dzień 6",
    items: "Agora starożytna, opcj. Areopag, Likavitos, lunch",
    estimate: "ok. 20–45 € / osoba (+ kolacja wg chęci)",
  },
];

export const costsDisclaimer =
  "Ceny mogą ulec zmianie — zawsze potwierdzaj aktualne stawki na oficjalnych stronach obiektów i u organizatorów.";

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Czy ten plan da się zrealizować w 6 dni?",
    answer:
      "Tak — dzień 1 to lekki start w centrum, dzień 2 Akropol i stare miasto, dzień 3 Vouliagmeni, dzień 4 wyjazd do Delf, dzień 5 Aegina, dzień 6 Agora, Monastiraki i Likavitos o zachodzie. Harmonogram ma bufory; dostosuj transport do Delf i prom do swojej grupy.",
  },
  {
    question: "Gdzie najlepiej nocować?",
    answer:
      `Ten plan zakłada bazę przy ul. ${hotelStreetLine} (${hotelArea}) — dobry dostęp do pieszych tras pierwszego dnia i rozsądne dojście pod Akropol. Możesz podmienić współrzędne w pliku danych bez zmiany logiki planu.`,
  },
  {
    question: "Czy plan nadaje się dla grupy?",
    answer:
      "Tak — harmonogram ma przerwy, unika zbyt gęstego układania atrakcji i przewiduje czas na lunch. Dla ok. 11 osób warto rezerwować stoliki i ewentualnie sloty wejść.",
  },
  {
    question: "Ile kosztuje takie zwiedzanie?",
    answer:
      "Dzień 1: stadion i Olimpiejon; dzień 2: Akropol; dzień 4: Delf (największy rozstrzał kosztów — autokar / wycieczka); dni 3 i 5: Ubery i prom; dzień 6: Agora i Likavitos. Wszystko orientacyjnie — sprawdź przed wyjazdem.",
  },
  {
    question: "Czy trzeba kupować bilety wcześniej?",
    answer:
      "Zalecane, zwłaszcza w sezonie i dla Akropolu. Mniejsza kolejka, pewniejsze wejście i łatwiejsze prowadzenie grupy o wyznaczonej godzinie.",
  },
  {
    question: "Ile kilometrów dziennie się chodzi?",
    answer:
      "Dzień 1: ok. 9–13 tys.; dzień 2: ok. 10–14 tys.; dzień 3 przy jeziorze mniej; dzień 4 w Delfach dużo stania na ruinach + transfer; dzień 5 na Aeginie ok. 6–11 tys.; dzień 6: ok. 10–14 tys. To orientacyjne widełki.",
  },
  {
    question: "Czy Vouliagmeni trzeba rezerwować?",
    answer:
      "W szczycie sezonu warto sprawdzić limity osób i ewentualną rezerwację online. Dla grupy 11 osób zadbaj o wcześniejsze wejście lub rozłożenie w czasie — szczegóły na oficjalnej stronie obiektu.",
  },
  {
    question: "Jak kupić prom na Aeginę?",
    answer:
      `Najwygodniej online u wybranego przewoźnika (kilku operatorów kursuje z Pireusu). Porównaj czas rejsu i terminal; z bazy przy ul. ${hotelStreetLine} dojedź Uberami z wyprzedzeniem, by złapać prom o wybranej godzinie.`,
  },
  {
    question: "Czy Likavitos lepiej wejść pieszo czy wjechać kolejką?",
    answer:
      "Kolejka oszczędza czas i energię grupy, szczególnie po całym dniu. Wejście piesze jest możliwe i darmowe, ale wymaga nachyleń — wybierz wariant wg pogody i tempa ekipy.",
  },
];

export const externalLinks = {
  stronyInternetowe: "https://odart.pl/strony-internetowe/",
  opiekaIt: "https://odart.pl/opieka-it-dla-firm-kolobrzeg/",
} as const;

export const seoKeywords = [
  "plan wycieczki Ateny",
  "Ateny w 6 dni",
  "Petralona Ateny nocleg",
  "Mirmidonon 20 Ateny",
  "Delfy z Aten",
  "Ateny w 5 dni",
  "Ateny w 2 dni",
  "Vouliagmeni z Aten",
  "Aegina z Aten",
  "co zobaczyć w Atenach",
  "plan zwiedzania Aten",
  "Ateny plan na weekend",
  "Ateny dzień po dniu",
];
