import Link from "next/link";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OdartHomePage } from "@/components/odart/OdartHomePage";
import { isOdartMainHost } from "@/lib/odartSite";

const ODART_CANONICAL = "https://odart.pl/";
const SALON_CANONICAL = "https://salon.odart.pl/";

export async function generateMetadata(): Promise<Metadata> {
  const hdr = await headers();
  const host = hdr.get("host") ?? "";
  if (isOdartMainHost(host)) {
    return {
      title: "Strony internetowe Kołobrzeg | Rafał Kowalkowski, ODART",
      description:
        "Strony, aplikacje i opieka IT. Rafał Kowalkowski, Kołobrzeg, od 2008. biuro@odart.pl",
      keywords: [
        "aplikacje webowe",
        "strony internetowe Kołobrzeg",
        "domeny .pl",
        "poczta firmowa",
        "zaamow.pl",
        "Next.js",
        "WordPress",
        "SEO",
        "ODART",
      ],
      alternates: {
        canonical: ODART_CANONICAL,
        languages: {
          pl: ODART_CANONICAL,
          en: "https://odart.pl/en/",
          "x-default": ODART_CANONICAL,
        },
      },
      openGraph: {
        title: "Strony internetowe Kołobrzeg | ODART",
        description: "Strony WWW, aplikacje i opieka IT. Rafał Kowalkowski, Kołobrzeg.",
        url: ODART_CANONICAL,
        siteName: "ODART",
        locale: "pl_PL",
        alternateLocale: ["en_US"],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Strony internetowe Kołobrzeg | ODART",
        description: "Strony WWW, aplikacje i opieka IT. Rafał Kowalkowski, Kołobrzeg.",
      },
    };
  }
  return {
    title: "Salon Odart — portal Zabiegi Odart | Zabiegi kosmetyczne w Polsce",
    description:
      "Dobierz zabieg lub gabinet kosmetyczny w Polsce — przeglądaj usługi, przejdź analizę skóry i umów wizytę online przez Zabiegi Odart.",
    keywords: [
      "Zabiegi Odart",
      "gabinety kosmetyczne Polska",
      "zabiegi kosmetyczne Polska",
      "rezerwacja wizyty online",
      "analiza skóry",
      "portal beauty",
    ],
    alternates: { canonical: SALON_CANONICAL },
    openGraph: {
      title: "Salon Odart — portal Zabiegi Odart",
      description:
        "Zabiegi kosmetyczne w Polsce: dopasowanie zabiegów i gabinetów, rezerwacje online, poradnik zabiegowy.",
      url: SALON_CANONICAL,
      siteName: "Salon Odart",
      locale: "pl_PL",
    },
    twitter: {
      card: "summary_large_image",
      title: "Salon Odart — Zabiegi Odart (Polska)",
      description: "Dobierz zabieg lub gabinet w Polsce — portal Zabiegi Odart.",
    },
  };
}

export default async function HomePage() {
  const host = (await headers()).get("host") ?? "";
  if (isOdartMainHost(host)) {
    return <OdartHomePage />;
  }

  return (
    <div className="min-h-dvh bg-white">
      <Header />
      <main>
        <section className="bg-[#F6E7EB]">
          <div className="mx-auto max-w-[1240px] px-6 pt-16 pb-14">
            <div className="grid items-center gap-10 lg:grid-cols-[520px_1fr]">
              <div>
                <h1 className="font-[var(--font-serif)] text-[#1E1E1E] text-[56px] md:text-[68px] leading-[0.95] tracking-[-0.03em]">
                  Odkryj swój <br />
                  <span className="text-[#D86786]">naturalny blask</span>
                </h1>
                <p className="mt-6 max-w-[420px] font-[var(--font-sans)] text-[15px] leading-[1.7] text-[#7A6A70]">
                  Doświadcz profesjonalnych zabiegów kosmetycznych i dobierz terapię do potrzeb swojej skóry.
                </p>
                <Link
                  href="/portal"
                  className="mt-8 inline-flex items-center gap-3 rounded-full border border-[#E5B1BE] bg-[#F6E7EB] px-5 py-[10px] font-[var(--font-sans)] text-[14px] font-medium text-[#2A2A2A] transition-colors hover:bg-[#F3DDE3]"
                >
                  Umów wizytę
                </Link>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/zabiegi"
                    className="rounded-full bg-[#D86786] px-6 py-3 font-medium text-white hover:bg-[#c45575]"
                  >
                    Zabiegi
                  </Link>
                  <Link
                    href="/o-nas"
                    className="rounded-full border border-[#E5B1BE] px-6 py-3 font-medium text-[#2A2A2A] hover:bg-[#F3DDE3]"
                  >
                    O nas
                  </Link>
                  <Link
                    href="/kontakt"
                    className="rounded-full border border-[#E5B1BE] px-6 py-3 font-medium text-[#2A2A2A] hover:bg-[#F3DDE3]"
                  >
                    Kontakt
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
