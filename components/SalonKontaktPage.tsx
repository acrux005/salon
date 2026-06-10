import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { KontaktForm } from "@/components/KontaktForm";
import { Mail, Phone, MapPin } from "lucide-react";

const OPERATOR = {
  name: "ODART Rafał Kowalkowski",
  street: "ul. Makowskiego 3",
  city: "78-100 Kołobrzeg",
  nip: "5791020696",
  email: "biuro@odart.pl",
  tel: "695 432 415",
  telHref: "tel:+48695432415",
};

export function SalonKontaktPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderPortal />
      <main className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-serif)] text-3xl font-normal text-beauty-charcoal sm:text-4xl">
            Kontakt
          </h1>
          <p className="mt-3 font-[var(--font-sans)] text-[15px] text-beauty-charcoal/80">
            Skontaktuj się z nami — odpowiemy na każde zapytanie.
          </p>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div className="rounded-2xl border border-beauty-pink-200/60 bg-beauty-cream/40 p-6 lg:p-8">
              <h2 className="font-[var(--font-sans)] text-lg font-semibold text-beauty-charcoal">
                Operator serwisu salon.odart.pl
              </h2>
              <address className="mt-6 space-y-4 not-italic">
                <p className="font-[var(--font-sans)] font-semibold text-beauty-charcoal">
                  {OPERATOR.name}
                </p>
                <p className="flex items-start gap-3 font-[var(--font-sans)] text-[15px] text-beauty-charcoal">
                  <MapPin className="h-5 w-5 shrink-0 text-beauty-rose mt-0.5" />
                  <span>
                    {OPERATOR.street}
                    <br />
                    {OPERATOR.city}
                  </span>
                </p>
                <p className="font-[var(--font-sans)] text-[15px] text-beauty-charcoal">
                  NIP: {OPERATOR.nip}
                </p>
                <a
                  href={`mailto:${OPERATOR.email}`}
                  className="flex items-center gap-3 font-[var(--font-sans)] text-[15px] text-beauty-charcoal hover:text-beauty-rose transition-colors"
                >
                  <Mail className="h-5 w-5 shrink-0 text-beauty-rose" />
                  {OPERATOR.email}
                </a>
                <a
                  href={OPERATOR.telHref}
                  className="flex items-center gap-3 font-[var(--font-sans)] text-[15px] font-medium text-beauty-charcoal hover:text-beauty-rose transition-colors"
                >
                  <Phone className="h-5 w-5 shrink-0 text-beauty-rose" />
                  tel. {OPERATOR.tel}
                </a>
              </address>
              <div className="mt-8">
                <Link
                  href="/portal"
                  className="inline-flex rounded-full bg-beauty-rose px-6 py-3 font-[var(--font-sans)] text-[15px] font-semibold text-white transition-colors hover:bg-beauty-pink-500"
                >
                  Umów wizytę online
                </Link>
              </div>
            </div>

            <div>
              <h2 className="font-[var(--font-sans)] text-lg font-semibold text-beauty-charcoal">
                Formularz zapytań
              </h2>
              <p className="mt-2 font-[var(--font-sans)] text-[14px] text-beauty-charcoal/70">
                Wyślij zapytanie — odpowiemy najszybciej jak to możliwe.
              </p>
              <div className="mt-6">
                <KontaktForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterPortal />
    </div>
  );
}
