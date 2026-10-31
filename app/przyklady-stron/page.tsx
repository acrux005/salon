import type { Metadata } from "next";
import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

const SITE_URL = "https://salon.odart.pl";

export const metadata: Metadata = {
  title: "Przykłady stron WWW dla salonów beauty | Salon Odart",
  description:
    "Zobacz przykładowe strony internetowe dla gabinetów: kosmetyczka, fryzjer, podolog, paznokcie, masaże, brwi i rzęsy. Realizacje ODART / Salon Odart.",
  alternates: { canonical: `${SITE_URL}/przyklady-stron` },
};

type DemoCard = {
  title: string;
  niche: string;
  href: string;
  external?: boolean;
  blurb: string;
};

const DEMOS: DemoCard[] = [
  {
    title: "Gabinet kosmetyczny",
    niche: "Kosmetologia estetyczna",
    href: "/strona-kosmetyczki",
    blurb: "Konsultacja, zabiegi, cennik i FAQ — wzór strony beauty.",
  },
  {
    title: "Atelier Fryzjerskie Lilia",
    niche: "Fryzjerstwo",
    href: "https://zaamow.pl/site/fryzjer-atelier-kolobrzeg",
    external: true,
    blurb: "Strzyżenia, koloryzacja i stylizacja — wygenerowane Claude Power.",
  },
  {
    title: "Podologia Stopa Zdrowa",
    niche: "Podologia",
    href: "https://zaamow.pl/site/podolog-stopa-zdrowa",
    external: true,
    blurb: "Gabinet stóp: konsultacje, pedicure medyczny, terapia.",
  },
  {
    title: "Nails Studio Hybryda",
    niche: "Paznokcie",
    href: "https://zaamow.pl/site/nails-studio-hybryda",
    external: true,
    blurb: "Manicure hybrydowy, żel i pedicure — studio paznokci.",
  },
  {
    title: "Masaże Relaks Bałtyk",
    niche: "Masaże / wellness",
    href: "https://zaamow.pl/site/masaze-relaks-baltyk",
    external: true,
    blurb: "Masaż klasyczny, limfatyczny i pakiety relaksacyjne.",
  },
  {
    title: "Luxe Brow & Lash",
    niche: "Brwi i rzęsy",
    href: "https://zaamow.pl/site/brwi-rzesy-luxe",
    external: true,
    blurb: "Henna, laminacja, lifting i przedłużanie rzęs.",
  },
];

export default function PrzykladyStronPage() {
  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white">
        <section
          className="border-b border-neutral-200/60 py-14 lg:py-20"
          style={{ background: "linear-gradient(to bottom, #FFF8FB 0%, #ffffff 100%)" }}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-wider text-pink-600">
              Przykłady realizacji
            </p>
            <h1 className="mt-3 font-[var(--font-serif)] text-3xl font-normal leading-tight text-[#1F1A1C] sm:text-4xl">
              Strony WWW dla różnych salonów beauty
            </h1>
            <p className="mt-5 font-[var(--font-sans)] text-[16px] leading-relaxed text-[#6F5E64]">
              Poniżej przykłady układów pod kosmetologię, fryzjerstwo, podologię, paznokcie, masaże
              oraz brwi i rzęsy. Pierwszy wzór jest na Salon Odart; kolejne to dema Claude Power z
              zaamow.pl.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/strona-internetowa-dla-gabinetu-kosmetycznego"
                className="inline-flex rounded-full bg-pink-500 px-6 py-3.5 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
              >
                Oferta stron WWW
              </Link>
              <Link
                href="/portal/dla-salonow"
                className="inline-flex rounded-full border border-neutral-300 px-6 py-3.5 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] hover:border-pink-300"
              >
                Profil w portalu
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
            {DEMOS.map((demo) => (
              <article
                key={demo.href}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <p className="font-[var(--font-sans)] text-[12px] font-semibold uppercase tracking-wider text-pink-600">
                  {demo.niche}
                </p>
                <h2 className="mt-2 font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
                  {demo.title}
                </h2>
                <p className="mt-3 flex-1 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6F5E64]">
                  {demo.blurb}
                </p>
                <Link
                  href={demo.href}
                  {...(demo.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="mt-6 inline-flex w-fit rounded-full bg-[#1F1A1C] px-5 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-neutral-800"
                >
                  Zobacz przykład
                  {demo.external ? " ↗" : ""}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <FooterPortal />
    </>
  );
}
