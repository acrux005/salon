import Link from "next/link";
import { Building2, ChevronRight, ExternalLink, Mail, Shield } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/project/strona-dla-dewelopera/`;
const DEMO_DEVELOPER = "https://stronadewelopera.pl/demo/inwestycja/";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Strona dla dewelopera | ODART",
      description:
        "Profesjonalne strony internetowe dla inwestycji deweloperskich — WordPress, UX/UI, bezpieczeństwo, backup. Kołobrzeg.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Service",
      "@id": `${CANONICAL}#service`,
      name: "Strona internetowa dla dewelopera",
      serviceType: "Strony WWW dla deweloperów i inwestycji mieszkaniowych",
      provider: { "@id": `${SITE}/#org` },
      areaServed: { "@type": "City", name: "Kołobrzeg" },
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "ODART — Ostry Dyżur Artystyczny",
      url: SITE,
      telephone: "+48695432415",
      email: "biuro@odart.pl",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
    },
  ],
};

export function OdartProjectStronaDlaDeweloperaPage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <article className="border-b border-white/10 px-4 py-10 lg:px-6 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <Link href={`${SITE}/`} className="hover:text-odart-accent">
              Strona główna
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-neutral-300">Strona dla dewelopera</span>
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">Ostry Dyżur Artystyczny</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Strona dla dewelopera</h1>
          <p className="mt-4 text-lg font-semibold text-neutral-200">ODART</p>
          <p className="mt-1 text-sm font-medium text-odart-accent">Strony internetowe</p>
          <a
            href="mailto:biuro@odart.pl"
            className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-odart-accent"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            biuro@odart.pl
          </a>
          <p className="mt-8 text-lg leading-relaxed text-neutral-300">
            Projektujemy profesjonalne i skuteczne strony internetowe dla inwestycji deweloperskich. Przyciągnij uwagę
            klientów, wyróżnij swoją ofertę i buduj bazę kontaktów dzięki nowoczesnej i atrakcyjnej stronie www.
          </p>
        </div>
      </article>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Strona internetowa</h2>

          <h3 className="mt-12 text-xl font-bold text-white">Analiza i planowanie</h3>
          <h4 className="mt-4 text-lg font-semibold text-odart-accent">Planowanie</h4>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-neutral-400 marker:text-odart-accent">
            <li>
              Zebranie informacji o celach biznesowych, grupie docelowej, preferencjach wizualnych i funkcjonalnych.
            </li>
            <li>Badanie stron konkurencji oraz określenie unikalnych elementów, które wyróżnią projekt.</li>
            <li>Wybór motywu.</li>
          </ul>

          <h3 className="mt-12 text-xl font-bold text-white">Projektowanie strony</h3>
          <p className="mt-4 text-neutral-400">Stworzenie wizualnej koncepcji strony internetowej.</p>
          <ul className="mt-4 list-disc space-y-3 pl-6 text-neutral-400 marker:text-odart-accent">
            <li>
              <strong className="text-neutral-200">Makieta (wireframe):</strong> szkielet strony — rozmieszczenie
              elementów bez szczegółów graficznych.
            </li>
            <li>
              <strong className="text-neutral-200">Projekt graficzny:</strong> wizualny interfejs z uwzględnieniem
              identyfikacji klienta (logotyp, kolory, fonty).
            </li>
            <li>
              <strong className="text-neutral-200">UX/UI design:</strong> interfejs intuicyjny i wygodny w użyciu.
            </li>
          </ul>

          <h3 className="mt-12 text-xl font-bold text-white">Programowanie i implementacja</h3>
          <p className="mt-4 text-neutral-400">Przekształcenie projektu graficznego w działającą stronę internetową.</p>
          <ul className="mt-4 list-disc space-y-3 pl-6 text-neutral-400 marker:text-odart-accent">
            <li>
              <strong className="text-neutral-200">Front-end:</strong> HTML, CSS, JavaScript — widoczna część strony.
            </li>
            <li>
              <strong className="text-neutral-200">Back-end:</strong> formularze, bazy danych, logika pod funkcje
              inwestycji.
            </li>
            <li>
              <strong className="text-neutral-200">Integracje:</strong> narzędzia zewnętrzne, API, analityka.
            </li>
            <li>
              <strong className="text-neutral-200">CMS:</strong> WordPress — wygodna edycja treści i oferty mieszkań.
            </li>
          </ul>

          <h3 className="mt-12 text-xl font-bold text-white">Testowanie</h3>
          <p className="mt-4 text-neutral-400">Sprawdzenie, czy strona działa poprawnie i jest zgodna z oczekiwaniami.</p>
          <ul className="mt-4 list-disc space-y-3 pl-6 text-neutral-400 marker:text-odart-accent">
            <li>
              <strong className="text-neutral-200">Testy funkcjonalne:</strong> linki, formularze, ścieżki użytkownika.
            </li>
            <li>
              <strong className="text-neutral-200">Responsywność:</strong> komputer, tablet, smartfon.
            </li>
            <li>
              <strong className="text-neutral-200">Wydajność:</strong> szybkość ładowania, optymalizacja obrazów i kodu.
            </li>
            <li>
              <strong className="text-neutral-200">Zgodność:</strong> Chrome, Firefox, Safari i inne przeglądarki.
            </li>
          </ul>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Przykład: strona pod dewelopera</h2>
          <p className="mt-4 text-neutral-400 leading-relaxed">
            Poniżej demonstracja interfejsu inwestycji mieszkaniowej — galeria, mieszkania, filtry i kontakt. To szkielet
            pod sprzedaż lokali; zakres i treści dostosowujemy do Twojej inwestycji.
          </p>
          <a
            href={DEMO_DEVELOPER}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex flex-col gap-4 rounded-2xl border border-odart-accent/40 bg-gradient-to-br from-neutral-900/90 to-black p-6 transition hover:border-odart-accent/70 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-4">
              <Building2 className="h-10 w-10 shrink-0 text-odart-accent" aria-hidden />
              <div>
                <p className="font-semibold text-white">Demo inwestycji (Next.js)</p>
                <p className="mt-1 text-sm text-neutral-500">stronadewelopera.pl — inwestycja mieszkaniowa</p>
              </div>
            </div>
            <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-odart-accent px-5 py-3 text-sm font-semibold text-white hover:brightness-110">
              Zobacz demo
              <ExternalLink className="h-4 w-4" aria-hidden />
            </span>
          </a>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Technologia i bezpieczeństwo</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">Technologia</p>
              <p className="mt-2 text-xl font-bold text-white">WordPress</p>
              <p className="mt-2 text-sm text-neutral-400">
                Sprawdzony CMS pod treści, ofertę mieszkań i rozbudowę bez przebudowy od zera.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-sm font-medium uppercase tracking-wide text-neutral-500">Funkcje</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Firewall", "AntySpam", "Backup"].map((x) => (
                  <span
                    key={x}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm text-neutral-200"
                  >
                    <Shield className="h-3.5 w-3.5 text-odart-accent" aria-hidden />
                    {x}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-odart-accent/30 bg-gradient-to-br from-neutral-900/80 to-black p-8 lg:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Zostaw wiadomość</h2>
          <p className="mt-4 max-w-2xl text-neutral-400">
            Dodaj adres e-mail w celu szybkiego kontaktu — odpowiem, gdy tylko będzie to możliwe.
          </p>
          <Link
            href={`${SITE}/kontakt/`}
            className="mt-8 inline-flex items-center rounded-lg bg-odart-accent px-8 py-3.5 font-semibold text-white hover:brightness-110"
          >
            Przejdź do kontaktu
            <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
          </Link>
          <p className="mt-6 text-sm text-neutral-500">
            E-mail:{" "}
            <a href="mailto:biuro@odart.pl" className="text-odart-accent hover:text-orange-300">
              biuro@odart.pl
            </a>
          </p>
        </div>
      </section>
    </OdartPublicShell>
  );
}
