export type ShowcaseReview = {
  author: string;
  date: string;
  service?: string;
  text: string;
};

export type ShowcaseService = {
  name: string;
  price?: string;
};

export type ShowcaseLanding = {
  slug: string;
  clinicName: string;
  doctorTitle: string;
  doctorName: string;
  specialty: string;
  city: string;
  postalCode: string;
  address: string;
  addressHint: string;
  phone: string;
  phoneDisplay: string;
  email: string;
  pwz: string;
  nip: string;
  reviewCount: number;
  sinceYear: number;
  patients: string;
  languages: string[];
  insurance: string[];
  payments: string[];
  scopes: string[];
  areas: string[];
  notice: string;
  about: string[];
  education: string;
  award?: string;
  extras: string[];
  services: ShowcaseService[];
  reviews: ShowcaseReview[];
  znanyLekarzUrl: string;
  mapQuery: string;
};

export const ADENT_KOLOBRZEG: ShowcaseLanding = {
  slug: "a-dent-kolobrzeg",
  clinicName: "A-DENT Kołobrzeg",
  doctorTitle: "lek. dent.",
  doctorName: "Agnieszka Czerwińska-Załoga",
  specialty: "Stomatolog",
  city: "Kołobrzeg",
  postalCode: "78-100",
  address: "ul. Aleksandra Orłowskiego 48",
  addressHint: "budynek z apteką „Pod Lwem”",
  phone: "+48793252793",
  phoneDisplay: "793 252 793",
  email: "adent@vip.onet.pl",
  pwz: "9954857",
  nip: "9660671001",
  reviewCount: 391,
  sinceYear: 2012,
  patients: "Dorośli",
  languages: ["polski"],
  insurance: ["PZU Zdrowie"],
  payments: ["Gotówka", "Karta płatnicza", "Przelew"],
  scopes: [
    "Stomatologia ogólna",
    "Stomatologia zachowawcza z endodoncją",
    "Protetyka stomatologiczna",
  ],
  areas: [
    "Próchnica",
    "Ból zęba",
    "Braki zębowe",
    "Choroby miazgi",
    "Kamień nazębny",
    "Zapalenie dziąseł",
    "Złamanie zęba",
    "Protezy",
  ],
  notice:
    "Przy umawianiu wizyty proszę podać wiek oraz cel wizyty, np. czyszczenie zębów, plombowanie, ból zęba lub rodzaj konsultacji. Pacjenci z aktywnym wirusem opryszczki (tzw. zimnem) nie są przyjmowani.",
  about: [
    "W 1996 r. ukończyłam Gdańską Akademię Medyczną (obecnie Gdański Uniwersytet Medyczny). Staż podyplomowy odbywałam w Akademii Medycznej w Białymstoku.",
    "W latach 1997–2000 pracowałam w Centrum Stomatologii Classic oraz w Podlaskim Centrum Medycznym w Białymstoku. W 2001 r. założyłam swój pierwszy gabinet w województwie podlaskim.",
    "Po przeprowadzce do Kołobrzegu otworzyłam w 2012 r. gabinet A-DENT przy ul. Orłowskiego 48, w którym przyjmuję do dziś.",
  ],
  education:
    "Oddział stomatologiczny, Wydział Lekarski, Akademia Medyczna w Gdańsku — 1996",
  award: "2. miejsce w Plebiscycie Hipokrates 2017 — Najpopularniejszy Gabinet Stomatologiczny",
  extras: ["RTG w gabinecie", "Praca w mikroskopie", "Wizyty prywatne"],
  services: [
    { name: "Konsultacja stomatologiczna", price: "od 150 zł" },
    { name: "Wizyta w związku z bólem zęba", price: "od 200 zł" },
    { name: "Wizyta bólowa (zaopatrzenie pacjenta)", price: "200 zł" },
    { name: "Przegląd stomatologiczny + plan leczenia" },
    { name: "Scaling + piaskowanie", price: "od 300 zł" },
    { name: "Wypełnienie kompozytowe" },
    { name: "Leczenie endodontyczne" },
    { name: "Odbudowa startych zębów" },
    { name: "Proteza acetalowa", price: "od 1 800 zł" },
    { name: "Proteza szkieletowa (metalowa)" },
    { name: "Protezy akronowe" },
    { name: "Naprawa protez" },
  ],
  reviews: [
    {
      author: "Ania",
      date: "26 marca 2025",
      service: "Odbudowa startych zębów",
      text: "Polecam. Wspaniała pani dr. Gabinet w pełni profesjonalny. Posiada rentgen i pracuje używając mikroskopu, kiedy trzeba. Fachowość w każdym calu.",
    },
    {
      author: "Małgorzata",
      date: "1 października 2024",
      service: "Ekstrakcja zęba",
      text: "Profesjonalne podejście do pacjenta. Pomimo mojego ogromnego stresu Pani doktor potrafiła rozluźnić sytuację swobodną, niewymuszoną rozmową. Jestem bardzo zadowolona. Polecam.",
    },
    {
      author: "E Pietraszkiewicz",
      date: "31 stycznia 2024",
      service: "Leczenie endodontyczne",
      text: "Pani Agnieszka jest bardzo zaangażowana w leczenie. Podczas każdej wizyty wszystko jest dokładnie omawiane. Życzliwa, miła i fachowa obsługa, z ogromną cierpliwością do pacjenta. Pełen profesjonalizm i precyzja.",
    },
    {
      author: "Justyna",
      date: "26 sierpnia 2026",
      service: "Wizyta w związku z bólem zęba",
      text: "Wizyta odbyła się punktualnie w przyjaznym gabinecie. Pani Doktor przeprowadziła szczegółowy wywiad, badanie i wyjaśniła, jak będzie wyglądać leczenie. Dostałam obszerne wskazania do rekonwalescencji i profilaktyki. Serdecznie polecam.",
    },
    {
      author: "Rafał K",
      date: "9 czerwca 2020",
      text: "Bardzo jestem zadowolony z leczenia i polecam wszystkim. Miła atmosfera i lekarz reaguje na każdy dyskomfort. Polecam szczególnie „bojącym się” mężczyznom.",
    },
    {
      author: "Pamela",
      date: "16 lipca 2026",
      service: "Leczenie próchnicy",
      text: "Skutecznie, szybko i bez bólu. Bardzo przyjemna wizyta.",
    },
  ],
  znanyLekarzUrl:
    "https://www.znanylekarz.pl/agnieszka-czerwinska-zaloga/stomatolog/kolobrzeg",
  mapQuery: "Orłowskiego 48, 78-100 Kołobrzeg",
};

export const GAB_SHOWCASE_LANDINGS: ShowcaseLanding[] = [ADENT_KOLOBRZEG];

export function getShowcaseLanding(slug: string): ShowcaseLanding | undefined {
  return GAB_SHOWCASE_LANDINGS.find((item) => item.slug === slug);
}
