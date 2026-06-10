import type { VibeMaterialKind } from "@/lib/randki/vibeMaterialTypes";

const ACTIONS = [
  "spacer", "jazda", "powrót", "czekanie", "patrzenie", "siedzenie", "leżenie", "taniec", "gotowanie",
  "myślenie", "marzenie", "pisanie", "czytanie", "słuchanie", "oglądanie", "picie kawy", "picie herbaty",
  "prysznic", "bieganie", "pływanie", "joga", "medytacja", "sprzątanie", "pakowanie", "prokrastynacja",
  "tęsknota", "cisza", "oddycham", "wyłączam telefon", "gaszę światło", "otwieram okno", "zamykam drzwi",
  "wołam taxi", "palę świeczkę", "karmię kota", "głaszczę psa", "myję naczynia", "szukam słów", "liczę dni",
  "gubię się", "znajduję spokój", "trzymam kubek", "patrzę w dal", "liczę latarnie", "gubię czas",
];

const PLACES = [
  "nocnym mieście", "pustym tramwaju", "pełnym pociągu", "na dworcu", "na peronie", "w windzie",
  "na klatce schodowej", "na balkonie", "w kuchni", "w łóżku", "w pokoju z lampką", "w samochodzie",
  "na autostradzie", "przy stacji benzynowej", "w deszczu", "w śniegu", "w mgle", "w lesie",
  "nad wodą", "nad rzeką", "na plaży", "w parku", "na ławce", "na moście", "na dachu",
  "w kawiarni", "w barze", "w bibliotece", "w księgarnii", "w kinie", "w muzeum", "w galerii",
  "w poczekalni", "na lotnisku", "w taksówce", "w uberze", "na rowerze", "w starym mieście",
  "w podwórku", "u rodziców", "w obcym mieście", "w hotelu", "na strychu", "w piwnicy",
  "przy oknie", "przy biurku", "w łazience", "na korytarzu", "w ogrodzie", "na tarasie",
];

const TIMES = [
  "o świcie", "o wschodzie słońca", "o piątej rano", "o szóstej", "rano w niedzielę", "w poniedziałek",
  "w piątek wieczorem", "o północy", "o 1:40 w nocy", "o 3 w nocy", "przed snem", "po przebudzeniu",
  "po ciężkim dniu", "po randce", "po rozmowie", "po kłótni", "po dobrym wieczorze", "w przerwie",
  "między spotkaniami", "gdy miasto śpi", "gdy nikt nie pisze", "gdy pada deszcz", "gdy jest śnieg",
  "gdy jest mgła", "gdy jest upał", "gdy wieje wiatr", "jesienią", "zimą", "wiosną", "latem",
  "w ferie", "w święta", "w Sylwestra", "w dzień deszczu", "w upalny dzień", "gdy gasną światła",
];

const FEELINGS = [
  "spokój", "cisza", "tęsknota", "radość", "melancholia", "nadzieja", "ulga", "duma", "wstyd",
  "dziwność", "lekkość", "ciężko", "pusto", "pełnia", "chaos", "porządek", "ciekawość", "zmęczenie",
  "energia", "senność", "euforia", "spokój w głowie", "dreszcze", "ciepło w sercu", "dziwny spokój",
  "miękko", "delikatnie", "głośno w ciszy", "cicho w głowie", "bez pośpiechu",
];

const SENSORY = [
  "zapach kawy", "zapach deszczu", "zapach książek", "zapach lasu", "zapach perfum", "smak herbaty",
  "smak wina", "smak czekolady", "dźwięk deszczu", "dźwięk tramwaju", "dźwięk pociągu", "dźwięk vinylu",
  "dźwięk basu", "światła neonów", "światła latarni", "światła w oknach", "ciepło kubka", "chłód powietrza",
  "wilgoć asfaltu", "mgła za szybą", "wibracja telefonu", "cisza bez powiadomień",
];

const MUSIC_HOOKS = [
  "bas w samochodzie", "vinyl o północy", "playlista na deszcz", "utwór z randki", "piosenka z dzieciństwa",
  "acoustic wieczorem", "techno po północy", "jazz i deszcz", "lo-fi w tle", "indie w słuchawkach",
  "hip-hop w mieście", "klasyk w tramwaju", "radio w nocy", "live session", "ambient przed snem",
];

const FILM_HOOKS = [
  "comfort movie", "film w tle o północy", "scena w deszczu", "dialog który zostaje", "stary klasyk",
  "romcom w niedzielę", "thriller w samotności", "dokument który zmienia dzień", "film po randce",
  "scena bez słów", "plakat z dzieciństwa", "film w oryginale", "napisy i cisza", "maraton w deszczu",
];

const BOOK_HOOKS = [
  "comfort read", "strona która zostaje", "książka w pociągu", "czytanie przed snem", "powrót co rok",
  "pierwsza strona", "ostatni rozdział", "zakładka w środku", "notes w marginesie", "ulubiony autor",
];

const PROMPT_TEMPLATES = [
  "co robisz, kiedy {condition}?",
  "jak wygląda Twój {moment}?",
  "gdzie jesteś myślami, gdy {condition}?",
  "jaki moment z {period} zostaje?",
  "co Cię ostatnio {verb}?",
  "kiedy ostatnio poczułeś/aś {feeling}?",
  "co robisz, gdy {condition}?",
  "jak brzmi Twój {moment}?",
  "co wraca do Ciebie, gdy {condition}?",
  "jaki obraz zostaje po {moment}?",
];

const PROMPT_CONDITIONS = [
  "chcesz zniknąć na chwilę", "miasto już śpi", "pada deszcz", "nikt nie pisze", "jesteś zmęczony/a",
  "masz za dużo myśli", "potrzebujesz ciszy", "tęsknisz za kimś", "czujesz spokój", "jesteś podekscytowany/a",
  "nie chcesz rozmawiać", "kończy się weekend", "zaczyna się poniedziałek", "wracasz do domu",
  "siedzisz sam/sama", "jedziesz gdzieś bez celu", "gasną światła", "budzi Cię deszcz",
];

const PROMPT_MOMENTS = [
  "spokojny wieczór", "idealny poranek", "nocny spacer", "powrót do domu", "chwila dla siebie",
  "deszczowy dzień", "niedziela rano", "piątek po pracy", "moment przed snem", "cisza w głowie",
];

const PROMPT_PERIODS = [
  "ostatniego tygodnia", "ostatniego miesiąca", "dzieciństwa", "lata", "zimy", "wakacji", "weekendu",
];

const PROMPT_VERBS = ["uspokoiło", "poruszyło", "zaskoczyło", "zaintrygowało", "ucieszyło", "przytuliło"];

function addToSet(set: Set<string>, items: string[], minLen = 8, maxLen = 90): void {
  for (const item of items) {
    const t = item.trim();
    if (t.length >= minLen && t.length <= maxLen) set.add(t);
  }
}

function generateMoodThoughts(): string[] {
  const out = new Set<string>();

  for (const action of ACTIONS) {
    for (const time of TIMES) addToSet(out, [`${action} ${time}`]);
    for (const place of PLACES) addToSet(out, [`${action} ${place}`]);
  }

  for (const feeling of FEELINGS) {
    for (const place of PLACES) addToSet(out, [`${feeling} ${place}`]);
    for (const time of TIMES) addToSet(out, [`${feeling} ${time}`]);
  }

  for (const sensory of SENSORY) {
    for (const time of TIMES.slice(0, 20)) addToSet(out, [`${sensory} ${time}`]);
    for (const place of PLACES.slice(0, 20)) addToSet(out, [`${sensory} — ${place}`]);
  }

  addToSet(out, [
    "ciepły tramwaj zimą", "film puszczony w tle o 1:40", "powrót autem nocą", "kawa o 6 rano",
    "podróż pociągiem bez celu", "światła stacji benzynowej", "nocne miasto po deszczu",
    "słuchawki w pełnym tramwaju", "rozmowy które nie kończą się po godzinie", "miejsce do którego wracam myślami",
    "co ostatnio mnie uspokoiło", "jaki dźwięk lubię bardziej niż ciszę", "mój spokojny wieczór wygląda tak",
    "gdy wszystko jest za głośne, robię to", "jeden moment który zostaje", "urywek z ostatniego tygodnia",
    "skojarzenie bez wyjaśnienia", "mikroemocja która zostaje", "scena z pamięci", "moment przed snem",
    "powrót do tego samego miejsca", "ucieczka bez mapy", "cisza która nie jest pusta", "coś między snem a jawą",
    "poczekalnia i myśli", "winda i obce spojrzenia", "deszcz na szybie", "neon który mruga",
    "ostatni pociąg", "pierwsza kawa dnia", "herbata która stygnie", "koc i serial", "świeca i książka",
    "okno na podwórko", "przypadkowa rozmowa", "długa cisza z kimś bliskim", "śmiech o północy", "taniec w kuchni",
    "piosenka z radia", "zapach przeszłości", "patrzenie w dal", "bez celu i bez pośpiechu",
  ], 6);

  return Array.from(out);
}

function generateKindThoughts(kind: VibeMaterialKind, base: string[]): string[] {
  const out = new Set<string>(base);

  if (kind === "music") {
    for (const hook of MUSIC_HOOKS) {
      for (const time of TIMES.slice(0, 15)) addToSet(out, [`${hook} ${time}`]);
      for (const place of PLACES.slice(0, 15)) addToSet(out, [`${hook} — ${place}`]);
    }
    for (const action of ["słucham", "włączam", "puszczam", "szukam", "wracam do"]) {
      for (const time of TIMES) addToSet(out, [`${action} tego ${time}`]);
    }
  }

  if (kind === "film") {
    for (const hook of FILM_HOOKS) {
      for (const time of TIMES.slice(0, 15)) addToSet(out, [`${hook} ${time}`]);
    }
    for (const action of ["oglądam", "wracam do", "puszczam"]) {
      for (const time of TIMES) addToSet(out, [`${action} to ${time}`]);
    }
  }

  if (kind === "youtube") {
    for (const type of ["live session", "ambient", "spoken word", "mini dokument", "podcast", "koncert online", "scena bez słów"]) {
      for (const time of TIMES.slice(0, 20)) addToSet(out, [`${type} ${time}`]);
      for (const place of PLACES.slice(0, 10)) addToSet(out, [`${type} — ${place}`]);
    }
  }

  if (kind === "quote") {
    for (const src of ["z książki", "z filmu", "z piosenki", "z rozmowy", "własne słowa", "z dzieciństwa"]) {
      for (const feeling of FEELINGS.slice(0, 15)) addToSet(out, [`${src} — ${feeling}`]);
    }
    addToSet(out, [
      "wracam do tego po ciężkim dniu", "mówię to sobie przed snem", "czasem wystarczy być",
      "zdanie które zostaje w głowie", "słowa które coś otwierają", "cytat bez autora",
    ], 6);
  }

  if (kind === "book") {
    for (const hook of BOOK_HOOKS) {
      for (const time of TIMES.slice(0, 15)) addToSet(out, [`${hook} ${time}`]);
      for (const place of PLACES.slice(0, 10)) addToSet(out, [`${hook} — ${place}`]);
    }
  }

  return Array.from(out);
}

function generatePrompts(kind: VibeMaterialKind): string[] {
  const out = new Set<string>();

  const kindSpecific: Record<VibeMaterialKind, string[]> = {
    music: [
      "co włączasz w samochodzie nocą?",
      "jaki dźwięk zostaje po randce?",
      "co słuchasz, gdy miasto już śpi?",
      "jaka piosenka brzmi jak Twój poniedziałek?",
      "co puszczasz, gdy chcesz zniknąć na chwilę?",
      "jaki utwór wraca, gdy pada deszcz?",
      "bas w aucie czy vinyl o północy?",
    ],
    film: [
      "jaka scena zostaje w głowie na dni?",
      "co oglądasz, gdy nie chcesz nic planować?",
      "jaki film to Ty po ciężkim dniu?",
      "jaka scena bez słów coś mówi?",
      "comfort movie w deszczowy wieczór?",
      "jaki obraz zostaje po zamknięciu ekranu?",
    ],
    youtube: [
      "co włączasz na jeden wieczór dla siebie?",
      "jaka scena zostaje po zamknięciu laptopa?",
      "co oglądasz, gdy nie chcesz rozmawiać?",
      "kiedy ostatnio coś w tle Cię uspokoiło?",
      "jaki dźwięk w tle to Twój spokój?",
    ],
    quote: [
      "w jakiej sytuacji wracasz do tych słów?",
      "co ktoś kiedyś powiedział i zostało?",
      "jakie zdanie mówisz sobie przed snem?",
      "jakie słowa brzmią prawdziwie dziś wieczorem?",
    ],
    book: [
      "gdzie czytasz to najchętniej?",
      "jaka strona została w pamięci?",
      "co czytasz w pociągu albo przed snem?",
      "jaka książka wraca co rok?",
    ],
    mood: [
      "jak wygląda Twój spokojny wieczór?",
      "z kim można jechać bez celu?",
      "po czym poznajesz, że dobrze się przy kimś czujesz?",
      "z kim chciał(a)byś utknąć na stacji o 1 w nocy?",
      "kto nie boi się ciszy?",
      "kto umie usiąść obok i nie grać nikogo?",
      "co ostatnio Cię uspokoiło?",
      "gdzie jesteś myślami, gdy wszystko jest za głośne?",
      "jaki moment z ostatniego tygodnia zostaje?",
      "miejsce, do którego wracasz myślami?",
    ],
  };

  addToSet(out, kindSpecific[kind], 10);

  for (const tpl of PROMPT_TEMPLATES) {
    for (const condition of PROMPT_CONDITIONS) {
      addToSet(out, [tpl.replace("{condition}", condition)], 12);
    }
    for (const moment of PROMPT_MOMENTS) {
      addToSet(out, [tpl.replace("{moment}", moment)], 12);
    }
    for (const period of PROMPT_PERIODS) {
      addToSet(out, [tpl.replace("{period}", period)], 12);
    }
    for (const feeling of FEELINGS) {
      addToSet(out, [tpl.replace("{feeling}", feeling)], 12);
    }
    for (const verb of PROMPT_VERBS) {
      addToSet(out, [tpl.replace("{verb}", verb)], 12);
    }
  }

  return Array.from(out);
}

const MOOD_BASE = generateMoodThoughts();

const THOUGHT_POOL: Record<VibeMaterialKind, string[]> = {
  music: generateKindThoughts("music", MOOD_BASE),
  film: generateKindThoughts("film", MOOD_BASE),
  youtube: generateKindThoughts("youtube", MOOD_BASE),
  quote: generateKindThoughts("quote", MOOD_BASE),
  book: generateKindThoughts("book", MOOD_BASE),
  mood: MOOD_BASE,
};

export const VIBE_THOUGHT_COUNT = (() => {
  const kinds: VibeMaterialKind[] = ["music", "film", "youtube", "quote", "book", "mood"];
  return kinds.reduce((sum, k) => sum + THOUGHT_POOL[k].length, 0);
})();

const PROMPT_POOL: Record<VibeMaterialKind, string[]> = {
  music: generatePrompts("music"),
  film: generatePrompts("film"),
  youtube: generatePrompts("youtube"),
  quote: generatePrompts("quote"),
  book: generatePrompts("book"),
  mood: generatePrompts("mood"),
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getThoughtPool(kind: VibeMaterialKind): readonly string[] {
  return THOUGHT_POOL[kind];
}

export function getPromptPool(kind: VibeMaterialKind): readonly string[] {
  return PROMPT_POOL[kind];
}

export function getThoughtPoolSize(kind: VibeMaterialKind): number {
  return THOUGHT_POOL[kind].length;
}

export function pickRandomThoughts(kind: VibeMaterialKind, count: number): string[] {
  const pool = THOUGHT_POOL[kind];
  if (pool.length <= count) return shuffle(pool);
  return shuffle(pool).slice(0, count);
}

export function pickRandomPromptFromPool(kind: VibeMaterialKind): string {
  const pool = PROMPT_POOL[kind];
  return pool[Math.floor(Math.random() * pool.length)] ?? pool[0];
}

export function pickRandomPlaceholder(kind: VibeMaterialKind): string {
  return pickRandomThoughts(kind, 1)[0] ?? "jedno zdanie wystarczy";
}

export function expandVibeSeedFromPool(kind: VibeMaterialKind, seed: string, count = 3): string[] {
  const s = seed.trim().toLowerCase();
  const pool = THOUGHT_POOL[kind];
  if (!s) return pickRandomThoughts(kind, count);

  const matched = pool.filter(
    (t) =>
      t.toLowerCase().includes(s) ||
      s.split(/\s+/).some((w) => w.length > 3 && t.toLowerCase().includes(w))
  );
  if (matched.length >= count) return shuffle(matched).slice(0, count);

  const generated = [
    `${s} — gdy miasto już śpi`,
    `${s} po ciężkim dniu`,
    `spokojny ${s}`,
    `${s} bez pośpiechu`,
    `${s} i cisza`,
    `${s} — jeden moment`,
  ];
  return shuffle([...matched, ...generated, ...pickRandomThoughts(kind, count)]).slice(0, count);
}
