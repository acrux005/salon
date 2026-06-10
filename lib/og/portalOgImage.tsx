import { ImageResponse } from "next/og";
import { loadGoogleFont } from "@/lib/og/googleFont";

export const OG_SIZE = { width: 1200, height: 630 } as const;

type OgCardProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Tekst użyty do subsetu fontu (żeby payload TTF był mały). */
  fontSubset: string;
  accent?: string;
  footerLabel?: string;
  background?: string;
};

export async function portalOgImageResponse({
  eyebrow,
  title,
  subtitle,
  fontSubset,
  accent = "#DE1F40",
  footerLabel = "salon.odart.pl",
  background = "linear-gradient(135deg, #ffffff 0%, #fff8fb 45%, #f4f4f8 100%)",
}: OgCardProps) {
  const subset = `${fontSubset}${subtitle ?? ""}${footerLabel}·—`;
  const inter = await loadGoogleFont(600, subset);
  const fonts = inter
    ? [{ name: "Inter", data: inter, style: "normal" as const, weight: 600 as const }]
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background,
          color: "#1F1A1C",
          fontFamily: fonts.length ? "Inter" : "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "inline-flex",
              alignSelf: "flex-start",
              padding: "10px 16px",
              borderRadius: 999,
              background: `${accent}1a`,
              color: accent,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 0.6,
              textTransform: "uppercase" as const,
            }}
          >
            {eyebrow}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 980 }}>
            <div style={{ fontSize: 64, lineHeight: 1.05, fontWeight: 600, letterSpacing: -1.2 }}>{title}</div>
            {subtitle ? (
              <div style={{ fontSize: 30, lineHeight: 1.35, color: "#6F5E64", fontWeight: 600 }}>{subtitle}</div>
            ) : null}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22, color: "#8A7F84", fontWeight: 600 }}>{footerLabel}</div>
          <div
            style={{
              width: 160,
              height: 160,
              borderRadius: 40,
              background: `linear-gradient(145deg, ${accent}, ${accent}cc)`,
              opacity: 0.95,
            }}
          />
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      ...(fonts.length ? { fonts } : {}),
    }
  );
}
