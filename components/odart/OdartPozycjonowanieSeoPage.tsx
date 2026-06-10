import Link from "next/link";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/pozycjonowanie-seo/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${CANONICAL}#article`,
      headline: "Ogólne zasady pozycjonowania (SEO) stron internetowych",
      datePublished: "2024-05-26",
      dateModified: "2024-05-26",
      author: { "@type": "Organization", name: "ODART", url: SITE },
      publisher: {
        "@type": "Organization",
        name: "ODART — Ostry Dyżur Artystyczny",
        url: SITE,
      },
      mainEntityOfPage: { "@id": `${CANONICAL}#webpage` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Zasady pozycjonowania SEO | ODART",
      isPartOf: { "@id": `${SITE}/#website` },
    },
  ],
};

export function OdartPozycjonowanieSeoPage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <article className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-odart-accent">
            <Link href={`${SITE}/blog/`} className="hover:text-orange-300">
              Blog
            </Link>
            <span className="text-neutral-600"> · </span>
            <span className="text-neutral-400">Strony internetowe</span>
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Ogólne zasady pozycjonowania (SEO) stron internetowych
          </h1>
          <p className="mt-4 text-sm text-neutral-500">
            <time dateTime="2024-05-26">26 maja 2024</time>
            {" · "}
            Kategoria: strony internetowe
          </p>

          <div className="prose prose-invert prose-headings:scroll-mt-24 prose-p:text-neutral-400 prose-li:text-neutral-400 prose-strong:text-neutral-200 mt-10 max-w-none">
            <p className="lead text-lg text-neutral-300">
              SEO (Search Engine Optimization) to zbiór strategii i technik mających na celu poprawę widoczności strony
              internetowej w wynikach wyszukiwania organicznego. Oprócz optymalizacji tekstu i struktury strony, istotne
              jest również zoptymalizowanie obrazków — mogą one wspierać pozycjonowanie i ruch organiczny oraz
              doświadczenie użytkownika. Warto dbać o <strong>alt</strong> (alternatywne opisy obrazków) jako kluczowy
              element SEO grafik.
            </p>

            <h2 className="text-xl font-bold text-white mt-12">1. Używaj słów kluczowych we właściwych miejscach</h2>
            <p>
              Dodawanie słów kluczowych na stronach, które chcesz pozycjonować, jest bardzo ważne. Równie istotne jest
              jednak to, <strong>gdzie</strong> je umieszczasz — nie tylko ile razy się pojawiają. Dla przykładu możesz
              naturalnie wpleść frazę <strong>pozycjonowanie SEO</strong> w treść artykułu.
            </p>
            <p className="font-medium text-neutral-300">Miejsca, które warto wykorzystać:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Tag tytułowy strony</strong> — słowo kluczowe przynajmniej raz w <code className="text-orange-300">&lt;title&gt;</code>.
                To jedna z pierwszych informacji w SERP.
              </li>
              <li>
                <strong>Pierwsze ok. 100 słów treści</strong> — umieść frazę na początku tekstu; ułatwia to zrozumienie
                tematu i sygnał dla wyszukiwarki.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-white mt-12">2. Adres URL</h2>
            <p>
              Stawiaj na krótkie, czytelne URL. Łatwiej je zapamiętać; są przyjazne użytkownikom i robotom. Staraj się,
              aby w adresie znalazło się główne słowo kluczowe strony lub artykułu.
            </p>

            <h2 className="text-xl font-bold text-white mt-12">3. Długie teksty</h2>
            <p>
              Dłuższe, merytoryczne treści (czasem nawet kilka tysięcy słów) mają większą szansę wyczerpująco omówić temat,
              odpowiedzieć na zapytania użytkowników i zwiększyć czas na stronie — pod warunkiem wartości dla czytelnika,
              a nie samego „pchania objętości”.
            </p>

            <h2 className="text-xl font-bold text-white mt-12">4. Liczby i nawiasy w tytułach</h2>
            <p>
              Tytuły z liczbami i nawiasami często lepiej przyciągają uwagę i mogą poprawić CTR, np. „10 praktyk SEO (które
              działają w 2024)”.
            </p>

            <h2 className="text-xl font-bold text-white mt-12">5. Linki</h2>
            <p>
              W artykule warto dodać kilka <strong>linków wewnętrznych</strong> (nawigacja, kontekst, PageRank w obrębie
              serwisu) oraz <strong>zewnętrznych</strong> do wiarygodnych źródeł (np. dokumentacja Google, renomowane
              publikacje branżowe).
            </p>

            <h2 className="text-xl font-bold text-white mt-12">6. Multimedia</h2>
            <p>
              Do zdjęć i materiałów wideo dodawaj opisy: <strong>alt</strong> dla obrazów, transkrypcje lub fragmenty
              tekstu przy wideo. Wyszukiwarki lepiej rozumieją treść multimedialną z opisem; to też dostępność (a11y).
            </p>

            <h2 className="text-xl font-bold text-white mt-12">7. Aktualizacja</h2>
            <p>
              Regularnie odświeżaj ważne podstrony — nowe dane, sekcje FAQ, aktualne liczby. Świeższa, użyteczna treść
              bywa lepiej oceniana niż zapomniane strony „z 2016”.
            </p>

            <h2 className="text-xl font-bold text-white mt-12">8. Zbędne strony</h2>
            <p>
              Rozważ usunięcie lub scalenie słabych, pustych URL-i, które nie wnoszą wartości — by nie rozpraszać crawl
              budgetu i nie obniżać ogólnej jakości serwisu.
            </p>

            <h2 className="text-xl font-bold text-white mt-12">9. Semantyczne słowa kluczowe (LSI)</h2>
            <p>
              To terminy powiązane tematycznie z główną frazą — często pojawiające się w tym samym kontekście, ale nie
              zawsze będące prostymi synonimami. Pomagają doprecyzować intencję i tematykę tekstu.
            </p>
            <p className="font-medium text-neutral-300">Skąd brać pomysły:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Podpowiedzi Google</strong> (autouzupełnianie) przy wpisywaniu zapytania.
              </li>
              <li>
                Sekcja <strong>„Podobne wyszukiwania”</strong> na dole wyników.
              </li>
              <li>
                <strong>Grafika Google</strong> — powiązane frazy przy wyszukiwaniu obrazów.
              </li>
              <li>
                <strong>Google Keyword Planner</strong> — dobór fraz i grup tematycznych.
              </li>
              <li>
                <strong>Google Search Console</strong> — jakie zapytania realnie prowadzą na Twoją stronę; warto wplatać
                te frazy w treść tam, gdzie ma to sens.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-white mt-12">10. Zatrzymaj użytkowników na stronie</h2>
            <p>
              Jeśli użytkownik wraca z Twojej strony do SERP po kilku sekundach, to zły sygnał. Ułatw czytanie:
              nagłówki, listy, akapity, treść „na skan”. Jasna struktura zwiększa szansę na dłuższą sesję.
            </p>

            <h2 className="text-xl font-bold text-white mt-12">11. Backlinki</h2>
            <p>
              Linki z autorytatywnych witryn (wartościowe wzmianki, gościnne artykuły, partnerstwa) mogą wzmacniać
              widoczność — zawsze w modelu naturalnym i zgodnym z wytycznymi wyszukiwarek, bez sztucznych sieci linków.
            </p>

            <h2 className="text-xl font-bold text-white mt-12">12. Google Search Console</h2>
            <p>
              W raporcie <strong>Skuteczność</strong> zobaczysz zapytania i strony z największym ruchem. Sekcja
              „Strony” pomaga znaleźć URL-e do dopracowania. Analiza fraz, na które już „łapiesz” ruch, podpowiada, co
              rozwinąć w treści — często wystarczy naturalnie wpleść te terminy w istniejące artykuły.
            </p>
          </div>

          <div className="mt-14 rounded-2xl border border-odart-accent/30 bg-neutral-950/50 p-6">
            <p className="text-sm font-medium text-orange-300">Potrzebujesz pomocy przy SEO?</p>
            <p className="mt-2 text-sm text-neutral-400">
              W ofercie ODART: audyt, optymalizacja treści i techniczna —{" "}
              <Link href={`${SITE}/uslugi/`} className="text-odart-accent hover:text-orange-300">
                usługi SEO
              </Link>
              ,{" "}
              <Link href={`${SITE}/kontakt/`} className="text-odart-accent hover:text-orange-300">
                kontakt
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </OdartPublicShell>
  );
}
