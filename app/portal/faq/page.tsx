import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { PORTAL_LOCALE } from "@/content/portalLocale";

const SITE_URL = "https://salon.odart.pl";

const FAQ_ITEMS = [
  {
    q: "Jak działa Zabiegi Odart?",
    a: "Zabiegi Odart to platforma dopasowująca klientki do gabinetów kosmetycznych na podstawie problemu skóry lub wybranej usługi. Wybierasz zabieg albo przechodzisz krótką analizę — system wskazuje gabinety, które się specjalizują w danej dziedzinie.",
  },
  {
    q: "Czy muszę się rejestrować, żeby umówić wizytę?",
    a: "Tak. Rezerwacja terminu wymaga konta klienta. Po zalogowaniu możesz wybrać gabinet, zabieg i dostępny termin. Możesz też wysłać zapytanie bez logowania — gabinet skontaktuje się z Tobą mailowo lub telefonicznie.",
  },
  {
    q: "Czy Zabiegi Odart pobiera opłaty od klientek?",
    a: "Nie. Serwis jest bezpłatny dla klientek. Nie pobieramy prowizji ani opłat. Umowę zawierasz bezpośrednio z gabinetem — płatność odbywa się w salonie.",
  },
  {
    q: "Czy muszę zapłacić za rezerwację z góry?",
    a: "Nie. Rezerwacja przez Zabiegi Odart jest bezpłatna i nie wymaga wpłaty z góry. Płatność za zabieg następuje w gabinecie po wykonaniu usługi.",
  },
  {
    q: "Jak anuluję lub przełożę wizytę?",
    a: "Skontaktuj się z gabinetem telefonicznie lub mailem — dane kontaktowe znajdziesz na stronie profilu gabinetu. Każdy gabinet ma własne zasady odwoływania i zmiany terminów.",
  },
  {
    q: "Kto odpowiada za jakość zabiegu?",
    a: "Za usługę odpowiada gabinet kosmetyczny. Zabiegi Odart nie świadczy usług kosmetycznych i nie jest stroną umowy między Tobą a gabinetem. W razie reklamacji skontaktuj się bezpośrednio z salonem.",
  },
];

export const metadata = {
  title: `Najczęściej zadawane pytania – ${PORTAL_LOCALE.region}`,
  description: `Jak działa Zabiegi Odart? Czy muszę się rejestrować? Odpowiedzi na najczęstsze pytania o rezerwacje i korzystanie z platformy.`,
  alternates: { canonical: `${SITE_URL}/portal/faq` },
  openGraph: {
    title: "FAQ",
    description: "Odpowiedzi na najczęstsze pytania o platformę i rezerwacje.",
    url: `${SITE_URL}/portal/faq`,
    type: "website",
    locale: "pl_PL",
  },
};

export default function PortalFaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: { "@type": "Answer" as const, text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeaderPortal />
      <main className="py-16 lg:py-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-serif)] text-3xl font-normal text-[#1F1A1C] sm:text-4xl">
            Najczęściej zadawane pytania
          </h1>
          <p className="mt-3 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            Odpowiedzi na pytania o Zabiegi Odart, rezerwacje i współpracę z gabinetami.
          </p>

          <div className="mt-12 space-y-8">
            {FAQ_ITEMS.map((item, i) => (
              <section key={i}>
                <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
                  {item.q}
                </h2>
                <p className="mt-2 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
                  {item.a}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap gap-4">
            <Link
              href="/portal"
              className="font-[var(--font-sans)] text-pink-600 hover:underline"
            >
              ← Strona główna
            </Link>
            <Link
              href="/portal/gabinety"
              className="font-[var(--font-sans)] text-pink-600 hover:underline"
            >
              Gabinety
            </Link>
            <Link href="/kontakt" className="font-[var(--font-sans)] text-pink-600 hover:underline">
              Kontakt
            </Link>
          </div>
        </div>
      </main>
      <FooterPortal />
    </div>
  );
}
