import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isGabinetPortalHost } from "@/lib/gabinetPlatform/host";

export default async function AgnieszkaCzerwinskaZalogaRedirectPage() {
  const host = (await headers()).get("host") ?? "";
  redirect(isGabinetPortalHost(host) ? "/a-dent-kolobrzeg" : "/gabinet/a-dent-kolobrzeg");
}
