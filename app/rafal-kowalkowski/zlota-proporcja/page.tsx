import { redirect } from "next/navigation";
import { RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_PATH } from "@/lib/rafalKowalkowskiGallery";

export default function RafalZlotaProporcjaRedirect() {
  redirect(RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_PATH);
}
