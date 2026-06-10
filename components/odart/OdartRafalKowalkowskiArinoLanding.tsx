import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Jost } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { RAFAL_KOWALKOWSKI_GALLERY } from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_KOWALKOWSKI_PORTRAIT_URL } from "@/lib/rafalKowalkowskiMedia";
import { RAFAL_KOWALKOWSKI_SERVICES } from "@/lib/rafalKowalkowskiServices";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";
import { RAFAL_KOWALKOWSKI_PROFILE_PATH } from "@/lib/rafalKowalkowskiGallery";
import {
  RAFAL_ARINO_AWARDS,
  RAFAL_ARINO_BLOG,
  RAFAL_ARINO_CTA,
  RAFAL_ARINO_FUN_FACT,
  RAFAL_ARINO_HERO,
  RAFAL_ARINO_LINKS,
  RAFAL_ARINO_PARTNERS,
  RAFAL_ARINO_PROCESS,
} from "@/lib/rafalKowalkowskiArinoContent";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ArinoFixedHeroBackdrop } from "@/components/odart/arino/ArinoFixedHeroBackdrop";
import { RafalArinoHero } from "@/components/odart/arino/RafalArinoHero";
import {
  RafalArinoPortfolioCarousel,
  RafalArinoTestimonials,
} from "@/components/odart/arino/RafalArinoInteractive";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const PORTRAIT = RAFAL_KOWALKOWSKI_PORTRAIT_URL;
/** Tło hero — ciemny kadr + mocny czerwony gradient (jak w Arino). */
const HERO_BG =
  RAFAL_KOWALKOWSKI_GALLERY.find((g) => g.src.includes("odart._Create_visually"))?.src ??
  RAFAL_KOWALKOWSKI_GALLERY.find((g) => g.src.includes("piano"))?.src ??
  RAFAL_KOWALKOWSKI_GALLERY[0]?.src ??
  PORTRAIT;

const SERVICE_MASONRY = RAFAL_KOWALKOWSKI_SERVICES.filter((s) =>
  ["www", "backing", "it", "vox"].includes(s.id),
);

const jsonLd = buildRafalWebPageJsonLd(
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  "Rafał Kowalkowski — fotografia, nagrania, strony | ODART",
);

function ArinoLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const path = href.startsWith("http") ? href : rafalPublicHref(href);
  if (path.startsWith("http")) {
    return (
      <a href={path} className={className} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }
  return (
    <Link href={path} className={className}>
      {children}
    </Link>
  );
}

function CtaArrow({ label, href }: { label: string; href: string }) {
  return (
    <ArinoLink
      href={href}
      className="group inline-flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:text-odart-accent"
    >
      {label}
      <span className="inline-block h-px w-12 bg-white/40 transition group-hover:w-16 group-hover:bg-odart-accent" aria-hidden />
      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
    </ArinoLink>
  );
}

export function OdartRafalKowalkowskiArinoLanding() {
  const portfolioItems = RAFAL_KOWALKOWSKI_GALLERY.slice(0, 12);
  const contactHref = rafalPublicHref("/kontakt/");

  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <ArinoFixedHeroBackdrop backgroundUrl={HERO_BG} />
      <div className={`${jost.className} relative z-10 text-neutral-300`}>
        <RafalArinoHero />

        {/* Fun fact */}
        <section id="about" className="relative z-10 scroll-mt-28 bg-black py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#141414] px-6 py-12 sm:px-12 sm:py-16">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 Q15 0 30 30 T60 30' fill='none' stroke='%23fff' stroke-width='1'/%3E%3C/svg%3E")`,
                }}
                aria-hidden
              />
              <h2 className="text-3xl font-bold text-white sm:text-4xl">{RAFAL_ARINO_FUN_FACT.title}</h2>
              <p className="mt-4 max-w-2xl text-neutral-500">{RAFAL_ARINO_FUN_FACT.body}</p>
              <ul className="mt-12 grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
                {RAFAL_ARINO_FUN_FACT.stats.map((s) => (
                  <li key={s.label}>
                    <p className="text-4xl font-bold text-white sm:text-5xl">
                      {s.value}
                      <span className="text-odart-accent">+</span>
                    </p>
                    <p className="mt-2 text-sm text-neutral-500">{s.label}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Services masonry */}
        <section id="services" className="relative z-10 scroll-mt-28 bg-black py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <CtaArrow label="Zobacz wszystkie usługi" href={RAFAL_ARINO_LINKS.servicesAll} />
            <ul className="mt-12 grid auto-rows-[minmax(200px,auto)] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {SERVICE_MASONRY.map((s, i) => {
                const span =
                  i === 0 ? "md:col-span-2 md:row-span-2" : i === 3 ? "lg:col-span-1 lg:row-span-1" : "";
                const href = s.detailHref ? rafalPublicHref(s.detailHref) : contactHref;
                return (
                  <li key={s.id} className={span}>
                    <Link
                      href={href}
                      className="group relative flex h-full min-h-[220px] overflow-hidden rounded-2xl border border-white/10"
                    >
                      <Image
                        src={s.image.src}
                        alt=""
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
                      <span className="absolute left-5 top-5 h-2 w-2 rounded-full bg-odart-accent" aria-hidden />
                      <div className="absolute bottom-0 left-0 p-6">
                        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{s.category}</p>
                        <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">{s.title}</h3>
                        <p className="mt-2 text-sm text-odart-accent">od {s.price}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <RafalArinoPortfolioCarousel items={portfolioItems} galleryHref={RAFAL_ARINO_LINKS.gallery} />

        {/* Awards */}
        <section className="relative z-10 border-t border-white/[0.06] bg-black py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">Kamienie milowe</h2>
            <ul className="mt-14 grid gap-12 sm:grid-cols-2">
              {RAFAL_ARINO_AWARDS.map((a) => (
                <li key={a.year}>
                  <p className="text-lg font-bold text-odart-accent">{a.year}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{a.title}</h3>
                  {a.lines.map((line) => (
                    <p key={line} className="mt-1 text-neutral-500">
                      {line}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Process + media */}
        <section className="relative z-10 border-t border-white/[0.06] bg-black py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <p className="text-2xl font-medium leading-snug text-white sm:text-3xl md:text-4xl md:leading-tight">
              {RAFAL_ARINO_PROCESS.quote}
            </p>
          </div>
          <div className="mx-auto mt-14 max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={RAFAL_KOWALKOWSKI_GALLERY.find((g) => g.src.includes("piano"))?.src ?? HERO_BG}
                alt="Studio nagraniowe ACRUX"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>
        </section>

        <RafalArinoTestimonials />

        {/* Blog */}
        <section id="news" className="relative z-10 scroll-mt-28 border-t border-white/[0.06] bg-black py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <ArinoLink
              href={RAFAL_ARINO_LINKS.blog}
              className="group inline-flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:text-odart-accent"
            >
              Więcej na blogu
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
            </ArinoLink>
            <ul className="mt-12 grid gap-8 sm:grid-cols-2">
              {RAFAL_ARINO_BLOG.map((post) => (
                <li key={post.title}>
                  <Link
                    href={post.href}
                    className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
                  >
                    <div className="relative aspect-[4/3]">
                      <Image src={post.image} alt="" fill className="object-cover opacity-90 transition group-hover:scale-105" sizes="50vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <p className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-widest text-white/80">
                        {post.date}
                      </p>
                    </div>
                    <h3 className="p-5 text-xl font-bold text-white group-hover:text-odart-accent">{post.title}</h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Partners */}
        <section className="relative z-10 overflow-hidden border-t border-white/[0.06] bg-black py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p
              className="select-none text-center text-4xl font-bold uppercase leading-none tracking-tight text-transparent sm:text-6xl md:text-7xl"
              style={{ WebkitTextStroke: "1px rgba(217, 91, 58, 0.45)" }}
              aria-hidden
            >
              Współpraca na terenie całej Polski
            </p>
            <ul className="mt-14 flex flex-wrap items-center justify-center gap-10 sm:gap-16">
              {RAFAL_ARINO_PARTNERS.map((name) => (
                <li key={name} className="text-center">
                  <span className="block text-2xl font-bold text-white">{name.slice(0, 1)}</span>
                  <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500">
                    {name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section id="contact" className="relative z-10 scroll-mt-28 bg-black pb-24 pt-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#141414] px-6 py-16 text-center sm:px-12">
              <span className="pointer-events-none absolute left-8 top-8 h-3 w-3 rotate-45 bg-odart-accent/80" aria-hidden />
              <span className="pointer-events-none absolute right-12 top-1/2 h-2 w-2 rotate-45 bg-odart-accent/60" aria-hidden />
              <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
                {RAFAL_ARINO_CTA.title}{" "}
                <span className="font-serif italic font-normal text-white/90">{RAFAL_ARINO_CTA.emphasis}</span>{" "}
                {RAFAL_ARINO_CTA.suffix}
              </h2>
              <div className="mt-10 flex justify-center">
                <CtaArrow label={RAFAL_ARINO_CTA.link.label} href={RAFAL_ARINO_CTA.link.href} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </OdartPublicShell>
  );
}
