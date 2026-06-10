function extractFirstTtfUrl(cssText: string): string | undefined {
  const m = cssText.match(/url\((https:\/\/[^)]+?\.ttf[^)]*)\)/i);
  return m?.[1];
}

/** Pobiera TTF z Google Fonts (subset pod konkretny tekst) do `next/og`. */
export async function loadGoogleFont(weight: number, text: string): Promise<ArrayBuffer | null> {
  const family = "Inter";
  const cssUrl =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}` +
    `&display=swap&text=${encodeURIComponent(text)}`;

  const cssRes = await fetch(cssUrl, { cache: "no-store" });
  if (!cssRes.ok) return null;
  const cssText = await cssRes.text();
  const fontUrl = extractFirstTtfUrl(cssText);
  if (!fontUrl) return null;

  const fontRes = await fetch(fontUrl, { cache: "no-store" });
  if (!fontRes.ok) return null;
  return fontRes.arrayBuffer();
}
