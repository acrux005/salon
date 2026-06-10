import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartKontaktForm } from "@/components/odart/OdartKontaktForm";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/kontakt/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Kontakt | ODART",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "ODART — Ostry Dyżur Artystyczny",
      url: SITE,
      email: "biuro@odart.pl",
      telephone: "+48695432415",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
    },
  ],
};

export function OdartKontaktPage() {
  return (
    <OdartPublicShell activeNav="kontakt" jsonLd={jsonLd}>
      <div className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Kontakt</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Napisz — odpowiemy tak szybko, jak to możliwe
          </h1>
          <p className="mt-4 max-w-2xl text-neutral-400">
            Formularz poniżej lub bezpośrednio:{" "}
            <a href="mailto:biuro@odart.pl" className="text-odart-accent hover:text-orange-300">
              biuro@odart.pl
            </a>
            , tel.{" "}
            <a href="tel:+48695432415" className="text-odart-accent hover:text-orange-300">
              +48 695 432 415
            </a>
            .
          </p>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:p-8">
              <h2 className="text-lg font-semibold text-white">Dane kontaktowe</h2>
              <ul className="mt-6 space-y-5 text-neutral-300">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-odart-accent" aria-hidden />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">Telefon</p>
                    <a href="tel:+48695432415" className="hover:text-white">
                      +48 695 432 415
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-odart-accent" aria-hidden />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">E-mail</p>
                    <a href="mailto:biuro@odart.pl" className="hover:text-white">
                      biuro@odart.pl
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-odart-accent" aria-hidden />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">Adres</p>
                    <span>Kołobrzeg</span>
                  </div>
                </li>
              </ul>
              <div className="mt-8 border-t border-white/10 pt-8">
                <p className="text-sm text-neutral-500">Zostaw wiadomość — dodaj adres e-mail, abyśmy mogli odpowiedzieć.</p>
              </div>
            </div>

            <div>
              <h2 className="sr-only">Formularz</h2>
              <OdartKontaktForm />
            </div>
          </div>

          <p className="mt-12 text-center text-sm text-neutral-600">
            <Link href={`${SITE}/polityka-prywatnosci/`} className="hover:text-neutral-400">
              Polityka prywatności
            </Link>
            {" · "}
            <Link href={`${SITE}/regulamin/`} className="hover:text-neutral-400">
              Regulamin
            </Link>
          </p>
        </div>
      </div>
    </OdartPublicShell>
  );
}
