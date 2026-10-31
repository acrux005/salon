import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Palette,
  Code2,
  Sparkles,
  FileText,
  Headphones,
  Cpu,
  Globe,
  Server,
  Mail,
  Phone,
  MapPin,
  Check,
} from "lucide-react";
import { ODART_SITE_URL, ODART_PORTFOLIO_URL } from "@/lib/odartSite";
import { ODART_PORTFOLIO_ITEMS } from "@/lib/odartPortfolio";
import { getEnglishServiceHref } from "@/lib/odartEnglishServices";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartSnakeLineAccent } from "@/components/odart/OdartSnakeLineAccent";
import { OdartSpiralLine } from "@/components/odart/OdartSpiralLine";
import { OdartZaamowSection } from "@/components/odart/OdartZaamowSection";

const SITE = ODART_SITE_URL;

const portfolioCopy: Record<string, { title: string; description: string; tech?: string[] }> = {
  "https://salon.odart.pl/": {
    title: "Beauty salon portal",
    description:
      "Appointment booking, salon catalogue and client journey in one service for beauty and wellness businesses.",
  },
  "https://zamow.odart.pl/": {
    title: "Zamow - online ordering",
    description:
      "Food ordering from mobile or desktop: menu, cart and order handling for restaurants and local food businesses.",
  },
  "https://prokursy-online.pl/": {
    title: "Prokursy",
    description: "Online course platform for content, materials and training sales.",
    tech: ["Next.js", "video", "LMS"],
  },
  "https://harmonogram.odart.pl/demo": {
    title: "Scheduling system",
    description:
      "Workshop and production scheduling: jobs, vehicles, clients, roles and task planning in one application.",
    tech: ["Next.js", "calendar", "roles"],
  },
  "https://stronadewelopera.pl/demo/inwestycja/": {
    title: "Real estate development demo",
    description:
      "Investment website with apartment listings, filters, gallery and a contact flow for property sales.",
    tech: ["Next.js", "React", "animations"],
  },
  "https://fotoferia.pl/": {
    title: "Fotoferia",
    description:
      "Photography community portal with galleries, contests and image search, developed since 2008.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}/en/#website`,
      url: `${SITE}/en/`,
      name: "ODART",
      description:
        "Websites, web apps and IT support from Kolobrzeg, Poland. Since 2008.",
      publisher: { "@id": `${SITE}/#org` },
      inLanguage: "en",
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "ODART - Ostry Dyzur Artystyczny",
      url: SITE,
      email: "biuro@odart.pl",
      telephone: "+48695432415",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kolobrzeg",
        addressCountry: "PL",
      },
      founder: {
        "@type": "Person",
        name: "Rafal Kowalkowski",
        jobTitle: "Web developer & designer",
      },
      sameAs: ["https://zaamow.pl"],
    },
  ],
};

export function OdartHomePageEn() {
  return (
    <OdartPublicShell activeNav="home" jsonLd={jsonLd} locale="en">
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.1),transparent)] lg:hidden"
          aria-hidden
        />
        <OdartSnakeLineAccent side="left" />
        <OdartSnakeLineAccent side="right" phaseDelay />
        <OdartSpiralLine segments={28} />
        <div className="absolute inset-0 z-0 hidden lg:block">
          <Image
            src="https://odart.pl/wp-content/uploads/2026/02/odart._in_office_with_monitors_and_code_around_-ar_11_-styl_66ecffcf-aeef-478d-8736-270028d15204_3.jpg"
            alt="Rafal Kowalkowski - ODART"
            fill
            className="object-cover object-center opacity-40"
            sizes="100vw"
            priority
            role="presentation"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-transparent" />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_20%,rgba(249,115,22,0.08),transparent)]"
            aria-hidden
          />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 lg:px-6 lg:py-28">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">
            Kolobrzeg · since 2008
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Websites and applications
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
            My name is Rafal Kowalkowski. I have been building websites and apps since 2008: Fotoferia, food
            ordering, business panels. WordPress when you need to edit the content yourself.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center rounded-lg bg-odart-accent px-6 py-3 font-semibold text-white hover:brightness-110"
            >
              Ask for a quote
              <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
            </Link>
            <Link
              href={`${SITE}/strony-internetowe/`}
              className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
            >
              Websites
            </Link>
            <Link
              href={`${SITE}/en/#services`}
              className="inline-flex items-center rounded-lg border border-odart-accent/35 bg-odart-accent/10 px-6 py-3 font-semibold text-white hover:bg-odart-accent/20"
            >
              Services
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-odart-accent">
            Websites and IT
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-2xl font-bold text-white sm:text-3xl">
            Websites and IT support
          </p>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                label: "Business websites",
                title: "Company website",
                text:
                  "Brochure site, clinic or shop. Form, phone and email on the first screen. WordPress or Next.js, depending on whether you will edit the texts yourselves.",
                href: `${SITE}/strony-internetowe/`,
                cta: "Websites",
                points: ["Works on a phone", "Basic SEO (titles, headings, sitemap)", "Scope after a conversation"],
              },
              {
                label: "IT support",
                title: "Computers and network",
                text:
                  "Updates, backups, outages. Kolobrzeg, Koszalin or remote desktop. One number, agreed scope.",
                href: `${SITE}/opieka-it-dla-firm-kolobrzeg/`,
                cta: "IT support",
                points: ["Email or phone", "Backups and updates", "On site or remote"],
              },
            ].map((item) => (
              <article
                key={item.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 lg:p-10"
              >
                <p className="text-xs font-medium uppercase tracking-wider text-odart-accent">{item.label}</p>
                <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-400">{item.text}</p>
                <ul className="mt-6 space-y-2 text-sm text-neutral-500">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={item.href}
                  className="mt-8 inline-flex items-center font-semibold text-odart-accent hover:text-orange-300"
                >
                  {item.cta}
                  <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <OdartZaamowSection locale="en" />

      <section id="services" className="border-b border-white/10 bg-neutral-950 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="sr-only">Scope of work</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Palette, title: "Interface", desc: "Page and app layout. Figma, sometimes Adobe." },
              { icon: Code2, title: "Applications", desc: "Next.js, React. WordPress when you need a content panel." },
              { icon: Sparkles, title: "Graphics", desc: "Logos, banners, social graphics." },
              { icon: FileText, title: "Copy", desc: "I can write from scratch or edit what you already have." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <item.icon className="h-8 w-8 text-odart-accent" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-neutral-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="border-y border-white/10 bg-neutral-950/50 px-4 py-20 lg:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_1.1fr] lg:items-center">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 lg:mx-0">
            <Image
              src="https://odart.pl/wp-content/uploads/2026/02/odart._in_office_with_monitors_and_code_around_-ar_11_-styl_66ecffcf-aeef-478d-8736-270028d15204_3.jpg"
              alt="Rafal Kowalkowski - ODART"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 28rem"
              priority
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">From Kolobrzeg, since 2008</h2>
            <p className="mt-6 leading-relaxed text-neutral-400">
              I started with fotoferia.pl. Then came panels, shops, food ordering, scheduling tools. I code
              in Next.js. I leave WordPress where someone logs in every day and changes the offer.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Headphones, t: "Consulting", d: "Goals, scope and priorities before implementation." },
                { icon: Cpu, t: "Support", d: "Help after launch and ongoing improvements." },
                { icon: Globe, t: "WWW and CMS", d: "Custom applications, business websites and WordPress." },
                { icon: Server, t: "Hosting", d: "Domain, hosting, SSL and deployment order." },
              ].map((x) => (
                <div key={x.t} className="flex gap-3 rounded-xl border border-neutral-800 bg-white/[0.02] p-6">
                  <x.icon className="h-6 w-6 shrink-0 text-odart-accent" aria-hidden />
                  <div>
                    <p className="font-semibold text-white">{x.t}</p>
                    <p className="text-sm text-neutral-500">{x.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-medium uppercase tracking-wide text-odart-accent">Services</p>
          <h2 className="mt-2 text-center text-3xl font-bold text-white sm:text-4xl">What I can help with</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Web applications",
                desc: "Custom React, Next.js and TypeScript products with a focus on UX, speed and deployment.",
                href: getEnglishServiceHref("custom-web-applications"),
              },
              {
                title: "Business panels and systems",
                desc: "Internal tools, roles, reports and workflows that replace spreadsheets and manual work.",
                href: getEnglishServiceHref("business-panels-and-systems"),
              },
              {
                title: "Integrations and APIs",
                desc: "Connecting shops, CRMs, couriers, accounting and other systems through webhooks and REST APIs.",
                href: getEnglishServiceHref("api-integrations-and-automation"),
              },
              {
                title: "Business websites",
                desc: "Professional WordPress or Next.js websites designed for clarity, trust and conversion.",
                href: getEnglishServiceHref("business-websites"),
              },
              {
                title: "IT support for companies",
                desc: "Helpdesk, network, workstations, backup and security for small and medium businesses.",
                href: getEnglishServiceHref("it-support-for-companies"),
              },
              {
                title: "SEO optimization",
                desc: "Technical audit, content structure and improvements that help Google understand your website.",
                href: getEnglishServiceHref("seo-optimization"),
              },
            ].map((s) => (
              <article key={s.title} className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">{s.desc}</p>
                <Link
                  href={s.href}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
                >
                  More
                  <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="portfolio" className="px-4 py-20 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Portfolio</p>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Selected projects</h2>
            </div>
            <Link href={ODART_PORTFOLIO_URL} className="font-semibold text-odart-accent hover:text-orange-300">
              See all projects
            </Link>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {ODART_PORTFOLIO_ITEMS.map((item) => {
              const copy = portfolioCopy[item.href] ?? item;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-lg shadow-black/30 transition hover:border-odart-accent/45 hover:shadow-xl hover:shadow-black/40"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                    <Image
                      src={item.image}
                      alt={copy.title}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" aria-hidden />
                    <p className="absolute bottom-3 left-4 right-4 text-xs font-medium uppercase tracking-wider text-white/90">
                      {item.host}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold leading-snug text-white group-hover:text-orange-100">
                      {copy.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">{copy.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(copy.tech ?? item.tech).map((t) => (
                        <span
                          key={`${item.href}-${t}`}
                          className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-neutral-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center text-sm font-semibold text-odart-accent group-hover:text-orange-300">
                      Open project
                      <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 bg-gradient-to-br from-neutral-950/50 to-black px-4 py-20 lg:px-6">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold text-white">Contact</h2>
            <p className="mt-4 text-neutral-400">
              Email biuro@odart.pl or call. I usually reply the same day.
            </p>
            <ul className="mt-8 space-y-4 text-neutral-300">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-odart-accent" aria-hidden />
                <a href="tel:+48695432415" className="hover:text-white">
                  +48 695 432 415
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-odart-accent" aria-hidden />
                <a href="mailto:biuro@odart.pl" className="hover:text-white">
                  biuro@odart.pl
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-odart-accent" aria-hidden />
                Kolobrzeg, Poland
              </li>
            </ul>
          </div>
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-8 lg:mt-0">
            <p className="text-sm font-medium text-white">Contact form</p>
            <p className="mt-2 text-sm text-neutral-500">You can also just send an email.</p>
            <Link
              href={`${SITE}/kontakt/`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-odart-accent py-3 font-semibold text-white hover:brightness-110"
            >
              Ask for a quote
            </Link>
          </div>
        </div>
      </section>
    </OdartPublicShell>
  );
}
