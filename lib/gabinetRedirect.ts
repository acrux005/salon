import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { gabinetPublicHref } from "@/lib/gabinetPlatform/paths";

export async function getGabinetRedirectPath(path: string): Promise<string> {
  const host = (await headers()).get("host") ?? "";
  return gabinetPublicHref(path, host);
}

export async function gabinetRedirect(path: string): Promise<never> {
  redirect(await getGabinetRedirectPath(path));
}
