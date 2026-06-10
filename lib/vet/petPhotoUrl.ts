export function resolvePetPhotoUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}
