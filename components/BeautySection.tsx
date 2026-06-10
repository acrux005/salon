"use client";

import Link from "next/link";

interface Card {
  title: string;
  description?: string;
  href: string;
  image?: string;
  cta?: string;
}

interface BeautySectionProps {
  heading?: string;
  subheading?: string;
  cards: Card[];
  columns?: 2 | 3 | 4;
}

/**
 * Responsive section component based on Beauty Website Landing Page (Figma node 30:18799).
 * Uses semantic spacing and Tailwind layout utilities.
 */
export function BeautySection({
  heading = "Odkryj kategorie",
  subheading,
  cards,
  columns = 3,
}: BeautySectionProps) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  }[columns];

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-labelledby={heading ? "section-heading" : undefined}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {(heading || subheading) && (
          <header className="mb-8 sm:mb-12 lg:mb-16 text-center max-w-2xl mx-auto">
            {heading && (
              <h2
                id="section-heading"
                className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-beauty-charcoal mb-3 sm:mb-4"
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="text-base sm:text-lg text-beauty-charcoal-muted leading-relaxed">
                {subheading}
              </p>
            )}
          </header>
        )}

        <div className={`grid gap-6 sm:gap-8 ${gridCols}`}>
          {cards.map(({ title, description, href, image, cta }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-2xl overflow-hidden border border-beauty-pink-200/60 bg-white transition-all duration-300 hover:border-beauty-pink-400/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-beauty-pink-400/40 focus:ring-offset-2"
            >
              {image ? (
                <div className="relative aspect-[4/3] overflow-hidden bg-beauty-pink-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div
                  className="aspect-[4/3] bg-gradient-to-br from-beauty-pink-100 to-beauty-pink-200 flex items-center justify-center"
                  aria-hidden
                >
                  <span className="text-4xl opacity-40">✦</span>
                </div>
              )}
              <div className="flex flex-1 flex-col p-5 sm:p-6 gap-3">
                <h3 className="font-sans font-semibold text-lg text-beauty-charcoal group-hover:text-beauty-pink-500 transition-colors">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-beauty-charcoal-muted line-clamp-2 flex-1">
                    {description}
                  </p>
                )}
                {cta && (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-beauty-pink-400 group-hover:text-beauty-pink-500 transition-colors">
                    {cta}
                    <span aria-hidden>→</span>
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
