import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { ODART_PORTFOLIO_ITEMS } from "@/lib/odartPortfolio";
import { ODART_REALIZACJE_KLIENCI } from "@/lib/odartRealizacjeBlog";

const PORTFOLIO_COPY: Record<string, { title: string; description: string; tech?: string[] }> = {
  "https://salon.odart.pl/": {
    title: "Beauty salon portal",
    description:
      "Appointment booking, a clinic directory and a client path built for the beauty and wellness industry.",
  },
  "https://zamow.odart.pl/": {
    title: "Zamow - online ordering",
    description:
      "Online food ordering from a phone or computer: menu, cart and restaurant-focused order handling.",
  },
  "https://prokursy-online.pl/": {
    title: "Prokursy",
    description: "An online course platform with content, materials and sales logic for digital training.",
    tech: ["Next.js", "video", "LMS"],
  },
  "https://harmonogram.odart.pl/demo": {
    title: "Schedule system",
    description:
      "Workshop jobs, vehicles, clients and tires, plus company production views with projects and task schedules.",
    tech: ["Next.js", "calendar", "roles"],
  },
  "https://stronadewelopera.pl/demo/inwestycja/": {
    title: "Real estate investment demo",
    description:
      "A property sales page with apartment listings, filters, gallery and a clear contact path for leads.",
    tech: ["Next.js", "React", "animations"],
  },
  "https://fotoferia.pl/": {
    title: "Fotoferia",
    description:
      "A social portal for photographers with galleries, contests and image search, developed since 2008.",
  },
};

const CLIENT_COPY: Record<string, { title: string; description: string }> = {
  "https://szkolaeuropa.pl/": {
    title: "Europa Foreign Language School",
    description:
      "A website for a language school in Kolobrzeg: courses, online classes, EU projects, exams and contact details.",
  },
  "https://mkdigitalstudio.pl/": {
    title: "Magdalena Krupska - Product Owner",
    description:
      "A personal website for a product manager: portfolio, career path, recommendations and contact.",
  },
  "https://ecocar-kolobrzeg.pl/": {
    title: "EcoCar Kolobrzeg",
    description:
      "A website for electric cart tours in Kolobrzeg with routes, pricing, booking information and fleet details.",
  },
  "https://mkprofit.com.pl/": {
    title: "MK Profit - accounting office",
    description:
      "An accounting office website presenting services, HR support, company registration and lead-focused contact paths.",
  },
  "https://kancelaria-myslinski.pl/": {
    title: "Attorney Wlodzimierz Myslinski",
    description:
      "A law office website for Koszalin with legal specializations, service descriptions and contact information.",
  },
  "https://bursztynek-domki.pl/": {
    title: "Bursztynek holiday cottages",
    description:
      "A resort website for cottages and an apartment in Grzybowo: location, prices, booking and contact.",
  },
  "https://zbigniewkomorowski.pl/": {
    title: "Zbigniew Komorowski - vocalist",
    description:
      "An artist website with concerts, album information, promotional materials and contact for event organizers.",
  },
  "https://jolatubielewicz.pl/": {
    title: "Jola Tubielewicz",
    description:
      "A vocalist website with bio, concert offer, videos, gallery and a contact path for organizers.",
  },
  "https://magdakowalkowska.pl/": {
    title: "Magdalena Kowalkowska accounting services",
    description:
      "A website for accounting services in Kolobrzeg, aimed at sole proprietors and small companies.",
  },
  "https://domki-mobilne.odart.pl/": {
    title: "Mobile homes offer",
    description:
      "A product presentation for mobile homes with models, parameters, photos and commercial contact.",
  },
  "https://roombeauty.pl/": {
    title: "Beauty Room - aesthetic cosmetology",
    description:
      "A clinic website in Kolobrzeg with treatment descriptions, results portfolio, reviews and contact form.",
  },
  "https://zbieznosc-kolobrzeg.pl/": {
    title: "Auto-Max - workshop and wheel alignment",
    description:
      "A workshop website in Kolobrzeg covering 3D alignment, service, tire work, air conditioning and bookings.",
  },
  "https://kos-mos.pl/": {
    title: "Kos-Mos - optical store",
    description:
      "An eyewear store with brand catalogue, pricing, WooCommerce cart and physical store details.",
  },
};

function RealizacjaCard(props: {
  title: string;
  host: string;
  href: string;
  description: string;
  tech: string[];
  image?: string;
}) {
  const { title, host, href, description, tech, image } = props;
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 shadow-lg shadow-black/20">
      {image ? (
        <div className="relative aspect-[16/10] w-full shrink-0 bg-neutral-900">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 384px"
            unoptimized
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            aria-hidden
          />
          <p className="absolute bottom-3 left-4 right-4 text-xs font-medium uppercase tracking-wider text-white/90">
            {host}
          </p>
        </div>
      ) : (
        <div className="border-b border-white/10 bg-white/[0.04] px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-odart-accent">{host}</p>
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold leading-snug text-white">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">{description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-neutral-300"
            >
              {t}
            </span>
          ))}
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-odart-accent hover:text-orange-300"
        >
          Open website
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </article>
  );
}

export function OdartBlogRealizacjeBody() {
  return (
    <div className="mt-10 space-y-16">
      <div className="prose prose-invert prose-lg max-w-none prose-p:text-neutral-300">
        <p>
          Below is a selection of projects: ODART products, web applications and client websites with a short
          explanation of what each project covers.
        </p>
      </div>

      <section aria-labelledby="realizacje-glowna">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Portfolio</p>
          <h2 id="realizacje-glowna" className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            Selected projects
          </h2>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {ODART_PORTFOLIO_ITEMS.map((item) => {
            const copy = PORTFOLIO_COPY[item.href];
            return (
              <RealizacjaCard
                key={item.href}
                title={copy?.title ?? item.title}
                host={item.host}
                href={item.href}
                description={copy?.description ?? item.description}
                tech={copy?.tech ?? item.tech}
                image={item.image}
              />
            );
          })}
        </div>
      </section>

      <section aria-labelledby="realizacje-klienci">
        <h2 id="realizacje-klienci" className="text-2xl font-bold text-white">
          Client websites
        </h2>
        <p className="mt-3 text-neutral-400">
          Company and industry websites, mostly WordPress / Divi, adjusted to each offer and contact path.
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {ODART_REALIZACJE_KLIENCI.map((item) => {
            const copy = CLIENT_COPY[item.href];
            return (
              <RealizacjaCard
                key={item.href}
                title={copy?.title ?? item.title}
                host={item.host}
                href={item.href}
                description={copy?.description ?? item.description}
                tech={item.tech}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
