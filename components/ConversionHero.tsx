"use client";

import Link from "next/link";
import { ReactNode } from "react";

export interface PrimaryCta {
  label: string;
  href: string;
}

export interface SecondaryBadge {
  icon?: ReactNode;
  text: string;
}

export interface FloatingCard {
  title: string;
  subtitle: string;
  avatar?: string;
}

export interface ConversionHeroProps {
  title: string;
  highlight: string;
  description: string;
  primaryCta: PrimaryCta;
  secondaryBadges: SecondaryBadge[];
  imageSrc: string;
  floatingCard?: FloatingCard;
}

/**
 * Reusable conversion hero for multiple industries (beauty, car rental, medical, hotel, IT).
 * Desktop: 2 columns, left=text centered, right=image with overlapping elements.
 * Mobile: stacked, image below content.
 */
export function ConversionHero({
  title,
  highlight,
  description,
  primaryCta,
  secondaryBadges,
  imageSrc,
  floatingCard,
}: ConversionHeroProps) {
  const parts = title.split(highlight);
  const hasHighlight = parts.length > 1;

  const ctaClasses =
    "inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base border border-beauty-pink-400 bg-beauty-pink-100/80 text-beauty-charcoal hover:bg-beauty-pink-200/80 transition-colors focus:outline-none focus:ring-2 focus:ring-beauty-pink-400/40 focus:ring-offset-2 w-fit";

  return (
    <section className="relative w-full min-h-[500px] sm:min-h-[600px] lg:min-h-[650px] overflow-hidden bg-gradient-to-b from-beauty-hero via-beauty-pink-100/50 to-beauty-hero-light">
      {/* Decorative sparkles */}
      <div className="absolute top-20 right-[15%] w-6 h-6 rounded-sm opacity-80 rotate-[22deg] bg-beauty-pink-400" />
      <div className="absolute top-32 right-[20%] w-4 h-4 rounded-sm opacity-70 bg-beauty-pink-500" />
      <div className="absolute bottom-48 left-[55%] w-6 h-6 rounded-sm opacity-80 bg-beauty-pink-400" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          {/* Left column - Text content, vertically centered */}
          <div className="flex flex-col justify-center gap-8 w-full max-w-xl lg:max-w-2xl order-2 lg:order-1">
            <div className="flex flex-col gap-5">
              <h1 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight tracking-tight text-beauty-charcoal">
                {hasHighlight ? (
                  <>
                    {parts[0]}
                    <span className="bg-gradient-to-r from-beauty-pink-400 to-beauty-pink-500 bg-clip-text text-transparent font-semibold">
                      {highlight}
                    </span>
                    {parts[1]}
                  </>
                ) : (
                  title
                )}
              </h1>
              <p className="font-sans text-base sm:text-lg text-beauty-charcoal-muted leading-relaxed max-w-lg">
                {description}
              </p>
              {primaryCta.href.startsWith("http") ? (
                <a
                  href={primaryCta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ctaClasses}
                >
                  {primaryCta.label}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </a>
              ) : (
                <Link href={primaryCta.href} className={ctaClasses}>
                  {primaryCta.label}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Trust badges - rounded pills, Figma style */}
            {secondaryBadges.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {secondaryBadges.map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-4 py-3 rounded-full border border-beauty-pink-400 bg-white/70 backdrop-blur-sm"
                  >
                    {badge.icon && (
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border border-beauty-pink-400 bg-white text-beauty-pink-400">
                        {badge.icon}
                      </div>
                    )}
                    <span className="font-sans text-sm text-beauty-charcoal">{badge.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column - Image with overlapping elements */}
          <div className="relative w-full max-w-xl lg:max-w-2xl order-1 lg:order-2">
            <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[5/5]">
              {/* Background shape - overlapping rounded circle */}
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-beauty-pink-100 to-beauty-hero -z-10" />

              {/* Main image - soft rounded */}
              <div className="relative w-full h-full rounded-[1.75rem] overflow-hidden bg-beauty-pink-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageSrc} alt="" className="h-full w-full object-cover object-center" />
              </div>

              {/* Floating card - bottom right, Seraphina style */}
              {floatingCard && (
                <div
                  className={`absolute bottom-4 right-4 flex flex-col items-center gap-2 ${floatingCard.avatar ? "" : "p-4 rounded-2xl border border-beauty-charcoal/20 bg-white/95 backdrop-blur-md"}`}
                >
                  {floatingCard.avatar ? (
                    <>
                      <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-beauty-charcoal bg-beauty-pink-300">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={floatingCard.avatar} alt="" className="h-full w-full object-cover" />
                      </div>
                      <span className="font-sans font-semibold text-beauty-charcoal">{floatingCard.title}</span>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1 text-center">
                      <p className="font-sans font-semibold text-beauty-charcoal">{floatingCard.title}</p>
                      {floatingCard.subtitle && (
                        <p className="text-sm text-beauty-charcoal-muted">{floatingCard.subtitle}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------
   DEMO USAGE - Sample content for different industries
   --------------------------------------------

   // Beauty
   <ConversionHero {...CONVERSION_HERO_DEMOS.beauty} />

   // Car rental
   <ConversionHero {...CONVERSION_HERO_DEMOS.carRental} />

   // Medical
   <ConversionHero {...CONVERSION_HERO_DEMOS.medical} />

   // Hotel
   <ConversionHero {...CONVERSION_HERO_DEMOS.hotel} />

   // IT Services
   <ConversionHero {...CONVERSION_HERO_DEMOS.itServices} />

   -------------------------------------------- */

export const CONVERSION_HERO_DEMOS = {
  beauty: {
    title: "Discover Your Signature Glow",
    highlight: "Signature Glow",
    description:
      "Experience the transformative power of GlowGenics and unveil your signature glow today.",
    primaryCta: { label: "Shop now", href: "/shop" },
    secondaryBadges: [
      { text: "Free Shipping / On order above Rs.499" },
      { text: "Easy Returns / 15 Days refund Policy" },
      { text: "100% Authentic / Sourced Directly" },
    ],
    imageSrc: "/placeholder-hero.jpg",
    floatingCard: {
      title: "Trending category",
      subtitle: "Beauty",
      avatar: undefined,
    },
  },
  carRental: {
    title: "Drive Your Next Adventure",
    highlight: "Adventure",
    description:
      "Rent premium vehicles at competitive rates. Flexible pick-up, 24/7 support, no hidden fees.",
    primaryCta: { label: "Browse cars", href: "/cars" },
    secondaryBadges: [
      { text: "Free cancellation" },
      { text: "Unlimited mileage" },
      { text: "Full insurance included" },
    ],
    imageSrc: "/placeholder-hero.jpg",
    floatingCard: {
      title: "Most popular",
      subtitle: "SUV category",
    },
  },
  medical: {
    title: "Your Health Our Priority",
    highlight: "Health",
    description:
      "Book appointments online. Board-certified specialists, modern facilities, and compassionate care.",
    primaryCta: { label: "Book appointment", href: "/book" },
    secondaryBadges: [
      { text: "Same-day appointments" },
      { text: "Telehealth available" },
      { text: "Insurance accepted" },
    ],
    imageSrc: "/placeholder-hero.jpg",
    floatingCard: { title: "Dr. Sarah Chen", subtitle: "General Practice" },
  },
  hotel: {
    title: "Stay Where Memories Are Made",
    highlight: "Memories",
    description:
      "Luxurious rooms, stunning views, and exceptional service. Book direct for the best rates.",
    primaryCta: { label: "Check availability", href: "/rooms" },
    secondaryBadges: [
      { text: "Best price guarantee" },
      { text: "Free breakfast" },
      { text: "Late checkout" },
    ],
    imageSrc: "/placeholder-hero.jpg",
    floatingCard: { title: "Guest favorite", subtitle: "Ocean view suite" },
  },
  itServices: {
    title: "Scale Your Business With Confidence",
    highlight: "Confidence",
    description:
      "Cloud infrastructure, DevOps, and 24/7 monitoring. Trusted by startups and enterprises.",
    primaryCta: { label: "Start free trial", href: "/signup" },
    secondaryBadges: [
      { text: "99.9% uptime SLA" },
      { text: "Dedicated support" },
      { text: "SOC 2 compliant" },
    ],
    imageSrc: "/placeholder-hero.jpg",
    floatingCard: { title: "Featured case study", subtitle: "Fintech scale-up" },
  },
} as const;
