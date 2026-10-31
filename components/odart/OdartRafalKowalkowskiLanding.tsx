import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Jost } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_GALLERY,
  RAFAL_KOWALKOWSKI_GALLERY_PATH,
  RAFAL_KOWALKOWSKI_USLUGI_PATH,
} from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_KOWALKOWSKI_MUZYKA_PATH, RAFAL_KOWALKOWSKI_MUZYKA_ODART_HREF } from "@/lib/rafalKowalkowskiMuzyka";
import { RAFAL_KOWALKOWSKI_SERVICES } from "@/lib/rafalKowalkowskiServices";
import { RAFAL_KOWALKOWSKI_PORTRAIT_URL } from "@/lib/rafalKowalkowskiMedia";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";
import { buildRafalHomeJsonLd } from "@/lib/rafalKowalkowskiSeo";
import { OdartRafalKowalkowskiGalleryLightboxGrid } from "@/components/odart/OdartRafalKowalkowskiGalleryLightboxGrid";

import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import {
  OdartRafalKowalkowskiServiceGrid,
  // RafalService,
} from "@/components/odart/OdartRafalKowalkowskiServiceGrid";
import {
  OdartRafalKowalkowskiAboutTabs,
  OdartRafalKowalkowskiAnimatedTitle,
  OdartRafalKowalkowskiResumoMenu,
} from "@/components/odart/OdartRafalKowalkowskiResumoClient";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL;

const EXTERNAL = {
  teledyski: "https://rafalkowalkowski.pl/filmowanie-kolobrzeg-koszalin-szczecin-zachodniopomorskie/",
  muzyka: "https://rafalkowalkowski.pl/muzyka-autorska-rafal-kowalkowski-kolobrzeg/",
  blog: "https://rafalkowalkowski.pl/blog/",
  galeria: "https://rafalkowalkowski.pl/galeria-2/",
  sklep: "https://rafalkowalkowski.pl/sklep/",
  instagram: "https://www.instagram.com/acrux_rk/",
  tiktok: "https://www.tiktok.com/@acrux_rk",
  facebook: "https://www.facebook.com/acruxkg/",
  youtube: "https://www.youtube.com/channel/UCOp3fAgkkXzEOY3PgBk29jA",
  spotify: "https://artists.spotify.com/c/artist/6K6Oz5t1sDyELfpt3zKmSx/home",
} as const;

const SOCIAL_FOR_MENU = [
  { key: "instagram" as const, href: EXTERNAL.instagram, label: "Instagram" },
  { key: "tiktok" as const, href: EXTERNAL.tiktok, label: "TikTok" },
  { key: "facebook" as const, href: EXTERNAL.facebook, label: "Facebook" },
  { key: "youtube" as const, href: EXTERNAL.youtube, label: "YouTube" },
  { key: "spotify" as const, href: EXTERNAL.spotify, label: "Spotify" },
];

const SERVICES = RAFAL_KOWALKOWSKI_SERVICES;


const PORTRAIT = RAFAL_KOWALKOWSKI_PORTRAIT_URL;

const jsonLd = buildRafalHomeJsonLd();

function MainTitle({
  subtitle,
  title,
  desc,
  heading = "h2",
}: {
  subtitle: string;
  title: string;
  desc?: ReactNode;
  heading?: "h1" | "h2";
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">{subtitle}</p>
      {heading === "h1" ? (
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-tight">{title}</h1>
      ) : (
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-tight">{title}</h2>
      )}
      {desc ? <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-500">{desc}</p> : null}
    </div>
  );
}

export function OdartRafalKowalkowskiLanding() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <div className={`${jost.className} bg-[#0f0f0f] text-neutral-300`}>
        <div className="flex min-h-[70vh] flex-col lg:min-h-[calc(100vh-7rem)] lg:flex-row">
          {/* Lewa kolumna — scroll (styl Resumo) */}
          <main className="min-w-0 flex-1 border-white/[0.06] lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:border-r">
            <div className="mx-auto max-w-3xl px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
              <section id="home" className="scroll-mt-28">
                <MainTitle
                  heading="h1"
                  subtitle="Kołobrzeg"
                  title="Lekcje gitary, zajęcia wokalne i fotografia"
                  desc="Uczę gry na gitarze i śpiewu — indywidualnie, także online. Robię sesje portretowe i nagrania wokalu w Kołobrzegu."
                />
                <div className="mt-8 border-t border-white/10 pt-8 italic text-neutral-500">
                  „Człowiek bez pasji żyje tylko jednym życiem”
                </div>
              </section>

              <section id="about" className="scroll-mt-28 border-t border-white/10 pt-20">
                <MainTitle
                  subtitle="O mnie"
                  title="Biografia"
                  desc="Od 2005 roku fotografuję; uczę też gitary i śpiewu. Studio ACRUX to nagrania i sesje, Kołobrzeg to miejsce lekcji i zdjęć."
                />
                <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div className="overflow-hidden rounded-xl border border-white/[0.08]">
                    <table className="w-full text-left text-sm">
                      <tbody>
                        {[
                          ["Imię i nazwisko", "Rafał Kowalkowski"],
                          ["Studio", "ACRUX"],
                          ["Lokalizacja", "Kołobrzeg, PL"],
                          ["Telefon", "+48 695 432 415"],
                          ["E-mail", "biuro@odart.pl"],
                          ["WWW", "rafalkowalkowski.pl"],
                        ].map(([k, v]) => (
                          <tr key={k} className="border-b border-white/[0.06] last:border-0">
                            <th className="w-[38%] px-4 py-3 font-medium text-neutral-500">{k}</th>
                            <th className="px-4 py-3 font-normal text-white">
                              {k === "Telefon" ? (
                                <a href="tel:+48695432415" className="hover:text-odart-accent">
                                  {v}
                                </a>
                              ) : k === "E-mail" ? (
                                <a href="mailto:biuro@odart.pl" className="hover:text-odart-accent">
                                  {v}
                                </a>
                              ) : k === "WWW" ? (
                                <a
                                  href="https://rafalkowalkowski.pl/"
                                  className="hover:text-odart-accent"
                                  rel="noopener noreferrer"
                                  target="_blank"
                                >
                                  {v}
                                </a>
                              ) : (
                                v
                              )}
                            </th>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex shrink-0 flex-col gap-3">
                    <a
                      href={EXTERNAL.sklep}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-odart-accent/40 bg-odart-accent/10 px-6 py-3 text-sm font-semibold text-odart-accent transition hover:bg-odart-accent/20"
                    >
                      Sklep / portfolio
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </a>
                    <Link
                      href={`${SITE}/kontakt/`}
                      className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:border-white/30"
                    >
                      Zapytaj o wycenę
                    </Link>
                  </div>
                </div>
                <div className="mt-12">
                  <OdartRafalKowalkowskiAboutTabs />
                </div>
              </section>

              <section id="portfolio" className="scroll-mt-28 border-t border-white/10 pt-20">
                <MainTitle
                  subtitle="Portfolio"
                  title="Galeria"
                  desc={
                    <>
                      Pełna galeria:{" "}
                      <Link href={rafalPublicHref(RAFAL_KOWALKOWSKI_GALLERY_PATH)} className="text-odart-accent underline decoration-odart-accent/40 underline-offset-2 hover:decoration-odart-accent">
                        otwórz wszystkie zdjęcia
                      </Link>
                      .
                    </>
                  }
                />
                <OdartRafalKowalkowskiGalleryLightboxGrid items={RAFAL_KOWALKOWSKI_GALLERY} layout="strip" maxThumbnails={20} />
                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
                  <p className="text-sm text-neutral-500">
                    Podgląd {Math.min(20, RAFAL_KOWALKOWSKI_GALLERY.length)} z {RAFAL_KOWALKOWSKI_GALLERY.length} zdjęć.
                  </p>
                  <Link href={rafalPublicHref(RAFAL_KOWALKOWSKI_GALLERY_PATH)} className="inline-flex items-center gap-2 rounded-full bg-odart-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-950/30 transition hover:brightness-110">
                    Otwórz galerię
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </section>

              <section id="services" className="scroll-mt-28 border-t border-white/10 pt-20">
                <MainTitle
                  subtitle="Usługi"
                  title="Gitara, wokal, zdjęcia"
                  desc="Lekcje indywidualne, nagranie wokalu i sesje fotograficzne — od pierwszej lekcji po gotowe zdjęcia i plik audio."
                />
                <ul className="divide-y divide-white/[0.08] rounded-xl border border-white/[0.08] bg-white/[0.02]">
                  {SERVICES.slice(0, 6).map((s) => (
                    <li key={s.id}>
                      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
                        <div className="min-w-0">
                          <h3 className="text-lg font-medium text-white">{s.title}</h3>
                          <p className="mt-1 text-sm text-neutral-500">{s.category}</p>
                        </div>
                        <div className="shrink-0 text-left sm:text-right">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">od</p>
                          <p className="text-xl font-semibold text-odart-accent">{s.price}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-14">
                  <p className="text-center text-sm text-neutral-500">
                    Pełna siatka ofert — filtry i zdjęcia. Zamówienia także przez{" "}
                    <a href={EXTERNAL.sklep} className="text-odart-accent hover:underline" rel="noopener noreferrer" target="_blank">
                      sklep
                    </a>
                    .
                  </p>
                  <div className="mt-10">
                    <OdartRafalKowalkowskiServiceGrid items={SERVICES} />
                  </div>
                </div>
              </section>

              <section id="customers" className="scroll-mt-28 border-t border-white/10 pt-20">
                <MainTitle subtitle="Klienci" title="Zaufali nam" />
                <ul className="flex flex-wrap gap-3">
                  {["ODART", "ACRUX", "Fotoferia", "Freelance", "Kołobrzeg"].map((name) => (
                    <li
                      key={name}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 space-y-6">
                  {[
                    {
                      quote: "„Komunikacja i terminowość na pierwszym miejscu — strona i sesja poszły bez tarcia.”",
                      who: "Klient biznesowy",
                      role: "Usługi WWW + foto",
                    },
                    {
                      quote: "„Nagrania i teledysk trzymały jedną wizję — wrócę przy kolejnym singlu.”",
                      who: "Artysta niezależny",
                      role: "Studio ACRUX",
                    },
                  ].map((t) => (
                    <figure key={t.who} className="rounded-xl border border-white/[0.08] bg-black/40 p-6">
                      <blockquote className="text-base leading-relaxed text-neutral-300">{t.quote}</blockquote>
                      <figcaption className="mt-4">
                        <p className="font-medium text-white">{t.who}</p>
                        <p className="text-sm text-neutral-500">{t.role}</p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>

              <section id="news" className="scroll-mt-28 border-t border-white/10 pt-20">
                <MainTitle subtitle="Blog i aktualności" title="Ostatnie wpisy" desc="Pełny blog na stronie autorskiej — kilka propozycji lektury." />
                <ul className="grid gap-6 sm:grid-cols-2">
                  {[
                    { title: "Nauka gry na gitarze w Kołobrzegu", hint: "Lekcje gitary" },
                    { title: "Zajęcia wokalne i nagranie wokalu", hint: "Nauka śpiewu" },
                    { title: "Kompozycja i sesje fotograficzne", hint: "Fotografia" },
                  ].map((post) => (
                    <li key={post.title}>
                      <a
                        href={EXTERNAL.blog}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition hover:border-odart-accent/40"
                      >
                        <div className="relative aspect-[16/10] bg-neutral-900">
                          <Image
                            src={PORTRAIT}
                            alt=""
                            fill
                            className="object-cover opacity-40 transition group-hover:opacity-55"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                          <p className="absolute left-4 top-4 text-[10px] font-bold uppercase tracking-widest text-odart-accent">{post.hint}</p>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-medium text-white group-hover:text-odart-accent">{post.title}</h3>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-neutral-400 group-hover:text-white">
                            Czytaj
                            <ArrowRight className="h-4 w-4" aria-hidden />
                          </span>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              <section id="contact" className="scroll-mt-28 border-t border-white/10 py-20">
                <MainTitle
                  subtitle="Kontakt"
                  title="Napisz kilka słów"
                  desc="Formularz na ODART lub bezpośrednio mail / telefon — odpowiadam po kolei, bez spamu."
                />
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                  <Link
                    href={`${SITE}/kontakt/`}
                    className="inline-flex items-center justify-center rounded-full bg-odart-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:brightness-110"
                  >
                    Formularz ODART
                  </Link>
                  <a
                    href="mailto:biuro@odart.pl"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3.5 text-sm font-semibold text-white hover:border-odart-accent/50"
                  >
                    biuro@odart.pl
                  </a>
                  <a
                    href="tel:+48695432415"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-3.5 text-sm font-semibold text-white hover:border-odart-accent/50"
                  >
                    +48 695 432 415
                  </a>
                </div>
                <p className="mt-8 text-sm text-neutral-500">
                  Adres: Kołobrzeg ·{" "}
                  <a href="https://odart.pl/kontakt/" className="text-odart-accent hover:underline">
                    odart.pl/kontakt
                  </a>
                </p>
              </section>

              <footer className="border-t border-white/10 pb-10 pt-8 text-center text-xs text-neutral-600">
                <a href="#home" className="text-odart-accent hover:underline">
                  Do góry
                </a>
                <span className="mx-2">·</span>
                <span>© {new Date().getFullYear()} Rafał Kowalkowski · ODART</span>
              </footer>
            </div>
          </main>

          {/* Prawa kolumna — sticky (Resumo right) */}
          <aside className="relative order-first flex min-h-[320px] flex-col border-b border-white/[0.06] bg-[#141414] lg:order-none lg:w-[min(100%,420px)] lg:shrink-0 lg:border-b-0 lg:border-l lg:border-white/[0.06]">
            <div className="pointer-events-none absolute right-8 top-8 z-10 lg:right-10 lg:top-10">
              <div className="pointer-events-auto">
                <OdartRafalKowalkowskiResumoMenu social={SOCIAL_FOR_MENU} />
              </div>
            </div>

            <div className="relative flex flex-1 flex-col justify-between px-8 pb-10 pt-16 sm:px-10 lg:sticky lg:top-24 lg:min-h-[calc(100vh-7rem)] lg:px-10 lg:pb-12 lg:pt-20">
              <div>
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[280px] overflow-hidden rounded-lg border border-white/10 shadow-2xl shadow-black/50">
                  <div className="pointer-events-none absolute -left-px -top-px h-16 w-16 border-l-2 border-t-2 border-odart-accent/80" aria-hidden />
                  <div className="pointer-events-none absolute -bottom-px -right-px h-16 w-16 border-b-2 border-r-2 border-odart-accent/80" aria-hidden />
                  <Image src={PORTRAIT} alt="Rafał Kowalkowski" fill className="object-cover" sizes="420px" priority />
                </div>
                <div className="mt-10 text-center lg:text-left">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Cześć! Jestem</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Rafał Kowalkowski</p>
                  <div className="mt-3">
                    <OdartRafalKowalkowskiAnimatedTitle />
                  </div>
                </div>
              </div>
              <a
                href="#contact"
                className="mt-10 flex items-center gap-4 rounded-full border border-white/10 bg-black/30 px-5 py-4 text-sm text-neutral-200 backdrop-blur transition hover:border-odart-accent/50 hover:text-white"
              >
                <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-odart-accent/40">
                  <span className="absolute h-full w-full animate-ping rounded-full bg-odart-accent/20" aria-hidden />
                  <span className="relative block h-2 w-2 rounded-full bg-odart-accent" />
                </span>
                <span className="text-left leading-snug">
                  Dostępny na projekty freelance.
                  <span className="mt-0.5 block font-semibold text-odart-accent">Napisz — umówimy termin</span>
                </span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </OdartPublicShell>
  );
}
