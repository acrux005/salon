/** Baner pod nagłówkiem wpisu /blog/realizacje (plik w `public/`, zamiast grafiki z WordPressa). */
export const ODART_REALIZACJE_HERO_IMAGE = {
  src: "/images/odart/blog-realizacje-banner.jpg",
  alt: "ODART projects - websites, applications and client work",
} as const;

/** Strony WWW klientów — treść wpisu /blog/realizacje (obok ODART_PORTFOLIO_ITEMS ze strony głównej). */
export type OdartRealizacjaKlient = {
  title: string;
  host: string;
  href: string;
  description: string;
  tech: string[];
};

export const ODART_REALIZACJE_KLIENCI: OdartRealizacjaKlient[] = [
  {
    title: "Szkoła Języków Obcych Europa",
    host: "szkolaeuropa.pl",
    href: "https://szkolaeuropa.pl/",
    description:
      "Serwis szkoły językowej w Kołobrzegu — oferta kursów, zajęcia online, projekty unijne, egzaminy i dane kontaktowe.",
    tech: ["WordPress", "Divi"],
  },
  {
    title: "Magdalena Krupska — Product Owner",
    host: "mkdigitalstudio.pl",
    href: "https://mkdigitalstudio.pl/",
    description:
      "Strona osobista product manager / owner: portfolio, ścieżka kariery, rekomendacje i kontakt — przejrzysty layout pod personal branding.",
    tech: ["WordPress", "Divi"],
  },
  {
    title: "EcoCar Kołobrzeg",
    host: "ecocar-kolobrzeg.pl",
    href: "https://ecocar-kolobrzeg.pl/",
    description:
      "Witryna wycieczek melexem po Kołobrzegu — oferta tras, ceny, rezerwacje i informacje o flocie pojazdów elektrycznych.",
    tech: ["WordPress", "Divi"],
  },
  {
    title: "MK Profit — biuro rachunkowe",
    host: "mkprofit.com.pl",
    href: "https://mkprofit.com.pl/",
    description:
      "Strona biura rachunkowego: zakres usług księgowych, kadry, rejestracja firm, dane kontaktowe i zaufanie pod leady.",
    tech: ["WordPress", "Divi"],
  },
  {
    title: "Kancelaria radcy prawnego Włodzimierz Myśliński",
    host: "kancelaria-myslinski.pl",
    href: "https://kancelaria-myslinski.pl/",
    description:
      "Serwis kancelarii w Koszalinie — specjalizacje prawnicze, opis usług, dane do kontaktu i zgodność z RODO (cookies).",
    tech: ["WordPress", "Divi"],
  },
  {
    title: "Domki letniskowe Bursztynek",
    host: "bursztynek-domki.pl",
    href: "https://bursztynek-domki.pl/",
    description:
      "Ośrodek w Grzybowie — prezentacja domków i apartamentu, okolica, cennik, rezerwacje i dane kontaktowe.",
    tech: ["WordPress", "Divi"],
  },
  {
    title: "Zbigniew Komorowski — wokalista",
    host: "zbigniewkomorowski.pl",
    href: "https://zbigniewkomorowski.pl/",
    description:
      "Strona artysty: koncerty, album, materiały promocyjne i kontakt — lekki serwis pod eventy i agencje.",
    tech: ["WordPress"],
  },
  {
    title: "Jola Tubielewicz",
    host: "jolatubielewicz.pl",
    href: "https://jolatubielewicz.pl/",
    description:
      "Witryna wokalistki — bio, oferta koncertów, wideo, galeria i ścieżka kontaktu dla organizatorów.",
    tech: ["WordPress", "Divi"],
  },
  {
    title: "Biuro usług księgowych Magdalena Kowalkowska",
    host: "magdakowalkowska.pl",
    href: "https://magdakowalkowska.pl/",
    description:
      "Strona księgowej w Kołobrzegu — usługi dla JDG i małych firm, osiągnięcia, proces współpracy i zgody cookies.",
    tech: ["WordPress", "Divi"],
  },
  {
    title: "Domki mobilne — oferta",
    host: "domki-mobilne.odart.pl",
    href: "https://domki-mobilne.odart.pl/",
    description:
      "Prezentacja domków mobilnych: modele, parametry, zdjęcia i kontakt — strona pod sprzedaż i zapytania handlowe.",
    tech: ["WordPress"],
  },
  {
    title: "Beauty Room — kosmetologia estetyczna",
    host: "roombeauty.pl",
    href: "https://roombeauty.pl/",
    description:
      "Gabinet w Kołobrzegu — opis zabiegów (m.in. Eximia, laser), portfolio efektów, opinie i formularz kontaktowy.",
    tech: ["WordPress", "Divi"],
  },
  {
    title: "Auto-Max — warsztat i zbieżność",
    host: "zbieznosc-kolobrzeg.pl",
    href: "https://zbieznosc-kolobrzeg.pl/",
    description:
      "Strona warsztatu w Kołobrzegu — zbieżność 3D, serwis, wulkanizacja, klimatyzacja, dane do rezerwacji i kontaktu.",
    tech: ["WordPress", "Divi"],
  },
  {
    title: "Kos-Mos — salon optyczny",
    host: "kos-mos.pl",
    href: "https://kos-mos.pl/",
    description:
      "Sklep z okularami korekcyjnymi — katalog marek, ceny, koszyk WooCommerce i dane sklepu stacjonarnego.",
    tech: ["WordPress", "WooCommerce"],
  },
];
