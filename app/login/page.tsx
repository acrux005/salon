import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isWetPortalHost } from "@/lib/wetHost";
import { isGabinetPortalHost } from "@/lib/gabinetPlatform/host";
import { isRandkiPortalHost } from "@/lib/randkiHost";
import { getRandkiLoginPublicPath } from "@/lib/randkiPaths";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Wspólny signIn NextAuth: wet → /wet/login, gabinet → /gabinet/login, salon → /portal/login. */
export default async function LoginRouterPage({ searchParams }: PageProps) {
  const host = (await headers()).get("host") ?? "";
  if (isGabinetPortalHost(host)) {
    redirect("/gabinet/login");
  }
  if (isWetPortalHost(host)) {
    redirect("/wet/login");
  }
  if (isRandkiPortalHost(host)) {
    const sp = await searchParams;
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) {
      if (typeof v === "string") q.set(k, v);
      else if (Array.isArray(v)) v.forEach((x) => q.append(k, x));
    }
    const login = getRandkiLoginPublicPath(host);
    redirect(q.toString() ? `${login}?${q}` : login);
  }
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === "string") q.set(k, v);
    else if (Array.isArray(v)) v.forEach((x) => q.append(k, x));
  }
  const dest = q.toString() ? `/portal/login?${q}` : "/portal/login";
  redirect(dest);
}
