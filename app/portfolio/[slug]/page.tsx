import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ClinicHeader } from "@/components/clinic/ClinicHeader";
import { Footer } from "@/components/Footer";
import { portfolioProducts } from "@/lib/productPages";

const PORTFOLIO_SLUGS = ["regulacja-brwi"];

type Props = {
  params: { slug: string };
};

export function generateMetadata({ params }: Props): Metadata {
  if (!PORTFOLIO_SLUGS.includes(params.slug)) {
    return { title: "Portfolio | Zabiegi Odart", robots: { index: false, follow: false } };
  }
  const product = portfolioProducts[params.slug];
  if (!product) {
    return { title: "Portfolio | Zabiegi Odart", robots: { index: false, follow: false } };
  }
  const url = `https://salon.odart.pl/portfolio/${params.slug}`;
  const title = product.metaTitle ?? `${product.name} | Kołobrzeg`;
  const description =
    product.metaDescription ??
    `${product.shortDescription} Czas trwania: ${product.duration}. Cena: ${product.priceFrom}.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Zabiegi Odart", type: "website", locale: "pl_PL" },
  };
}

export default function PortfolioSlugPage({ params }: Props) {
  if (!PORTFOLIO_SLUGS.includes(params.slug)) notFound();
  const product = portfolioProducts[params.slug];
  if (!product) notFound();

  const faqSchema =
    product.seo?.faq && product.seo.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: product.seo.faq.map((item: { question: string; answer: string }) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }
      : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ClinicHeader />
      <main>
        <section className="py-20 bg-gradient-to-br from-beauty-pink via-beauty-pink-100 to-beauty-cream">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-beauty-rose mb-3">
              Portfolio
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-beauty-charcoal mb-4">
              {product.name}
            </h1>
            <p className="text-lg lg:text-xl text-beauty-charcoal/80 max-w-3xl">
              {product.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-white/80 px-4 py-2 text-beauty-charcoal">
                Czas: {product.duration}
              </span>
              <span className="rounded-full bg-white/80 px-4 py-2 text-beauty-charcoal">
                Cena: {product.priceFrom}
              </span>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-beauty-charcoal mb-5">
              {product.treatmentHeading}
            </h2>
            <div className="space-y-4 text-beauty-charcoal/80">
              {product.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-beauty-cream/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-beauty-pink-200/60 bg-white p-6">
              <h2 className="text-2xl font-bold text-beauty-charcoal mb-4">Korzyści</h2>
              <ul className="space-y-2 text-beauty-charcoal/80">
                {product.benefits.map((benefit) => (
                  <li key={benefit}>- {benefit}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-2xl border border-beauty-pink-200/60 bg-white p-6">
              <h2 className="text-2xl font-bold text-beauty-charcoal mb-4">Dla kogo</h2>
              <ul className="space-y-2 text-beauty-charcoal/80">
                {product.indications.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-beauty-charcoal mb-4">{product.ctaHeading}</h2>
            <p className="text-beauty-charcoal/80 max-w-2xl mx-auto mb-8">
              Sprawdź dostępność terminów i wybierz gabinet dopasowany do Twoich potrzeb.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/portal/gabinety"
                className="inline-flex items-center justify-center rounded-full bg-beauty-rose px-8 py-4 font-semibold text-white hover:bg-beauty-pink-500 transition-colors"
              >
                Wybierz gabinet
              </Link>
              <Link
                href="/portal"
                className="inline-flex items-center justify-center rounded-full border border-beauty-rose px-8 py-4 font-semibold text-beauty-rose hover:bg-beauty-pink-100 transition-colors"
              >
                Wróć do portalu
              </Link>
            </div>

            {product.seo && (
              <details className="mt-12 text-left max-w-3xl mx-auto group" open>
                <summary className="cursor-pointer list-none font-semibold text-beauty-charcoal/80 hover:text-beauty-rose transition-colors py-2 flex items-center gap-2">
                  <span className="group-open:rotate-90 transition-transform inline-block">›</span>
                  Więcej informacji o {product.name} w Kołobrzegu
                </summary>
                <div className="pt-6 space-y-6 border-t border-beauty-pink-200/60 mt-4">
                  <h2 className="text-2xl font-bold text-beauty-charcoal">{product.seo.h2}</h2>
                  <div className="space-y-4 text-beauty-charcoal/80 text-[15px] leading-relaxed">
                    {product.seo.description.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                  {product.seo.faq && product.seo.faq.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-beauty-charcoal">
                        Najczęściej zadawane pytania
                      </h3>
                      {product.seo.faq.map((item) => (
                        <details
                          key={item.question}
                          className="rounded-lg border border-beauty-pink-200/60 bg-white/80 overflow-hidden"
                        >
                          <summary className="px-4 py-3 cursor-pointer font-medium text-beauty-charcoal hover:bg-beauty-pink-50/50 transition-colors">
                            {item.question}
                          </summary>
                          <p className="px-4 py-3 pt-0 text-beauty-charcoal/80 text-sm border-t border-beauty-pink-100">
                            {item.answer}
                          </p>
                        </details>
                      ))}
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
