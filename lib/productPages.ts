export type ProductContent = {
  name: string;
  shortDescription: string;
  duration: string;
  priceFrom: string;
  treatmentHeading: string;
  ctaHeading: string;
  description: string[];
  benefits: string[];
  indications: string[];
  metaTitle?: string;
  metaDescription?: string;
  seo?: {
    h2: string;
    description: string[];
    faq?: { question: string; answer: string }[];
  };
};

/** Strony portfolio – te same treści co pod /produkt/[slug], osobny URL pod /portfolio/[slug] */
export const portfolioProducts: Record<string, ProductContent> = {
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
    metaTitle: "Regulacja brwi Kołobrzeg | Stylizacja brwi | Gabinet",
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
        { question: "Ile trwa regulacja brwi?", answer: "Regulacja brwi trwa około 20 minut. Obejmuje dobór kształtu, usunięcie zbędnych włosków i ewentualne dopracowanie linii." },
        { question: "Jak często powtarzać regulację brwi?", answer: "W zależności od tempa odrostu zalecamy powtarzanie co 2–4 tygodnie. Regularna regulacja utrzymuje kształt brwi i zapobiega nadmiernemu porastaniu." },
        { question: "Czy regulacja brwi boli?", answer: "Zabieg może wiązać się z lekkim dyskomfortem, szczególnie przy pierwszej wizycie lub przy wrażliwej skórze. Stosujemy łagodne metody i dbamy o komfort klientki." },
      ],
    },
  },
};
