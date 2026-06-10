import Link from "next/link";
import { clinicDemo } from "@/content/clinicDemo";
import { ClinicHeader } from "@/components/clinic/ClinicHeader";
import { ClinicFooter } from "@/components/clinic/ClinicFooter";

const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: "Oferta | Gabinet Kosmetyczny — Kołobrzeg",
  description:
    "Trądzik, anti-aging, przebarwienia, naczynka — dopasowanie zabiegów do Twojego problemu. Konsultacja kwalifikacyjna w Kołobrzegu.",
  alternates: { canonical: `${SITE_URL}/oferta` },
  openGraph: {
    title: "Oferta | Gabinet Kosmetyczny — Kołobrzeg",
    description:
      "Trądzik, anti-aging, przebarwienia — dopasowanie zabiegów do Twojego problemu. Kołobrzeg.",
    url: `${SITE_URL}/oferta`,
    type: "website",
    locale: "pl_PL",
  },
};

export default function OfertaPage() {
  const { problems } = clinicDemo;
  return (
    <>
      <ClinicHeader />
      <main className="min-h-screen bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-beauty-charcoal mb-2">
            {problems.title}
          </h1>
          <p className="text-beauty-charcoal/80 mb-10">{problems.subtitle}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {problems.cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-2xl border border-beauty-pink-200/60 bg-beauty-cream/40 p-6 text-beauty-charcoal font-medium hover:border-beauty-rose hover:bg-beauty-pink-50/50 transition-colors"
              >
                {card.title}
              </Link>
            ))}
          </div>
          <p className="mt-10 text-beauty-charcoal/80">
            Pełna oferta zabiegów i rezerwacja online w portalu.
          </p>
          <Link
            href="/portal"
            className="mt-4 inline-flex rounded-full bg-beauty-rose px-6 py-3 font-semibold text-white hover:bg-beauty-pink-500 transition-colors"
          >
            Przejdź do portalu
          </Link>
        </div>
      </main>
      <ClinicFooter />
    </>
  );
}
