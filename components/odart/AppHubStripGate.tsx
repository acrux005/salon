import { headers } from "next/headers";
import { isOdartMainHost } from "@/lib/odartSite";
import { AppHubStrip } from "@/components/odart/AppHubStrip";
import type { OdartLocale } from "@/components/odart/odartNav";

/** Pasek aplikacji tylko na domenie marketingowej odart.pl (nie na salon.odart.pl). */
export async function AppHubStripGate({ locale = "pl" }: { locale?: OdartLocale }) {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) return null;
  return <AppHubStrip locale={locale} />;
}
