/** Nazwa handlowa vs nazwa rejestrowa (CEIDG) na profilach katalogowych. */

export type CatalogClinicNameParts = {
  /** Nagłówek (marka / skrót). */
  displayName: string;
  /** Pełna nazwa z rejestru — pokazywana raz w danych firmy. */
  legalName: string | null;
};

/**
 * Rozdziela nazwy typu: `" CALL OF BEAUTY"LIUDMYLA MISHCHENKO`
 * albo `Firma "KRÓL" Katarzyna Król`.
 */
export function splitCatalogClinicName(raw: string): CatalogClinicNameParts {
  const input = (raw ?? "").trim();
  if (!input) return { displayName: "", legalName: null };

  // „CALL OF BEAUTY”LIUDMYLA… albo Firma „KRÓL” Katarzyna Król
  const quoted = input.match(
    /^(?:[^"„«]*?)["„«]\s*([^"”»]+?)\s*["”»]\s*[,.-]?\s*(.+)$/
  );
  if (quoted) {
    const brand = quoted[1].replace(/\s+/g, " ").trim();
    const legal = quoted[2].replace(/^["„«\s]+|["”»\s]+$/g, "").replace(/\s+/g, " ").trim();
    if (brand && legal && brand.toLowerCase() !== legal.toLowerCase()) {
      return { displayName: brand, legalName: legal };
    }
    if (brand) return { displayName: brand, legalName: null };
  }

  // „BRAND — Imię Nazwisko” / „BRAND - Imię”
  const dash = input.match(/^(.+?)\s+[—–-]\s+(.+)$/);
  if (dash) {
    const left = dash[1].replace(/^["„«\s]+|["”»\s]+$/g, "").trim();
    const right = dash[2].trim();
    if (left && right && right.split(/\s+/).length >= 2) {
      return { displayName: left, legalName: right };
    }
  }

  const cleaned = input.replace(/^["„«\s]+|["”»\s]+$/g, "").replace(/\s+/g, " ").trim();
  return { displayName: cleaned || input, legalName: null };
}
