/**
 * Województwa Polski i główne miasta (do wyboru w rejestracji gabinetu).
 * Kolejność alfabetyczna województw.
 */

export const VOIVODESHIPS_WITH_CITIES: Record<string, string[]> = {
  "dolnośląskie": ["Wrocław", "Wałbrzych", "Legnica", "Jelenia Góra", "Lubin", "Świdnica", "Oława", "Oleśnica", "Dzierżoniów", "Bolesławiec"],
  "kujawsko-pomorskie": ["Bydgoszcz", "Toruń", "Włocławek", "Grudziądz", "Inowrocław", "Brodnica", "Świecie", "Chełmno", "Nakło nad Notecią"],
  "lubelskie": ["Lublin", "Chełm", "Zamość", "Biała Podlaska", "Puławy", "Świdnik", "Kraśnik", "Łuków", "Biłgoraj"],
  "lubuskie": ["Gorzów Wielkopolski", "Zielona Góra", "Żary", "Nowa Sól", "Sulechów", "Żagań", "Kostrzyn nad Odrą", "Międzyrzecz"],
  "łódzkie": ["Łódź", "Piotrków Trybunalski", "Pabianice", "Tomaszów Mazowiecki", "Bełchatów", "Zgierz", "Radomsko", "Kutno", "Sieradz", "Skierniewice"],
  "małopolskie": ["Kraków", "Tarnów", "Nowy Sącz", "Oświęcim", "Chrzanów", "Olkusz", "Nowy Targ", "Bochnia", "Gorlice", "Zakopane", "Wadowice", "Andrychów"],
  "mazowieckie": ["Warszawa", "Radom", "Płock", "Siedlce", "Ostrołęka", "Piaseczno", "Pruszków", "Legionowo", "Otwock", "Wołomin", "Grodzisk Mazowiecki", "Ciechanów", "Żyrardów", "Mława"],
  "opolskie": ["Opole", "Kędzierzyn-Koźle", "Nysa", "Brzeg", "Kluczbork", "Prudnik", "Strzelce Opolskie", "Krapkowice"],
  "podkarpackie": ["Rzeszów", "Przemyśl", "Stalowa Wola", "Mielec", "Tarnobrzeg", "Krosno", "Dębica", "Jarosław", "Sanok", "Jasło"],
  "podlaskie": ["Białystok", "Suwałki", "Łomża", "Augustów", "Bielsk Podlaski", "Zambrów", "Grajewo"],
  "pomorskie": ["Gdańsk", "Gdynia", "Sopot", "Słupsk", "Tczew", "Starogard Gdański", "Wejherowo", "Rumia", "Chojnice", "Malbork", "Kwidzyn", "Lębork"],
  "śląskie": ["Katowice", "Częstochowa", "Sosnowiec", "Gliwice", "Zabrze", "Bytom", "Bielsko-Biała", "Rybnik", "Tychy", "Ruda Śląska", "Racibórz", "Mysłowice", "Dąbrowa Górnicza", "Chorzów", "Jaworzno", "Jastrzębie-Zdrój", "Mikołów", "Tarnowskie Góry", "Będzin", "Zawiercie"],
  "świętokrzyskie": ["Kielce", "Ostrowiec Świętokrzyski", "Starachowice", "Skarżysko-Kamienna", "Sandomierz", "Końskie", "Busko-Zdrój", "Jędrzejów", "Staszów", "Pińczów"],
  "warmińsko-mazurskie": ["Olsztyn", "Elbląg", "Ełk", "Ostróda", "Iława", "Giżycko", "Kętrzyn", "Szczytno", "Bartoszyce", "Mrągowo", "Pisz", "Braniewo"],
  "wielkopolskie": ["Poznań", "Kalisz", "Konin", "Piła", "Ostrów Wielkopolski", "Gniezno", "Leszno", "Swarzędz", "Śrem", "Krotoszyn", "Września", "Luboń", "Wągrowiec", "Koło", "Środa Wielkopolska", "Rawicz"],
  "zachodniopomorskie": ["Szczecin", "Koszalin", "Stargard", "Kołobrzeg", "Świnoujście", "Police", "Wałcz", "Białogard", "Goleniów", "Gryfino", "Nowogard", "Gryfice", "Choszczno", "Drawsko Pomorskie", "Sławno"],
};

/** Kolejność województw do wyświetlania (alfabetycznie). */
export const VOIVODESHIP_NAMES = Object.keys(VOIVODESHIPS_WITH_CITIES).sort((a, b) =>
  a.localeCompare(b, "pl")
);

/** Wszystkie dozwolone nazwy miast (do walidacji po stronie serwera). */
export function getAllowedCities(): string[] {
  const set = new Set<string>();
  for (const cities of Object.values(VOIVODESHIPS_WITH_CITIES)) {
    cities.forEach((c) => set.add(c));
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "pl"));
}
