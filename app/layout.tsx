import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import { CartProvider } from "@/components/CartContext";
import { isOdartMainHost, ODART_SITE_URL } from "@/lib/odartSite";
import { getGabinetSiteUrl, isGabinetPortalHost } from "@/lib/gabinetPlatform/host";
import { getGabinetVerticalConfigForHost } from "@/lib/gabinetPlatform/verticals";
import { getWetSiteUrl, isWetPortalHost } from "@/lib/wetHost";
import { getRandkiSiteUrl, isRandkiPortalHost } from "@/lib/randkiHost";
import "./globals.css";

const ODART_GA_ID = "G-MQGY5B7WXB";

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const SALON_SITE_URL = "https://salon.odart.pl";

const SALON_METADATA: Metadata = {
  metadataBase: new URL(SALON_SITE_URL),
  title: {
    default: "Salon Odart — zabiegi kosmetyczne i portal Zabiegi Odart",
    template: "%s | Salon Odart",
  },
  description:
    "Zabiegi kosmetyczne w Polsce: portal Zabiegi Odart pomaga dobrać terapię lub gabinet, przeglądać usługi i umówić wizytę online.",
  openGraph: {
    siteName: "Salon Odart",
    locale: "pl_PL",
    url: SALON_SITE_URL,
    images: [
      {
        url: `${SALON_SITE_URL}/portal/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Zabiegi Odart — portal kosmetyczny",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

function buildGabinetMetadata(host: string): Metadata {
  const siteUrl = getGabinetSiteUrl(host);
  const vertical = getGabinetVerticalConfigForHost(host);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${vertical.brandName} — portal dla gabinetów`,
      template: `%s | ${vertical.brandName}`,
    },
    description: vertical.heroSubtitle,
    openGraph: {
      siteName: vertical.brandName,
      locale: "pl_PL",
      url: siteUrl,
      type: "website",
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: siteUrl },
  };
}

function buildWetMetadata(host: string): Metadata {
  const siteUrl = getWetSiteUrl(host);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "VetHarmonogram — portal dla przychodni weterynaryjnych",
      template: "%s | VetHarmonogram",
    },
    description:
      "Wizyty, kalendarz, pacjenci, wiadomości i przypomnienia o szczepieniach. System dla przychodni weterynaryjnych w Polsce.",
    openGraph: {
      siteName: "VetHarmonogram",
      locale: "pl_PL",
      url: siteUrl,
      type: "website",
      images: [
        {
          url: `${siteUrl}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: "VetHarmonogram — system dla przychodni weterynaryjnych",
        },
      ],
    },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: siteUrl },
  };
}

const ODART_METADATA: Metadata = {
  metadataBase: new URL(ODART_SITE_URL),
  title: {
    default: "ODART — Aplikacje webowe i strony internetowe | Kołobrzeg",
    template: "%s | ODART",
  },
  description:
    "Aplikacje webowe, strony WWW, WordPress, SEO i wsparcie IT. Ostry Dyżur Artystyczny — Kołobrzeg i cała Polska.",
  openGraph: {
    siteName: "ODART",
    locale: "pl_PL",
    url: ODART_SITE_URL,
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

function buildRandkiMetadata(host: string): Metadata {
  const siteUrl = getRandkiSiteUrl(host);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "Randki Odart — poznaj kogoś blisko Ciebie", template: "%s | Randki Odart" },
    description: "Portal randkowy z dopasowaniem i czatem. Poznawaj osoby w swoim mieście.",
    openGraph: { siteName: "Randki Odart", locale: "pl_PL", url: siteUrl, type: "website" },
    twitter: { card: "summary_large_image" },
    alternates: { canonical: siteUrl },
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (isRandkiPortalHost(host)) return buildRandkiMetadata(host);
  if (isWetPortalHost(host)) return buildWetMetadata(host);
  if (isGabinetPortalHost(host)) return buildGabinetMetadata(host);
  if (isOdartMainHost(host)) return ODART_METADATA;
  return SALON_METADATA;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = (await headers()).get("host") ?? "";
  const isZamow = host.includes("zamow.odart.pl");
  const isWet = isWetPortalHost(host);
  const isRandki = isRandkiPortalHost(host);
  const isGabinet = isGabinetPortalHost(host);
  const isOdartSite = isOdartMainHost(host);
  const gabBrand = isGabinet ? getGabinetVerticalConfigForHost(host).brandName : "GabinetHarmonogram";
  const hostName = host.split(":")[0]?.toLowerCase() ?? "";
  const odartGa = isOdartSite || hostName === "salon.odart.pl";
  const htmlBg = isZamow
    ? "bg-zamow-cream"
    : isRandki
      ? "bg-rose-50"
      : isWet
        ? "bg-wet-mint"
        : isGabinet
          ? "bg-sky-50"
          : isOdartSite
            ? "bg-black"
            : "bg-white";
  const bodyClass = isZamow
    ? "bg-zamow-cream overscroll-y-contain text-stone-900"
    : isRandki
      ? "bg-rose-50/40 text-randki-navy antialiased"
      : isWet
        ? "bg-wet-mint text-wet-navy antialiased"
        : isGabinet
          ? "bg-sky-50/30 text-gab-navy antialiased"
          : isOdartSite
            ? "bg-black text-neutral-200 overflow-x-hidden"
            : "bg-white text-stone-900";
  return (
    <html lang="pl" className={`${sans.variable} ${htmlBg}`}>
      <head>
        <link
          rel="icon"
          type={isZamow ? "image/svg+xml" : "image/png"}
          sizes="32x32"
          href={isZamow ? "/favicon-zamow.svg" : "/favicon.ico"}
        />
        <meta
          name="theme-color"
          content={
            isZamow ? "#ea580c" : isRandki ? "#e11d48" : isWet ? "#0d9488" : isGabinet ? "#0ea5e9" : isOdartSite ? "#000000" : "#D86786"
          }
        />
        <meta
          name="apple-mobile-web-app-title"
          content={
            isZamow ? "Zamów" : isRandki ? "Randki Odart" : isWet ? "VetHarmonogram" : isGabinet ? gabBrand : isOdartSite ? "ODART" : "Salon Odart"
          }
        />
        {!isZamow && !isWet && <link rel="manifest" href="/manifest.json" />}
      </head>
      <body className={`min-h-dvh font-sans antialiased ${bodyClass}`}>
        {odartGa ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ODART_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ODART_GA_ID}');
              `}
            </Script>
          </>
        ) : null}
        <Providers>
          {isZamow ? (
            <CartProvider>{children}</CartProvider>
          ) : (
            children
          )}
        </Providers>
      </body>
    </html>
  );
}
