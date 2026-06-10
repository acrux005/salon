import Link from "next/link";
import { ODART_SITE_URL } from "@/lib/odartSite";

const SITE = ODART_SITE_URL;

const ADMIN_FULL_NAME = "ODART Rafał Kowalkowski";
const ADMIN_BUSINESS = "Ostry Dyżur Artystyczny";
const ADMIN_ADDRESS = "ul. Makowskiego 3, 78-100 Kołobrzeg";
const ADMIN_NIP = "5791020696";

/** Regulamin serwisu www.odart.pl (strona marketingowa / zapytania), nie pełny regulamin sklepu e-commerce. */
export function OdartRegulaminSerwisuContent() {
  return (
    <div className="prose prose-invert prose-headings:scroll-mt-24 prose-p:text-neutral-400 prose-li:text-neutral-400 prose-strong:text-neutral-200 max-w-none">
      <p className="text-sm text-neutral-500 not-prose">
        Regulamin serwisu · wersja 1.0 · {new Date().getFullYear()} ·{" "}
        <a href={`${SITE}/`} className="text-odart-accent hover:text-orange-300">
          odart.pl
        </a>
      </p>

      <h2 className="text-xl font-bold text-white mt-10">1. Postanowienia ogólne</h2>
      <p>
        1. Niniejszy Regulamin określa zasady korzystania z serwisu internetowego dostępnego pod adresem{" "}
        <strong>odart.pl</strong> (dalej: „Serwis”).
      </p>
      <p>
        2. Serwis jest prowadzony przez{" "}
        <strong>{ADMIN_FULL_NAME}</strong>, prowadzącego jednoosobową działalność gospodarczą pod nazwą „
        {ADMIN_BUSINESS}” (dalej: „Administrator”), z siedzibą: {ADMIN_ADDRESS}, NIP {ADMIN_NIP}.
      </p>
      <p>
        3. Kontakt:{" "}
        <a href="mailto:biuro@odart.pl" className="text-odart-accent hover:text-orange-300">
          biuro@odart.pl
        </a>
        , tel.{" "}
        <a href="tel:+48695432415" className="text-odart-accent hover:text-orange-300">
          +48 695 432 415
        </a>
        .
      </p>
      <p>
        4. Korzystanie z Serwisu oznacza zapoznanie się z Regulaminem i jego akceptację w zakresie wymaganym przez
        prawo oraz — w przypadku formularzy — wyrażenie odpowiednich zgód wskazanych przy polach formularza.
      </p>
      <p className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-neutral-300 not-prose text-[15px] leading-relaxed">
        <strong className="text-neutral-200">Uwaga:</strong> Ten dokument reguluje korzystanie z serwisu informacyjnego
        (m.in. treści, formularz kontaktowy). Jeżeli prowadzisz lub będziesz prowadzić sprzedaż towarów lub usług na
        odległość z obowiązkiem konsumenckim (koszyk, płatność online), potrzebny jest{" "}
        <strong>osobny regulamin sprzedaży</strong> zgodny z ustawą o prawach konsumenta — do przygotowania z
        doradcą prawnym pod konkretny model sprzedaży.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">2. Definicje</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong>Serwis</strong> — witryna internetowa pod domeną odart.pl oraz powiązane podstrony udostępniane przez
          Administratora.
        </li>
        <li>
          <strong>Użytkownik</strong> — każda osoba odwiedzająca Serwis lub korzystająca z jego funkcji (np. formularz
          kontaktowy).
        </li>
        <li>
          <strong>Treści</strong> — teksty, grafiki, znaki towarowe, układ strony i inne materiały zamieszczone w Serwisie,
          o ile nie wskazano inaczej.
        </li>
      </ul>

      <h2 className="text-xl font-bold text-white mt-10">3. Zakres działania Serwisu</h2>
      <p>
        1. Serwis ma charakter informacyjny i promocyjny (prezentacja działalności, realizacji, kanału kontaktu).
      </p>
      <p>
        2. Złożenie zapytania przez formularz lub e-mail nie stanowi automatycznie zawarcia umowy — do zawarcia umowy
        dochodzi po odrębnym uzgodnieniu treści i warunków między stronami, chyba że przepisy szczególne stanowią inaczej.
      </p>
      <p>3. Administrator zastrzega sobie prawo do zmiany treści Serwisu, układu oraz dostępności poszczególnych sekcji.</p>

      <h2 className="text-xl font-bold text-white mt-10">4. Zasady korzystania</h2>
      <p>
        1. Użytkownik zobowiązuje się do korzystania z Serwisu w sposób zgodny z prawem, dobrymi obyczajami oraz
        postanowieniami niniejszego Regulaminu.
      </p>
      <p>
        2. Zabronione jest dostarczanie treści bezprawnych, wprowadzających w błąd, naruszających prawa osób trzecich lub
        dobre obyczaje, a także podejmowanie działań mogących zakłócić działanie Serwisu lub naruszyć jego bezpieczeństwo.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">5. Prawa autorskie i znaki</h2>
      <p>
        1. Treści zamieszczone w Serwisie podlegają ochronie na podstawie ustawy o prawie autorskim i prawach pokrewnych
        oraz innych przepisów, o ile są utworami w rozumieniu tej ustawy.
      </p>
      <p>
        2. Korzystanie z Treści wykraczające poza dozwolony użytek osobisty wymaga zgody Administratora, chyba że przepisy
        bezwzględnie obowiązujące stanowią inaczej.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">6. Odpowiedzialność</h2>
      <p>
        1. Administrator dokłada starań, aby informacje w Serwisie były aktualne i rzetelne, nie gwarantuje jednak
        pełnej kompletności i aktualności w dowolnym momencie.
      </p>
      <p>
        2. Serwis może zawierać odnośniki do stron osób trzecich; Administrator nie odpowiada za treści i polityki tych
        stron.
      </p>

      <h2 className="text-xl font-bold text-white mt-10">7. Dane osobowe</h2>
      <p>
        Zasady przetwarzania danych osobowych określa{" "}
        <Link href={`${SITE}/polityka-prywatnosci/`} className="text-odart-accent hover:text-orange-300">
          Polityka prywatności
        </Link>
        .
      </p>

      <h2 className="text-xl font-bold text-white mt-10">8. Postanowienia końcowe</h2>
      <p>1. Administrator może zmieniać Regulamin; aktualna wersja będzie publikowana pod adresem Serwisu.</p>
      <p>2. W sprawach nieuregulowanych Regulaminem zastosowanie mają przepisy prawa polskiego.</p>
      <p>
        3. Właściwe do rozstrzygania sporów z Użytkownikami będącymi konsumentami są sądy powszechne zgodnie z przepisami
        ustawy z dnia 17 listopada 1964 r. — Kodeks postępowania cywilnego.
      </p>
    </div>
  );
}
