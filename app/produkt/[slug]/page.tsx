import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ClinicHeader } from "@/components/clinic/ClinicHeader";
import { Footer } from "@/components/Footer";
import { OdartWcStoreProductPage } from "@/components/odart/OdartWcStoreProductPage";
import { isOdartMainHost } from "@/lib/odartSite";
import { fetchOdartWcStoreProductBySlug, stripHtmlToText } from "@/lib/odartWordpress";

type ProductContent = {
  name: string;
  shortDescription: string;
  duration: string;
  priceFrom: string;
  treatmentHeading: string;
  ctaHeading: string;
  description: string[];
  benefits: string[];
  indications: string[];
  /** Nadpisanie title/description dla SEO (np. „Makijaż dzienny Kołobrzeg | Profesjonalny makijaż | Gabinet”) */
  metaTitle?: string;
  metaDescription?: string;
  /** Rozwijana sekcja SEO pod CTA: H2 z lokalizacją, rozbudowany opis, FAQ */
  seo?: {
    h2: string;
    description: string[];
    faq?: { question: string; answer: string }[];
  };
};

const products: Record<string, ProductContent> = {
  "makijaz-dzienny": {
    name: "Makijaż dzienny",
    shortDescription:
      "Lekki, świeży i trwały makijaż dzienny dopasowany do typu urody i okazji.",
    duration: "ok. 60 min",
    priceFrom: "od 180 zł",
    treatmentHeading: "Na czym polega makijaż dzienny",
    ctaHeading: "Umów makijaż dzienny online",
    description: [
      "Makijaż dzienny to propozycja dla osób, które chcą wyglądać naturalnie, ale bardziej promiennie i profesjonalnie. Wykonanie obejmuje przygotowanie cery, dobranie podkładu i korekty oraz podkreślenie oka, brwi i ust.",
      "Priorytetem jest lekka forma, trwałość i komfort noszenia przez cały dzień – bez efektu maski. Stylizacja jest dobierana indywidualnie do urody, stroju i charakteru spotkania.",
    ],
    benefits: [
      "Naturalny efekt podkreślający atuty twarzy",
      "Dopasowanie kolorystyki do typu urody",
      "Trwały makijaż na spotkania biznesowe i rodzinne",
      "Profesjonalne wykończenie i estetyka cery",
    ],
    indications: [
      "spotkania biznesowe",
      "eventy dzienne",
      "sesje zdjęciowe w naturalnym stylu",
      "ważne okazje bez wieczorowego efektu",
    ],
    metaTitle: "Makijaż dzienny Kołobrzeg | Profesjonalny makijaż | Gabinet",
    metaDescription:
      "Profesjonalny makijaż dzienny w Kołobrzegu – naturalny efekt, trwałość przez cały dzień. Makijaż na spotkania biznesowe, sesję zdjęciową i ważne wydarzenia. Cena od 180 zł, ok. 60 min. Umów wizytę online.",
    seo: {
      h2: "Makijaż dzienny Kołobrzeg – profesjonalny i naturalny efekt",
      description: [
        "Makijaż dzienny wykonywany w naszym gabinecie w Kołobrzegu to idealne rozwiązanie dla kobiet, które chcą wyglądać świeżo, promiennie i profesjonalnie bez efektu ciężkiego makijażu. Stylizacja jest dopasowana do typu urody, okazji oraz indywidualnych preferencji – od bardzo subtelnego podkreślenia rysów twarzy po delikatnie bardziej wyrazisty efekt.",
        "Podczas zabiegu przygotowujemy cerę, dobieramy odpowiedni podkład oraz korektory, modelujemy twarz, podkreślamy oczy, brwi i usta. Priorytetem jest trwałość oraz komfort noszenia przez wiele godzin – makijaż sprawdza się zarówno podczas spotkań biznesowych, jak i rodzinnych uroczystości czy sesji zdjęciowych.",
        "Profesjonalny makijaż dzienny w Kołobrzegu to także świetne rozwiązanie przed ważnymi wydarzeniami, kiedy zależy Ci na naturalnym, ale dopracowanym wyglądzie.",
      ],
      faq: [
        {
          question: "Jak długo utrzymuje się makijaż dzienny?",
          answer:
            "Makijaż wykonywany profesjonalnymi kosmetykami utrzymuje się przez cały dzień. W zależności od typu cery oraz warunków (temperatura, wilgotność), efekt może wymagać jedynie delikatnego odświeżenia w ciągu dnia.",
        },
        {
          question: "Czy makijaż dzienny sprawdzi się na sesję zdjęciową?",
          answer:
            "Tak. Makijaż dzienny jest często wybierany do sesji zdjęciowych w naturalnym stylu. Podkreśla rysy twarzy i zapewnia świeży wygląd bez przerysowanego efektu.",
        },
        {
          question: "Dlaczego warto wykonać makijaż w gabinecie w Kołobrzegu?",
          answer:
            "Indywidualny dobór kolorystyki, dopasowanie do typu cery, profesjonalne kosmetyki, trwałość i estetyczne wykończenie, naturalny efekt bez efektu maski.",
        },
      ],
    },
  },
  "makijaz-slubny": {
    name: "Makijaż ślubny",
    shortDescription:
      "Trwały i dopracowany makijaż ślubny, który podkreśla urodę i dobrze wygląda na żywo oraz na zdjęciach.",
    duration: "ok. 90 min",
    priceFrom: "od 320 zł",
    treatmentHeading: "Na czym polega makijaż ślubny",
    ctaHeading: "Umów makijaż ślubny online",
    description: [
      "Makijaż ślubny jest projektowany tak, aby utrzymał się przez cały dzień i wieczór – od przygotowań, przez ceremonię, po wesele. Styl jest dopasowany do typu urody, fryzury, sukni i charakteru wydarzenia.",
      "W praktyce liczy się wyważenie: efekt ma być elegancki i fotogeniczny, a jednocześnie nadal naturalny i komfortowy. Kluczowa jest trwałość, precyzja i odpowiednie przygotowanie skóry.",
    ],
    benefits: [
      "Wysoka trwałość w zmiennych warunkach dnia ślubu",
      "Makijaż dobrze prezentujący się na zdjęciach i filmie",
      "Dopasowanie stylu do sukni i oprawy uroczystości",
      "Profesjonalne wykonanie z naciskiem na detale",
    ],
    indications: [
      "panna młoda",
      "sesja ślubna",
      "makijaż na ceremonię i wesele",
      "ważna uroczystość wymagająca trwałego efektu",
    ],
    seo: {
      h2: "Makijaż ślubny Kołobrzeg – trwały makijaż na wesele i sesję ślubną",
      description: [
        "Makijaż ślubny w Kołobrzegu wykonywany w naszym gabinecie to usługa dopasowana do potrzeb panien młodych oraz gości weselnych. Projektujemy styl tak, aby utrzymał się od przygotowań przez ceremonię aż po zabawę – przy zachowaniu komfortu i fotogenicznego efektu na zdjęciach i w filmie.",
        "Dobieramy podkład, kolorystykę i intensywność do typu urody, fryzury, sukni oraz charakteru uroczystości. Stosujemy kosmetyki o wysokiej trwałości i techniki utrwalające, aby makijaż ślubny wyglądał świeżo przez wiele godzin. Profesjonalny makijaż ślubny Kołobrzeg to inwestycja w pewność siebie w dniu ślubu.",
        "Zapraszamy na konsultację i próbę makijażu – wtedy ustalamy ostateczny styl i sprawdzamy trwałość. Makijaż na wesele w Kołobrzegu wykonujemy także dla mam, świadków i gości – w formie nieco lżejszej, dopasowanej do roli.",
      ],
      faq: [
        { question: "Ile trwa makijaż ślubny?", answer: "Makijaż ślubny trwa około 90 minut. W tym czasie wykonujemy przygotowanie cery, dobór podkładu i korekty, stylizację oka, brwi i ust oraz utrwalenie dostosowane do warunków wesela (światło, temperatura, długi dzień)." },
        { question: "Czy makijaż ślubny utrzyma się przez cały dzień?", answer: "Tak. Stosujemy profesjonalne podkłady i kosmetyki utrwalające oraz techniki, które minimalizują zmatowienie i zmywanie. Efekt jest projektowany z myślą o wielu godzinach – od rana do późnego wieczoru." },
        { question: "Czy robicie próbę makijażu ślubnego?", answer: "Tak. Próba makijażu ślubnego pozwala dopracować styl, kolor i intensywność oraz sprawdzić trwałość na Twojej skórze. To standardowa usługa przed ślubem – umów się z wyprzedzeniem." },
        { question: "Makijaż ślubny tylko dla panny młodej?", answer: "Nie. Wykonujemy makijaż ślubny dla panny młodej, mam, świadków i gości. Dla gości proponujemy lżejszą, szybszą wersję dopasowaną do roli i planu dnia." },
      ],
    },
  },
  "makijaz-wieczorowy": {
    name: "Makijaż wieczorowy",
    shortDescription:
      "Trwały i efektowny makijaż wieczorowy dopasowany do urody, stylizacji i charakteru wydarzenia.",
    duration: "ok. 75 min",
    priceFrom: "od 240 zł",
    treatmentHeading: "Na czym polega makijaż wieczorowy",
    ctaHeading: "Umów makijaż wieczorowy online",
    description: [
      "Makijaż wieczorowy to intensywniejsza wersja makijażu okazjonalnego, która podkreśla rysy twarzy i oprawę oka. Dobór techniki i kolorystyki zależy od typu urody, oświetlenia wydarzenia oraz planowanej stylizacji.",
      "Największy nacisk kładziemy na trwałość, precyzję i estetykę, aby efekt utrzymał się przez wiele godzin. To dobra opcja na przyjęcia, gale, imprezy firmowe i sesje zdjęciowe.",
    ],
    benefits: [
      "Wyrazisty, ale dopasowany do urody efekt",
      "Wysoka trwałość przez cały wieczór",
      "Profesjonalne podkreślenie oka i konturu twarzy",
      "Stylizacja dopasowana do okazji i kreacji",
    ],
    indications: [
      "wesela i przyjęcia okolicznościowe",
      "eventy firmowe i gale",
      "uroczyste kolacje i wyjścia wieczorne",
      "sesje zdjęciowe wymagające mocniejszego efektu",
    ],
    metaTitle:
      "Makijaż wieczorowy — cena od 240 zł | Kołobrzeg | Profesjonalny makijaż",
    metaDescription:
      "Ile kosztuje makijaż wieczorowy? W naszym gabinecie w Kołobrzegu od 240 zł, ok. 75 min. Trwały, wyrazisty efekt na gale, przyjęcia i sesje. Umów wizytę online.",
    seo: {
      h2: "Makijaż wieczorowy Kołobrzeg – profesjonalny makijaż na gale i przyjęcia",
      description: [
        "Makijaż wieczorowy w Kołobrzegu to usługa dla kobiet, które chcą wyglądać wyrazisto i elegancko na galach, przyjęciach, weselach jako gość, imprezach firmowych czy uroczystych kolacjach. Wykonujemy styl dopasowany do typu urody, oświetlenia i charakteru wydarzenia – bez efektu maski, z naciskiem na trwałość i estetykę.",
        "Podkreślamy oczy i kontur twarzy, dobieramy kolorystykę do kreacji i okazji. Stosujemy kosmetyki o wysokiej trwałości, aby makijaż wieczorowy utrzymał się przez wiele godzin. Profesjonalny makijaż na imprezę w Kołobrzegu to komfort i pewność wyglądu przez cały wieczór.",
        "Makijaż okolicznościowy wieczorowy sprawdza się także na sesje zdjęciowe wymagające mocniejszego efektu – w studio lub w plenerze przy sztucznym świetle.",
      ],
      faq: [
        {
          question: "Ile kosztuje makijaż wieczorowy?",
          answer:
            "Cena makijażu wieczorowego u nas zaczyna się od 240 zł. Ostateczna wycena może zależeć od stopnia skomplikowania stylizacji i ewentualnych dodatków — dokładną kwotę ustalamy przy umawianiu wizyty.",
        },
        { question: "Ile trwa makijaż wieczorowy?", answer: "Makijaż wieczorowy trwa około 75 minut. W tym czasie wykonujemy przygotowanie cery, podkład, modelowanie twarzy, wyrazistą stylizację oka i ust oraz utrwalenie." },
        { question: "Czym różni się makijaż wieczorowy od dziennego?", answer: "Makijaż wieczorowy jest intensywniejszy – mocniejsze podkreślenie oka, konturu i ust, kolorystyka dopasowana do sztucznego światła. Ma lepiej wyglądać przy wieczornym oświetleniu i utrzymać się przez cały wieczór." },
        { question: "Czy makijaż wieczorowy sprawdzi się na sesję zdjęciową?", answer: "Tak. Makijaż wieczorowy jest często wybierany do sesji w studio lub w plenerze przy zachodzie słońca – daje wyrazisty, fotogeniczny efekt bez przesady." },
      ],
    },
  },
  "henna-brwi-regulacja": {
    name: "Henna brwi z regulacją",
    shortDescription:
      "Stylizacja brwi łącząca hennę i regulację dla naturalnego, harmonijnego kształtu.",
    duration: "ok. 30 min",
    priceFrom: "od 70 zł",
    treatmentHeading: "Na czym polega henna brwi z regulacją",
    ctaHeading: "Umów hennę brwi z regulacją online",
    description: [
      "Zabieg obejmuje nadanie odpowiedniego kształtu brwi, usunięcie zbędnych włosków oraz koloryzację henną dopasowaną do typu urody. Celem jest podkreślenie oprawy oka i uzyskanie bardziej uporządkowanego wyglądu twarzy.",
      "Henna brwi z regulacją to szybka usługa, która poprawia symetrię brwi i ułatwia codzienny makijaż. Efekt jest naturalny i dopasowany do preferencji – od subtelnego po bardziej wyrazisty.",
    ],
    benefits: [
      "Wyraźniejszy, ale naturalny kształt brwi",
      "Lepsza symetria i estetyka oprawy oka",
      "Oszczędność czasu przy codziennym makijażu",
      "Indywidualny dobór koloru i zakresu regulacji",
    ],
    indications: [
      "osoby z jasnymi lub nierównymi brwiami",
      "potrzeba podkreślenia oprawy oka",
      "regularna pielęgnacja i odświeżenie wyglądu",
      "przygotowanie do ważnego wydarzenia",
    ],
    metaTitle:
      "Henna brwi z regulacją — cena od 70 zł | Kołobrzeg | Stylizacja brwi",
    metaDescription:
      "Henna brwi z regulacją w Kołobrzegu – stylizacja i regulacja brwi w jednym zabiegu. Naturalny efekt, dopasowanie do typu urody. Cena od 70 zł, ok. 30 min. Umów wizytę online.",
    seo: {
      h2: "Henna brwi z regulacją Kołobrzeg – naturalna stylizacja i wyrazista oprawa oka",
      description: [
        "Henna brwi z regulacją w naszym gabinecie w Kołobrzegu to szybki i skuteczny sposób na podkreślenie rysów twarzy oraz poprawę symetrii brwi. Zabieg łączy precyzyjne nadanie kształtu z koloryzacją dopasowaną do typu urody, karnacji oraz koloru włosów.",
        "Stylizacja brwi wykonywana jest z uwzględnieniem proporcji twarzy, tak aby efekt był harmonijny i naturalny. Regulacja usuwa zbędne włoski, a odpowiednio dobrana henna nadaje brwiom głębi i wyrazistości, dzięki czemu spojrzenie staje się bardziej podkreślone bez konieczności codziennego makijażu.",
        "To idealne rozwiązanie dla osób, które chcą uporządkować brwi, zagęścić optycznie ich wygląd lub wyrównać asymetrię.",
      ],
      faq: [
        {
          question: "Ile kosztuje henna brwi z regulacją?",
          answer:
            "Cena zabiegu zaczyna się od 70 zł przy czasie około 30 minut. Ostateczna kwota może zależeć od zakresu stylizacji — szczegóły ustalamy przy rezerwacji.",
        },
        { question: "Jak długo utrzymuje się efekt henny brwi?", answer: "Efekt koloryzacji utrzymuje się zazwyczaj od 2 do 4 tygodni w zależności od rodzaju skóry oraz codziennej pielęgnacji. Regulacja pozwala zachować estetyczny kształt brwi przez kilka tygodni." },
        { question: "Dla kogo polecana jest henna brwi z regulacją?", answer: "Zabieg polecany jest osobom z jasnymi, mało widocznymi brwiami, z nierówną linią brwi, przygotowującym się do ważnego wydarzenia oraz chcącym ograniczyć codzienny makijaż." },
        { question: "Dlaczego warto wykonać stylizację brwi w gabinecie w Kołobrzegu?", answer: "Profesjonalna regulacja i koloryzacja zapewnia precyzyjny dobór kształtu, indywidualnie dopasowany kolor, naturalny efekt bez przerysowania oraz komfort i bezpieczeństwo zabiegu." },
      ],
    },
  },
  "henna-pelna": {
    name: "Henna pełna",
    shortDescription:
      "Kompleksowa henna brwi i rzęs z regulacją, dla spójnego i wyraźnego efektu oprawy oka.",
    duration: "ok. 45 min",
    priceFrom: "od 100 zł",
    treatmentHeading: "Na czym polega henna pełna",
    ctaHeading: "Umów hennę pełną online",
    description: [
      "Henna pełna obejmuje koloryzację brwi i rzęs oraz regulację kształtu brwi. Zabieg pozwala podkreślić spojrzenie i uzyskać bardziej uporządkowany, harmonijny wygląd twarzy.",
      "Kolor henny jest dobierany indywidualnie do urody i oczekiwań. To praktyczne rozwiązanie dla osób, które chcą wyglądać estetycznie na co dzień i ograniczyć czas poświęcany na makijaż.",
    ],
    benefits: [
      "Kompleksowe podkreślenie brwi i rzęs w jednym zabiegu",
      "Naturalny lub wyraźniejszy efekt, zależnie od preferencji",
      "Lepsza symetria i estetyka oprawy oka",
      "Wygoda na co dzień i mniej czasu na makijaż",
    ],
    indications: [
      "osoby z jasnymi brwiami i rzęsami",
      "potrzeba odświeżenia wyglądu oprawy oka",
      "regularna pielęgnacja estetyczna",
      "przygotowanie do uroczystości i sesji zdjęciowej",
    ],
    seo: {
      h2: "Henna pełna Kołobrzeg – henna brwi i rzęs z regulacją w jednym zabiegu",
      description: [
        "Henna pełna w Kołobrzegu to zabieg łączący koloryzację brwi i rzęs henną oraz regulację kształtu brwi. W jednej wizycie uzyskujesz spójne, podkreślone spojrzenie – bez codziennego malowania brwi i rzęs. Usługa skierowana jest do osób z jasnymi brwiami i rzęsami oraz do tych, które chcą odświeżyć wygląd oprawy oka przed uroczystością lub na co dzień.",
        "Kolor henny dobieramy indywidualnie do urody i oczekiwań – od naturalnego po bardziej wyrazisty. Henna pełna Kołobrzeg to oszczędność czasu i wygoda: jeden zabieg co kilka tygodni zamiast codziennego makijażu oka.",
        "Zabieg trwa około 45 minut i jest wykonywany w przyjemnej atmosferze. Polecamy go jako element regularnej pielęgnacji lub przygotowanie do sesji zdjęciowej czy ważnego wydarzenia.",
      ],
      faq: [
        { question: "Ile trwa henna pełna (brwi i rzęsy)?", answer: "Henna pełna trwa około 45 minut. Obejmuje regulację brwi, koloryzację brwi henną oraz koloryzację rzęs henną." },
        { question: "Czym henna pełna różni się od samej henny brwi?", answer: "Henna pełna obejmuje dodatkowo koloryzację rzęs henną – brwi i rzęsy są w jednym kolorze i stylu, co daje spójny, wyraźny efekt oprawy oka." },
        { question: "Jak często powtarzać henę pełną?", answer: "Henna pełna utrzymuje się zwykle 2–4 tygodnie. W zależności od tempa odrostu i preferencji klientki zalecamy powtarzanie co 3–4 tygodnie." },
        { question: "Czy henna na rzęsach jest bezpieczna?", answer: "Stosujemy henny przeznaczone do strefy oka (brwi i rzęsy), które są bezpieczne przy prawidłowym wykonaniu. Nie barwimy skóry powiek – tylko włoski. Przeciwwskazaniem są m.in. stany zapalne oka i alergia na składniki." },
      ],
    },
  },
  "regulacja-brwi": {
    name: "Regulacja brwi",
    shortDescription:
      "Profesjonalne nadanie kształtu brwi i usunięcie zbędnych włosków dla estetycznej, harmonijnej oprawy oka.",
    duration: "ok. 20 min",
    priceFrom: "od 40 zł",
    treatmentHeading: "Na czym polega regulacja brwi",
    ctaHeading: "Umów regulację brwi online",
    description: [
      "Regulacja brwi to zabieg polegający na nadaniu brwiom odpowiedniego kształtu oraz usunięciu włosków spoza ich linii. Wykonujemy go z uwzględnieniem proporcji twarzy i indywidualnych preferencji – efekt jest naturalny i uporządkowany.",
      "Zabieg trwa około 20 minut i nie wymaga specjalnego przygotowania. To podstawa pielęgnacji brwi – regularna regulacja utrzymuje estetyczny wygląd i ułatwia codzienny makijaż.",
    ],
    benefits: [
      "Estetyczny, dopasowany do twarzy kształt brwi",
      "Lepsza symetria i uporządkowana linia brwi",
      "Szybki zabieg bez długiego przygotowania",
      "Regularna pielęgnacja oprawy oka",
    ],
    indications: [
      "potrzeba uporządkowania linii brwi",
      "regularna pielęgnacja brwi",
      "przygotowanie do ważnego wydarzenia",
      "asymetria lub nieuregulowane brwi",
    ],
    metaTitle: "Regulacja brwi — cena od 40 zł | Kołobrzeg | Stylizacja brwi",
    metaDescription:
      "Regulacja brwi w Kołobrzegu – profesjonalne nadanie kształtu i usunięcie zbędnych włosków. Cena od 40 zł, ok. 20 min. Umów wizytę online.",
    seo: {
      h2: "Regulacja brwi Kołobrzeg – profesjonalna stylizacja i kształt brwi",
      description: [
        "Regulacja brwi w naszym gabinecie w Kołobrzegu to zabieg polegający na precyzyjnym nadaniu kształtu brwi oraz usunięciu włosków spoza ich naturalnej linii. Wykonujemy go z uwzględnieniem proporcji twarzy, typu urody i indywidualnych preferencji – efekt jest naturalny i harmonijny.",
        "Profesjonalna regulacja brwi w Kołobrzegu to szybka usługa (około 20 minut), która nie wymaga specjalnego przygotowania. Polecamy ją jako element regularnej pielęgnacji – systematyczne wizyty utrzymują ładny kształt brwi i ułatwiają codzienny makijaż.",
        "Stylizacja brwi bez henny to dobry wybór dla osób, które chcą tylko uporządkować linię brwi lub wyrównać asymetrię, bez zmiany koloru.",
      ],
      faq: [
        {
          question: "Ile kosztuje regulacja brwi?",
          answer:
            "Cena regulacji brwi zaczyna się od 40 zł (ok. 20 minut). Przy większym zakresie korekty lub w połączeniu z innymi zabiegami na brwi wycena może być wyższa — szczegóły ustalamy przy rezerwacji.",
        },
        { question: "Ile trwa regulacja brwi?", answer: "Regulacja brwi trwa około 20 minut. Obejmuje dobór kształtu, usunięcie zbędnych włosków i ewentualne dopracowanie linii." },
        { question: "Jak często powtarzać regulację brwi?", answer: "W zależności od tempa odrostu zalecamy powtarzanie co 2–4 tygodnie. Regularna regulacja utrzymuje kształt brwi i zapobiega nadmiernemu porastaniu." },
        { question: "Czy regulacja brwi boli?", answer: "Zabieg może wiązać się z lekkim dyskomfortem, szczególnie przy pierwszej wizycie lub przy wrażliwej skórze. Stosujemy łagodne metody i dbamy o komfort klientki." },
      ],
    },
  },
};

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (isOdartMainHost(host)) {
    const wc = await fetchOdartWcStoreProductBySlug(params.slug);
    if (wc) {
      const raw = stripHtmlToText(wc.short_description || wc.description || "");
      const description = raw.length > 160 ? `${raw.slice(0, 157)}…` : raw;
      return {
        title: `${wc.name} | ODART`,
        description,
        alternates: { canonical: wc.permalink },
        openGraph: {
          title: wc.name,
          description,
          url: wc.permalink,
          siteName: "ODART",
          type: "website",
          locale: "pl_PL",
        },
      };
    }
    return { title: "404" };
  }

  const product = products[params.slug];

  if (!product) {
    return {
      title: "Produkt | Zabiegi Odart",
      robots: { index: false, follow: false },
    };
  }

  const url = `https://salon.odart.pl/produkt/${params.slug}`;
  const title = product.metaTitle ?? `${product.name} | Kołobrzeg`;
  const description =
    product.metaDescription ??
    `${product.shortDescription} Czas trwania: ${product.duration}. Cena: ${product.priceFrom}.`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Zabiegi Odart",
      type: "website",
      locale: "pl_PL",
    },
  };
}

function SalonProductPage({ params }: Props) {
  const product = products[params.slug];

  if (!product) {
    notFound();
  }

  const faqSchema =
    product.seo?.faq && product.seo.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: product.seo.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ClinicHeader />
      <main>
        <section className="py-20 bg-gradient-to-br from-beauty-pink via-beauty-pink-100 to-beauty-cream">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-beauty-rose mb-3">
              Produkt / usługa
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-beauty-charcoal mb-4">
              {product.name}
            </h1>
            <p className="text-lg lg:text-xl text-beauty-charcoal/80 max-w-3xl">
              {product.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/80 px-4 py-2 text-beauty-charcoal">
                Czas: {product.duration}
              </span>
              <span className="rounded-full bg-white/80 px-4 py-2 text-beauty-charcoal">
                Cena: {product.priceFrom}
              </span>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-beauty-charcoal mb-5">
              {product.treatmentHeading}
            </h2>
            <div className="space-y-4 text-beauty-charcoal/80">
              {product.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-beauty-cream/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-beauty-pink-200/60 bg-white p-6">
              <h2 className="text-2xl font-bold text-beauty-charcoal mb-4">
                Korzyści
              </h2>
              <ul className="space-y-2 text-beauty-charcoal/80">
                {product.benefits.map((benefit) => (
                  <li key={benefit}>- {benefit}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-beauty-pink-200/60 bg-white p-6">
              <h2 className="text-2xl font-bold text-beauty-charcoal mb-4">
                Dla kogo
              </h2>
              <ul className="space-y-2 text-beauty-charcoal/80">
                {product.indications.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-beauty-charcoal mb-4">
              {product.ctaHeading}
            </h2>
            <p className="text-beauty-charcoal/80 max-w-2xl mx-auto mb-8">
              Sprawdź dostępność terminów i wybierz gabinet dopasowany do Twoich
              potrzeb.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/portal/gabinety"
                className="inline-flex items-center justify-center rounded-full bg-beauty-rose px-8 py-4 font-semibold text-white hover:bg-beauty-pink-500 transition-colors"
              >
                Wybierz gabinet
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center justify-center rounded-full border border-beauty-rose px-8 py-4 font-semibold text-beauty-rose hover:bg-beauty-pink-100 transition-colors"
              >
                Wróć do portalu
              </Link>
            </div>

            {product.seo && (
              <details className="mt-12 text-left max-w-3xl mx-auto group" open>
                <summary className="cursor-pointer list-none font-semibold text-beauty-charcoal/80 hover:text-beauty-rose transition-colors py-2 flex items-center gap-2">
                  <span className="group-open:rotate-90 transition-transform inline-block">
                    ›
                  </span>
                  Więcej informacji o {product.name} w Kołobrzegu
                </summary>
                <div className="pt-6 space-y-6 border-t border-beauty-pink-200/60 mt-4">
                  <h2 className="text-2xl font-bold text-beauty-charcoal">
                    {product.seo.h2}
                  </h2>
                  <div className="space-y-4 text-beauty-charcoal/80 text-[15px] leading-relaxed">
                    {product.seo.description.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                  {product.seo.faq && product.seo.faq.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-beauty-charcoal">
                        Najczęściej zadawane pytania
                      </h3>
                      {product.seo.faq.map((item) => (
                        <details
                          key={item.question}
                          className="rounded-lg border border-beauty-pink-200/60 bg-white/80 overflow-hidden"
                        >
                          <summary className="px-4 py-3 cursor-pointer font-medium text-beauty-charcoal hover:bg-beauty-pink-50/50 transition-colors">
                            {item.question}
                          </summary>
                          <p className="px-4 py-3 pt-0 text-beauty-charcoal/80 text-sm border-t border-beauty-pink-100">
                            {item.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default async function ProductPage({ params }: Props) {
  const host = (await headers()).get("host") ?? "";
  if (isOdartMainHost(host)) {
    const wc = await fetchOdartWcStoreProductBySlug(params.slug);
    if (wc) {
      return <OdartWcStoreProductPage product={wc} />;
    }
    notFound();
  }
  return <SalonProductPage params={params} />;
}
