/** Wybrane realizacje ODART — dane współdzielone (strona główna, portfolio). */
export type OdartPortfolioItem = {
  title: string;
  host: string;
  href: string;
  description: string;
  tech: string[];
  image: string;
};

export const ODART_PORTFOLIO_ITEMS: OdartPortfolioItem[] = [
  {
    title: "Portal salonu beauty",
    host: "salon.odart.pl",
    href: "https://salon.odart.pl/",
    description:
      "Rezerwacje wizyt, katalog gabinetów i ścieżka klienta — jeden serwis pod branżę beauty i wellness.",
    tech: ["Next.js", "React", "TypeScript"],
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80",
  },
  {
    title: "Zamów — zamówienia online",
    host: "zamow.odart.pl",
    href: "https://zamow.odart.pl/",
    description:
      "Składanie zamówień z telefonu lub komputera — menu, koszyk i obsługa pod lokale gastronomiczne.",
    tech: ["Next.js", "React", "REST API"],
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80",
  },
  {
    title: "Prokursy",
    host: "prokursy-online.pl",
    href: "https://prokursy-online.pl/",
    description: "Platforma kursów online: treści, materiały i logika pod sprzedaż szkoleń w sieci.",
    tech: ["Next.js", "wideo", "LMS"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&q=80",
  },
  {
    title: "Harmonogram",
    host: "harmonogram.odart.pl",
    href: "https://harmonogram.odart.pl/demo",
    description:
      "Warsztat: zlecenia, pojazdy, klienci, opony (harmonogram.odart.pl/demo). Profil firmowy / produkcja: projekty i harmonogram zadań (/demo/produkcja).",
    tech: ["Next.js", "kalendarz", "role"],
    image: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=900&q=80",
  },
  {
    title: "Demo inwestycji deweloperskiej",
    host: "stronadewelopera.pl",
    href: "https://stronadewelopera.pl/demo/inwestycja/",
    description:
      "Strona inwestycji: mieszkania, filtry, galeria i ścieżka kontaktu — gotowy wzorzec pod sprzedaż lokali.",
    tech: ["Next.js", "React", "animacje"],
    image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&q=80",
  },
  {
    title: "Randki Odart",
    host: "randka.odart.pl",
    href: "https://randka.odart.pl/",
    description:
      "Portal randkowy z profilem, dopasowaniem wzajemnych polubień, czatem i propozycją spotkania — bez swipe'a na ślepo.",
    tech: ["Next.js", "React", "TypeScript"],
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=900&q=80",
  },
  {
    title: "Fotoferia",
    host: "fotoferia.pl",
    href: "https://fotoferia.pl/",
    description:
      "Portal społecznościowy dla fotografów — galerie, konkursy i wyszukiwanie prac; rozwijany od 2008 roku.",
    tech: ["PHP", "MySQL", "SEO"],
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900&q=80",
  },
];
