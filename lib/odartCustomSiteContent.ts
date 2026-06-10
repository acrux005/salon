/**
 * Treści pod odart.pl zamiast HTML z WP REST (Divi/shortcode nie renderują się w API).
 * Tylko domena główna — logika hosta pozostaje w stronach.
 */

export type OdartContentOverride = {
  title: string;
  /** Mały tekst nad H1 jak na /portfolio */
  eyebrow?: string;
  /** Semantyczny HTML (nagłówki, akapity, listy) */
  html: string;
  /** Opcjonalny obraz z WP — zwykle brak */
  imageUrl?: string | null;
  imageAlt?: string | null;
};

const SITE = "https://odart.pl";

/** Strony jednosegmentowe (app/[slug]) */
export const ODART_PAGE_OVERRIDES: Record<string, OdartContentOverride | { redirectTo: string }> = {
  odart: { redirectTo: "/" },
  realizacje: { redirectTo: "/blog/realizacje" },

  sklep: { redirectTo: "/uslugi/" },

  dyspozytornia: {
    title: "Dyspozytornia",
    eyebrow: "System",
    html: `
<p class="text-neutral-400 text-sm uppercase tracking-wide mb-4">Panel operacyjny</p>
<p>Ta podstrona w oryginalnym serwisie WordPress była powiązana z wtyczką do zarządzania dyspozytornią (przesyłkami / zleceniami). W obecnym wdrożeniu Next.js nie osadzamy tu osadnika — jeśli potrzebujesz podobnego narzędzia lub integracji z procesem logistycznym, opisz proszę zakres w kontakcie.</p>
<ul class="list-disc pl-5 space-y-2 mt-4 text-neutral-300">
<li>integracja z formularzami i bazą zleceń,</li>
<li>panele wewnętrzne pod zespół,</li>
<li>API i automatyzacja.</li>
</ul>
<p class="mt-6"><a href="${SITE}/kontakt/" class="text-odart-accent font-semibold hover:text-orange-300">Przejdź do kontaktu →</a></p>
`,
  },

  kierowca: {
    title: "Kierowca",
    eyebrow: "System",
    html: `
<p class="text-neutral-400 text-sm uppercase tracking-wide mb-4">Panel kierowcy</p>
<p>Strona służyła jako wejście do panelu dla kierowców (shortcode w WordPressie). W wersji Next nie renderujemy tu starego shortcode — jeśli planujesz aplikację webową dla floty lub pracowników w terenie, mogę zaprojektować i wdrożyć panel (Next.js, role, mobilny UX).</p>
<p class="mt-4"><a href="${SITE}/produkt/panele-i-systemy-dla-firm/" class="text-odart-accent font-semibold hover:text-orange-300">Panele i systemy dla firm →</a> · <a href="${SITE}/kontakt/" class="text-odart-accent font-semibold hover:text-orange-300 ml-2">Kontakt →</a></p>
`,
  },

  "wpbc-booking": {
    title: "Formularz rezerwacji",
    eyebrow: "Rezerwacja",
    html: `
<p class="text-neutral-400 text-sm uppercase tracking-wide mb-4">Termin</p>
<p>Wcześniej na tej stronie osadzony był kalendarz rezerwacji (Booking Calendar). Jeśli potrzebujesz rezerwacji terminów na stronie firmowej — mogę podpiąć narzędzie pod Next.js lub zintegrować z Twoim procesem (CRM, płatności, przypomnienia).</p>
<p class="mt-6"><a href="${SITE}/kontakt/" class="inline-flex items-center justify-center rounded-lg bg-odart-accent px-6 py-3 font-semibold text-white hover:brightness-110">Umów rozmowę</a></p>
`,
  },

  "right-sidebar": {
    title: "Układ pomocniczy",
    eyebrow: "ODART",
    html: `
<p>To była strona techniczna szablonu (sidebar) — nie zawiera treści merytorycznej. Wróć na stronę główną lub skorzystaj z menu.</p>
<p class="mt-6"><a href="${SITE}/" class="text-odart-accent font-semibold hover:text-orange-300">Strona główna →</a></p>
`,
  },

  "wpwbot-mobile-app": {
    title: "Czat i wsparcie",
    eyebrow: "Narzędzia",
    html: `
<p class="text-neutral-400 text-sm uppercase tracking-wide mb-4">Komunikacja</p>
<p>Na starej witrynie mógł być osadzony chatbot (np. wpwBot). W obecnym układzie pytania proszę kierować na e-mail lub formularz kontaktowy — odpowiadam tak szybko, jak to możliwe.</p>
<p class="mt-6"><a href="mailto:biuro@odart.pl" class="text-odart-accent font-semibold hover:text-orange-300">biuro@odart.pl</a> · <a href="${SITE}/kontakt/" class="text-odart-accent font-semibold hover:text-orange-300 ml-3">Formularz →</a></p>
`,
  },

  "od-pomyslu-do-prototypu-odkryj-proces-projektowania-ux": {
    title: "Od pomysłu do prototypu — proces projektowania UX",
    eyebrow: "UX",
    html: `
<h2 class="!text-white !mt-0">Dlaczego kolejność ma znaczenie</h2>
<p>Projektowanie UX to nie tylko „ładne ekrany”. To uporządkowany ciąg decyzji: od problemu użytkownika, przez model mentalny, aż po interakcje, które da się przetestować. Prototyp jest momentem, w którym pomysł staje się sprawdzalny — zanim zainwestujesz w pełne wdrożenie.</p>
<h2>Etapy w skrócie</h2>
<ul class="list-disc pl-5 space-y-2 text-neutral-300">
<li><strong class="text-white">Discovery</strong> — cele biznesowe, ograniczenia techniczne, słowa kluczowe użytkowników.</li>
<li><strong class="text-white">Research</strong> — wywiady, ankiety, analiza konkurencji i istniejących danych (jeśli są).</li>
<li><strong class="text-white">Architektura informacji</strong> — mapa treści, nawigacja, scenariusze zadań.</li>
<li><strong class="text-white">Szkice i wireframe’y</strong> — szybka weryfikacja układu bez kosztownego designu pikselowego.</li>
<li><strong class="text-white">Prototyp</strong> — klikalny przepływ (np. w Figmie), gotowy do testów z użytkownikami.</li>
<li><strong class="text-white">Testy i iteracja</strong> — poprawki przed przekazaniem do developmentu.</li>
</ul>
<h2>Co zyskujesz</h2>
<p>Mniej nieporozumień między zespołem a developmentem, wcześniejsze wychwycenie błędów w przepływie oraz spójny język opisu funkcji. Jeśli budujesz produkt webowy lub rozbudowany serwis, warto zaplanować UX przed pierwszym commitem w kodzie produkcyjnym.</p>
<p class="mt-6 text-neutral-500 text-sm">Treść opracowana w stylu ODART — Kołobrzeg, praca zdalna z klientami w całej Polsce.</p>
`,
  },

  "opis-roli-ux-researcher-product-manager": {
    title: "Opis roli: UX Researcher / Product Manager",
    eyebrow: "Produkt",
    html: `
<h2 class="!text-white !mt-0">UX Researcher</h2>
<p>Osoba odpowiedzialna za <strong class="text-white">systematyczne poznanie użytkownika</strong>: planuje badania (jakościowe i ilościowe), rekrutuje uczestników, prowadzi wywiady, analizuje wyniki i przekłada je na rekomendacje dla zespołu produktowego. Nie chodzi o „opinie”, lecz o powtarzalne wnioski poparte danymi i cytatami.</p>
<h2>Product Manager</h2>
<p>Łączy perspektywę użytkownika, biznesu i technologii: ustala priorytety w backlogu, formułuje problem do rozwiązania, współpracuje z designem i deweloperami oraz pilnuje, żeby dostarczane incrementy przybliżały produkt do założonych wskaźników.</p>
<h2>Gdzie się te role spotykają</h2>
<p>W mniejszych zespołach jedna osoba często łączy elementy obu ról — zwłaszcza we wczesnej fazie produktu. W większych organizacjach research i PM bywają rozdzielone, ale muszą mówić tym samym językiem priorytetów i metryk.</p>
<p class="mt-6"><a href="${SITE}/kontakt/" class="text-odart-accent font-semibold hover:text-orange-300">Konsultacja pod produkt lub serwis →</a></p>
`,
  },

  "product-discovery-ux-research": {
    title: "Product Discovery i UX Research",
    eyebrow: "Discovery",
    html: `
<h2 class="!text-white !mt-0">Czym jest Product Discovery</h2>
<p>To etap, w którym zespół <strong class="text-white">sprawdza, czy w ogóle warto coś budować</strong> — jak duży jest problem, kto płaci, jakie są alternatywy i jak zmierzyć sukces. Discovery ogranicza ryzyko wydania budżetu na funkcje, których nikt nie potrzebuje.</p>
<h2>Rola researchu</h2>
<p>UX research dostarcza danych jakościowych (np. wywiady) i ilościowych (metryki, lejki), które pozwalają ustalić hipotezy i kolejność eksperymentów. Dobrze zaplanowany discovery kończy się jasnymi wnioskami: „robimy”, „odkładamy”, „wymaga walidacji”.</p>
<h2>Praktyczny skutek</h2>
<p>Krótsze pętle decyzyjne, mniej przeróbek w kodzie i lepsze uzasadnienie roadmapy przed interesariuszami.</p>
`,
  },

  "wywiady-uzytkownikow": {
    title: "Wywiady z użytkownikami",
    eyebrow: "Badania",
    html: `
<h2 class="!text-white !mt-0">Po co robić wywiady</h2>
<p>Wywiad pogłębiony pozwala zrozumieć <strong class="text-white">motywacje, kontekst i język</strong> użytkownika — nie tylko to, czy „lubi” interfejs. To podstawa dobrego UX przy produktach B2B i B2C.</p>
<h2>Jak to wygląda w praktyce</h2>
<ul class="list-disc pl-5 space-y-2 text-neutral-300">
<li>scenariusz i pytania otwarte,</li>
<li>nagranie (za zgodą) i notatki,</li>
<li>affinity mapping lub kodowanie tematów,</li>
<li>wnioski przekładane na wymagania i zmiany w prototypie.</li>
</ul>
<h2>Etyka i jakość</h2>
<p>Transparentna rekrutacja, informacja o celu badania i ochrona danych osobowych — to standard, bez którego wyniki nie są wiarygodne.</p>
`,
  },

  "zrozumienie-uzytkownika-klucz-do-sukcesu-projektowego": {
    title: "Zrozumienie użytkownika — klucz do sukcesu projektowego",
    eyebrow: "UX",
    html: `
<h2 class="!text-white !mt-0">Projekt zaczyna się od kontekstu</h2>
<p>Nawet najlepszy stos technologiczny nie zastąpi odpowiedzi na pytanie: <strong class="text-white">kto i w jakiej sytuacji</strong> korzysta z produktu. Zrozumienie użytkownika to warunek sensownych decyzji o funkcjach, treściach i priorytetach.</p>
<h2>Co oznacza „zrozumienie” w praktyce</h2>
<ul class="list-disc pl-5 space-y-2 text-neutral-300">
<li>persony oparte na researchu, nie na domysłach,</li>
<li>mapy ścieżki i momenty bólu (pain points),</li>
<li>metryki zachowań, jeśli produkt już istnieje,</li>
<li>feedback w pętli: wdrożenie → obserwacja → korekta.</li>
</ul>
<h2>Połączenie z realizacją webową</h2>
<p>Przy stronach i aplikacjach, które buduję w Kołobrzegu i zdalnie dla klientów z całej Polski, zawsze można zaplanować etap discovery przed projektem UI i wdrożeniem — szczególnie gdy stakeholdery mają różne oczekiwania.</p>
<p class="mt-6"><a href="${SITE}/kontakt/" class="text-odart-accent font-semibold hover:text-orange-300">Porozmawiajmy o Twoim projekcie →</a></p>
`,
  },
};

/** Projekty (app/project/[slug]) — treść zamiast Divi z REST */
export const ODART_PROJECT_OVERRIDES: Record<string, OdartContentOverride> = {
  "sklep-internetowy-egifteria": {
    title: "Sklep internetowy Egifteria",
    eyebrow: "Realizacja",
    html: `
<p class="text-neutral-400 text-sm uppercase tracking-wide mb-4">E-commerce · WordPress / WooCommerce</p>
<p>Projekt sklepu z upominkami i grami planszowymi: <strong class="text-white">przejrzysta nawigacja</strong>, karty produktów czytelne na mobile, integracja z płatnościami i dostawą. Nacisk na szybkie ładowanie i spójny branding.</p>
<h2 class="!text-white">Zakres</h2>
<ul class="list-disc pl-5 space-y-2 text-neutral-300">
<li>szablon pod katalog i promocje,</li>
<li>dostosowanie checkoutu pod polski rynek,</li>
<li>optymalizacja pod SEO techniczne i treści.</li>
</ul>
<p class="mt-6 text-neutral-500 text-sm">Case study w skrócie — szczegóły ustalamy przy podobnym wdrożeniu.</p>
`,
  },

  "strona-dla-baru-sushi": {
    title: "Strona dla baru sushi",
    eyebrow: "Realizacja",
    html: `
<p class="text-neutral-400 text-sm uppercase tracking-wide mb-4">Gastronomia · witryna lokalna</p>
<p>Strona pod lokal gastronomiczny: menu, godziny, dojazd i zamówienia — z naciskiem na <strong class="text-white">zdjęcia i czytelność na telefonie</strong>. Projekt podkreśla charakter marki i ułatwia szybki kontakt.</p>
<h2 class="!text-white">Efekt dla klienta</h2>
<p>Spójny przekaz wizualny, szybkie ładowanie i jasne wezwanie do działania (rezerwacja / telefon).</p>
`,
  },

  "strona-dla-domkow-mobilnych": {
    title: "Strona dla domków mobilnych",
    eyebrow: "Realizacja",
    html: `
<p class="text-neutral-400 text-sm uppercase tracking-wide mb-4">Branża noclegowa / produkt</p>
<p>Witryna prezentująca ofertę domków mobilnych: sekcje z parametrami, galeria, kontakt i zapytania ofertowe. Układ pod <strong class="text-white">SEO lokalne i ogólnopolskie</strong>, responsywność pod urządzenia mobilne.</p>
`,
  },

  "strona-dla-fotografa": {
    title: "Strona dla fotografa",
    eyebrow: "Realizacja",
    html: `
<p class="text-neutral-400 text-sm uppercase tracking-wide mb-4">Portfolio · kreatywna branża</p>
<p>Strona portfolio z naciskiem na <strong class="text-white">duże zdjęcia, szybki lazy-load i prostą nawigację</strong>. Struktura pod pakiety, kontakt i social proof — bez przeładowania animacjami.</p>
`,
  },

  "strona-dla-kancelarii-prawnej": {
    title: "Strona dla kancelarii prawnej",
    eyebrow: "Realizacja",
    html: `
<p class="text-neutral-400 text-sm uppercase tracking-wide mb-4">Usługi prawnicze · zaufanie</p>
<p>Projekt pod biuro prawnicze: przejrzysty podział specjalizacji, zespół, dane kontaktowe i zgodność z wymogami informacyjnymi. Ton <strong class="text-white">profesjonalny i spokojny</strong>, typografia czytelna na desktopie i mobile.</p>
`,
  },
};

export function getOdartPageOverride(slug: string): OdartContentOverride | { redirectTo: string } | null {
  return ODART_PAGE_OVERRIDES[slug] ?? null;
}

export function getOdartProjectOverride(slug: string): OdartContentOverride | null {
  return ODART_PROJECT_OVERRIDES[slug] ?? null;
}
