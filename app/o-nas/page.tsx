import Link from "next/link";
import { clinicDemo } from "@/content/clinicDemo";
import { ClinicHeader } from "@/components/clinic/ClinicHeader";
import { ClinicFooter } from "@/components/clinic/ClinicFooter";

const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: "O nas | Gabinet Kosmetyczny — Kołobrzeg",
  description:
    "Kosmetologia estetyczna w Kołobrzegu. Doświadczenie, certyfikowane preparaty i indywidualne plany terapii.",
  alternates: { canonical: `${SITE_URL}/o-nas` },
  openGraph: {
    title: "O nas | Gabinet Kosmetyczny — Kołobrzeg",
    description:
      "Kosmetologia estetyczna w Kołobrzegu. Doświadczenie i indywidualne plany terapii.",
    url: `${SITE_URL}/o-nas`,
    type: "website",
    locale: "pl_PL",
  },
};

export default function ONasPage() {
  const { about } = clinicDemo;
  return (
    <>
      <ClinicHeader />
      <main className="min-h-screen bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-beauty-charcoal mb-8">
            {about.title}
          </h1>
          <div className="space-y-4 text-beauty-charcoal/90">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Link
            href={about.ctaHref}
            className="mt-10 inline-flex rounded-full bg-beauty-rose px-6 py-3 font-semibold text-white hover:bg-beauty-pink-500 transition-colors"
          >
            {about.ctaLabel}
          </Link>
        </div>
      </main>
      <ClinicFooter />
    </>
  );
}
