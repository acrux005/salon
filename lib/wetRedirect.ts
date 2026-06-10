import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { wetPublicHref } from "@/lib/wetPaths";

/** Publiczna ścieżka redirectu zależna od hosta. */
export async function getWetRedirectPath(path: string): Promise<string> {
  const host = (await headers()).get("host") ?? "";
  return wetPublicHref(path, host);
}

/** redirect() z ścieżką dopasowaną do hosta (weterynaria.odart.pl → /panel, salon → /wet/panel). */
export async function wetRedirect(path: string): Promise<never> {
  redirect(await getWetRedirectPath(path));
}
