/**
 * Publiczne URL-e z WordPress (GSC) ↔ wewnętrzne trasy Next `/rafal-kowalkowski/*`.
 * Na hoście rafalkowalkowski.pl w pasku adresu zostają ścieżki legacy.
 */

import { RAFAL_KOWALKOWSKI_PROFILE_PATH } from "@/lib/rafalKowalkowskiGallery";

const PROFILE = RAFAL_KOWALKOWSKI_PROFILE_PATH;

/** Slugi WooCommerce — w GSC pod `/produkt/{slug}/`. */
export const RAFAL_WC_PRODUCT_SLUGS = new Set([
  "uslugi-informatyczne-kolobrzeg",
  "obsluga-mediow-spolecznosciowych",
  "budowa-strony-internetowej",
  "nagranie-piosenki-z-podkladem",
  "nagranie-piosenki-z-teledyskiem",
  "prezent-wokalny-na-slub-lub-urodziny",
  "tuning-wokalu",
  "nagranie-wokalu",
  "meska-sesja-portretowa",
  "sesja-fotograficzna-z-przyjaciolka",
  "sesja-portretowa-plener",
  "sesja-produktowa",
  "sesja-biznesowa",
  "sesja-dziecieca",
]);

/** Wpisy i podstrony pod rootem (nie `/produkt/`). */
export const RAFAL_ROOT_PAGE_SLUGS = new Set([
  "nauka-gry-na-gitarze-kolobrzeg",
  "zajecia-wokalne-kolobrzeg",
  "zloty-podzial-w-fotografii",
  "zlota-proporcja-przyklady",
  "kompozycja-w-fotografii",
  "kompozycja-trojpodzial",
  "jak-zaczela-sie-moja-przygoda-z-fotografia",
  "teledyski",
  "muzyka-autorska",
  "gatunki-muzyki",
  "tworzenie-stron-sesje-fotograficzne-muzyka-video",
  "uslugi",
  "galeria",
  "demo",
]);

/** Stare ścieżki WP → wewnętrzna trasa (301 na kanoniczny URL publiczny). */
const LEGACY_REDIRECT_TO_INTERNAL: Record<string, string> = {
  "/zlota-proporcja": `${PROFILE}/zlota-proporcja-przyklady`,
  "/kompozycja-w-fotografii-trojpodzial": `${PROFILE}/kompozycja-trojpodzial`,
  "/galeria-2": `${PROFILE}/galeria`,
};

/** Wpisy / strony WP bez odpowiednika — przekierowanie publiczne (GSC). */
const LEGACY_PUBLIC_REDIRECT: Record<string, string> = {
  "/szansa-na-sukces-odcinek-5-zespol-piersi": "/blog",
  "/cart": "/kontakt",
  "/booking-elementor": "/kontakt",
  "/blog-masonry-elementor": "/blog",
};

/**
 * Kategorie WooCommerce (`/product-category/…`) → filtr siatki usług (`kategoria=`).
 * @see OdartRafalKowalkowskiServiceGrid
 */
export const RAFAL_WC_CATEGORY_TO_FILTER: Record<string, string> = {
  informatyka: "informatyka",
  "sesje-fotograficzne": "foto",
  media: "media",
  "media-spolecznosciowe": "media",
  nagrania: "nagrania",
  strony: "strony",
  "strony-internetowe": "strony",
};

/** Stare slugi produktów WooCommerce → istniejąca podstrona Next (publiczny URL z GSC zostaje). */
const RAFAL_LEGACY_PRODUCT_SLUGS: Record<string, string> = {
  "sesja-fotograficzna-dla-mamy": "sesja-dziecieca",
};

/**
 * Alias GSC → ta sama treść co inna ścieżka; `publicPath` = canonical w pasku adresu.
 * `search` — query dla filtra (np. kategoria usług).
 */
const RAFAL_LEGACY_ALIASES: Record<string, { internal: string; publicPath: string; search?: string }> = {
  "/sklep": { internal: `${PROFILE}/uslugi`, publicPath: "/sklep" },
  "/filmowanie-kolobrzeg-koszalin-szczecin-zachodniopomorskie": {
    internal: `${PROFILE}/teledyski`,
    publicPath: "/filmowanie-kolobrzeg-koszalin-szczecin-zachodniopomorskie",
  },
  "/zlota_proporcja": {
    internal: `${PROFILE}/zlota-proporcja-przyklady`,
    publicPath: "/zlota_proporcja",
  },
  "/muzyka-autorska-rafal-kowalkowski-kolobrzeg": {
    internal: `${PROFILE}/muzyka-autorska`,
    publicPath: "/muzyka-autorska-rafal-kowalkowski-kolobrzeg",
  },
  "/product-category/informatyka": {
    internal: `${PROFILE}/uslugi`,
    publicPath: "/product-category/informatyka",
    search: "kategoria=informatyka",
  },
  "/product-category/sesje-fotograficzne": {
    internal: `${PROFILE}/uslugi`,
    publicPath: "/product-category/sesje-fotograficzne",
    search: "kategoria=foto",
  },
  "/about-me-elementor": {
    internal: PROFILE,
    publicPath: "/about-me-elementor",
  },
  "/showcase-with-thumbnails-elementor": {
    internal: `${PROFILE}/galeria`,
    publicPath: "/showcase-with-thumbnails-elementor",
  },
  "/project-items-elementor": {
    internal: `${PROFILE}/galeria`,
    publicPath: "/project-items-elementor",
  },
  "/product-category/animacja": {
    internal: `${PROFILE}/teledyski`,
    publicPath: "/product-category/animacja",
  },
};

export function normalizeLegacyPathname(pathname: string): string {
  let p = pathname.split("?")[0]?.split("#")[0] ?? "/";
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}

/** Wewnętrzna ścieżka Next z publicznej ścieżki legacy (rewrite). */
export function legacyPathToInternal(pathname: string): string | null {
  const path = normalizeLegacyPathname(pathname);

  if (path === "/" || path === "") return PROFILE;

  if (path === "/kontakt" || path === "/blog") return null;

  const publicRedirect = LEGACY_PUBLIC_REDIRECT[path];
  if (publicRedirect) return `REDIRECT_PUBLIC:${publicRedirect}`;

  const alias = RAFAL_LEGACY_ALIASES[path];
  if (alias) {
    return `REWRITE:${alias.internal}|${alias.publicPath}|${alias.search ?? ""}`;
  }

  if (path.startsWith("/product-category/")) {
    const wcSlug = path.slice("/product-category/".length);
    const filter = RAFAL_WC_CATEGORY_TO_FILTER[wcSlug];
    if (filter) {
      return `REWRITE:${PROFILE}/uslugi|${path}|kategoria=${filter}`;
    }
  }

  const redirectTarget = LEGACY_REDIRECT_TO_INTERNAL[path];
  if (redirectTarget) return `REDIRECT:${redirectTarget}`;

  if (path.startsWith("/produkt/")) {
    const slug = path.slice("/produkt/".length);
    if (!slug) return null;
    const mapped = RAFAL_LEGACY_PRODUCT_SLUGS[slug];
    if (mapped) return `REWRITE:${PROFILE}/${mapped}|${path}|`;
    if (RAFAL_WC_PRODUCT_SLUGS.has(slug)) return `${PROFILE}/${slug}`;
    return null;
  }

  const slug = path.startsWith("/") ? path.slice(1) : path;
  if (!slug || slug.includes("/")) return null;

  const legacyProduct = RAFAL_LEGACY_PRODUCT_SLUGS[slug];
  if (legacyProduct) {
    return `REWRITE:${PROFILE}/${legacyProduct}|/${slug}|`;
  }

  if (RAFAL_ROOT_PAGE_SLUGS.has(slug)) return `${PROFILE}/${slug}`;
  if (RAFAL_WC_PRODUCT_SLUGS.has(slug)) return `${PROFILE}/${slug}`;

  if (path === "/kontakt" || path === "/blog") return path;

  return null;
}

/** Publiczna ścieżka legacy z wewnętrznej (canonical / linki w menu). */
export function internalPathToLegacyPublic(internalPath: string): string | null {
  const path = normalizeLegacyPathname(internalPath);
  if (path === "/kontakt" || path === "/blog") return path;
  if (path === PROFILE) return "/";

  if (!path.startsWith(`${PROFILE}/`)) return null;
  const slug = path.slice(`${PROFILE}/`.length);
  if (!slug) return "/";

  if (RAFAL_WC_PRODUCT_SLUGS.has(slug)) return `/produkt/${slug}`;
  if (RAFAL_ROOT_PAGE_SLUGS.has(slug)) return `/${slug}`;
  return null;
}

/** Kanoniczny URL z publicznej ścieżki (jak w GSC). */
export function rafalPublicPathCanonicalUrl(publicPath: string, host: string, proto = "https"): string {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "rafalkowalkowski.pl";
  const normalized = normalizeLegacyPathname(publicPath);
  const withSlash = normalized === "/" ? "/" : `${normalized}/`;
  return `${proto}://${hostname}${withSlash}`;
}

/** Kanoniczny URL strony (z końcowym `/`, jak w GSC). */
export function rafalPageCanonicalUrl(
  internalPath: string,
  host: string,
  proto = "https",
): string {
  const legacy = internalPathToLegacyPublic(internalPath);
  const publicPath = legacy ?? internalPath;
  return rafalPublicPathCanonicalUrl(publicPath, host, proto);
}

/** Publiczny href do użycia w `<Link href>` na domenie Rafała. */
export function rafalPublicHref(internalPath: string): string {
  return internalPathToLegacyPublic(internalPath) ?? internalPath;
}

/** Czy na rafalkowalkowski.pl należy przekierować ze ścieżki `/rafal-kowalkowski/*` na legacy. */
export function rafalInternalToLegacyRedirect(pathname: string): string | null {
  const path = normalizeLegacyPathname(pathname);
  if (path === PROFILE || path.startsWith(`${PROFILE}/`)) {
    const legacy = internalPathToLegacyPublic(path);
    if (legacy && legacy !== path) return legacy;
  }
  return null;
}
