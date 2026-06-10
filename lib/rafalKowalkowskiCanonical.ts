import { headers } from "next/headers";
import {
  RAFAL_CANONICAL_HOST,
  rafalCanonicalFromInternal,
} from "@/lib/rafalKowalkowskiSeo";
import { rafalPublicPathCanonicalUrl } from "@/lib/rafalKowalkowskiLegacyRoutes";

/** Kanoniczny URL sekcji Rafała — zawsze rafalkowalkowski.pl (legacy w pasku adresu). */
export async function canonicalForRafalSection(internalPath: string): Promise<string> {
  const hdr = await headers();
  const proto = hdr.get("x-forwarded-proto") ?? "https";
  const legacyPublic = hdr.get("x-rafal-public-path");
  if (legacyPublic) {
    return rafalPublicPathCanonicalUrl(legacyPublic, RAFAL_CANONICAL_HOST, proto);
  }
  return rafalCanonicalFromInternal(internalPath);
}
