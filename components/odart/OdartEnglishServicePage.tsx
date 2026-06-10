import Link from "next/link";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  ODART_ENGLISH_SERVICES,
  type OdartEnglishService,
  getEnglishServiceHref,
} from "@/lib/odartEnglishServices";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;

type Props = {
  service?: OdartEnglishService;
};

export function OdartEnglishServicePage({ service }: Props) {
  const isIndex = service == null;
  const pageTitle = service?.title ?? "ODART services";
  const pageDescription =
    service?.description ??
    "English overview of ODART services: web applications, business websites, WordPress, SEO, automation, IT support and monitoring.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isIndex ? "CollectionPage" : "Service",
    name: pageTitle,
    description: pageDescription,
    url: isIndex ? `${SITE}/en/services/` : `${SITE}/en/services/${service.slug}/`,
    inLanguage: "en",
    provider: {
      "@type": "Organization",
      name: "ODART",
      url: SITE,
      email: "biuro@odart.pl",
      telephone: "+48695432415",
    },
  };

  return (
    <OdartPublicShell activeNav="uslugi" locale="en" jsonLd={jsonLd}>
      <article className="border-b border-white/10 px-4 py-10 lg:px-6 lg:py-14">
        <div className="mx-auto max-w-4xl">
          <nav className="text-sm text-neutral-500" aria-label="Breadcrumb">
            <Link href={`${SITE}/en/`} className="hover:text-odart-accent">
              Home
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            {isIndex ? (
              <span className="text-neutral-300">Services</span>
            ) : (
              <>
                <Link href={`${SITE}/en/services/`} className="hover:text-odart-accent">
                  Services
                </Link>
                <span className="mx-2 text-neutral-600">/</span>
                <span className="text-neutral-300">{service.label}</span>
              </>
            )}
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">
            {isIndex ? "English offer" : "Service"}
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {pageTitle}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-300">{pageDescription}</p>
        </div>
      </article>

      {service ? (
        <>
          <section className="border-b border-white/10 px-4 py-14 lg:px-6">
            <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-2xl font-bold text-white">Overview</h2>
                <p className="mt-5 leading-relaxed text-neutral-400">{service.intro}</p>
                <p className="mt-5 leading-relaxed text-neutral-400">{service.outcome}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-odart-accent">
                  Best for
                </p>
                <ul className="mt-5 space-y-3">
                  {service.bestFor.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-relaxed text-neutral-300">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="px-4 py-14 lg:px-6">
            <div className="mx-auto max-w-6xl">
              <h2 className="text-2xl font-bold text-white">What the work can include</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {service.deliverables.map((item) => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <Check className="h-5 w-5 text-odart-accent" aria-hidden />
                    <p className="mt-4 text-sm leading-relaxed text-neutral-300">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={`${SITE}/en/#contact`}
                  className="inline-flex items-center rounded-lg bg-odart-accent px-6 py-3 font-semibold text-white hover:brightness-110"
                >
                  Ask about this service
                  <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
                </Link>
                <Link
                  href={service.polishHref}
                  className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
                >
                  Polish version
                </Link>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section className="px-4 py-14 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {ODART_ENGLISH_SERVICES.map((item) => (
                <Link
                  key={item.slug}
                  href={getEnglishServiceHref(item.slug)}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/45 hover:bg-white/[0.04]"
                >
                  <h2 className="text-lg font-semibold text-white group-hover:text-orange-100">
                    {item.label}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">{item.description}</p>
                  <span className="mt-6 inline-flex items-center text-sm font-semibold text-odart-accent">
                    Read more
                    <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-white/10 bg-neutral-950/60 px-4 py-10 lg:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link href={`${SITE}/en/`} className="inline-flex items-center text-sm text-neutral-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
            Back to English homepage
          </Link>
          <a href="mailto:biuro@odart.pl" className="text-sm font-semibold text-odart-accent hover:text-orange-300">
            biuro@odart.pl
          </a>
        </div>
      </section>
    </OdartPublicShell>
  );
}
