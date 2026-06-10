import { ODART_SITE_URL } from "@/lib/odartSite";

const ODART = ODART_SITE_URL.replace(/\/$/, "");

/** Główne zdjęcie profilowe (istnieje na serwerze ODART). */
export const RAFAL_KOWALKOWSKI_PORTRAIT_URL = `${ODART}/wp-content/uploads/rafalkowalkowski.jpg`;

/** Miniatury usług — pliki wgrane do `/wp-content/uploads/` (odart.pl). */
export const RAFAL_SERVICE_IMAGE = {
  informatyka: { src: `${ODART}/wp-content/uploads/informatyka.jpg`, w: 800, h: 427 },
  media: { src: `${ODART}/wp-content/uploads/media.jpg`, w: 800, h: 456 },
  www: { src: `${ODART}/wp-content/uploads/strona.jpg`, w: 800, h: 533 },
  podklad: { src: `${ODART}/wp-content/uploads/nagraniepiosenkizpodkladem.jpg`, w: 800, h: 533 },
  teledysk: { src: `${ODART}/wp-content/uploads/nagraniepiosenkizteledyskiem.jpg`, w: 800, h: 533 },
  prezent: { src: `${ODART}/wp-content/uploads/prezent.jpg`, w: 800, h: 533 },
  tuning: { src: `${ODART}/wp-content/uploads/tuning.jpg`, w: 800, h: 533 },
  wokal: { src: `${ODART}/wp-content/uploads/nagraniewokalu.jpg`, w: 800, h: 533 },
  meskaSesja: { src: `${ODART}/wp-content/uploads/meskasesja.jpg`, w: 800, h: 533 },
  przyjaciolka: { src: `${ODART}/wp-content/uploads/sesjazprzyjaciolka.jpg`, w: 800, h: 533 },
  plener: { src: `${ODART}/wp-content/uploads/2023/01/sesja-portretowa-w-plenerze.jpg`, w: 1200, h: 800 },
  studio: { src: `${ODART}/wp-content/uploads/2023/01/sesja-portretowa-w-studio.jpg`, w: 1200, h: 800 },
  produkt: { src: `${ODART}/wp-content/uploads/sesjaproduktowa.jpg`, w: 800, h: 513 },
  biznes: { src: `${ODART}/wp-content/uploads/sesjabiznesowa.jpg`, w: 800, h: 533 },
  dziecieca: { src: `${ODART}/wp-content/uploads/sesjedzieciece.jpg`, w: 800, h: 457 },
} as const;

/**
 * Pliki z WP były pod rafalkowalkowski.pl — media leży na ODART.
 * Znane przesunięcia ścieżek po migracji.
 */
const UPLOAD_PATH_FIXES: Record<string, string> = {
  "/wp-content/uploads/2024/03/odart-mainx.jpg": "/wp-content/uploads/2023/08/odart-mainx.jpg",
  "/wp-content/uploads/2024/03/Screenshot-at-Feb-13-15-33-37.webp":
    "/wp-content/uploads/2023/08/odart-mainx.jpg",
  "/wp-content/uploads/2024/03/odart._Design_a_professional_and_engaging_visual_layout_for_a_156ff528-c634-401e-bb22-15a4550b7395_3.jpg":
    "/wp-content/uploads/2023/08/odart._Design_a_square_graphic_for_MidJourney_illustrating_the__a975e7a1-e895-402b-a75c-ae761dfdf2a6.jpg",
  "/wp-content/uploads/2023/12/odart._Woman_plays_the_modern_piano_8k_-v_4_a6266d19-ac79-423f-9a49-2b422bb1358a.jpg":
    "/wp-content/uploads/2023/08/odart._Woman_plays_the_modern_piano_8k_-v_4_a6266d19-ac79-423f-9a49-2b422bb1358a.jpg",
  "/wp-content/uploads/2023/12/odart._A_guitarist_is_making_chords_by_looking_at_his_guitar__c43550c8-dc58-48f3-8ae8-20d37cc6374e_1.jpg":
    "/wp-content/uploads/2023/08/odart._A_guitarist_is_making_chords_by_looking_at_his_guitar__c43550c8-dc58-48f3-8ae8-20d37cc6374e_1.jpg",
  "/wp-content/uploads/2023/12/odart._man_from_the_photo_playing_acoustic_guitar_cinematic_r_f8993bae-3919-45be-848f-0c8879ae0c99_1.png":
    "/wp-content/uploads/2023/08/odart._A_guitarist_is_making_chords_by_looking_at_his_guitar__c43550c8-dc58-48f3-8ae8-20d37cc6374e_1.jpg",
  "/wp-content/uploads/2023/12/odart._The_girl_of_the_silver_microphone_-v_4_81e5e8a8-1edb-42fc-9bbb-4d2a4158694e-2.jpg":
    "/wp-content/uploads/nagraniewokalu.jpg",
  "/wp-content/uploads/2023/08/odart._The_girl_of_the_silver_microphone_-v_4_81e5e8a8-1edb-42fc-9bbb-4d2a4158694e-2.jpg":
    "/wp-content/uploads/nagraniewokalu.jpg",
  "/wp-content/uploads/2023/03/golden-ratio-photography07.jpg":
    "/wp-content/uploads/2023/01/3P4A6951-Edit.jpg",
};

/** Kanoniczny URL obrazka z uploads (zawsze host ODART). */
export function rafalMediaUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) {
    try {
      const u = new URL(pathOrUrl);
      if (u.hostname.includes("rafalkowalkowski.pl")) {
        const fixed = UPLOAD_PATH_FIXES[u.pathname] ?? u.pathname;
        return `${ODART}${fixed}`;
      }
      return pathOrUrl;
    } catch {
      return pathOrUrl;
    }
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  const fixed = UPLOAD_PATH_FIXES[path] ?? path;
  return `${ODART}${fixed}`;
}
