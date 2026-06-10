import { portalOgImageResponse } from "@/lib/og/portalOgImage";

export const alt = "Zabieg kosmetyczny — Polska | Zabiegi Odart";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function titleFromSlug(slug: string): string {
  const cleaned = slug.replace(/-+$/g, "").replace(/[_-]+/g, " ").trim();
  if (!cleaned) return "Zabieg kosmetyczny";
  return cleaned.replace(/(^|\s)\S/g, (m) => m.toUpperCase());
}

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const label = titleFromSlug(slug);

  return portalOgImageResponse({
    eyebrow: "Zabiegi Odart",
    title: label,
    subtitle: "Polska — ceny, czas trwania i gabinety oferujące zabieg",
    fontSubset: `${label}ACĆĘŁŃÓŚŹŻąćęłńóśźż`,
  });
}
