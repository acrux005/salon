import {
  Award,
  BadgeCheck,
  MapPin,
  Microscope,
  Phone,
  Scan,
  ShieldCheck,
  Star,
  Stethoscope,
} from "lucide-react";
import type { ShowcaseLanding } from "@/lib/gabinet/showcaseLandings";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function GabShowcaseLanding({ landing }: { landing: ShowcaseLanding }) {
  const telHref = `tel:${landing.phone}`;
  const mailHref = `mailto:${landing.email}`;
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(landing.mapQuery)}`;
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(landing.mapQuery)}&z=16&output=embed`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: landing.clinicName,
    employee: {
      "@type": "Person",
      name: landing.doctorName,
      honorificPrefix: landing.doctorTitle,
      jobTitle: landing.specialty,
      identifier: landing.pwz,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: landing.address,
      addressLocality: landing.city,
      postalCode: landing.postalCode,
      addressCountry: "PL",
    },
    telephone: landing.phone,
    email: landing.email,
    url: `https://dentysta.odart.pl/${landing.slug}`,
    priceRange: "$$",
  };

  return (
    <main className="pb-24 sm:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative overflow-hidden border-b border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-16">
          <div>
            <GabLink href="/gabinety" className="text-[13px] font-medium text-gab-sky hover:underline">
              ← Gabinety w Kołobrzegu
            </GabLink>
            <p className="mt-4 max-w-full text-pretty rounded-2xl border border-sky-200 bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase leading-snug tracking-wide text-sky-700 sm:inline-block sm:rounded-full">
              {landing.specialty} · {landing.city}
            </p>
            <h1 className="mt-3 text-pretty text-[1.55rem] font-bold leading-tight tracking-tight text-gab-navy sm:text-4xl">
              {landing.doctorTitle} {landing.doctorName}
            </h1>
            <p className="mt-2 text-lg font-semibold text-sky-800">{landing.clinicName}</p>
            <p className="mt-3 flex items-start gap-2 text-[15px] text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gab-sky" aria-hidden />
              <span>
                {landing.address}, {landing.postalCode} {landing.city}
                <span className="block text-[13px] text-slate-500">{landing.addressHint}</span>
              </span>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-slate-600 sm:gap-3 sm:text-[14px]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-800">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                {landing.reviewCount} opinii
              </span>
              <span>PWZ {landing.pwz}</span>
              <span>Od {landing.sinceYear} w Kołobrzegu</span>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href={telHref} className="gab-btn-primary w-full px-6 py-3 text-[15px] shadow-lg shadow-sky-500/25 sm:w-auto">
                <Phone className="mr-2 h-4 w-4" aria-hidden />
                Zadzwoń: {landing.phoneDisplay}
              </a>
              <a
                href={mailHref}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border-2 border-sky-200 bg-white px-6 py-3 text-[15px] font-semibold text-sky-800 hover:bg-sky-50 sm:w-auto"
              >
                Napisz e-mail
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-sky-600 text-xl font-bold text-white">
                {initials(landing.doctorName)}
              </div>
              <div>
                <p className="font-semibold text-gab-navy">Prywatny gabinet stomatologiczny</p>
                <p className="text-[14px] text-slate-500">Wizyty stacjonarne · {landing.patients}</p>
              </div>
            </div>
            <ul className="mt-5 space-y-2.5 text-[14px] text-slate-600">
              {landing.extras.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-sky-600" aria-hidden />
                  {item}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-sky-600" aria-hidden />
                Ubezpieczenie: {landing.insurance.join(", ")}
              </li>
            </ul>
            <p className="mt-5 text-[13px] leading-relaxed text-slate-500">
              Kalendarz prowadzi gabinet. Umówienie — telefon lub e-mail. Przy rezerwacji podaj wiek i cel wizyty.
            </p>
          </div>
        </div>
      </section>

      <div className="border-b border-sky-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-4 sm:grid-cols-3">
          {[
            { icon: Scan, label: "RTG na miejscu" },
            { icon: Microscope, label: "Mikroskop, gdy trzeba" },
            { icon: Stethoscope, label: "Zachowawcza, endodoncja, protetyka" },
          ].map((item) => (
            <div key={item.label} className="flex min-w-0 items-start gap-2 text-[14px] font-medium text-gab-navy">
              <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-gab-sky" aria-hidden />
              <span className="min-w-0">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-[14px] leading-relaxed text-amber-950 sm:px-5">
          <p className="font-semibold">Ważna informacja przed wizytą</p>
          <p className="mt-1">{landing.notice}</p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-xl font-bold text-gab-navy sm:text-2xl">O mnie</h2>
            <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-slate-600">
              {landing.about.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <p className="mt-4 text-[14px] text-slate-500">
              <span className="font-medium text-gab-navy">Wykształcenie:</span> {landing.education}
            </p>
            {landing.award ? (
              <p className="mt-3 inline-flex items-start gap-2 rounded-xl bg-sky-50 px-3 py-2 text-[14px] text-sky-900">
                <Award className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {landing.award}
              </p>
            ) : null}
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-sky-100 bg-white p-5">
              <h3 className="font-semibold text-gab-navy">Zakres porad</h3>
              <ul className="mt-3 space-y-1.5 text-[14px] text-slate-600">
                {landing.scopes.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-white p-5">
              <h3 className="font-semibold text-gab-navy">Najczęstsze zgłoszenia</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {landing.areas.map((item) => (
                  <span key={item} className="rounded-full bg-sky-50 px-3 py-1 text-[13px] text-sky-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sky-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <h2 className="text-xl font-bold text-gab-navy sm:text-2xl">Usługi i ceny</h2>
          <p className="mt-2 text-[14px] text-slate-500">
            Ceny orientacyjne. Ostateczny koszt zależy od planu leczenia — potwierdź przy umawianiu.
          </p>
          <ul className="mt-6 divide-y divide-sky-100 rounded-2xl border border-sky-100">
            {landing.services.map((service) => (
              <li key={service.name} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 sm:px-5">
                <span className="text-[15px] text-gab-navy">{service.name}</span>
                <span className="shrink-0 text-[14px] font-semibold text-sky-800">{service.price ?? "wg wyceny"}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gab-navy sm:text-2xl">Co mówią pacjenci</h2>
            <p className="mt-1 text-[14px] text-slate-500">{landing.reviewCount} opinii · wybrane wypowiedzi</p>
          </div>
          <a
            href={landing.znanyLekarzUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-medium text-gab-sky hover:underline"
          >
            Wszystkie opinie na ZnanyLekarz
          </a>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {landing.reviews.map((review) => (
            <blockquote key={`${review.author}-${review.date}`} className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-1 text-amber-400" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-slate-700">„{review.text}”</p>
              <footer className="mt-4 text-[13px] text-slate-500">
                <span className="font-semibold text-gab-navy">{review.author}</span>
                {" · "}
                {review.date}
                {review.service ? ` · ${review.service}` : ""}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="border-t border-sky-100 bg-sky-50/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:py-14 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-gab-navy sm:text-2xl">Adres i kontakt</h2>
            <p className="mt-3 text-[15px] font-semibold text-gab-navy">{landing.clinicName}</p>
            <p className="mt-1 text-[15px] text-slate-600">
              {landing.address}
              <br />
              {landing.postalCode} {landing.city}
              <br />
              <span className="text-[14px] text-slate-500">{landing.addressHint}</span>
            </p>
            <dl className="mt-5 space-y-2 text-[14px] text-slate-600">
              <div>
                <dt className="font-medium text-gab-navy">Telefon</dt>
                <dd>
                  <a href={telHref} className="text-gab-sky hover:underline">
                    {landing.phoneDisplay}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gab-navy">E-mail</dt>
                <dd>
                  <a href={mailHref} className="text-gab-sky hover:underline">
                    {landing.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gab-navy">Płatności</dt>
                <dd>{landing.payments.join(" · ")}</dd>
              </div>
              <div>
                <dt className="font-medium text-gab-navy">NIP</dt>
                <dd>{landing.nip}</dd>
              </div>
            </dl>
            <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block text-[14px] font-medium text-gab-sky hover:underline">
              Otwórz w Mapach Google
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
            <iframe
              title={`Mapa: ${landing.clinicName}`}
              src={mapEmbed}
              className="h-72 w-full sm:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-sky-200 bg-white/95 p-3 shadow-[0_-8px_24px_rgba(12,74,110,0.08)] backdrop-blur-md sm:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <a href={telHref} className="gab-btn-primary w-full px-4 py-3">
          <Phone className="mr-2 h-4 w-4" aria-hidden />
          Zadzwoń {landing.phoneDisplay}
        </a>
      </div>
    </main>
  );
}
