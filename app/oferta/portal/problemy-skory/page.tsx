import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { PORTAL_LOCALE } from "@/content/portalLocale";

/** Portal może być pod /portal lub /oferta/portal – dostosuj BASE do swojego routingu. */
const BASE = "/portal";

const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: `Problemy skóry w ${PORTAL_LOCALE.regionIn} – dobierz terapię`,
  description:
    "Trądzik, przebarwienia, naczynka, anti-aging i inne. Dobierz terapię i sprawdzone gabinety w Kołobrzegu – bez zgadywania.",
  alternates: { canonical: `${SITE_URL}/oferta/portal/problemy-skory` },
  openGraph: {
    title: `Problemy skóry w ${PORTAL_LOCALE.regionIn} – dobierz terapię`,
    description:
      "Trądzik, przebarwienia, naczynka, anti-aging i inne. Dobierz terapię i sprawdzone gabinety.",
    url: `${SITE_URL}/oferta/portal/problemy-skory`,
    type: "website",
    locale: "pl_PL",
  },
};

/** Lista problemów skóry na stronie hub – rozszerzalna. */
const PROBLEMY_SKORY: { slug: string; title: string; description: string }[] = [
  {
    slug: "tradzik",
    title: "Trądzik (dorosłych)",
    description:
      "Delikatne, konsekwentne podejście i dopasowana terapia. Pokażemy gabinety specjalizujące się w trądziku dorosłych.",
  },
  {
    slug: "przebarwienia",
    title: "Przebarwienia",
    description:
      "Nierówny koloryt i przebarwienia – dobierz zabiegi i gabinety z doświadczeniem w terapii przebarwień.",
  },
  {
    slug: "anti_aging",
    title: "Anti-aging 30+",
    description:
      "Zabiegi przeciwstarzeniowe dopasowane do wieku i potrzeb skóry. Gabinety z protokołami anti-aging.",
  },
  {
    slug: "naczynka",
    title: "Rumień / naczynka",
    description:
      "Cera naczynkowa i rumień – rekomendacje zabiegów i gabinetów z delikatnymi, naczyniowymi protokołami.",
  },
  {
    slug: "pory",
    title: "Rozszerzone pory",
    description:
      "Oczyszczanie i regulacja sebum. Dobierz terapię i gabinet z odpowiednim sprzętem i doświadczeniem.",
  },
  {
    slug: "blizny",
    title: "Blizny potrądzikowe",
    description:
      "Blizny i przebarwienia pozapalne – plan terapii i rekomendowane gabinety (mikronakłuwanie, laser, pielęgnacja).",
  },
];

export default function ProblemySkoryPage() {
  return (
    <>
      <HeaderPortal />
      <main className="min-h-[60vh] border-b border-neutral-200/40 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
            Problemy skóry – dobierz terapię w {PORTAL_LOCALE.regionIn}
          </h1>
          <p className="mt-4 max-w-2xl font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
            Wybierz problem, a pokażemy Ci rekomendowaną terapię i 1–3 sprawdzone gabinety w {PORTAL_LOCALE.regionLong}.
          </p>
          <p className="mt-3 font-[var(--font-sans)] text-[12px] text-[#6C6C75]">
            Aktualnie działamy w: {PORTAL_LOCALE.regionLabel}
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEMY_SKORY.map(({ slug, title, description }) => (
              <article
                key={slug}
                className="flex flex-col rounded-2xl border border-neutral-200/80 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                style={{ background: "#FFF8FB" }}
              >
                <h2 className="font-[var(--font-sans)] text-[17px] font-semibold text-[#1F1A1C]">
                  {title}
                </h2>
                <p className="mt-3 flex-1 font-[var(--font-sans)] text-[14px] leading-[1.5] text-[#6F5E64]">
                  {description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={`${BASE}?problem=${slug}`}
                    className="inline-flex rounded-full bg-[#DE1F40] px-5 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-white transition-colors hover:bg-[#c01a38]"
                  >
                    Rozpocznij analizę
                  </Link>
                  <Link
                    href="/portal/gabinety"
                    className="inline-flex rounded-full border border-neutral-300 px-5 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] transition-colors hover:border-[#DE1F40]/40 hover:bg-pink-50/50"
                  >
                    Zobacz gabinety
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-12 text-center">
            <Link
              href="/portal"
              className="font-[var(--font-sans)] text-[14px] font-medium text-pink-600 hover:underline"
            >
              ← Wróć na stronę główną
            </Link>
          </p>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
