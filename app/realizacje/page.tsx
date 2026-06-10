import { headers } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";

/** Kanoniczny adres wpisu portfolio — /realizacje (linki z WP) → /blog/realizacje */
export default async function RealizacjeRedirectPage() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  permanentRedirect("/blog/realizacje");
}
