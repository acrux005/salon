import type { Metadata } from "next";
import { headers } from "next/headers";
import { DM_Sans } from "next/font/google";
import { RandkiLayoutChrome } from "@/components/randki/RandkiLayoutChrome";
import { getRandkiSiteUrl, isRandkiPortalHost } from "@/lib/randkiHost";
import { getDayPhase, dayPhaseClass } from "@/lib/randki/dayRhythm";
import { listLikesReceived } from "@/lib/randki/matching";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import "./randki-theme.css";

const randkiFont = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-randki",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  const siteUrl = getRandkiSiteUrl(host);
  if (isRandkiPortalHost(host)) {
    return {
      themeColor: "#e11d48",
      metadataBase: new URL(siteUrl),
      title: { default: "Randki Odart — Poznaj zanim ocenisz", template: "%s | Randki Odart" },
      description: "Jedna osoba dziennie. Najpierw głos i prawdziwy moment — potem zdjęcie. Mniej swipe, więcej chemii.",
      openGraph: {
        title: "Randki Odart",
        description: "Portal randkowy z dopasowaniem i czatem.",
        url: siteUrl,
        siteName: "Randki Odart",
        locale: "pl_PL",
        type: "website",
      },
      icons: { icon: "/randki-icon.svg" },
      manifest: "/randki-manifest.json",
      appleWebApp: { capable: true, title: "Randki Odart" },
    };
  }
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "Randki Odart — Poznaj zanim ocenisz", template: "%s | Randki Odart" },
    description: "Jedna osoba dziennie. Najpierw poznajesz człowieka — głos, moment, rozmowa. Potem zdjęcie.",
    themeColor: "#e11d48",
  };
}

export default async function RandkiLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host") ?? "";
  const isRandkiPortal = isRandkiPortalHost(host);

  const session = await getServerSession(authOptions);
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  const isLoggedIn = (session?.user as { role?: string })?.role === RANDKI_ROLE && accountId;

  let likesCount = 0;
  if (isLoggedIn && accountId) {
    likesCount = await listLikesReceived(accountId).then((l) => l.length);
  }

  const dayPhase = getDayPhase();

  return (
    <div
      className={`randki-portal ${dayPhaseClass(dayPhase)} ${randkiFont.variable} flex min-h-dvh flex-col font-[family-name:var(--font-randki)] antialiased`}
    >
      <RandkiLayoutChrome isRandkiPortal={isRandkiPortal} isLoggedInServer={!!isLoggedIn} likesCount={likesCount}>
        {children}
      </RandkiLayoutChrome>
    </div>
  );
}
